# 🚀 Quick Start Guide - Smart Campus Ecosystem (Node.js)

## ✅ Setup Complete!

Your Smart Campus Ecosystem is now running with:
- ✅ Node.js + Express backend
- ✅ Socket.IO for real-time updates
- ✅ MongoDB connection
- ✅ JWT authentication
- ✅ Gemini Pro AI chatbot ready
- ✅ All 7 feature modules

## 🌐 Access Your Application

**Website URL**: http://localhost:5000

The website should have opened automatically in your default browser!

## 📋 Test Accounts

Create accounts by registering on the website, or use these test credentials:

### Admin Account
- **Email**: admin@klh.edu
- **Password**: admin123
- **Role**: Admin (set manually in database)

### Student Account
- **Email**: student@klh.edu
- **Password**: student123
- **Role**: Student (default)

## 🎯 Key Features to Test

### 1. Lost & Found
- Report a lost item
- Browse lost items
- Update item status (Found/Claimed)
- **Real-time**: New items appear instantly for all users

### 2. Events
- Browse upcoming events
- Register for events
- Create events (Faculty/Admin only)
- **Real-time**: Event notifications broadcast to all users

### 3. Feedback & Grievance
- Submit feedback
- Track feedback status
- Respond to feedback (Admin/Faculty)
- **Real-time**: Status updates appear instantly

### 4. Clubs
- Explore campus clubs
- Join clubs
- Create clubs (Faculty/Admin)
- **Real-time**: Member count updates live

### 5. Announcements
- View campus announcements
- Create announcements (Admin/Faculty)
- **Real-time**: Instant broadcast to all online users

### 6. AI Chatbot
- Click the chat icon in bottom-right corner
- Ask about campus services
- Get help with Lost & Found, Events, Feedback, Clubs

## 🔌 Real-Time Features

Open the website in **multiple browser windows** to see real-time updates:

1. **Window 1**: Create a new event
2. **Window 2**: See the notification appear instantly!
3. **Window 1**: Post an announcement
4. **Window 2**: Receive real-time notification

## 🛠️ Server Management

### Start Server
```bash
npm run dev
```
or
```bash
run-node.bat
```

### Stop Server
Press `Ctrl + C` in the terminal

### Restart Server
Type `rs` in the nodemon terminal (or restart manually)

### Check Server Status
Look for these messages in terminal:
```
🚀 Smart Campus Server running on port 5000
✓ Connected to MongoDB
🔌 Socket.IO enabled for real-time updates
```

## 📁 Project Structure

```
vibe-ai-thon/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables
│
├── models/                # MongoDB schemas
│   ├── User.js
│   ├── Event.js
│   ├── LostFound.js
│   ├── Feedback.js
│   ├── Club.js
│   └── Announcement.js
│
├── routes/                # API endpoints
│   ├── auth.js           # Login/Register
│   ├── events.js         # Events management
│   ├── lostFound.js      # Lost & Found
│   ├── feedback.js       # Feedback system
│   ├── clubs.js          # Clubs management
│   ├── announcements.js  # Announcements
│   └── chatbot.js        # Gemini AI chatbot
│
├── middleware/            # Authentication
│   └── auth.js           # JWT verification
│
└── public/                # Frontend files
    ├── index.html
    ├── dashboard.html
    ├── css/
    └── js/
        ├── socket.js      # Socket.IO client
        └── [other JS files]
```

## 🔐 API Testing with Postman/Thunder Client

### 1. Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@klh.edu",
  "password": "test123",
  "role": "student"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@klh.edu",
  "password": "test123"
}
```

**Response**: Copy the `token` from response

### 3. Use Protected Endpoints
Add header to all requests:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### 4. Get Events
```
GET http://localhost:5000/api/events
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### 5. Create Event (Faculty/Admin only)
```
POST http://localhost:5000/api/events
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "title": "Tech Workshop",
  "description": "Learn web development",
  "event_date": "2025-02-15T10:00:00Z",
  "location": "Auditorium"
}
```

## 🤖 Gemini AI Setup (Optional)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in and create API key
3. Open `.env` file
4. Add your key: `GEMINI_API_KEY=your_key_here`
5. Restart server

