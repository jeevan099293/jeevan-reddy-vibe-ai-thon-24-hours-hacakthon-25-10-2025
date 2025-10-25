// Admin Console JS

(function(){
  const token = checkAuth();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  const isFaculty = user.role === 'faculty';

  // Guard: only admin/faculty can access
  if (!(isAdmin || isFaculty)) {
    window.location.href = '/dashboard';
    return;
  }

  // Put user name
  const userNameEl = document.getElementById('userName');
  if (userNameEl && user.name) userNameEl.textContent = user.name;

  // Helper to create action buttons
  function actionButton(label, cls, handler) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = `btn btn-small ${cls || ''}`;
    btn.style.marginLeft = '8px';
    btn.addEventListener('click', handler);
    return btn;
  }

  // EVENTS
  const eventsList = document.getElementById('eventsList');
  const eventForm = document.getElementById('eventForm');

  async function loadEvents() {
    eventsList.innerHTML = '<div class="loading">Loading events...</div>';
    const res = await handleAPICall('/api/events', { headers: getAuthHeaders() });
    if (res.error) {
      eventsList.innerHTML = `<div class="message error">${res.message}</div>`;
      return;
    }
    const events = res.data;
    if (!events.length) {
      eventsList.innerHTML = '<div class="loading">No events yet.</div>';
      return;
    }
    eventsList.innerHTML = '';
    events.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'item-row';
      card.innerHTML = `
        <div>
          <strong>${ev.title}</strong> — ${ev.event_date} ${ev.event_time} @ ${ev.location}
          <div style="color: var(--text-secondary); font-size: 12px;">${ev.category} • by ${ev.creator_name || 'N/A'}</div>
        </div>
      `;
      const actions = document.createElement('div');
      // Simple delete (admin only on backend, faculty allowed to create/update); backend will enforce
      const del = actionButton('Delete', 'btn-danger', async () => {
        if (!confirm('Delete this event?')) return;
        const r = await handleAPICall(`/api/events/${ev._id}`, { method:'DELETE', headers: getAuthHeaders() });
        if (r.error) return alert(r.message);
        loadEvents();
      });
      actions.appendChild(del);
      card.appendChild(actions);
      eventsList.appendChild(card);
    });
  }

  if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(eventForm);
      const payload = Object.fromEntries(fd.entries());
      payload.max_participants = parseInt(payload.max_participants || '0', 10);
      const res = await handleAPICall('/api/events', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.error) return alert(res.message);
      eventForm.reset();
      loadEvents();
    });
  }

  // Announcements removed: no admin UI or API calls

  // CLUBS
  const clubsList = document.getElementById('clubsList');
  const clubForm = document.getElementById('clubForm');

  async function loadClubs() {
    clubsList.innerHTML = '<div class="loading">Loading clubs...</div>';
    const res = await handleAPICall('/api/clubs', { headers: getAuthHeaders() });
    if (res.error) {
      clubsList.innerHTML = `<div class="message error">${res.message}</div>`;
      return;
    }
    const items = res.data;
    if (!items.length) {
      clubsList.innerHTML = '<div class="loading">No clubs yet.</div>';
      return;
    }
    clubsList.innerHTML = '';
    items.forEach(cl => {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <div>
          <strong>${cl.name}</strong> — ${cl.category}
          <div style=\"color: var(--text-secondary); font-size: 12px;\">${cl.president || ''} • ${cl.contact_email || ''}</div>
          <div style=\"margin-top: 6px;\">${cl.description}</div>
        </div>
      `;
      const actions = document.createElement('div');
      if (isAdmin) {
        const del = actionButton('Delete', 'btn-danger', async () => {
          if (!confirm('Delete this club?')) return;
          const r = await handleAPICall(`/api/clubs/${cl._id}`, { method:'DELETE', headers: getAuthHeaders() });
          if (r.error) return alert(r.message);
          loadClubs();
        });
        actions.appendChild(del);
      }
      row.appendChild(actions);
      clubsList.appendChild(row);
    });
  }

  if (clubForm) {
    clubForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(clubForm);
      const payload = Object.fromEntries(fd.entries());
      const res = await handleAPICall('/api/clubs', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.error) return alert(res.message);
      clubForm.reset();
      loadClubs();
    });
  }

  // Initial loads
  loadEvents();
  loadAnnouncements();
  loadClubs();
})();
