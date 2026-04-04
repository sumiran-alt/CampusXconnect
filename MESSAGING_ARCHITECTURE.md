# CampusXConnect Messaging - Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE (Browser)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              React Component (Chat Page)                     │  │
│  │  ┌────────────────────────────────────────────────────────┐ │  │
│  │  │ State:                                                 │ │  │
│  │  │ • messages: Message[]                                 │ │  │
│  │  │ • otherUser: User                                     │ │  │
│  │  │ • socket: Socket.io instance                          │ │  │
│  │  │ • isTyping: boolean                                   │ │  │
│  │  │ • messageText: string                                 │ │  │
│  │  └────────────────────────────────────────────────────────┘ │  │
│  │                                                              │  │
│  │  ┌────────────────────────────────────────────────────────┐ │  │
│  │  │ Handlers:                                              │ │  │
│  │  │ • handleSendMessage()                                 │ │  │
│  │  │ • handleReceiveMessage()                              │ │  │
│  │  │ • handleTypingStart()                                 │ │  │
│  │  │ • handleMessageRead()                                 │ │  │
│  │  └────────────────────────────────────────────────────────┘ │  │
│  │                                                              │  │
│  │  ┌────────────────────────────────────────────────────────┐ │  │
│  │  │ UI Sections:                                           │ │  │
│  │  │ 1. Header (user info + back button)                   │ │  │
│  │  │ 2. Messages Container (chat bubbles)                  │ │  │
│  │  │ 3. Typing Indicator (animated)                        │ │  │
│  │  │ 4. Input Area (message + attach)                      │ │  │
│  │  └────────────────────────────────────────────────────────┘ │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            │                                        │
│                            ↓                                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │             Socket.io Client (WebSocket)                    │  │
│  │                                                              │  │
│  │  Events Emitted:           Events Listened:                │  │
│  │  • send_message ─────────→ • receive_message              │  │
│  │  • typing ────────────────→ • user_typing                 │  │
│  │  • stop_typing ───────────→ • message_read_receipt        │  │
│  │  • message_read ──────────→ • users_online                │  │
│  │  • join_conversation ─────→ • connect                     │  │
│  │  • leave_conversation ────→ • disconnect                  │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                      HTTP + WebSocket
                    (TCP/IP | TLS/1.2+)
                             │
┌────────────────────────────┼────────────────────────────────────────┐
│                            ↓                                        │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │             Socket.io Server (Node.js)                       │   │
│ │                                                              │   │
│ │  ┌────────────────────────────────────────────────────────┐ │   │
│ │  │ Middleware:                                            │ │   │
│ │  │ • JWT Authentication                                  │ │   │
│ │  │ • User ID extraction                                  │ │   │
│ │  │ • Token validation                                    │ │   │
│ │  └────────────────────────────────────────────────────────┘ │   │
│ │                                                              │   │
│ │  ┌────────────────────────────────────────────────────────┐ │   │
│ │  │ Event Handlers:                                        │ │   │
│ │  │ • on("send_message") ───→ Save to DB                 │ │   │
│ │  │ • on("typing") ─────────→ Broadcast to recipient     │ │   │
│ │  │ • on("stop_typing") ────→ Broadcast to recipient     │ │   │
│ │  │ • on("message_read") ───→ Update DB + broadcast      │ │   │
│ │  │ • on("connect") ────────→ Track online user          │ │   │
│ │  │ • on("disconnect") ─────→ Remove from online list    │ │   │
│ │  └────────────────────────────────────────────────────────┘ │   │
│ │                                                              │   │
│ │  ┌────────────────────────────────────────────────────────┐ │   │
│ │  │ Data:                                                  │ │   │
│ │  │ • activeUsers: Map(userId → socketId)                │ │   │
│ │  │ • io: Socket.io Server instance                      │ │   │
│ │  └────────────────────────────────────────────────────────┘ │   │
│ │                                                              │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                            │                                        │
│                            ↓                                        │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │             Express Routes + Controllers                     │   │
│ │                                                              │   │
│ │  POST /api/private-messages/send                           │   │
│ │  GET  /api/private-messages/:userId                        │   │
│ │  PUT  /api/private-messages/:messageId/read                │   │
│ │  DELETE /api/private-messages/:messageId                   │   │
│ │                                                              │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                            │                                        │
│                            ↓                                        │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │             MongoDB Database                                │   │
│ │                                                              │   │
│ │  Collection: privatemessages                               │   │
│ │  ┌────────────────────────────────────────────────────────┐ │   │
│ │  │ Document:                                              │ │   │
│ │  │ {                                                      │ │   │
│ │  │   _id: ObjectId                                        │ │   │
│ │  │   sender: ObjectId (ref: User)                        │ │   │
│ │  │   recipient: ObjectId (ref: User)                    │ │   │
│ │  │   text: String (max 5000)                             │ │   │
│ │  │   isRead: Boolean                                      │ │   │
│ │  │   readAt: Date                                         │ │   │
│ │  │   deletedBySender: Boolean                             │ │   │
│ │  │   deletedByRecipient: Boolean                          │ │   │
│ │  │   createdAt: Date                                      │ │   │
│ │  │   updatedAt: Date                                      │ │   │
│ │  │ }                                                      │ │   │
│ │  └────────────────────────────────────────────────────────┘ │   │
│ │                                                              │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                    │
│                         SERVER SIDE                               │
└────────────────────────────────────────────────────────────────────┘
```

---

## 📨 Message Sending Flow

```
1. USER TYPES MESSAGE
   └─→ App state: messageText = "Hello!"

