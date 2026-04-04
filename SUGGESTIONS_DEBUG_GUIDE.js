// Suggestions Feature - Debug and Fix Verification Script
// Run this in Browser DevTools Console or as a Node.js script

console.log("🔍 CampusXConnect Suggestions Feature - Debug Guide\n");

// ============================================
// PART 1: VERIFY THE FIX
// ============================================

console.log("✅ FIXES APPLIED:\n");
console.log("1. Frontend - SuggestionsSection.jsx");
console.log("   ✓ Changed: response.success → response.data.success");
console.log("   ✓ Changed: response.suggestions → response.data.suggestions");
console.log("   ✓ Changed: response.unreadCount → response.data.unreadCount");
console.log("   ✓ Applied to: fetchSuggestions(), handleMarkAsRead(), handleDeleteSuggestion()\n");

console.log("2. Backend - suggestionController.js");
console.log("   ✓ Updated populate syntax for nested fields");
console.log("   ✓ Changed from: .populate('senderInfo.senderId', 'name email profilePicture')");
console.log("   ✓ Changed to: .populate({ path: 'senderInfo.senderId', select: 'name profilePicture email' })\n");

// ============================================
// PART 2: MANUAL TEST STEPS
// ============================================

console.log("🧪 MANUAL TESTING STEPS:\n");

const testSteps = [
  {
    step: 1,
    user: "User A (Sender)",
    action: "Log in",
    navigate: "http://localhost:3000/login",
  },
  {
    step: 2,
    user: "User A",
    action: "Go to User B's profile",
    navigate: "Click on another user's profile",
  },
  {
    step: 3,
    user: "User A",
    action: "Click 'Suggest' button",
    observe: "Modal should open",
  },
  {
    step: 4,
    user: "User A",
    action: "Type suggestion (min 10 chars)",
    text: 'e.g., "You should learn React.js"',
  },
  {
    step: 5,
    user: "User A",
    action: "Select a category",
    observe: "Should show skill_improvement, project_idea, etc.",
  },
  {
    step: 6,
    user: "User A",
    action: "Click 'Send Suggestion'",
    observe: "Modal closes, Toast: 'Suggestion sent successfully!'",
  },
  {
    step: 7,
    user: "User B (Receiver)",
    action: "Log in (in new browser/tab)",
    navigate: "http://localhost:3000/login",
  },
  {
    step: 8,
    user: "User B",
    action: "Go to own profile",
    navigate: "Click 'My Profile' or edit profile",
  },
  {
    step: 9,
    user: "User B",
    action: "Scroll down to 'Suggestions' section",
    observe: "Should see User A's suggestion card",
  },
  {
    step: 10,
    user: "User B",
    action: "Verify suggestion displays correctly",
    check: [
      "✓ User A's name visible",
      "✓ User A's profile picture visible",
      "✓ Suggestion text visible",
      "✓ Category badge visible",
      "✓ Timestamp visible",
      "✓ 'Mark as read' button visible (if not read)",
      "✓ 'Delete' button visible",
    ],
  },
];

testSteps.forEach((step) => {
  console.log(`Step ${step.step}: ${step.action} (${step.user})`);
  if (step.navigate) console.log(`   → Navigate: ${step.navigate}`);
  if (step.text) console.log(`   → Example: ${step.text}`);
  if (step.observe) console.log(`   ✓ Observe: ${step.observe}`);
  if (step.check) {
    console.log(`   ✓ Verify:`);
    step.check.forEach((c) => console.log(`     ${c}`));
  }
  console.log("");
});

// ============================================
// PART 3: BROWSER CONSOLE DEBUGGING
// ============================================

console.log("\n🔧 BROWSER CONSOLE DEBUGGING:\n");

console.log("When testing, open Browser DevTools (F12) and:");
console.log("");
console.log("1. Go to Network tab");
console.log("   ✓ Filter for 'suggestions'");
console.log("   ✓ Click 'Send Suggestion'");
console.log("   ✓ Look for: POST /api/suggestions/send");
console.log("   ✓ Status should be: 201");
console.log("   ✓ Response should include: { success: true, suggestion: {...} }\n");

console.log("2. Check Fetch Suggestions API");
console.log("   ✓ Refresh own profile");
console.log("   ✓ Look for: GET /api/suggestions/received/:userId");
console.log("   ✓ Status should be: 200");
console.log("   ✓ Response should have:");
console.log("      {");
console.log("        success: true,");
console.log("        suggestions: [...],");
console.log("        unreadCount: <number>,");
console.log("        totalSuggestions: <number>");
console.log("      }\n");

console.log("3. Check Console for Errors");
console.log("   ✓ Go to Console tab");
console.log("   ✓ Look for any red errors");
console.log("   ✓ Should NOT see:");
console.log("      - 'Cannot read property success of undefined'");
console.log("      - '404 Not Found'");
console.log("      - 'Unauthorized'\n");

