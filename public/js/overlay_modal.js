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
  function openOverlayModal({ id, titleHTML, bodyHTML, footerHTML, maxWidth = '680px', bodyStyle, onClose }) {
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = id;
    overlay.className = 'modal-overlay';
    overlay.style.display = 'flex';
    const bodyStyleAttr = bodyStyle ? ` style="${bodyStyle}"` : '';
    overlay.innerHTML = `
      <div class="modal-content" style="max-width:${maxWidth};max-height:85vh;display:flex;flex-direction:column;width:90%">
        <div class="modal-header">
          <span class="modal-title">${titleHTML || ''}</span>
          <button class="btn btn-icon btn-secondary" onclick="closeOverlayModal('${id}')"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body"${bodyStyleAttr}>${bodyHTML || ''}</div>
        ${footerHTML ? `<div class="modal-footer">${footerHTML}</div>` : ''}
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.remove();
        if (typeof onClose === 'function') onClose();
      }
    });
    return overlay;
  }

  function closeOverlayModal(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  window.openOverlayModal = openOverlayModal;
  window.closeOverlayModal = closeOverlayModal;
})();