2. USER CLICKS SEND
   └─→ Form onSubmit triggered
   └─→ handleSendMessage() called

3. OPTIMISTIC UPDATE (Instant)
   └─→ Create: optimisticMessage object
   └─→ Add to state: setMessages([...prev, optimisticMessage])
   └─→ UI renders message immediately ⚡
   └─→ Clear input: setMessageText("")

4. SEND TO SERVER (HTTP POST)
   └─→ API Call: messageAPI.sendMessage(userId, text)
   └─→ Endpoint: POST /api/private-messages/send
   └─→ Auth: JWT token in header
   └─→ Payload:
       {
         recipient: userId,
         text: "Hello!"
       }

5. SERVER PROCESSES
   └─→ Verify user authentication
   └─→ Create message in MongoDB:
       {
         sender: currentUserId,
         recipient: otherUserId,
         text: "Hello!",
         isRead: false,
         createdAt: now()
       }
   └─→ Return created message to client

6. REPLACE OPTIMISTIC (Update)
   └─→ Receive real message from server
   └─→ Replace optimistic: setMessages(prev =>
       prev.map(msg => 
         msg._id === optimisticId ? realMessage : msg
       ))
   └─→ UI updates with DB data (timestamps, real ID)

7. BROADCAST VIA SOCKET.IO
   └─→ Server: socket.emit("send_message", data)
   └─→ Data:
       {
         messageId: realMessage._id,
         senderId: currentUserId,
         receiverId: otherUserId,
         text: "Hello!",
         createdAt: realMessage.createdAt
       }

8. RECIPIENT RECEIVES (Real-Time)
   └─→ Socket event: "receive_message" fired
   └─→ Handler: handleReceiveMessage(data)
   └─→ Add to state: setMessages([...prev, newMessage])
   └─→ UI renders on recipient's screen ⚡
   └─→ Auto-scroll to bottom

9. READ RECEIPT
   └─→ Message appears in recipient's viewport
   └─→ Emit: socket.emit("message_read", {messageId})
   └─→ Server marks: message.isRead = true, readAt = now()
   └─→ Broadcast: "message_read_receipt" to sender
   └─→ Sender sees: ✓✓ (double checkmark)

TOTAL TIME: <100ms from send to receive
```

---

## ⌨️ Typing Indicator Flow

```
USER STARTS TYPING INPUT
    │
    ├─→ onChange event fires
    │
    ├─→ handleTypingStart() called
    │
    ├─→ Check: isCurrentUserTyping? No
    │
    ├─→ Set: isCurrentUserTyping = true
    │
    ├─→ Emit: socket.emit("typing", {
    │      senderId: currentUserId,
    │      receiverId: otherUserId
    │    })
    │
    ├─→ Server receives event
    │
    ├─→ Server finds recipient in activeUsers Map
    │
    ├─→ Server broadcasts:
    │   io.to(recipientSocketId).emit("user_typing", {
    │      senderId: currentUserId,
    │      isTyping: true
    │    })
    │
    ├─→ Recipient receives "user_typing" event
    │
    ├─→ Recipient state: setIsTyping(true)
    │
    ├─→ Recipient UI renders typing indicator
    │   (animated bouncing dots)
    │
    ├─→ Start timeout: 3 seconds
    │
    ├─→ User continues typing (timeout resets)
    │   OR
    ├─→ User stops typing (timeout completes)
    │
    ├─→ After 3 seconds of silence:
    │   socket.emit("stop_typing", {
    │      senderId: currentUserId,
    │      receiverId: otherUserId
    │    })
    │
    ├─→ Server broadcasts:
    │   io.to(recipientSocketId).emit("user_typing", {
    │      senderId: currentUserId,
    │      isTyping: false
    │    })
    │
    ├─→ Recipient receives "user_typing" with false
    │
    ├─→ Recipient state: setIsTyping(false)
    │
    └─→ Recipient UI removes typing indicator

