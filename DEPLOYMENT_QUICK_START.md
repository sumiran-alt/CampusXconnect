# 🚀 Quick Start: Deploy CampusXConnect in 5 Minutes

## Step 1: Push to GitHub (1 min)
```bash
git add .
git commit -m "Prepare for deployment to Railway and Vercel"
git push origin main
```

---

## Step 2: Deploy Backend to Railway (2 min)

1. Go to **[railway.app](https://railway.app)** → Sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select **CampusXconnect** repository
4. Railway will auto-detect and deploy
5. Go to **"Settings"** and set:
   - **Root Directory**: `.` (leave default)
   - **Start Command**: `cd backend && npm start`
6. Add environment variables in **"Variables"** tab:
   ```
   MONGODB_URI=mongodb+srv://sumirannothing_db_user:QjypsIU4H3K7FQbK@cluster0.4ctxik7.mongodb.net/?appName=Cluster0
   JWT_SECRET=campusxconnect_super_secret_jwt_key_2024
   JWT_EXPIRE=30d
   FRONTEND_URL=https://campusxconnect.vercel.app (UPDATE THIS AFTER FRONTEND DEPLOYMENT)
   NODE_ENV=production
   ADMIN_KEY=admin_secret_key_2024
   ```
7. Click **Deploy** and wait 3-5 minutes
8. Copy the **railway URL** from Settings → Domains (e.g., `https://campusxconnect.up.railway.app`)

---

## Step 3: Deploy Frontend to Vercel (2 min)

1. Update `frontend/.env.production`:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR_RAILWAY_URL/api
   ```
   (Replace with your Railway URL from Step 2)

2. Push changes:
   ```bash
   git add frontend/.env.production
   git commit -m "Add production API URL"
   git push origin main
   ```

3. Go to **[vercel.com](https://vercel.com)** → Sign in with GitHub
4. Click **"New Project"** → Select **CampusXconnect**
5. Configure:
   - **Root Directory**: `frontend`
   - Click **Deploy**
6. Add environment variables in **Settings** → **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR_RAILWAY_URL/api
   ```
7. Copy the **Vercel URL** from deployments (e.g., `https://campusxconnect.vercel.app`)

---

## Step 4: Update Backend FRONTEND_URL (1 min)

1. Go back to **Railway** → Backend service
2. Go to **"Variables"** tab
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://YOUR_VERCEL_URL
   ```
   (Use your Vercel URL from Step 3)
4. Save → Auto-redeploy

---

## ✅ Done! 🎉

### Test Your Deployment:
- **Frontend**: https://your-vercel-url.vercel.app
- **Backend Health**: https://your-railway-url.up.railway.app/api/health
- **API**: https://your-railway-url.up.railway.app/api

### Expected Result:
- Visiting frontend loads your CampusXConnect app
- Signing up/logging in works
- Messages send in real-time
- All features work as expected

---

## 💰 Cost Breakdown (Monthly)
- **Railway**: FREE tier ($5 credits = ~500+ free hours)
- **Vercel**: FREE for Next.js
- **MongoDB**: FREE tier already in use
- **TOTAL**: **$0/month** 🎉

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't deploy | Check Railway logs, ensure `MONGODB_URI` is correct |
| Frontend can't reach API | Verify `NEXT_PUBLIC_API_URL` in Vercel environment variables |
| Socket.io not working | Ensure `FRONTEND_URL` in Railway is set to Vercel URL |
| CORS errors | CORS is enabled in backend - should work automatically |

---

## 📚 Full Details
See `DEPLOYMENT_GUIDE.md` for detailed explanation of each step.
