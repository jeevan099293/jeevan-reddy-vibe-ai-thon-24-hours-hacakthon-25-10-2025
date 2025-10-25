// Chatbot JavaScript with Gemini AI Integration + UX upgrades (suggestions, history)

let isChatOpen = false;

// Simple HTML escape to prevent injection in chat messages
function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getChatUserId() {
    try {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        return u.id || u._id || 'guest';
    } catch (_) { return 'guest'; }
}

function getChatKey() {
    return `chatHistory:${getChatUserId()}`;
}

function loadChatHistory() {
    try {
        const raw = localStorage.getItem(getChatKey());
        return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
}

function saveChatHistory(history) {
    try { localStorage.setItem(getChatKey(), JSON.stringify(history.slice(-50))); } catch (_) {}
}

function appendHistory(role, text) {
    const hist = loadChatHistory();
    hist.push({ role, text, ts: Date.now() });
    saveChatHistory(hist);
}

function renderChatHistory() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    // Initial greeting
    addMessage("Hello! I'm your Smart Campus AI Assistant. How can I help you today?", 'bot', false);
    const hist = loadChatHistory();
    hist.forEach(m => addMessage(m.text, m.role, false));
}

function toggleChat() {
    const chatBody = document.getElementById('chatbotBody');
    const toggleIcon = document.getElementById('chatToggleIcon');
    
    isChatOpen = !isChatOpen;
    
    if (isChatOpen) {
        chatBody.classList.remove('hidden');
        toggleIcon.classList.remove('fa-chevron-down');
        toggleIcon.classList.add('fa-chevron-up');
        // Load history on open
        renderChatHistory();
        injectSuggestionChips();
    } else {
        chatBody.classList.add('hidden');
        toggleIcon.classList.remove('fa-chevron-up');
        toggleIcon.classList.add('fa-chevron-down');
    }
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    appendHistory('user', message);
    input.value = '';
    
    // Show typing indicator
    const typingDiv = addTypingIndicator();
    
    try {
        // Send message to backend
        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        typingDiv.remove();
        
        // Add bot response
        if (response.ok) {
            addMessage(data.response, 'bot');
            appendHistory('bot', data.response);
        } else {
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    } catch (error) {
        typingDiv.remove();
        addMessage('Sorry, I am unable to connect right now. Please try again later.', 'bot');
    }
}

function addMessage(text, type, allowScroll = true) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'bot' ? 'bot-message' : 'user-message';
    
    if (type === 'bot') {
        messageDiv.innerHTML = `
            <i class="fas fa-robot"></i>
            <p>${escapeHtml(text)}</p>
        `;
    } else {
        messageDiv.innerHTML = `<p>${escapeHtml(text)}</p>`;
    }
    
    messagesContainer.appendChild(messageDiv);
    if (allowScroll) messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageDiv;
}

function addTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message';
    typingDiv.innerHTML = `
        <i class="fas fa-robot"></i>
        <p>Typing...</p>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return typingDiv;
}

// Handle Enter key
document.getElementById('chatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Pre-defined quick responses for common questions
const quickResponses = {
    'hello': 'Hello! I\'m your Smart Campus AI Assistant. How can I help you today?',
    'hi': 'Hi there! I\'m here to help with any campus-related questions.',
    'help': 'I can help you with:\n- Lost & Found items\n- Campus events\n- Submitting feedback\n- Student clubs\n- General campus information\n\nWhat would you like to know?',
    'events': 'You can find all upcoming campus events in the Events section. Would you like me to show you the latest events?',
    'lost': 'To report a lost or found item, go to the Lost & Found section and click "Report Item". You can also search for items there.',
    'feedback': 'You can submit feedback or grievances through the Feedback section. Your concerns will be reviewed by the administration.',
    'clubs': 'Check out the Clubs section to explore all student organizations and join ones that interest you!'
};

function injectSuggestionChips() {
    const container = document.getElementById('chatSuggestions');
    if (!container) return;
    container.innerHTML = '';
    const prompts = [
        { key: 'lost', label: 'How to report Lost & Found?' },
        { key: 'events', label: 'Events today' },
        { key: 'feedback', label: 'Submit feedback' },
        { key: 'clubs', label: 'Join a club' },
        { key: 'help', label: 'What can you do?' }
    ];
    prompts.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-chip';
        btn.style.cssText = 'padding:6px 10px; border-radius:16px; background:var(--card-bg); border:1px solid var(--border-color); color:var(--text-secondary); font-size:12px;';
        btn.textContent = p.label;
        btn.addEventListener('click', () => {
            const text = quickResponses[p.key] || p.label;
            // Simulate sending the suggestion as user message
            const input = document.getElementById('chatInput');
            input.value = text;
            sendMessage();
        });
        container.appendChild(btn);
    });
}

function clearChatHistory() {
    try { localStorage.removeItem(getChatKey()); } catch (_) {}
    // Rerender starting state
    renderChatHistory();
}

// expose clear function for inline button
window.clearChatHistory = clearChatHistory;

// Initialize suggestions and history on page load if widget is visible
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('chatbotBody')) {
        renderChatHistory();
        injectSuggestionChips();
    }
});
