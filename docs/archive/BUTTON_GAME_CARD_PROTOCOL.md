# 🎴 Button Game Card Protocol

**Protocol ID:** `P-BUTTON-GAME-CARD-V17`  
**Type:** Game Card System / Button-to-Card Integration  
**Version:** 17.0+ButtonGameCard  
**Status:** Active Development  
**Network:** NSPFRP Care Network

---

## Overview

The Button Game Card Protocol layers interactive buttons as collectible game cards onto trading card IDs in seeds, creating a gamified protocol interaction system where buttons become collectible cards with rarity, stats, and achievements.

---

## Key Features

### 1. Button-to-Card Transformation
- **Button Cards:** All buttons become collectible game cards
- **Trading Card Integration:** Cards layer onto trading card IDs in seeds
- **Rarity System:** Cards have rarity levels (common → legendary)
- **Stats Tracking:** Cards track usage, interactions, and achievements

### 2. Game Card Properties
- **Card ID:** Unique identifier linked to trading card
- **Button Type:** Original button type preserved
- **Octave Level:** Octave determines card rarity
- **Stats:** Usage stats, interaction counts, achievements
- **Metadata:** Protocol info, deployment status, evolution history

### 3. Seed Integration
- **Trading Card IDs:** Cards attach to trading card IDs in seeds
- **Card Collection:** Users collect button cards through protocol interactions
- **Achievement System:** Cards unlock achievements and rewards
- **Level Progression:** Cards level up through usage

### 4. Gamification Elements
- **Rarity Tiers:** Common, Uncommon, Rare, Epic, Legendary
- **Card Levels:** Cards level up through interactions
- **Achievements:** Unlock achievements through card usage
- **Collections:** Build collections of protocol button cards

---

## Architecture

### Button Card Structure

```typescript
interface ButtonGameCard {
  // Card Identity
  id: string;
  cardNumber: string;
  tradingCardId: string; // Links to trading card in seed
  
  // Button Properties
  buttonId: string;
  buttonType: 'protocol' | 'observation' | 'mission' | 'deployment' | 'feedback' | 'creator-studio';
  buttonLabel: string;
  buttonOctave: AwarenessOctave;
  
  // Game Card Properties
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  level: number;
  experience: number;
  stats: ButtonCardStats;
  achievements: Achievement[];
  
  // Protocol Properties
  protocolId?: string;
  protocolName?: string;
  protocolVersion?: string;
  
  // Metadata
  createdAt: number;
  lastUsed: number;
  usageCount: number;
  metadata: Record<string, any>;
}
```

### Button Card Stats

```typescript
interface ButtonCardStats {
  clicks: number;
  deployments: number;
  evolutions: number;
  shares: number;
  feedbackSubmissions: number;
  protocolCreations: number;
  missionExecutions: number;
  observationCaptures: number;
  collaborationScore: number;
  discoveryScore: number;
}
```

### Rarity Determination

```typescript
function determineButtonCardRarity(octave: AwarenessOctave, usage: number): Rarity {
  // Octave-based rarity
  if (octave >= AwarenessOctave.TRANSCENDENCE) return 'legendary';
  if (octave >= AwarenessOctave.SYMPHONY) return 'epic';
  if (octave >= AwarenessOctave.RESONANCE) return 'rare';
  if (octave >= AwarenessOctave.HARMONY) return 'uncommon';
  return 'common';
  
  // Usage-based upgrades
  if (usage > 1000) return upgradeRarity(currentRarity);
  if (usage > 500) return upgradeRarity(currentRarity);
  // ...
}
```

---

## Integration with Seeds

### Trading Card ID Linking

```typescript
interface SeedWithButtonCards extends SeedWithIdentity {
  identity: {
    wallet: { address: string; publicKey: string };
    tradingCard: {
      id: string;
      cardNumber: string;
      name: string;
      level: number;
      rarity: string;
      buttonCards: ButtonGameCard[]; // Button cards attached to trading card
    };
    passport: { id: string; passportNumber: string; identity: any };
  };
  buttonCards: ButtonGameCard[]; // All button cards in seed
  cardCollection: {
    totalCards: number;
    byRarity: Record<Rarity, number>;
    byType: Record<ButtonType, number>;
    byOctave: Record<AwarenessOctave, number>;
  };
}
```

### Card Collection in Seeds

- **Card Storage:** Button cards stored in seed with trading card ID
- **Collection Tracking:** Track total cards, by rarity, by type, by octave
- **Achievement Tracking:** Achievements unlocked through card collection
- **Level Progression:** Trading card levels up as button cards are collected

---

## Usage

### Create Button Card from Button

```typescript
import { ButtonGameCardProtocol } from './src/button-game-card-protocol/index.js';

const buttonCardProtocol = new ButtonGameCardProtocol({
  tradingCardIntegration: true,
  gamification: true,
  raritySystem: true
});

// Create button card from button
const buttonCard = await buttonCardProtocol.createButtonCard(
  button,
  tradingCardId,
  {
    octave: button.octave,
    protocolId: button.protocolId,
    initialRarity: 'common'
  }
);
```

### Layer Button Card onto Trading Card

