# 🗄️ MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account (2 minutes)

1. **Browser opened**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** with:
   - Google account (easiest), OR
   - Email + Password

## Step 2: Create a Free Cluster (3 minutes)

After login:

1. Click **"Build a Database"** or **"Create"**
2. Choose **"M0 Free"** tier (0 USD/month)
   - Storage: 512 MB (plenty for this project)
3. **Cloud Provider**: Any (AWS, Google Cloud, or Azure)
4. **Region**: Choose closest to you (for speed)
5. **Cluster Name**: Leave as "Cluster0" or name it "smart-campus"
6. Click **"Create Cluster"** (takes 1-3 minutes to deploy)

## Step 3: Create Database User

While cluster is deploying:

1. Click **"Database Access"** (left sidebar under Security)
2. Click **"Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `smartcampus` (or your choice)
5. **Password**: Click "Autogenerate Secure Password" and **SAVE IT!**
   
   ```
   Your password: ________________________
   (Write it down or copy it!)
   ```

6. **Database User Privileges**: Choose "Read and write to any database"
7. Click **"Add User"**

## Step 4: Whitelist Your IP Address

1. Click **"Network Access"** (left sidebar under Security)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` (all IPs can connect)
   - For production, you'd restrict this
4. Click **"Confirm"**

## Step 5: Get Connection String

1. Go back to **"Database"** (left sidebar)
2. Your cluster should be ready now (green dot)
3. Click **"Connect"** button on your cluster
4. Choose **"Connect your application"**
5. **Driver**: Node.js
6. **Version**: 5.5 or later
7. **Copy the connection string**:

   ```
   mongodb+srv://smartcampus:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

8. **IMPORTANT**: Replace `<password>` with your actual database password from Step 3

## Step 6: Update Your .env File

**I'll do this for you automatically once you provide the connection string.**

Your connection string should look like:
```
mongodb+srv://smartcampus:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/smart_campus?retryWrites=true&w=majority
```

---

## 🎯 Quick Summary

Copy this checklist as you go:

- [ ] Created MongoDB Atlas account
- [ ] Created M0 Free cluster
- [ ] Created database user with password
- [ ] Saved password somewhere safe
- [ ] Whitelisted all IPs (0.0.0.0/0)
- [ ] Got connection string
- [ ] Replaced `<password>` with actual password
- [ ] Added `/smart_campus` database name to string

---

## ✅ Once You Have the Connection String

**Paste it here or tell me, and I'll:**
1. Update your `.env` file
2. Set `SKIP_MONGODB=false`
3. Restart the server
4. Test the database connection
5. Create a test user to verify it works

---

## 🆘 Need Help?

If you get stuck, just tell me which step and I'll help!

**Estimated Total Time**: 5-7 minutes
