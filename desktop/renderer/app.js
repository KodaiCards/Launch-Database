let currentSession = null;
let syncCountdownTimer = null;
let syncCountdownSeconds = 0;

document.addEventListener('DOMContentLoaded', async () => {
  await initializeApp();
  setupEventListeners();
  setupSyncListeners();
  await initializeSyncUI();
});

async function initializeApp() {
  try {
    currentSession = await window.api.getSession();
    if (!currentSession) {
      // Session not found, redirect to login
      window.location.href = 'login.html';
      return;
    }

    // Update username in header
    const usernameEl = document.getElementById('username');
    if (usernameEl && currentSession.user) {
      usernameEl.textContent = currentSession.user.username || currentSession.user.email;
    }

    // Load workspace tree
    await loadWorkspaceTree();
  } catch (err) {
    console.error('Failed to initialize app:', err);
    showError('Failed to initialize application. Please try again.');
  }
}

async function loadWorkspaceTree() {
  const treeContainer = document.getElementById('workspaceTree');
  if (!treeContainer) return;

  try {
    treeContainer.innerHTML = '<p class="loading">Loading workspace...</p>';

    const result = await window.api.fetchWorkspaceTree({ root: 'user' });

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch workspace tree');
    }

    // Render tree (placeholder: simple list for now)
    const tree = result.tree || [];
    if (Array.isArray(tree) && tree.length > 0) {
      const listHtml = tree
        .map(
          (item) =>
            `<div class="tree-item">
          <span class="tree-icon">📁</span>
          <span class="tree-label">${escapeHtml(item.name || item.id)}</span>
        </div>`
        )
        .join('');
      treeContainer.innerHTML = listHtml;
    } else {
      treeContainer.innerHTML =
        '<p class="tree-empty">No workspace items found.</p>';
    }
  } catch (err) {
    console.error('Error loading workspace tree:', err);
    treeContainer.innerHTML = `<p class="tree-error">Error: ${escapeHtml(
      err.message
    )}</p>`;
  }
}

function setupEventListeners() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', loadWorkspaceTree);
  }

  const webPortalBtn = document.getElementById('webPortalBtn');
  if (webPortalBtn && currentSession) {
    webPortalBtn.addEventListener('click', () => {
      require('electron').shell.openExternal(currentSession.server);
    });
  }

  const syncNowBtn = document.getElementById('syncNowBtn');
  if (syncNowBtn) {
    syncNowBtn.addEventListener('click', handleSyncNow);
  }

  const changeFolderBtn = document.getElementById('changeFolderBtn');
  if (changeFolderBtn) {
    changeFolderBtn.addEventListener('click', handleChangeSyncFolder);
  }

  const cancelCountdownBtn = document.getElementById('cancelCountdownBtn');
  if (cancelCountdownBtn) {
    cancelCountdownBtn.addEventListener('click', handleCancelSyncCountdown);
  }
}

function setupSyncListeners() {
  window.api.onSyncCompleted((result) => {
    handleSyncCompleted(result);
  });

  window.api.onSyncCountdownStart((data) => {
    showSyncCountdown(data.seconds);
  });

  window.addEventListener('online', () => {
    window.api.sendSyncOnline();
  });
}

async function handleLogout() {
  try {
    await window.api.logout();
    window.location.href = 'login.html';
  } catch (err) {
    console.error('Logout failed:', err);
    showError('Failed to logout. Please try again.');
  }
}

