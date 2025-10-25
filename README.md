# Smart Campus Ecosystem - KLH University

A comprehensive digital platform for campus life management at KLH University. This platform centralizes essential campus activities including Lost & Found services, Event Management, Feedback & Grievance systems, and Club Activities.

## 🌟 Features

### Core Modules
- **🔐 Role-Based Authentication**: Separate access for Students, Faculty, and Admins
- **📍 Lost & Found Management**: Report and search for lost items across campus
- **📅 Event Management**: Create, browse, and register for campus events
- **💬 Feedback & Grievance System**: Submit and track feedback with priority levels
- **👥 Club Dashboard**: Explore and join student organizations
- **📢 Announcements**: Real-time campus-wide announcements
- **🤖 AI Campus Assistant**: Domain-specific chatbot powered by Google Gemini API

### Technical Features
- Real-time updates and notifications
- Responsive and beautiful UI/UX design
- RESTful API architecture
- JWT-based secure authentication
- MongoDB for flexible data storage

## 🛠️ Technology Stack

### Backend
- **Flask** - Python web framework
- **MongoDB** - NoSQL database
- **PyJWT** - JWT authentication
- **bcrypt** - Password hashing
- **Google Generative AI** - Gemini API for chatbot

### Frontend
- **HTML5/CSS3** - Modern, responsive design
- **JavaScript** - Interactive user experience
- **Font Awesome** - Icon library

## 📦 Installation

### Prerequisites
- Python 3.8+
- MongoDB (local or Atlas)
- Git

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd vibe-ai-thon
```

2. **Create virtual environment**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
Create a `.env` file in the root directory:
```env
SECRET_KEY=your-super-secret-key-here
MONGO_URI=mongodb://localhost:27017/
GEMINI_API_KEY=your-gemini-api-key-here
```

5. **Run the application**
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 🔑 Getting API Keys

### Gemini API Key (for Chatbot)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env` file

### MongoDB Atlas (Optional - for cloud database)
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Replace `MONGO_URI` in `.env` with your connection string

## 📁 Project Structure

```
vibe-ai-thon/
├── app.py                 # Main Flask application
├── chatbot.py            # Gemini AI chatbot integration
├── requirements.txt      # Python dependencies
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore file
├── templates/           # HTML templates
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── lost_found.html
│   ├── events.html
│   ├── feedback.html
│   └── clubs.html
├── static/              # Static files
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       ├── auth.js
│       ├── dashboard.js
│       ├── lost_found.js
│       ├── events.js
│       ├── feedback.js
│       ├── clubs.js
│       └── chatbot.js
└── README.md
```

## 🚀 Deployment

### Deploy to Render

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a new Web Service**
   - Connect your GitHub repository
   - Select "Python" as environment
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`

3. **Add environment variables** in Render dashboard:
   - `SECRET_KEY`
   - `MONGO_URI`
   - `GEMINI_API_KEY`

4. **Deploy** - Render will automatically deploy your application

### Alternative: Deploy to Heroku

1. Install Heroku CLI
2. Create `Procfile`:
```
web: gunicorn app:app
```

3. Deploy:
```bash
heroku login
heroku create smart-campus-klh
git push heroku main
heroku config:set SECRET_KEY=your-secret-key
heroku config:set MONGO_URI=your-mongo-uri
heroku config:set GEMINI_API_KEY=your-gemini-key
```

## 👥 User Roles

### Student
- View and register for events
- Report lost/found items
- Submit feedback
- Join clubs
- Use AI chatbot

### Faculty
- All student permissions
- Create and manage events
- View all feedback
- Create clubs
- Post announcements

### Admin
- All faculty permissions
- Manage users
- Full platform administration
- Respond to feedback

## 🎯 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/user/profile` - Get user profile

### Lost & Found
- `GET /api/lost-found` - Get all items
- `POST /api/lost-found` - Report item
- `PUT /api/lost-found/<id>` - Update item

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Faculty/Admin)
- `POST /api/events/<id>/register` - Register for event

### Feedback
- `GET /api/feedback` - Get feedback (Admin/Faculty)
- `POST /api/feedback` - Submit feedback
- `PUT /api/feedback/<id>` - Update feedback (Admin/Faculty)

### Clubs
- `GET /api/clubs` - Get all clubs
- `POST /api/clubs` - Create club (Faculty/Admin)
- `POST /api/clubs/<id>/join` - Join club

### Announcements
- `GET /api/announcements` - Get announcements
- `POST /api/announcements` - Create announcement (Faculty/Admin)

### Chatbot
- `POST /api/chatbot` - Send message to AI assistant

## 🎨 Features Showcase

### Beautiful UI
- Modern gradient designs
- Smooth animations
- Responsive layout
- Card-based design system
- Interactive elements

### Real-time Updates
- Instant notifications
- Live event updates
- Dynamic content loading

### Smart Search
- Filter by categories
- Search functionality
- Sort options

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📝 License

This project is created for KLH University Vibe-AI-Thon hackathon.

## 👨‍💻 Team

Created with ❤️ for KLH University Smart Campus Initiative

## 📞 Support

For any queries or issues:
- Email: info@smartcampus.klh.edu
- Submit feedback through the platform

## 🔒 Security

- All passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Role-based access control
- Input validation and sanitization

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📱 Mobile Responsive

The platform is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

---

**Made with 💙 for KLH University**
