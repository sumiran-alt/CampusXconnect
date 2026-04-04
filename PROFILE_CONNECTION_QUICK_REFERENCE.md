# User Profile & Connection System - Quick Reference Guide

## Quick Links & Routes

### Frontend Routes
| Route | Component | Purpose |
|-------|-----------|---------|
| `/feed` | `feed/page.jsx` | Main feed with clickable profiles |
| `/profile` | `profile/page.jsx` | Own profile management |
| `/profile/:id` | `profile/[id]/page.jsx` | Other user's profile view |
| `/messages/:userId` | `messages/[userId]/page.jsx` | Direct messaging |

### API Endpoints Quick Reference

#### Connection Endpoints
```
SEND REQUEST:        POST /api/connections/request/:toUserId
VIEW PENDING:        GET /api/connections/pending
VIEW SENT:           GET /api/connections/sent
ACCEPT REQUEST:      PUT /api/connections/request/:requestId/accept
REJECT REQUEST:      PUT /api/connections/request/:requestId/reject
CANCEL REQUEST:      DELETE /api/connections/request/:requestId/cancel
GET MY CONNECTIONS:  GET /api/connections/my
REMOVE CONNECTION:   DELETE /api/connections/:userId
CHECK STATUS:        GET /api/connections/:userId/status
GET USER'S CONNS:    GET /api/connections/:userId
GET MUTUAL CONNS:    GET /api/connections/mutual/:userId
```

#### Post Endpoints
```
GET USER'S POSTS:    GET /api/posts/user/:userId?page=1
GET FEED:            GET /api/posts/feed?page=1
LIKE POST:           POST /api/posts/like/:id
COMMENT:             POST /api/posts/comment/:id
GET COMMENTS:        GET /api/posts/comments/:id
```

#### User Endpoints
```
GET USER PROFILE:    GET /api/users/:id
GET MY PROFILE:      GET /api/users/profile
UPDATE PROFILE:      PUT /api/users/profile/update
FOLLOW USER:         POST /api/users/follow/:id
UNFOLLOW USER:       POST /api/users/unfollow/:id
```

---

## Frontend API Usage

### Import API Functions
```javascript
import { userAPI, connectionAPI, postAPI, messageAPI } from "@/lib/api";
```

### Getting User Profile
```javascript
const response = await userAPI.getUserById(userId);
const user = response.data.user;
```

### Sending Connection Request
```javascript
await connectionAPI.sendRequest(targetUserId);
// Returns: { success: true, request: {...} }
```

### Getting User Posts
```javascript
const response = await postAPI.getUserPostsById(userId, page);
const posts = response.data.posts;
const totalPages = response.data.totalPages;
```

### Getting Mutual Connections
```javascript
const response = await connectionAPI.getMutualConnections(userId);
const mutualConns = response.data.mutualConnections;
const count = response.data.count;
```

### Checking Connection Status
```javascript
const response = await connectionAPI.checkConnectionStatus(userId);
console.log(response.data.status); // "connected", "not_connected"
```

### Accepting Connection Request
```javascript
await connectionAPI.acceptRequest(requestId);
```

### Removing Connection
```javascript
await connectionAPI.removeConnection(userId);
```

---

## Component Usage

### ConnectionButton Component
```jsx
import ConnectionButton from "@/components/ConnectionButton";

<ConnectionButton 
  userId={targetUserId} 
  onStatusChange={(status) => console.log(status)}
/>
```

**Props:**
- `userId`: Target user's ID
- `onStatusChange` (optional): Callback when status changes

**Button States:**
- "Send Connection Request"
- "Pending - Cancel Request"
- "Remove Connection"

---

### FollowButton Component
```jsx
import FollowButton from "@/components/FollowButton";

<FollowButton 
  userId={targetUserId}
  onFollowChange={(isFollowing) => console.log(isFollowing)}
/>
```

**Props:**
- `userId`: Target user's ID
- `onFollowChange` (optional): Callback when follow status changes

---

### ProfileSkeleton Component
```jsx
import ProfileSkeleton from "@/components/ProfileSkeleton";

if (loading) {
  return <ProfileSkeleton />;
}
```

---

## Common Implementation Patterns

### Fetch User Profile with Related Data
```javascript
const fetchUserProfile = async () => {
  try {
    // Fetch profile
    const userRes = await userAPI.getUserById(id);
    setProfile(userRes.data.user);
    
    // Fetch connections count
    const connRes = await connectionAPI.getUserConnections(id);
    setConnectionCount(connRes.data.count);
    
    // Fetch posts
    const postsRes = await postAPI.getUserPostsById(id, 1);
    setPosts(postsRes.data.posts);
    
    // Fetch mutual connections
    const mutualRes = await connectionAPI.getMutualConnections(id);
    setMutualConnections(mutualRes.data.mutualConnections);
  } catch (error) {
    toast.error("Error loading profile");
  }
};
```

### Handle Navigation to Profile
```javascript
// From feed or any component
import Link from "next/link";

<Link href={`/profile/${userId}`}>
  <img src={profilePic} alt="profile" />
  <span>{userName}</span>
</Link>
```

### Handle Connection Request
```javascript
const handleSendRequest = async () => {
  try {
    await connectionAPI.sendRequest(userId);
    setStatus("request_sent");
    toast.success("Connection request sent!");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};
```

### Navigate to Message
```javascript
const handleMessage = () => {
  router.push(`/messages/${userId}`);
};
```

---

## State Management Pattern

Using Zustand for auth store:
```javascript
import { useAuthStore } from "@/lib/store";

const { user, isAuthenticated } = useAuthStore();

// Check if viewing own profile
const isOwnProfile = user?.id === viewedUserId;
```

