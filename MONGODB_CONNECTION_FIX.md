# MongoDB Connection Fix Guide

## Quick Solutions (Choose One)

---

## ✅ SOLUTION 1: Fixed IP on MongoDB Atlas (5 minutes)

**Best for:** Development on a stable network

### Steps:

1. **Get your current public IP:**
   ```powershell
   # Open PowerShell and run:
   (Invoke-WebRequest -Uri "https://api.ipify.org").Content
   ```
   You'll get something like: `203.0.113.45`

2. **Add IP to MongoDB Atlas:**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Click your project name
   - Go to: **Network Access** (left sidebar)
   - Click: **+ Add IP Address**
   - Enter your IP address (e.g., `203.0.113.45`)
   - Click: **Confirm**
   - Wait 5-10 minutes for whitelist to update

3. **Start backend:**
   ```powershell
   cd backend
   npm run dev
   ```

4. **Check for success:**
   ```
   ✅ Server running on port 5000
   ✅ Connected to MongoDB
   ```

---

## ✅ SOLUTION 2: Allow All IPs (Development Only - 3 minutes)

**Best for:** Quick testing, not secure for production

### Steps:

1. **Go to MongoDB Atlas:**
   - https://www.mongodb.com/cloud/atlas
   - Go to: **Network Access**
   - Click: **+ Add IP Address**

2. **Enter:** `0.0.0.0/0`
   - This allows ALL IPs
   - ⚠️ Only for development!

3. **Confirm and wait 1-2 minutes**

4. **Start backend:**
   ```powershell
   cd backend
   npm run dev
   ```

---

## ✅ SOLUTION 3: Local MongoDB with Docker (10 minutes)

**Best for:** Complete local development, no cloud dependency

### Prerequisites:
- Docker installed: https://docker.com

### Steps:

1. **Start MongoDB locally:**
   ```powershell
   docker run -d -p 27017:27017 --name campusxconnect-mongo mongo:latest
   ```

2. **Update backend/.env:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/campusxconnect
   ```

3. **Start backend:**
   ```powershell
   cd backend
   npm run dev
   ```

4. **Verify connection:**
   ```
   ✅ Server running on port 5000
   ✅ Connected to MongoDB
   ```

5. **To stop MongoDB later:**
   ```powershell
   docker stop campusxconnect-mongo
   docker rm campusxconnect-mongo
   ```

---

## ✅ SOLUTION 4: Use MongoDB Community Edition (20 minutes)

**Best for:** Windows users who prefer native installation

### Steps:

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, .msi
   - Download and install

2. **Verify installation:**
   ```powershell
   mongod --version
   ```

3. **Start MongoDB service:**
   ```powershell
   mongod
   ```
   Output should show: `"msg":"Waiting for connections"`

4. **Update backend/.env:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/campusxconnect
   ```

5. **In another terminal, start backend:**
   ```powershell
   cd backend
   npm run dev
   ```

---

## 🔍 Verify Connection Works

### Test 1: Check backend starts

```powershell
cd backend
npm run dev
```

**Expected output:**
```
✅ Server running on port 5000
✅ Environment: development
✅ Database: mongodb+srv://...
Socket.io initialized and listening for connections
```

### Test 2: Make a test API call

```powershell
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password123"
  }'
```

**Expected response:**
```json
{
  "success": false,
  "message": "Invalid credentials or account does not exist"
}
```

(This is expected since we don't have test data yet)

### Test 3: Check frontend can connect

```powershell
cd frontend
npm run dev
```

Then open browser: http://localhost:3000

Try to login - should see proper error message, not network error.

---

## ⚠️ Common Issues

### Issue: "MongoDB Atlas connection timeout"

**Solution:**
- IP whitelist hasn't updated yet (wait 5-10 min)
- Or use Solution 3 (Docker) or Solution 4 (Local)
- Or check your IP didn't change

### Issue: "Connection refused at 27017"

**Solution:**
- MongoDB not running locally
- Run: `docker run -d -p 27017:27017 mongo:latest`
- Or start MongoDB from Services (Windows)

### Issue: "Authentication failed"

**Solution:**
- Check credentials in `.env`
- Make sure IP is whitelisted
- Regenerate MongoDB password

### Issue: "Port 27017 already in use"

**Solution:**
- Stop other MongoDB: `docker ps -a` then `docker stop <id>`
- Or use different port: `docker run -d -p 27018:27017 mongo:latest`

---

## 📋 Recommended Setup

For development:

```
✅ Solution 3 (Docker) - Most reliable
✅ Solution 1 (Fixed IP) - If you have stable internet
❌ Solution 2 (Allow All) - Security risk
```

For production:

```
✅ Always use: Solution 1 or proper IP whitelist
✅ Use MongoDB Atlas (cloud)
✅ Enable backups
✅ Enable monitoring
```

---

## ✨ After Fixing MongoDB

1. **Backend starts**
2. **Frontend runs**
3. **You can login**
4. **Test all features**

Then proceed with feature enhancements!

---

**Need help? Check the logs:**
```bash
# Backend logs
tail -f backend/logs/app.log

# Error logs
tail -f backend/logs/error.log
```
