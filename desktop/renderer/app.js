let currentSession = null;

document.addEventListener('DOMContentLoaded', async () => {
  await initializeApp();
  setupEventListeners();
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
