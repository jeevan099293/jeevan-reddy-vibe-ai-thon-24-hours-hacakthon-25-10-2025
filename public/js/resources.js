// Resources Page JS
(function(){
  const token = checkAuth();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userNameEl = document.getElementById('userName');
  if (userNameEl && user.name) userNameEl.textContent = user.name;

  const list = document.getElementById('resourcesList');
  const form = document.getElementById('resourceForm');
  const fileInput = document.getElementById('res_file');

  function row(item) {
    const wrap = document.createElement('div');
    wrap.className = 'item-row';
    const icon = item.file_url ? '<i class="fas fa-file"></i>' : '<i class="fas fa-link"></i>';
    const href = item.file_url || item.link_url;
    wrap.innerHTML = `
      <div>
        <strong>${icon} ${item.title}</strong> — ${item.category}
        <div style="color: var(--text-secondary); font-size: 12px;">by ${item.user_name} • ${new Date(item.created_at).toLocaleString()}</div>
        ${item.description ? `<div style="margin-top: 6px;">${item.description}</div>` : ''}
      </div>
    `;
    const actions = document.createElement('div');
    const open = document.createElement('a');
    open.href = href;
    open.target = '_blank';
    open.className = 'btn btn-small';
    open.textContent = 'Open';
    actions.appendChild(open);
    if (user && (user.role === 'admin' || user.role === 'faculty' || user.id === item.user_id)) {
      const del = document.createElement('button');
      del.className = 'btn btn-small btn-danger';
      del.textContent = 'Delete';
      del.style.marginLeft = '8px';
      del.onclick = async () => {
        if (!confirm('Delete this resource?')) return;
        const r = await handleAPICall(`/api/resources/${item._id}`, { method:'DELETE', headers: getAuthHeaders() });
        if (r.error) return alert(r.message);
        load();
      };
      actions.appendChild(del);
    }
    wrap.appendChild(actions);
    return wrap;
  }

  async function load() {
    list.innerHTML = '<div class="loading">Loading...</div>';
    const res = await handleAPICall('/api/resources', { headers: getAuthHeaders() });
    if (res.error) {
      list.innerHTML = `<div class="message error">${res.message}</div>`;
      return;
    }
    const items = res.data;
    if (!items.length) {
      list.innerHTML = '<div class="loading">No resources yet.</div>';
      return;
    }
    list.innerHTML = '';
    items.forEach(i => list.appendChild(row(i)));
  }

  async function uploadIfNeeded() {
    if (!fileInput || !fileInput.files || !fileInput.files[0]) return '';
    const f = new FormData();
    f.append('file', fileInput.files[0]);
    const res = await fetch('/api/upload/resource', { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, body: f });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(err.message);
    }
    const data = await res.json();
    return data.url;
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const fd = new FormData(form);
        const payload = Object.fromEntries(fd.entries());
        payload.file_url = await uploadIfNeeded();
        const res = await handleAPICall('/api/resources', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.error) return alert(res.message);
        form.reset();
        load();
      } catch (err) {
        alert(err.message || 'Failed to share resource');
      }
    });
  }

  load();
})();
