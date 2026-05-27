// Client Portal v1 — read-only project status view

(function() {
  // Theme toggle
  function initTheme() {
    const btn = document.getElementById('theme-btn');
    let saved;
    try {
      saved = localStorage.getItem('lfs-client-theme');
    } catch (e) {}

    if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      updateThemeIcon();
    }

    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
      updateThemeIcon();
      try {
        localStorage.setItem('lfs-client-theme', isDark ? 'light' : 'dark');
      } catch (e) {}
    });
  }

  function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const icon = document.getElementById('theme-btn').querySelector('i');
    icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  // Logout
  async function doLogout() {
    try {
      await fetch('/client/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error('Logout error:', e);
    }
    window.location.href = '/login.html';
  }

  // Format date as YYYY-MM-DD
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
  }

  // Escape HTML
  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Load and render projects
  async function loadProjects() {
    const loadingEl = document.getElementById('loading-state');
    const errorEl = document.getElementById('error-state');
    const emptyEl = document.getElementById('empty-state');
    const containerEl = document.getElementById('projects-container');

    try {
      // Get current user + org
      const meRes = await fetch('/api/client/me', { credentials: 'include' });
      if (meRes.status === 401) {
        window.location.href = '/login.html';
        return;
      }
      if (!meRes.ok) {
        throw new Error('Failed to load user info');
      }

      const meData = await meRes.json();
      const clientOrg = meData.client_org;
      const clientUser = meData.client_user;

      // Set org name and logo
      const orgNameEl = document.getElementById('org-name');
      const logoEl = document.getElementById('org-logo');
      if (orgNameEl) orgNameEl.textContent = escHtml(clientOrg.name || 'Client Portal');
      if (logoEl) {
        logoEl.src = clientOrg.logo_url || '';
        if (!clientOrg.logo_url) logoEl.style.display = 'none';
      }

      // Apply theme color if available
      if (clientOrg.theme_color) {
        const root = document.documentElement;
        root.style.setProperty('--primary', clientOrg.theme_color);
      }

      // Get projects
      const projRes = await fetch('/api/client/projects', { credentials: 'include' });
      if (!projRes.ok) {
        throw new Error('Failed to load projects');
      }

      const projData = await projRes.json();
      const projects = projData.projects || [];

      loadingEl.style.display = 'none';
      errorEl.style.display = 'none';

      if (projects.length === 0) {
        emptyEl.style.display = 'flex';
        containerEl.style.display = 'none';
        return;
      }

      // Group by contract
      const byContract = {};
      projects.forEach(p => {
        const ecId = p.engineering_contract_id;
        if (!byContract[ecId]) {
          byContract[ecId] = { contractId: p.contract_id, projects: [] };
        }
        byContract[ecId].projects.push(p);
      });

      // Render grouped projects
      containerEl.innerHTML = '';
      Object.entries(byContract).forEach(([ecId, group]) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'contract-group';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'contract-header';
        headerDiv.textContent = escHtml(group.contractId || 'Contract');
        groupDiv.appendChild(headerDiv);

        const listDiv = document.createElement('div');
        listDiv.className = 'project-list';

        group.projects.forEach(p => {
          const row = document.createElement('div');
          row.className = 'project-row';

          // Program badge
          const prog = (p.program || 'other').toLowerCase();
          const progBadgeClass = ['rus', 'bau', 'gfr'].includes(prog) ? prog : 'other';

          // Status badge
          const status = (p.status || 'pending').toLowerCase();
          const statusClass =
            status === 'active'
              ? 'status-active'
              : status === 'completed'
              ? 'status-completed'
              : status === 'pending'
              ? 'status-pending'
              : 'status-other';

          row.innerHTML = `
            <div>
              <div class="project-name">${escHtml(p.name)}</div>
              <div class="project-sa">${escHtml(p.service_area_name || '—')}</div>
            </div>
            <span class="program-badge ${progBadgeClass}">${escHtml(p.program || 'Other')}</span>
            <span class="status-badge ${statusClass}">${escHtml(p.status || 'Pending')}</span>
            <span class="project-date">${formatDate(p.created_at)}</span>
          `;

          listDiv.appendChild(row);
        });

        groupDiv.appendChild(listDiv);
        containerEl.appendChild(groupDiv);
      });

      containerEl.style.display = 'flex';
      emptyEl.style.display = 'none';
    } catch (e) {
      console.error('Load error:', e);
      loadingEl.style.display = 'none';
      emptyEl.style.display = 'none';
      containerEl.style.display = 'none';

      const errorMsg = document.getElementById('error-message');
      if (errorMsg) {
        errorMsg.textContent = e.message || 'An error occurred. Please try again.';
      }
      errorEl.style.display = 'flex';
    }
  }

  // Init on load
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadProjects();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', doLogout);
    }
  });
})();