function showError(message) {
  const errorEl = document.getElementById('connectionStatus');
  if (errorEl) {
    errorEl.textContent = `Status: Error — ${message}`;
    errorEl.style.color = '#d32f2f';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Sync Functions

async function initializeSyncUI() {
  try {
    const localRoot = await window.api.syncGetLocalRoot();
    if (localRoot) {
      const folderInput = document.getElementById('syncFolderPath');
      if (folderInput) {
        folderInput.value = localRoot;
      }
    }

    await updateSyncStatus();
  } catch (err) {
    console.error('Failed to initialize sync UI:', err);
  }
}

async function updateSyncStatus() {
  try {
    const status = await window.api.syncGetStatus();

    const badge = document.getElementById('syncBadge');
    const statusText = document.getElementById('syncStatusText');

    if (status.isRunning) {
      badge.className = 'sync-badge yellow';
      statusText.textContent = 'Syncing...';
    } else if (status.errors && status.errors.length > 0) {
      badge.className = 'sync-badge red';
      statusText.textContent = 'Sync Error';
    } else if (status.lastSyncAt) {
      badge.className = 'sync-badge green';
      const syncTime = new Date(status.lastSyncAt);
      const now = new Date();
      const diffMs = now - syncTime;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) {
        statusText.textContent = 'Synced just now';
      } else if (diffMins < 60) {
        statusText.textContent = `Synced ${diffMins}m ago`;
      } else {
        statusText.textContent = `Synced ${Math.floor(diffMins / 60)}h ago`;
      }
    } else {
      badge.className = 'sync-badge gray';
      statusText.textContent = 'Ready';
    }

    updateActivityLog(status.events || []);

    if (status.conflicts && status.conflicts.length > 0) {
      showConflictPanel(status.conflicts);
    } else {
      hideConflictPanel();
    }
  } catch (err) {
    console.error('Failed to update sync status:', err);
  }
}

function updateActivityLog(events) {
  const logEl = document.getElementById('syncActivityLog');
  if (!logEl) return;

  if (events.length === 0) {
    logEl.innerHTML = '<p style="color: #999; text-align: center;">No activity yet</p>';
    return;
  }

  const html = events
    .map((event) => {
      const time = new Date(event.timestamp);
      const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `<div class="event">
        <span class="event-time">[${timeStr}]</span> ${escapeHtml(event.message)}
      </div>`;
    })
    .join('');

  logEl.innerHTML = html;
}

async function handleSyncNow() {
  const btn = document.getElementById('syncNowBtn');
  if (btn) {
    btn.disabled = true;
  }

  try {
    const result = await window.api.syncNow();
  } catch (err) {
    console.error('Sync error:', err);
    alert(`Sync failed: ${err.message}`);
  } finally {
    if (btn) {
      btn.disabled = false;
    }
  }
}

function handleSyncCompleted(result) {
  updateSyncStatus();

  if (result.success) {
    console.log('Sync completed:', result.summary);
  } else {
    console.error('Sync failed:', result.error);
  }
}

async function handleChangeSyncFolder() {
  try {
    const result = await window.api.syncPickFolder();
    if (result.success) {
      const folderInput = document.getElementById('syncFolderPath');
      if (folderInput) {
        folderInput.value = result.path;
      }
    } else {
      alert(`Failed to change folder: ${result.error}`);
    }
  } catch (err) {
    console.error('Failed to change folder:', err);
  }
}

function showSyncCountdown(seconds) {
  const toast = document.getElementById('syncCountdownToast');
  const countdownText = document.getElementById('countdownText');

  if (!toast) return;

  syncCountdownSeconds = seconds;
  toast.classList.remove('hidden');
  updateCountdownText();

  syncCountdownTimer = setInterval(() => {
    syncCountdownSeconds--;
    updateCountdownText();

    if (syncCountdownSeconds <= 0) {
      clearInterval(syncCountdownTimer);
      handleSyncNow();
      toast.classList.add('hidden');
    }
  }, 1000);
}

function updateCountdownText() {
  const countdownText = document.getElementById('countdownText');
  if (countdownText) {
    countdownText.textContent = `Syncing in ${syncCountdownSeconds}s...`;
  }
}

function handleCancelSyncCountdown() {
  const toast = document.getElementById('syncCountdownToast');
  if (syncCountdownTimer) {
    clearInterval(syncCountdownTimer);
  }
  if (toast) {
    toast.classList.add('hidden');
  }
}

function showConflictPanel(conflicts) {
  const panel = document.getElementById('conflictPanel');
  const list = document.getElementById('conflictList');

  if (!panel || !list) return;

  panel.classList.remove('hidden');
  list.innerHTML = conflicts.map((file) => `<li>${escapeHtml(file)}</li>`).join('');
}

function hideConflictPanel() {
  const panel = document.getElementById('conflictPanel');
  if (panel) {
    panel.classList.add('hidden');
  }
}
