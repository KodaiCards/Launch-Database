// tests/project_photos_auth.test.js
// Regression guard for the bare-factory middleware bug in routes/project_photos.js.
//
// Bug (issue #81): all four photo endpoints passed the `requireAuth` middleware
// FACTORY directly to Express instead of CALLING it (`requireAuth()`).
//   app.post('/api/project-photos', requireAuth, ...)   // WRONG — hangs
//   app.post('/api/project-photos', requireAuth(), ...)  // RIGHT — enforces login
//
// `requireAuth(roles)` in auth.js RETURNS a middleware closure; it does not itself
// touch res or call next(). Passing the bare factory means Express invokes
// `requireAuth(req, res, next)`: it computes `allowed` from `req`, RETURNS a closure
// that Express discards, and never sends a response or calls next() → the request
// hangs indefinitely, for every role.
//
// This file (a) proves the hang mechanism against an inline replica of the factory,
// and (b) statically scans the real route file so the fix cannot silently regress.
//
// No DB / no node_modules required. Runs with: node --test tests/project_photos_auth.test.js

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// --- Inline replica of auth.js requireAuth (verbatim; mirrors auth.js:439-449) ---
function requireAuth(roles) {
  const allowed = roles ? (Array.isArray(roles) ? roles : [roles]) : null;
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Login required' });
    if (allowed && allowed.length > 0 && !allowed.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions for this action' });
    }
    next();
  };
}

// Minimal Express-style response stub that records what the middleware did.
function makeRes() {
  const rec = { statusCode: null, body: null, ended: false };
  const res = {
    status(code) { rec.statusCode = code; return res; },
    json(obj) { rec.body = obj; rec.ended = true; return res; },
  };
  return { res, rec };
}

// --- The CORRECT form: requireAuth() returns a real middleware ---

describe('requireAuth() called form — the fix', () => {
  it('returns a 3-arg middleware function', () => {
    const mw = requireAuth();
    assert.equal(typeof mw, 'function');
    assert.equal(mw.length, 3); // (req, res, next)
  });

  it('calls next() for any authenticated user (no role restriction)', () => {
    const mw = requireAuth();
    const { res } = makeRes();
    let nexted = false;
    mw({ user: { id: 'u1', role: 'contractor' } }, res, () => { nexted = true; });
    assert.equal(nexted, true);
  });

  it('responds 401 (never hangs) when unauthenticated', () => {
    const mw = requireAuth();
    const { res, rec } = makeRes();
    let nexted = false;
    mw({}, res, () => { nexted = true; });
    assert.equal(nexted, false);
    assert.equal(rec.statusCode, 401);
    assert.equal(rec.ended, true); // a response WAS sent — the request does not hang
  });
});

// --- The BUG: the bare factory used as middleware hangs ---

describe('bare requireAuth factory as middleware — the bug being guarded against', () => {
  it('neither calls next() nor sends a response (this is the hang)', () => {
    // Simulate exactly what Express does when handed the bare factory:
    // it invokes it as middleware with (req, res, next).
    const { res, rec } = makeRes();
    let nexted = false;
    const returnValue = requireAuth(/* Express passes */ { user: { id: 'u1' } }, res, () => { nexted = true; });

    // The factory returned a NEW middleware closure that Express throws away...
    assert.equal(typeof returnValue, 'function');
    // ...and it did NOT advance the chain or answer the client → hang.
    assert.equal(nexted, false);
    assert.equal(rec.statusCode, null);
    assert.equal(rec.ended, false);
  });
});

// --- Static regression guard on the real route file (encodes the fresh-grep) ---

describe('routes/project_photos.js wiring — static guard', () => {
  const src = readFileSync(new URL('../routes/project_photos.js', import.meta.url), 'utf8');
  const routeRegistration = /app\.(?:get|post|put|patch|delete)\([^\n]*?,\s*requireAuth(\(\))?\s*[,)]/g;

  it('every photo route calls the factory (requireAuth()), none passes it bare', () => {
    const regs = src.match(routeRegistration) || [];
    assert.ok(regs.length >= 4, `expected >=4 photo route registrations, found ${regs.length}`);
    for (const reg of regs) {
      assert.match(
        reg,
        /requireAuth\(\)\s*[,)]/,
        `route registration passes the bare requireAuth factory (missing "()"): ${reg}`
      );
    }
  });

  it('the four documented endpoints are all present and gated with requireAuth()', () => {
    for (const route of [
      /app\.post\('\/api\/project-photos',\s*requireAuth\(\)/,
      /app\.get\('\/api\/project-photos',\s*requireAuth\(\)/,
      /app\.get\('\/api\/project-photos\/:id\/download',\s*requireAuth\(\)/,
      /app\.delete\('\/api\/project-photos\/:id',\s*requireAuth\(\)/,
    ]) {
      assert.match(src, route);
    }
  });
});
