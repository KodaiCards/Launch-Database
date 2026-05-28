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
      const icon = a.type === 'photo' ? '📷' : '📄';
      const time = timeAgo(new Date(a.at));
      const project = a.project_name ? ` · ${escapeHtml(a.project_name)}` : '';
      return `
        <div class="activity-row">
          <span class="activity-icon">${icon}</span>
          <span class="activity-desc">
            <strong>${escapeHtml(a.actor_name || 'Unknown')}</strong> uploaded <em>${escapeHtml(a.target_name)}</em>${project}
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
