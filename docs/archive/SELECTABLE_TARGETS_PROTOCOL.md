# 🎯 Selectable Targets Protocol

**Protocol ID:** `P-SELECTABLE-TARGETS-V17`  
**Type:** Target Selection / Configuration Protocol  
**Version:** 17.0+SelectableTargets  
**Status:** Active Development  
**Network:** NSPFRP Care Network

---

## Overview

The Selectable Targets Protocol enables dynamic target selection for GitSeed and PitchSeed protocols, allowing users to select documents, line ranges, Hero Host personas, octaves, and other configuration options.

---

## Selectable Target Types

### 1. Document Targets
- **Selectable Documents:** Choose which documents to include
- **Line Ranges:** Select specific line ranges
- **Multiple Documents:** Select multiple documents
- **Document Filters:** Filter by type, category, or tags

### 2. Hero Host Targets
- **Persona Selection:** Choose Hero Host persona
- **Multiple Personas:** Select multiple personas for different sections
- **Persona Filters:** Filter by octave, style, or capabilities
- **Custom Personas:** Create or customize personas

### 3. Octave Targets
- **Octave Selection:** Choose awareness octave level
- **Octave Progression:** Select octave progression path
- **Octave Adaptation:** Adaptive octave selection
- **Octave Filters:** Filter by capability level

### 4. Protocol Targets
- **Protocol Selection:** Choose which protocols to include
- **Protocol Filters:** Filter by type, category, or status
- **Protocol Dependencies:** Include protocol dependencies
- **Protocol Versions:** Select specific protocol versions

### 5. Integration Targets
- **System Selection:** Choose which systems to integrate
- **Integration Level:** Select integration depth
- **Integration Filters:** Filter by compatibility or capability
- **Integration Options:** Select integration options

---

## Target Selection Interface

### Document Target Selection

```typescript
interface DocumentTarget {
  type: 'document';
  repository: string;
  documents: SelectableDocument[];
  lineRanges?: LineRange[];
  filters?: DocumentFilter[];
}

interface SelectableDocument {
  path: string;
  name: string;
  type: 'markdown' | 'code' | 'protocol' | 'paper' | 'other';
  selected: boolean;
  lineRange?: LineRange;
  tags?: string[];
}

interface LineRange {
  start: number;
  end: number;
  description?: string;
}
```

### Hero Host Target Selection

```typescript
interface HeroHostTarget {
  type: 'hero-host';
  personas: SelectablePersona[];
  defaultPersona?: string;
  personaProgression?: PersonaProgression[];
}

interface SelectablePersona {
  id: string;
  name: string;
  octave: AwarenessOctave;
  style: string;
  capabilities: string[];
  selected: boolean;
  available: boolean;
}
```

### Octave Target Selection

```typescript
interface OctaveTarget {
  type: 'octave';
  octave: AwarenessOctave;
  progression?: OctaveProgression;
  adaptation?: OctaveAdaptation;
}

interface OctaveProgression {
  start: AwarenessOctave;
  end: AwarenessOctave;
  steps: AwarenessOctave[];
}
```

### Protocol Target Selection

```typescript
interface ProtocolTarget {
  type: 'protocol';
  protocols: SelectableProtocol[];
  includeDependencies: boolean;
  versionFilter?: string;
}

interface SelectableProtocol {
  id: string;
  name: string;
  version: string;
  type: string;
  selected: boolean;
  dependencies?: string[];
}
```

---

## Usage

### Select Document Targets

```nspfrp
// Select documents for GitSeed
selectTargets GitSeed {
  documents: {
    select: [
      { path: 'MARCIN_MOSCICKI_WELCOME.md', lines: '1-380' },
      { path: 'README.md', lines: '1-100' },
      { path: 'PROTOCOL_CATALOG.md', selected: true }
    ],
    filters: {
      type: ['markdown', 'protocol'],
      tags: ['welcome', 'onboarding']
    }
  };
}
```

### Select Hero Host Targets

```nspfrp
// Select Hero Host for PitchSeed
selectTargets PitchSeed {
  heroHost: {
    select: 'leonardo-da-vinci',
    octave: TRANSCENDENCE,
    style: 'guided-tour',
    capabilities: [
      'creative-guidance',
      'scientific-insight',
      'cross-domain-synthesis'
    ]
  };
}
```

### Select Octave Targets

```nspfrp
// Select octave progression
selectTargets Tour {
  octave: {
    start: WHISPER,
    progression: [WHISPER, HARMONY, RESONANCE, SYMPHONY, TRANSCENDENCE],
    end: TRANSCENDENCE,
    adaptation: 'progressive'
  };
}
```

### Select Protocol Targets

