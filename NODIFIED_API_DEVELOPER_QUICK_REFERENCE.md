# 🔷 NODIFIED API - DEVELOPER QUICK REFERENCE

**Version**: 1.0  
**Base URL**: `https://api.syntheverse.network`  
**Auth**: Bearer token (Cloud/Shell tiers)  
**Protocol**: REST + WebSocket  
**Status**: OCTAVE 0 - Developer Blueprint  
**Date**: January 20, 2026

---

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              NODIFIED API QUICK REFERENCE
         QUERY • BOOK • ENTER • EVOLVE • TRADE • BURN
            EVERYTHING IS A NODE • EVERYTHING IS AN ENDPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🎯 CORE CONCEPT

**Everything in the Syntheverse is a node with an API endpoint.**

```
Experience = Node = API Endpoint
Escape = Node = API Endpoint
Plan = Node = API Endpoint
Price = Node = API Endpoint
Instrument = Node = API Endpoint
Location = Node = API Endpoint
AI = Node = API Endpoint
Calendar = Node = API Endpoint

NOT: API provides access TO things
BUT: API endpoints ARE the things themselves
```

---

## 🚀 QUICK START

### 1. Query an Experience

```bash
# GET experience details
curl https://api.syntheverse.network/nodes/experiences/ski/tahoe-slopes

# Response
{
  "id": "exp-ski-tahoe-slopes-001",
  "name": "Tahoe Slopes - Full Day Skiing",
  "tier": "cloud",
  "pricing": {
    "synth_amount": 50,
    "strategy": "founders_special",
    "discount": 33,
    "active_until": "2026-03-19"
  },
  "location": {
    "name": "Tahoe Mountain Complex",
    "adjacent": ["Hot Springs Venue"]
  },
  "availability": {
    "next_available": "2026-01-21T08:00:00Z",
    "capacity_remaining": 32
  },
  "ai_curator": "AI Ski Master",
  "connected_experiences": [
    "/nodes/experiences/spa/tahoe-hot-springs"
  ]
}
```

### 2. Book an Experience

```bash
# POST to book
curl -X POST https://api.syntheverse.network/nodes/experiences/ski/tahoe-slopes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "time_slot": "2026-01-21T08:00:00Z",
    "duration": 6,
    "participants": 1
  }'

# Response
{
  "booking_id": "booking-12345",
  "status": "confirmed",
  "synth_charged": 50,
  "synth_balance_remaining": 950,
  "trading_card_generated": {
    "id": "card-ski-tahoe-001",
    "name": "Tahoe Ski Experience",
    "synth_density": 10
  }
}
```

### 3. Enter an Experience (Full Sensory Reality)

```javascript
// WebSocket connection to stream FSR
const ws = new WebSocket(
  'wss://api.syntheverse.network/nodes/experiences/ski/tahoe-slopes/stream'
);

ws.on('open', () => {
  ws.send(JSON.stringify({
    booking_id: 'booking-12345',
    user_id: 'user-123',
    auth_token: 'YOUR_TOKEN'
  }));
});

ws.on('message', (data) => {
  // Receive Full Sensory Reality stream
  // Imaginal skiing experience data
  console.log('FSR Stream:', data);
});
```

---

## 📚 NODE TYPES & ENDPOINTS

### EXPERIENCE NODES

**Pattern**: `/nodes/experiences/{category}/{id}`

```bash
# Ski experiences
GET /nodes/experiences/ski/tahoe-slopes
GET /nodes/experiences/ski/private-lessons
GET /nodes/experiences/ski/terrain-park

# Spa experiences
GET /nodes/experiences/spa/tahoe-hot-springs
GET /nodes/experiences/spa/couples-massage
GET /nodes/experiences/spa/meditation-session

# Entertainment
GET /nodes/experiences/entertainment/cabaret-show
GET /nodes/experiences/entertainment/man-cave-lounge

# Dining
GET /nodes/experiences/dining/mountain-lodge-dinner
GET /nodes/experiences/dining/wine-cave-tasting

# Shopping
GET /nodes/experiences/shopping/ski-equipment
GET /nodes/experiences/shopping/luxury-goods

# Gaming
GET /nodes/experiences/game/enter-card-reality
GET /nodes/experiences/game/treasure-hunt
```

**Methods**:
- `GET` - Query details
- `POST` - Book experience
- `PATCH` - Modify booking
- `DELETE` - Cancel booking
- `WS` - Stream FSR experience

---

