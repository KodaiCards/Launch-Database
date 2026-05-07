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

function _subscribe(channel, res) {
  if (!_channels.has(channel)) _channels.set(channel, new Set());
  _channels.get(channel).add(res);
}

function _unsubscribe(channel, res) {
  const set = _channels.get(channel);
  if (!set) return;
  set.delete(res);
  if (!set.size) _channels.delete(channel);
}

/**
 * broadcast(channel, event, payload)
 *
 * Sends a named SSE event to every subscriber on the given channel.
 * payload is serialised with JSON.stringify — keep it small (row id
 * or a few key fields; clients refetch on receipt).
 * Fire-and-forget: dead connections are silently skipped.
 */
function broadcast(channel, event, payload) {
  const subs = _channels.get(channel);
  if (!subs || !subs.size) return;
  const data = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const res of subs) {
    try { res.write(data); } catch { /* dead conn — cleaned up on 'close' */ }
  }
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
    const heartbeat = setInterval(() => {
      try { res.write(`: ping\n\n`); } catch {}
    }, 25000);

    req.on('close', () => {
      clearInterval(heartbeat);
      myChannels.forEach(c => _unsubscribe(c, res));
    });
  });
}

module.exports = { attach, broadcast };
