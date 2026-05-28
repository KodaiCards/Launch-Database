(function(){'use strict';let currentUser=null;let currentFolderId=null;let selectedItems=new Set();document.addEventListener('DOMContentLoaded',async()=>{try{const meRes=await fetch('/api/auth/me',{credentials:'include'});if(meRes.status===401){window.location.href='/';return;}currentUser=await meRes.json();if(!currentUser.id)throw new Error('No user ID');await loadTree();await loadTrash();setupEventListeners();renderFileTable([]);}catch(err){console.error('Init failed:',err);showToast(`Failed to initialize: ${err.message}`,'error');}});async function loadTree(){try{const res=await fetch('/api/workspace/tree',{credentials:'include'});if(!res.ok)throw new Error(`HTTP ${res.status}`);const data=await res.json();const usersTree=document.getElementById('users-tree');usersTree.innerHTML='';if(data.users&&data.users.length>0){data.users.forEach(user=>{usersTree.appendChild(createTreeItem(user,'user'));})}else{usersTree.innerHTML='<div class="tree-item disabled"><small>No users</small></div>';}const sharedTree=document.getElementById('shared-tree');sharedTree.innerHTML='';if(data.shared&&data.shared.length>0){data.shared.forEach(folder=>{sharedTree.appendChild(createTreeItem(folder,'shared'));})}else{sharedTree.innerHTML='<div class="tree-item disabled"><small>No shared folders</small></div>';}}catch(err){console.error('Load tree failed:',err);showToast(`Failed to load tree: ${err.message}`,'error');}}function createTreeItem(folder,type){const div=document.createElement('div');div.className='tree-item';div.dataset.folderId=folder.id;div.dataset.folderName=folder.name;let icon='fa-folder';if(type==='user')icon='fa-user';else if(folder.kind==='shared_public')icon='fa-globe';else if(folder.kind==='shared_managers')icon='fa-lock';const hasChildren=folder.children&&folder.children.length>0;const toggle=hasChildren?`<span class="tree-toggle">▶</span>`:'<span class="tree-toggle"></span>';div.innerHTML=`${toggle}<i class="fas ${icon} tree-item-icon"></i>${escapeHtml(folder.name)}`;div.addEventListener('click',(e)=>{if(e.target.closest('.tree-toggle')){e.stopPropagation();toggleSubfolders(div,folder);}else{selectTreeItem(div,folder.id);}});return div;}function toggleSubfolders(treeItemEl,folder){const toggle=treeItemEl.querySelector('.tree-toggle');const isOpen=toggle.classList.contains('open');if(isOpen){toggle.classList.remove('open');toggle.textContent='▶';const childrenDiv=treeItemEl.nextElementSibling;if(childrenDiv&&childrenDiv.classList.contains('tree-children')){childrenDiv.remove();}}else{toggle.classList.add('open');toggle.textContent='▼';if(folder.children&&folder.children.length>0){const childrenDiv=document.createElement('div');childrenDiv.className='tree-children';folder.children.forEach(child=>{childrenDiv.appendChild(createTreeItem(child,'shared'));});treeItemEl.insertAdjacentElement('afterend',childrenDiv);}}}function selectTreeItem(element,folderId){document.querySelectorAll('.tree-item.active').forEach(el=>{el.classList.remove('active');});element.classList.add('active');currentFolderId=folderId;loadFolderContents(folderId);updateDetailsPanel(folderId);}async function loadFolderContents(folderId){try{const res=await fetch(`/api/workspace/folders/${folderId}/files`,{credentials:'include'});if(!res.ok)throw new Error(`HTTP ${res.status}`);const files=await res.json();renderFileTable(files);updateBreadcrumb(folderId);updateButtonStates();}catch(err){console.error('Load folder failed:',err);showToast(`Failed to load folder: ${err.message}`,'error');}}function renderFileTable(files){const tbody=document.getElementById('file-table-body');selectedItems.clear();if(!files||files.length===0){tbody.innerHTML='<tr class="loading-row"><td colspan="7" class="loading">Folder is empty</td></tr>';return;}tbody.innerHTML='';files.forEach(file=>{const tr=document.createElement('tr');tr.className='file-row';tr.dataset.fileId=file.id;const isFolder=file.kind==='folder';const icon=isFolder?'fa-folder':getFileIcon(file.name);const typeLabel=isFolder?'Folder':'File';const size=isFolder?'—':formatBytes(file.size||0);const uploadedBy=file.uploaded_by||'—';const uploadedAt=formatDate(file.created_at);tr.innerHTML=`<td style="width:3rem;"><input type="checkbox" class="file-checkbox" data-file-id="${file.id}" /></td><td><i class="fas ${icon}"></i> <span class="file-name" onclick="window.openFolder&&window.openFolder('${file.id}')">${escapeHtml(file.name)}</span></td><td style="width:6rem;">${typeLabel}</td><td style="width:8rem;">${size}</td><td style="width:12rem;">${uploadedBy}</td><td style="width:10rem;">${uploadedAt}</td><td style="width:12rem;"><button class="btn btn-sm btn-secondary" onclick="window.downloadFile&&window.downloadFile('${file.id}')"><i class="fas fa-download"></i></button>${!isFolder?`<button class="btn btn-sm btn-secondary" onclick="window.showVersionHistory&&window.showVersionHistory('${file.id}')"><i class="fas fa-history"></i></button>`:''}</td>`;tr.addEventListener('click',(e)=>{if(e.target.closest('input[type="checkbox"]')){const checkbox=e.target;if(checkbox.checked){selectedItems.add(file.id);}else{selectedItems.delete(file.id);}updateButtonStates();}else if(!e.target.closest('button')){const checkbox=tr.querySelector('input[type="checkbox"]');checkbox.checked=!checkbox.checked;if(checkbox.checked){selectedItems.add(file.id);}else{selectedItems.delete(file.id);}updateButtonStates();}});tbody.appendChild(tr);});window.openFolder=loadFolderContents;window.downloadFile=downloadFile;window.showVersionHistory=showVersionHistory;}function updateBreadcrumb(folderId){const breadcrumbItems=document.getElementById('breadcrumb-items');breadcrumbItems.innerHTML='';const folderName=findFolderNameInTree(folderId);if(folderName&&folderId!=='root'){const span=document.createElement('span');span.className='breadcrumb-separator';span.textContent=' / ';breadcrumbItems.appendChild(span);const link=document.createElement('a');link.className='breadcrumb-link';link.href='#';link.textContent=folderName;breadcrumbItems.appendChild(link);}}function findFolderNameInTree(folderId){const treeItems=document.querySelectorAll('.tree-item.active');if(treeItems.length>0){return treeItems[0].dataset.folderName;}return null;}function updateDetailsPanel(folderId){const detailsContent=document.getElementById('details-content');const folderName=findFolderNameInTree(folderId);detailsContent.innerHTML=`<div class="details-item"><label>Folder Name</label><p>${escapeHtml(folderName||'Unknown')}</p></div><div class="details-item"><label>Share Mode</label><select onchange=""><option value="private">Private</option><option value="public">Public</option><option value="specific">Specific Users</option></select></div>`;}function downloadFile(fileId){window.location.href=`/api/workspace/files/${fileId}/download`;}async function showVersionHistory(fileId) {
  try {
    const res = await fetch(`/api/workspace/files/${fileId}/versions`, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const versions = await res.json();
    const fileNameEl = document.querySelector('[data-file-id="' + fileId + '"] .file-name');
    const fileName = fileNameEl ? fileNameEl.textContent : 'File';
    renderVersionModal(fileId, fileName, versions);
  } catch (err) {
    console.error('Show version history failed:', err);
    showToast(`Failed to load version history: ${err.message}`, 'error');
  }
}

function renderVersionModal(fileId, fileName, versions) {
  const filenameSpan = document.getElementById('version-modal-filename');
  filenameSpan.textContent = fileName;

  const versionList = document.getElementById('version-list');
  versionList.innerHTML = '';

  if (!versions || versions.length === 0) {
    versionList.innerHTML = '<p class="text-muted">No prior versions. This file is the only version.</p>';
  } else {
    versions.forEach((ver, idx) => {
      const div = document.createElement('div');
      div.className = 'version-row';
      if (idx === 0) {
        div.classList.add('current');
      }

      const badge = idx === 0 ? '<span class="badge">Current</span>' : '';
      const uploadedByText = ver.uploaded_by ? escapeHtml(ver.uploaded_by) : 'Unknown';
      const uploadedAtText = formatDate(ver.created_at);

      div.innerHTML = `
        <div class="version-meta">
          ${badge}
          <p><strong>${uploadedByText}</strong> — ${uploadedAtText} — ${formatBytes(ver.size)}</p>
        </div>
        <div class="version-actions">
          <button class="btn btn-sm btn-secondary" onclick="downloadFileVersion('${fileId}', '${ver.id}')" title="Download this version">
            <i class="fas fa-download"></i> Download
          </button>
          ${idx === 0 ? '' : `<button class="btn btn-sm btn-primary" onclick="confirmRestoreVersion('${fileId}', '${ver.id}', '${escapeHtml(uploadedByText)}', '${escapeHtml(uploadedAtText)}')" title="Restore this version">
            <i class="fas fa-undo"></i> Restore
          </button>`}
        </div>
      `;

      versionList.appendChild(div);
    });
  }

  openModal('version-history-modal');
}

function downloadFileVersion(fileId, versionId) {
  window.location.href = `/api/workspace/files/${fileId}/versions/${versionId}/download`;
}

function confirmRestoreVersion(fileId, versionId, uploadedBy, uploadedAt) {
  const message = document.getElementById('restore-version-message');
  message.innerHTML = `Restore version uploaded by <strong>${uploadedBy}</strong> on <strong>${uploadedAt}</strong>?<br>Current version will be snapshotted as a new version.`;

  const submitBtn = document.getElementById('restore-version-submit');
  submitBtn.onclick = async () => {
    try {
      const res = await fetch(`/api/workspace/files/${fileId}/restore/${versionId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      showToast('Version restored successfully', 'success');
      closeModal('restore-version-modal');
      closeModal('version-history-modal');
      if (currentFolderId) {
        await loadFolderContents(currentFolderId);
      }
    } catch (err) {
      console.error('Restore failed:', err);
      showToast(`Failed to restore version: ${err.message}`, 'error');
    }
  };

  openModal('restore-version-modal');
}function updateButtonStates(){const shareBtn=document.getElementById('share-btn');const deleteBtn=document.getElementById('delete-btn');const hasSelection=selectedItems.size>0;shareBtn.disabled=!hasSelection;deleteBtn.disabled=!hasSelection;}function setupEventListeners(){document.querySelectorAll('.collapse-toggle').forEach(btn=>{btn.addEventListener('click',(e)=>{const section=btn.dataset.section;const list=document.getElementById(`${section}-tree`);list.classList.toggle('collapsed');});});document.getElementById('new-folder-btn').addEventListener('click',()=>{openModal('new-folder-modal');});document.getElementById('upload-file-btn').addEventListener('click',()=>{document.getElementById('file-upload-input').click();});document.getElementById('file-upload-input').addEventListener('change',async(e)=>{const file=e.target.files[0];if(!file||!currentFolderId)return;const formData=new FormData();formData.append('file',file);try{const res=await fetch(`/api/workspace/folders/${currentFolderId}/files`,{method:'POST',credentials:'include',body:formData,});if(!res.ok)throw new Error(`HTTP ${res.status}`);showToast('File uploaded successfully','success');await loadFolderContents(currentFolderId);}catch(err){console.error('Upload failed:',err);showToast(`Upload failed: ${err.message}`,'error');}});document.getElementById('share-btn').addEventListener('click',()=>{openModal('share-modal');});document.getElementById('delete-btn').addEventListener('click',()=>{if(selectedItems.size>0){const firstId=Array.from(selectedItems)[0];const firstName=document.querySelector(`[data-file-id="${firstId}"] .file-name`)?.textContent||'item';confirmDelete(firstId,'file',firstName);}});document.getElementById('create-folder-submit').addEventListener('click',async()=>{const name=document.getElementById('new-folder-name').value.trim();if(!name||!currentFolderId)return;try{const res=await fetch('/api/workspace/folders',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({parent_id:currentFolderId,name}),});if(!res.ok)throw new Error(`HTTP ${res.status}`);showToast('Folder created successfully','success');closeModal('new-folder-modal');await loadFolderContents(currentFolderId);}catch(err){console.error('Create folder failed:',err);showToast(`Failed to create folder: ${err.message}`,'error');}});document.querySelectorAll('.modal-close').forEach(btn=>{btn.addEventListener('click',(e)=>{const modal=e.target.closest('.modal');if(modal)closeModal(modal.id);});});document.getElementById('select-all-checkbox').addEventListener('change',(e)=>{const checkboxes=document.querySelectorAll('.file-checkbox');checkboxes.forEach(cb=>{cb.checked=e.target.checked;if(e.target.checked){selectedItems.add(cb.dataset.fileId);}else{selectedItems.delete(cb.dataset.fileId);}});updateButtonStates();});document.getElementById('share-mode').addEventListener('change',(e)=>{const specificGroup=document.getElementById('specific-users-group');specificGroup.style.display=e.target.value==='specific'?'block':'none';});document.querySelector('.toggle-tree-btn').addEventListener('click',()=>{document.querySelector('.tree-panel').classList.toggle('collapsed');});document.querySelector('.back-to-launcher').addEventListener('click',(e)=>{e.preventDefault();window.location.href='/';});document.querySelector('.details-close').addEventListener('click',()=>{document.querySelector('.details-panel').classList.toggle('collapsed');});}function confirmDelete(itemId,type,name){const message=document.getElementById('delete-message');message.textContent=`Are you sure you want to delete "${escapeHtml(name)}"? This cannot be undone.`;const submitBtn=document.getElementById('delete-submit');submitBtn.onclick=async()=>{try{const endpoint=type==='file'?`/api/workspace/files/${itemId}`:`/api/workspace/folders/${itemId}`;const res=await fetch(endpoint,{method:'DELETE',credentials:'include',});if(!res.ok)throw new Error(`HTTP ${res.status}`);showToast('Item deleted successfully','success');closeModal('delete-modal');if(currentFolderId){await loadFolderContents(currentFolderId);}}catch(err){console.error('Delete failed:',err);showToast(`Failed to delete: ${err.message}`,'error');}};openModal('delete-modal');}function openModal(id){const modal=document.getElementById(id);if(modal){modal.classList.add('active');modal.style.display='flex';}}function closeModal(id){const modal=document.getElementById(id);if(modal){modal.classList.remove('active');modal.style.display='none';}}function showToast(message,type='info'){const container=document.getElementById('toast-container');const toast=document.createElement('div');toast.className=`toast ${type}`;toast.textContent=message;container.appendChild(toast);setTimeout(()=>{toast.remove();},4000);}function escapeHtml(text){const map={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'};return text.replace(/[&<>"']/g,m=>map[m]);}function formatBytes(bytes){if(bytes===0)return '0 B';const k=1024;const sizes=['B','KB','MB','GB'];const i=Math.floor(Math.log(bytes)/Math.log(k));return Math.round((bytes/Math.pow(k,i))*100)/100+' '+sizes[i];}function formatDate(dateStr){if(!dateStr)return '—';const date=new Date(dateStr);return date.toLocaleDateString()+' '+date.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}function getFileIcon(filename){if(!filename)return 'fa-file';const ext=filename.split('.').pop().toLowerCase();const icons={'pdf':'fa-file-pdf','doc':'fa-file-word','docx':'fa-file-word','xls':'fa-file-excel','xlsx':'fa-file-excel','ppt':'fa-file-powerpoint','pptx':'fa-file-powerpoint','txt':'fa-file-text','zip':'fa-file-zipper','jpg':'fa-file-image','jpeg':'fa-file-image','png':'fa-file-image','gif':'fa-file-image'};return icons[ext]||'fa-file';}

// ===== WAVE 67: SEARCH + DRAG-AND-DROP UPLOAD =====

// Search functionality
let searchTimer = null;
const searchInput = document.getElementById('workspace-search');
const searchResults = document.getElementById('search-results');

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    const q = e.target.value.trim();
    if (q.length < 2) {
      searchResults.style.display = 'none';
      return;
    }
    searchTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/workspace/search?q=${encodeURIComponent(q)}`, { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        renderSearchResults(data.hits, q);
      } catch (err) { console.error(err); }
    }, 250); // debounce
  });
}

function renderSearchResults(hits, query) {
  if (!hits.length) {
    searchResults.innerHTML = '<div class="search-empty">No files found</div>';
    searchResults.style.display = '';
    return;
  }
  searchResults.innerHTML = hits.map(h => `
    <div class="search-hit" data-folder-id="${h.folder_id}" data-file-id="${h.file_id}">
      <div class="search-hit-name">${escapeHtml(h.filename)}</div>
      <div class="search-hit-path">${escapeHtml(h.folder_path)}</div>
      <div class="search-hit-meta">${escapeHtml(h.uploaded_by_name || '?')} · ${formatBytes(h.size_bytes)} · ${formatDate(h.uploaded_at)}</div>
    </div>
  `).join('');
  searchResults.style.display = '';
}

// Click search hit → navigate to folder + highlight file
document.addEventListener('click', (e) => {
  const hit = e.target.closest('.search-hit');
  if (hit) {
    const folderId = hit.dataset.folderId;
    const fileId = hit.dataset.fileId;
    searchResults.style.display = 'none';
    searchInput.value = '';
    currentFolderId = folderId;
    loadFolderContents(folderId);
  }
});

// Drag-and-drop upload
const filePanel = document.getElementById('file-panel');
const dropzoneOverlay = document.getElementById('dropzone-overlay');
let dragCounter = 0;

if (filePanel) {
  filePanel.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter++;
    dropzoneOverlay.style.display = '';
  });

  filePanel.addEventListener('dragleave', () => {
    dragCounter--;
    if (dragCounter === 0) dropzoneOverlay.style.display = 'none';
  });

  filePanel.addEventListener('dragover', (e) => e.preventDefault());

  filePanel.addEventListener('drop', async (e) => {
    e.preventDefault();
    dragCounter = 0;
    dropzoneOverlay.style.display = 'none';

    if (!currentFolderId) {
      showToast('Select a folder first', 'error');
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    showToast(`Uploading ${files.length} file(s)...`, 'info');

    for (const file of files) {
      const form = new FormData();
      form.append('file', file);
      try {
        const res = await fetch(`/api/workspace/folders/${currentFolderId}/files`, {
          method: 'POST',
          body: form,
          credentials: 'include'
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({error: 'Upload failed'}));
          showToast(`${file.name}: ${err.error}`, 'error');
        } else {
          showToast(`Uploaded ${file.name}`, 'success');
        }
      } catch (err) {
        showToast(`${file.name}: ${err.message}`, 'error');
      }
    }

    if (currentFolderId) {
      await loadFolderContents(currentFolderId);
    }
  });
}

// ===== WAVE 69: TRASH UI =====

async function loadTrash() {
  try {
    const res = await fetch('/api/workspace/trash', { credentials: 'include' });
    if (!res.ok) {
      document.getElementById('trash-tree').innerHTML = '<p style="color: var(--text-muted); padding: 8px; font-size: 0.85em;">Trash unavailable</p>';
      return;
    }
    const data = await res.json();
    renderTrash(data);
  } catch (err) {
    console.error('loadTrash failed:', err);
    document.getElementById('trash-tree').innerHTML = '<p style="color: var(--text-muted); padding: 8px; font-size: 0.85em;">Load failed</p>';
  }
}

function renderTrash(data) {
  const list = document.getElementById('trash-tree');
  const badge = document.getElementById('trash-count');
  const totalCount = (data.files?.length || 0) + (data.folders?.length || 0);

  if (totalCount === 0) {
    list.innerHTML = '<div class="tree-item disabled"><small>Trash is empty</small></div>';
    badge.style.display = 'none';
    return;
  }

  badge.textContent = totalCount;
  badge.style.display = '';

  list.innerHTML = '';

  // Folders first
  if (data.folders && data.folders.length > 0) {
    data.folders.forEach(folder => {
      const daysLeft = daysUntilPurge(folder.deleted_at);
      const div = document.createElement('div');
      div.className = 'trash-item';
      div.innerHTML = `
        <span class="trash-item-icon">📁</span>
        <div class="trash-item-info">
          <div class="trash-item-name">${escapeHtml(folder.name)}</div>
          <div class="trash-item-meta">
            Deleted ${formatDate(folder.deleted_at)}
            ${daysLeft > 0 ? `<span class="days-until-purge"> · auto-purge in ${daysLeft}d</span>` : '<span class="days-until-purge"> · scheduled for purge</span>'}
          </div>
        </div>
        <div class="trash-item-actions">
          <button class="btn btn-sm btn-secondary" data-action="restore-folder" data-id="${folder.id}">Restore</button>
        </div>
      `;
      list.appendChild(div);
    });
  }

  // Files
  if (data.files && data.files.length > 0) {
    data.files.forEach(file => {
      const daysLeft = daysUntilPurge(file.deleted_at);
      const div = document.createElement('div');
      div.className = 'trash-item';
      div.innerHTML = `
        <span class="trash-item-icon">📄</span>
        <div class="trash-item-info">
          <div class="trash-item-name">${escapeHtml(file.filename)}</div>
          <div class="trash-item-meta">
            in ${escapeHtml(file.folder_name || '?')} · Deleted ${formatDate(file.deleted_at)}
            ${file.deleted_by_name ? ` by ${escapeHtml(file.deleted_by_name)}` : ''}
            ${daysLeft > 0 ? `<span class="days-until-purge"> · auto-purge in ${daysLeft}d</span>` : '<span class="days-until-purge"> · scheduled for purge</span>'}
          </div>
        </div>
        <div class="trash-item-actions">
          <button class="btn btn-sm btn-secondary" data-action="restore-file" data-id="${file.id}">Restore</button>
          <button class="btn btn-sm btn-danger" data-action="purge-file" data-id="${file.id}" data-name="${escapeHtml(file.filename)}">Delete forever</button>
        </div>
      `;
      list.appendChild(div);
    });
  }
}

function daysUntilPurge(deletedAt) {
  const deleted = new Date(deletedAt).getTime();
  const purgeTime = deleted + 30 * 24 * 60 * 60 * 1000;
  const remainingMs = purgeTime - Date.now();
  return Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));
}

