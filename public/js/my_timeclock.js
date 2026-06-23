/* public/js/my_timeclock.js — Contractor "My Jobs" timeclock UI */

(function () {
  'use strict';

  let jobs = [];
  let activeJobId = null;

  // ── Boot ────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();
    setTodayDate();
    loadJobs();
    loadWeek();
    loadRecent();
  });

  // ── This-week recap ───────────────────────────────────────────────────────

  async function loadWeek() {
    try {
      const res = await fetch('/api/my/hours?week=current', { credentials: 'include' });
      if (!res.ok) return; // strip is best-effort; stay silent on failure
      const data = await res.json();
      renderWeek(data);
    } catch { /* best-effort */ }
  }

  function renderWeek(data) {
    const strip = document.getElementById('week-strip');
    const jobsEl = document.getElementById('week-strip-jobs');
    document.getElementById('week-total').textContent = (data.total_hours || 0).toFixed(1);
    const jobs = data.jobs || [];
    if (!jobs.length) {
      jobsEl.innerHTML = '<div class="week-strip-empty">No hours logged yet this week.</div>';
    } else {
      jobsEl.innerHTML = jobs.map(j => `<div class="week-strip-job">
        <span>${esc(j.job_name || 'Job')} · ${esc(j.service_area_name || '')}</span>
        <span class="wsj-hours">${(j.hours || 0).toFixed(1)} hrs</span>
      </div>`).join('');
    }
    strip.style.display = '';
  }

  // ── Recent entries ───────────────────────────────────────────────────────────

  async function loadRecent() {
    try {
      const res = await fetch('/api/my/entries?limit=20', { credentials: 'include' });
      if (!res.ok) return;
      const entries = await res.json();
      renderRecent(entries);
    } catch { /* best-effort */ }
  }

  function renderRecent(entries) {
    const card = document.getElementById('recent-card');
    const list = document.getElementById('recent-list');
    if (!entries.length) {
      card.style.display = '';
      list.innerHTML = '<div class="recent-empty">No entries yet.</div>';
      return;
    }
    card.style.display = '';
    list.innerHTML = entries.map(e => {
      const dateStr = e.entry_date ? new Date(e.entry_date + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
      const meta = [e.client_name, e.service_area_name].filter(Boolean).join(' · ');
      return `<div class="recent-row">
        <div class="recent-left">
          <div class="recent-job">${esc(e.job_name || 'Entry')}</div>
          ${meta ? `<div class="recent-meta">${esc(meta)}</div>` : ''}
          ${e.notes ? `<div class="recent-notes">${esc(e.notes)}</div>` : ''}
        </div>
        <div class="recent-right">
          <div class="recent-hrs">${(e.hours || 0).toFixed(1)} hrs</div>
          <div class="recent-date">${esc(dateStr)}</div>
        </div>
      </div>`;
    }).join('');
  }

  // ── Jobs ────────────────────────────────────────────────────────────────────

  async function loadJobs() {
    const list = document.getElementById('job-list');
    try {
      const res = await fetch('/api/my/jobs', { credentials: 'include' });
      if (res.status === 401) { window.location.href = '/login.html'; return; }
      if (!res.ok) throw new Error(await res.text());
      jobs = await res.json();
      renderJobs(list);
    } catch (e) {
      list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><br>Failed to load jobs. ${e.message || ''}</div>`;
    }
  }

  function renderJobs(list) {
    if (!jobs.length) {
      list.innerHTML = `<div class="empty-state">
        <i class="fa-solid fa-briefcase"></i>
        <div style="margin-top:8px;font-size:14px">No jobs assigned to you yet.</div>
        <div style="font-size:12px;margin-top:4px">Ask your manager to assign you to a job.</div>
      </div>`;
      return;
    }

    list.innerHTML = jobs.map(j => {
      const teamClass = `tag-${j.team || 'construction'}`;
      const teamLabel = capitalize(j.team || '—');
      const statusLabel = j.status ? j.status.replace(/_/g, ' ') : '—';
      const hoursLabel = j.actual_hours != null ? `${Number(j.actual_hours).toFixed(1)} hrs logged` : '0 hrs logged';
      return `<div class="job-card" data-id="${j.id}">
        <div class="job-info">
          <div class="job-name">${esc(j.job_name || 'Job')}</div>
          <div class="job-meta">
            <span class="tag ${teamClass}">${esc(teamLabel)}</span>
            ${j.client_name ? `<span>${esc(j.client_name)}</span><span style="opacity:.4">·</span>` : ''}
            <span>${esc(j.service_area_name || '—')}</span>
            <span style="opacity:.4">·</span>
            <span class="tag tag-status">${esc(statusLabel)}</span>
            <span style="opacity:.4">·</span>
            <span style="color:var(--text-muted)">${hoursLabel}</span>
          </div>
        </div>
        <div class="job-actions">
          <button class="btn btn-primary btn-sm" onclick="openModal(${j.id})">
            <i class="fa-regular fa-clock"></i> Log Hours
          </button>
        </div>
      </div>`;
    }).join('');
  }

  // ── Modal ───────────────────────────────────────────────────────────────────

  window.openModal = function (jobId) {
    activeJobId = jobId;
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    document.getElementById('modal-job-label').textContent =
      `${job.job_name || 'Job'} · ${job.service_area_name || ''} · ${job.client_name || ''}`;
    document.getElementById('inp-hours').value = '';
    document.getElementById('inp-notes').value = '';
    setTodayDate();

    document.getElementById('log-modal').classList.add('open');
    setTimeout(() => document.getElementById('inp-hours').focus(), 50);
  };

  window.closeModal = function () {
    document.getElementById('log-modal').classList.remove('open');
    activeJobId = null;
  };

  // Close on backdrop click
  document.getElementById('log-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('log-modal')) closeModal();
  });

  // ── Submit ──────────────────────────────────────────────────────────────────

  window.submitHours = async function () {
    if (!activeJobId) return;
    const hoursVal = parseFloat(document.getElementById('inp-hours').value);
    if (!hoursVal || hoursVal <= 0) {
      toast('Enter a valid number of hours.', 'error');
      document.getElementById('inp-hours').focus();
      return;
    }

    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Saving…';

    const body = { hours: hoursVal };
    const dateVal = document.getElementById('inp-date').value;
    if (dateVal) body.entry_date = dateVal;
    const notes = document.getElementById('inp-notes').value.trim();
    if (notes) body.notes = notes;

    try {
      const res = await fetch(`/api/service-area-jobs/${activeJobId}/time-entries`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      // Update cached actual_hours for the job card
      const job = jobs.find(j => j.id === activeJobId);
      if (job && data.job) job.actual_hours = data.job.actual_hours;
      closeModal();
      renderJobs(document.getElementById('job-list'));
      loadWeek();
      loadRecent();
      toast(`Logged ${hoursVal.toFixed(1)} hrs — nice work!`, 'success');
    } catch (e) {
      toast(`Failed to log hours: ${e.message}`, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Log Hours';
    }
  };

  // ── Dark mode ───────────────────────────────────────────────────────────────

  window.toggleDark = function () {
    const html = document.documentElement;
    const dark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', dark ? 'light' : 'dark');
    localStorage.setItem('lfs-theme', dark ? 'light' : 'dark');
    updateDmIcon();
  };

  function applyStoredTheme() {
    const stored = localStorage.getItem('lfs-theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);
    updateDmIcon();
  }

  function updateDmIcon() {
    const icon = document.getElementById('dm-icon');
    if (!icon) return;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  // ── Auth ────────────────────────────────────────────────────────────────────

  window.logout = async function () {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    window.location.href = '/login.html';
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function setTodayDate() {
    const el = document.getElementById('inp-date');
    if (el) el.value = new Date().toISOString().slice(0, 10);
  }

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  let _toastTimer;
  window.toast = function (msg, type = '') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = `toast${type ? ' ' + type : ''}`;
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.add('hidden'), 3500);
  };
})();
