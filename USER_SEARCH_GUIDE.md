# User Search System - Complete Guide

## Overview

A **comprehensive search system** has been implemented for CampusXConnect that allows users to search for other students and professionals using multiple search formats and filters.

---

## Search Features

### ✅ Multiple Search Formats

1. **Simple Name Search**
   - Search by full name: `"John Doe"`
   - Search by partial name: `"John"`
   - Case-insensitive search

2. **Batch/Year Search**
   - Format: `"2024-John"` or `"John-2024"`
   - Format: `"4-John"` or `"John-4"` (year: 1-4)
   - Combines year and name

3. **Company Search**
   - Format: `"Google-John"` or `"John-Google"`
   - Search employees by company and name

4. **Roll Number Search**
   - Format: `"12345-John"` or `"John-12345"`
   - Combine roll number with name

5. **Advanced Filters**
   - Individual filters for Name, Batch, Branch, Company, Roll Number
   - Combine multiple filters at once

---

## How to Use

### Quick Search (Simple)

1. Click **🔍 Search** in navigation
2. Enter search query in one of these formats:
   - Name: `"John Doe"`
   - Batch + Name: `"2024-John"` or `"John-2024"`
   - Company + Name: `"Google-John"` or `"John-Google"`
   - Roll Number + Name: `"12345-John"` or `"John-12345"`
3. Click **Search** button
4. View results with profile cards

### Advanced Search

1. Click **Advanced Search** tab
2. Fill in one or more filters:
   - Name (optional)
   - Batch/Year (optional)
   - Branch (CSE, ECE, ME, etc.)
   - Company (optional)
   - Roll Number (optional)
3. Click **Search** button
4. View filtered results

### Browse All Users

1. Go to `/search` page
2. Results automatically show paginated list of all users
3. Use **Previous/Next** buttons to navigate pages

---

## File Structure

### Backend Files Created/Modified

**Models:**

- `models/User.js` - MODIFIED - Added `rollNumber` and `company` fields

**Controllers:**

- `controllers/searchController.js` - NEW - 3 functions:
  - `searchUsers()` - Flexible query search
  - `advancedSearch()` - Filter-based search
  - `getAllUsers()` - Paginated user list

**Routes:**

- `routes/search.js` - NEW - 3 endpoints
  - GET `/search` - Search with query
  - GET `/advanced` - Advanced search
  - GET `/all` - All users paginated

**Server:**

- `server.js` - MODIFIED - Added search route registration

### Frontend Files Created/Modified

**Pages:**

- `app/search/page.jsx` - NEW - Complete search page with 2 tabs
  - Quick Search tab
  - Advanced Search tab
  - Results grid view
  - Profile card display
  - Pagination support

**Components:**

- `components/Navigation.jsx` - MODIFIED - Added "🔍 Search" link
- `app/profile/page.jsx` - MODIFIED - Added rollNumber and company fields
- `app/profile/[id]/page.jsx` - MODIFIED - Display rollNumber and company

**Utilities:**

- `lib/api.js` - MODIFIED - Added `searchAPI` object

---

## API Endpoints

### Simple Search

```
GET /api/search/search?query=John%20Doe
GET /api/search/search?query=2024-John
GET /api/search/search?query=Google-John
GET /api/search/search?query=12345-John
```

**Response:**

```json
{
  "success": true,
  "count": 5,
  "results": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "batch": 4,
      "branch": "CSE",
      "company": "Google",
      "rollNumber": "12345",
      "profilePicture": "...",
      "bio": "...",
      "skills": ["React", "Node.js"],
      "college": "Dronacharya Group of Institutions",
      ...
    }
  ]
}
```

### Advanced Search

```
GET /api/search/advanced?name=John&batch=4&branch=CSE&company=Google
GET /api/search/advanced?name=John&rollNumber=12345
GET /api/search/advanced?company=Microsoft&branch=IT
```

**Parameters:**

- `name` - Search by name (partial match, case-insensitive)
- `batch` - Search by year (1-4)
- `branch` - Search by branch (CSE, ECE, ME, CIVIL, EE, IT, BT)
- `company` - Search by company (partial match)
- `rollNumber` - Search by roll number

