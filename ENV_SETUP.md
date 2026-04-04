# CampusXConnect - Environment Variables Guide

## Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
NODE_ENV=development

# ============================================
# DATABASE CONFIGURATION
# ============================================
# MongoDB Atlas URI format:
# mongodb+srv://username:password@cluster.mongodb.net/campusxconnect
#
# Local MongoDB:
# mongodb://localhost:27017/campusxconnect
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusxconnect

# ============================================
# AUTHENTICATION
# ============================================
# Generate a strong secret key for production
# Example: openssl rand -base64 32
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# JWT expiration time
JWT_EXPIRE=30d

# ============================================
# CORS CONFIGURATION
# ============================================
FRONTEND_URL=http://localhost:3000

# ============================================
# EMAIL CONFIGURATION (Optional)
# ============================================
# For future email verification features
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# ============================================
# FILE UPLOAD (Optional)
# ============================================
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# ============================================
# LOGGING (Optional)
# ============================================
LOG_LEVEL=debug
LOG_FILE=./logs/app.log
```

## Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory with:

```env
# ============================================
# API CONFIGURATION
# ============================================
# Must start with NEXT_PUBLIC_ to be accessible in browser
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# ============================================
# ANALYTICS (Optional)
# ============================================
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id

# ============================================
# ENVIRONMENT
# ============================================
NEXT_PUBLIC_ENV=development
```

## MongoDB Atlas Setup

### Step 1: Create Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or login
3. Create a new project

### Step 2: Create Cluster

1. Click "Create a Deployment"
2. Select "M0 Free" tier
3. Choose your region (closest to your location)
4. Create cluster

### Step 3: Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Set username and password (or auto-generate)
4. Note down credentials

### Step 4: Configure IP Whitelist

1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0) for development
4. Confirm

### Step 5: Get Connection String

1. Click "Databases"
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy connection string
5. Replace `<username>` and `<password>`
6. Replace `<database>` with `campusxconnect`

Example:

```
mongodb+srv://username:password@cluster0.mongodb.net/campusxconnect?retryWrites=true&w=majority
```

## JWT Secret Generation

### Generate Strong JWT Secret

**Using OpenSSL (Mac/Linux):**

```bash
openssl rand -base64 32
```

**Using Node.js:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Using Python:**

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Production Environment Variables

For production deployment, use strong values:

```env
# Backend (.env)
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://prod_user:prod_password@prod-cluster.mongodb.net/campusxconnect
JWT_SECRET=<strong-random-secret-min-32-chars>
FRONTEND_URL=https://yourdomain.com

# Frontend (.env.production)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_ENV=production
```

## Environment Variable Best Practices

1. **Never commit .env files** to version control
2. **Use .env.example** as a template
3. **Keep secrets secure** - use different values for dev/prod
4. **Rotate secrets regularly** in production
5. **Use environment-specific files**:
   - `.env.development` - Local development
   - `.env.test` - Testing
   - `.env.production` - Production

## Verifying Environment Variables

### Backend

```bash
# Test MongoDB connection
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"

# Start server
npm run dev
```

### Frontend

```bash
# Check API URL
node -e "console.log(process.env.NEXT_PUBLIC_API_URL)"

# Start frontend
npm run dev
```

## Troubleshooting

### Issue: "Cannot find module 'dotenv'"

```bash
# Install dotenv
npm install dotenv
```

### Issue: Environment variables not loading

1. Ensure `.env` file is in the correct directory
2. Restart the server after changing `.env`
3. Check file naming (`.env`, not `.env.txt`)

### Issue: MongoDB URI error

1. Verify MongoDB Atlas account is active
2. Check IP whitelist includes your machine
3. Confirm database user exists
4. Test URI directly in MongoDB Compass

### Issue: JWT errors in production

1. Ensure JWT_SECRET is the same in all replicas
2. Use strong, random secret (min 32 characters)
3. Don't share JWT_SECRET between environments

## Deployment Environment Variables

### Heroku (Backend)

```bash
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your-production-uri>
heroku config:set JWT_SECRET=<strong-secret>
heroku config:set FRONTEND_URL=https://yourfrontend.vercel.app
```

### Vercel (Frontend)

In Vercel Dashboard:

1. Go to Project Settings
2. Go to Environment Variables
3. Add:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-api.com/api`
   - `NEXT_PUBLIC_ENV` = `production`

## Accessing Environment Variables

### Backend (Node.js)

```javascript
const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT || 5000;
```

### Frontend (Next.js)

```javascript
// Must use NEXT_PUBLIC_ prefix to access in browser
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] .env files are in .gitignore
- [ ] Environment variables are set in deployment
- [ ] MongoDB IP whitelist is configured
- [ ] HTTPS is enabled in production
- [ ] CORS origin is set correctly
- [ ] No sensitive data in public environment variables
- [ ] Environment variables are different for dev/prod

---

For more information, see [README.md](./README.md) and [SETUP.md](./SETUP.md)
