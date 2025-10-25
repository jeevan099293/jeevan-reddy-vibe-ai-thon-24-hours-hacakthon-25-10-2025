// Dashboard JavaScript

// Check authentication
const token = checkAuth();
const user = JSON.parse(localStorage.getItem('user'));

// Update user name in navbar
document.getElementById('userName').textContent = user.name;
document.getElementById('userNameDisplay').textContent = user.name;

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load announcements
        const announcementsRes = await fetch('/api/announcements', {
            headers: getAuthHeaders()
        });
        const announcements = await announcementsRes.json();
        displayAnnouncements(announcements);
        
        // Load upcoming events
        const eventsRes = await fetch('/api/events', {
            headers: getAuthHeaders()
        });
        const events = await eventsRes.json();
        displayUpcomingEvents(events.slice(0, 5));
        
        // Load lost & found items
        const lostFoundRes = await fetch('/api/lost-found', {
            headers: getAuthHeaders()
        });
        const lostFound = await lostFoundRes.json();
        displayLostFound(lostFound.slice(0, 5));
        
        // Load clubs
        const clubsRes = await fetch('/api/clubs', {
            headers: getAuthHeaders()
        });
        const clubs = await clubsRes.json();
        displayClubs(clubs.slice(0, 5));
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function displayAnnouncements(announcements) {
    const container = document.getElementById('announcementsContainer');
    
    if (announcements.length === 0) {
        container.innerHTML = '<p class="text-center">No announcements yet.</p>';
        return;
    }
    
    container.innerHTML = announcements.map(announcement => `
        <div class="announcement-item" style="padding: 1rem; border-left: 3px solid var(--primary-color); margin-bottom: 1rem; background: var(--light-bg); border-radius: 8px;">
            <h4 style="margin-bottom: 0.5rem;">${announcement.title}</h4>
            <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">${announcement.message}</p>
            <small style="color: var(--text-secondary);">
                <i class="fas fa-user"></i> ${announcement.created_by} • 
                <i class="fas fa-clock"></i> ${new Date(announcement.created_at).toLocaleDateString()}
            </small>
        </div>
    `).join('');
}

function displayUpcomingEvents(events) {
    const container = document.getElementById('upcomingEventsContainer');
    
    if (events.length === 0) {
        container.innerHTML = '<p class="text-center">No upcoming events.</p>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="event-preview" style="padding: 1rem; border-bottom: 1px solid var(--border-color); cursor: pointer;" onclick="location.href='/events'">
            <h4 style="margin-bottom: 0.5rem;">${event.title}</h4>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
                <i class="fas fa-calendar"></i> ${event.event_date} at ${event.event_time}<br>
                <i class="fas fa-map-marker-alt"></i> ${event.location}
            </p>
        </div>
    `).join('');
}

function displayLostFound(items) {
    const container = document.getElementById('lostFoundContainer');
    
    if (items.length === 0) {
        container.innerHTML = '<p class="text-center">No items reported.</p>';
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="item-preview" style="padding: 1rem; border-bottom: 1px solid var(--border-color); cursor: pointer;" onclick="location.href='/lost-found'">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h4 style="margin-bottom: 0.5rem;">${item.item_name}</h4>
                    <p style="font-size: 0.9rem; color: var(--text-secondary);">
                        <i class="fas fa-map-marker-alt"></i> ${item.location}
                    </p>
                </div>
                <span class="badge badge-${item.type}">${item.type.toUpperCase()}</span>
            </div>
        </div>
    `).join('');
}

function displayClubs(clubs) {
    const container = document.getElementById('clubsContainer');
    
    if (clubs.length === 0) {
        container.innerHTML = '<p class="text-center">No clubs available.</p>';
        return;
    }
    
    container.innerHTML = clubs.map(club => `
        <div class="club-preview" style="padding: 1rem; border-bottom: 1px solid var(--border-color); cursor: pointer;" onclick="location.href='/clubs'">
            <h4 style="margin-bottom: 0.5rem;">${club.name}</h4>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
                <i class="fas fa-users"></i> ${club.members?.length || 0} members • 
                <span class="badge" style="background: var(--light-bg);">${club.category}</span>
            </p>
        </div>
    `).join('');
}

// Load data on page load
loadDashboardData();
