// Automated API Tests for Suggestions Feature
// Usage: Run after both backend and frontend servers are running
// axios-based tests that can be run manually or with Jest

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test user data (create these first)
const testUsers = {
  userA: {
    id: 'USER_A_ID_HERE',
    token: 'TOKEN_A_HERE',
    name: 'Test User A'
  },
  userB: {
    id: 'USER_B_ID_HERE',
    token: 'TOKEN_B_HERE',
    name: 'Test User B'
  }
};

const testSuggestions = {
  valid: {
    text: 'You should definitely learn TypeScript for better type safety',
    category: 'skill_improvement'
  },
  shortText: 'short',
  longText: 'a'.repeat(501),
  emptyText: '',
  whitespace: '     ',
  validCategories: [
    'skill_improvement',
    'project_idea',
    'career_advice',
    'collaboration',
    'other'
  ]
};

// Test Results Tracker
const results = {
  passed: 0,
  failed: 0,
  errors: [],
  tests: []
};

// Helper function for API calls
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      ...(data && { data }),
      ...(token && { headers: { Authorization: `Bearer ${token}` } })
    };
    return await axios(config);
  } catch (error) {
    return error.response;
  }
}

// Test function wrapper
async function test(name, fn) {
  try {
    await fn();
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
    console.log(`✅ ${name}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
    results.errors.push({ test: name, error: error.message });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

// Assertion helpers
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message} - Expected: ${expected}, Actual: ${actual}`);
  }
}

function assertStatusCode(response, expectedCode, message) {
  if (response.status !== expectedCode) {
    throw new Error(`${message} - Expected status ${expectedCode}, got ${response.status}`);
  }
}

// ============================================
// TEST SUITE START
// ============================================

