// public/js/undo_bar.js — bottom-of-viewport undo bar.
//
// Server-issued undo tokens (from bulk hours delete, project tree delete,
// contract cascade, etc.) drop a snapshot in the undo_buckets table with a
// short TTL. The UI bar shows for 15 seconds, displays a countdown, and
// posts to /api/undo/:token on click. Auto-dismisses after the countdown
// completes; user can also dismiss manually with the × button. Only one
// bar can be active at a time — a new showUndoBar replaces the previous.
//
// Depends on api() from /js/api.js. Optional: window.LFS.toast for the
// success notification, and the loadXxx() reload functions are called only
// if defined (so the module works on pages that don't ship every loader).
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.4.

let _lfsUndoState = null;   // { token, message, deadlineMs, intervalId }

function showUndoBar(message, undoToken, durationSeconds) {
  if (!undoToken) return;   // nothing to undo — show a toast instead
  hideUndoBar();             // clear any previous bar
  const dur = durationSeconds || 15;
  const bar = document.getElementById('lfs-undo-bar');
  const msg = document.getElementById('lfs-undo-message');
  const cd  = document.getElementById('lfs-undo-countdown');
  if (!bar || !msg || !cd) return;
  msg.textContent = message;
  cd.textContent = dur + 's';
  bar.style.display = 'flex';
  const deadline = Date.now() + dur * 1000;
  const intervalId = setInterval(() => {
    const remaining = Math.max(0, Math.round((deadline - Date.now()) / 1000));
    cd.textContent = remaining + 's';
    if (remaining <= 0) hideUndoBar();
  }, 250);
  _lfsUndoState = { token: undoToken, message, deadlineMs: deadline, intervalId };
}

function hideUndoBar() {
  if (_lfsUndoState && _lfsUndoState.intervalId) clearInterval(_lfsUndoState.intervalId);
  _lfsUndoState = null;
  const bar = document.getElementById('lfs-undo-bar');
  if (bar) bar.style.display = 'none';
}

async function lfsUndoClick() {
  if (!_lfsUndoState) return;
  const token = _lfsUndoState.token;
  const btn = document.getElementById('lfs-undo-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Restoring…'; }
  try {
    await api('/api/undo/' + token, 'POST', {});
    hideUndoBar();
    if (window.LFS && window.LFS.toast) window.LFS.toast.success('Restored.');
    // Refresh whatever views we can — undo can touch hours, projects, contracts
    if (typeof loadHours === 'function')   try { loadHours(); }   catch {}
    if (typeof loadProjects === 'function')try { loadProjects(); }catch {}
    if (typeof loadDashboard === 'function')try { loadDashboard(); }catch {}
    if (typeof loadContractList === 'function') try { loadContractList(); renderContractsList(); } catch {}
  } catch (e) {
    if (btn) { btn.disabled = false; btn.innerHTML = 'Undo <span id="lfs-undo-countdown" style="opacity:.85;font-weight:400">—</span>'; }
    alert('Undo failed: ' + (e.message || e));
  }
}
