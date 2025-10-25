// Events JavaScript

const token = checkAuth();
const user = JSON.parse(localStorage.getItem('user'));
document.getElementById('userName').textContent = user.name;

// Show create event button for admin/faculty
if (user.role === 'admin' || user.role === 'faculty') {
    document.getElementById('createEventBtn').style.display = 'inline-flex';
}

let allEvents = [];

// Load events
async function loadEvents() {
    try {
        const response = await fetch('/api/events', {
            headers: getAuthHeaders()
        });
        allEvents = await response.json();
        displayEvents(allEvents);
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function displayEvents(events) {
    const container = document.getElementById('eventsContainer');
    
    if (events.length === 0) {
        container.innerHTML = '<div class="loading">No events found.</div>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="event-card">
            ${event.image_url ? `<img src="${event.image_url}" alt="${event.title}" class="card-image">` : '<div class="card-image"></div>'}
            <div class="card-content">
                <h3 class="card-title">${event.title}</h3>
                <span class="badge badge-${event.status}">${event.status.toUpperCase()}</span>
                <p style="color: var(--text-secondary); margin: 1rem 0;">${event.description}</p>
                <div class="card-meta">
                    <div class="meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(event.event_date).toLocaleDateString()}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${event.event_time}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-tag"></i>
                        <span>${event.category}</span>
                    </div>
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">
                        <i class="fas fa-user"></i> Organized by: ${event.creator_name}<br>
                        <i class="fas fa-users"></i> Registered: ${event.registered_users?.length || 0}${event.max_participants > 0 ? '/' + event.max_participants : ''}
                    </p>
                    <button class="btn btn-primary btn-block" onclick="registerForEvent('${event._id}')">
                        <i class="fas fa-calendar-check"></i> Register
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Register for event
async function registerForEvent(eventId) {
    try {
        const response = await fetch(`/api/events/${eventId}/register`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        alert(data.message);
        
        if (response.ok) {
            loadEvents();
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
}

// Filter events
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        if (filter === 'all') {
            displayEvents(allEvents);
        } else if (filter === 'upcoming') {
            displayEvents(allEvents.filter(event => event.status === 'upcoming'));
        } else if (filter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            displayEvents(allEvents.filter(event => event.event_date === today));
        }
    });
});

// Search events
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allEvents.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm)
    );
    displayEvents(filtered);
});

// Modal functions
function openEventModal() {
    document.getElementById('eventModal').classList.add('active');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
    document.getElementById('eventForm').reset();
}

// Event form handler
document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        event_date: formData.get('event_date'),
        event_time: formData.get('event_time'),
        location: formData.get('location'),
        max_participants: parseInt(formData.get('max_participants')),
        image_url: formData.get('image_url')
    };
    
    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Event created successfully!');
            closeEventModal();
            loadEvents();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
});

// Load events on page load
loadEvents();
