// Polls Page JS
(function(){
  const token = checkAuth();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isStaff = user.role === 'admin' || user.role === 'faculty';
  const userNameEl = document.getElementById('userName');
  if (userNameEl && user.name) userNameEl.textContent = user.name;

  const list = document.getElementById('pollsList');
  const form = document.getElementById('pollForm');
  const addOptionBtn = document.getElementById('addOptionBtn');
  const optionsWrap = document.getElementById('optionsWrap');

  if (isStaff) {
    form.style.display = 'block';
  }

  function pollRow(p) {
    const wrap = document.createElement('div');
    wrap.className = 'item-row';
    const total = (p.options || []).reduce((s, o) => s + (o.votes || 0), 0);
    wrap.innerHTML = `
      <div>
        <strong>${p.question}</strong>
        <div style="color: var(--text-secondary); font-size: 12px;">${new Date(p.created_at).toLocaleString()}</div>
        <div style="margin-top:8px;" id="opts_${p._id}"></div>
      </div>
    `;
    const actions = document.createElement('div');
    if (isStaff) {
      const del = document.createElement('button');
      del.className = 'btn btn-small btn-danger';
      del.textContent = 'Delete';
      del.onclick = async () => {
        if (!confirm('Delete this poll?')) return;
        const r = await handleAPICall(`/api/polls/${p._id}`, { method:'DELETE', headers: getAuthHeaders() });
        if (r.error) return alert(r.message);
        load();
      };
      actions.appendChild(del);
    }
    wrap.appendChild(actions);

    // Options UI
    const opts = document.createElement('div');
    (p.options || []).forEach((o, idx) => {
      const line = document.createElement('div');
      line.style.display = 'flex';
      line.style.alignItems = 'center';
      line.style.marginTop = '6px';
      const voteBtn = document.createElement('button');
      voteBtn.className = 'btn btn-small';
      voteBtn.textContent = 'Vote';
      voteBtn.style.marginLeft = '8px';
      voteBtn.onclick = async () => {
        const r = await handleAPICall(`/api/polls/${p._id}/vote`, { method:'POST', headers: getAuthHeaders(), body: JSON.stringify({ option_index: idx }) });
        if (r.error) return alert(r.message);
        load();
      };
      const bar = document.createElement('div');
      const pct = total > 0 ? Math.round((o.votes || 0) * 100 / total) : 0;
      bar.style.cssText = `height:8px;background:var(--primary-color);border-radius:4px;width:${pct}%;min-width:${pct>0?pct:0}%`;
      const barWrap = document.createElement('div');
      barWrap.style.cssText = 'flex:1;background:var(--border-color);height:8px;border-radius:4px;overflow:hidden;';
      barWrap.appendChild(bar);
      const label = document.createElement('span');
      label.textContent = `${o.text} (${o.votes || 0})`;
      line.appendChild(label);
      line.appendChild(barWrap);
      line.appendChild(voteBtn);
      opts.appendChild(line);
    });
    wrap.querySelector(`#opts_${p._id}`).appendChild(opts);
    return wrap;
  }

  async function load() {
    list.innerHTML = '<div class="loading">Loading...</div>';
    const r = await handleAPICall('/api/polls', { headers: getAuthHeaders() });
    if (r.error) { list.innerHTML = `<div class="message error">${r.message}</div>`; return; }
    const items = r.data;
    if (!items.length) { list.innerHTML = '<div class="loading">No polls yet.</div>'; return; }
    list.innerHTML = '';
    items.forEach(p => list.appendChild(pollRow(p)));
  }

  if (addOptionBtn) {
    addOptionBtn.addEventListener('click', () => {
      const div = document.createElement('div');
      div.className = 'form-group';
      div.innerHTML = '<input type="text" name="option" placeholder="Another option" required />';
      optionsWrap.appendChild(div);
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const question = data.get('question');
      const options = data.getAll('option').filter(Boolean);
      const r = await handleAPICall('/api/polls', { method:'POST', headers: getAuthHeaders(), body: JSON.stringify({ question, options }) });
      if (r.error) return alert(r.message);
      form.reset();
      // leave two default option fields
      optionsWrap.innerHTML = '<div class="form-group"><input type="text" name="option" placeholder="Option 1" required /></div>\n<div class="form-group"><input type="text" name="option" placeholder="Option 2" required /></div>';
      load();
    });
  }

  load();
})();