---

## Error Handling Pattern

```javascript
try {
  const response = await connectionAPI.sendRequest(userId);
  toast.success("Request sent!");
} catch (error) {
  console.error("Error:", error);
  
  if (error.response?.status === 404) {
    toast.error("User not found");
  } else if (error.response?.status === 400) {
    toast.error(error.response?.data?.message);
  } else {
    toast.error("Something went wrong");
  }
}
```

---

## Data Flow Diagram

```
Feed Component
    ↓
    ├─ User clicks profile → Router push to /profile/:id
    │
Profile Component
    ↓
    ├─ Fetch user data → GET /api/users/:id
    ├─ Fetch connections → GET /api/connections/:id
    ├─ Fetch posts → GET /api/posts/user/:id
    └─ Fetch mutual → GET /api/connections/mutual/:id
    ↓
Display Profile
    ├─ Connection Button
    │  ├─ Check status → GET /api/connections/:id/status
    │  ├─ Send request → POST /api/connections/request/:id
    │  ├─ Accept → PUT /api/connections/request/:requestId/accept
    │  └─ Remove → DELETE /api/connections/:id
    │
    ├─ Follow Button
    │  ├─ Check status
    │  ├─ Follow → POST /api/users/follow/:id
    │  └─ Unfollow → POST /api/users/unfollow/:id
    │
    ├─ Message Button → Router push to /messages/:id
    │
    ├─ Mutual Connections → Click to /profile/:mutualId
    │
    └─ User Posts → Display from fetched data
```

---

## Button States & Transitions

```
┌──────────────────┐
│  Not Connected   │
│ (Send Request)   │
└─────────┬────────┘
          │ Click
          ↓
┌──────────────────┐
│ Request Pending  │
│ (Cancel Request) │
└─────────┬────────┘
          │
     ┌─────┴──────┐
     │             │
     ↓ Accept      ↓ Reject
┌──────────┐  ┌──────────────┐
│Connected │  │ Not Connected│
│ (Remove) │  │(Send Request)│
└──────────┘  └──────────────┘
```

---

## File Checklist

### Frontend Files
- ✅ `frontend/lib/api.js` - API endpoints (added `getUserPostsById`, `getMutualConnections`)
- ✅ `frontend/app/feed/page.jsx` - Feed with profile links
- ✅ `frontend/app/profile/[id]/page.jsx` - Profile page (updated with posts & mutual conns)
- ✅ `frontend/components/ConnectionButton.jsx` - Connection logic
- ✅ `frontend/components/FollowButton.jsx` - Follow logic
- ✅ `frontend/components/ProfileSkeleton.jsx` - Loading skeleton (new)

### Backend Files
- ✅ `backend/controllers/userController.js` - User endpoints
- ✅ `backend/controllers/connectionController.js` - Connection logic
- ✅ `backend/controllers/postController.js` - Posts including `getUserPostsById`
- ✅ `backend/routes/users.js` - User routes
- ✅ `backend/routes/connections.js` - Connection routes
- ✅ `backend/routes/posts.js` - Post routes
- ✅ `backend/models/User.js` - User schema with connections
- ✅ `backend/models/ConnectionRequest.js` - Connection request model

### Documentation Files
- ✅ `PROFILE_CONNECTION_SYSTEM_GUIDE.md` - Complete documentation
- ✅ `PROFILE_CONNECTION_QUICK_REFERENCE.md` - This file

---

## Testing Tips

### Test Connection Request
1. Log in as User A
2. Navigate to User B's profile
3. Click "Send Connection Request"
4. Log in as User B (new session/incognito)
5. Should see connection request notification
6. Accept request
7. Check if both users show "Connected"

### Test Profile View
1. Click on any profile from feed
2. Verify profile data loads
3. Check if own profile shows Edit button
4. Check if other profiles show Connection/Follow/Message buttons
5. Verify posts and mutual connections display

### Test Messaging
1. Connected with another user
2. Click "Message" button on their profile
3. Should navigate to `/messages/:userId`
4. Should load chat history

### Test Mobile Responsive
1. Open DevTools (F12)
2. Toggle device toolbar
3. Select mobile device
4. Check if layout adjusts properly
5. Verify buttons and text are readable

---

## Performance Tips

1. **Parallel API Calls**: Use `Promise.all()` for independent requests
2. **Pagination**: Only load 10 posts per page
3. **Image Optimization**: Use CSS `object-cover` for thumbnails
4. **Skeleton Loading**: Show skeleton while fetching
5. **Debouncing**: On search inputs
6. **Lazy Loading**: Conditional rendering of sections

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Profile not loading | Check user ID in URL, verify API endpoint |
| Connection button stuck | Clear localStorage, refresh page |
| Posts not showing | Check post privacy settings, verify author |
| Mutual connections empty | Ensure you have common connections |
| Styling issues | Clear `.next` cache and rebuild |
| API 404 errors | Verify user exists in database |
| Auth token expired | Login again, check token in localStorage |

---

## Quick Testing with Curl

```bash
# Get user profile
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/users/:userId

# Send connection request
curl -X POST -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/connections/request/:userId

# Get mutual connections
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/connections/mutual/:userId

# Get user posts
curl http://localhost:5000/api/posts/user/:userId?page=1
```

---

## References

- Main Documentation: `PROFILE_CONNECTION_SYSTEM_GUIDE.md`
- API Routes: `backend/routes/`
- Components: `frontend/components/`
- Hooks: `frontend/lib/store.js`

---

## Version: 1.0.0
**Status: Production Ready** ✅
**Last Updated: March 15, 2026**
