// Client Portal v1 — project status + documents + approvals

(function() {
  let clientOrg = null;
  let clientUser = null;

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

  // Tab navigation
  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        switchTab(tabName);
      });
    });
  }

  function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    const tabEl = document.getElementById(tabName + '-tab');
    const btnEl = document.querySelector(`[data-tab="${tabName}"]`);
    if (tabEl) tabEl.style.display = 'block';
    if (btnEl) btnEl.classList.add('active');

    // Load content if first time
    if (tabName === 'documents' && !document.getElementById('documents-container').dataset.loaded) {
      loadDocuments();
      document.getElementById('documents-container').dataset.loaded = 'true';
    } else if (tabName === 'approvals' && !document.getElementById('approvals-container').dataset.loaded) {
      loadApprovals();
      document.getElementById('approvals-container').dataset.loaded = 'true';
    }
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
      clientOrg = meData.client_org;
      clientUser = meData.client_user;

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

  // Load and render documents
  async function loadDocuments() {
    const loadingEl = document.getElementById('documents-loading');
    const emptyEl = document.getElementById('documents-empty');
    const containerEl = document.getElementById('documents-container');
    const errorEl = document.getElementById('documents-error');

    try {
      const res = await fetch('/api/client/documents', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load documents');

      const { documents, projects } = await res.json();

      loadingEl.style.display = 'none';
      errorEl.style.display = 'none';

      // Populate project selector
      if (document.getElementById('project-select') && projects) {
        const select = document.getElementById('project-select');
        projects.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.textContent = escHtml(p.name);
          select.appendChild(opt);
        });
      }

      if (!documents || documents.length === 0) {
        emptyEl.style.display = 'flex';
        containerEl.style.display = 'none';
        return;
      }

      // Render documents list
      const listEl = document.getElementById('documents-list');
      if (listEl) {
        listEl.innerHTML = '';
        documents.forEach(doc => {
          const row = document.createElement('div');
          row.className = 'document-row';
          row.innerHTML = `
            <div class="doc-info">
              <div class="doc-name"><i class="fa-solid fa-file"></i> ${escHtml(doc.filename)}</div>
              <div class="doc-meta">${escHtml(doc.mime_type)} • ${(doc.size_bytes / 1024).toFixed(1)} KB • ${formatDate(doc.created_at)}</div>
              ${doc.notes ? `<div class="doc-notes">${escHtml(doc.notes)}</div>` : ''}
            </div>
            <a href="/api/client/documents/${doc.id}/download" download="${escHtml(doc.filename)}" class="btn-small">
              <i class="fa-solid fa-download"></i> Download
            </a>
          `;
          listEl.appendChild(row);
        });
      }

      containerEl.style.display = 'block';
      emptyEl.style.display = 'none';
    } catch (e) {
      console.error('Documents load error:', e);
      loadingEl.style.display = 'none';
      containerEl.style.display = 'none';
      const msg = document.getElementById('documents-error-message');
      if (msg) msg.textContent = e.message;
      errorEl.style.display = 'flex';
    }
  }

  // Load and render approvals
  async function loadApprovals() {
    const loadingEl = document.getElementById('approvals-loading');
    const emptyEl = document.getElementById('approvals-empty');
    const containerEl = document.getElementById('approvals-container');
    const errorEl = document.getElementById('approvals-error');

    try {
      const res = await fetch('/api/client/approvals', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load approvals');

      const { approvals } = await res.json();

      loadingEl.style.display = 'none';
      errorEl.style.display = 'none';

      if (!approvals || approvals.length === 0) {
        emptyEl.style.display = 'flex';
        containerEl.style.display = 'none';
        return;
      }

      // Split pending and responded
      const pending = approvals.filter(a => a.status === 'pending');
      const responded = approvals.filter(a => a.status === 'responded');

      // Render pending approvals
      const pendingSection = document.getElementById('pending-approvals');
      if (pendingSection) {
        pendingSection.innerHTML = '<h3>Pending Approvals</h3>';
        const listEl = document.createElement('div');
        listEl.className = 'approvals-list';

        pending.forEach(app => {
          const row = document.createElement('div');
          row.className = 'approval-row';
          row.innerHTML = `
            <div class="approval-info">
              <div class="approval-title">${escHtml(app.title)}</div>
              ${app.description ? `<div class="approval-desc">${escHtml(app.description)}</div>` : ''}
              <div class="approval-date">Requested ${formatDate(app.requested_at)}</div>
            </div>
            <button class="btn-approve" data-id="${app.id}">
              <i class="fa-solid fa-check"></i> Respond
            </button>
          `;
          listEl.appendChild(row);
        });

        pendingSection.appendChild(listEl);

        // Wire up respond buttons
        pendingSection.querySelectorAll('.btn-approve').forEach(btn => {
          btn.addEventListener('click', () => showApprovalModal(btn.dataset.id, pending));
        });
      }

      // Render responded approvals
      if (responded.length > 0) {
        const respondedSection = document.getElementById('responded-approvals');
        const respondedList = document.getElementById('responded-list');
        respondedSection.style.display = 'block';
        respondedList.innerHTML = '';

        responded.forEach(app => {
          const row = document.createElement('div');
          row.className = 'approval-row completed';
          const respClass = 'response-' + (app.response || 'pending');
          row.innerHTML = `
            <div class="approval-info">
              <div class="approval-title">${escHtml(app.title)}</div>
              ${app.description ? `<div class="approval-desc">${escHtml(app.description)}</div>` : ''}
              <div class="approval-response ${respClass}">
                Response: <strong>${escHtml(app.response || 'Pending')}</strong>
                ${app.response_notes ? `<div class="response-notes">${escHtml(app.response_notes)}</div>` : ''}
              </div>
            </div>
          `;
          respondedList.appendChild(row);
        });
      }

      containerEl.style.display = 'block';
      emptyEl.style.display = 'none';

      // Update badge
      const badge = document.getElementById('approvals-badge');
      if (badge) {
        if (pending.length > 0) {
          badge.textContent = pending.length;
          badge.style.display = 'inline';
        }
      }
    } catch (e) {
      console.error('Approvals load error:', e);
      loadingEl.style.display = 'none';
      containerEl.style.display = 'none';
      const msg = document.getElementById('approvals-error-message');
      if (msg) msg.textContent = e.message;
      errorEl.style.display = 'flex';
    }
  }

  // Show approval response modal
  function showApprovalModal(approvalId, pendingList) {
    const app = pendingList.find(a => a.id === approvalId);
    if (!app) return;

    const html = `
      <div class="modal-overlay" id="approval-modal">
        <div class="modal-dialog">
          <h2>Respond to Approval Request</h2>
          <p>${escHtml(app.title)}</p>
          <form id="approval-form">
            <div class="form-group">
              <label>Your Response:</label>
              <div class="radio-group">
                <label><input type="radio" name="response" value="approved" required> Approved</label>
                <label><input type="radio" name="response" value="rejected"> Rejected</label>
                <label><input type="radio" name="response" value="changes_requested"> Request Changes</label>
              </div>
            </div>
            <div class="form-group">
              <label for="resp-notes">Notes:</label>
              <textarea id="resp-notes" name="response_notes" class="form-textarea" placeholder="Optional notes..." rows="3"></textarea>
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn-primary">Submit</button>
              <button type="button" class="btn-secondary" id="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const modalEl = document.createElement('div');
    modalEl.innerHTML = html;
    document.body.appendChild(modalEl);

    const form = document.getElementById('approval-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const modal = document.getElementById('approval-modal');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const response = form.response.value;
      const responseNotes = form.response_notes.value;

      try {
        const res = await fetch(`/api/client/approvals/${approvalId}/respond`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ response, response_notes: responseNotes }),
        });

        if (!res.ok) throw new Error('Failed to submit response');

        modal.parentElement.removeChild(modal);
        loadApprovals();
      } catch (e) {
        alert('Error: ' + e.message);
      }
    });

    cancelBtn.addEventListener('click', () => {
      modal.parentElement.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.parentElement.removeChild(modal);
      }
    });
  }

  // Init on load
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTabs();
    loadProjects();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', doLogout);
    }

    // Wire up document upload
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
      uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('file-input');
        const projectSelect = document.getElementById('project-select');
        const notesInput = document.getElementById('notes-input');

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        if (projectSelect.value) formData.append('project_id', projectSelect.value);
        if (notesInput.value) formData.append('notes', notesInput.value);

        try {
          const res = await fetch('/api/client/documents', {
            method: 'POST',
            credentials: 'include',
            body: formData,
          });

          if (!res.ok) throw new Error('Upload failed');

          fileInput.value = '';
          notesInput.value = '';
          loadDocuments();
          alert('Document uploaded successfully!');
        } catch (e) {
          alert('Error: ' + e.message);
        }
      });
    }
  });
})();