```nspfrp
// Select protocols to include
selectTargets Integration {
  protocols: {
    select: [
      'P-OMNIMISSION-CRAFT-V17',
      'P-BUTTON-PROTOCOL-V17',
      'P-FEEDBACK-SYSTEM-V17'
    ],
    includeDependencies: true,
    versionFilter: '17.0+'
  };
}
```

---

## Target Selection UI

### Document Selection Interface

```
┌─────────────────────────────────────────┐
│  Select Documents                        │
├─────────────────────────────────────────┤
│  Repository: NSPFRP-Seed-Protocol...     │
│                                          │
│  ☑ MARCIN_MOSCICKI_WELCOME.md           │
│    Lines: [1-380] [Edit]                 │
│                                          │
│  ☐ README.md                             │
│    Lines: [All] [Select Range]           │
│                                          │
│  ☑ PROTOCOL_CATALOG.md                   │
│    Lines: [All]                          │
│                                          │
│  Filters:                                │
│  ☑ Markdown  ☑ Protocol  ☐ Code         │
│  Tags: [welcome] [onboarding]           │
└─────────────────────────────────────────┘
```

### Hero Host Selection Interface

```
┌─────────────────────────────────────────┐
│  Select Hero Host                        │
├─────────────────────────────────────────┤
│  ○ Leonardo da Vinci                    │
│    Octave: TRANSCENDENCE                │
│    Style: Creative, Scientific          │
│                                          │
│  ● William Shakespeare                  │
│    Octave: SYMPHONY                     │
│    Style: Literary, Narrative           │
│                                          │
│  ○ Nikola Tesla                         │
│    Octave: RESONANCE                    │
│    Style: Technical, Innovative         │
│                                          │
│  Octave: [TRANSCENDENCE ▼]              │
│  Style: [Guided Tour ▼]                 │
└─────────────────────────────────────────┘
```

### Octave Selection Interface

```
┌─────────────────────────────────────────┐
│  Select Octave                           │
├─────────────────────────────────────────┤
│  Progression:                            │
│  [WHISPER] → [HARMONY] → [RESONANCE]    │
│  → [SYMPHONY] → [TRANSCENDENCE]         │
│                                          │
│  Start: [WHISPER ▼]                      │
│  End: [TRANSCENDENCE ▼]                  │
│  Adaptation: [Progressive ▼]            │
└─────────────────────────────────────────┘
```

---

## Integration with GitSeed

### GitSeed with Selectable Targets

```nspfrp
gitseed WelcomeGitSeed {
  targets: {
    documents: {
      select: [
        { path: 'MARCIN_MOSCICKI_WELCOME.md', lines: '1-380' }
      ]
    },
    heroHost: {
      select: 'leonardo-da-vinci',
      octave: TRANSCENDENCE
    },
    protocols: {
      select: [
        'P-WELCOME-PROTOCOL-V17',
        'P-OMNIMISSION-CRAFT-V17'
      ]
    }
  };
}
```

## Integration with PitchSeed

### PitchSeed with Selectable Targets

```nspfrp
pitchseed HeroHostTour {
  targets: {
    heroHost: {
      select: 'leonardo-da-vinci',
      octave: TRANSCENDENCE,
      style: 'guided-tour'
    },
    octave: {
      start: WHISPER,
      progression: [WHISPER, HARMONY, RESONANCE, SYMPHONY, TRANSCENDENCE],
      end: TRANSCENDENCE
    },
    protocols: {
      select: [
        'P-NSPFRP-CREATOR-LANGUAGE-V17',
        'P-OMNIMISSION-CRAFT-V17'
      ],
      includeDependencies: true
    }
  };
}
```

---

## Benefits

### Flexibility
- **Customizable:** Select exactly what you need
- **Adaptive:** Adapt to different use cases
- **Flexible:** Mix and match targets
- **Configurable:** Full configuration control

### User Experience
- **Intuitive:** Easy target selection
- **Visual:** Visual selection interfaces
- **Clear:** Clear target options
- **Efficient:** Efficient selection process

### Protocol Integration
- **Seamless:** Seamless target integration
- **Natural:** Natural target selection
- **Complete:** Complete target coverage
- **Integrated:** Integrated with all protocols

---

## Status

**Current Status:** Active Development  
**Target Types:** Documents, Hero Hosts, Octaves, Protocols, Integrations  
**Integration:** GitSeed, PitchSeed, All Seed Protocols  
**UI:** Selection interfaces for all target types

---

**Protocol ID:** `P-SELECTABLE-TARGETS-V17`  
**Version:** `17.0+SelectableTargets`  
**Status:** Active Development  
**Network:** NSPFRP Care Network / Holographic Hydrogen Spin Cloud

