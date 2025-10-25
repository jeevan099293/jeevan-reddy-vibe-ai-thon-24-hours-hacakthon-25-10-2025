// Socket.IO client connection (safe guard if socket.io client is missing)
let socket;
if (typeof io === 'function') {
    socket = io();
} else {
    console.warn('Socket.IO client not found. Socket features are disabled.');
    // Provide a minimal stub to avoid runtime errors when pages call socket.on/emit
    socket = {
        on: function() {},
        emit: function() {},
        off: function() {}
    };
}

// Listen for new events
socket.on('new-event', (event) => {
    showNotification('New Event!', `${event.title} has been added`);
    if (window.location.pathname.includes('events')) {
        loadEvents(); // Refresh events if on events page
    }
});

// Listen for new announcements
socket.on('new-announcement', (announcement) => {
    showNotification('New Announcement!', announcement.title);
    if (window.location.pathname.includes('dashboard')) {
        loadAnnouncements(); // Refresh announcements if on dashboard
    }
});

// Listen for lost & found updates
socket.on('lost-found-update', (data) => {
    if (data.type === 'new') {
        showNotification('New Lost & Found Item', `${data.item.item_name} has been reported`);
    }
    if (window.location.pathname.includes('lost_found')) {
        loadLostFoundItems(); // Refresh items if on lost & found page
    }
});

// Listen for feedback updates
socket.on('feedback-update', (feedback) => {
    if (feedback.status === 'resolved') {
        showNotification('Feedback Resolved', 'Your feedback has been resolved');
    }
    if (window.location.pathname.includes('feedback')) {
        loadFeedback(); // Refresh feedback if on feedback page
    }
});

// Listen for new feedback (for admins)
socket.on('new-feedback', (feedback) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && ['admin', 'faculty'].includes(user.role)) {
        showNotification('New Feedback', `New ${feedback.category} feedback received`);
    }
});

// Listen for event registrations
socket.on('event-registration', (data) => {
    // Update event registration count in UI if on events page
    const eventCard = document.querySelector(`[data-event-id="${data.eventId}"]`);
    if (eventCard) {
        const countElement = eventCard.querySelector('.registration-count');
        if (countElement) {
            countElement.textContent = `${data.count} registered`;
        }
    }
});

// Listen for club joins
socket.on('club-join', (data) => {
    // Update club member count in UI if on clubs page
    const clubCard = document.querySelector(`[data-club-id="${data.clubId}"]`);
    if (clubCard) {
        const countElement = clubCard.querySelector('.member-count');
        if (countElement) {
            countElement.textContent = `${data.memberCount} members`;
        }
    }
});

// Listen for new clubs
socket.on('new-club', (club) => {
    showNotification('New Club!', `${club.name} has been created`);
    if (window.location.pathname.includes('clubs')) {
        loadClubs(); // Refresh clubs if on clubs page
    }
});

// Notification function
function showNotification(title, message) {
    // Check if browser supports notifications
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: '/images/logo.svg'
        });
    }

    // Also show in-app notification
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.innerHTML = `
        <strong>${title}</strong>
        <p>${message}</p>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Request notification permission on page load
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Connection status
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});
    