async function runAllTests() {
  console.log('\n🚀 Starting Suggestions Feature API Tests\n');
  console.log('📝 Test Configuration:');
  console.log(`   API Base: ${API_BASE}`);
  console.log(`   User A: ${testUsers.userA.id}`);
  console.log(`   User B: ${testUsers.userB.id}\n`);

  // TEST 1: Successful Suggestion Send
  await test('TEST 1: Send valid suggestion', async () => {
    const res = await makeRequest(
      'POST',
      '/suggestions/send',
      {
        receiverId: testUsers.userB.id,
        suggestionText: testSuggestions.valid.text,
        category: testSuggestions.valid.category
      },
      testUsers.userA.token
    );
    assertStatusCode(res, 201, 'Should create suggestion');
    assert(res.data.success === true, 'Response should have success flag');
    assert(res.data.suggestion._id, 'Should return suggestion ID');
  });

  // TEST 2: Validation - Too short
  await test('TEST 2: Reject suggestion < 10 characters', async () => {
    const res = await makeRequest(
      'POST',
      '/suggestions/send',
      {
        receiverId: testUsers.userB.id,
        suggestionText: testSuggestions.shortText,
        category: testSuggestions.valid.category
      },
      testUsers.userA.token
    );
    assertStatusCode(res, 400, 'Should reject invalid submission');
    assert(res.data.message.includes('least 10'), 'Should mention 10 character minimum');
  });

  // TEST 3: Validation - Too long
  await test('TEST 3: Reject suggestion > 500 characters', async () => {
    const res = await makeRequest(
      'POST',
      '/suggestions/send',
      {
        receiverId: testUsers.userB.id,
        suggestionText: testSuggestions.longText,
        category: testSuggestions.valid.category
      },
      testUsers.userA.token
    );
    assertStatusCode(res, 400, 'Should reject too long submission');
    assert(res.data.message.includes('500'), 'Should mention 500 character maximum');
  });

  // TEST 4: Validation - Empty text
  await test('TEST 4: Reject empty suggestion text', async () => {
    const res = await makeRequest(
      'POST',
      '/suggestions/send',
      {
        receiverId: testUsers.userB.id,
        suggestionText: testSuggestions.emptyText,
        category: testSuggestions.valid.category
      },
      testUsers.userA.token
    );
    assertStatusCode(res, 400, 'Should reject empty text');
  });

  // TEST 5: Validation - Whitespace only
  await test('TEST 5: Reject whitespace-only suggestion', async () => {
    const res = await makeRequest(
      'POST',
      '/suggestions/send',
      {
        receiverId: testUsers.userB.id,
        suggestionText: testSuggestions.whitespace,
        category: testSuggestions.valid.category
      },
      testUsers.userA.token
    );
    assertStatusCode(res, 400, 'Should reject whitespace-only text');
  });

  // TEST 6: Validation - Invalid category
  await test('TEST 6: Reject invalid category', async () => {
    const res = await makeRequest(
      'POST',
      '/suggestions/send',
      {
        receiverId: testUsers.userB.id,
        suggestionText: testSuggestions.valid.text,
        category: 'invalid_category'
      },
      testUsers.userA.token
    );
    assertStatusCode(res, 400, 'Should reject invalid category');
  });

  // TEST 7: Test all valid categories
  await test('TEST 7: Accept all valid categories', async () => {
    for (const category of testSuggestions.validCategories) {
      const res = await makeRequest(
        'POST',
        '/suggestions/send',
        {
          receiverId: testUsers.userB.id,
          suggestionText: `Test suggestion for ${category}`,
          category
        },
        testUsers.userA.token
      );
      assertStatusCode(res, 201, `Should accept ${category}`);
    }
  });

  // TEST 8: Get user suggestions
  await test('TEST 8: Get received suggestions', async () => {
    const res = await makeRequest(
      'GET',
      `/suggestions/received/${testUsers.userB.id}`,
      null,
      testUsers.userB.token
    );
    assertStatusCode(res, 200, 'Should fetch suggestions');
    assert(Array.isArray(res.data.suggestions), 'Should return array of suggestions');
    assert(typeof res.data.unreadCount === 'number', 'Should include unread count');
  });

  // TEST 9: Get suggestions with pagination
  await test('TEST 9: Pagination works correctly', async () => {
    const res = await makeRequest(
      'GET',
      `/suggestions/received/${testUsers.userB.id}?page=1`,
      null,
      testUsers.userB.token
    );
    assertStatusCode(res, 200, 'Should support pagination');
    assert(res.data.suggestions.length <= 10, 'Should return max 10 per page');
  });

  // TEST 10: Mark as read
  await test('TEST 10: Mark suggestion as read', async () => {
    // First get a suggestion ID
    const getRes = await makeRequest(
      'GET',
      `/suggestions/received/${testUsers.userB.id}`,
      null,
      testUsers.userB.token
    );
    assert(getRes.data.suggestions.length > 0, 'Should have suggestions to mark as read');
    
    const suggestionId = getRes.data.suggestions[0]._id;
    const res = await makeRequest(
      'PUT',
      `/suggestions/${suggestionId}/read`,
      null,
      testUsers.userB.token
    );
    assertStatusCode(res, 200, 'Should mark as read');
    assert(res.data.suggestion.isRead === true, 'Should set isRead flag');
  });

  // TEST 11: Delete suggestion
  await test('TEST 11: Delete suggestion', async () => {
    // First create a suggestion to delete
    const createRes = await makeRequest(
      'POST',
      '/suggestions/send',
      {
        receiverId: testUsers.userB.id,
        suggestionText: 'This suggestion will be deleted - test',
        category: 'other'
      },
      testUsers.userA.token
    );
    const suggestionId = createRes.data.suggestion._id;

    // Then delete it
    const deleteRes = await makeRequest(
      'DELETE',
      `/suggestions/${suggestionId}`,
      null,
      testUsers.userB.token
    );
    assertStatusCode(deleteRes, 200, 'Should delete suggestion');
  });

  // TEST 12: Authorization - Sender cannot delete
  await test('TEST 12: Unauthorized delete attempt blocked', async () => {
    // Create suggestion as User A
    const createRes = await makeRequest(
      'POST',
      '/suggestions/send',
      {
        receiverId: testUsers.userB.id,
        suggestionText: 'Try to delete this - will fail',
        category: 'other'
      },
      testUsers.userA.token
    );
    const suggestionId = createRes.data.suggestion._id;

    // Try to delete as sender (User A)
    const deleteRes = await makeRequest(
      'DELETE',
      `/suggestions/${suggestionId}`,
      null,
      testUsers.userA.token
    );
    assertStatusCode(deleteRes, 403, 'Should not allow sender to delete');
  });

  // TEST 13: Missing token
  await test('TEST 13: Missing auth token blocked', async () => {
    const res = await makeRequest(
      'GET',
      `/suggestions/received/${testUsers.userB.id}`
      // No token
    );
    assertStatusCode(res, 401, 'Should require authentication');
  });

  // TEST 14: Invalid receiver ID
  await test('TEST 14: Invalid receiver ID rejected', async () => {
    const res = await makeRequest(
      'POST',
      '/suggestions/send',
      {
        receiverId: 'invalid_id_123',
        suggestionText: testSuggestions.valid.text,
        category: testSuggestions.valid.category
      },
      testUsers.userA.token
    );
    assertStatusCode(res, 400, 'Should validate receiver ID');
  });

  // TEST 15: Response structure
  await test('TEST 15: Response structure correct', async () => {
    const res = await makeRequest(
      'POST',
      '/suggestions/send',
      {
        receiverId: testUsers.userB.id,
        suggestionText: 'Verify response structure test',
        category: 'collaboration'
      },
      testUsers.userA.token
    );
    assert(res.data.success === true, 'Should have success flag');
    assert(res.data.suggestion, 'Should return suggestion object');
    assert(res.data.suggestion.senderInfo, 'Should have senderInfo');
    assert(res.data.suggestion.receiverId, 'Should have receiverId');
    assert(res.data.suggestion.suggestionText, 'Should have suggestionText');
    assert(res.data.suggestion.category, 'Should have category');
    assert(res.data.suggestion.isRead === false, 'Should start as unread');
    assert(res.data.suggestion.createdAt, 'Should have createdAt timestamp');
  });

  // ============================================
  // TEST SUITE END - RESULTS
  // ============================================

  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  console.log('='.repeat(50) + '\n');

  if (results.failed > 0) {
    console.log('Failed Tests:');
    results.errors.forEach((error, i) => {
      console.log(`\n${i + 1}. ${error.test}`);
      console.log(`   Error: ${error.error}`);
    });
  } else {
    console.log('🎉 ALL TESTS PASSED! Feature is production-ready.\n');
  }

  return {
    passed: results.passed,
    failed: results.failed,
    total: results.passed + results.failed,
    successRate: ((results.passed / (results.passed + results.failed)) * 100).toFixed(1)
  };
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };
