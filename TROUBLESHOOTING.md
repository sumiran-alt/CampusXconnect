# Troubleshooting Guide

## Port Already in Use Error (EADDRINUSE)

### Automatic Fallback (Now Implemented!)
The backend server now automatically tries the next available port if port 5000 is in use. You should see output like:
```
✅ Server running on port 5001 instead
```

### If You Still Get Port Errors:

#### Option 1: Run the Cleanup Script (Recommended)
On Windows PowerShell:
```powershell
cd "f:\major project last year\campusxconnect"
.\cleanup-ports.ps1
```

This will:
- Kill all Node processes
- Free ports 3000 and 5000
- Clean Next.js build cache
- Allow you to restart npm dev

#### Option 2: Manual Cleanup

**Find processes using port 5000:**
```powershell
netstat -ano | findstr :5000
```

**Kill specific process (replace with actual PID):**
```powershell
taskkill /PID <PID> /F
```

**Kill all Node processes:**
```powershell
Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force
```

**Clean Next.js build cache:**
```powershell
Remove-Item "frontend\.next" -Recurse -Force -ErrorAction SilentlyContinue
```

#### Option 3: Use Different Ports

**Backend - Set custom port:**
```bash
PORT=5001 npm run dev
```

**Frontend - Use auto port selection:**
```bash
npm run dev:auto
```
This will automatically find an available port starting from 3000.

---

## Common Issues

### 1. "Port 3000 is in use by process..."
- Run the cleanup script
- Or: `npm run dev:auto` (frontend automatically finds next port)

### 2. "Unable to acquire lock at .next/dev/lock"
- Multiple Next.js instances running
- Clean cache: `Remove-Item "frontend\.next" -Recurse -Force`

### 3. "Cannot connect to backend"
- Check backend URL in `frontend/lib/api.js`
- Ensure backend is running: `http://localhost:5000/api/health`
- If backend on different port, update API base URL

---

## Prevention Tips

✅ Always run cleanup script before restarting  
✅ Close VS Code terminals to properly shut down processes  
✅ Use `Ctrl+C` to gracefully stop servers  
✅ Check `ps aux | grep node` (Mac/Linux) or Task Manager (Windows) for stray processes
