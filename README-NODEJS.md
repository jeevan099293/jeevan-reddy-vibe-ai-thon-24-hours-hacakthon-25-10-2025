# Smart Campus Ecosystem - Node.js Version

A unified digital platform for KLH University campus life activities built with **Node.js, Express, MongoDB Atlas, Socket.IO, and Gemini Pro AI**.

## 🚀 Features

### Core Modules
- **Lost & Found System** - Report and track lost items with real-time updates
- **Event Management** - Create, browse, and register for campus events
- **Feedback & Grievance System** - Submit and track feedback with real-time status updates
- **Club Management** - Explore and join campus clubs
- **Announcements** - Campus-wide announcements with instant notifications
- **AI Chatbot** - Powered by Gemini Pro API for 24/7 assistance

### Real-Time Features
- Live event notifications
- Instant announcement broadcasts
- Real-time lost & found updates
- Live feedback status changes
- Dynamic member count updates

### Technology Stack
- **Backend**: Node.js (>=18.0.0), Express 4.18.2
- **Database**: MongoDB Atlas (Cloud)
- **Real-time**: Socket.IO 4.6.0
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **AI Integration**: Google Gemini Pro API
- **Hosting**: Render (Free Tier)

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB Atlas account (free tier available)
- Gemini API key (free from Google AI Studio)

## 🛠️ Installation

### 1. Clone or Download the Project

```bash
cd vibe-ai-thon
```

### 2. Run Setup Script (Windows)

```bash
setup-node.bat
```

Or manually:

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Update `.env` with your credentials:

```env
NODE_ENV=development
PORT=5000

# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart_campus

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL
FRONTEND_URL=http://localhost:5000
```

### 4. Start the Server

```bash
run-node.bat
```

Or manually:

```bash
npm run dev
```

The application will be available at: **http://localhost:5000**

## 📁 Project Structure

```
vibe-ai-thon/
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Event.js
│   ├── LostFound.js
│   ├── Feedback.js
│   ├── Club.js
│   └── Announcement.js
├── routes/              # Express routes
│   ├── auth.js
│   ├── events.js
│   ├── lostFound.js
│   ├── feedback.js
│   ├── clubs.js
│   ├── announcements.js
│   └── chatbot.js
├── middleware/          # Custom middleware
│   └── auth.js         # JWT authentication
├── public/              # Static files
│   ├── css/
│   ├── js/
│   └── index.html
├── server.js            # Express server with Socket.IO
├── package.json         # Dependencies
├── .env.example         # Environment template
└── README-NODEJS.md     # This file
```

## 🔐 Authentication

The system uses **JWT (JSON Web Tokens)** for authentication:

1. Users register with email and password
2. Password is hashed using bcryptjs (salt rounds: 10)
3. On login, server returns a JWT token (expires in 24 hours)
4. Token must be included in `Authorization` header: `Bearer <token>`

### User Roles
- **Student** - Default role, access to all features
- **Faculty** - Can create events, clubs, and manage feedback
- **Admin** - Full access including user management

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get user profile (protected)

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Faculty/Admin only)
- `POST /api/events/:id/register` - Register for event

### Lost & Found
- `GET /api/lost-found` - Get all items
- `POST /api/lost-found` - Report lost item
- `PUT /api/lost-found/:id` - Update item status

### Feedback
- `GET /api/feedback` - Get feedback (Admin/Faculty only)
- `POST /api/feedback` - Submit feedback
- `PUT /api/feedback/:id` - Update feedback (Admin/Faculty only)

### Clubs
- `GET /api/clubs` - Get all clubs
- `POST /api/clubs` - Create club (Faculty/Admin only)
- `POST /api/clubs/:id/join` - Join club

### Announcements
- `GET /api/announcements` - Get announcements
- `POST /api/announcements` - Create announcement (Admin/Faculty only)

### Chatbot
- `POST /api/chatbot/chat` - Chat with AI assistant

## ⚡ Real-Time Events (Socket.IO)

### Client-side Events to Listen
- `new-event` - New event created
- `new-announcement` - New announcement posted
- `lost-found-update` - Lost & found item added/updated
- `feedback-update` - Feedback status changed
- `new-feedback` - New feedback submitted (Admin/Faculty only)
- `event-registration` - Someone registered for event
- `club-join` - Someone joined a club
- `new-club` - New club created

### Socket.IO Client Integration

Include in your HTML:
```html
<script src="/socket.io/socket.io.js"></script>
<script src="/js/socket.js"></script>
```

## 🔧 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free Tier)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string and add it to `.env`

## 🤖 Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create an API key
4. Add it to `.env` as `GEMINI_API_KEY`

## 🚀 Deployment on Render

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: smart-campus-ecosystem
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   - `NODE_ENV=production`
   - `MONGO_URI=<your-mongodb-atlas-uri>`
   - `JWT_SECRET=<your-jwt-secret>`
   - `GEMINI_API_KEY=<your-gemini-api-key>`
   - `FRONTEND_URL=<your-render-url>`

6. Click "Create Web Service"

Your app will be live at: `https://your-app-name.onrender.com`

## 📊 Testing

### Create Test Account

**Admin Account**:
```json
{
  "name": "Admin User",
  "email": "admin@klh.edu",
  "password": "admin123",
  "role": "admin"
}
```

**Student Account**:
```json
{
  "name": "Student User",
  "email": "student@klh.edu",
  "password": "student123",
  "role": "student"
}
```

### Test API with Postman/Thunder Client

1. Register: `POST http://localhost:5000/api/auth/register`
2. Login: `POST http://localhost:5000/api/auth/login`
3. Copy JWT token from response
4. Add to headers: `Authorization: Bearer <token>`
5. Test other endpoints

## 🐛 Troubleshooting

### Port already in use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <process-id> /F
```

### MongoDB Connection Error
- Check if MONGO_URI is correct in `.env`
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Socket.IO Not Connecting
- Check if Socket.IO client library is loaded
- Verify CORS configuration in `server.js`
- Check browser console for connection errors

## 📝 Development Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests (to be implemented)
```

## 🤝 Contributing

This project was developed for the Vibe-AI-Thon hackathon at KLH University.

## 📄 License

This project is open source and available for educational purposes.

## 👥 Support

For issues or questions:
- Check the documentation
- Review the code comments
- Test with the provided examples

---

**Built with ❤️ for KLH University**
