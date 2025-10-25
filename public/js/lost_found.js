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
    container.innerHTML = items.map(item => `
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
            </div>
        </div>
    `).join('');
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
    
    const formData = new FormData(e.target);
    const data = {
        type: formData.get('type'),
        item_name: formData.get('item_name'),
        category: formData.get('category'),
        description: formData.get('description'),
        location: formData.get('location'),
        date: formData.get('date'),
        contact: formData.get('contact'),
        image_url: formData.get('image_url')
    };
    
    try {
        const response = await fetch('/api/lost-found', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Item reported successfully!');
            closeReportModal();
            loadItems();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
});

// Load items on page load
loadItems();
