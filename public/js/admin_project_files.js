/**
 * Wave 61: Admin Project Files Module
 *
 * Loads and renders workspace folders attached to a project.
 * Exposes window.AdminProjectFiles.load(projectId)
 */

window.AdminProjectFiles = (function() {

  /**
   * Load and render project-linked workspace folders
   * @param {string} projectId - UUID of the project
   */
  async function load(projectId) {
    if (!projectId) {
      console.warn('AdminProjectFiles.load: projectId required');
      return;
    }

    const listEl = document.getElementById('proj-files-list');
    const countEl = document.getElementById('proj-files-count');

    if (!listEl) {
      console.warn('AdminProjectFiles.load: proj-files-list element not found');
      return;
    }

    try {
      const data = await api(`/api/workspace/by-project/${projectId}`);
      const { folders } = data;

      if (!folders || folders.length === 0) {
        listEl.innerHTML = `
          <div style="padding:12px;text-align:center;color:var(--text-muted);font-size:13px">
            No files attached to this project yet.
            <a href="/workspace/" target="_blank" style="color:var(--primary)">Attach in the Workspace tab</a>.
          </div>
        `;
        countEl.textContent = '(0)';
        return;
      }

      // Update count badge
      countEl.textContent = `(${folders.length})`;

      // Render each folder as a collapsible card
      let html = '';
      folders.forEach((folder, idx) => {
        const folderId = `folder-${idx}`;
        const files = folder.files || [];
        const truncated = folder.file_count > files.length;

        html += `
          <div style="margin-bottom:12px;border:1px solid var(--gray-border);border-radius:6px;overflow:hidden">
            <div
              style="padding:10px 12px;background:var(--gray-light);cursor:pointer;display:flex;justify-content:space-between;align-items:center"
              onclick="this.parentElement.querySelector('.folder-files-${idx}').style.display =
                       this.parentElement.querySelector('.folder-files-${idx}').style.display === 'none' ? 'block' : 'none';
                       this.querySelector('i').classList.toggle('fa-chevron-right');
                       this.querySelector('i').classList.toggle('fa-chevron-down');"
            >
              <div style="display:flex;align-items:center;gap:8px;font-weight:600">
                <i class="fa-solid fa-chevron-down" style="font-size:11px;color:var(--text-muted)"></i>
                <i class="fa-solid fa-folder" style="color:var(--primary);font-size:13px"></i>
                ${esc(folder.name)}
              </div>
              <span style="font-size:11px;color:var(--text-muted);background:var(--white);padding:2px 6px;border-radius:4px">
                ${folder.file_count} ${folder.file_count === 1 ? 'file' : 'files'}
              </span>
            </div>

            <div class="folder-files-${idx}" style="display:block">
              ${files.length > 0 ? `
                <table style="width:100%;font-size:12px;border-collapse:collapse">
                  <tbody>
                    ${files.map(file => `
                      <tr style="border-top:1px solid var(--gray-border)">
                        <td style="padding:8px 12px;flex:1;color:var(--text);word-break:break-word">
                          <a href="/api/workspace/files/${escUrl(file.id)}/download" target="_blank" style="color:var(--primary);text-decoration:none;font-weight:500">
                            ${esc(file.filename || 'file')}
                          </a>
                        </td>
                        <td style="padding:8px 12px;text-align:right;color:var(--text-muted);white-space:nowrap;padding-left:20px">
                          ${file.size_bytes ? (file.size_bytes / 1024 / 1024).toFixed(1) + ' MB' : '—'}
                        </td>
                        <td style="padding:8px 12px;text-align:right;color:var(--text-muted);white-space:nowrap;font-size:11px;padding-left:20px">
                          ${file.uploaded_at ? new Date(file.uploaded_at).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : ''}

              ${truncated ? `
                <div style="padding:8px 12px;border-top:1px solid var(--gray-border);color:var(--text-muted);font-size:11px">
                  … and ${folder.file_count - files.length} more.
                  <a href="/workspace/" target="_blank" style="color:var(--primary)">View all in Workspace</a>.
                </div>
              ` : ''}

              ${files.length === 0 ? `
                <div style="padding:12px;text-align:center;color:var(--text-muted);font-size:12px">
                  No files in this folder yet
                </div>
              ` : ''}
            </div>
          </div>
        `;
      });

      listEl.innerHTML = html;
    } catch (err) {
      console.error('AdminProjectFiles.load error:', err);
      listEl.innerHTML = `
        <div class="alert alert-warn" style="font-size:12px">
          <i class="fa-solid fa-triangle-exclamation"></i> Failed to load files: ${esc(err.message)}
        </div>
      `;
      countEl.textContent = '(0)';
    }
  }

  return {
    load
  };
})();
