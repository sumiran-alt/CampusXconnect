# 📬 Notifications & Suggestions System Guide

## Overview

This guide covers the complete **Notifications** and **Suggestions** system implemented in CampusXConnect. These features enhance user engagement by keeping users informed of connection activities and discovering new people to connect with.

---

## Table of Contents

1. [Notifications System](#notifications-system)
2. [Suggestions System](#suggestions-system)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [API Endpoints](#api-endpoints)
6. [Features](#features)
7. [File Structure](#file-structure)
8. [How It Works](#how-it-works)
9. [Testing Guide](#testing-guide)
10. [Security Considerations](#security-considerations)

---

## Notifications System

### What Are Notifications?

Notifications inform users about important activities in their network:

- **Connection Requests**: Someone sent you a connection request
- **Connection Accepted**: Someone accepted your connection request
- **Connection Removed**: Someone removed you from their connections

### Key Features

✅ **Real-time Notifications** - Instant creation when actions occur
✅ **Read/Unread Status** - Track which notifications user has seen
✅ **Pagination** - Load notifications in batches of 20
✅ **Unread Count Badge** - Navigation shows unread count
✅ **Mark as Read** - Individual or bulk marking
✅ **Delete Notifications** - Users can remove notifications
✅ **Sender Information** - See who sent the notification

### Notification Types

| Type                | Trigger                         | Message                                     |
| ------------------- | ------------------------------- | ------------------------------------------- |
| CONNECTION_REQUEST  | User sends connection request   | "{Name} sent you a connection request"      |
| CONNECTION_ACCEPTED | User accepts connection request | "{Name} accepted your connection request"   |
| CONNECTION_REMOVED  | User removes connection         | "{Name} removed you from their connections" |

---

## Suggestions System

### What Are Suggestions?

Suggestions are personalized recommendations for users to connect with:

1. **Personal Recommendations** - Based on mutual connections and profile similarity
2. **Trending in Your Branch** - Most connected users in your branch/department
3. **Profile-Specific Suggestions** - When viewing other profiles, see their connections

### Scoring Algorithm

**Personal Recommendations** use a weighted score:

```
Score = (Branch Match × 2) + (Year Match × 3) + (Mutual Connections × 5)
```

- **Branch Match (2 points)**: Same department/branch
- **Year Match (3 points)**: Same year/batch
- **Mutual Connections (5 points each)**: People you both know

Higher score = Better recommendation shown first.

### Filtering Rules

Suggestions exclude:

- ✗ Current user (self)
- ✗ Already connected users
- ✗ Users with pending connection requests
- ✗ Inactive users
- ✗ Users at limit of 50 results

---

## Backend Implementation

### Database Models

#### Notification Model

```javascript
{
  recipient: ObjectId,        // User receiving notification
  sender: ObjectId,           // User who triggered action
  type: String,               // CONNECTION_REQUEST, CONNECTION_ACCEPTED, etc.
  title: String,              // "John sent you a request"
  message: String,            // Full notification message
  link: String,               // Where to go when clicked (optional)
  isRead: Boolean,            // Read status
  readAt: Date,               // When marked as read
  createdAt: Date,            // Auto timestamp
  updatedAt: Date             // Auto timestamp
}
```

**Indexes:**

```javascript
{ recipient: 1, isRead: 1, createdAt: -1 }
```

### Controllers

#### NotificationController (`controllers/notificationController.js`)

**Functions:**

| Function                             | Purpose                                   | Auth   |
| ------------------------------------ | ----------------------------------------- | ------ |
| `getUnreadNotifications()`           | Get all unread notifications              | ✅ Yes |
| `getAllNotifications()`              | Get paginated notifications (20 per page) | ✅ Yes |
| `markAsRead(notificationId)`         | Mark single notification as read          | ✅ Yes |
| `markAllAsRead()`                    | Mark all unread as read                   | ✅ Yes |
| `deleteNotification(notificationId)` | Remove notification                       | ✅ Yes |
| `getUnreadCount()`                   | Get count of unread notifications         | ✅ Yes |

#### SuggestionController (`controllers/suggestionController.js`)

**Functions:**

| Function                               | Purpose                       | Returns                                   |
| -------------------------------------- | ----------------------------- | ----------------------------------------- |
| `getSuggestions(limit)`                | Personalized recommendations  | Array of users + mutual connections count |
| `getSuggestionsForUser(userId, limit)` | Suggestions from profile page | Array of target user's connections        |
| `getTrendingSuggestions(limit)`        | Most connected in branch      | Array of users + connection count         |

### Connection Controller Updates

Connection actions now trigger notifications:

```javascript
// When sending connection request
→ Creates CONNECTION_REQUEST notification

// When accepting connection request
→ Creates CONNECTION_ACCEPTED notification

// When removing connection
→ Creates CONNECTION_REMOVED notification
```

---

## Frontend Implementation

### API Library (`lib/api.js`)

#### Notification API

```javascript
export const notificationAPI = {
  getUnread: () => api.get("/notifications/unread"),
  getAll: (page = 1, limit = 20) => api.get(`/notifications?...`),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  markAsRead: (notificationId) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read/all"),
  delete: (notificationId) => api.delete(`/notifications/${id}`),
};
```

#### Suggestion API

```javascript
export const suggestionAPI = {
  getSuggestions: (limit = 5) => api.get(`/suggestions?limit=...`),
  getSuggestionsForUser: (userId, limit = 5) => ...,
  getTrendingSuggestions: (limit = 10) => ...,
};
```

### Pages

#### Notifications Page (`app/notifications/page.jsx`)

**Features:**

- ✅ View all notifications
- ✅ Filter by: All / Unread / Read
- ✅ Mark individual as read (on click)
- ✅ Mark all as read (button)
- ✅ Delete notifications
- ✅ Pagination (20 per page)
- ✅ Notification icons by type
- ✅ Timestamps with read status

**UI Elements:**

```jsx
Filter Buttons:
- All (default)
- Unread
- Read
- Mark all as read (if unread filter)

Notification Cards:
- Icon (👤 request, ✅ accepted, ❌ removed)
- Title and message
- Timestamp + read timestamp
- Delete button
- Click to mark as read and navigate
```

#### Suggestions Page (`app/suggestions/page.jsx`)

**Features:**

- ✅ Two tabs: Recommendations / Trending
- ✅ Personalized scoring algorithm
- ✅ Profile pictures with fallback
- ✅ Profile card with all user info
- ✅ Mutual connections count
- ✅ Connection button
- ✅ View Profile button
- ✅ Skill tags (first 3 + count)
- ✅ Branch/year filtering
- ✅ Empty state with helpful message

**Recommendations Tab:**

```
Shown Users:
- By Score (mutual connections first)
- Same branch/year
- Not connected
- No pending requests
- Limit: 10 results
```

**Trending Tab:**

```
Shown Users:
- Most connections in your branch
- Not connected to current user
- Sorted by connection count
- Limit: 10 results
```

### Navigation Component Updates

**New Links Added:**

```jsx
User Navigation:
- 💡 Suggestions → /suggestions
- 🔔 Notifications → /notifications
  (with unread count badge if > 0)

Admin Navigation:
- 💡 Suggestions → /suggestions
- 🔔 Notifications → /notifications
  (with unread count badge)
```

**Badge Logic:**

```javascript
// Fetched every 30 seconds
- Pending connections count (existing)
- Unread notifications count (new)

Badge appears if count > 0 with red circle badge
```

---

## API Endpoints

### Notification Endpoints

All require authentication.

#### Get Unread Notifications

```
GET /api/notifications/unread
Response: {
  success: true,
  count: 5,
  notifications: [ Notification[] ]
}
```

#### Get All Notifications (Paginated)

```
GET /api/notifications?page=1&limit=20
Response: {
  success: true,
  count: 20,
  total: 45,
  pages: 3,
  currentPage: 1,
  notifications: [ Notification[] ]
}
```

#### Get Unread Count

```
GET /api/notifications/unread-count
Response: {
  success: true,
  unreadCount: 3
}
```

#### Mark as Read

```
PUT /api/notifications/:notificationId/read
Response: {
  success: true,
  notification: { ...updated notification }
}
```

#### Mark All as Read

```
PUT /api/notifications/read/all
Response: {
  success: true,
  message: "All notifications marked as read",
  updated: 5
}
```

#### Delete Notification

```
DELETE /api/notifications/:notificationId
Response: {
  success: true,
  message: "Notification deleted"
}
```

### Suggestion Endpoints

All require authentication.

#### Get Personal Recommendations

```
GET /api/suggestions?limit=5
Response: {
  success: true,
  count: 5,
  suggestions: [
    {
      _id: "userId",
      name: "John Doe",
      profilePicture: "url",
      bio: "...",
      branch: "CSE",
      year: 4,
      skills: ["Node.js", "React"],
      company: "Google",
      mutualConnections: 2,
      profileScore: 17
    }
  ]
}
```

#### Get Trending in Your Branch

```
GET /api/suggestions/trending?limit=10
Response: {
  success: true,
  count: 8,
  suggestions: [
    {
      _id: "userId",
      name: "Jane Smith",
      profilePicture: "url",
      branch: "CSE",
      year: 3,
      skills: ["Python", "Django"],
      connectionCount: 45
    }
  ]
}
```

#### Get Suggestions for a User Profile

```
GET /api/suggestions/user/:profileUserId?limit=5
Response: {
  success: true,
  profileUser: { _id, name },
  mutualConnections: 3,
  count: 5,
  suggestions: [
    {
      _id: "userId",
      name: "Friend Name",
      ...
      mutualWithProfileUser: 2,
      relevanceScore: 12
    }
  ]
}
```

---

## Features

### Notification Features

- ✅ **Auto-creation** - Notifications created instantly on actions
- ✅ **Read Tracking** - Know which notifications user has seen
- ✅ **Batch Operations** - Mark all as read in one click
- ✅ **Smart Deletion** - Individual notification removal
- ✅ **Pagination** - Load 20 at a time for performance
- ✅ **Unread Badge** - Shows in navigation as red circle
- ✅ **Email Ready** - Structure supports email notifications (future)
- ✅ **Responsive** - Works on mobile and desktop

### Suggestion Features

- ✅ **Smart Scoring** - Weighted algorithm for relevance
- ✅ **Mutual Connections** - See how many people you both know
- ✅ **Branch Trending** - Most connected in your department
- ✅ **Profile-Based** - Different suggestions per profile
- ✅ **Filtering** - Excludes already connected and pending
- ✅ **Limit Controls** - Max 50 results per query
- ✅ **Profile Cards** - Rich user information display
- ✅ **One-Click Connect** - Connect directly from suggestions
- ✅ **Responsive Grid** - 3 columns desktop, 1 column mobile

---

## File Structure

```
backend/
├── models/
│   └── Notification.js          # Notification schema
├── controllers/
│   ├── notificationController.js # Notification business logic
│   └── suggestionController.js  # Suggestion algorithm
├── routes/
│   ├── notifications.js         # Notification endpoints
│   └── suggestions.js           # Suggestion endpoints
└── server.js                    # Routes registered

frontend/
├── app/
│   ├── notifications/
│   │   └── page.jsx            # Notifications hub page
│   └── suggestions/
│       └── page.jsx            # Suggestions discovery page
├── components/
│   └── Navigation.jsx           # Updated with new links & badges
└── lib/
    └── api.js                   # API endpoints for both features
```

---

## How It Works

### Notification Flow

```
User Action
    ↓
Connection Controller
    ↓
Create Notification in DB
    ↓
Frontend Fetches on Navigation Load
    ↓
Badge Shows Unread Count (refreshes every 30s)
    ↓
User Clicks 🔔 → Goes to /notifications
    ↓
Sees all notifications with filters
    ↓
Can Mark as Read / Delete / Click to navigate
```

### Suggestion Flow

```
User Visits /suggestions
    ↓
Frontend Calls suggestionAPI.getSuggestions()
    ↓
Backend Aggregation Pipeline:
1. Find all users not in connection list
2. Calculate mutual connections
3. Score by: branch (2) + year (3) + mutual (5 each)
4. Sort by score descending
5. Limit to 5-10 results
    ↓
Display User Cards with Info
    ↓
User Can:
- Connect (via ConnectionButton)
- View Profile
- Switch to Trending tab
```

### Real-time Badge Updates

```
Navigation Loads
    ↓
Fetch getPendingRequests() count
Fetch getUnreadCount() count
    ↓
Every 30 seconds:
- Re-fetch both counts
- Update badges if changed
    ↓
User navigates:
- To /notifications → Fetch fresh
- To /connections → Fetch fresh
- To /suggestions → Show suggestions
```

---

## Testing Guide

### 1. Test Notifications Creation

**Setup:**

- Create 2 test accounts: User A and User B
- Login as User A

**Test Case 1: Connection Request Notification**

```
1. Go to /search
2. Search for User B
3. Click "Connect" button
4. Verify:
   ✓ Button changes to "Pending"
5. Login as User B (new tab)
6. Check Navigation badge - should show "1"
7. Click 🔔 Notifications
8. Verify:
   ✓ See notification "User A sent you a connection request"
   ✓ Type should be CONNECTION_REQUEST
   ✓ Notification is unread (blue highlight)
```

**Test Case 2: Connection Accepted Notification**

```
1. User B in notifications, click accept
2. Wait 2 seconds
3. Switch to User A's tab
4. Refresh page or wait 30 seconds
5. Check badge - should show "1"
6. Click 🔔 Notifications
7. Verify:
   ✓ See "User B accepted your connection request"
   ✓ Type is CONNECTION_ACCEPTED
```

**Test Case 3: Connection Removed Notification**

```
1. User A goes to connections
2. Find User B
3. Click "Remove Connection"
4. Switch to User B's tab
5. Refresh or wait 30 seconds
6. Badge should update
7. Check notifications
8. Verify:
   ✓ See "User A removed the connection"
   ✓ Type is CONNECTION_REMOVED
```

### 2. Test Notification Features

**Scenario: Batch Operations**

```
1. Create multiple notifications (5+)
2. Click "Mark all as read"
3. Verify:
   ✓ All turn from blue to white
   ✓ Count decreases to 0 in badge
   ✓ API call successful
```

**Scenario: Delete Notification**

```
1. In notifications page
2. Hover over any card
3. Click trash icon
4. Verify:
   ✓ Notification disappears
   ✓ Toast "Notification deleted"
```

**Scenario: Filter By Status**

```
1. Have mix of read/unread
2. Click "Unread" filter
3. Verify: Only unread shown
4. Click "Read" filter
5. Verify: Only read shown
6. Click "All" filter
7. Verify: All shown
```

### 3. Test Suggestions

**Test Case 1: Personal Recommendations**

```
Setup: 3 users in same branch, different connections
- User A, User B (connected to 5 people in same branch)
- User C, User D (not connected to User A)

Flow:
1. Login as User A
2. Go to /suggestions
3. Active tab should be "Recommendations"
4. Verify:
   ✓ See User C and User D
   ✓ Shows mutual connections (3-5 suggested)
   ✓ Sorted by score (most mutual first)
   ✓ User B NOT shown (already connected)
   ✓ Can click "Connect"
   ✓ Can click "View Profile"
```

**Test Case 2: Trending in Branch**

```
Setup: Multiple users in CSE branch
- User A (50 connections)
- User B (30 connections)
- User C (20 connections)

Flow:
1. Login and go to /suggestions
2. Click "Trending in Your Branch" tab
3. Verify:
   ✓ See users sorted by connection count (A, B, C order)
   ✓ Shows connection count (50, 30, 20)
   ✓ Sorted descending
   ✓ Other branches NOT shown
```

**Test Case 3: Profile-Based Suggestions**

```
Setup: Viewing User B's profile
- User B has 10 connections
- You're connected to 3 of them

Flow:
1. View /profile/[User B's ID]
2. Scroll down or look for suggestions section
3. Or go to /suggestions?userId=B
4. Verify:
   ✓ See User B's connections
   ✓ Shows mutual connection count (3)
   ✓ Only shows their connections, not all users
   ✓ Can connect to suggestions
```

### 4. Test Navigation Badges

**Scenario: Multiple Unread Items**

```
1. Create 3 connection requests in pending
2. Receive 2 new notifications
3. Check navigation
4. Verify:
   ✓ Connections badge shows "3"
   ✓ Notifications badge shows "2"
   ✓ Both update in real-time
   ✓ Badges disappear when count = 0
```

### 5. Performance Tests

**Test: Pagination**

```
1. Have 100+ notifications
2. /notifications page should load first 20
3. Click "Next"
4. Verify: Page 2 shows different 20
5. Click "Previous"
6. Verify: Back to page 1 (same 20)
```

**Test: Suggestion Limit**

```
1. Have 50+ users in system
2. Recommendations should limit to 10
3. Verify: List stops at 10 results
4. Trending should limit to 10
```

---

## Security Considerations

### ✅ Implemented

1. **Authentication Required** - All endpoints need valid JWT token
2. **User Isolation** - Can only see own notifications
3. **Ownership Verification** - Can only delete own notifications
4. **Data Filtering** - Passwords excluded from suggestions
5. **Result Limiting** - Max 50 results per query
6. **Rate Limiting Ready** - Structure supports rate limiting

### 🔒 Recommendations for Production

1. **Email Notifications** - Implement email digests for important notifications
2. **Rate Limiting** - Add rate limiter to prevent spam
3. **Notification Expiry** - Auto-delete old notifications after 30 days
4. **Privacy Settings** - Let users control suggestion visibility
5. **Audit Logging** - Log notification creation for compliance
6. **Spam Detection** - Monitor for bulk connection requests

---

## Troubleshooting

### Issue: Badge not updating

**Solution:**

- Check browser console for API errors
- Verify token is valid in localStorage
- Check if notificationAPI.getUnreadCount() returns error
- Reload page to refresh

### Issue: Suggestions not showing

**Solution:**

- Verify user has connections if testing personal recommendations
- Check if user is in same branch for trending
- Try alternative tab (Recommendations ↔ Trending)
- Check API response in browser DevTools

### Issue: Notification not created

**Solution:**

- Check backend logs for errors in notificationController
- Verify Notification model exists in MongoDB
- Check connection action completes successfully
- Look at network tab to see API responses

### Issue: Can't connect from suggestions

**Solution:**

- Ensure user is authenticated (token in localStorage)
- Check if already connected or request pending
- Try refreshing and retrying
- Check ConnectionButton component state

---

## Future Enhancements

1. **Real-time Updates** - WebSocket for instant notifications
2. **Email Digests** - Daily/weekly summary emails
3. **Push Notifications** - Browser/mobile push alerts
4. **Notification Preferences** - Control what users notify about
5. **Smart Suggestions** - ML-based recommendations
6. **Trending Across Platform** - Global trending (not just branch)
7. **Notification Threading** - Group by connection
8. **Archive Feature** - Save important notifications
9. **Search Notifications** - Find past notifications
10. **Undo Actions** - Revert connection removals (30-min window)

---

## Summary

The **Notifications & Suggestions System** provides:

✅ **Real-time notifications** for all connection events
✅ **Smart recommendations** using weighted scoring algorithm
✅ **Trending discovery** based on your branch/field
✅ **Unread tracking** with visual badges
✅ **Full user control** over notifications
✅ **Responsive design** on all devices
✅ **Production-ready** code and APIs

**Status**: ✅ COMPLETE - Ready for deployment

---

## Support

For issues or questions:

1. Check this guide's troubleshooting section
2. Review the testing guide for validation
3. Check browser console for error messages
4. Examine backend logs for server errors
5. Test with fresh accounts to rule out data issues
