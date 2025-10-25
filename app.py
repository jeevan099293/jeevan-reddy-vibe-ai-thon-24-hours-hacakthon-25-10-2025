from flask import Flask, request, jsonify, send_from_directory, redirect
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
from functools import wraps
import bcrypt
import jwt
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

# Try to import chatbot (optional)
try:
    from chatbot import init_chatbot
    CHATBOT_AVAILABLE = True
except ImportError:
    CHATBOT_AVAILABLE = False
    print("⚠️  Chatbot module not available, using simple responses")

load_dotenv()

app = Flask(__name__, static_folder='public', static_url_path='')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-this')
CORS(app)

# Upload settings
app.config['MAX_CONTENT_LENGTH'] = 8 * 1024 * 1024  # 8 MB
UPLOAD_FOLDER = os.path.join('public', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}

# Initialize chatbot if available
if CHATBOT_AVAILABLE:
    try:
        init_chatbot(app)
        print("✓ Chatbot initialized")
    except Exception as e:
        print(f"⚠️  Chatbot initialization failed: {e}")
        CHATBOT_AVAILABLE = False

# MongoDB Connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Test connection
    client.server_info()
    db = client['smart_campus']
    print(f"✓ Connected to MongoDB at {MONGO_URI}")
except Exception as e:
    print(f"✗ MongoDB connection failed: {e}")
    print("⚠️  Server will not start without database")
    exit(1)

# Collections
users_collection = db['users']
events_collection = db['events']
lost_found_collection = db['lost_found']
feedback_collection = db['feedback']
clubs_collection = db['clubs']
announcements_collection = db['announcements']
resources_collection = db['resources']
polls_collection = db['polls']

