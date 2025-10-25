// Feedback JavaScript

const token = checkAuth();
const user = JSON.parse(localStorage.getItem('user'));
document.getElementById('userName').textContent = user.name;

let allFeedback = [];

// Load feedback (admin/faculty only for viewing all)
async function loadFeedback() {
    try {
        const response = await fetch('/api/feedback', {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            allFeedback = await response.json();
            displayFeedback(allFeedback);
            updateStats(allFeedback);
        } else {
            // If not authorized to view all, just show empty state
            document.getElementById('feedbackContainer').innerHTML = '<div class="loading">Submit your feedback using the button above.</div>';
        }
    } catch (error) {
        console.error('Error loading feedback:', error);
    }
}

function displayFeedback(feedbackList) {
    const container = document.getElementById('feedbackContainer');
    
    if (feedbackList.length === 0) {
        container.innerHTML = '<div class="loading">No feedback submitted yet.</div>';
        return;
    }
    
    container.innerHTML = feedbackList.map(feedback => `
        <div class="feedback-item priority-${feedback.priority}">
            <div class="feedback-header">
                <div>
                    <div class="feedback-title">${feedback.subject}</div>
                    <div class="feedback-meta">
                        <i class="fas fa-user"></i> ${feedback.user_name} • 
                        <i class="fas fa-tag"></i> ${feedback.category} • 
                        <i class="fas fa-calendar"></i> ${new Date(feedback.created_at).toLocaleDateString()}
                    </div>
                </div>
                <span class="badge badge-${feedback.status === 'pending' ? 'active' : 'found'}">${feedback.status.toUpperCase()}</span>
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">${feedback.message}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <span class="badge" style="background: ${feedback.priority === 'high' ? 'var(--danger-color)' : feedback.priority === 'medium' ? 'var(--warning-color)' : 'var(--secondary-color)'}; color: white;">
                    ${feedback.priority.toUpperCase()} PRIORITY
                </span>
                ${feedback.response ? `<p style="font-size: 0.9rem;"><strong>Response:</strong> ${feedback.response}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function updateStats(feedbackList) {
    const total = feedbackList.length;
    const pending = feedbackList.filter(f => f.status === 'pending').length;
    const resolved = feedbackList.filter(f => f.status === 'resolved').length;
    
    const statBoxes = document.querySelectorAll('.stat-box h3');
    if (statBoxes.length >= 3) {
        statBoxes[0].textContent = total;
        statBoxes[1].textContent = pending;
        statBoxes[2].textContent = resolved;
    }
}

// Filter feedback
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        if (filter === 'all') {
            displayFeedback(allFeedback);
        } else {
            displayFeedback(allFeedback.filter(f => f.status === filter));
        }
    });
});

// Modal functions
function openFeedbackModal() {
    document.getElementById('feedbackModal').classList.add('active');
}

function closeFeedbackModal() {
    document.getElementById('feedbackModal').classList.remove('active');
    document.getElementById('feedbackForm').reset();
}

// Feedback form handler
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        category: formData.get('category'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        priority: formData.get('priority')
    };
    
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Feedback submitted successfully!');
            closeFeedbackModal();
            loadFeedback();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
});

// Load feedback on page load
loadFeedback();
