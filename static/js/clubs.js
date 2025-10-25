// Clubs JavaScript

const token = checkAuth();
const user = JSON.parse(localStorage.getItem('user'));
document.getElementById('userName').textContent = user.name;

// Show create club button for admin/faculty
if (user.role === 'admin' || user.role === 'faculty') {
    document.getElementById('createClubBtn').style.display = 'inline-flex';
}

let allClubs = [];

// Load clubs
async function loadClubs() {
    try {
        const response = await fetch('/api/clubs', {
            headers: getAuthHeaders()
        });
        allClubs = await response.json();
        displayClubs(allClubs);
    } catch (error) {
        console.error('Error loading clubs:', error);
    }
}

function displayClubs(clubs) {
    const container = document.getElementById('clubsContainer');
    
    if (clubs.length === 0) {
        container.innerHTML = '<div class="loading">No clubs found.</div>';
        return;
    }
    
    container.innerHTML = clubs.map(club => `
        <div class="club-card">
            ${club.image_url ? `<img src="${club.image_url}" alt="${club.name}" class="card-image">` : '<div class="card-image"></div>'}
            <div class="card-content">
                <h3 class="card-title">${club.name}</h3>
                <span class="badge" style="background: var(--primary-color); color: white;">${club.category}</span>
                <p style="color: var(--text-secondary); margin: 1rem 0;">${club.description}</p>
                <div class="card-meta">
                    <div class="meta-item">
                        <i class="fas fa-user-tie"></i>
                        <span>${club.president}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-envelope"></i>
                        <span>${club.contact_email}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-users"></i>
                        <span>${club.members?.length || 0} members</span>
                    </div>
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                    <button class="btn btn-primary btn-block" onclick="joinClub('${club._id}')">
                        <i class="fas fa-user-plus"></i> Join Club
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Join club
async function joinClub(clubId) {
    try {
        const response = await fetch(`/api/clubs/${clubId}/join`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        alert(data.message);
        
        if (response.ok) {
            loadClubs();
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
}

// Filter clubs
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        if (filter === 'all') {
            displayClubs(allClubs);
        } else {
            displayClubs(allClubs.filter(club => club.category === filter));
        }
    });
});

// Search clubs
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allClubs.filter(club => 
        club.name.toLowerCase().includes(searchTerm) ||
        club.description.toLowerCase().includes(searchTerm) ||
        club.category.toLowerCase().includes(searchTerm)
    );
    displayClubs(filtered);
});

// Modal functions
function openClubModal() {
    document.getElementById('clubModal').classList.add('active');
}

function closeClubModal() {
    document.getElementById('clubModal').classList.remove('active');
    document.getElementById('clubForm').reset();
}

// Club form handler
document.getElementById('clubForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        category: formData.get('category'),
        president: formData.get('president'),
        contact_email: formData.get('contact_email'),
        image_url: formData.get('image_url')
    };
    
    try {
        const response = await fetch('/api/clubs', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Club created successfully!');
            closeClubModal();
            loadClubs();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
});

// Load clubs on page load
loadClubs();