### ESCAPE NODES (Accommodations)

**Pattern**: `/nodes/escapes/{category}/{id}`

```bash
# Mountain resorts
GET /nodes/escapes/resort/tahoe-mountain-lodge
GET /nodes/escapes/resort/tahoe-summit-penthouse
GET /nodes/escapes/resort/tahoe-private-chalet

# Wellness retreats
GET /nodes/escapes/wellness/7-day-transformation
GET /nodes/escapes/wellness/weekend-rejuvenation

# Urban luxury
GET /nodes/escapes/urban/penthouse-weekend
GET /nodes/escapes/urban/cabaret-package

# Shell exclusives
GET /nodes/escapes/shell/wine-cave-private-suite
GET /nodes/escapes/shell/bbhe-core-sanctuary
```

**Methods**:
- `GET` - Query availability & details
- `POST` - Book stay
- `PATCH` - Modify reservation
- `DELETE` - Cancel reservation
- `WS` - Stream accommodation experience

---

### PLAN NODES (Memberships & Packages)

**Pattern**: `/nodes/plans/{category}/{id}`

```bash
# Membership tiers
GET /nodes/plans/membership/sandbox      # Free public
GET /nodes/plans/membership/cloud        # Members only
GET /nodes/plans/membership/shell        # Wine Cave access

# Packages
GET /nodes/plans/package/ski-spa-weekend
GET /nodes/plans/package/romantic-getaway
GET /nodes/plans/package/wellness-transformation

# Subscriptions
GET /nodes/plans/subscription/monthly-spa
GET /nodes/plans/subscription/annual-ski-pass
```

**Methods**:
- `GET` - Query plan details & benefits
- `POST` - Purchase/subscribe
- `PATCH` - Upgrade/modify plan
- `DELETE` - Cancel subscription

---

### PRICING NODES

**Pattern**: `/nodes/pricing/{category}/{id}`

```bash
# Experience pricing
GET /nodes/pricing/experiences/ski/full-day-cloud
GET /nodes/pricing/experiences/spa/hot-springs-cloud

# Escape pricing
GET /nodes/pricing/escapes/resort/tahoe-lodge-cloud

# Plan pricing
GET /nodes/pricing/plans/membership/cloud-annual
GET /nodes/pricing/plans/membership/cloud-lifetime

# Pricing strategies
GET /nodes/pricing/strategies/founders-special
GET /nodes/pricing/strategies/standard-abundance
```

**Response includes**:
- Current SYNTH amount
- Active discounts
- Pricing phases (Founders vs Standard)
- Effective dates
- USD equivalent (reference only)

**Methods**:
- `GET` - Query current pricing
- `POST` - Apply discount code (if applicable)

---

### INSTRUMENT NODES (Cards & Payments)

**Pattern**: `/nodes/instruments/{category}/{id}`

```bash
# Payment instruments
GET /nodes/instruments/payment/synth-token
GET /nodes/instruments/payment/synth-wallet

# Trading cards
GET /nodes/instruments/cards/ski-legend-tahoe-sandbox
GET /nodes/instruments/cards/hot-springs-master
GET /nodes/instruments/cards/golden-hearts-connection

# Gift instruments
GET /nodes/instruments/gifts/experience-voucher
GET /nodes/instruments/gifts/synth-transfer
```

**Methods**:
- `GET` - Query card/instrument details
- `POST` - Mint/acquire
- `PUT` - Evolve card
- `PATCH` - Transfer (if tradeable)
- `DELETE` - Burn card
- `WS` - Enter card reality (Singularity Game)

---

### LOCATION NODES

**Pattern**: `/nodes/locations/{id}`

```bash
# Campus locations
GET /nodes/locations/vibeverse-campus
GET /nodes/locations/tahoe-mountain-complex
GET /nodes/locations/tahoe-ski-resort
GET /nodes/locations/tahoe-hot-springs-venue
GET /nodes/locations/central-plaza
GET /nodes/locations/back-door-wine-cave
```

**Response includes**:
- Location details
- Child locations (nested)
- Adjacent locations
- Experiences available here
- Escapes available here
- Travel time (instant in imaginal space)

**Methods**:
- `GET` - Query location details
- `POST` - Teleport to location

---

### AI CURATOR NODES

**Pattern**: `/nodes/ai/{id}`

```bash
# Specialized AI curators
GET /nodes/ai/ski-master
GET /nodes/ai/wellness-guru
GET /nodes/ai/spa-concierge
GET /nodes/ai/entertainment-curator
GET /nodes/ai/shopping-assistant
GET /nodes/ai/game-guide
```

