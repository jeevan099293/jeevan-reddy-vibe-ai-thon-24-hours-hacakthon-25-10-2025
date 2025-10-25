# Smart Campus - Quick Reference Card

## 🚀 Quick Start (3 Steps)

1. **Setup Environment**
   ```bash
   setup.bat  # Windows
   # Or: python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt
   ```

2. **Configure .env**
   ```
   SECRET_KEY=your-secret-key
   MONGO_URI=mongodb://localhost:27017/
   GEMINI_API_KEY=your-api-key (optional)
   ```

3. **Run Application**
   ```bash
   python init_data.py  # Add sample data (optional)
   python app.py        # Start server
   ```
   Visit: http://localhost:5000

## 📁 Project Structure
```
vibe-ai-thon/
├── app.py              # Main Flask app
├── chatbot.py          # Gemini AI chatbot
├── init_data.py        # Sample data script
├── templates/          # HTML pages (8 files)
├── static/
│   ├── css/style.css   # All styling
│   └── js/             # 8 JavaScript files
├── requirements.txt    # Dependencies
├── .env               # Configuration (create this)
└── *.md               # Documentation
```

## 🔑 Test Accounts (after init_data.py)
```
Admin:   admin@klh.edu    / admin123
Faculty: faculty@klh.edu  / faculty123
Student: student@klh.edu  / student123
```

## 🎯 Core Features
| Feature | Route | Access |
|---------|-------|--------|
| Dashboard | `/dashboard` | All Users |
| Lost & Found | `/lost-found` | All Users |
| Events | `/events` | All Users |
| Feedback | `/feedback` | All Users |
| Clubs | `/clubs` | All Users |
| Create Event | `POST /api/events` | Faculty/Admin |
| Create Club | `POST /api/clubs` | Faculty/Admin |

## 📡 API Endpoints

### Authentication
```
POST /api/register    - Register new user
POST /api/login       - Login user
GET  /api/user/profile - Get profile
```

### Lost & Found
```
GET  /api/lost-found     - List all items
POST /api/lost-found     - Report item
PUT  /api/lost-found/:id - Update item
```

### Events
```
GET  /api/events           - List events
POST /api/events           - Create event (Faculty/Admin)
POST /api/events/:id/register - Register for event
```

### Feedback
```
GET  /api/feedback    - View feedback (Admin/Faculty)
POST /api/feedback    - Submit feedback
PUT  /api/feedback/:id - Update (Admin/Faculty)
```

### Clubs
```
GET  /api/clubs       - List clubs
POST /api/clubs       - Create club (Faculty/Admin)
POST /api/clubs/:id/join - Join club
```

### Chatbot
```
POST /api/chatbot     - Chat with AI assistant
```

## 🛠️ Common Commands

### Setup
```bash
python -m venv venv              # Create virtual env
venv\Scripts\activate            # Activate (Windows)
pip install -r requirements.txt  # Install deps
```

### Database
```bash
python init_data.py    # Add sample data
# MongoDB runs on: mongodb://localhost:27017/
```

### Run
```bash
python app.py         # Development server
# Production: gunicorn app:app
```

### Git
```bash
git add .
git commit -m "message"
git push origin main
```

## 🚀 Deployment (Render)

1. **Prepare MongoDB Atlas**
   - Create free cluster
   - Get connection string

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Deploy on Render**
   - Connect GitHub repo
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn app:app`
   - Add env variables:
     - SECRET_KEY
     - MONGO_URI
     - GEMINI_API_KEY

## 🎨 UI Components

### Color Variables
```css
--primary-color: #6366f1    /* Indigo */
--secondary-color: #10b981  /* Emerald */
--danger-color: #ef4444     /* Red */
--dark-bg: #0f172a          /* Dark Blue */
```

### Key Classes
```css
.btn-primary     /* Primary button */
.card            /* Card component */
.modal           /* Modal dialog */
.badge           /* Status badge */
.filter-btn      /* Filter button */
```

## 🔐 Security Notes

- Passwords hashed with bcrypt
- JWT tokens for auth (24h expiry)
- Role-based access control
- .env for sensitive data
- CORS enabled

## 📱 Features by Role

### Student
- ✅ View & register for events
- ✅ Report lost/found items
- ✅ Submit feedback
- ✅ Join clubs
- ✅ Use chatbot

### Faculty
- ✅ All student features
- ✅ Create events
- ✅ Create clubs
- ✅ View all feedback
- ✅ Post announcements

### Admin
- ✅ All faculty features
- ✅ Manage users
- ✅ Respond to feedback
- ✅ Full platform control

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
# Windows: Check Services for "MongoDB"
# Or use MongoDB Atlas (cloud)
```

### Port Already in Use
```bash
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Module Not Found
```bash
# Ensure venv is activated
venv\Scripts\activate
pip install -r requirements.txt
```

### Chatbot Not Working
- Gemini API key not required
- Works with fallback responses
- Check GEMINI_API_KEY in .env

## 📞 Links

- **Local:** http://localhost:5000
- **MongoDB:** http://localhost:27017
- **Atlas:** https://cloud.mongodb.com
- **Render:** https://render.com
- **Gemini:** https://makersuite.google.com

## 📝 Files to Edit

1. **`.env`** - Configuration
2. **`app.py`** - Backend logic
3. **`templates/*.html`** - Pages
4. **`static/css/style.css`** - Styling
5. **`static/js/*.js`** - Frontend logic

## ✅ Pre-Deployment Checklist

- [ ] MongoDB Atlas configured
- [ ] .env variables set
- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Environment variables added to Render
- [ ] Application deployed successfully
- [ ] Test all features on production
- [ ] Sample data added
- [ ] Documentation reviewed

## 🎯 Key Technologies

- **Backend:** Flask 3.0 (Python)
- **Database:** MongoDB
- **Auth:** JWT + bcrypt
- **Frontend:** HTML5, CSS3, JavaScript
- **AI:** Google Gemini API
- **Hosting:** Render (free)

---

**Quick Help:**
- Full docs: README.md
- Setup guide: SETUP_GUIDE.md
- Deploy guide: DEPLOYMENT.md
- Summary: PROJECT_SUMMARY.md

**Made for KLH University Vibe-AI-Thon** 🎓
