# 🚀 Deployment Guide - Render Free Hosting

## Overview

Deploy your Smart Campus Ecosystem on Render's free tier with automatic HTTPS, continuous deployment from GitHub, and zero cost.

## Prerequisites

- GitHub account
- Render account (free)
- MongoDB Atlas account (free)
- Your project pushed to GitHub

## Step 1: Prepare Your Project

### 1.1 Ensure All Files Are Ready

Your project should have:
- ✅ `server.js` - Main server file
- ✅ `package.json` - With start script
- ✅ `.env.example` - Template for environment variables
- ✅ `.gitignore` - Excludes node_modules and .env

### 1.2 Verify package.json

Ensure these scripts exist:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 1.3 Check Node Version

Add to `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Step 2: Set Up MongoDB Atlas

### 2.1 Create Free Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Sign in
3. Click "Build a Database"
4. Choose **M0 Free** tier
5. Select a cloud provider and region
6. Name your cluster: `smart-campus`
7. Click "Create"

### 2.2 Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `smartcampus`
5. Generate strong password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 2.3 Whitelist All IPs

1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. IP: `0.0.0.0/0`
5. Click "Confirm"

### 2.4 Get Connection String

1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy the connection string:
```
mongodb+srv://smartcampus:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
```
5. Replace `<password>` with your database user password
6. Add database name: `smart_campus`
```
mongodb+srv://smartcampus:YOUR_PASSWORD@cluster.mongodb.net/smart_campus?retryWrites=true&w=majority
```

## Step 3: Get Gemini API Key

### 3.1 Create API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the API key (save it!)

## Step 4: Push to GitHub

### 4.1 Initialize Git Repository

```bash
cd c:\Users\jeeva\OneDrive\Desktop\vibe-ai-thon
git init
git add .
git commit -m "Initial commit - Smart Campus Ecosystem"
```

### 4.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `smart-campus-ecosystem`
3. Make it Public or Private
4. Don't initialize with README (we have one)
5. Click "Create repository"

### 4.3 Push Code

```bash
git remote add origin https://github.com/YOUR_USERNAME/smart-campus-ecosystem.git
git branch -M main
git push -u origin main
```

## Step 5: Deploy on Render

### 5.1 Create Render Account

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)

### 5.2 Create Web Service

1. Click "New +" button
2. Select "Web Service"
3. Choose "Build and deploy from a Git repository"
4. Click "Next"

### 5.3 Connect GitHub Repository

1. Click "Connect account" if not connected
2. Find your repository: `smart-campus-ecosystem`
3. Click "Connect"

### 5.4 Configure Service

**Basic Settings**:
- **Name**: `smart-campus-klh` (will be your URL subdomain)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: (leave blank)
- **Runtime**: `Node`

**Build Settings**:
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type**:
- Select **Free** (0 USD/month)
- Note: Free services spin down after 15 minutes of inactivity

Click "Advanced" to add environment variables...

### 5.5 Add Environment Variables

Click "Add Environment Variable" for each:

1. **NODE_ENV**
   - Value: `production`

2. **PORT**
   - Value: `5000`

3. **MONGO_URI**
   - Value: `mongodb+srv://smartcampus:YOUR_PASSWORD@cluster.mongodb.net/smart_campus?retryWrites=true&w=majority`
   - ⚠️ Replace YOUR_PASSWORD with actual password

4. **JWT_SECRET**
   - Value: Generate random string (e.g., `smart_campus_jwt_prod_2025_xyz`)

5. **GEMINI_API_KEY**
   - Value: Your Gemini API key from Step 3

6. **FRONTEND_URL**
   - Value: `https://smart-campus-klh.onrender.com`
   - ⚠️ Use your actual Render URL (comes after deployment)

### 5.6 Create Web Service

1. Review all settings
2. Click "Create Web Service"
3. Render will start building...

## Step 6: Wait for Deployment

### 6.1 Build Process

Watch the logs in Render dashboard:
```
Installing dependencies...
Building...
Starting service...
```

This takes 2-5 minutes.

### 6.2 Successful Deployment

Look for:
```
🚀 Smart Campus Server running on port 5000
✓ Connected to MongoDB
🔌 Socket.IO enabled for real-time updates
Your service is live 🎉
```

## Step 7: Access Your Application

### 7.1 Get Your URL

Your app will be available at:
```
https://smart-campus-klh.onrender.com
```
(Replace with your chosen name)

### 7.2 Update FRONTEND_URL

1. Go to Render dashboard
2. Select your service
3. Go to "Environment"
4. Edit `FRONTEND_URL`
5. Set to: `https://smart-campus-klh.onrender.com`
6. Click "Save Changes"
7. Service will redeploy automatically