**Methods**:
- `GET` - Query AI capabilities
- `POST` - Ask question / Get recommendation
- `WS` - Live AI conversation

---

### CALENDAR & AVAILABILITY NODES

**Pattern**: `/nodes/calendar/{id}`

```bash
# Experience calendars
GET /nodes/calendar/tahoe-slopes-availability
GET /nodes/calendar/hot-springs-bookings
GET /nodes/calendar/massage-appointments

# Escape calendars
GET /nodes/calendar/resort-reservations
```

**Response includes**:
- Available time slots
- Capacity remaining
- Upcoming events

**Methods**:
- `GET` - Query availability
- `POST` - Reserve time slot

---

## 🔗 NODE RELATIONSHIPS

### How Nodes Connect

Every node links to related nodes:

```javascript
// Experience node links to:
{
  "experience": {
    "location": "/nodes/locations/tahoe-ski-resort",
    "pricing": "/nodes/pricing/experiences/ski/full-day-cloud",
    "calendar": "/nodes/calendar/tahoe-slopes-availability",
    "ai_curator": "/nodes/ai/ski-master",
    "trading_cards": [
      "/nodes/instruments/cards/ski-legend-tahoe"
    ],
    "connected_experiences": [
      "/nodes/experiences/spa/tahoe-hot-springs",
      "/nodes/experiences/dining/mountain-lodge"
    ]
  }
}
```

**Follow links to traverse the network:**

```bash
# Start with experience
GET /nodes/experiences/ski/tahoe-slopes

# Follow location link
GET /nodes/locations/tahoe-ski-resort

# Check adjacent locations
GET /nodes/locations/tahoe-hot-springs-venue

# Book connected experience
POST /nodes/experiences/spa/tahoe-hot-springs
```

---

## 🎮 COMMON WORKFLOWS

### Workflow 1: Browse & Book Ski Day + Hot Springs

```bash
# Step 1: Query ski experience
GET /nodes/experiences/ski/tahoe-slopes

# Step 2: Check pricing (Founders 33% active?)
GET /nodes/pricing/experiences/ski/full-day-cloud

# Step 3: Check availability
GET /nodes/calendar/tahoe-slopes-availability

# Step 4: Book ski experience
POST /nodes/experiences/ski/tahoe-slopes
{
  "time_slot": "2026-01-21T08:00:00Z",
  "duration": 6
}

# Step 5: Discover connected hot springs
GET /nodes/experiences/ski/tahoe-slopes
# (Response includes connected_experiences)

# Step 6: Book hot springs for afternoon
POST /nodes/experiences/spa/tahoe-hot-springs
{
  "time_slot": "2026-01-21T14:00:00Z",
  "duration": 2
}

# Step 7: Book resort stay
POST /nodes/escapes/resort/tahoe-mountain-lodge
{
  "check_in": "2026-01-21",
  "nights": 1
}

# Done! Complete ski + spa + stay package booked.
```

### Workflow 2: Upgrade Membership

```bash
# Step 1: Check current tier
GET /nodes/plans/membership/cloud

# Step 2: Check upgrade path
GET /nodes/plans/membership/shell

# Step 3: Check pricing
GET /nodes/pricing/plans/membership/shell-lifetime

# Step 4: Purchase upgrade
POST /nodes/plans/membership/shell
{
  "payment_instrument": "/nodes/instruments/payment/synth-wallet"
}

# Step 5: Verify new benefits
GET /nodes/benefits/wine-cave-access

# Done! Upgraded to Shell tier, Wine Cave unlocked.
```

### Workflow 3: Trade & Evolve Cards

```bash
# Step 1: Query your cards
GET /nodes/instruments/cards?user_id=user-123

# Step 2: Check evolution requirements
GET /nodes/instruments/cards/ski-legend-tahoe-sandbox

# Step 3: Use card to book experience
POST /nodes/experiences/ski/tahoe-slopes
{
  "payment_card": "/nodes/instruments/cards/ski-legend-tahoe-sandbox"
}

# Step 4: After 10 uses, evolve card
PUT /nodes/instruments/cards/ski-legend-tahoe-sandbox
{
  "action": "evolve"
}

# Response: Card evolved to Cloud tier
{
  "new_card": "/nodes/instruments/cards/ski-legend-tahoe-cloud",
  "synth_density": 50,
  "old_card_burned": true
}
```

