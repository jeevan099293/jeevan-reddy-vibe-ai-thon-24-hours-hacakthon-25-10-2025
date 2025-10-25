// Authentication JavaScript

const allowedDomain = '@klh.edu.in';

// Realtime email domain warning (applies to both pages)
function attachEmailDomainWatcher() {
    const emailInput = document.getElementById('email');
    const warn = document.getElementById('emailDomainWarning');
    if (!emailInput || !warn) return;
    const showWarn = () => {
        const val = (emailInput.value || '').toLowerCase();
        if (val && !val.endsWith(allowedDomain)) {
            warn.style.display = 'block';
        } else {
            warn.style.display = 'none';
        }
    };
    emailInput.addEventListener('input', showWarn);
    // Initial check
    showWarn();
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    attachEmailDomainWatcher();
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');
        
        try {
            // Client-side domain check (helps UX)
            if (!email || !email.toLowerCase().endsWith(allowedDomain)) {
                messageDiv.className = 'message error';
                messageDiv.textContent = `Login restricted to ${allowedDomain} addresses only.`;
                return;
            }

            const result = await handleAPICall('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (result.isDatabaseError) {
                // Demo mode - simulate successful login
                messageDiv.className = 'message warning';
                messageDiv.textContent = '⚠️ Demo Mode: Simulating login (database disabled)';
                
                // Create dummy user
                const dummyUser = {
                    name: email.split('@')[0],
                    email: email,
                    role: 'student'
                };
                
                localStorage.setItem('token', 'demo-token-' + Date.now());
                localStorage.setItem('user', JSON.stringify(dummyUser));
                
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } else if (!result.error) {
                messageDiv.className = 'message success';
                messageDiv.textContent = result.data.message;
                
                // Store token and user info
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('user', JSON.stringify(result.data.user));
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1000);
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = result.message;
            }
        } catch (error) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'An error occurred. Please try again.';
        }
    });
}

// Register Form Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    attachEmailDomainWatcher();
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const student_id = document.getElementById('student_id').value;
        const role = document.getElementById('role').value;
    const invite_code_input = document.getElementById('invite_code');
    const invite_code = invite_code_input ? invite_code_input.value : '';
        const password = document.getElementById('password').value;
        const confirm_password = document.getElementById('confirm_password').value;
        const messageDiv = document.getElementById('message');
        
        // Validate passwords match
        if (password !== confirm_password) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Passwords do not match!';
            return;
        }
        // Validate KLH email domain and role
        if (!email || !email.toLowerCase().endsWith(allowedDomain)) {
            messageDiv.className = 'message error';
            messageDiv.textContent = `Registration restricted to ${allowedDomain} addresses only.`;
            return;
        }

        if (!['student', 'faculty', 'admin'].includes(role)) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Role must be student, faculty, or admin.';
            return;
        }
        
        try {
            const payload = { name, email, student_id, role, password };
            if (role === 'admin') {
                payload.invite_code = invite_code;
            }
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                messageDiv.className = 'message success';
                messageDiv.textContent = data.message + ' Redirecting to login...';
                
                // Redirect to login
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 2000);
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = data.message;
            }
        } catch (error) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'An error occurred. Please try again.';
        }
    });
}

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
    }
    return token;
}

// Get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}
