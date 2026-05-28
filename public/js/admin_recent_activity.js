(function () {
  if (typeof window === 'undefined') return;

  async function load() {
    try {
      const res = await fetch('/api/admin/recent-activity?limit=20', { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      render(data);
    } catch (err) {
      console.error('recent-activity load failed:', err);
    }
  }

  const ACTION_ICONS = {
    'project.create': '🆕',
    'project.update': '✏️',
    'project.delete': '🗑️',
    'invoice.generate': '💰',
    'invoice.void': '🚫',
    'engineering_contract.create': '📋',
    'engineering_contract.update': '✏️',
    'engineering_contract.delete': '🗑️',
    'user.create': '👤',
    'user.role_change': '🔑',
    'permit.create': '📜',
    'permit.update': '✏️',
    'permit.delete': '🗑️',
    'splice_project.create': '🔗',
    'splice_project.update': '✏️'
  };

  function getActivityDescription(a) {
    if (a.type === 'photo') {
      return `uploaded <em>${escapeHtml(a.target_name)}</em>`;
    } else if (a.type === 'file') {
      return `uploaded <em>${escapeHtml(a.target_name)}</em>`;
    } else if (a.type === 'audit') {
      // Parse action to create a description
      const verb = (() => {
        if (a.action.endsWith('.create')) return 'created';
        if (a.action.endsWith('.update')) return 'updated';
        if (a.action.endsWith('.delete')) return 'deleted';
        if (a.action === 'invoice.generate') return 'generated';
        if (a.action === 'invoice.void') return 'voided';
        if (a.action === 'user.role_change') return 'changed role for';
        return a.action;
      })();
      return `${verb} ${escapeHtml(a.target_name)}`;
    }
    return `performed ${escapeHtml(a.action || 'activity')}`;
  }

  function render(data) {
    const list = document.getElementById('recent-activity-list');
    const badge = document.getElementById('recent-activity-badge');
    if (!list) return;

    if (data.total_today > 0 && badge) {
      badge.textContent = `${data.total_today} today`;
      badge.style.display = '';
    }

    if (!data.activities || data.activities.length === 0) {
      list.innerHTML = '<p style="color: var(--text-muted);">No recent activity.</p>';
      return;
    }

    list.innerHTML = data.activities.map(a => {
      let icon = '📄';
      if (a.type === 'photo') {
        icon = '📷';
      } else if (a.type === 'audit') {
        icon = ACTION_ICONS[a.action] || '📋';
      }
      const time = timeAgo(new Date(a.at));
      const project = a.project_name ? ` · ${escapeHtml(a.project_name)}` : '';
      const desc = getActivityDescription(a);
      return `
        <div class="activity-row">
          <span class="activity-icon">${icon}</span>
          <span class="activity-desc">
            <strong>${escapeHtml(a.actor_name || 'Unknown')}</strong> ${desc}${project}
          </span>
          <span class="activity-time">${time}</span>
        </div>
      `;
    }).join('');
  }

  function timeAgo(date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  window.AdminRecentActivity = { load };

  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'recent-activity-refresh') load();
  });

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(load, 100);
  } else {
    document.addEventListener('DOMContentLoaded', load);
  }
})();
