/* Launch Fiber Services — Global keyboard shortcuts.
 *
 * Drop-in: included by every HTML page via <script src="/keyboard.js" defer>.
 * No deps. Safe on any page (each shortcut probes for the elements/functions
 * it needs and bails silently if absent).
 *
 * Bindings:
 *   /          focus the most prominent search input on the current page
 *   Cmd/Ctrl+K same as /  (mac muscle memory)
 *   n          open the "new project" modal (admin only — looks for the
 *              add-project button)
 *   Esc        close the topmost open modal (or blur a focused input)
 *   ?          show a small "what shortcuts exist?" toast
 *
 * Conventions probed (in order, first match wins per shortcut):
 *   Search:        #proj-search, #search, #global-search, [data-search],
 *                  input[type=search] visible on screen
 *   New project:   button[data-action="new-project"], #new-project-btn,
 *                  any button whose text contains "New Project"
 *   Modal close:   .modal-overlay.open .modal-close,
 *                  .modal-overlay.open [data-modal-close],
 *                  any visible window.closeModal/closeModals function
 */
(function () {
  if (window.LFS && window.LFS.kbBound) return;
  window.LFS = window.LFS || {};
  window.LFS.kbBound = true;

  function isTypingElsewhere(e) {
    var ae = document.activeElement;
    if (!ae) return false;
    if (ae === document.body) return false;
    var tag = ae.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (ae.isContentEditable) return true;
    return false;
  }

  function topVisibleModal() {
    // Prefer an .open .modal-overlay; fall back to display:flex.
    var overlays = document.querySelectorAll('.modal-overlay, .modal');
    for (var i = overlays.length - 1; i >= 0; i--) {
      var el = overlays[i];
      if (el.classList.contains('open') || el.classList.contains('active')) return el;
      if (el.style && el.style.display === 'flex') return el;
    }
    return null;
  }

  function findSearch() {
    var ids = ['proj-search', 'search', 'global-search', 'permit-search', 'design-search'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el.offsetParent !== null) return el;
    }
    var sel = document.querySelector('[data-search], input[type=search]');
    if (sel && sel.offsetParent !== null) return sel;
    return null;
  }

  function findNewProjectBtn() {
    var el = document.querySelector('button[data-action="new-project"], #new-project-btn, #add-project-btn');
    if (el) return el;
    var btns = document.querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) {
      var t = (btns[i].textContent || '').trim().toLowerCase();
      if (t.indexOf('new project') !== -1 || t === 'new project' || t === '+ new project') {
        return btns[i];
      }
    }
    return null;
  }

  function closeTopModal() {
    var top = topVisibleModal();
    if (top) {
      // Try its dedicated close button first
      var btn = top.querySelector('[data-modal-close], .modal-close, .btn-close, .close');
      if (btn) { btn.click(); return true; }
      // Common naming convention: close + modal id
      if (top.id && typeof window['close' + top.id] === 'function') {
        try { window['close' + top.id](); return true; } catch (e) {}
      }
      // Generic helper exposed by index.html
      if (typeof window.closeModal === 'function') {
        try { window.closeModal(top.id); return true; } catch (e) {}
      }
      // Last resort: hide it
      top.classList.remove('open');
      top.classList.remove('active');
      if (top.style) top.style.display = 'none';
      return true;
    }
    return false;
  }

  function showHelp() {
    if (!window.LFS || !window.LFS.toast) return;
    window.LFS.toast.info('Keys: / focus search · n new project · Esc close · ? help', { durationMs: 5000 });
  }

  document.addEventListener('keydown', function (e) {
    // Esc always works, even from inside an input — that's the whole point.
    if (e.key === 'Escape') {
      // If any modal is open, close it. Otherwise blur a focused input
      // so the user can use the / shortcut next.
      if (closeTopModal()) {
        e.preventDefault();
        return;
      }
      var ae = document.activeElement;
      if (ae && ae !== document.body && typeof ae.blur === 'function') {
        ae.blur();
      }
      return;
    }

    // For everything else, ignore if the user is typing somewhere.
    if (isTypingElsewhere(e)) return;

    // Cmd/Ctrl+K = focus search (mac muscle memory)
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      var s = findSearch();
      if (s) { e.preventDefault(); s.focus(); s.select && s.select(); }
      return;
    }

    // Bare keys — only fire when no modifier (let browser shortcuts win)
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === '/') {
      var s2 = findSearch();
      if (s2) { e.preventDefault(); s2.focus(); s2.select && s2.select(); }
      return;
    }
    if (e.key === 'n' || e.key === 'N') {
      var btn = findNewProjectBtn();
      if (btn) { e.preventDefault(); btn.click(); }
      return;
    }
    if (e.key === '?') {
      showHelp();
      return;
    }
  });

  // Tiny indicator on the search input so users discover the shortcut.
  // Runs once after DOM is ready.
  function decorateSearchHint() {
    var s = findSearch();
    if (s && !s.placeholder) {
      s.placeholder = 'Search   /  to focus';
    } else if (s && s.placeholder && s.placeholder.indexOf('/') === -1) {
      s.placeholder = s.placeholder + '   ( / )';
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decorateSearchHint);
  } else {
    decorateSearchHint();
  }
})();