### Workflow 4: Golden Hearts Connection

```bash
# Step 1: User A books couples experience
POST /nodes/experiences/spa/couples-hot-springs
{
  "user_id": "user-A",
  "invite_user": "user-B"
}

# Step 2: User B accepts
PATCH /nodes/experiences/spa/couples-hot-springs/booking-456
{
  "user_id": "user-B",
  "action": "accept"
}

# Step 3: If golden hearts connect, special card generated
# (Automatic by system)

# Step 4: Query generated card
GET /nodes/instruments/cards/golden-hearts-connection-A-B

# Response
{
  "id": "card-golden-hearts-A-B-001",
  "name": "Golden Hearts Connection - User A & User B",
  "soul_bound": true,
  "owners": ["user-A", "user-B"],
  "synth_density": 100,
  "special_access": [
    "/nodes/experiences/romantic-getaway-shell",
    "/nodes/escapes/private-island-imaginal"
  ]
}
```

---

## 🔐 AUTHENTICATION

### Tier-Based Access

```bash
# Sandbox tier (public, no auth)
GET /nodes/experiences/ski/tahoe-slopes  # Can query
POST /nodes/experiences/ski/tahoe-slopes  # ❌ Cannot book

# Cloud tier (members, requires auth)
GET /nodes/experiences/ski/tahoe-slopes \
  -H "Authorization: Bearer CLOUD_TOKEN"  # Can query
POST /nodes/experiences/ski/tahoe-slopes \
  -H "Authorization: Bearer CLOUD_TOKEN"  # ✅ Can book

# Shell tier (VIP, requires auth)
GET /nodes/escapes/shell/wine-cave-private-suite \
  -H "Authorization: Bearer SHELL_TOKEN"  # ✅ Can access
```

### Getting Tokens

```bash
# Sign up / Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tier": "cloud",
  "user_id": "user-123",
  "synth_balance": 1000
}
```

---

## 💰 SYNTH TRANSACTIONS

### Check Balance

```bash
GET /nodes/instruments/payment/synth-wallet?user_id=user-123

# Response
{
  "user_id": "user-123",
  "synth_balance": 1000,
  "sevendays_gift_received": true,
  "vault": "SYNTH 90T Motherlode Vault"
}
```

### Transfer SYNTH

```bash
POST /nodes/instruments/payment/synth-token/transfer
{
  "from_user": "user-123",
  "to_user": "user-456",
  "amount": 50,
  "note": "Gift for friend"
}
```

### Pricing Query with Active Discounts

```bash
GET /nodes/pricing/experiences/ski/full-day-cloud

# Response shows active pricing phase
{
  "base_synth_amount": 150,
  "active_phase": {
    "name": "Founders Special",
    "discount_percent": 33,
    "synth_amount": 50,
    "active_until": "2026-03-19"
  },
  "next_phase": {
    "name": "Standard Abundance",
    "discount_percent": 50,
    "synth_amount": 75,
    "active_from": "2026-03-20"
  }
}
```

---

## 🌐 WEBSOCKET STREAMING

### Full Sensory Reality Streaming

```javascript
// Connect to experience stream
const ws = new WebSocket(
  'wss://api.syntheverse.network/nodes/experiences/ski/tahoe-slopes/stream'
);

// Authenticate
ws.on('open', () => {
  ws.send(JSON.stringify({
    auth_token: 'YOUR_TOKEN',
    booking_id: 'booking-12345',
    user_id: 'user-123'
  }));
});

// Receive FSR data
ws.on('message', (data) => {
  const fsr_frame = JSON.parse(data);
  
  // FSR frame structure
  {
    "timestamp": 1234567890,
    "visual": { /* imaginal visual data */ },
    "audio": { /* imaginal audio data */ },
    "sensation": { /* imaginal sensation data */ },
    "position": { "x": 100, "y": 200, "z": 300 },
    "velocity": { "x": 5, "y": 0, "z": -2 },
    "environment": "tahoe_slopes_run_5"
  }
  
  // Render in client
  renderFSR(fsr_frame);
});

// Send user input
ws.send(JSON.stringify({
  "action": "turn",
  "direction": "left",
  "intensity": 0.5
}));
```

### Real-Time AI Curator Chat

