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
  const ok = await confirmDialog({ title: 'Delete document?', message: 'The file is removed from disk too.', confirmLabel: 'Delete', danger: true });
  if (!ok) return;
  try {
    await api('/api/projects/documents/' + docId, 'DELETE');
    if (typeof reload === 'function') reload();
  } catch (e) { alert('Delete failed: ' + e.message); }
}

// Upload a multipart/form-data POST with progress callbacks. Used by the
// invoice-template, permit-doc, and design-doc upload flows so the
// operator can see "uploading 42 / 50 MB" on slow connections instead of
// staring at a spinner. fetch() can't surface upload progress; XHR can.
//
// Resolves with the parsed JSON body on 2xx, rejects with Error(message)
// on anything else (including the JSON-error 413 surfaced by the global
// /api error middleware in server.js). Sends the same auth (cookie +
// Bearer) the api() helper uses, so endpoints behind requireAdmin /
// requireManagerOrAdmin work the same way as a JSON POST.
//
// Usage:
//   const data = await apiUpload('/api/invoice-templates', formData, {
//     onProgress: (loaded, total) => updateBar(loaded, total),
//   });
function apiUpload(url, formData, { onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.withCredentials = true;
    try {
      const tok = sessionStorage.getItem('lfs_token');
      if (tok) xhr.setRequestHeader('Authorization', 'Bearer ' + tok);
    } catch (e) { /* sessionStorage may be disabled */ }
    if (typeof onProgress === 'function' && xhr.upload) {
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) onProgress(e.loaded, e.total);
      });
    }
    xhr.onload = () => {
      if (xhr.status === 401) {
        try { sessionStorage.removeItem('lfs_token'); } catch (e) {}
        window.location.href = '/login?next=' + encodeURIComponent(window.location.pathname);
        return reject(new Error('Session expired'));
      }
      let body = null;
      try { body = JSON.parse(xhr.responseText); } catch (e) { /* not JSON */ }
      if (xhr.status >= 200 && xhr.status < 300) return resolve(body || {});
      const msg = (body && body.error) || xhr.statusText || ('HTTP ' + xhr.status);
      reject(new Error(msg));
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.onabort = () => reject(new Error('Upload aborted'));
    xhr.send(formData);
  });
}
