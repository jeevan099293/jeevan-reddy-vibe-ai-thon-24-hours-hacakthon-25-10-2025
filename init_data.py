# Sample data initialization script for Smart Campus
# Run this after setting up MongoDB to add some sample data

from pymongo import MongoClient
from datetime import datetime, timedelta
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI)
db = client['smart_campus']

def create_sample_users():
    """Create sample users with different roles"""
    users_collection = db['users']
    
    # Check if users already exist
    if users_collection.count_documents({}) > 0:
        print("Users already exist. Skipping user creation.")
        return
    
    sample_users = [
        {
            'name': 'Admin User',
            'email': 'admin@klh.edu.in',
            'password': bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()),
            'role': 'admin',
            'student_id': 'ADMIN001',
            'created_at': datetime.utcnow()
        },
        {
            'name': 'Faculty Member',
            'email': 'faculty@klh.edu.in',
            'password': bcrypt.hashpw('faculty123'.encode('utf-8'), bcrypt.gensalt()),
            'role': 'faculty',
            'student_id': 'FAC001',
            'created_at': datetime.utcnow()
        },
        {
            'name': 'John Doe',
            'email': 'student@klh.edu.in',
            'password': bcrypt.hashpw('student123'.encode('utf-8'), bcrypt.gensalt()),
            'role': 'student',
            'student_id': 'KLH2025001',
            'created_at': datetime.utcnow()
        }
    ]
    
    result = users_collection.insert_many(sample_users)
    print(f"✓ Created {len(result.inserted_ids)} sample users")
    return result.inserted_ids

def create_sample_events():
    """Create sample events"""
    events_collection = db['events']
    users_collection = db['users']
    
    # Get admin user for creator
    admin = users_collection.find_one({'role': 'admin'})
    if not admin:
        print("✗ No admin user found. Please create users first.")
        return
    
    sample_events = [
        {
            'created_by': admin['_id'],
            'creator_name': admin['name'],
            'title': 'Tech Fest 2025',
            'description': 'Annual technical festival featuring workshops, competitions, and tech talks',
            'event_date': (datetime.utcnow() + timedelta(days=7)).strftime('%Y-%m-%d'),
            'event_time': '09:00',
            'location': 'Main Auditorium',
            'category': 'technical',
            'image_url': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
            'max_participants': 200,
            'registered_users': [],
            'status': 'upcoming',
            'created_at': datetime.utcnow()
        },
        {
            'created_by': admin['_id'],
            'creator_name': admin['name'],
            'title': 'Cultural Night',
            'description': 'Celebrate diversity with music, dance, and food from around the world',
            'event_date': (datetime.utcnow() + timedelta(days=14)).strftime('%Y-%m-%d'),
            'event_time': '18:00',
            'location': 'Open Air Theatre',
            'category': 'cultural',
            'image_url': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
            'max_participants': 500,
            'registered_users': [],
            'status': 'upcoming',
            'created_at': datetime.utcnow()
        },
        {
            'created_by': admin['_id'],
            'creator_name': admin['name'],
            'title': 'AI/ML Workshop',
            'description': 'Hands-on workshop on Machine Learning and Artificial Intelligence',
            'event_date': (datetime.utcnow() + timedelta(days=3)).strftime('%Y-%m-%d'),
            'event_time': '14:00',
            'location': 'Computer Lab A',
            'category': 'workshop',
            'image_url': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
            'max_participants': 50,
            'registered_users': [],
            'status': 'upcoming',
            'created_at': datetime.utcnow()
        }
    ]
    
    result = events_collection.insert_many(sample_events)
    print(f"✓ Created {len(result.inserted_ids)} sample events")

def create_sample_clubs():
    """Create sample clubs"""
    clubs_collection = db['clubs']
    
    sample_clubs = [
        {
            'name': 'Coding Club',
            'description': 'Learn programming, participate in hackathons, and build amazing projects',
            'category': 'technical',
            'president': 'Sarah Johnson',
            'contact_email': 'codingclub@klh.edu',
            'image_url': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
            'members': [],
            'created_at': datetime.utcnow()
        },
        {
            'name': 'Photography Club',
            'description': 'Capture moments, learn photography techniques, and showcase your work',
            'category': 'cultural',
            'president': 'Michael Chen',
            'contact_email': 'photoclub@klh.edu',
            'image_url': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d',
            'members': [],
            'created_at': datetime.utcnow()
        },
        {
            'name': 'Debate Society',
            'description': 'Develop public speaking skills and engage in intellectual discussions',
            'category': 'academic',
            'president': 'Emma Wilson',
            'contact_email': 'debate@klh.edu',
            'image_url': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2',
            'members': [],
            'created_at': datetime.utcnow()
        },
        {
            'name': 'Sports Club',
            'description': 'Stay fit, play various sports, and participate in inter-college tournaments',
            'category': 'sports',
            'president': 'David Brown',
            'contact_email': 'sports@klh.edu',
            'image_url': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
            'members': [],
            'created_at': datetime.utcnow()
        }
    ]
    
    result = clubs_collection.insert_many(sample_clubs)
    print(f"✓ Created {len(result.inserted_ids)} sample clubs")

