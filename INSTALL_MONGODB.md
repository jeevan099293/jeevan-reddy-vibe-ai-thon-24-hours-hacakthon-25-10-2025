# MongoDB Installation Guide

## Option 1: MongoDB Atlas (Cloud - Recommended, 5 minutes)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** for free account
3. **Create a FREE cluster**:
   - Choose M0 (Free tier)
   - Select a cloud provider (AWS recommended)
   - Choose nearest region
4. **Database Access**:
   - Create a database user
   - Username: `admin`
   - Password: Choose a secure password (save it!)
5. **Network Access**:
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
6. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
7. **Update .env file**:
   ```
   MONGO_URI=mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/smart_campus?retryWrites=true&w=majority
   ```

## Option 2: Local MongoDB Installation (Windows)

1. **Download MongoDB Community Edition**:
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Download and run installer

2. **Install MongoDB**:
   - Run the .msi installer
   - Choose "Complete" installation
   - Install as Windows Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**:
   ```cmd
   mongod --version
   ```

4. **Start MongoDB Service**:
   ```cmd
   net start MongoDB
   ```

5. **MongoDB will run on**: `mongodb://localhost:27017/`

6. **Your .env is already configured** for local MongoDB!

## Current Setup
- Your .env is configured for local MongoDB: `mongodb://localhost:27017/smart_campus`
- To use MongoDB Atlas, update the MONGO_URI in .env with your Atlas connection string
