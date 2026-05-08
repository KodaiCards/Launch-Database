// routes/_sse.js — Shared Server-Sent Events broadcast module.
//
// Provides a single persistent SSE endpoint at GET /api/events/stream
// that all admin/team portals subscribe to for real-time updates.
// Splice Matrix has its own project-scoped SSE in routes/splice.js —
// they are intentionally separate.
//
// Channels:
//   'admin'             — any admin or manager role (full-data visibility)
//   'team:design'       — design_manager + design_engineer
//   'team:permitting'   — permitting_manager + permitting_engineer
//   'team:construction' — construction_manager + construction_engineer
//   'user:<userId>'     — reserved for future per-user scoping
//
// Subscriber model: one persistent connection per browser tab.
// The endpoint subscribes each connection to the appropriate channels
// based on req.user.role. Heartbeat every 25 s keeps proxies alive.
//
// Usage:
//   const { attach, broadcast } = require('./_sse');
//   attach(app, { requireAuth });             // in server.js boot
//   broadcast('admin', 'project_added', row); // in route write handlers

const _channels = new Map(); // channel -> Set<res>
// Reverse map: res -> Set<channel> — allows O(1) full cleanup when a
// connection closes or its write fails. Without this, we'd have to
// scan every channel to remove a single dead connection.
const _resChanMap = new Map(); // res -> Set<channel>

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
 */
function attach(app, mw) {
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
      myChannels.push('admin', 'team:design');
    } else if (role === 'permitting_manager') {
      myChannels.push('admin', 'team:permitting');
    } else if (role === 'design_engineer') {
      myChannels.push('team:design');
    } else if (role === 'permitting_engineer') {
      myChannels.push('team:permitting');
    }
    // 'customer' role gets no channels — the customer portal doesn't need
    // real-time push (it's read-only and low-frequency).

    myChannels.forEach(c => _subscribe(c, res));

    // Send an initial ping so the browser marks the connection as open
    // immediately rather than waiting for the first real event.
    try { res.write(`: connected\n\n`); } catch {}

    // Heartbeat: keeps Railway / nginx proxies from closing idle connections.
    // If the write returns false (backpressure) or throws (dead socket),
    // purge eagerly rather than waiting for the 'close' event — Railway's
    // proxy sometimes drops the TCP connection without sending FIN, so
    // 'close' may never fire for a dead tab.
    const heartbeat = setInterval(() => {
      let ok;
      try { ok = res.write(`: ping\n\n`); } catch { ok = false; }
      if (ok === false) {
        clearInterval(heartbeat);
        _purge(res);
      }
    }, 25000);

    const cleanup = () => {
      clearInterval(heartbeat);
      _purge(res);
    };
    req.on('close', cleanup);
  });
}

module.exports = { attach, broadcast, _subscriberCount };