### 7.3 Test Your Application

1. Open your URL in browser
2. Register a new account
3. Test all features:
   - Lost & Found
   - Events
   - Feedback
   - Clubs
   - Announcements
   - AI Chatbot

## Step 8: Continuous Deployment

### 8.1 Auto-Deploy on Push

Any push to GitHub main branch triggers automatic redeployment:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
```

Render detects the push and redeploys automatically!

### 8.2 Manual Deploy

In Render dashboard:
1. Go to your service
2. Click "Manual Deploy"
3. Choose branch: `main`
4. Click "Deploy"

## 🎉 Your App is Live!

Share your URL: `https://smart-campus-klh.onrender.com`

## ⚠️ Important Notes

### Free Tier Limitations

1. **Spin Down**: Free services sleep after 15 minutes of inactivity
2. **Cold Start**: First request after sleep takes 30-60 seconds to wake up
3. **Monthly Hours**: 750 hours/month (enough for 24/7)
4. **Database**: MongoDB Atlas M0 Free - 512 MB storage

### Keeping Service Awake (Optional)

Use a service like UptimeRobot:
1. Go to https://uptimerobot.com
2. Add monitor for your URL
3. Ping every 5 minutes
4. Keeps service awake during active hours

### Performance Tips

1. Enable compression in `server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

2. Add to `package.json`:
```bash
npm install compression
```

3. Push changes to redeploy

## 🔧 Troubleshooting

### Build Failed

**Error**: `npm install failed`
- Check `package.json` syntax
- Ensure all dependencies are listed
- Check build logs for specific error

**Error**: `Port already in use`
- Render handles port automatically
- Don't hardcode port, use `process.env.PORT`

### Cannot Connect to MongoDB

**Error**: `MongoServerError: bad auth`
- Verify username and password in MONGO_URI
- Check database user permissions
- Ensure password doesn't contain special characters (URL encode if needed)

**Error**: `MongoNetworkError`
- Check Network Access in MongoDB Atlas
- Ensure 0.0.0.0/0 is whitelisted
- Verify connection string format

### Service Crash on Startup

**Check Logs**:
1. Go to Render dashboard
2. Click "Logs"
3. Look for error messages

**Common Issues**:
- Missing environment variables
- Database connection failure
- Syntax errors in code

### Socket.IO Not Working

1. Check CORS configuration in `server.js`
2. Ensure Socket.IO client uses correct URL
3. Check browser console for connection errors

## 🔒 Security Best Practices

### 1. Environment Variables

Never commit `.env` to GitHub!
- ✅ `.gitignore` includes `.env`
- ✅ Use `.env.example` as template
- ✅ Set real values in Render dashboard

### 2. JWT Secret

Use strong random strings:
```bash
# Generate in Node.js REPL
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. MongoDB Security

- Use strong passwords
- Don't use default usernames
- For production, whitelist specific IPs (not 0.0.0.0/0)
- Enable 2FA on MongoDB Atlas

### 4. API Keys

- Keep Gemini API key secret
- Set usage limits in Google AI Studio
- Monitor usage regularly

## 📊 Monitoring

### Render Dashboard

- **Logs**: Real-time server logs
- **Metrics**: CPU, memory usage
- **Events**: Deployment history
- **Health**: Service status

### MongoDB Atlas

- **Metrics**: Database performance
- **Real-time**: Active connections
- **Storage**: Data usage
- **Alerts**: Set up email notifications

## 🚀 Scaling (Paid Plans)

When you outgrow free tier:

### Render Paid Plans
- **Starter**: $7/month - No sleep, more resources
- **Standard**: $25/month - Auto-scaling, more memory

### MongoDB Atlas Paid Plans
- **M10**: $0.08/hour - 2 GB RAM, 10 GB storage
- **M20**: $0.20/hour - 4 GB RAM, 20 GB storage

## 📚 Additional Resources

- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Socket.IO Docs](https://socket.io/docs/)

## 🎯 Checklist

Before going live:

- [ ] All features tested locally
- [ ] MongoDB Atlas configured
- [ ] Environment variables set
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Render service deployed
- [ ] Domain works (https://your-app.onrender.com)
- [ ] Real-time features working
- [ ] AI chatbot responding
- [ ] All pages accessible
- [ ] Mobile responsive
- [ ] Security best practices followed

## 🎉 You're Done!

Your Smart Campus Ecosystem is now live and accessible worldwide!

**Your Live URL**: `https://smart-campus-klh.onrender.com`

Share it with:
- Students
- Faculty
- Administration
- Other universities

---

**Questions?** Check the logs, review environment variables, or test locally first.

**Success?** 🎉 Congratulations on deploying your first full-stack real-time web application!
