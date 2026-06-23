// pipeline_board.js — per-team kanban for the permitting & design pipelines.
// Columns = the team's pipeline stages (+ revision). Cards = service-area jobs.
// Drag a card to a column to set that stage; optimistic + undo bar.

(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const params = new URLSearchParams(location.search);
  const TEAM = (params.get('team') || 'permitting').toLowerCase();

  // theme
  document.documentElement.setAttribute('data-theme', localStorage.getItem('lfs_theme') || 'light');
  $('themeToggle').addEventListener('click', () => {
    const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('lfs_theme', t);
  });

  // undo bar
  let undoAction = null, undoTimer = null;
  function showUndo(msg, action) {
    undoAction = action; $('undoMsg').textContent = msg; $('undoBar').classList.add('show');
    clearTimeout(undoTimer); undoTimer = setTimeout(() => $('undoBar').classList.remove('show'), 6000);
  }
  $('undoBtn').addEventListener('click', async () => {
    $('undoBar').classList.remove('show');
    if (undoAction) { const a = undoAction; undoAction = null; try { await a(); } catch (e) {} }
  });

  let PIPE = {}, jobs = [], dragId = null;

  async function boot() {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    $('tab-' + TEAM)?.classList.add('active');
    $('teamLabel').textContent = TEAM.charAt(0).toUpperCase() + TEAM.slice(1) + ' pipeline';
    try {
      const p = await api('/api/service-area-pipelines');
      PIPE = p.pipelines || {};
      if (!(PIPE[TEAM] || []).length) {
        $('board').innerHTML = `<div class="empty">No pipeline for "${esc(TEAM)}". This board is for permitting & design.</div>`;
        return;
      }
      await load();
    } catch (e) {
      $('board').innerHTML = `<div class="empty">Failed to load: ${esc(e.message)}</div>`;
    }
  }

  async function load() {
    jobs = await api('/api/service-area-jobs?team=' + encodeURIComponent(TEAM));
    render();
  }

  const columns = () => [...(PIPE[TEAM] || []), 'revision'];

  function render() {
    $('board').innerHTML = columns().map(stage => {
      const items = jobs.filter(j => j.status === stage);
      const isRev = stage === 'revision';
      return `<div class="column ${isRev ? 'col-rev' : ''}">
        <div class="col-head">${esc(stage)}<span class="count">${items.length}</span></div>
        <div class="col-body" data-stage="${esc(stage)}">${items.map(cardHtml).join('')}</div>
      </div>`;
    }).join('');
    bindDnD();
  }

  function cardHtml(j) {
    const emp = j.assigned_staff_name
      ? `<i class="fa-solid fa-user"></i> ${esc(j.assigned_staff_name)}`
      : `<span class="muted">Unassigned</span>`;
    return `<div class="card" draggable="true" data-id="${j.id}">
      <div class="card-sa">${esc(j.service_area_name)}${j.engineering_contract_id ? `<span class="badge-rus">RUS</span>` : ''}</div>
      <div class="card-meta">${esc(j.client_name || '')}</div>
      <div class="card-job">${esc(j.job_name || j.team)}</div>
      <div class="card-emp">${emp}</div>
    </div>`;
  }

  function bindDnD() {
    document.querySelectorAll('.card').forEach(c => {
      c.addEventListener('dragstart', () => { dragId = c.dataset.id; c.classList.add('dragging'); });
      c.addEventListener('dragend', () => {
        dragId = null; c.classList.remove('dragging');
        document.querySelectorAll('.col-body').forEach(b => b.classList.remove('over'));
      });
    });
    document.querySelectorAll('.col-body').forEach(b => {
      b.addEventListener('dragover', e => { e.preventDefault(); b.classList.add('over'); });
      b.addEventListener('dragleave', () => b.classList.remove('over'));
      b.addEventListener('drop', e => { e.preventDefault(); b.classList.remove('over'); onDrop(b.dataset.stage); });
    });
  }

  async function onDrop(stage) {
    if (!dragId) return;
    const job = jobs.find(j => j.id === dragId);
    if (!job || job.status === stage) return;
    const prev = job.status;
    job.status = stage; render();             // optimistic
    try {
      await api('/api/service-area-jobs/' + job.id, 'PUT', { status: stage });
      showUndo(`Moved to "${stage}"`, async () => {
        await api('/api/service-area-jobs/' + job.id, 'PUT', { status: prev });
        await load();
      });
    } catch (e) {
      job.status = prev; render();
      alert('Move failed: ' + e.message);
    }
  }

  boot();
})();
