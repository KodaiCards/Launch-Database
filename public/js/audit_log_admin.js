// public/js/audit_log_admin.js — Read-only admin UI for audit log viewer (Wave 41)
// Paginated list with filters, modal detail view for full before/after jsonb
// Exposed as window.AuditLogAdmin.open()

(function() {
  'use strict';

  // State
  let currentPage = { limit: 50, offset: 0 };
  let currentFilters = {};
  let cachedActions = []; // populated from first page response

  // ─── Pagination & Filtering ────────────────────────────────────────────────

  async function fetchAuditLog() {
    try {
      const params = new URLSearchParams({ limit: currentPage.limit, offset: currentPage.offset });
      Object.entries(currentFilters).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== '') {
          params.append(k, v);
        }
      });

      const res = await fetch(`/api/admin/audit-log?${params}`, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        console.error(`[audit-log] fetch failed: ${res.status}`);
        if (res.status === 401 || res.status === 403) {
          renderTable('<div style="color:var(--danger);padding:20px">Access denied. Admin role required.</div>');
          return;
        }
        renderTable('<div style="color:var(--danger);padding:20px">Failed to load audit log.</div>');
        return;
      }

      const data = await res.json();
      if (!data.rows) {
        renderTable('<div style="color:var(--text-muted);padding:20px">No results.</div>');
        return;
      }

      // Extract unique actions for the filter dropdown
      if (cachedActions.length === 0 && data.rows.length > 0) {
        const uniqueActions = new Set(data.rows.map(r => r.action).filter(Boolean));
        cachedActions = Array.from(uniqueActions).sort();
      }

      renderTable(data.rows, data.total, data.limit, data.offset);
    } catch (err) {
      console.error('[audit-log] error:', err);
      renderTable('<div style="color:var(--danger);padding:20px">Error loading audit log: ' + (err.message || err) + '</div>');
    }
  }

  function renderTable(rowsOrHtml, total, limit, offset) {
    const container = document.getElementById('audit-log-table-body');
    if (!container) return;

    // If passed HTML string (error message), render directly
    if (typeof rowsOrHtml === 'string') {
      container.innerHTML = rowsOrHtml;
      return;
    }

    // Otherwise rowsOrHtml is rows array
    const rows = rowsOrHtml || [];

    if (rows.length === 0) {
      container.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted)">No results.</div>';
      updatePagination(total, limit, offset);
      return;
    }

    let html = '<table style="width:100%;border-collapse:collapse;font-size:13px">';
    html += '<thead style="background:var(--surface-2);border-bottom:1px solid var(--border-weak)">';
    html += '<tr>';
    html += '<th style="padding:8px;text-align:left;font-weight:600">Timestamp</th>';
    html += '<th style="padding:8px;text-align:left;font-weight:600">Actor</th>';
    html += '<th style="padding:8px;text-align:left;font-weight:600">Action</th>';
    html += '<th style="padding:8px;text-align:left;font-weight:600">Entity</th>';
    html += '<th style="padding:8px;text-align:left;font-weight:600">Source</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    rows.forEach(row => {
      const timestamp = row.at ? new Date(row.at).toLocaleString() : '—';
      const actor = row.actor_username || row.actor_user_id || '—';
      const actionLabel = row.action || '—';
      const entityLabel = row.entity_type ? `${row.entity_type}:${row.entity_id || ''}` : '—';
      const sourceLabel = row.source || '—';

      html += '<tr style="border-bottom:1px solid var(--border-weak);cursor:pointer" onmouseover="this.style.background=\'var(--surface-2)\'" onmouseout="this.style.background=\'transparent\'" onclick="auditLogAdmin_showDetail(' + row.id + ')">';
      html += '<td style="padding:8px">' + escapeHtml(timestamp) + '</td>';
      html += '<td style="padding:8px"><span style="font-size:11px;background:var(--primary);color:white;padding:2px 6px;border-radius:3px">' + escapeHtml(actor) + '</span></td>';
      html += '<td style="padding:8px"><code style="background:var(--surface-2);padding:2px 6px;border-radius:3px;font-size:12px">' + escapeHtml(actionLabel) + '</code></td>';
      html += '<td style="padding:8px">' + escapeHtml(entityLabel) + '</td>';
      html += '<td style="padding:8px"><span style="font-size:11px;color:var(--text-muted)">' + escapeHtml(sourceLabel) + '</span></td>';
      html += '</tr>';
    });

    html += '</tbody>';
    html += '</table>';
    container.innerHTML = html;
    updatePagination(total, limit, offset);
  }

  function updatePagination(total, limit, offset) {
    const paginationDiv = document.getElementById('audit-log-pagination');
    if (!paginationDiv) return;

    const from = total === 0 ? 0 : offset + 1;
    const to = Math.min(offset + limit, total);

    let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:12px;color:var(--text-muted)">';
    html += '<span>Showing ' + from + '–' + to + ' of ' + total + '</span>';
    html += '<div>';

    if (offset > 0) {
      html += '<button class="btn btn-secondary btn-sm" onclick="auditLogAdmin_prevPage()" style="margin-right:6px"><i class="fa-solid fa-chevron-left"></i> Prev</button>';
    }

    if (offset + limit < total) {
      html += '<button class="btn btn-secondary btn-sm" onclick="auditLogAdmin_nextPage()">Next <i class="fa-solid fa-chevron-right"></i></button>';
    }

    html += '</div>';
    html += '</div>';

    paginationDiv.innerHTML = html;
  }

  async function showDetailModal(id) {
    const modal = document.getElementById('audit-log-detail-modal');
    if (!modal) return;

    try {
      const res = await fetch(`/api/admin/audit-log/${id}`);
      if (!res.ok) {
        alert('Failed to load audit log detail: ' + res.status);
        return;
      }

      const row = await res.json();
      modal.dataset.rowId = row.id;

      // Format timestamps
      const timestamp = row.at ? new Date(row.at).toLocaleString() : '—';

      // Render detail
      const detailBody = document.getElementById('audit-log-detail-body');
      if (detailBody) {
        let html = '<div style="display:flex;flex-direction:column;gap:12px">';

        // Header info with action buttons
        html += '<div style="border-bottom:1px solid var(--border-weak);padding-bottom:8px">';
        html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">';
        html += '<div>';
        html += '<div style="font-weight:600;margin-bottom:4px">' + escapeHtml(row.action || '—') + '</div>';
        html += '<div style="font-size:12px;color:var(--text-muted)">' + escapeHtml(timestamp) + ' by ' + escapeHtml(row.actor_username || row.actor_user_id || '—') + '</div>';
        html += '</div>';
        html += '<span style="font-size:11px;background:var(--surface-2);padding:4px 8px;border-radius:3px">ID: ' + row.id + '</span>';
        html += '</div>';
        html += '<div style="display:flex;gap:8px;margin-top:8px">';
        html += '<button id="audit-log-edit-btn" style="background:var(--primary);color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:12px"><i class="fa-solid fa-pencil"></i> Edit</button>';
        html += '<button id="audit-log-delete-btn" style="background:var(--danger);color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:12px"><i class="fa-solid fa-trash"></i> Delete</button>';
        html += '<button id="audit-log-save-btn" style="display:none;background:var(--primary);color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:12px"><i class="fa-solid fa-check"></i> Save</button>';
        html += '<button id="audit-log-cancel-btn" style="display:none;background:var(--surface-3);color:var(--text-primary);border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:12px"><i class="fa-solid fa-times"></i> Cancel</button>';
        html += '</div>';
        html += '</div>';

        // Metadata row
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px;color:var(--text-muted)">';
        html += '<div><strong>Actor:</strong> ' + escapeHtml(row.actor_type || '') + ' / ' + escapeHtml(row.actor_username || '') + '</div>';
        html += '<div><strong>Entity:</strong> ' + escapeHtml(row.entity_type || '') + ':' + escapeHtml(row.entity_id || '') + '</div>';
        html += '<div><strong>Source:</strong> ' + escapeHtml(row.source || '') + '</div>';
        html += '<div><strong>IP:</strong> ' + escapeHtml(row.ip || '') + '</div>';
        html += '</div>';

        // Before/after data
        if (row.before_data || row.after_data) {
          html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">';

          if (row.before_data) {
            html += '<div>';
            html += '<div style="font-weight:600;font-size:12px;margin-bottom:4px">Before</div>';
            html += '<pre style="background:var(--surface-2);padding:8px;border-radius:4px;overflow-x:auto;font-size:11px;margin:0">' + escapeHtml(JSON.stringify(row.before_data, null, 2)) + '</pre>';
            html += '</div>';
          }

          if (row.after_data) {
            html += '<div>';
            html += '<div style="font-weight:600;font-size:12px;margin-bottom:4px">After</div>';
            html += '<pre style="background:var(--surface-2);padding:8px;border-radius:4px;overflow-x:auto;font-size:11px;margin:0">' + escapeHtml(JSON.stringify(row.after_data, null, 2)) + '</pre>';
            html += '</div>';
          }

          html += '</div>';
        }

        // Additional meta if present
        if (row.meta) {
          html += '<div>';
          html += '<div style="font-weight:600;font-size:12px;margin-bottom:4px">Additional Metadata</div>';
          html += '<pre style="background:var(--surface-2);padding:8px;border-radius:4px;overflow-x:auto;font-size:11px;margin:0">' + escapeHtml(JSON.stringify(row.meta, null, 2)) + '</pre>';
          html += '</div>';
        }

        html += '</div>';
        detailBody.innerHTML = html;

        // Attach event handlers for Edit/Delete/Save/Cancel buttons
        const editBtn = detailBody.querySelector('#audit-log-edit-btn');
        const deleteBtn = detailBody.querySelector('#audit-log-delete-btn');
        const saveBtn = detailBody.querySelector('#audit-log-save-btn');
        const cancelBtn = detailBody.querySelector('#audit-log-cancel-btn');
        const rowId = modal.dataset.rowId;

        if (editBtn) {
          editBtn.addEventListener('click', () => {
            // Switch to edit mode: hide Edit/Delete, show Save/Cancel
            // Replace JSON display areas with editable textareas
            editBtn.style.display = 'none';
            deleteBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';

            // Convert before_data, after_data, meta to textareas for editing
            const beforePre = detailBody.querySelector('pre');
            if (beforePre) {
              const beforeContent = beforePre.textContent;
              const textarea = document.createElement('textarea');
              textarea.className = 'edit-field-before';
              textarea.style.cssText = 'width:100%;padding:8px;border:1px solid var(--border-weak);border-radius:4px;font-family:monospace;font-size:11px;min-height:120px';
              textarea.value = beforeContent;
              beforePre.replaceWith(textarea);
            }

            // Similar for after_data and meta if they exist
            const allPres = detailBody.querySelectorAll('pre');
            let fieldIndex = 0;
            allPres.forEach(pre => {
              const textarea = document.createElement('textarea');
              textarea.className = fieldIndex === 0 ? 'edit-field-after' : 'edit-field-meta';
              textarea.style.cssText = 'width:100%;padding:8px;border:1px solid var(--border-weak);border-radius:4px;font-family:monospace;font-size:11px;min-height:120px';
              textarea.value = pre.textContent;
              pre.replaceWith(textarea);
              fieldIndex++;
            });
          });
        }

        if (saveBtn) {
          saveBtn.addEventListener('click', async () => {
            try {
              // Collect edited values from textareas
              const updates = {};

              const beforeField = detailBody.querySelector('.edit-field-before');
              const afterField = detailBody.querySelector('.edit-field-after');
              const metaField = detailBody.querySelector('.edit-field-meta');

              if (beforeField) {
                try {
                  updates.before_data = JSON.parse(beforeField.value);
                } catch (e) {
                  alert('Invalid JSON in "Before" field: ' + e.message);
                  return;
                }
              }

              if (afterField) {
                try {
                  updates.after_data = JSON.parse(afterField.value);
                } catch (e) {
                  alert('Invalid JSON in "After" field: ' + e.message);
                  return;
                }
              }

              if (metaField) {
                try {
                  updates.meta = JSON.parse(metaField.value);
                } catch (e) {
                  alert('Invalid JSON in "Additional Metadata" field: ' + e.message);
                  return;
                }
              }

              if (Object.keys(updates).length === 0) {
                alert('No changes to save');
                return;
              }

              // Send PUT request
              const putRes = await fetch(`/api/admin/audit-log/${rowId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
              });

              if (!putRes.ok) {
                const errorData = await putRes.json();
                alert('Failed to update: ' + (errorData.error || putRes.status));
                return;
              }

              alert('Audit log entry updated successfully.');
              closeDetailModal();
              fetchAuditLog(); // Refresh the table
            } catch (err) {
              console.error('[audit-log:save] error:', err);
              alert('Error saving: ' + (err.message || err));
            }
          });
        }

        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => {
            // Re-render the detail view (discard edits)
            showDetailModal(id);
          });
        }

        if (deleteBtn) {
          deleteBtn.addEventListener('click', () => {
            if (confirm('Permanently delete this audit log entry? This action is itself logged.')) {
              (async () => {
                try {
                  const delRes = await fetch(`/api/admin/audit-log/${rowId}`, {
                    method: 'DELETE'
                  });

                  if (!delRes.ok) {
                    const errorData = await delRes.json();
                    alert('Failed to delete: ' + (errorData.error || delRes.status));
                    return;
                  }

                  alert('Audit log entry deleted successfully.');
                  closeDetailModal();
                  fetchAuditLog(); // Refresh the table
                } catch (err) {
                  console.error('[audit-log:delete] error:', err);
                  alert('Error deleting: ' + (err.message || err));
                }
              })();
            }
          });
        }
      }

      // Show modal
      modal.style.display = 'flex';
    } catch (err) {
      console.error('[audit-log:detail] error:', err);
      alert('Error loading detail: ' + (err.message || err));
    }
  }

  // ─── Filter Controls ──────────────────────────────────────────────────────

  function initializeFilters() {
    const actionSelect = document.getElementById('audit-log-action-filter');
    if (actionSelect) {
      // Populate with a set of common actions from migrations/audits
      const commonActions = [
        'user.create',
        'user.update',
        'user.delete',
        'user.auth',
        'project.create',
        'project.update',
        'project.delete',
        'invoice.create',
        'invoice.update',
        'invoice.delete',
        'ai.query'
      ];

      commonActions.forEach(action => {
        const opt = document.createElement('option');
        opt.value = action;
        opt.textContent = action;
        actionSelect.appendChild(opt);
      });
    }
  }

  function applyFilters() {
    currentFilters = {};
    const actionSelect = document.getElementById('audit-log-action-filter');
    const entityTypeInput = document.getElementById('audit-log-entity-type-filter');
    const fromInput = document.getElementById('audit-log-from-filter');
    const toInput = document.getElementById('audit-log-to-filter');
    const searchInput = document.getElementById('audit-log-search-filter');

    if (actionSelect && actionSelect.value) currentFilters.action = actionSelect.value;
    if (entityTypeInput && entityTypeInput.value) currentFilters.entity_type = entityTypeInput.value;
    if (fromInput && fromInput.value) currentFilters.from = fromInput.value;
    if (toInput && toInput.value) currentFilters.to = toInput.value;
    if (searchInput && searchInput.value) currentFilters.search = searchInput.value;

    currentPage = { limit: 50, offset: 0 };
    fetchAuditLog();
  }

  function clearFilters() {
    const actionSelect = document.getElementById('audit-log-action-filter');
    const entityTypeInput = document.getElementById('audit-log-entity-type-filter');
    const fromInput = document.getElementById('audit-log-from-filter');
    const toInput = document.getElementById('audit-log-to-filter');
    const searchInput = document.getElementById('audit-log-search-filter');

    if (actionSelect) actionSelect.value = '';
    if (entityTypeInput) entityTypeInput.value = '';
    if (fromInput) fromInput.value = '';
    if (toInput) toInput.value = '';
    if (searchInput) searchInput.value = '';

    currentFilters = {};
    currentPage = { limit: 50, offset: 0 };
    fetchAuditLog();
  }

  // ─── Pagination ──────────────────────────────────────────────────────────

  function nextPage() {
    currentPage.offset += currentPage.limit;
    fetchAuditLog();
    document.getElementById('audit-log-table-body')?.scrollIntoView({ behavior: 'smooth' });
  }

  function prevPage() {
    currentPage.offset = Math.max(0, currentPage.offset - currentPage.limit);
    fetchAuditLog();
    document.getElementById('audit-log-table-body')?.scrollIntoView({ behavior: 'smooth' });
  }

  // ─── Modal ───────────────────────────────────────────────────────────────

  function closeDetailModal() {
    const modal = document.getElementById('audit-log-detail-modal');
    if (modal) modal.style.display = 'none';
  }

  // ─── Utilities ───────────────────────────────────────────────────────────

  function escapeHtml(text) {
    if (!text) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, c => map[c]);
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  window.auditLogAdmin_nextPage = nextPage;
  window.auditLogAdmin_prevPage = prevPage;
  window.auditLogAdmin_applyFilters = applyFilters;
  window.auditLogAdmin_clearFilters = clearFilters;
  window.auditLogAdmin_showDetail = showDetailModal;
  window.auditLogAdmin_closeDetail = closeDetailModal;

  window.AuditLogAdmin = {
    open: function() {
      // Find or create the audit log container in the Settings modal
      const settingsModalBody = document.querySelector('.modal-body');
      if (!settingsModalBody) {
        console.warn('[audit-log] Settings modal body not found');
        return;
      }

      // Check if already open
      let container = document.getElementById('audit-log-container');
      if (!container) {
        // Create the container
        container = document.createElement('div');
        container.id = 'audit-log-container';
        container.className = 'settings-section';
        container.style.marginTop = '24px';

        container.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <h4 style="font-size:14px;font-weight:600;margin:0"><i class="fa-solid fa-receipt" style="margin-right:6px;color:var(--text-muted)"></i>Audit Log</h4>
            <button class="btn btn-secondary btn-sm" onclick="auditLogAdmin_applyFilters()"><i class="fa-solid fa-rotate"></i> Refresh</button>
          </div>
          <p style="font-size:12px;color:var(--text-muted);margin:0 0 12px 0">Government-grade compliance trail. View all user actions, project changes, invoice generations, and AI tool executions. Rows cannot be deleted.</p>

          <!-- Filters -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:12px;align-items:flex-end">
            <div>
              <label style="display:block;font-size:11px;font-weight:600;color:var(--text-muted);margin-bottom:4px">Action</label>
              <select id="audit-log-action-filter" style="width:100%;padding:6px;border:1px solid var(--border-weak);border-radius:4px;background:var(--surface-1);color:var(--text-1);font-size:12px">
                <option value="">All actions</option>
              </select>
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;color:var(--text-muted);margin-bottom:4px">Entity Type</label>
              <input type="text" id="audit-log-entity-type-filter" placeholder="e.g. project" style="width:100%;padding:6px;border:1px solid var(--border-weak);border-radius:4px;background:var(--surface-1);color:var(--text-1);font-size:12px">
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;color:var(--text-muted);margin-bottom:4px">Date From</label>
              <input type="date" id="audit-log-from-filter" style="width:100%;padding:6px;border:1px solid var(--border-weak);border-radius:4px;background:var(--surface-1);color:var(--text-1);font-size:12px">
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:600;color:var(--text-muted);margin-bottom:4px">Date To</label>
              <input type="date" id="audit-log-to-filter" style="width:100%;padding:6px;border:1px solid var(--border-weak);border-radius:4px;background:var(--surface-1);color:var(--text-1);font-size:12px">
            </div>
          </div>

          <div style="display:flex;gap:8px;margin-bottom:12px">
            <input type="text" id="audit-log-search-filter" placeholder="Search: action, entity type, actor username..." style="flex:1;padding:6px;border:1px solid var(--border-weak);border-radius:4px;background:var(--surface-1);color:var(--text-1);font-size:12px">
            <button class="btn btn-primary btn-sm" onclick="auditLogAdmin_applyFilters()"><i class="fa-solid fa-magnifying-glass"></i> Apply</button>
            <button class="btn btn-secondary btn-sm" onclick="auditLogAdmin_clearFilters()"><i class="fa-solid fa-times"></i> Clear</button>
          </div>

          <!-- Table -->
          <div id="audit-log-table-body" style="font-size:13px;border:1px solid var(--border-weak);border-radius:4px;overflow-x:auto">
            <div style="padding:20px;text-align:center;color:var(--text-muted)"><i class="fa-solid fa-spinner fa-spin"></i> Loading…</div>
          </div>

          <!-- Pagination -->
          <div id="audit-log-pagination"></div>
        `;

        // Insert into Settings modal
        settingsModalBody.appendChild(container);

        // Initialize filters and fetch data
        initializeFilters();
        fetchAuditLog();
      } else {
        // Already exists, refresh the data
        fetchAuditLog();
      }
    }
  };

  // Also create the detail modal (hidden by default, shared across the app)
  function ensureDetailModal() {
    if (document.getElementById('audit-log-detail-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'audit-log-detail-modal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.zIndex = '10000';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.padding = '20px';

    modal.innerHTML = `
      <div style="background:var(--surface-1);border-radius:8px;max-width:900px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 4px 20px rgba(0,0,0,0.3)">
        <div style="padding:20px;border-bottom:1px solid var(--border-weak);display:flex;justify-content:space-between;align-items:center">
          <h3 style="margin:0;font-size:16px">Audit Log Entry Detail</h3>
          <button style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted)" onclick="auditLogAdmin_closeDetail()"><i class="fa-solid fa-times"></i></button>
        </div>
        <div style="padding:20px" id="audit-log-detail-body">
          <div style="text-align:center;color:var(--text-muted)"><i class="fa-solid fa-spinner fa-spin"></i> Loading…</div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  // Ensure detail modal exists when module loads
  document.addEventListener('DOMContentLoaded', ensureDetailModal);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureDetailModal);
  } else {
    ensureDetailModal();
  }
})();
