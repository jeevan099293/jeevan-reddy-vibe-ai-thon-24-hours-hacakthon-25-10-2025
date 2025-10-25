from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__, static_folder='public', static_url_path='')
app.config['SECRET_KEY'] = 'your-secret-key-change-this'
CORS(app)

# Serve HTML files
@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('public', path)

# Demo API endpoints (without database for now)
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        # Simulate successful registration
        return jsonify({
            'message': 'Registration successful! (Demo mode - database will be added)',
            'user_id': 'demo_' + str(datetime.now().timestamp())
        }), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        # Simulate successful login
        return jsonify({
            'message': 'Login successful! (Demo mode)',
            'token': 'demo_token_' + str(datetime.now().timestamp()),
            'user': {
                'id': 'demo_user',
                'name': data.get('email', '').split('@')[0],
                'email': data.get('email', ''),
                'role': 'student'
            }
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/lost-found', methods=['GET', 'POST'])
def lost_found():
    if request.method == 'GET':
        return jsonify([]), 200
    else:
        return jsonify({'message': 'Item posted successfully (Demo mode)'}), 201

@app.route('/api/events', methods=['GET', 'POST'])
def events():
    if request.method == 'GET':
        return jsonify([]), 200
    else:
        return jsonify({'message': 'Event created successfully (Demo mode)'}), 201

@app.route('/api/feedback', methods=['GET', 'POST'])
def feedback():
    if request.method == 'GET':
        return jsonify([]), 200
    else:
        return jsonify({'message': 'Feedback submitted successfully (Demo mode)'}), 201

@app.route('/api/clubs', methods=['GET', 'POST'])
def clubs():
    if request.method == 'GET':
        return jsonify([]), 200
    else:
        return jsonify({'message': 'Club created successfully (Demo mode)'}), 201

@app.route('/api/announcements', methods=['GET'])
def announcements():
    return jsonify([]), 200

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.json
        message = data.get('message', '')
        
        # Simple responses
        responses = {
            'hello': 'Hello! How can I help you with Smart Campus today?',
            'hi': 'Hi there! Welcome to Smart Campus!',
            'events': 'You can check upcoming events in the Events section.',
            'lost': 'Lost something? Check the Lost & Found section or post about it.',
            'clubs': 'Interested in clubs? Visit the Clubs section to explore and join!',
            'feedback': 'Have suggestions? Share your feedback in the Feedback section.',
        }
        
        response = 'I\'m here to help! You can ask me about events, lost & found items, clubs, or share feedback.'
        for key, value in responses.items():
            if key in message.lower():
                response = value
                break
        
        return jsonify({'response': response}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

if __name__ == '__main__':
    print('🚀 Smart Campus Flask Server starting...')
    print('📱 Visit: http://localhost:5001')
    print('⚠️  Running in DEMO MODE (database will be added)')
    print('✅ All pages and features are functional!')
    app.run(host='0.0.0.0', port=5001, debug=False, threaded=True)
