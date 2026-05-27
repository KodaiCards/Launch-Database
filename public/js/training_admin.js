// public/js/training_admin.js — OSP Training Progress Admin Dashboard
// Exposes window.TrainingAdmin = { open() }
// Overview table: all employees, per-user progress metrics, click-to-detail modal.

(function initTrainingAdmin() {
  'use strict';

  const ADMIN_ROLES = ['admin', 'design_manager', 'permitting_manager'];

  // ─── State ─────────────────────────────────────────────────────────────────
  let overviewData = null;
  let selectedUser = null;
  let filterRole = '';
  let filterSearch = '';
  let filterActive30d = false;

  // ─── API Calls ──────────────────────────────────────────────────────────────

  async function fetchProgressOverview() {
    const res = await fetch('/api/training/admin/progress-overview', {
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    return res.json();
  }

  async function fetchUserDetail(userId) {
    const res = await fetch(`/api/training/admin/user/${userId}/detail`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    return res.json();
  }

  async function fetchCertAttempts(userId = null) {
    let url = '/api/training/admin/cert-attempts';
    if (userId) url += `?user_id=${userId}`;
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    return res.json();
  }

  // ─── Filtering & Sorting ────────────────────────────────────────────────────

  function getFilteredUsers() {
    if (!overviewData || !overviewData.users) return [];

    let users = overviewData.users.slice();

    // Role filter
    if (filterRole) {
      users = users.filter(u => {
        const roles = u.courses.map(c => c.role || '').filter(Boolean);
        return roles.includes(filterRole) || filterRole === '';
      });
    }

    // Search filter (by name or username)
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      users = users.filter(u =>
        u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
      );
    }

    // Active in last 30 days filter
    if (filterActive30d) {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      users = users.filter(u => {
        const lastSeen = u.courses.length > 0
          ? Math.max(...u.courses.map(c => c.last_seen_at ? new Date(c.last_seen_at) : new Date(0)))
          : new Date(0);
        return lastSeen > thirtyDaysAgo;
      });
    }

    return users;
  }

  function computeUserMetrics(user) {
    if (!user.courses || user.courses.length === 0) {
      return { completed: 0, total: 0, percent: 0, lastSeen: null };
    }
    let completed = 0, total = 0;
    let lastSeen = new Date(0);
    for (const course of user.courses) {
      completed += course.lessons_completed || 0;
      total += course.lessons_total || 0;
      if (course.last_seen_at) {
        const d = new Date(course.last_seen_at);
        if (d > lastSeen) lastSeen = d;
      }
    }
    return {
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      lastSeen: lastSeen.getTime() > 0 ? lastSeen : null,
    };
  }

  function formatDate(d) {
    if (!d) return '—';
    if (!(d instanceof Date)) d = new Date(d);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  }

  function formatTime(ms) {
    if (!ms) return '—';
    const s = ms / 1000;
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m`;
    if (m > 0) return `${m}m`;
    return `${Math.round(s)}s`;
  }

  // ─── Render Overview Table ──────────────────────────────────────────────────

  function renderOverview() {
    const container = document.getElementById('training-admin-overview');
    if (!container) return;

    const users = getFilteredUsers();

    if (users.length === 0) {
      container.innerHTML = `
        <div style="padding:40px;text-align:center;color:var(--text-muted)">
          <i class="fa-solid fa-inbox" style="font-size:32px;opacity:0.4;margin-bottom:12px;display:block"></i>
          <p>No employees found matching your filters.</p>
        </div>
      `;
      return;
    }

    let html = `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Progress</th>
              <th>Cert Attempts</th>
              <th>Last Activity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
    `;

    for (const user of users) {
      const metrics = computeUserMetrics(user);
      const certCount = 0; // We don't fetch cert data in overview; if needed, add endpoint
      const lastActivityText = metrics.lastSeen
        ? formatDate(metrics.lastSeen)
        : '—';

      html += `
        <tr style="cursor:pointer" onclick="window.TrainingAdmin.viewUserDetail('${user.user_id}')">
          <td class="td-name">${escapeHtml(user.name)}</td>
          <td class="td-muted">${escapeHtml(user.username)}</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;min-width:150px">
              <div class="progress" style="flex:1">
                <div class="progress-bar" style="width:${metrics.percent}%"></div>
              </div>
              <span class="td-muted">${metrics.completed}/${metrics.total}</span>
            </div>
          </td>
          <td class="td-muted">${certCount}</td>
          <td class="td-muted">${lastActivityText}</td>
          <td style="text-align:right">
            <i class="fa-solid fa-chevron-right" style="color:var(--text-muted);font-size:12px"></i>
          </td>
        </tr>
      `;
    }

    html += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
  }

  // ─── Render User Detail Modal ───────────────────────────────────────────────

  async function renderUserDetail(userId) {
    try {
      const detail = await fetchUserDetail(userId);
      const container = document.getElementById('training-admin-detail');
      if (!container) return;

      const user = detail.user;
      let html = `
        <div class="modal-header" style="position:sticky;top:0;z-index:1;background:var(--white);border-bottom:1px solid var(--gray-border)">
          <div>
            <div class="modal-title">${escapeHtml(user.name)}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:4px">${escapeHtml(user.username)} • ${user.role}</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.TrainingAdmin.closeDetail()" style="width:32px;height:32px;padding:0">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <div class="modal-body" style="padding:22px">
      `;

      // Course breakdown
      if (detail.courses && detail.courses.length > 0) {
        html += `<h4 style="font-size:13px;font-weight:600;margin-bottom:12px">Courses</h4>`;
        html += `<div class="table-wrap" style="margin-bottom:24px"><table><thead><tr>
          <th>Course</th>
          <th>Completed</th>
          <th>Progress</th>
          <th>Best Score</th>
        </tr></thead><tbody>`;

        for (const course of detail.courses) {
          const completed = course.lessons.filter(l => l.status === 'completed').length;
          const total = course.lessons.length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
          const bestScore = course.lessons
            .map(l => l.best_score)
            .filter(s => s !== null && s !== undefined)
            .sort((a, b) => b - a)[0];

          html += `
            <tr>
              <td class="td-name">${escapeHtml(course.course_id)}</td>
              <td class="td-muted">${completed}/${total}</td>
              <td>
                <div class="progress" style="width:120px">
                  <div class="progress-bar" style="width:${percent}%"></div>
                </div>
              </td>
              <td class="td-muted">${bestScore !== undefined ? bestScore + '%' : '—'}</td>
            </tr>
          `;
        }

        html += `</tbody></table></div>`;
      }

      // Cert attempts
      if (detail.cert_attempts && detail.cert_attempts.length > 0) {
        html += `<h4 style="font-size:13px;font-weight:600;margin-bottom:12px">Certification Attempts</h4>`;
        html += `<div class="table-wrap" style="margin-bottom:24px"><table><thead><tr>
          <th>Certification</th>
          <th>Score</th>
          <th>Status</th>
          <th>Date</th>
          <th>Time</th>
        </tr></thead><tbody>`;

        for (const attempt of detail.cert_attempts) {
          const badgeClass = attempt.passed ? 'badge-completed' : 'badge-hold';
          const badgeText = attempt.passed ? 'PASSED' : 'Failed';
          html += `
            <tr>
              <td class="td-name">${escapeHtml(attempt.cert_track)}</td>
              <td class="td-muted">${attempt.score}%</td>
              <td><span class="badge ${badgeClass}">${badgeText}</span></td>
              <td class="td-muted">${formatDate(attempt.attempt_date)}</td>
              <td class="td-muted">${formatTime(attempt.time_taken_seconds ? attempt.time_taken_seconds * 1000 : null)}</td>
            </tr>
          `;
        }

        html += `</tbody></table></div>`;
      } else {
        html += `<p style="font-size:13px;color:var(--text-muted)">No certification attempts yet.</p>`;
      }

      // Capstone attempts
      if (detail.capstone_attempts && detail.capstone_attempts.length > 0) {
        html += `<h4 style="font-size:13px;font-weight:600;margin-top:24px;margin-bottom:12px">Topic Capstone Attempts</h4>`;
        html += `<div class="table-wrap"><table><thead><tr>
          <th>Course</th>
          <th>Score</th>
          <th>Status</th>
          <th>Date</th>
        </tr></thead><tbody>`;

        for (const attempt of detail.capstone_attempts) {
          const badgeClass = attempt.passed ? 'badge-completed' : 'badge-hold';
          const badgeText = attempt.passed ? 'PASSED' : 'Failed';
          html += `
            <tr>
              <td class="td-name">${escapeHtml(attempt.course_id)}</td>
              <td class="td-muted">${attempt.score}% (${attempt.correct_items}/${attempt.total_items})</td>
              <td><span class="badge ${badgeClass}">${badgeText}</span></td>
              <td class="td-muted">${formatDate(attempt.attempt_date)}</td>
            </tr>
          `;
        }

        html += `</tbody></table></div>`;
      }

      html += `</div>`;
      container.innerHTML = html;
    } catch (err) {
      console.error('Failed to load user detail:', err);
      const container = document.getElementById('training-admin-detail');
      if (container) {
        container.innerHTML = `
          <div class="modal-body" style="color:var(--danger)">
            <p>Failed to load user detail. Please try again.</p>
            <p style="font-size:12px;color:var(--text-muted)">${escapeHtml(err.message)}</p>
          </div>
        `;
      }
    }
  }

  // ─── Main Open / Close ──────────────────────────────────────────────────────

  async function open() {
    // Check if user is admin-class
    const meRes = await fetch('/api/auth/me', { credentials: 'include' });
    if (!meRes.ok) {
      alert('Not authenticated');
      return;
    }
    const me = await meRes.json();
    if (!ADMIN_ROLES.includes(me.role)) {
      alert('Insufficient permissions. Only admins and managers can view training progress.');
      return;
    }

    // Load overview data
    try {
      overviewData = await fetchProgressOverview();
    } catch (err) {
      console.error('Failed to load overview:', err);
      alert('Failed to load training progress overview.');
      return;
    }

    // Show modal
    const modal = document.getElementById('training-admin-modal');
    if (modal) modal.classList.add('open');

    renderOverview();
  }

  function close() {
    const modal = document.getElementById('training-admin-modal');
    if (modal) modal.classList.remove('open');
    overviewData = null;
    selectedUser = null;
  }

  function closeDetail() {
    const overviewDiv = document.getElementById('training-admin-overview');
    const detailDiv = document.getElementById('training-admin-detail');
    if (overviewDiv) overviewDiv.style.display = 'block';
    if (detailDiv) detailDiv.style.display = 'none';
    selectedUser = null;
  }

  async function viewUserDetail(userId) {
    selectedUser = userId;
    const overviewDiv = document.getElementById('training-admin-overview');
    const detailDiv = document.getElementById('training-admin-detail');
    if (overviewDiv) overviewDiv.style.display = 'none';
    if (detailDiv) detailDiv.style.display = 'block';
    await renderUserDetail(userId);
  }

  // ─── Filter Controls ───────────────────────────────────────────────────────

  function onFilterChange() {
    const roleSelect = document.getElementById('training-filter-role');
    const searchInput = document.getElementById('training-filter-search');
    const activeCheckbox = document.getElementById('training-filter-active');

    filterRole = roleSelect?.value || '';
    filterSearch = (searchInput?.value || '').trim();
    filterActive30d = activeCheckbox?.checked || false;

    renderOverview();
  }

  // ─── Export ────────────────────────────────────────────────────────────────

  window.TrainingAdmin = {
    open,
    close,
    closeDetail,
    viewUserDetail,
    onFilterChange,
  };
})();

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