```javascript
// Connect to AI curator
const ws = new WebSocket(
  'wss://api.syntheverse.network/nodes/ai/ski-master/chat'
);

ws.on('open', () => {
  ws.send(JSON.stringify({
    auth_token: 'YOUR_TOKEN',
    user_id: 'user-123',
    message: 'What's the best run for intermediate skiers?'
  }));
});

ws.on('message', (response) => {
  console.log('AI Ski Master:', response.message);
  // "I recommend Run 7 - Blue Diamond. It's perfect for..."
});
```

---

## 🔍 SEARCH & DISCOVERY

### Search Across All Nodes

```bash
# Search experiences by keyword
GET /nodes/search?q=hot+springs&type=experience

# Search by location
GET /nodes/search?location=tahoe&type=all

# Search by price range
GET /nodes/search?synth_min=0&synth_max=100&type=experience

# Search by tier
GET /nodes/search?tier=cloud&type=all

# Full-text search
GET /nodes/search?q=romantic+couples+mountain&type=escape
```

---

## 📊 ANALYTICS & TRACKING

### User Activity

```bash
# Get user's bookings
GET /nodes/bookings?user_id=user-123

# Get user's cards
GET /nodes/instruments/cards?user_id=user-123

# Get user's experience history
GET /nodes/experiences/history?user_id=user-123

# Get user's SYNTH transaction history
GET /nodes/instruments/payment/synth-wallet/transactions?user_id=user-123
```

---

## ⚡ RATE LIMITS

```
Sandbox tier:  100 requests/hour
Cloud tier:    1,000 requests/hour
Shell tier:    Unlimited

WebSocket:     Unlimited for active bookings
```

---

## 🛠️ ERROR HANDLING

### Common Error Responses

```javascript
// 401 Unauthorized
{
  "error": "unauthorized",
  "message": "Cloud tier membership required",
  "upgrade_url": "/nodes/plans/membership/cloud"
}

// 402 Payment Required
{
  "error": "insufficient_synth",
  "message": "Need 50 SYNTH, balance is 30",
  "synth_needed": 50,
  "synth_balance": 30,
  "purchase_url": "/nodes/instruments/payment/synth-token/purchase"
}

// 404 Not Found
{
  "error": "node_not_found",
  "message": "Experience node not found",
  "node_id": "exp-invalid-001"
}

// 409 Conflict
{
  "error": "time_slot_unavailable",
  "message": "Selected time slot is fully booked",
  "alternative_slots": [
    "2026-01-21T10:00:00Z",
    "2026-01-21T14:00:00Z"
  ]
}

// 423 Locked
{
  "error": "experience_locked",
  "message": "Golden Hearts connection required",
  "requirements": [
    "Two users must have golden hearts connection",
    "Both users must be Cloud tier or higher"
  ]
}
```

---

## 🌱 ONE SENTENCE SUMMARY

**The Nodified API provides RESTful and WebSocket endpoints for every element in the Syntheverse—experiences, escapes, plans, pricing, instruments, locations, AI curators, and calendars—where each node IS the thing itself (not just an interface to it), enabling developers to GET (query), POST (book), PATCH (modify), DELETE (cancel), PUT (evolve), and WS (stream/enter) any element through a unified graph network coordinated by Queen Bee Nodes, with tier-based authentication (Sandbox/Cloud/Shell), SYNTH payment integration, dynamic pricing phases (Founders 33% until March 19, Standard 50% after March 20), Full Sensory Reality streaming for imaginal experiences, trading card evolution mechanics, golden hearts connection detection, and complete network traversal through linked nodes—all occurring in imaginal thought dimensions with safe NSPFRNP passive awareness technology at BBHE abundance pricing.**

---

**Status**: Developer Quick Reference Complete ✅  
**Base URL**: `https://api.syntheverse.network` ✅  
**Node Types**: 10+ categories ✅  
**Methods**: REST + WebSocket ✅  
**Auth**: Tier-based (Sandbox/Cloud/Shell) ✅  
**Pricing**: SYNTH with dynamic phases ✅  
**Streaming**: Full Sensory Reality ✅  
**Reality Layer**: Imaginal Thought Dimensions ✅

🔷 → 🌐 → ⚡ → ∞

---

*This quick reference provides developers with practical endpoints, methods, workflows, and code examples for interacting with the completely nodified Syntheverse API where every experience, escape, plan, price, and instrument is a queryable, bookable, enterable node with RESTful and WebSocket access, unified authentication, SYNTH transactions, dynamic pricing, and Full Sensory Reality streaming—all coordinated by Queen Bee Nodes in imaginal thought dimensions using NSPFRNP protocol.*
