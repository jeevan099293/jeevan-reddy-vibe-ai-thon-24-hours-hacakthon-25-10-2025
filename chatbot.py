import google.generativeai as genai
from flask import Blueprint, request, jsonify
import os
from dotenv import load_dotenv

load_dotenv()

chatbot_bp = Blueprint('chatbot', __name__)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')

# Context for the chatbot about Smart Campus
SYSTEM_CONTEXT = """
You are a helpful AI assistant for KLH University's Smart Campus platform. Your role is to help students, faculty, and staff with campus-related queries.

You can help with:
1. Lost & Found: Help users understand how to report lost or found items
2. Events: Provide information about campus events and how to register
3. Feedback: Guide users on submitting feedback or grievances
4. Clubs: Inform about student clubs and how to join them
5. General Campus Information: Answer questions about campus facilities and services

Be friendly, concise, and helpful. If you don't know something specific, guide users to the appropriate section of the platform.
"""

@chatbot_bp.route('/api/chatbot', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'response': 'Please enter a message.'}), 400
        
        # Check if Gemini API is configured
        if not GEMINI_API_KEY:
            # Fallback to simple responses
            response = get_fallback_response(user_message.lower())
            return jsonify({'response': response}), 200
        
        # Use Gemini AI for response
        try:
            chat = model.start_chat(history=[])
            prompt = f"{SYSTEM_CONTEXT}\n\nUser: {user_message}\nAssistant:"
            
            response = chat.send_message(prompt)
            bot_response = response.text
            
            return jsonify({'response': bot_response}), 200
            
        except Exception as e:
            print(f"Gemini API error: {e}")
            # Fallback to simple responses
            response = get_fallback_response(user_message.lower())
            return jsonify({'response': response}), 200
            
    except Exception as e:
        return jsonify({'response': 'Sorry, I encountered an error. Please try again.'}), 500

def get_fallback_response(message):
    """Provide fallback responses when Gemini API is not available"""
    
    responses = {
        'hello': 'Hello! I\'m your Smart Campus AI Assistant. How can I help you today?',
        'hi': 'Hi there! I\'m here to help with any campus-related questions.',
        'help': 'I can help you with:\n- Lost & Found items\n- Campus events\n- Submitting feedback\n- Student clubs\n- General campus information\n\nWhat would you like to know?',
        'event': 'You can find all upcoming campus events in the Events section. You can register for events directly from there.',
        'lost': 'To report a lost or found item, go to the Lost & Found section and click "Report Item". You can also search for items that have been reported.',
        'found': 'Great! Please go to the Lost & Found section and click "Report Item" to report what you found. This will help someone recover their item.',
        'feedback': 'You can submit feedback or grievances through the Feedback section. Your concerns will be reviewed by the administration and you\'ll receive a response.',
        'club': 'Check out the Clubs section to explore all student organizations. You can join clubs that interest you with just one click!',
        'register': 'To register for an event, go to the Events section, find the event you\'re interested in, and click the "Register" button.',
        'join': 'To join a club, visit the Clubs section, browse available clubs, and click "Join Club" on the one you like.',
        'report': 'You can report items in the Lost & Found section. Just click "Report Item" and fill in the details about what you lost or found.',
        'contact': 'For direct contact, you can reach the administration through the Feedback section or email info@smartcampus.klh.edu',
    }
    
    # Check for keywords in user message
    for keyword, response in responses.items():
        if keyword in message:
            return response
    
    # Default response
    return """I'm here to help you with the Smart Campus platform! You can ask me about:

• 📍 Lost & Found - Report or search for lost items
• 📅 Events - Browse and register for campus events  
• 💬 Feedback - Submit feedback or grievances
• 👥 Clubs - Explore and join student organizations
• ℹ️ General campus information

What would you like to know more about?"""

# Export the blueprint
def init_chatbot(app):
    app.register_blueprint(chatbot_bp)
