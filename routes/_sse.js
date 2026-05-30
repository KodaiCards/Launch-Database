// routes/_sse.js — Shared Server-Sent Events broadcast module.
//
// Provides a single persistent SSE endpoint at GET /api/events/stream
// that all admin/team portals subscribe to for real-time updates.
// Splice Matrix has its own project-scoped SSE in routes/splice.js —
// they are intentionally separate.
//
// Channels:
//   'admin'             — any admin role (full-data visibility)
//   'team:design'       — design_manager + design_engineer
//   'team:permitting'   — permitting_manager + permitting_engineer
//   'team:construction' — construction_manager + construction_engineer
//   'user:<userId>'     — reserved for future per-user scoping
//
// Subscriber model: one persistent connection per browser tab.
// The endpoint subscribes each connection to the appropriate channels
// based on req.user.role. Heartbeat every 25 s keeps proxies alive.
//
// Item 15 fix (SSE channel pinning):
//   - Heartbeat now re-validates session against live DB state (role,
//     active flag, tokens_invalid_after). Stale or deactivated sessions
//     are closed with a 'session_invalid' event so the browser knows to
//     redirect to login rather than just silently disconnect.
//   - Managers no longer subscribe to 'admin' channel. Previously,
//     design_manager and permitting_manager received admin-channel events
//     (broad-visibility broadcasts intended for the admin portal), leaking
//     firm-wide cross-team data. They now receive only their own team
//     channel events.
//
// Usage:
//   const { attach, broadcast } = require('./_sse');
//   attach(app, { requireAuth, pool }); // in server.js boot
//   broadcast('admin', 'project_added', row); // in route write handlers

const _channels = new Map(); // channel -> Set<res>
// Reverse map: res -> Set<channel> — allows O(1) full cleanup when a
// connection closes or its write fails. Without this, we'd have to
// scan every channel to remove a single dead connection.
const _resChanMap = new Map(); // res -> Set<channel>

// Per-connection metadata: userId, tokenIssuedAt (iat from JWT, seconds),
// connectedRole (role at connect time).
// Used by heartbeat re-validation to detect session revocation and role changes.
const _resMeta = new Map(); // res -> { userId, tokenIssuedAt, connectedRole }

function _subscribe(channel, res) {
  if (!_channels.has(channel)) _channels.set(channel, new Set());
  _channels.get(channel).add(res);

  if (!_resChanMap.has(res)) _resChanMap.set(res, new Set());
  _resChanMap.get(res).add(channel);
}

// Remove res from every channel it subscribed to and clean up the
// reverse map entry. Safe to call multiple times (idempotent).
function _purge(res) {
  const chans = _resChanMap.get(res);
  if (!chans) return;
  for (const channel of chans) {
    const set = _channels.get(channel);
    if (!set) continue;
    set.delete(res);
    if (!set.size) _channels.delete(channel);
  }
  _resChanMap.delete(res);
  _resMeta.delete(res);
}

/**
 * broadcast(channel, event, payload)
 *
 * Sends a named SSE event to every subscriber on the given channel.
 * payload is serialised with JSON.stringify — keep it small (row id
 * or a few key fields; clients refetch on receipt).
 * Dead connections (write throws or returns false) are purged immediately
 * so they don't accumulate between 'close' events.
 */
function broadcast(channel, event, payload) {
  const subs = _channels.get(channel);
  if (!subs || !subs.size) return;
  const data = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  // Snapshot the set before iterating so _purge() inside the loop
  // doesn't invalidate the iterator.
  for (const res of [...subs]) {
    let ok;
    try { ok = res.write(data); } catch { ok = false; }
    if (ok === false) _purge(res);
  }
}

/** Exposed for testing only — returns total subscriber count across all channels. */
function _subscriberCount() {
  let n = 0;
  for (const set of _channels.values()) n += set.size;
  return n;
}

/**
 * attach(app, mw)
 *
 * Registers GET /api/events/stream.  Call this in server.js AFTER
 * installAuthRoutes (so req.user is populated) but before static
 * file serving.
 *
 * mw.requireAuth() is the factory from auth.js.
 * mw.pool is the pg Pool — needed for heartbeat re-validation.
 */
