# CampusXConnect - Setup Guide

Complete step-by-step guide to run the application locally.

## System Requirements

- Node.js v16 or higher
- npm v8 or higher
- MongoDB (Atlas or local)
- Git

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd campusxconnect
```

### 2. Backend Setup

#### Step 1: Navigate to Backend

```bash
cd backend
```

#### Step 2: Install Dependencies

```bash
npm install
```

This will install:

- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - Cross-origin requests
- dotenv - Environment variables
- nodemon - Development auto-reload

#### Step 3: Setup Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusxconnect

# Authentication
JWT_SECRET=your_very_secure_jwt_secret_key_change_this_in_production

# Frontend
FRONTEND_URL=http://localhost:3000
```

**To get MongoDB URI:**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a cluster
4. Click "Connect"
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<username>` and `<password>` with your credentials

#### Step 4: Start Backend Server

```bash
npm run dev
```

You should see:

```
Server running on port 5000
MongoDB Connected: cluster0.mongodb.net
```

### 3. Frontend Setup (New Terminal)

#### Step 1: Navigate to Frontend

```bash
cd frontend
```

#### Step 2: Install Dependencies

```bash
npm install
```

This will install:

- next - React framework
- react - UI library
- tailwindcss - CSS framework
- axios - HTTP client
- zustand - State management
- react-hot-toast - Notifications

#### Step 3: Setup Environment Variables

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Step 4: Start Frontend Server

```bash
npm run dev
```

You should see:

```
> Local:        http://localhost:3000
```

### 4. Access the Application

Open your browser and go to:

```
http://localhost:3000
```

## 🧪 Testing the Application

### Step 1: Sign Up

1. Click "Get Started" on home page
2. Fill signup form with:
   - Name: Your Name
   - Email: your.email@example.com
   - Password: Your Password
3. Click "Sign Up"

### Step 2: Complete Profile

1. Go to Profile page
2. Click "Edit Profile"
3. Add:
   - Branch: CSE/ECE/ME etc.
   - Year: 1-4
   - Bio: Your bio
   - Skills: React, Node.js, etc.
   - GitHub/LinkedIn links
4. Click "Save Changes"

### Step 3: Create a Post

1. Go to Feed page
2. Click "Create Post"
3. Fill in:
   - Title: "My Awesome Project"
   - Description: Project details
   - Tech Stack: React, Node.js
   - GitHub Link: Your repo URL
4. Click "Publish Post"

### Step 4: Practice Coding

1. Go to "Practice" (Coding)
2. Select a difficulty level
3. Click on a problem
4. View test cases
5. Write solution in code editor
6. Select language
7. Click "Submit Solution"

### Step 5: View Leaderboard

1. From Coding page, click "View Leaderboard"
2. See ranked students by problems solved

## 📊 Creating Sample Data

### Add Sample Problems (Backend)

Connect to MongoDB and insert:

```javascript
db.codingproblems.insertMany([
  {
    title: "Two Sum",
    description: "Find two numbers that add up to target",
    difficulty: "Easy",
    category: "Array",
    testCases: [
      { input: "[2,7,11,15], target=9", output: "[0,1]" },
      { input: "[3,2,4], target=6", output: "[1,2]" },
    ],
  },
  {
    title: "Reverse String",
    description: "Reverse the given string",
    difficulty: "Easy",
    category: "String",
    testCases: [{ input: '"hello"', output: '"olleh"' }],
  },
  {
    title: "Merge Two Sorted Lists",
    description: "Merge two sorted linked lists",
    difficulty: "Medium",
    category: "Linked List",
    testCases: [{ input: "[1,2,4], [1,3,4]", output: "[1,1,2,3,4,4]" }],
  },
]);
```

## 🆘 Troubleshooting

### Issue: MongoDB Connection Failed

**Solution:**

- Check MongoDB URI is correct
- Ensure IP is whitelisted in MongoDB Atlas
- Verify username/password
- Check database exists

### Issue: CORS Error

**Solution:**

- Ensure FRONTEND_URL in backend .env matches frontend URL
- Check backend server is running
- Browser console will show specific CORS error

### Issue: Port Already in Use

**Solution:**

```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: npm ERR! ERESOLVE

**Solution:**

```bash
npm install --legacy-peer-deps
```

### Issue: Blank Page on Frontend

**Solution:**

1. Check browser console for errors
2. Verify API_URL in .env.local
3. Check backend is running
4. Clear browser cache and reload

## 📱 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔧 Development Commands

### Backend

```bash
npm run dev      # Start with auto-reload
npm start        # Start production
npm test         # Run tests (if configured)
```

### Frontend

```bash
npm run dev      # Start development
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run linter
```

## 📦 Production Build

### Backend Production

```bash
NODE_ENV=production npm start
```

### Frontend Production

```bash
npm run build
npm start
```

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to strong value
- [ ] Use HTTPS in production
- [ ] Enable MongoDB IP whitelist
- [ ] Set NODE_ENV=production
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for your domain
- [ ] Add rate limiting
- [ ] Enable password reset feature

## 📈 Performance Tips

1. **Database Indexing**: Create indexes on frequently queried fields
2. **Pagination**: Use pagination for large datasets
3. **Caching**: Implement Redis for frequently accessed data
4. **Image Optimization**: Compress profile pictures
5. **Code Splitting**: Next.js automatic code splitting

## 🚀 Next Steps

1. **Customize**: Modify colors, branding in tailwind.config.js
2. **Add Features**:
   - Email verification
   - Password reset
   - Real-time notifications
   - File uploads
   - Advanced search
3. **Deployment**: Deploy to Vercel (frontend) and Render (backend)
4. **Analytics**: Add Google Analytics
5. **Monitoring**: Set up error tracking with Sentry

## 📚 Learning Resources

- [Node.js Best Practices](https://nodejs.org/en/docs/)
- [MongoDB Aggregation](https://docs.mongodb.com/manual/aggregation/)
- [Next.js Best Practices](https://nextjs.org/docs/basic-features/best-practices)
- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)

## 💬 Getting Help

1. Check GitHub Issues
2. Read API documentation
3. Check browser console for errors
4. Review backend logs
5. Search Stack Overflow

---

**You're all set!** Start developing and building amazing features. 🎉
