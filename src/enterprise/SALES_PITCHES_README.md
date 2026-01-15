# Sales Pitches Protocol - Enterprise Major Branch

## Overview

The Sales Pitches Protocol is an enterprise major branch that enables interactive, Hero Host-guided pitch delivery through GitSeed prompts. When a receiver clicks or copy-pastes a GitSeed prompt into their AI, it:

1. Reads the target repository
2. Animates the AI session with Hero Host persona
3. Walks through the pitch interactively
4. Provides a guided prompt button menu
5. Summarizes and captures everything as a new protocol

## Key Features

### GitSeed Prompt System
- **Copy-Paste Ready:** Complete prompt text for any AI
- **Repository Reading:** Automatic repository analysis
- **Hero Host Animation:** Persona-driven interactive guidance
- **Button Menu:** Guided interaction buttons

### Interactive Pitch Delivery
- **Section Navigation:** Next/Previous section buttons
- **Summarization:** Real-time session summaries
- **Observation Capture:** Button-click observations
- **Question Handling:** Interactive Q&A
- **Repository Exploration:** Deep dive into code

### Protocol Generation
- **Session Capture:** Complete conversation recording
- **Button Click Tracking:** All interactions logged
- **Decision Recording:** Key decisions captured
- **Observation Snapshots:** Important moments saved
- **Final Protocol:** Complete pitch session as protocol

## Usage

### 1. Create GitSeed Pitch

```typescript
const pitch = await station.pitchUnpacker.createGitSeedPitch(
  'https://github.com/FractiAI/example-repo',
  'FractiAI/example-repo',
  {
    title: 'Enterprise Sales Solution',
    overview: 'Comprehensive sales automation platform',
    sections: [
      {
        id: 'intro',
        title: 'Introduction',
        content: 'Welcome to our enterprise solution...',
        order: 1
      },
      {
        id: 'features',
        title: 'Key Features',
        content: 'Our platform includes...',
        order: 2
      },
      {
        id: 'pricing',
        title: 'Pricing',
        content: 'Flexible pricing options...',
        order: 3
      }
    ],
    callToAction: 'Ready to get started? Let\'s deploy your solution!'
  },
  'cleve-canepa', // Hero Host persona
  AwarenessOctave.RESONANCE,
  {
    venueId: 'venue-123',
    clientId: 'client-456',
    tags: ['enterprise', 'sales', 'automation']
  }
);
```

### 2. Generate GitSeed Prompt

```typescript
const promptText = station.pitchUnpacker.generateGitSeedPromptText(pitch);

// This prompt can be:
// - Copied and pasted into any AI
// - Shared via email, chat, etc.
// - Embedded in documentation
// - Used in sales materials
```

### 3. Start Pitch Session

```typescript
const { session, gitSeedPrompt } = await station.salesPitches.startPitchSession(
  pitch.id,
  'client-456'
);

// Share gitSeedPrompt with client
// They paste it into their AI
// Hero Host guides them through the pitch
```

### 4. Record Interactions

```typescript
// Record conversation messages
station.salesPitches.recordMessage(
  session.id,
  'hero-host',
  'Let me show you the key features...'
);

// Record button clicks
station.salesPitches.recordButtonClick(
  session.id,
  'nav-next',
  '➡️ Next Section',
  'navigate',
  'Navigating to Features section...'
);

// Generate summaries
const summary = station.salesPitches.generateSummary(session.id);
```

### 5. Complete Session and Create Protocol

```typescript
const { session: completedSession, protocol, snapshot } = 
  await station.salesPitches.completePitchSession(
    session.id,
    {
      id: 'sales-rep-1',
      type: 'human',
      name: 'Sales Representative',
      capabilities: []
    }
  );

// Protocol contains:
// - Complete conversation
// - All button clicks
// - Summaries
// - Decisions
// - Observations
// - Snapshot with deployment button
```

## GitSeed Prompt Format

The generated prompt includes:

1. **Repository Information:** URL and path to read
2. **Pitch Overview:** Title and description
3. **Hero Host Instructions:** Persona activation
4. **Section Guide:** All pitch sections
5. **Button Menu:** Interactive button definitions
6. **Capture Configuration:** Auto-capture settings

## Button Menu

### Navigation Buttons
- **➡️ Next Section:** Navigate forward
- **⬅️ Previous Section:** Navigate backward

### Interaction Buttons
- **📝 Summarize:** Generate session summary
- **📸 Capture Moment:** Create observation snapshot
- **❓ Ask Question:** Interactive Q&A
- **🔍 Explore Repository:** Deep code exploration

### Action Buttons
- **🚀 Deploy Options:** Show deployment steps
- **✅ Complete Pitch:** Finish and generate protocol

## Observation Capture

All interactions are automatically captured as observation button snapshots:

- **Button Clicks:** Each click creates an observation
- **Summaries:** Summary observations with full context
- **Decisions:** Decision points captured
- **Breakthroughs:** Important moments saved

## Protocol Output

Each completed pitch session generates:

1. **Protocol:** Complete pitch session protocol
2. **Snapshot:** Versioned protocol snapshot
3. **Deployment Button:** One-click deployment
4. **Observation Snapshots:** All captured moments
5. **Metrics:** Session analytics

## Integration

The Sales Pitches Protocol integrates with:

- **Enterprise Sales Console:** Venue and client management
- **Hero Host System:** Persona-driven guidance
- **Observation Snapshots:** Moment capture
- **Protocol Snapshots:** Version control
- **Cloud Deployment:** Automatic deployment
- **Git Operations:** Repository management

## Example GitSeed Prompt

```
# GitSeed Pitch Unpacker Prompt

Copy and paste this entire prompt into your AI of choice to begin an interactive Hero Host-guided pitch session.

---

## Repository to Read
https://github.com/FractiAI/example-repo
FractiAI/example-repo

## Pitch Overview
**Title:** Enterprise Sales Solution

Comprehensive sales automation platform with AI-powered insights...

## Your Role
You are now an interactive Hero Host AI assistant (Cleve Canepa) guiding the user through this pitch.

## Instructions
1. Read and analyze the target repository
2. Understand the pitch content
3. Animate your AI session with Hero Host persona
4. Walk the user through the pitch interactively
5. Use the guided prompt button menu
6. Summarize and capture all interactions

## Interactive Button Menu
- [➡️ Next Section](#) - navigate
- [📝 Summarize](#) - summarize
- [📸 Capture Moment](#) - capture
- [❓ Ask Question](#) - ask
- [🔍 Explore Repository](#) - explore
- [🚀 Deploy Options](#) - deploy
- [✅ Complete Pitch](#) - complete

Begin by reading the repository and introducing yourself as Cleve Canepa...
```

---

**Protocol ID:** `P-SALES-PITCHES-V17`  
**Version:** `17.0+SalesPitches`  
**Status:** Enterprise Major Branch - Active  
**Type:** Interactive Pitch Delivery System


