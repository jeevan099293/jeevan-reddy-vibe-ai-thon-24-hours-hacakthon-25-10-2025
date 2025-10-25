// Common Authentication and Utility Functions

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login if not authenticated (except on public pages)
        const publicPages = ['/', '/login', '/register', '/index.html', '/login.html', '/register.html'];
        const currentPage = window.location.pathname;
        
        if (!publicPages.includes(currentPage)) {
            window.location.href = '/login';
            return null;
        }
    }
    return token;
}

// Get authentication headers for API requests
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Show notification message
function showMessage(elementId, message, type = 'info') {
    const messageDiv = document.getElementById(elementId);
    if (messageDiv) {
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Handle API errors gracefully
async function handleAPICall(url, options = {}) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        // Check if database is disabled
        if (response.status === 503) {
            return {
                error: true,
                message: 'Database not connected. This is a demo version. UI is fully functional.',
                isDatabaseError: true
            };
        }
        
        if (!response.ok) {
            return {
                error: true,
                message: data.message || 'An error occurred',
                status: response.status
            };
        }
        
        return { error: false, data };
    } catch (error) {
        console.error('API Error:', error);
        return {
            error: true,
            message: 'Network error. Please check your connection.',
            originalError: error
        };
    }
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format time for display
function formatTime(dateString) {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Check if running in demo mode (no database)
function isDemoMode() {
    return localStorage.getItem('demoMode') === 'true';
}

// Enable demo mode
function enableDemoMode() {
    localStorage.setItem('demoMode', 'true');
    console.log('Demo mode enabled - UI will work without backend');
}

// Show demo mode banner
function showDemoModeBanner() {
    const banner = document.createElement('div');
    banner.className = 'demo-banner';
    banner.innerHTML = `
        <p>⚠️ Demo Mode: Running without database. All features work! To enable data persistence, 
        <a href="https://github.com/yourusername/smart-campus#database-setup" target="_blank" style="color: white; text-decoration: underline;">set up MongoDB Atlas</a></p>
    `;
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 8px;
        text-align: center;
        z-index: 10000;
        font-size: 13px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.prepend(banner);
    
    // Adjust body padding to prevent content overlap
    document.body.style.paddingTop = '35px';
}

// Theme utilities (light/dark)
function initTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

function injectThemeToggle() {
    const userMenu = document.querySelector('.user-menu') || document.querySelector('.nav-menu');
    if (!userMenu || document.getElementById('themeToggleBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'themeToggleBtn';
    btn.className = 'btn btn-small';
    btn.style.marginLeft = '8px';
    btn.innerHTML = '<i class="fas fa-moon"></i> Theme';
    btn.addEventListener('click', toggleTheme);
    userMenu.appendChild(btn);
}


function injectAdminConsoleLink() {
    const nav = document.querySelector('.nav-menu');
    if (!nav) return;
    if (Array.from(nav.querySelectorAll('a')).some(a => a.getAttribute('href') === '/admin')) return;
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user || !user.role || (user.role !== 'admin' && user.role !== 'faculty')) return;
        const li = document.createElement('li');
        li.innerHTML = '<a href="/admin"><i class="fas fa-tools"></i> Admin Console</a>';
        nav.appendChild(li);
    } catch (_) {}
}

function injectExtraNavLinks() {
    const nav = document.querySelector('.nav-menu');
    if (!nav) return;
    const ensure = (href, html) => {
        if (!Array.from(nav.querySelectorAll('a')).some(a => a.getAttribute('href') === href)) {
            const li = document.createElement('li');
            li.innerHTML = html;
            nav.appendChild(li);
        }
    };
    ensure('/resources', '<a href="/resources"><i class="fas fa-folder-open"></i> Resources</a>');
    ensure('/polls', '<a href="/polls"><i class="fas fa-poll"></i> Polls</a>');
}

// Initialize demo mode detection and UI injections
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    injectThemeToggle();
    injectAnnouncementsNavLink();
    injectAdminConsoleLink();
    injectExtraNavLinks();

    // Check if we're getting 503 errors (database disabled)
    fetch('/api/user/profile', {
        headers: getAuthHeaders()
    }).then(response => {
        if (response.status === 503) {
            enableDemoMode();
            // Only show banner on authenticated pages
            const authenticatedPages = ['/dashboard', '/lost-found', '/events', '/feedback', '/clubs', '/announcements'];
            if (authenticatedPages.some(page => window.location.pathname.includes(page))) {
                showDemoModeBanner();
            }
        }
    }).catch(() => {
        // Network error or server not responding
        console.log('Server check failed');
    });
});

function injectAnnouncementsNavLink() {
    const nav = document.querySelector('.nav-menu');
    if (!nav) return;
    const exists = Array.from(nav.querySelectorAll('a')).some(a => a.getAttribute('href') === '/announcements');
    if (exists) return;
    const li = document.createElement('li');
    li.innerHTML = '<a href="/announcements"><i class="fas fa-bullhorn"></i> Announcements</a>';
    // Put Announcements after Events if present, else append
    const eventsLink = Array.from(nav.children).find(li => li.textContent && li.textContent.toLowerCase().includes('events'));
    if (eventsLink && eventsLink.nextSibling) {
        nav.insertBefore(li, eventsLink.nextSibling);
    } else {
        nav.appendChild(li);
    }
}

// Export functions for use in other scripts
window.checkAuth = checkAuth;
window.getAuthHeaders = getAuthHeaders;
window.logout = logout;
window.showMessage = showMessage;
window.handleAPICall = handleAPICall;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.scrollToTop = scrollToTop;
window.isDemoMode = isDemoMode;
window.toggleTheme = toggleTheme;