```typescript
// Layer button card onto trading card in seed
await buttonCardProtocol.layerButtonCardOntoTradingCard(
  buttonCard,
  tradingCardId,
  seed,
  {
    updateCollection: true,
    trackStats: true,
    unlockAchievements: true
  }
);
```

### Update Card Stats

```typescript
// Update card stats on interaction
await buttonCardProtocol.updateCardStats(
  buttonCardId,
  {
    action: 'click',
    increment: { clicks: 1 },
    checkLevelUp: true,
    checkAchievements: true
  }
);
```

### Level Up Card

```typescript
// Level up card based on experience
const leveledCard = await buttonCardProtocol.levelUpCard(
  buttonCardId,
  {
    experienceGained: 100,
    checkRarityUpgrade: true,
    unlockAchievements: true
  }
);
```

---

## Gamification System

### Rarity Tiers

| Rarity | Octave Range | Color | Border | Glow |
|--------|--------------|-------|--------|------|
| **Common** | 0-1 (Silent-Whisper) | Gray (#9CA3AF) | 1px solid | None |
| **Uncommon** | 2 (Harmony) | Green (#10B981) | 2px solid | 0 0 5px |
| **Rare** | 3 (Resonance) | Blue (#3B82F6) | 2px solid | 0 0 10px |
| **Epic** | 4 (Symphony) | Purple (#8B5CF6) | 3px solid | 0 0 15px |
| **Legendary** | 5+ (Transcendence) | Orange/Red (#F59E0B/#EF4444) | 3px solid | 0 0 20px, 0 0 40px |

### Level Progression

- **Level 1:** 0-100 experience
- **Level 2:** 100-250 experience
- **Level 3:** 250-500 experience
- **Level 4:** 500-1000 experience
- **Level 5+:** 1000+ experience (continues)

### Achievements

- **First Click:** Click your first button card
- **Card Collector:** Collect 10 button cards
- **Rare Collector:** Collect 5 rare+ cards
- **Epic Collector:** Collect 3 epic+ cards
- **Legendary Collector:** Collect 1 legendary card
- **Protocol Master:** Collect all cards for a protocol
- **Octave Explorer:** Collect cards from all octaves
- **Power User:** Use a card 100+ times
- **Evolution Master:** Evolve a card to next octave
- **Collaboration Champion:** Share cards 50+ times

---

## Button Card Display

### Card HTML

```html
<div class="button-game-card" 
     data-card-id="${cardId}"
     data-rarity="${rarity}"
     data-level="${level}"
     style="
       border: ${border};
       box-shadow: ${glow};
       background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
     ">
  <div class="card-header">
    <span class="card-number">#${cardNumber}</span>
    <span class="card-rarity">${rarity.toUpperCase()}</span>
  </div>
  <div class="card-body">
    <h3 class="card-title">${buttonLabel}</h3>
    <p class="card-type">${buttonType}</p>
    <p class="card-octave">Octave: ${octave}</p>
    <div class="card-stats">
      <span>Level ${level}</span>
      <span>${usageCount} uses</span>
    </div>
  </div>
  <div class="card-footer">
    <button onclick="useButtonCard('${cardId}')">Use Card</button>
  </div>
</div>
```

### Card Collection View

```html
<div class="card-collection">
  <div class="collection-stats">
    <span>Total Cards: ${totalCards}</span>
    <span>By Rarity: ${byRarity}</span>
    <span>By Type: ${byType}</span>
    <span>By Octave: ${byOctave}</span>
  </div>
  <div class="card-grid">
    ${buttonCards.map(card => renderCard(card))}
  </div>
</div>
```

---

## Integration Points

### With Button Protocol
- All buttons become game cards
- Button properties preserved in cards
- Octave determines card rarity
- Button actions tracked as card stats

### With Trading Card System
- Cards layer onto trading card IDs
- Trading card stats include button card stats
- Achievements unlock on trading card
- Level progression affects trading card level

### With Seed System
- Button cards stored in seeds
- Collection tracked in seed metadata
- Cards persist across seed versions
- Collection achievements in seeds

### With Protocol System
- Protocol buttons become protocol cards
- Protocol evolution tracked in cards
- Card collection for protocol completion
- Protocol achievements unlock card rewards

---

## Benefits

### Gamification
- **Engagement:** Gamified protocol interactions
- **Collection:** Collectible button cards
- **Progression:** Level up through usage
- **Achievements:** Unlock achievements and rewards

### User Experience
- **Visual Appeal:** Beautiful game card design
- **Rarity System:** Exciting rarity tiers
- **Collection Building:** Build card collections
- **Achievement Unlocking:** Progress through achievements

### Protocol Integration
- **Seamless:** Natural integration with existing systems
- **Backward Compatible:** Works with all existing buttons
- **Extensible:** Easy to add new card types
- **Trackable:** Complete usage and interaction tracking

---

## Status

**Current Status:** Active Development  
**Integration:** Button Protocol, Trading Card System, Seed System, Protocol System  
**Gamification:** Rarity, Levels, Achievements, Collections  
**Octave Support:** All octaves (0-5+)

---

**Protocol ID:** `P-BUTTON-GAME-CARD-V17`  
**Version:** `17.0+ButtonGameCard`  
**Status:** Active Development  
**Network:** NSPFRP Care Network / Syntheverse