def create_sample_announcements():
    """Create sample announcements"""
    announcements_collection = db['announcements']
    
    sample_announcements = [
        {
            'title': 'Welcome to Smart Campus!',
            'message': 'We are excited to launch the new Smart Campus platform. Explore all the features and stay connected.',
            'priority': 'high',
            'created_by': 'Admin',
            'created_at': datetime.utcnow()
        },
        {
            'title': 'Library Hours Extended',
            'message': 'The library will now be open until 11 PM on weekdays to support your studies.',
            'priority': 'normal',
            'created_by': 'Admin',
            'created_at': datetime.utcnow() - timedelta(days=1)
        },
        {
            'title': 'Campus Maintenance Notice',
            'message': 'Scheduled maintenance in Building A this weekend. Please plan accordingly.',
            'priority': 'normal',
            'created_by': 'Admin',
            'created_at': datetime.utcnow() - timedelta(days=2)
        }
    ]
    
    result = announcements_collection.insert_many(sample_announcements)
    print(f"✓ Created {len(result.inserted_ids)} sample announcements")

def create_sample_lost_found():
    """Create sample lost and found items"""
    lost_found_collection = db['lost_found']
    users_collection = db['users']
    
    student = users_collection.find_one({'role': 'student'})
    if not student:
        print("✗ No student user found. Please create users first.")
        return
    
    sample_items = [
        {
            'user_id': student['_id'],
            'user_name': student['name'],
            'type': 'lost',
            'item_name': 'Blue Water Bottle',
            'description': 'Blue insulated water bottle with a KLH sticker',
            'category': 'other',
            'location': 'Library Ground Floor',
            'date': (datetime.utcnow() - timedelta(days=2)).strftime('%Y-%m-%d'),
            'contact': 'student@klh.edu.in',
            'image_url': '',
            'status': 'active',
            'created_at': datetime.utcnow()
        },
        {
            'user_id': student['_id'],
            'user_name': student['name'],
            'type': 'found',
            'item_name': 'Black Wallet',
            'description': 'Black leather wallet found near canteen, contains ID cards',
            'category': 'accessories',
            'location': 'Near Canteen',
            'date': (datetime.utcnow() - timedelta(days=1)).strftime('%Y-%m-%d'),
            'contact': 'student@klh.edu.in',
            'image_url': '',
            'status': 'active',
            'created_at': datetime.utcnow()
        },
        {
            'user_id': student['_id'],
            'user_name': student['name'],
            'type': 'lost',
            'item_name': 'Textbook - Data Structures',
            'description': 'Data Structures textbook with notes inside',
            'category': 'books',
            'location': 'Computer Lab B',
            'date': datetime.utcnow().strftime('%Y-%m-%d'),
            'contact': 'student@klh.edu',
            'image_url': '',
            'status': 'active',
            'created_at': datetime.utcnow()
        }
    ]
    
    result = lost_found_collection.insert_many(sample_items)
    print(f"✓ Created {len(result.inserted_ids)} sample lost & found items")

def main():
    """Main function to initialize sample data"""
    print("\n🚀 Initializing Smart Campus Sample Data...\n")
    
    try:
        # Test MongoDB connection
        client.server_info()
        print("✓ Connected to MongoDB\n")
        
        # Create sample data
        create_sample_users()
        create_sample_events()
        create_sample_clubs()
        create_sample_announcements()
        create_sample_lost_found()
        
        print("\n✅ Sample data initialization complete!")
        print("\n📝 Test Credentials (use only for local dev; change passwords in production):")
        print("   Admin:   admin@klh.edu.in / admin123")
        print("   Faculty: faculty@klh.edu.in / faculty123")
        print("   Student: student@klh.edu.in / student123")
        print("\n🌐 Start the app with: python app.py")
        print("   Then visit: http://localhost:3000\n")
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        print("Make sure MongoDB is running and MONGO_URI in .env is correct")

if __name__ == '__main__':
    main()