**Without API key**: Chatbot will use fallback responses

## 🌍 MongoDB Atlas Setup (For Production)

### 1. Create Free Cluster
- Visit: https://www.mongodb.com/cloud/atlas
- Sign up for free account
- Create M0 Free Tier cluster

### 2. Get Connection String
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy connection string

### 3. Update .env
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart_campus
```

### 4. Whitelist IP
- Go to "Network Access"
- Add IP: `0.0.0.0/0` (all IPs - for testing)
- Or add your specific IP

## 🚀 Deploy to Render (Free Hosting)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Smart Campus Ecosystem"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### 2. Create Render Account
- Visit: https://render.com
- Sign up with GitHub

### 3. Create Web Service
- Click "New +" → "Web Service"
- Connect your repository
- Settings:
  - **Name**: smart-campus-klh
  - **Environment**: Node
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`

### 4. Add Environment Variables
```
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=https://your-app.onrender.com
```

### 5. Deploy
Click "Create Web Service" - Takes ~2-5 minutes

Your app will be live at: `https://smart-campus-klh.onrender.com`

## 🐛 Troubleshooting

### Port 5000 Already in Use
```bash
# Find process
netstat -ano | findstr :5000

# Kill process
taskkill /PID <process_id> /F
```

### MongoDB Connection Error
- Check if MongoDB is running locally
- Or use MongoDB Atlas connection string
- Verify credentials in `.env`

### Socket.IO Not Working
- Check browser console for errors
- Verify Socket.IO script is loaded
- Check CORS settings in `server.js`

### JWT Token Expired
- Token expires after 24 hours
- Login again to get new token

### Chatbot Not Responding
- Check if GEMINI_API_KEY is set in `.env`
- Verify API key is valid
- Check for rate limits

## 📊 Browser DevTools

Open browser console (F12) to see:
- Socket.IO connection status
- Real-time event messages
- API requests and responses
- Any JavaScript errors

## 🎨 Customization

### Change Port
Edit `.env`:
```env
PORT=3000
```

### Add New Routes
1. Create route file in `routes/`
2. Import in `server.js`
3. Mount route: `app.use('/api/your-route', yourRoute)`

### Modify UI
- HTML files in `public/`
- CSS in `public/css/`
- JavaScript in `public/js/`

## 📚 Documentation

- **Full README**: `README-NODEJS.md`
- **API Endpoints**: Check route files in `routes/`
- **Database Models**: Check `models/` folder
- **Socket.IO Events**: See `public/js/socket.js`

## ✨ What Makes This Special

### 🔌 Real-Time Updates
- Socket.IO enables instant notifications
- No page refresh needed
- Live data synchronization

### 🤖 AI-Powered
- Gemini Pro chatbot integration
- Context-aware responses
- 24/7 assistance

### 🔐 Secure
- JWT authentication
- Password hashing (bcrypt)
- Role-based authorization

### 🎨 Beautiful UI
- Gradient designs
- Smooth animations
- Responsive layout

### 📱 Modern Stack
- Node.js + Express
- MongoDB Atlas
- Socket.IO
- Latest libraries

## 🎯 Next Steps

1. **Test All Features**: Try Lost & Found, Events, Feedback, Clubs
2. **Multiple Windows**: Open 2+ browser windows to see real-time updates
3. **Add Gemini API**: Enable AI chatbot (optional)
4. **Deploy Online**: Use Render for free hosting
5. **Customize**: Add your university logo, colors, features

## 💡 Tips

- Keep the server terminal open to see logs
- Use browser DevTools to debug
- Check Socket.IO connection in console
- Test with multiple users/windows
- MongoDB compass for database viewing

## 🎉 Success!

Your Smart Campus Ecosystem is ready! Open http://localhost:5000 and start exploring.

**Need Help?**
- Check the logs in terminal
- Review `README-NODEJS.md`
- Check browser console (F12)
- Review code comments

---

**Built with ❤️ for KLH University using Node.js, Express, MongoDB, Socket.IO, and Gemini AI**
