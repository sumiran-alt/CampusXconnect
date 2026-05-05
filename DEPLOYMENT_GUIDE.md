# Free Deployment Guide: Railway (Backend) + Vercel (Frontend)

## 🎯 Overview
- **Backend**: Node.js/Express on Railway (Free tier)
- **Frontend**: Next.js on Vercel (Free tier)
- **Database**: MongoDB Atlas (Free tier - already configured ✓)

---

## 📋 Prerequisites
Before starting, ensure you have:
1. ✅ GitHub account (already have repo: Rishabh9560/CampusXconnect)
2. Railway account (create at railway.app)
3. Vercel account (create at vercel.com)
4. Git installed locally

---

## 🚀 STEP 1: Prepare Your Repository

### 1.1 Update Backend for Production

Your `.env` is already configured with MongoDB. Just ensure your `server.js` uses the PORT environment variable:
- ✅ Already configured: `const PORT = process.env.PORT || 5001;`

### 1.2 Update Frontend Environment
The frontend needs to point to your Railway backend URL.

Create `.env.production` in the `frontend/` folder:
```
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.up.railway.app/api
```

**We'll update this URL after deploying the backend to Railway.**

### 1.3 Verify Next.js Config
Your `frontend/next.config.js` allows all image sources - ✅ Good for production

---

## 🚂 STEP 2: Deploy Backend to Railway

### 2.1 Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Sign up / Log in
3. Click "New Project"
4. Select "Deploy from GitHub"
5. Connect your GitHub account
6. Search for `CampusXconnect` repository and select it

### 2.2 Configure Environment Variables in Railway
1. In Railway dashboard, go to your project
2. Click on the backend service
3. Go to "Variables" tab
4. Add these environment variables:

```
PORT=
MONGODB_URI=mongodb+srv://sumirannothing_db_user:QjypsIU4H3K7FQbK@cluster0.4ctxik7.mongodb.net/?appName=Cluster0
JWT_SECRET=campusxconnect_super_secret_jwt_key_2024
JWT_EXPIRE=30d
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
NODE_ENV=production
ADMIN_KEY=admin_secret_key_2024
JUDGE0_API_URL=https://api.judge0.com
JUDGE0_API_KEY=
```

### 2.3 Set Up Deployment
1. In "Settings" tab, set:
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `.` (project root)

### 2.4 Deploy
1. Click "Deploy" button
2. Railway will automatically build and deploy
3. Wait for deployment to complete (3-5 minutes)

### 2.5 Get Your Railway URL
1. Once deployed, click on your backend service
2. Go to "Settings" → "Domains"
3. Copy the generated railway URL (e.g., `https://campusxconnect-backend.up.railway.app`)
4. **Save this URL - you'll need it for the frontend**

---

## ✨ STEP 3: Deploy Frontend to Vercel

### 3.1 Update Frontend Environment
1. In your local `campusxconnect/frontend/` folder
2. Create or update `.env.production`:

```
NEXT_PUBLIC_API_URL=https://campusxconnect-backend.up.railway.app/api
```

Replace with your actual Railway URL from Step 2.5

3. Commit and push this change:
```bash
git add frontend/.env.production
git commit -m "Add production environment variables"
git push origin main
```

### 3.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in with GitHub
3. Click "New Project"
4. Select `CampusXconnect` repository
5. Configure project:
   - **Root Directory**: `frontend`
   - **Build Command**: `next build`
   - **Start Command**: `next start`
6. Click "Deploy"

### 3.3 Add Environment Variables in Vercel
1. After project creation, go to "Settings" → "Environment Variables"
2. Add:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://campusxconnect-backend.up.railway.app/api`
3. Make sure it's available for "Production", "Preview", and "Development"
4. Redeploy

### 3.4 Get Your Vercel URL
1. Go to "Deployments" tab
2. Copy your production URL (e.g., `https://campusxconnect.vercel.app`)
3. **Save this URL for updating backend FRONTEND_URL**

---

## 🔄 STEP 4: Update Backend FRONTEND_URL

1. Go back to Railway dashboard
2. Go to your backend service
3. Go to "Variables" tab
4. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://campusxconnect.vercel.app
   ```
5. The service will auto-redeploy

---

## ✅ STEP 5: Verify Deployment

### Test Backend
Open in browser:
```
https://your-railway-url.up.railway.app/api/health
```
You should see: `{"status":"Backend is running!"}`

### Test Frontend
1. Go to `https://your-vercel-url.vercel.app`
2. Try to Sign Up
3. Check if requests go to the correct backend URL

### Test API Connection
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Try logging in or creating a post
4. Verify API calls go to your Railway backend

---

## 📊 Free Tier Limits

### Railway
- **Free Tier**: $5/month credits (~500+ free hours)
- Includes:
  - ✅ Node.js runtime
  - ✅ Environment variables
  - ✅ Custom domains
  - ✅ Free SSL certificates

### Vercel
- **Free Tier**: Perfect for Next.js
- Includes:
  - ✅ Unlimited projects
  - ✅ Unlimited deployments
  - ✅ Automatic HTTPS
  - ✅ Built-in CI/CD

### MongoDB Atlas
- **Free Tier**: Already in use
- Includes:
  - ✅ 512MB storage
  - ✅ Shared cluster
  - ✅ Auto backups

---

## 🆘 Troubleshooting

### Backend won't start
1. Check Railway logs: "Deployments" → "View Logs"
2. Ensure `MONGODB_URI` is correct
3. Verify `PORT` is empty or not set (Railway assigns it)

### Frontend can't reach backend
1. Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Verify CORS is enabled in backend (`cors()` middleware)
3. Check Network tab in browser DevTools

### MongoDB connection errors
1. Verify MongoDB URI in Railway variables
2. Check MongoDB Atlas IP whitelist allows all IPs (`0.0.0.0/0`)
3. Test connection: `https://your-railway-url/api/health`

### Socket.io connection issues
1. Socket.io should automatically connect to same backend
2. Check browser console for connection errors
3. Verify FRONTEND_URL is set correctly in Railway

---

## 📱 Next Steps

1. **Monitor your deployment**:
   - Railway Dashboard for backend logs
   - Vercel Analytics for frontend performance

2. **Set up custom domains (optional)**:
   - Railway allows custom domains on paid plans
   - Vercel allows 1 free custom domain

3. **Enable email notifications** for deployment failures

4. **Set up CI/CD** (already automatic on both platforms)

---

## 🎉 You're Done!
Your full-stack app is now live and free! 🚀

**Frontend**: https://your-vercel-url.vercel.app
**Backend**: https://your-railway-url.up.railway.app
**API**: https://your-railway-url.up.railway.app/api

