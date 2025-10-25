// Chatbot JavaScript with Gemini AI Integration

let isChatOpen = false;

function toggleChat() {
    const chatBody = document.getElementById('chatbotBody');
    const toggleIcon = document.getElementById('chatToggleIcon');
    
    isChatOpen = !isChatOpen;
    
    if (isChatOpen) {
        chatBody.classList.remove('hidden');
        toggleIcon.classList.remove('fa-chevron-down');
        toggleIcon.classList.add('fa-chevron-up');
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
        } else {
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    } catch (error) {
        typingDiv.remove();
        addMessage('Sorry, I am unable to connect right now. Please try again later.', 'bot');
    }
}

function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'bot' ? 'bot-message' : 'user-message';
    
    if (type === 'bot') {
        messageDiv.innerHTML = `
            <i class="fas fa-robot"></i>
            <p>${text}</p>
        `;
    } else {
        messageDiv.innerHTML = `<p>${text}</p>`;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
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
    if (e.key === 'Enter') {
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
