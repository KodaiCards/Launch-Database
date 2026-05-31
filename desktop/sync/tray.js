// System tray icon + status menu for Launch Fiber Desktop.
//
// Exposes a small factory used by main.js:
//   const tray = require('./sync/tray').create({ iconPath, onShow, onSyncNow, onQuit, getStatus });
//   tray.updateStatus(status);  // called by main when sync state changes
//
// Implementation notes:
//   - Uses nativeImage so a single PNG works on Windows/Linux/macOS.
//   - macOS expects template images for menubar — we mark non-template by default
//     since the brand logo isn't monochrome. Users on macOS see a colored icon
//     (acceptable for v1).
//   - Status changes only update tooltip + a top-of-menu label. Distinct icon
//     variants per state (idle/syncing/error) deferred — see UX TODOs.

const { Tray, Menu, nativeImage } = require('electron');

function fmtTimeAgo(iso) {
  if (!iso) return 'never';
  try {
    const then = new Date(iso).getTime();
    const diffMs = Date.now() - then;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch (_) {
    return 'unknown';
  }
}

function describeStatus(status) {
  if (!status) return { tooltip: 'Launch Fiber Desktop', label: 'Sync: idle' };
  if (status.isRunning) {
    return { tooltip: 'Launch Fiber Desktop — syncing', label: 'Sync: running...' };
  }
  if (status.errors && status.errors.length > 0) {
    return {
      tooltip: `Launch Fiber Desktop — last sync had ${status.errors.length} error(s)`,
      label: `Sync: error (${status.errors.length})`,
    };
  }
  if (status.lastSyncAt) {
    const ago = fmtTimeAgo(status.lastSyncAt);
    return {
      tooltip: `Launch Fiber Desktop — last synced ${ago}`,
      label: `Sync: ${ago}`,
    };
  }
  return { tooltip: 'Launch Fiber Desktop', label: 'Sync: idle' };
}

function create({ iconPath, onShow, onSyncNow, onQuit, getStatus }) {
  let image;
  try {
    image = nativeImage.createFromPath(iconPath);
    if (image.isEmpty()) {
      // Fallback to an empty 16x16 image; Electron still shows a placeholder.
      image = nativeImage.createEmpty();
    }
  } catch (_) {
    image = nativeImage.createEmpty();
  }

  const tray = new Tray(image);
  tray.setToolTip('Launch Fiber Desktop');

  function rebuildMenu() {
    const status = typeof getStatus === 'function' ? getStatus() : null;
    const { tooltip, label } = describeStatus(status);
    tray.setToolTip(tooltip);
    const menu = Menu.buildFromTemplate([
      { label: 'Launch Fiber Desktop', enabled: false },
      { label, enabled: false },
      { type: 'separator' },
      { label: 'Show Window', click: () => onShow && onShow() },
      { label: 'Run Sync Now', click: () => onSyncNow && onSyncNow() },
      { type: 'separator' },
      { label: 'Quit', click: () => onQuit && onQuit() },
    ]);
    tray.setContextMenu(menu);
  }

  rebuildMenu();
  tray.on('click', () => onShow && onShow());
  tray.on('double-click', () => onShow && onShow());

  return {
    raw: tray,
    updateStatus: () => rebuildMenu(),
    destroy: () => {
      try {
        tray.destroy();
      } catch (_) {}
    },
  };
}

module.exports = { create, describeStatus, fmtTimeAgo };
