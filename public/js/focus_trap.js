// public/js/focus_trap.js — shared focus-trap helper for static-class modals.
//
// overlay_modal.js and dialog.js already have their own focus trapping for
// dynamically-built modals. This module covers the *static* `.modal-overlay`
// modals that are toggled via classList.add/remove('open') or style.display,
// such as admin.html's openModal()/closeModal(), permitting/design om()/cm(),
// and timeclock's openManualEntryModal()/openEditEntryModal().
//
// API (exposed on window):
//   const trap = trapFocus(modalEl, { escClose: true, onEsc: fn })
//   trap.release()
//
// On trapFocus(el):
//   1. Saves document.activeElement (focus return target).
//   2. Moves focus to the first focusable descendant (or el itself).
//   3. Installs Tab/Shift+Tab handler that cycles focus within el.
//   4. Optionally installs ESC handler.
//
// On trap.release():
//   1. Removes Tab and ESC handlers.
//   2. Returns focus to the saved element.

(function () {
  if (window.trapFocus) return; // already loaded

  const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  /**
   * trapFocus(modalEl, opts) → { release() }
   *
   * opts.escClose  {boolean}  — install ESC handler that calls opts.onEsc (default true)
   * opts.onEsc     {function} — called when ESC is pressed (before handler removal)
   * opts.initialFocus {Element} — focus this element instead of first focusable
   */
  function trapFocus(modalEl, opts) {
    opts = opts || {};
    var escClose = opts.escClose !== false; // default true
    var prevFocus = document.activeElement;

    // Move focus into the modal.
    var target = opts.initialFocus || modalEl.querySelector(FOCUSABLE);
    if (target) {
      target.focus();
    } else {
      if (!modalEl.hasAttribute('tabindex')) modalEl.setAttribute('tabindex', '-1');
      modalEl.focus();
    }

    function _tabHandler(e) {
      if (e.key !== 'Tab') return;
      var focusables = Array.from(modalEl.querySelectorAll(FOCUSABLE));
      if (!focusables.length) { e.preventDefault(); return; }
      var first = focusables[0];
      var last  = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    }

    function _escHandler(e) {
      if (e.key !== 'Escape') return;
      if (typeof opts.onEsc === 'function') opts.onEsc();
      release();
    }

    document.addEventListener('keydown', _tabHandler);
    if (escClose) document.addEventListener('keydown', _escHandler);

    function release() {
      document.removeEventListener('keydown', _tabHandler);
      if (escClose) document.removeEventListener('keydown', _escHandler);
      // Restore focus to the element that triggered the modal.
      if (prevFocus && typeof prevFocus.focus === 'function') {
        try { prevFocus.focus(); } catch (ex) {}
      }
    }

    return { release: release };
  }

  window.trapFocus = trapFocus;
})();
