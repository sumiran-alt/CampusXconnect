# CampusXConnect - Student Networking Platform

A production-ready full-stack web application for students of Dronacharya Group of Institutions. CampusXConnect combines the features of LinkedIn, Discord, and LeetCode into a comprehensive student networking platform.

## 🌟 Features

### 1. **Authentication System**

- Secure signup with college email
- JWT-based login authentication
- Password hashing with bcrypt
- Protected routes and endpoints

### 2. **Student Profile System**

- Complete profile management
- Profile information: Name, Email, Branch, Year, Bio
- Skills showcase
- GitHub and LinkedIn integration
- Follow/Unfollow functionality

### 3. **Project Posting Feed**

- Create and share project posts
- Add descriptions, tech stack, and GitHub links
- Like and comment on posts
- Interactive feed with pagination

### 4. **Collaboration Feature**

- Discover projects from other students
- Join project teams
- Collaborate with like-minded peers

### 5. **Coding Practice Section**

- Solve coding challenges
- Multiple languages support (JavaScript, Python, Java, C++, Go)
- Difficulty levels (Easy, Medium, Hard)
- Leaderboard with rankings

## 📱 Tech Stack

### Frontend

- **Next.js 14** (App Router)
- **React** for UI components
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Axios** for API requests
- **React Hot Toast** for notifications

### Backend

- **Node.js** runtime
- **Express.js** framework
- **MongoDB** database
- **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

## 📁 Project Structure

```
campusxconnect/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.jsx
│   │   ├── login/
│   │   ├── signup/
│   │   ├── profile/
│   │   ├── feed/
│   │   ├── create-post/
│   │   ├── coding/
│   │   └── leaderboard/
│   ├── components/
│   │   └── Navigation.jsx
│   ├── lib/
│   │   ├── api.js
│   │   └── store.js
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
└── backend/
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── User.js
    │   ├── Post.js
    │   ├── Comment.js
    │   ├── CodingProblem.js
    │   └── Submission.js
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── postController.js
    │   └── codingController.js
    ├── routes/
    │   ├── auth.js
    │   ├── users.js
    │   ├── posts.js
    │   └── coding.js
    ├── middleware/
    │   └── auth.js
    ├── server.js
    ├── package.json
    └── .env.example
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create .env file**

   ```bash
   cp .env.example .env
   ```

4. **Configure .env**

   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/campusxconnect
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the backend server**

   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create .env.local file**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure .env.local**

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Users

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile/update` - Update user profile
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/follow/:id` - Follow a user
- `POST /api/users/unfollow/:id` - Unfollow a user

### Posts

- `POST /api/posts/createPost` - Create a new post
- `GET /api/posts/feed` - Get feed with pagination
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts/like/:id` - Like a post
- `POST /api/posts/unlike/:id` - Unlike a post
- `POST /api/posts/comment/:id` - Comment on a post
- `GET /api/posts/comments/:id` - Get comments for a post
- `DELETE /api/posts/:id` - Delete a post
- `PUT /api/posts/:id` - Update a post

### Coding Practice

- `GET /api/coding/problems` - Get all problems
- `GET /api/coding/problems/:id` - Get specific problem
- `POST /api/coding/submit` - Submit a solution
- `GET /api/coding/submissions/:userId` - Get user submissions
- `GET /api/coding/leaderboard` - Get leaderboard

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User signs up/logs in
2. Server returns a JWT token
3. Token is stored in localStorage
4. Token is sent in Authorization header for protected routes
5. Server verifies token validity

## 🎨 Pages Overview

### Home Page (`/`)

- Hero section with call-to-action
- Feature highlights
- Navigation to login/signup or feed

### Signup Page (`/signup`)

- User registration form
- Email and password validation
- Automatic login after signup

### Login Page (`/login`)

- User login form
- Email and password validation

### Profile Page (`/profile`)

- Display user profile information
- Edit profile functionality
- Show followers/following count
- Display skills and social links

### Feed Page (`/feed`)

- Paginated list of all posts
- Like and comment functionality
- Navigate to create post
- Real-time feed updates

### Create Post Page (`/create-post`)

- Form to create new project posts
- Add tech stack
- Add GitHub link

### Coding Practice Page (`/coding`)

- List of coding problems
- Filter by difficulty
- Link to problem details
- Difficulty color indicators

### Problem Detail Page (`/coding/:id`)

- Problem description
- Test cases
- Code submission area
- Language selection
- Recent submissions display

### Leaderboard Page (`/leaderboard`)

- Ranked list of students
- Sorted by problems solved
- Display average runtime
- Medal indicators for top 3

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  profilePicture: String,
  college: String,
  branch: Enum,
  year: Number,
  skills: [String],
  bio: String,
  github: String,
  linkedin: String,
  followers: [ObjectId],
  following: [ObjectId],
  createdAt: Date
}
```

### Post Model

```javascript
{
  title: String,
  description: String,
  author: ObjectId (ref: User),
  techStack: [String],
  githubLink: String,
  likes: [ObjectId],
  comments: [ObjectId],
  collaborators: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model

```javascript
{
  content: String,
  author: ObjectId (ref: User),
  post: ObjectId (ref: Post),
  likes: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### CodingProblem Model

```javascript
{
  title: String,
  description: String,
  difficulty: Enum,
  category: String,
  testCases: [{ input: String, output: String }],
  submissions: [ObjectId],
  createdAt: Date
}
```

### Submission Model

```javascript
{
  user: ObjectId (ref: User),
  problem: ObjectId (ref: CodingProblem),
  code: String,
  language: String,
  status: String,
  runtime: Number,
  memory: Number,
  createdAt: Date
}
```

## 🔒 Security Features

- **Password Hashing**: Bcryptjs with 10 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: Middleware checks for valid tokens
- **CORS**: Enabled for frontend domain
- **Environment Variables**: Sensitive data in .env files

## 🚀 Production Deployment

### Backend (Heroku/Render)

1. Push code to GitHub
2. Connect to Heroku/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel)

1. Push code to GitHub
2. Connect to Vercel
3. Configure environment variables
4. Deploy

## 📝 Sample Data

To populate the database with sample data, create a seed script:

```bash
# In backend directory
node scripts/seed.js
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Check MongoDB URI in .env
- Ensure IP whitelist includes your machine
- Verify MongoDB cluster is running

### CORS Errors

- Check FRONTEND_URL in backend .env
- Ensure frontend URL matches in cors configuration

### Authentication Errors

- Clear localStorage and retry login
- Check JWT_SECRET matches between requests
- Verify token is being sent in Authorization header

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Happy Coding!** 🎉

Build amazing projects, connect with peers, and grow together on CampusXConnect!
