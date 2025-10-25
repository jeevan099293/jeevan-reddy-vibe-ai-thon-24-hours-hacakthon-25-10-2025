// Lost & Found JavaScript (clean, fixed)

"use strict";

const token = checkAuth();
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user && user.name && document.getElementById('userName')) {
    document.getElementById('userName').textContent = user.name;
}

let allItems = [];

// Utility to escape HTML to avoid injection in template strings
function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Load lost & found items
async function loadItems() {
    const container = document.getElementById('itemsContainer');
    try {
        // Build minimal headers for GET (avoid unnecessary Content-Type)
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch('/api/lost-found', { headers });
        if (!response.ok) {
            const text = await response.text();
            console.error('Failed to load items', response.status, text);
            if (container) container.innerHTML = '<div class="loading">Failed to load items.</div>';
            showToast('Failed to load items', 'Please refresh or try again.', 'error');
            return;
        }
        allItems = await response.json();
        displayItems(allItems);
    } catch (error) {
        console.error('Error loading items:', error);
        if (container) container.innerHTML = '<div class="loading">Unable to load items.</div>';
    }
}

function displayItems(items) {
    const container = document.getElementById('itemsContainer');
    if (!container) return;

    if (!Array.isArray(items) || items.length === 0) {
        container.innerHTML = '<div class="loading">No items found.</div>';
        return;
    }

    container.innerHTML = items.map(item => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const uid = currentUser.id || currentUser._id || currentUser.user_id;
        const ownerId = item.user_id || item.userId || item.owner_id;
        const isOwner = uid && ownerId && String(uid) === String(ownerId);
        const isAdmin = ['admin', 'faculty'].includes(currentUser.role);

        const actionsHTML = `
            <div style="margin-top:12px; display:flex; gap:8px; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="markClaimedAndDelete('${item._id}')">Mark Claimed & Delete</button>
                ${ (isOwner || isAdmin) ? `<button class="btn btn-ghost" onclick="deleteItem('${item._id}')">Delete</button>` : '' }
            </div>
        `;

        const imageHTML = item.image_url
            ? `<img src="${item.image_url}" alt="${escapeHtml(item.item_name || '')}" class="card-image">`
            : '<div class="card-image"></div>';

        return `
        <div class="item-card">
            ${imageHTML}
            <div class="card-content">
                <div style="display:flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <h3 class="card-title">${escapeHtml(item.item_name || '')}</h3>
                    <span class="badge badge-${item.type}">${String(item.type || '').toUpperCase()}</span>
                </div>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${escapeHtml(item.description || '')}</p>
                <div class="card-meta">
                    <div class="meta-item"><i class="fas fa-tag"></i><span>${escapeHtml(item.category || '')}</span></div>
                    <div class="meta-item"><i class="fas fa-map-marker-alt"></i><span>${escapeHtml(item.location || '')}</span></div>
                    <div class="meta-item"><i class="fas fa-calendar"></i><span>${item.date ? new Date(item.date).toLocaleDateString() : ''}</span></div>
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                    <p style="font-size: 0.9rem; color: var(--text-secondary);">
                        <i class="fas fa-user"></i> ${escapeHtml(item.user_name || '')}<br>
                        <i class="fas fa-phone"></i> ${escapeHtml(item.contact || '')}
                    </p>
                    ${actionsHTML}
                </div>
            </div>
        </div>`;
    }).join('');
}

// Delete an item by ID (owner/admin only)
async function deleteItem(itemId) {
    if (!confirm('Are you sure you want to permanently delete this item?')) return;
    try {
        // Prefer POST-based delete endpoint to avoid environments that block DELETE
        const res = await fetch(`/api/lost-found/${itemId}/delete`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        const text = await res.text();
        const data = (() => { try { return JSON.parse(text); } catch { return { message: text }; } })();
        if (res.ok) {
            showToast('Item deleted', '', 'success');
            loadItems();
            return;
        }
        showToast('Delete failed', data.message || `Status ${res.status}`, 'error');
    } catch (err) {
        console.error(err);
        showToast('Error deleting item', err.message || String(err), 'error');
    }
}

// Mark as claimed by current user, then delete (allowed for any authenticated user)
async function markClaimedAndDelete(itemId) {
    if (!confirm('Mark this item as claimed and delete it from the list?')) return;
    try {
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const resp = await fetch(`/api/lost-found/${itemId}/claim`, { method: 'POST', headers });
        const text = await resp.text();
        const data = (() => { try { return JSON.parse(text); } catch { return { message: text }; } })();
        if (resp.ok) {
            showToast('Claimed & deleted', '', 'success');
            loadItems();
        } else {
            showToast('Claim failed', data.message || `Status ${resp.status}`, 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Error during claim', err.message || String(err), 'error');
    }
}

// Filter items
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        if (filter === 'all') displayItems(allItems);
        else displayItems(allItems.filter(item => item.type === filter));
    });
});

// Search items
document.getElementById('searchInput').addEventListener('input', function (e) {
    const searchTerm = (e.target.value || '').toLowerCase();
    const filtered = allItems.filter(item =>
        (item.item_name || '').toLowerCase().includes(searchTerm) ||
        (item.description || '').toLowerCase().includes(searchTerm) ||
        (item.location || '').toLowerCase().includes(searchTerm)
    );
    displayItems(filtered);
});

// Modal functions
function openReportModal() {
    document.getElementById('reportModal').classList.add('active');
}

function closeReportModal() {
    document.getElementById('reportModal').classList.remove('active');
    document.getElementById('reportForm').reset();
}

// Report form handler (supports image upload)
document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = document.getElementById('reportForm');
    const fileInput = document.getElementById('image_file');
    const file = fileInput && fileInput.files && fileInput.files[0];
    try {
        if (file) {
            const fd = new FormData();
            fd.append('image', file);
            fd.append('type', form.type.value);
            fd.append('item_name', document.getElementById('item_name').value);
            fd.append('category', document.getElementById('category').value);
            fd.append('description', document.getElementById('description').value);
            fd.append('location', document.getElementById('location').value);
            fd.append('date', document.getElementById('date').value);
            fd.append('contact', document.getElementById('contact').value);

            const token = localStorage.getItem('token');
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('/api/lost-found', { method: 'POST', headers, body: fd });
            const text = await response.text();
            const data = (() => { try { return JSON.parse(text); } catch { return { message: text }; } })();
            if (response.ok) {
                showToast('Item reported', 'Your report has been submitted.', 'success');
                closeReportModal();
                loadItems();
            } else {
                showToast('Report failed', data.message || 'Please try again.', 'error');
            }
        } else {
            // JSON fallback (no file)
            const payload = {
                type: form.type.value,
                item_name: document.getElementById('item_name').value,
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                location: document.getElementById('location').value,
                date: document.getElementById('date').value,
                contact: document.getElementById('contact').value,
                image_url: ''
            };
            const response = await fetch('/api/lost-found', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                showToast('Item reported', 'Your report has been submitted.', 'success');
                closeReportModal();
                loadItems();
            } else {
                const err = await response.json().catch(() => ({}));
                showToast('Report failed', err.message || 'Please try again.', 'error');
            }
        }
    } catch (error) {
        console.error('Report submit error', error);
        showToast('Error', 'An error occurred. Please try again.', 'error');
    }
});

// Expose actions for inline onclick handlers
window.deleteItem = deleteItem;
window.markClaimedAndDelete = markClaimedAndDelete;

// Load items on page load
loadItems();
