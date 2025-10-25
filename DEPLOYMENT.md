# Deployment Guide - Smart Campus on Render

This guide will walk you through deploying the Smart Campus application on Render (free hosting).

## Prerequisites

✅ GitHub account  
✅ Render account (sign up at https://render.com)  
✅ MongoDB Atlas account (for cloud database)  
✅ Gemini API key (optional, for chatbot)

## Part 1: Setup MongoDB Atlas (Cloud Database)

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account (if you don't have one)
3. Verify your email

### 2. Create a Database Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0)
3. Select a cloud provider (AWS recommended) and region closest to you
4. Click "Create Cluster"
5. Wait 3-5 minutes for cluster creation

### 3. Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `smart_campus_user`
5. Password: Generate a secure password (copy it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 4. Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 5. Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `smart_campus`

Example:
```
mongodb+srv://smart_campus_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/smart_campus?retryWrites=true&w=majority
```

**Save this connection string!** You'll need it for Render.

## Part 2: Push Code to GitHub

### 1. Initialize Git Repository
```bash
cd vibe-ai-thon
git init
```

### 2. Create .gitignore (already created)
Make sure `.env` is in `.gitignore` to protect your secrets.

### 3. Create Repository on GitHub
1. Go to https://github.com
2. Click "+" → "New repository"
3. Name: `smart-campus-klh`
4. Description: "Smart Campus Ecosystem for KLH University"
5. Public or Private (your choice)
6. Click "Create repository"

### 4. Push Code
```bash
git add .
git commit -m "Initial commit - Smart Campus Platform"
git remote add origin https://github.com/YOUR_USERNAME/smart-campus-klh.git
git branch -M main
git push -u origin main
```

## Part 3: Deploy on Render

### 1. Sign Up for Render
1. Go to https://render.com
2. Sign up using GitHub (recommended)

### 2. Create New Web Service
1. Click "New +" button
2. Select "Web Service"
3. Click "Connect" next to your GitHub repository
   - If you don't see it, click "Configure account" to grant access

### 3. Configure Web Service
Fill in the following details:

**Basic Info:**
- **Name**: `smart-campus-klh` (or your choice)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Runtime**: `Python 3`

**Build & Deploy:**
- **Build Command**: 
  ```
  pip install -r requirements.txt
  ```
- **Start Command**: 
  ```
  gunicorn app:app
  ```

**Instance Type:**
- Select **Free** tier

### 4. Add Environment Variables
Scroll down to "Environment Variables" section and add:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | Generate a random string (e.g., `klh-smart-campus-secret-2025-xyz123`) |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `GEMINI_API_KEY` | Your Gemini API key (optional) |
| `PYTHON_VERSION` | `3.11.0` |

**Example:**
```
SECRET_KEY=klh-smart-campus-secret-2025-xyz123
MONGO_URI=mongodb+srv://smart_campus_user:YourPassword@cluster0.xxxxx.mongodb.net/smart_campus?retryWrites=true&w=majority
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 5. Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Watch the logs for any errors
4. Once deployed, you'll get a URL like: `https://smart-campus-klh.onrender.com`

## Part 4: Initialize Database with Sample Data

### Option 1: Using Local Script
1. Update `.env` with your MongoDB Atlas connection string
2. Run: `python init_data.py`
3. This will populate your cloud database with sample data

### Option 2: Manual Registration
1. Visit your deployed app URL
2. Go to `/register`
3. Create an admin account
4. Create some test data through the UI

## Part 5: Test Your Deployment

### 1. Verify Application
- Visit: `https://your-app-name.onrender.com`
- You should see the landing page

### 2. Test Authentication
1. Click "Register"
2. Create a new account
3. Login with credentials
4. Verify dashboard loads

### 3. Test Features
- Create an event (as admin/faculty)
- Report a lost item
- Submit feedback
- Test chatbot

### 4. Check Logs
If something doesn't work:
1. Go to Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Check for errors

## Part 6: Custom Domain (Optional)

### 1. Get a Free Domain
- Use services like:
  - Freenom (free domains)
  - Your school's domain
  - Render subdomain (included)

### 2. Configure Custom Domain
1. In Render dashboard, go to "Settings"
2. Scroll to "Custom Domains"
3. Click "Add Custom Domain"
4. Follow the instructions to configure DNS

## Troubleshooting

### Issue: Build Failed
**Solution:**
- Check if `requirements.txt` is in the repository
- Verify all dependencies are listed
- Check build logs for specific errors

### Issue: Application Crashes on Start
**Solution:**
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check start command is: `gunicorn app:app`

### Issue: MongoDB Connection Error
**Solution:**
- Verify MongoDB Atlas is allowing connections from anywhere (0.0.0.0/0)
- Check connection string is correct
- Ensure password doesn't have special characters that need URL encoding

### Issue: Port Already in Use
**Solution:**
- Render automatically assigns port
- Make sure your app uses: `app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))`

### Issue: Static Files Not Loading
**Solution:**
- Verify folder structure: `static/css/` and `static/js/`
- Check file paths in HTML templates

### Issue: 502 Bad Gateway
**Solution:**
- Service is still starting - wait a few minutes
- Check logs for startup errors
- Verify gunicorn is installed in requirements.txt

## Maintenance

### Update Your App
```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push origin main
```
Render will automatically redeploy!

### Monitor Your App
1. Go to Render dashboard
2. Check metrics:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

### View Logs
- Real-time logs in Render dashboard
- Download logs for debugging
- Set up log alerts

## Free Tier Limitations

Render Free Tier includes:
- ✅ 750 hours/month (enough for 24/7)
- ✅ Auto-sleep after 15 min inactivity
- ✅ First request may be slow (cold start)
- ✅ SSL certificate included
- ⚠️ Service spins down after inactivity
- ⚠️ Slow cold starts (15-30 seconds)

## Tips for Better Performance

1. **Keep Service Awake**: Use UptimeRobot to ping your app every 5 minutes
2. **Optimize Database Queries**: Add indexes in MongoDB
3. **Use Caching**: Implement caching for static data
4. **Compress Responses**: Use gzip compression
5. **Optimize Images**: Use compressed images or CDN

## Getting Help

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com

## Checklist

Before going live:
- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Network access set to 0.0.0.0/0
- [ ] Connection string tested
- [ ] Code pushed to GitHub
- [ ] Render web service created
- [ ] Environment variables configured
- [ ] App successfully deployed
- [ ] All features tested on production
- [ ] Sample data added
- [ ] Custom domain configured (optional)
- [ ] Error monitoring set up

## Success! 🎉

Your Smart Campus application is now live and accessible to everyone!

**Share your app:**
- URL: `https://your-app-name.onrender.com`
- Tell users about features
- Collect feedback for improvements

---

**Need help?** Check the main README.md or SETUP_GUIDE.md for more information.
