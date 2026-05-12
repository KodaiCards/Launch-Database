// public/js/overlay_modal.js — shared scaffolding for one-shot overlay modals.
//
// The "build a DOM-only modal on demand, show it, remove it on close"
// pattern was open-coded in 4 spots with the same dance: createElement,
// className='modal-overlay', innerHTML with modal-header/body/footer,
// appendChild, wire click-outside-to-dismiss, deal with the previously-
// open instance. This file consolidates that boilerplate so each caller
// supplies only the parts that actually vary.
//
// API:
//   openOverlayModal({
//     id:         'my-modal',
//     titleHTML:  '<i class="fa-solid fa-x"></i> Title',
//     bodyHTML:   '...',                   // arbitrary inner HTML
//     footerHTML: '<button class="btn">Close</button>',  // optional
//     maxWidth:   '680px',                 // default 680
//     bodyStyle:  'padding:0',             // optional override of .modal-body's default
//     onClose:    () => {...},             // fired on click-outside dismiss
//   })
//   closeOverlayModal(id)  → convenience for inline onclick handlers.
//
// Returns the overlay element. Callers can also wire post-render hooks
// (e.g. focus an input) using the returned element.

(function () {
  // ── A11y helpers ───────────────────────────────────────────────────────
  // Selectors for elements that can receive keyboard focus.
  const FOCUSABLE = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])', 'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  // Trap Tab / Shift+Tab inside the modal so focus can't escape to the page.
  function _makeTrapHandler(overlay) {
    return function _trapHandler(e) {
      if (e.key !== 'Tab') return;
      const focusables = Array.from(overlay.querySelectorAll(FOCUSABLE));
      if (!focusables.length) { e.preventDefault(); return; }
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };
  }

  function openOverlayModal({ id, titleHTML, bodyHTML, footerHTML, maxWidth = '680px', bodyStyle, onClose }) {
    // Remember what had focus so we can restore it on close.
    const _prevFocus = document.activeElement;

    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = id;
    overlay.className = 'modal-overlay';
    overlay.style.display = 'flex';
    // a11y: dialog role + label
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    const titleId = id + '-title';
    overlay.setAttribute('aria-labelledby', titleId);
    const bodyStyleAttr = bodyStyle ? ` style="${bodyStyle}"` : '';
    overlay.innerHTML = `
      <div class="modal-content" style="max-width:${maxWidth};max-height:85vh;display:flex;flex-direction:column;width:90%">
        <div class="modal-header">
          <span class="modal-title" id="${titleId}">${titleHTML || ''}</span>
          <button class="btn btn-icon btn-secondary" aria-label="Close dialog" onclick="closeOverlayModal('${id}')"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        </div>
        <div class="modal-body"${bodyStyleAttr}>${bodyHTML || ''}</div>
        ${footerHTML ? `<div class="modal-footer">${footerHTML}</div>` : ''}
      </div>
    `;
    document.body.appendChild(overlay);

    // Focus the first focusable element inside the modal.
    const firstFocusable = overlay.querySelector(FOCUSABLE);
    if (firstFocusable) firstFocusable.focus();
    else overlay.setAttribute('tabindex', '-1'), overlay.focus();

    // Focus trap — Tab / Shift+Tab stay inside the modal.
    const _trapHandler = _makeTrapHandler(overlay);
    document.addEventListener('keydown', _trapHandler);

    function _cleanup(fireOnClose) {
      document.removeEventListener('keydown', _trapHandler);
      document.removeEventListener('keydown', _escHandler);
      // Restore focus to the element that opened the modal.
      if (_prevFocus && typeof _prevFocus.focus === 'function') {
        try { _prevFocus.focus(); } catch (e) {}
      }
      if (fireOnClose && typeof onClose === 'function') onClose();
    }

    overlay.addEventListener('click', e => {
      if (e.target === overlay) { overlay.remove(); _cleanup(true); }
    });

    // Escape-key dismissal — remove the listener when the overlay is gone
    // so we don't accumulate stale keydown handlers on the document.
    function _escHandler(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        _cleanup(true);
      }
    }
    document.addEventListener('keydown', _escHandler);

    // Auto-clean if the overlay is removed by other means (e.g. closeOverlayModal).
    new MutationObserver((_, obs) => {
      if (!document.getElementById(id)) {
        _cleanup(false);
        obs.disconnect();
      }
    }).observe(document.body, { childList: true, subtree: false });
    return overlay;
  }

  function closeOverlayModal(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
    // Note: focus restore is handled by the MutationObserver cleanup in
    // openOverlayModal, so callers don't need to do anything extra.
  }

  window.openOverlayModal = openOverlayModal;
  window.closeOverlayModal = closeOverlayModal;
})();
