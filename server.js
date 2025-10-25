const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const lostFoundRoutes = require('./routes/lostFound');
const eventsRoutes = require('./routes/events');
const feedbackRoutes = require('./routes/feedback');
const clubsRoutes = require('./routes/clubs');
const announcementsRoutes = require('./routes/announcements');
const chatbotRoutes = require('./routes/chatbot');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection (Optional - comment out if not installed)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_campus';
if (process.env.SKIP_MONGODB !== 'true') {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('✓ Connected to MongoDB'))
        .catch((err) => {
            console.error('✗ MongoDB connection error:', err);
            console.log('⚠️  Server will continue without database. Set SKIP_MONGODB=true to hide this warning.');
        });
} else {
    console.log('⚠️  Running without MongoDB (SKIP_MONGODB=true)');
}

// Socket.IO Connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io accessible to routes
app.set('io', io);

// Template engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes - Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/lost-found', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lost_found.html'));
});

app.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'events.html'));
});

app.get('/feedback', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'feedback.html'));
});

app.get('/clubs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'clubs.html'));
});

// API Routes (only if MongoDB is available)
if (process.env.SKIP_MONGODB !== 'true') {
    app.use('/api/auth', authRoutes);
    app.use('/api/lost-found', lostFoundRoutes);
    app.use('/api/events', eventsRoutes);
    app.use('/api/feedback', feedbackRoutes);
    app.use('/api/clubs', clubsRoutes);
    app.use('/api/announcements', announcementsRoutes);
    app.use('/api/chatbot', chatbotRoutes);
} else {
    // Dummy API responses when no database
    app.all('/api/*', (req, res) => {
        res.status(503).json({ 
            message: 'Database not connected. API endpoints are disabled.',
            note: 'UI is fully functional. Set up MongoDB Atlas to enable backend features.'
        });
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`\n🚀 Smart Campus Server running on port ${PORT}`);
    console.log(`📱 Visit: http://localhost:${PORT}`);
    console.log(`🔌 Socket.IO enabled for real-time updates`);
});

// Export io for use in routes
module.exports = { io };