# Token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            token = token.split()[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users_collection.find_one({'_id': ObjectId(data['user_id'])})
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# Role verification decorator
def role_required(*roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(current_user, *args, **kwargs):
            if current_user['role'] not in roles:
                return jsonify({'message': 'Access denied!'}), 403
            return f(current_user, *args, **kwargs)
        return decorated_function
    return decorator

# Routes - Serve static HTML files
@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/login.html')
def login_page():
    return send_from_directory('public', 'login.html')

@app.route('/register.html')
def register_page():
    return send_from_directory('public', 'register.html')

@app.route('/dashboard.html')
def dashboard():
    return send_from_directory('public', 'dashboard.html')

@app.route('/lost_found.html')
def lost_found():
    return send_from_directory('public', 'lost_found.html')

@app.route('/events.html')
def events():
    return send_from_directory('public', 'events.html')

@app.route('/feedback.html')
def feedback():
    return send_from_directory('public', 'feedback.html')

@app.route('/clubs.html')
def clubs():
    return send_from_directory('public', 'clubs.html')

# Also support routes without the .html extension (friendly URLs)
@app.route('/login')
def login_page_naked():
    return send_from_directory('public', 'login.html')

@app.route('/register')
def register_page_naked():
    return send_from_directory('public', 'register.html')

@app.route('/dashboard')
def dashboard_naked():
    return send_from_directory('public', 'dashboard.html')

@app.route('/lost-found')
def lost_found_naked():
    return send_from_directory('public', 'lost_found.html')

@app.route('/events')
def events_naked():
    return send_from_directory('public', 'events.html')

@app.route('/feedback')
def feedback_naked():
    return send_from_directory('public', 'feedback.html')

@app.route('/clubs')
def clubs_naked():
    return send_from_directory('public', 'clubs.html')

@app.route('/admin.html')
def admin_page():
    return send_from_directory('public', 'admin.html')

@app.route('/admin')
def admin_page_naked():
    return send_from_directory('public', 'admin.html')

@app.route('/announcements.html')
def announcements_page():
    return send_from_directory('public', 'announcements.html')

@app.route('/announcements')
def announcements_page_naked():
    return send_from_directory('public', 'announcements.html')

# Alternative aliases to avoid 404 typos
@app.route('/announcement')
def announcement_alias():
    return send_from_directory('public', 'announcements.html')

@app.route('/announcement.html')
def announcement_alias_html():
    return send_from_directory('public', 'announcements.html')

@app.route('/resources.html')
def resources_page():
    return send_from_directory('public', 'resources.html')

@app.route('/resources')
def resources_page_naked():
    return send_from_directory('public', 'resources.html')

@app.route('/polls.html')
def polls_page():
    return send_from_directory('public', 'polls.html')

@app.route('/polls')
def polls_page_naked():
    return send_from_directory('public', 'polls.html')

# Serve other static files (CSS, JS, etc.)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('public', path)

# API Routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'student')  # Default role is student
        student_id = data.get('student_id', '')
        invite_code = data.get('invite_code')
        # Enforce KLH email domain and allowed roles
        allowed_domain = '@klh.edu.in'
        if not email or not email.lower().endswith(allowed_domain):
            return jsonify({'message': f'Registration restricted to {allowed_domain} addresses only.'}), 403

        if role not in ['student', 'faculty', 'admin']:
            return jsonify({'message': 'Role must be one of "student", "faculty", or "admin".'}), 400

        # Optional: Require invite code for admin registrations if configured
        if role == 'admin':
            required_code = os.getenv('ADMIN_INVITE_CODE')
            if required_code:
                if not invite_code or invite_code != required_code:
                    return jsonify({'message': 'Admin registration requires a valid invite code.'}), 403

        email = email.lower()

        # Check if user exists
        if users_collection.find_one({'email': email}):
            return jsonify({'message': 'User already exists!'}), 400
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'role': role,
            'student_id': student_id,
            'created_at': datetime.utcnow()
        }
        
        result = users_collection.insert_one(user)
        
        return jsonify({
            'message': 'Registration successful!',
            'user_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Error handlers for a more professional UX
@app.errorhandler(404)
def handle_404(e):
    try:
        return send_from_directory('public', '404.html'), 404
    except Exception:
        return jsonify({'message': 'Resource not found'}), 404

@app.errorhandler(500)
def handle_500(e):
    return jsonify({'message': 'An internal server error occurred'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        # Enforce KLH email domain for login as well
        allowed_domain = '@klh.edu.in'
        if not email or not email.lower().endswith(allowed_domain):
            return jsonify({'message': f'Login restricted to {allowed_domain} addresses only.'}), 403

        email = email.lower()

        user = users_collection.find_one({'email': email})
        
        if not user:
            return jsonify({'message': 'Invalid credentials!'}), 401
        
        if bcrypt.checkpw(password.encode('utf-8'), user['password']):
            token = jwt.encode({
                'user_id': str(user['_id']),
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, app.config['SECRET_KEY'], algorithm='HS256')
            
            return jsonify({
                'message': 'Login successful!',
                'token': token,
                'user': {
                    'id': str(user['_id']),
                    'name': user['name'],
                    'email': user['email'],
                    'role': user['role']
                }
            }), 200
        else:
            return jsonify({'message': 'Invalid credentials!'}), 401
            
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/user/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'id': str(current_user['_id']),
        'name': current_user['name'],
        'email': current_user['email'],
        'role': current_user['role'],
        'student_id': current_user.get('student_id', '')
    }), 200

# Lost & Found Routes
@app.route('/api/lost-found', methods=['GET'])
@token_required
def get_lost_found_items(current_user):
    try:
        items = list(lost_found_collection.find().sort('created_at', -1))
        for item in items:
            item['_id'] = str(item['_id'])
            item['user_id'] = str(item['user_id'])
        return jsonify(items), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/lost-found', methods=['POST'])
@token_required
def create_lost_found_item(current_user):
    try:
        data = request.json
        item = {
            'user_id': current_user['_id'],
            'user_name': current_user['name'],
            'type': data.get('type'),  # 'lost' or 'found'
            'item_name': data.get('item_name'),
            'description': data.get('description'),
            'category': data.get('category'),
            'location': data.get('location'),
            'date': data.get('date'),
            'contact': data.get('contact'),
            'image_url': data.get('image_url', ''),
            'status': 'active',
            'created_at': datetime.utcnow()
        }
        
        result = lost_found_collection.insert_one(item)
        item['_id'] = str(result.inserted_id)
        item['user_id'] = str(item['user_id'])
        
        return jsonify(item), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/lost-found/<item_id>', methods=['PUT'])
@token_required
def update_lost_found_item(current_user, item_id):
    try:
        data = request.json
        item = lost_found_collection.find_one({'_id': ObjectId(item_id)})
        
        if not item:
            return jsonify({'message': 'Item not found!'}), 404
        
        if str(item['user_id']) != str(current_user['_id']) and current_user['role'] not in ['admin', 'faculty']:
            return jsonify({'message': 'Access denied!'}), 403
        
        update_data = {
            'status': data.get('status', item['status']),
            'updated_at': datetime.utcnow()
        }
        
        lost_found_collection.update_one({'_id': ObjectId(item_id)}, {'$set': update_data})
        
        return jsonify({'message': 'Item updated successfully!'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Events Routes
@app.route('/api/events', methods=['GET'])
@token_required
def get_events(current_user):
    try:
        events = list(events_collection.find().sort('event_date', 1))
        for event in events:
            event['_id'] = str(event['_id'])
            event['created_by'] = str(event['created_by'])
        return jsonify(events), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/events', methods=['POST'])
@token_required
@role_required('admin', 'faculty')
def create_event(current_user):
    try:
        data = request.json
        event = {
            'created_by': current_user['_id'],
            'creator_name': current_user['name'],
            'title': data.get('title'),
            'description': data.get('description'),
            'event_date': data.get('event_date'),
            'event_time': data.get('event_time'),
            'location': data.get('location'),
            'category': data.get('category'),
            'image_url': data.get('image_url', ''),
            'max_participants': data.get('max_participants', 0),
            'registered_users': [],
            'status': 'upcoming',
            'created_at': datetime.utcnow()
        }
        
        result = events_collection.insert_one(event)
        event['_id'] = str(result.inserted_id)
        event['created_by'] = str(event['created_by'])
        
        return jsonify(event), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/api/events/<event_id>', methods=['PUT'])
@token_required
@role_required('admin', 'faculty')
def update_event(current_user, event_id):
    try:
        data = request.json
        update_data = {}
        # Allowed fields to update
        for k in ['title', 'description', 'date', 'time', 'location', 'organizer', 'category']:
            if k in data:
                update_data[k] = data[k]
        update_data['updated_at'] = datetime.utcnow()

        result = events_collection.update_one({'_id': ObjectId(event_id)}, {'$set': update_data})
        if result.matched_count == 0:
            return jsonify({'message': 'Event not found!'}), 404

        return jsonify({'message': 'Event updated successfully!'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/api/events/<event_id>', methods=['DELETE'])
@token_required
@role_required('admin')
def delete_event(current_user, event_id):
    try:
        result = events_collection.delete_one({'_id': ObjectId(event_id)})
        if result.deleted_count == 0:
            return jsonify({'message': 'Event not found!'}), 404
        return jsonify({'message': 'Event deleted successfully!'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/events/<event_id>/register', methods=['POST'])
@token_required
def register_for_event(current_user, event_id):
    try:
        event = events_collection.find_one({'_id': ObjectId(event_id)})
        
        if not event:
            return jsonify({'message': 'Event not found!'}), 404
        
        user_id = str(current_user['_id'])
        if user_id in event.get('registered_users', []):
            return jsonify({'message': 'Already registered!'}), 400
        
        events_collection.update_one(
            {'_id': ObjectId(event_id)},
            {'$push': {'registered_users': user_id}}
        )
        
        return jsonify({'message': 'Registration successful!'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Feedback Routes
@app.route('/api/feedback', methods=['GET'])
@token_required
@role_required('admin', 'faculty')
def get_feedback(current_user):
    try:
        feedback_list = list(feedback_collection.find().sort('created_at', -1))
        for feedback in feedback_list:
            feedback['_id'] = str(feedback['_id'])
            feedback['user_id'] = str(feedback['user_id'])
        return jsonify(feedback_list), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/feedback', methods=['POST'])
@token_required
def submit_feedback(current_user):
    try:
        data = request.json
        feedback = {
            'user_id': current_user['_id'],
            'user_name': current_user['name'],
            'category': data.get('category'),
            'subject': data.get('subject'),
            'message': data.get('message'),
            'priority': data.get('priority', 'medium'),
            'status': 'pending',
            'response': '',
            'created_at': datetime.utcnow()
        }
        # Persist feedback to the database
        result = feedback_collection.insert_one(feedback)
        feedback['_id'] = str(result.inserted_id)
        feedback['user_id'] = str(feedback['user_id'])
        return jsonify(feedback), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/feedback/mine', methods=['GET'])
@token_required
def get_my_feedback(current_user):
    try:
        my_list = list(feedback_collection.find({'user_id': current_user['_id']}).sort('created_at', -1))
        for f in my_list:
            f['_id'] = str(f['_id'])
            f['user_id'] = str(f['user_id'])
        return jsonify(my_list), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Upload endpoint
@app.route('/api/upload', methods=['POST'])
@token_required
def upload_file(current_user):
    try:
        if 'file' not in request.files:
            return jsonify({'message': 'No file part in the request'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'message': 'No selected file'}), 400
        filename = secure_filename(file.filename)
        ext = os.path.splitext(filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            return jsonify({'message': 'File type not allowed'}), 400
        # unique filename
        unique_name = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}_{ObjectId()}{ext}"
        save_path = os.path.join(UPLOAD_FOLDER, unique_name)
        file.save(save_path)
        url = f"/uploads/{unique_name}"
        return jsonify({'url': url, 'message': 'Uploaded successfully'}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/upload/resource', methods=['POST'])
@token_required
def upload_resource_file(current_user):
    try:
        if 'file' not in request.files:
            return jsonify({'message': 'No file part in the request'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'message': 'No selected file'}), 400
        filename = secure_filename(file.filename)
        ext = os.path.splitext(filename)[1].lower()
        allowed = {'.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.zip', '.rar'} | ALLOWED_EXTENSIONS
        if ext not in allowed:
            return jsonify({'message': 'File type not allowed'}), 400
        unique_name = f"res_{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}_{ObjectId()}{ext}"
        save_path = os.path.join(UPLOAD_FOLDER, unique_name)
        file.save(save_path)
        url = f"/uploads/{unique_name}"
        return jsonify({'url': url, 'message': 'Uploaded successfully'}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Resources API
@app.route('/api/resources', methods=['GET'])
@token_required
def get_resources(current_user):
    try:
        items = list(resources_collection.find().sort('created_at', -1))
        for it in items:
            it['_id'] = str(it['_id'])
            it['user_id'] = str(it['user_id'])
        return jsonify(items), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/resources', methods=['POST'])
@token_required
def create_resource(current_user):
    try:
        data = request.json
        item = {
            'user_id': current_user['_id'],
            'user_name': current_user['name'],
            'title': data.get('title'),
            'description': data.get('description', ''),
            'category': data.get('category', 'general'),
            'file_url': data.get('file_url', ''),
            'link_url': data.get('link_url', ''),
            'created_at': datetime.utcnow()
        }
        if not item['title']:
            return jsonify({'message': 'Title is required'}), 400
        res = resources_collection.insert_one(item)
        item['_id'] = str(res.inserted_id)
        item['user_id'] = str(item['user_id'])
        return jsonify(item), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/resources/<res_id>', methods=['DELETE'])
@token_required
def delete_resource(current_user, res_id):
    try:
        doc = resources_collection.find_one({'_id': ObjectId(res_id)})
        if not doc:
            return jsonify({'message': 'Resource not found'}), 404
        if str(doc['user_id']) != str(current_user['_id']) and current_user['role'] not in ['admin', 'faculty']:
            return jsonify({'message': 'Access denied'}), 403
        resources_collection.delete_one({'_id': ObjectId(res_id)})
        return jsonify({'message': 'Resource deleted'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Polls API
@app.route('/api/polls', methods=['GET'])
@token_required
def get_polls(current_user):
    try:
        items = list(polls_collection.find().sort('created_at', -1))
        for p in items:
            p['_id'] = str(p['_id'])
            p['created_by'] = str(p['created_by'])
        return jsonify(items), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/polls', methods=['POST'])
@token_required
@role_required('admin', 'faculty')
def create_poll(current_user):
    try:
        data = request.json
        question = data.get('question')
        options = data.get('options', [])
        closes_at = data.get('closes_at')
        if not question or not isinstance(options, list) or len(options) < 2:
            return jsonify({'message': 'Question and at least two options are required'}), 400
        poll = {
            'created_by': current_user['_id'],
            'question': question,
            'options': [{'text': o, 'votes': 0} for o in options],
            'voters': [],
            'closes_at': closes_at,
            'created_at': datetime.utcnow()
        }
        res = polls_collection.insert_one(poll)
        poll['_id'] = str(res.inserted_id)
        poll['created_by'] = str(poll['created_by'])
        return jsonify(poll), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/polls/<poll_id>/vote', methods=['POST'])
@token_required
def vote_poll(current_user, poll_id):
    try:
        data = request.json
        index = data.get('option_index')
        poll = polls_collection.find_one({'_id': ObjectId(poll_id)})
        if not poll:
            return jsonify({'message': 'Poll not found'}), 404
        if str(current_user['_id']) in [str(v) for v in poll.get('voters', [])]:
            return jsonify({'message': 'You have already voted'}), 400
        if index is None or index < 0 or index >= len(poll.get('options', [])):
            return jsonify({'message': 'Invalid option'}), 400
        polls_collection.update_one({'_id': ObjectId(poll_id)}, {
            '$inc': {f'options.{index}.votes': 1},
            '$push': {'voters': current_user['_id']}
        })
        updated = polls_collection.find_one({'_id': ObjectId(poll_id)})
        updated['_id'] = str(updated['_id'])
        updated['created_by'] = str(updated['created_by'])
        updated['voters'] = [str(v) for v in updated.get('voters', [])]
        return jsonify(updated), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/polls/<poll_id>', methods=['DELETE'])
@token_required
@role_required('admin')
def delete_poll(current_user, poll_id):
    try:
        result = polls_collection.delete_one({'_id': ObjectId(poll_id)})
        if result.deleted_count == 0:
            return jsonify({'message': 'Poll not found'}), 404
        return jsonify({'message': 'Poll deleted'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/feedback/<feedback_id>', methods=['PUT'])
@token_required
@role_required('admin', 'faculty')
def update_feedback(current_user, feedback_id):
    try:
        data = request.json
        update_data = {
            'status': data.get('status'),
            'response': data.get('response', ''),
            'updated_at': datetime.utcnow()
        }
        
        feedback_collection.update_one(
            {'_id': ObjectId(feedback_id)},
            {'$set': update_data}
        )
        
        return jsonify({'message': 'Feedback updated successfully!'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Clubs Routes
@app.route('/api/clubs', methods=['GET'])
@token_required
def get_clubs(current_user):
    try:
        clubs_list = list(clubs_collection.find().sort('name', 1))
        for club in clubs_list:
            club['_id'] = str(club['_id'])
        return jsonify(clubs_list), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/clubs', methods=['POST'])
@token_required
@role_required('admin', 'faculty')
def create_club(current_user):
    try:
        data = request.json
        club = {
            'name': data.get('name'),
            'description': data.get('description'),
            'category': data.get('category'),
            'president': data.get('president'),
            'contact_email': data.get('contact_email'),
            'image_url': data.get('image_url', ''),
            'members': [],
            'created_at': datetime.utcnow()
        }
        
        result = clubs_collection.insert_one(club)
        club['_id'] = str(result.inserted_id)
        
        return jsonify(club), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/clubs/<club_id>/join', methods=['POST'])
@token_required
def join_club(current_user, club_id):
    try:
        club = clubs_collection.find_one({'_id': ObjectId(club_id)})
        
        if not club:
            return jsonify({'message': 'Club not found!'}), 404
        
        user_id = str(current_user['_id'])
        if user_id in club.get('members', []):
            return jsonify({'message': 'Already a member!'}), 400
        
        clubs_collection.update_one(
            {'_id': ObjectId(club_id)},
            {'$push': {'members': user_id}}
        )
        
        return jsonify({'message': 'Joined club successfully!'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/api/clubs/<club_id>', methods=['PUT'])
@token_required
@role_required('admin', 'faculty')
def update_club(current_user, club_id):
    try:
        data = request.json
        update_data = {}
        for k in ['name', 'description', 'category', 'president', 'contact_email', 'image_url']:
            if k in data:
                update_data[k] = data[k]
        update_data['updated_at'] = datetime.utcnow()

        result = clubs_collection.update_one({'_id': ObjectId(club_id)}, {'$set': update_data})
        if result.matched_count == 0:
            return jsonify({'message': 'Club not found!'}), 404
        return jsonify({'message': 'Club updated successfully!'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/api/clubs/<club_id>', methods=['DELETE'])
@token_required
@role_required('admin')
def delete_club(current_user, club_id):
    try:
        result = clubs_collection.delete_one({'_id': ObjectId(club_id)})
        if result.deleted_count == 0:
            return jsonify({'message': 'Club not found!'}), 404
        return jsonify({'message': 'Club deleted successfully!'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Announcements Routes
@app.route('/api/announcements', methods=['GET'])
@token_required
def get_announcements(current_user):
    try:
        announcements = list(announcements_collection.find().sort('created_at', -1).limit(10))
        for announcement in announcements:
            announcement['_id'] = str(announcement['_id'])
        return jsonify(announcements), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/announcements', methods=['POST'])
@token_required
@role_required('admin', 'faculty')
def create_announcement(current_user):
    try:
        data = request.json
        announcement = {
            'title': data.get('title'),
            'message': data.get('message'),
            'priority': data.get('priority', 'normal'),
            'created_by': current_user['name'],
            'created_at': datetime.utcnow()
        }
        
        result = announcements_collection.insert_one(announcement)
        announcement['_id'] = str(result.inserted_id)
        
        return jsonify(announcement), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/api/announcements/<announcement_id>', methods=['PUT'])
@token_required
@role_required('admin', 'faculty')
def update_announcement(current_user, announcement_id):
    try:
        data = request.json
        update_data = {}
        for k in ['title', 'message', 'category', 'priority']:
            if k in data:
                update_data[k] = data[k]
        update_data['updated_at'] = datetime.utcnow()

        result = announcements_collection.update_one({'_id': ObjectId(announcement_id)}, {'$set': update_data})
        if result.matched_count == 0:
            return jsonify({'message': 'Announcement not found!'}), 404
        return jsonify({'message': 'Announcement updated successfully!'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/api/announcements/<announcement_id>', methods=['DELETE'])
@token_required
@role_required('admin')
def delete_announcement(current_user, announcement_id):
    try:
        result = announcements_collection.delete_one({'_id': ObjectId(announcement_id)})
        if result.deleted_count == 0:
            return jsonify({'message': 'Announcement not found!'}), 404
        return jsonify({'message': 'Announcement deleted successfully!'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

if __name__ == '__main__':
    PORT = 3000
    print('\n' + '='*50)
    print('🚀 Smart Campus Flask Server with MongoDB')
    print('='*50)
    print(f'📱 Visit: http://localhost:{PORT}')
    print('💾 Database: MongoDB (smart_campus)')
    print('✅ All features functional with database!')
    print('='*50 + '\n')
    app.run(debug=False, host='0.0.0.0', port=PORT, threaded=True)