function attach(app, mw) {
  const pool = mw.pool;

  app.get('/api/events/stream', mw.requireAuth(), (req, res) => {
    // SSE headers. X-Accel-Buffering: no tells nginx / Railway's reverse
    // proxy not to buffer the response (otherwise events are held until
    // the proxy's buffer fills up and the client sees them in bursts).
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // Determine channel memberships from the user's role.
    const role = req.user && req.user.role;
    const myChannels = [];

    if (role === 'admin') {
      myChannels.push('admin');
      // Admin sees everything — also add team channels so admin can have
      // multiple tabs open across portals and all stay live.
      myChannels.push('team:design', 'team:permitting', 'team:construction');
    } else if (role === 'design_manager') {
      // Item 15 fix: managers receive their own team channel only.
      // Previously they also subscribed to 'admin', leaking firm-wide
      // cross-team events (project additions from other teams, etc.).
      myChannels.push('team:design');
    } else if (role === 'permitting_manager') {
      myChannels.push('team:permitting');
    } else if (role === 'design_engineer') {
      myChannels.push('team:design');
    } else if (role === 'permitting_engineer') {
      myChannels.push('team:permitting');
    } else if (role === 'construction_manager' || role === 'construction_engineer') {
      myChannels.push('team:construction');
    }
    // 'customer' role gets no channels — the customer portal doesn't need
    // real-time push (it's read-only and low-frequency).

    myChannels.forEach(c => _subscribe(c, res));

    // Store metadata needed for heartbeat re-validation.
    // req.user.iat is the JWT issued-at timestamp (seconds since epoch),
    // set by verifyToken. We compare it against users.tokens_invalid_after
    // to detect password changes or explicit session revocations.
    // connectedRole captures the role at connect time so the heartbeat can
    // detect demotions / promotions and close the stale channel subscription.
    _resMeta.set(res, {
      userId: req.user.id,
      tokenIssuedAt: req.user.iat || 0,
      connectedRole: role || null,
    });

    // Send an initial ping so the browser marks the connection as open
    // immediately rather than waiting for the first real event.
    try { res.write(`: connected\n\n`); } catch {}

    // Heartbeat: keeps Railway / nginx proxies from closing idle connections.
    // Item 15 fix: on each heartbeat tick, re-validate the session against
    // live DB state. Close the connection if:
    //   (a) the user row no longer exists
    //   (b) the user has been deactivated (active = FALSE)
    //   (c) the token predates tokens_invalid_after (password changed /
    //       session explicitly invalidated by admin)
    // This ensures demoted or deactivated users stop receiving events
    // within at most one heartbeat interval (25 s) rather than holding
    // their channel subscription until they close the browser tab.
    // Track whether this connection has been cleaned up so the heartbeat
    // can't double-purge / double-clear after req.on('close') already fired
    // (or vice versa). _purge() is internally idempotent (early-returns on
    // missing _resChanMap entry), but the flag short-circuits the whole
    // heartbeat body so we don't even attempt the DB query after teardown.
    let _closed = false;
    const _cleanupConn = () => {
      if (_closed) return;
      _closed = true;
      try { clearInterval(heartbeat); } catch {}
      try { _purge(res); } catch {}
    };

    const heartbeat = setInterval(async () => {
      if (_closed) return;
      // Re-validate session
      if (pool) {
        try {
          const meta = _resMeta.get(res);
          if (meta) {
            const { rows } = await pool.query(
              'SELECT role, active, tokens_invalid_after FROM users WHERE id = $1',
              [meta.userId]
            );
            const user = rows[0];
            const roleChanged = user && meta.connectedRole !== null &&
              user.role !== meta.connectedRole;
            const invalid =
              !user ||
              !user.active ||
              roleChanged ||
              (user.tokens_invalid_after &&
                meta.tokenIssuedAt < Math.floor(new Date(user.tokens_invalid_after).getTime() / 1000));
            if (invalid) {
              // Notify the client before closing so it can redirect to login
              // rather than showing a confusing network error.
              try {
                res.write(`event: session_invalid\ndata: ${JSON.stringify({ reason: 'session_expired' })}\n\n`);
              } catch {}
              _cleanupConn();
              try { res.end(); } catch {}
              return;
            }
          }
        } catch (dbErr) {
          // DB error during re-validation — log AND clean up. Previously
          // we logged and continued, but if pool.query() throws repeatedly
          // (DB blip / slow query / connection refusal), the heartbeat tick
          // returns early before reaching the ping/write at the bottom, so
          // dead-connection detection stalls AND the subscription leaks in
          // sseClients indefinitely. Treating a DB error as fatal-for-this-
          // connection lets the client reconnect cleanly on the next tick
          // (their browser will re-establish the EventSource), and avoids
          // accumulating orphaned subscriptions across hours.
          console.error('[_sse:heartbeat:revalidate]', dbErr && dbErr.message);
          _cleanupConn();
          try { res.end(); } catch {}
          return;
        }
      }

      let ok;
      try { ok = res.write(`: ping\n\n`); } catch { ok = false; }
      if (ok === false) {
        _cleanupConn();
      }
    }, 25000);

    // Wrap close handler in try/catch so a throwing listener (e.g., on a
    // bizarre res implementation) can't blow up the cleanup chain and leak
    // the interval timer.
    req.on('close', () => {
      try { _cleanupConn(); } catch (e) {
        console.error('[_sse:close-handler]', e && e.message);
      }
    });
  });
}

module.exports = { attach, broadcast, _subscriberCount };
