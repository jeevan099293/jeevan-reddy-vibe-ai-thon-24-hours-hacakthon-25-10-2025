// Public Announcements Page

(function(){
  const token = checkAuth();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userNameEl = document.getElementById('userName');
  if (userNameEl && user.name) userNameEl.textContent = user.name;

  const container = document.getElementById('announcementsContainer');

  async function loadAnnouncements() {
    container.innerHTML = '<div class="loading">Loading announcements...</div>';
    const res = await handleAPICall('/api/announcements', { headers: getAuthHeaders() });
    if (res.error) {
      container.innerHTML = `<div class="message error">${res.message}</div>`;
      return;
    }
    const items = res.data;
    if (!items.length) {
      container.innerHTML = '<div class="loading">No announcements yet.</div>';
      return;
    }
    container.innerHTML = items.map(a => `
      <div class="feed-item">
        <div class="feed-header">
          <span class="badge ${a.priority === 'high' ? 'badge-active' : ''}"> ${a.priority.toUpperCase()} </span>
          <h3>${a.title}</h3>
        </div>
        <p style="color: var(--text-secondary);">${a.message}</p>
        <div class="feed-meta"><i class="fas fa-user"></i> ${a.created_by} • <i class="fas fa-clock"></i> ${new Date(a.created_at).toLocaleString()}</div>
      </div>
    `).join('');
  }

  loadAnnouncements();
})();