// ============================================
// PART 4: COMMON ISSUES & FIXES
// ============================================

console.log("\n⚠️ TROUBLESHOOTING:\n");

const issues = [
  {
    issue: "Suggestions not appearing in UI",
    causes: [
      "userId passed to SuggestionsSection is wrong",
      "API endpoint not returning data",
      "Frontend component not re-rendering",
      "Backend populate not working",
    ],
    fix: [
      "Check Network tab - is API call made?",
      "Check API response - does it have suggestions?",
      "Add console.log in fetchSuggestions() to debug",
      "Verify userId === logged-in user ID",
    ],
  },
  {
    issue: "500 error on send suggestion",
    causes: [
      "Notification type not supported",
      "User not found in database",
      "Invalid receiverId format",
    ],
    fix: [
      "Check backend console for error message",
      "Verify both users exist in database",
      "Ensure receiverId is valid MongoDB ObjectId",
    ],
  },
  {
    issue: "API returns 200 but no data",
    causes: [
      "Suggestions collection empty",
      "receiverId doesn't match any suggestions",
      "Query filtering wrong",
    ],
    fix: [
      "Send a suggestion first, then check",
      "Log in as correct receiver user",
      "Verify receiverId in query === logged-in user ID",
    ],
  },
  {
    issue: "Mark as read / Delete not working",
    causes: [
      "Authorization check failing",
      "Suggestion ID invalid",
      "User not receiver",
    ],
    fix: [
      "Ensure logged-in user is the receiver",
      "Check API returns 403 if not authorized",
      "Verify suggestion exists in database",
    ],
  },
];

issues.forEach((item) => {
  console.log(`❌ Issue: ${item.issue}`);
  console.log(`   Possible Causes:`);
  item.causes.forEach((c) => console.log(`   • ${c}`));
  console.log(`   How to Fix:`);
  item.fix.forEach((f) => console.log(`   ✓ ${f}`));
  console.log("");
});

// ============================================
// PART 5: DATABASE VERIFICATION
// ============================================

console.log("\n💾 DATABASE VERIFICATION (MongoDB):\n");

console.log("Connect to your MongoDB and run:\n");

console.log("1. Check if suggestions were saved:");
console.log('   db.suggestions.find().pretty()\n');

console.log("2. Find suggestions for a specific user:");
console.log('   db.suggestions.find({ receiverId: ObjectId("USER_ID_HERE") }).pretty()\n');

console.log("3. Expected document structure:");
console.log(`
   {
     "_id": ObjectId("..."),
     "senderInfo": {
       "senderId": ObjectId("..."),
       "senderName": "User A Name",
       "senderProfilePicture": "url..."
     },
     "receiverId": ObjectId("..."),
     "suggestionText": "Your suggestion here",
     "category": "skill_improvement",
     "isRead": false,
     "createdAt": ISODate("2024-03-15T...")
   }\n`);

console.log("4. Verify the receiver can see their suggestions:");
console.log('   db.suggestions.find({ receiverId: ObjectId("RECEIVER_ID") }).count()\n');

// ============================================
// PART 6: EXPECTED RESULTS
// ============================================

console.log("\n✨ EXPECTED RESULTS AFTER FIX:\n");

console.log("✅ Suggestion Sending:");
console.log("   • POST /api/suggestions/send → 201 Created");
console.log("   • Toast: 'Suggestion sent successfully!'");
console.log("   • Data in database\n");

console.log("✅ Suggestion Fetching:");
console.log("   • GET /api/suggestions/received/:userId → 200 OK");
console.log("   • Response includes all suggestions for user");
console.log("   • unreadCount is accurate\n");

console.log("✅ Suggestion Display:");
console.log("   • Suggestions appear in 'Suggestions' section");
console.log("   • Sender name, picture, text, category visible");
console.log("   • Timestamp shows correctly\n");

console.log("✅ Suggestion Actions:");
console.log("   • Mark as read updates isRead flag");
console.log("   • Delete removes suggestion from database");
console.log("   • Both return 200 OK\n");

// ============================================
// FINAL SUMMARY
// ============================================

console.log("=" .repeat(50));
console.log("🎯 SUMMARY");
console.log("=" .repeat(50));

console.log(`
The issue was that the SuggestionsSection component was checking
'response.success' directly from the Axios response, but Axios
wraps the actual response data in a 'data' property.

BEFORE (broken):
  const response = await suggestionAPI.getUserSuggestions(userId);
  if (response.success) { ... }  // ❌ undefined

AFTER (fixed):
  const response = await suggestionAPI.getUserSuggestions(userId);
  if (response.data.success) { ... }  // ✅ works

This fix has been applied to:
• fetchSuggestions()
• handleMarkAsRead()
• handleDeleteSuggestion()

Backend endpoint also updated for better populate syntax.

Now suggestions should appear correctly when User B opens their profile!
`);

console.log("For more help, check the browser Network tab");
console.log("or backend console for detailed error messages.\n");
