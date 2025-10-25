# Quick Setup Guide for Smart Campus

## 🚀 Quick Start (5 minutes)

### Step 1: Install MongoDB
**Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer (keep all default settings)
3. MongoDB will start automatically as a service

**Or use MongoDB Atlas (Cloud - Recommended for deployment):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### Step 2: Setup Project
```bash
# Navigate to project folder
cd vibe-ai-thon

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Configure Environment
1. Copy `.env.example` to `.env`
2. Edit `.env` file:
```env
SECRET_KEY=my-super-secret-key-12345
MONGO_URI=mongodb://localhost:27017/
GEMINI_API_KEY=your-api-key-here
```

**Get Gemini API Key (Optional - for chatbot):**
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Create API Key
4. Copy to `.env` file

### Step 4: Run Application
```bash
python app.py
```

Visit: http://localhost:5000

## 📝 First User Setup

### Create Admin Account
1. Go to http://localhost:5000/register
2. Fill in details:
   - Name: Admin User
   - Email: admin@klh.edu
   - Role: **Admin**
   - Password: (your choice)
3. Click Register
4. Login with credentials

### Create Test Users
Create some test accounts:
- Student: student@klh.edu (Role: Student)
- Faculty: faculty@klh.edu (Role: Faculty)

## 🎯 Test the Features

### 1. Test Lost & Found
- Login as student
- Go to Lost & Found
- Click "Report Item"
- Fill details and submit

### 2. Test Events
- Login as faculty/admin
- Go to Events
- Click "Create Event"
- Fill details and submit
- Logout and login as student
- Register for the event

### 3. Test Feedback
- Login as student
- Go to Feedback
- Click "Submit Feedback"
- Fill and submit
- Login as admin/faculty to view

### 4. Test Clubs
- Login as admin/faculty
- Go to Clubs
- Click "Create Club"
- Fill details
- Login as student to join

### 5. Test Chatbot
- Click on the chatbot widget (bottom right)
- Ask questions like:
  - "How do I report a lost item?"
  - "Show me upcoming events"
  - "How do I join a club?"

## 🌐 Deploy to Render (Free Hosting)

### Prerequisites
- GitHub account
- Render account (sign up at render.com)
- MongoDB Atlas account (for cloud database)

### Steps

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Create MongoDB Atlas Database**
- Go to MongoDB Atlas
- Create free cluster
- Create database user
- Whitelist all IPs (0.0.0.0/0)
- Get connection string

3. **Deploy on Render**
- Sign in to Render
- Click "New +" → "Web Service"
- Connect GitHub repository
- Configure:
  - Name: smart-campus-klh
  - Environment: Python 3
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `gunicorn app:app`
  
4. **Add Environment Variables**
In Render dashboard, add:
- `SECRET_KEY`: (generate a random string)
- `MONGO_URI`: (your MongoDB Atlas connection string)
- `GEMINI_API_KEY`: (your Gemini API key)

5. **Deploy**
- Click "Create Web Service"
- Wait for deployment
- Your app will be live at: https://smart-campus-klh.onrender.com

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: MongoServerError: Authentication failed
```
**Solution:** Check MongoDB is running or Atlas connection string is correct

### Port Already in Use
```
Error: Address already in use
```
**Solution:** Change port in app.py or kill existing process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Module Not Found
```
ModuleNotFoundError: No module named 'flask'
```
**Solution:** Make sure virtual environment is activated and run:
```bash
pip install -r requirements.txt
```

### Chatbot Not Working
**Solution:** 
- Check if GEMINI_API_KEY is set in .env
- If not available, chatbot will use fallback responses
- Gemini API is optional, platform works without it

## 📊 Sample Data

To quickly test the platform, you can manually add some sample data through the UI:

**Sample Event:**
- Title: Tech Fest 2025
- Date: Tomorrow's date
- Location: Main Auditorium
- Category: Technical

**Sample Lost Item:**
- Item: Blue Water Bottle
- Location: Library Ground Floor
- Category: Other

**Sample Club:**
- Name: Coding Club
- Category: Technical
- President: John Doe

## 💡 Tips

1. **Use Chrome DevTools** - Press F12 to see console logs
2. **Check Network Tab** - To see API calls
3. **Test Different Roles** - Create accounts with different roles
4. **Try Mobile View** - Responsive design works great on mobile
5. **Use Chatbot** - Test the AI assistant feature

## 🎓 Learning Resources

- Flask Documentation: https://flask.palletsprojects.com/
- MongoDB Tutorial: https://www.mongodb.com/docs/manual/tutorial/
- JWT Authentication: https://jwt.io/introduction
- Gemini API: https://ai.google.dev/docs

## ✅ Checklist

Before submitting/presenting:
- [ ] All features are working
- [ ] Database is connected
- [ ] At least one user of each role created
- [ ] Sample data added (events, items, clubs)
- [ ] Chatbot is responding
- [ ] Application is deployed (if required)
- [ ] README is updated
- [ ] Environment variables are set
- [ ] Tested on different browsers
- [ ] Mobile responsive verified

---

**Need Help?** Check the main README.md for detailed documentation.
