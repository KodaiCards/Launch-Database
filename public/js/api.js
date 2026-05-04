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

// Shared delete-and-reload for project-attached documents (final maps,
// permit attachments). Both the design-docs modal and the permit-docs
// modal hit the same endpoint and run the same confirm/reload dance —
// this keeps the two paths from drifting.
async function deleteProjectDoc(docId, reload) {
  if (!confirm('Delete this document? The file is removed from disk too.')) return;
  try {
    await api('/api/projects/documents/' + docId, 'DELETE');
    if (typeof reload === 'function') reload();
  } catch (e) { alert('Delete failed: ' + e.message); }
}
