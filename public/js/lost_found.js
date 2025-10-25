// Lost & Found JavaScript

const token = checkAuth();
const user = JSON.parse(localStorage.getItem('user'));
document.getElementById('userName').textContent = user.name;

let allItems = [];

// Load lost & found items
async function loadItems() {
    try {
        const response = await fetch('/api/lost-found', {
            headers: getAuthHeaders()
        });
        allItems = await response.json();
        displayItems(allItems);
    } catch (error) {
        console.error('Error loading items:', error);
    }
}

function displayItems(items) {
    const container = document.getElementById('itemsContainer');
    
    if (items.length === 0) {
        container.innerHTML = '<div class="loading">No items found.</div>';
        return;
    }
    
    const placeholder = 'https://via.placeholder.com/600x300?text=No+Image';
    container.innerHTML = items.map(item => {
        // Determine if current user can manage this item
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const isOwner = (item.user_id === currentUser.id || item.user_id === currentUser._id || item.user_id === currentUser.user_id);
        const isAdmin = (currentUser.role === 'admin' || currentUser.role === 'faculty');

        // Action buttons: allow owner or admin/faculty to delete (claim)
        let actionsHTML = '';
        if (isOwner || isAdmin) {
            actionsHTML = `
                <div style="margin-top:12px; display:flex; gap:8px;">
                    <button class="btn btn-primary" onclick="markClaimedAndDelete('${item._id}')">Mark Claimed & Delete</button>
                    <button class="btn btn-ghost" onclick="deleteItem('${item._id}')">Delete</button>
                </div>
            `;
        }

        return `
        <div class="item-card">
            <img src="${item.image_url || placeholder}" alt="${item.item_name}"
                 class="card-image" onerror="this.onerror=null;this.src='${placeholder}';">
            <div class="card-content">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <h3 class="card-title">${item.item_name}</h3>
                    <span class="badge badge-${item.type}">${item.type.toUpperCase()}</span>
                </div>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${item.description}</p>
                <div class="card-meta">
                    <div class="meta-item">
                        <i class="fas fa-tag"></i>
                        <span>${item.category}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${item.location}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(item.date).toLocaleDateString()}</span>
                    </div>
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                    <p style="font-size: 0.9rem; color: var(--text-secondary);">
                        <i class="fas fa-user"></i> ${item.user_name}<br>
                        <i class="fas fa-phone"></i> ${item.contact}
                    </p>
                </div>
                ${actionsHTML}
            </div>
        </div>
    `}).join('');
}

// Delete an item by ID
async function deleteItem(itemId) {
    if (!confirm('Are you sure you want to permanently delete this item?')) return;
    try {
        const res = await fetch('/api/lost-found/' + itemId, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        let data;
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
            data = await res.json();
        } else {
            data = { message: await res.text() };
        }
        console.log('DELETE response', res.status, data);
        if (res.ok) {
            alert(data.message || 'Deleted successfully');
            loadItems();
            return;
        }

        // If server returns 405 Method Not Allowed, try POST fallback
        if (res.status === 405) {
            console.warn('DELETE returned 405, attempting POST fallback to /delete endpoint');
            const fallback = await fetch('/api/lost-found/' + itemId + '/delete', {
                method: 'POST',
                headers: getAuthHeaders()
            });
            let fbData;
            const fbCt = fallback.headers.get('content-type') || '';
            if (fbCt.includes('application/json')) fbData = await fallback.json(); else fbData = { message: await fallback.text() };
            console.log('POST fallback response', fallback.status, fbData);
            if (fallback.ok) {
                alert(fbData.message || 'Deleted successfully (fallback)');
                loadItems();
            } else {
                alert((fbData && fbData.message) ? fbData.message : `Failed to delete item (fallback status ${fallback.status})`);
            }
            return;
        }

        alert((data && data.message) ? data.message : `Failed to delete item (status ${res.status})`);
    } catch (err) {
        console.error(err);
        alert('Error deleting item: ' + (err.message || err));
    }
}

// Mark as claimed (optional) then delete
async function markClaimedAndDelete(itemId) {
    if (!confirm('Mark this item as claimed and delete it from the list?')) return;
    try {
        // Update status to 'claimed' (for audit) - best-effort
        const resp = await fetch('/api/lost-found/' + itemId, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: 'claimed' })
        });
        if (!resp.ok) {
            // log non-fatal issue but continue to attempt delete
            console.warn('Mark claimed returned', resp.status);
        }

        // Then delete
        await deleteItem(itemId);
    } catch (err) {
        console.error(err);
        alert('Error marking claimed and deleting');
    }
}

// Filter items
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        if (filter === 'all') {
            displayItems(allItems);
        } else {
            displayItems(allItems.filter(item => item.type === filter));
        }
    });
});

// Search items
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allItems.filter(item => 
        item.item_name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm)
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

// Report form handler
document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = document.getElementById('reportForm');
    const fileInput = document.getElementById('image_file');
    const file = fileInput && fileInput.files && fileInput.files[0];

    // Build payload: if there's a file, use multipart/form-data; otherwise send JSON
    try {
        if (file) {
            const fd = new FormData();
            fd.append('image', file);
            // append form fields
            fd.append('type', form.type.value);
            fd.append('item_name', document.getElementById('item_name').value);
            fd.append('category', document.getElementById('category').value);
            fd.append('description', document.getElementById('description').value);
            fd.append('location', document.getElementById('location').value);
            fd.append('date', document.getElementById('date').value);
            fd.append('contact', document.getElementById('contact').value);

            // Build headers with Authorization only; DO NOT set Content-Type so browser sets multipart boundary
            const token = localStorage.getItem('token');
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('/api/lost-found', {
                method: 'POST',
                headers,
                body: fd
            });

            if (response.ok) {
                alert('Item reported successfully!');
                closeReportModal();
                loadItems();
            } else {
                const errText = await response.text();
                let error;
                try { error = JSON.parse(errText); } catch (_) { error = { message: errText }; }
                alert(error.message || 'Failed to report item');
            }
        } else {
            // No file: send JSON (for backward compatibility)
            const payload = {
                type: form.type.value,
                item_name: document.getElementById('item_name').value,
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                location: document.getElementById('location').value,
                date: document.getElementById('date').value,
                contact: document.getElementById('contact').value,
                image_url: document.getElementById('image_url') ? document.getElementById('image_url').value : ''
            };

            const response = await fetch('/api/lost-found', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Item reported successfully!');
                closeReportModal();
                loadItems();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to report item');
            }
        }
    } catch (error) {
        console.error('Report submit error', error);
        alert('An error occurred. Please try again.');
    }
});

// Load items on page load
loadItems();
