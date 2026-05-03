// public/js/api.js — single API client used by the admin app.
//
// Wraps fetch with cookie+JWT credentials and handles 401 by bouncing to
// the login page. Loaded BEFORE the main inline <script> in index.html
// so api() is globally defined when any handler / bootstrap code runs.
//
// Extracted from public/index.html as the first step of CLEANUP_PLAN.md
// Track 1.2 (frontend split). Behavior is unchanged from the original.

async function api(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // send cookies for JWT session
  };
  // Backup: also send token from sessionStorage in Authorization header.
  // Useful when cookies are blocked by Cloudflare/browser settings.
  try {
    const tok = sessionStorage.getItem('lfs_token');
    if (tok) opts.headers['Authorization'] = 'Bearer ' + tok;
  } catch (e) { /* sessionStorage may be disabled */ }
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(path, opts);
  if (r.status === 401) {
    // Session expired or never existed. Bounce to login.
    try { sessionStorage.removeItem('lfs_token'); } catch (e) { }
    window.location.href = '/login?next=' + encodeURIComponent(window.location.pathname);
    throw new Error('Session expired');
  }
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