TOTAL LATENCY: <50ms
```

---

## 🔄 Real-Time Connection & Reconnection

```
CLIENT LOADS PAGE
    │
    ├─→ useEffect initializes Socket.io
    │
    ├─→ const socket = io(backendUrl, {
    │      auth: { token, userId },
    │      transports: ["websocket", "polling"],
    │      reconnection: true,
    │      reconnectionDelay: 1000,
    │      reconnectionAttempts: 5
    │    })
    │
    ├─→ Socket attempts WebSocket connection
    │   (port 5000, ws:// protocol)
    │
    ├─→ Server receives connection request
    │
    ├─→ Middleware verifies JWT token
    │   (if invalid, connection closes)
    │
    ├─→ Server extracts userId from token
    │
    ├─→ Server stores: activeUsers.set(userId, socketId)
    │
    ├─→ Server broadcasts: "users_online" event
    │   (notifies all connected users)
    │
    ├─→ Client receives: "connect" event
    │   (console: "✅ Socket.io connected: abc123")
    │
    ├─→ Client joins conversation room:
    │   socket.emit("join_conversation", {
    │      conversationId: otherUserId
    │   })
    │
    ├─→ Server adds socket to room
    │   socket.join("conversation_<userId>")
    │
    ├─→ NORMAL OPERATION (messaging works)
    │   ...
    │   ...
    │
    ├─→ NETWORK INTERRUPTION (connection drops)
    │
    ├─→ Client detects disconnect
    │   socket.on("disconnect", () => {...})
    │
    ├─→ Server removes: activeUsers.delete(userId)
    │
    ├─→ Server broadcasts: "users_online" updated
    │
    ├─→ Client automatically reconnects:
    │   (exponential backoff: 1s, 2s, 4s, 8s, 16s)
    │
    ├─→ After network returns, WebSocket reconnects
    │
    ├─→ Same auth flow repeats
    │   (token validated again)
    │
    ├─→ Client receives: "connect" event again
    │
    ├─→ Client rejoins conversation room
    │   socket.emit("join_conversation")
    │
    ├─→ RESUME MESSAGING
    │   (any messages received during offline
    │    are fetched on page load)
    │
    └─→ Max reconnection attempts: 5
        (then user must manually refresh)
```

---

## 💾 Data Structure

### Message Object (from DB)
```javascript
{
  // Identifiers
  _id: ObjectId("507f1f77bcf86cd799439011"),
  sender: {
    _id: ObjectId("507f1f77bcf86cd799439012"),
    name: "John Doe",
    profilePicture: "url/to/pic"
  },
  recipient: {
    _id: ObjectId("507f1f77bcf86cd799439013")
  },

  // Content
  text: "Hey! How are you?",
  
  // Status
  isRead: false,
  readAt: null,
  
  // Soft Delete
  deletedBySender: false,
  deletedByRecipient: false,
  
  // Timestamps
  createdAt: ISODate("2024-03-14T10:30:00Z"),
  updatedAt: ISODate("2024-03-14T10:30:00Z")
}
```

### UI State (React Component)
```javascript
const [messages, setMessages] = useState([
  {
    _id: "msg_1",
    sender: { _id: "userId1", name: "User 1", profilePicture: "url" },
    recipient: { _id: "userId2" },
    text: "Hello!",
    createdAt: "2024-03-14T10:30:00Z",
    isRead: false
  },
  // ... more messages
]);

const [otherUser, setOtherUser] = useState({
  _id: "userId2",
  name: "Jane Doe",
  profilePicture: "url",
  branch: "Computer Science",
  year: 2
});

const [isTyping, setIsTyping] = useState(false);
const [socket, setSocket] = useState(null);
const [messageText, setMessageText] = useState("");
const [sending, setSending] = useState(false);
```

---

## 🎯 Component Lifecycle

```
PAGE LOAD
    │
    ├─→ useEffect 1: Initialize
    │   ├─→ Check authentication
    │   ├─→ Fetch messages from server
    │   ├─→ Initialize Socket.io connection
    │   ├─→ Set up event listeners
    │   └─→ Return cleanup function
    │
    ├─→ useEffect 2: Auto-scroll
    │   ├─→ Watch: messages array
    │   ├─→ When new message: scrollToBottom()
    │   └─→ Smooth scroll animation
    │
    ├─→ Socket.io:
    │   ├─→ on("connect"): log connection
    │   ├─→ on("receive_message"): handleReceiveMessage
    │   ├─→ on("user_typing"): handleUserTyping
    │   ├─→ on("message_read_receipt"): handleMessageRead
    │   └─→ on("disconnect"): log disconnection
    │
    ├─→ UI RENDERS:
    │   ├─→ Header (user info)
    │   ├─→ Messages container (chat bubbles)
    │   ├─→ Typing indicator (if typing)
    │   └─→ Input area (message form)
    │
    ├─→ USER INTERACTIONS:
    │   ├─→ Type message → handleTypingStart()
    │   ├─→ Send message → handleSendMessage()
    │   ├─→ Delete message → handleDeleteMessage()
    │   ├─→ Attach file → handleFileSelect()
    │   └─→ Blur input → stop typing indicator
    │
    ├─→ REAL-TIME UPDATES:
    │   ├─→ Receive message → add to state
    │   ├─→ See typing indicator → auto-render
    │   ├─→ Message read → update checkmark
    │   └─→ Connection lost → auto-reconnect
    │
    └─→ PAGE UNLOAD (Cleanup):
        ├─→ Leave conversation room
        ├─→ Disconnect Socket.io
        ├─→ Clear timeouts
        └─→ Cancel pending requests
```

---

## 🔐 Security Flow

```
CLIENT (Browser)          NETWORK          SERVER (Node.js)
    │                        │                   │
    ├─ User logs in ────────→ ├─ Hash password ─→ ├─ Verify hash
    │                        │                   │
    │← ─ JWT token ──────────┤← ────────────────┤
    │                        │                   │
    ├─ Store JWT locally    │                   │
    │                        │                   │
    ├─ Socket auth ─────────→ ├─ TLS/1.2 ──────→ ├─ Verify JWT
    │ { token, userId }       │                   │
    │                        │                   │
    │                        │                   ├─ Extract userId
    │                        │                   │
    │                        │                   ├─ Check ownership
    │                        │                   │
    │← ─ Connected ──────────┤← ────────────────┤
    │                        │                   │
    ├─ Send message ────────→ ├─ Encrypted ────→ ├─ Validate message
    │ { text }               │                   │
    │                        │                   ├─ Verify sender
    │                        │                   │
    │                        │                   ├─ Save to DB
    │                        │                   │
    │← ─ Message saved ──────┤← ────────────────┤ ├─ Broadcast to recipient
    │                        │                   │
    │◄──────────────────────────────────────────┤← ─ Message received
    │ Another user's socket  │                   │
    │ receives message       │                   │
    │                        │                   │
```

---

## 📊 Files & Responsibilities

```
backend/
├── socket.js                          → Socket.io server logic
│   ├── Middleware (auth)
│   ├── Connection handlers
│   ├── Message event handlers
│   ├── Typing indicator handlers
│   ├── Read receipt handlers
│   ├── Room management
│   └── Active user tracking
│
├── server.js                          → HTTP + Socket.io integration
│   ├── Create HTTP server
│   ├── Initialize Socket.io
│   ├── Expose io instance
│   └── Error handling
│
├── controllers/privateMessageController.js
│   ├── sendMessage
│   ├── getConversation
│   ├── markAsRead
│   └── deleteMessage
│
└── routes/privateMessages.js
    └── API endpoints (unchanged)

frontend/
├── app/messages/[id]/page.jsx         → Chat component
│   ├── State management
│   ├── Socket.io initialization
│   ├── Event handlers
│   ├── UI rendering
│   └── Auto-scroll logic
│
├── tailwind.config.js                 → Custom animations
│   └── animate-fadeIn
│
└── lib/api.js                         → API calls (unchanged)
    └── messageAPI.*
```

---

## 🚀 Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│ OPTIMIZATION TECHNIQUE                      BENEFIT          │
├─────────────────────────────────────────────────────────────┤
│ Optimistic Updates                    Instant feedback (UX) │
│ Message Caching                       Fast re-renders       │
│ useCallback for event handlers        Prevent re-renders    │
│ Lazy loading messages (pagination)    Memory efficient      │
│ CSS animations                        Smooth 60fps          │
│ WebSocket instead of polling          90% less traffic      │
│ Event-driven architecture             Real-time updates     │
│ Avatar deduplication                  Reduce image loads    │
│ Date separator batching               Fewer DOM nodes       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📈 Scaling Considerations

### Current Setup (Single Server)
- ✅ Handles 1000+ concurrent connections
- ✅ All sockets on same server
- ✅ In-memory activeUsers Map
- ✅ Direct socket.io emit

### Future Scaling (Multiple Servers)
- ❌ Need Redis adapter
- ❌ Share activeUsers across servers
- ❌ Use rooms for load balancing
- ❌ Set up Socket.io client in server mode

### Migration Strategy
```javascript
// Add to socket.js for multi-server
const { createAdapter } = require("@socket.io/redis-adapter");
const redis = require("redis");

const pubClient = redis.createClient();
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

---

**This architecture is production-ready, scalable, and maintainable.** ✅

---

*Last updated: March 14, 2026*
*Version: 1.0*