**Response:**

```json
{
  "success": true,
  "count": 3,
  "results": [...]
}
```

### Get All Users

```
GET /api/search/all?page=1
```

**Response:**

```json
{
  "success": true,
  "currentPage": 1,
  "totalPages": 5,
  "totalUsers": 95,
  "users": [...]
}
```

---

## User Model Fields

### New Fields Added

```javascript
rollNumber: {
  type: String,
  default: "",
}

company: {
  type: String,
  default: "",
}
```

### Updated Profile Edit

Users can now edit:

- Name
- Bio
- Skills
- GitHub & LinkedIn URLs
- Branch
- Year
- **Roll Number** (NEW)
- **Company** (NEW)

---

## Frontend Components

### Search Page Structure

```
┌─ Search Page (/search)
│
├─ Header
│  ├─ Title: "Find Users"
│  └─ Subtitle
│
├─ Tab Navigation
│  ├─ Quick Search (default)
│  └─ Advanced Search
│
├─ Quick Search Form
│  ├─ Search input with examples
│  ├─ Search button
│  └─ Format help box
│
├─ Advanced Search Form
│  ├─ Name input
│  ├─ Batch dropdown
│  ├─ Branch dropdown
│  ├─ Company input
│  ├─ Roll Number input
│  ├─ Search button
│  └─ Clear Filters button
│
├─ Results Display
│  ├─ Result count
│  ├─ Grid of user cards
│  │  ├─ Profile picture
│  │  ├─ Name (clickable)
│  │  ├─ Email
│  │  ├─ Bio (truncated)
│  │  ├─ Year, Branch, Roll Number
│  │  ├─ Company
│  │  ├─ College
│  │  ├─ Skills (up to 3)
│  │  ├─ View Profile button
│  │  └─ Connection button (if authenticated)
│  │
│  └─ Pagination (for browse all)
│
└─ Empty State (no results)
```

### Search Result Card

```
┌─ User Card
│
├─ Profile Picture (link to profile)
├─ Name (link to profile, bold)
├─ Email
├─ Bio (max 2 lines)
├─ 📅 Year 4 • CSE
├─ 🎓 Roll: 12345
├─ 🏢 Google
├─ 🏫 Dronacharya Group
├─ Skills: [React] [Node.js] [Python] [+2 more]
├─
├─ View Profile button (blue)
└─ Connect button (Connection Button component)
    ├─ "Send Connection Request" (if not connected)
    └─ "Remove Connection" (if connected)
```

---

## Search Logic

### Simple Search Strategy

1. **If query contains dash (`-`)**
   - Parse as two parts: `[part1, part2]`
2. **Check number patterns**
   - Year search: `"4-John"` (1-4)
   - Roll number search: `"12345-John"`
3. **Matching logic**
   - Number + Name = Name + Year
   - Text + Text = Name + Company OR Name + Roll Number
   - Number + Number = Roll Number combinations

4. **If query has NO dash**
   - Simple name search first
   - If no results, try: rollNumber, company, email

5. **Sort results**
   - Exact/partial name matches first
   - Other field matches after

### Result Limiting

- Maximum 50 results per query
- Suggests refining search if too many results

---

## Example Searches

### Search by Name

```
Query: "john"
Finds: John Doe, John Smith, Johnson, etc.
```

### Search by Batch + Name

```
Query: "2024-john" or "john-2024"
Finds: John who is in year 2024 (4th year)
```

### Search by Company + Name

```
Query: "google-john" or "john-google"
Finds: John who works at Google
```

### Search by Roll Number + Name

```
Query: "12345-john" or "john-12345"
Finds: John with roll number 12345
```

### Advanced Search

```
Name: "john"
Batch: "4"
Branch: "CSE"
Company: "Google"
Result: 4th year CSE students named John working at Google
```

---

## Navigation Integration

### Search Link Location

- Users menu: **🔍 Search** (between Leaderboard and Connections)
- Admin menu: **🔍 Search** (next to Dashboard)
- Available to: All authenticated users and guests

### Usage Flow

```
Home Page
  ↓
Click "🔍 Search" in navigation
  ↓
Search Page (/search)
  ├─ Quick Search tab (default, shows all users)
  ├─ Enter search query
  ├─ Click Search
  ├─ View results
  ├─ Click View Profile → Goes to /profile/[userId]
  └─ Click Connect → Send connection request
       ↓
  Can Accept connection request
```

---

## Features Highlight

### ✅ Smart Parsing

- Automatically identifies search format
- Flexible dash separator
- Handles partial matches

### ✅ Multiple Search Methods

- Simple text search
- Structured format search (with dash)
- Advanced filter search
- Browse all users

### ✅ Quick Integration

- "View Profile" button links to user profile
- "Connect" button for authenticated users
- Connection status visible on profiles

### ✅ User-Friendly

- Clear examples in help text
- Format suggestions in UI
- Responsive card layout
- Pagination for browsing

### ✅ Performance

- Limited to 50 results per search
- Indexed fields for faster queries
- Efficient filtering

---

## Database Indexes

For optimal performance, these fields should be indexed:

- `name` (text index for full-text search)
- `email` (unique index)
- `rollNumber` (index for exact searches)
- `company` (index for searches)
- `year` (index for batch searches)

**To add indexes in MongoDB:**

```javascript
db.users.createIndex({ name: "text" });
db.users.createIndex({ rollNumber: 1 });
db.users.createIndex({ company: 1 });
```

---

## Security Considerations

✅ **Implemented:**

- Search excludes password field
- Public search (no auth required)
- Pagination limits excessive data retrieval
- Result limit (50 max)

⚠️ **Recommendations for Production:**

- Rate limit search requests (max 10/minute per IP)
- Log search queries for analytics
- Add CAPTCHA for excessive searches
- Implement caching for popular searches

---

## Testing the Feature

### Test 1: Simple Name Search

1. Go to `/search`
2. Enter: `"john"`
3. Should show all users with "john" in name

### Test 2: Batch + Name Search

1. Go to `/search`
2. Enter: `"4-john"` or `"john-2024"`
3. Should show 4th year students named John

### Test 3: Company + Name Search

1. Go to `/search`
2. Enter: `"google-john"` or `"john-google"`
3. Should show Johns working at Google

### Test 4: Advanced Search

1. Click "Advanced Search" tab
2. Fill: Name="john", Batch="4", Branch="CSE"
3. Click Search
4. Should show 4th year CSE students named John

### Test 5: Browse All Users

1. Go to `/search`
2. Default view shows all users
3. Use pagination to browse pages

---

## Troubleshooting

| Issue                     | Solution                                  |
| ------------------------- | ----------------------------------------- |
| No results                | Try partial name search or check spelling |
| Too many results          | Use advanced search with more filters     |
| Wrong format              | Check format examples in help box         |
| Connection button missing | Make sure you're logged in                |
| Pagination not working    | Refresh page, check total pages count     |

---

## Future Enhancements

1. **Search History** - Save recent searches
2. **Search Suggestions** - Auto-complete with popular searches
3. **Saved Searches** - Bookmark frequently used searches
4. **Advanced Reporting** - Batch hiring reports, alumni network analysis
5. **Search Analytics** - Most searched users/companies
6. **Profile Similarity** - "Similar profiles" suggestions
7. **Bulk Export** - Export search results as CSV

---

## Summary

**Status:** ✅ COMPLETE AND READY TO USE

**What's Implemented:**

- ✅ Simple name search
- ✅ Batch/year + name search
- ✅ Company + name search
- ✅ Roll number + name search
- ✅ Advanced filter search
- ✅ Browse all users (paginated)
- ✅ User profile cards with info
- ✅ Connection buttons on results
- ✅ Search in navigation
- ✅ Responsive design
- ✅ Error handling
- ✅ Empty states

**User Experience:**

- 🎯 Multiple search options for flexibility
- 📱 Mobile responsive design
- 🔗 Quick access to profiles and connections
- 📊 Clear display of user information
- 🔄 Smooth pagination
- 💡 Helpful examples and format guides

---

**Last Updated**: March 12, 2026
**Version**: 1.0
**Author**: AI Development Team