// Event delegation for restore + purge buttons
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === 'restore-file') {
    btn.disabled = true;
    try {
      const res = await fetch(`/api/workspace/files/${id}/restore`, { method: 'POST', credentials: 'include' });
      if (res.ok) {
        showToast('File restored', 'success');
        await loadTrash();
        if (currentFolderId) await loadFolderContents(currentFolderId);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Restore failed', 'error');
      }
    } catch (err) { showToast('Restore failed', 'error'); }
    btn.disabled = false;
  }

  if (action === 'restore-folder') {
    btn.disabled = true;
    try {
      const res = await fetch(`/api/workspace/folders/${id}/restore`, { method: 'POST', credentials: 'include' });
      if (res.ok) {
        showToast('Folder restored', 'success');
        await loadTrash();
        if (currentFolderId) await loadFolderContents(currentFolderId);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Restore failed', 'error');
      }
    } catch (err) { showToast('Restore failed', 'error'); }
    btn.disabled = false;
  }

  if (action === 'purge-file') {
    document.getElementById('purge-item-name').textContent = btn.dataset.name;
    const modal = document.getElementById('purge-confirm-modal');
    modal.dataset.targetId = id;
    openModal('purge-confirm-modal');
  }
});

// Purge confirm modal handlers
document.addEventListener('click', async (e) => {
  if (e.target.dataset.action === 'confirm-purge') {
    const modal = document.getElementById('purge-confirm-modal');
    const id = modal.dataset.targetId;
    if (!id) return;
    try {
      const res = await fetch(`/api/workspace/files/${id}/purge`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        showToast('Permanently deleted', 'success');
        await loadTrash();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Purge failed', 'error');
      }
    } catch (err) { showToast('Purge failed', 'error'); }
    closeModal('purge-confirm-modal');
  }
});

})();
