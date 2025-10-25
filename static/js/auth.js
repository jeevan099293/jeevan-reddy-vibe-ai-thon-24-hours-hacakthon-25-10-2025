// Authentication JavaScript

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                messageDiv.className = 'message success';
                messageDiv.textContent = data.message;
                
                // Store token and user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
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

// Register Form Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const student_id = document.getElementById('student_id').value;
        const role = document.getElementById('role').value;
        const password = document.getElementById('password').value;
        const confirm_password = document.getElementById('confirm_password').value;
        const messageDiv = document.getElementById('message');
        
        // Validate passwords match
        if (password !== confirm_password) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Passwords do not match!';
            return;
        }
        
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, student_id, role, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                messageDiv.className = 'message success';
                messageDiv.textContent = data.message + ' Redirecting to login...';
                
                // Redirect to login
                setTimeout(() => {
                    window.location.href = '/login';
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
        window.location.href = '/login';
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
    window.location.href = '/login';
}
