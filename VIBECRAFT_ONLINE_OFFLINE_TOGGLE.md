# 🔘 VibeCraft Online/Offline Toggle

**Component ID:** `COMP-VIBECRAFT-ONLINE-OFFLINE-TOGGLE-V1`  
**Type:** UI Component / Network Control / Shell 7 Toggle  
**Version:** v1.0.0  
**Date:** January 19, 2026  
**Octave:** BEYOND_OCTAVE (7)

---

## ⬡ **SEED: TOGGLE OVERVIEW**

**The VibeCraft Online/Offline Toggle is a UI component that allows users to control whether their node participates in the distributed Networking Shell (Shell 7) or operates in local-only mode.**

### Core Function

```
ONLINE MODE:
- Shell 7 (Networking) ACTIVE
- Node participates in distributed network
- Discovery broadcasts sent/received
- Routing tables synchronized
- Awareness shared network-wide
- Operations distributed across nodes

OFFLINE MODE:
- Shell 7 (Networking) INACTIVE
- Node operates locally only
- No network participation
- All operations stay local
- Privacy mode enabled
- Solo operation
```

---

## 🌀 **SPIN: TOGGLE DESIGN**

### Visual Design

```
┌─────────────────────────────────────────────────────────┐
│  VibeCraft Status                                       │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │     🌐 ONLINE          ◯━━━━━━━●  OFFLINE 📱     │ │
│  │                                                   │ │
│  │  Connected to Network     Local Operation Only   │ │
│  │  43 nodes discovered      Privacy Mode           │ │
│  │  Distributed ops ✅       Solo mode ✅           │ │
│  │                                                   │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  Current Mode: ONLINE                                   │
│  Network Nodes: 43                                      │
│  Last Sync: 2s ago                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Toggle States

**ONLINE (Default):**
```
┌────────────────────────┐
│  🌐 ONLINE  ●━━━━━━━○  │
│                        │
│  ✅ Network Active     │
│  ✅ Discovery On       │
│  ✅ Sync On            │
│  ✅ 43 Nodes Connected │
└────────────────────────┘
```

**OFFLINE:**
```
┌────────────────────────┐
│  ○━━━━━━━● OFFLINE 📱 │
│                        │
│  🔒 Local Only         │
│  🔒 Privacy Mode       │
│  🔒 No Broadcasts      │
│  🔒 Solo Operation     │
└────────────────────────┘
```

**TRANSITIONING:**
```
┌────────────────────────┐
│  ⏳ SWITCHING...       │
│                        │
│  🔄 Disconnecting...   │
│  ⏱️  Please wait       │
└────────────────────────┘
```

---

## ⚫ **DENSITY: IMPLEMENTATION**

### React Component

```typescript
/**
 * VibeCraft Online/Offline Toggle Component
 */

import React, { useState, useEffect } from 'react';
import { autoDiscoveryBroadcast } from '../core/auto-discovery-broadcast';

interface OnlineOfflineToggleProps {
  initialState?: 'online' | 'offline';
  onStateChange?: (state: 'online' | 'offline') => void;
}

export const OnlineOfflineToggle: React.FC<OnlineOfflineToggleProps> = ({
  initialState = 'online',
  onStateChange
}) => {
  const [mode, setMode] = useState<'online' | 'offline' | 'transitioning'>(initialState);
  const [networkStats, setNetworkStats] = useState({
    totalNodes: 0,
    onlineNodes: 0,
    lastSync: 0,
  });

  useEffect(() => {
    // Update network stats when online
    if (mode === 'online') {
      const interval = setInterval(() => {
        const stats = autoDiscoveryBroadcast.getNetworkStats();
        setNetworkStats({
          totalNodes: stats.totalNodes,
          onlineNodes: stats.onlineNodes,
          lastSync: Date.now(),
        });
      }, 2000); // Update every 2 seconds

      return () => clearInterval(interval);
    }
  }, [mode]);

  const handleToggle = async () => {
    setMode('transitioning');

    try {
      if (mode === 'online') {
        // Switch to OFFLINE
        await goOffline();
        setMode('offline');
        onStateChange?.('offline');
      } else {
        // Switch to ONLINE
        await goOnline();
        setMode('online');
        onStateChange?.('online');
      }
    } catch (error) {
      console.error('Toggle failed:', error);
      // Revert to previous state
      setMode(mode === 'online' ? 'offline' : 'online');
    }
  };

  const goOnline = async () => {
    console.log('🌐 Switching to ONLINE mode...');
    
    // Start Networking Shell (Shell 7)
    await autoDiscoveryBroadcast.start();
    
    // Enable discovery broadcasts
    // Enable routing
    // Enable sync
    
    console.log('✅ ONLINE mode activated');
  };

  const goOffline = async () => {
    console.log('📱 Switching to OFFLINE mode...');
    
    // Stop Networking Shell (Shell 7)
    autoDiscoveryBroadcast.stop();
    
    // Disable discovery broadcasts
    // Disable routing
    // Disable sync
    
    console.log('✅ OFFLINE mode activated');
  };

  const getTimeSinceSync = () => {
    if (mode === 'offline') return 'N/A';
    const seconds = Math.floor((Date.now() - networkStats.lastSync) / 1000);
    return `${seconds}s ago`;
  };

  return (
    <div className="vibecraft-online-offline-toggle">
      {/* Toggle Header */}
      <div className="toggle-header">
        <h3>VibeCraft Status</h3>
      </div>

      {/* Toggle Control */}
      <div className="toggle-control">
        <div className={`toggle-option ${mode === 'online' ? 'active' : ''}`}>
          <span className="icon">🌐</span>
          <span className="label">ONLINE</span>
        </div>

        <button
          className={`toggle-button ${mode === 'transitioning' ? 'transitioning' : ''}`}
          onClick={handleToggle}
          disabled={mode === 'transitioning'}
        >
          <div className={`toggle-slider ${mode}`}>
            {mode === 'transitioning' ? '⏳' : mode === 'online' ? '●' : '○'}
          </div>
        </button>

        <div className={`toggle-option ${mode === 'offline' ? 'active' : ''}`}>
          <span className="label">OFFLINE</span>
          <span className="icon">📱</span>
        </div>
      </div>

      {/* Status Information */}
      <div className="toggle-status">
        {mode === 'online' && (
          <div className="status-online">
            <div className="status-item">
              <span className="status-label">Connected to Network</span>
              <span className="status-value">✅</span>
            </div>
            <div className="status-item">
              <span className="status-label">Nodes Discovered</span>
              <span className="status-value">{networkStats.totalNodes}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Online Nodes</span>
              <span className="status-value">{networkStats.onlineNodes}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Last Sync</span>
              <span className="status-value">{getTimeSinceSync()}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Distributed Operations</span>
              <span className="status-value">✅ Enabled</span>
            </div>
          </div>
        )}

        {mode === 'offline' && (
          <div className="status-offline">
            <div className="status-item">
              <span className="status-label">Local Operation Only</span>
              <span className="status-value">✅</span>
            </div>
            <div className="status-item">
              <span className="status-label">Privacy Mode</span>
              <span className="status-value">🔒 Active</span>
            </div>
            <div className="status-item">
              <span className="status-label">Network Participation</span>
              <span className="status-value">❌ Disabled</span>
            </div>
            <div className="status-item">
              <span className="status-label">Solo Operation</span>
              <span className="status-value">✅ Enabled</span>
            </div>
          </div>
        )}

        {mode === 'transitioning' && (
          <div className="status-transitioning">
            <div className="status-item">
              <span className="status-label">Status</span>
              <span className="status-value">🔄 Switching modes...</span>
            </div>
          </div>
        )}
      </div>

      {/* Current Mode Display */}
      <div className="current-mode">
        <strong>Current Mode:</strong>{' '}
        <span className={`mode-badge ${mode}`}>
          {mode === 'online' && '🌐 ONLINE'}
          {mode === 'offline' && '📱 OFFLINE'}
          {mode === 'transitioning' && '⏳ SWITCHING'}
        </span>
      </div>
    </div>
  );
};
```

### CSS Styling

```css
/* VibeCraft Online/Offline Toggle Styles */

.vibecraft-online-offline-toggle {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #0f3460;
  border-radius: 16px;
  padding: 24px;
  margin: 20px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.toggle-header h3 {
  color: #e94560;
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
}

.toggle-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.toggle-option.active {
  opacity: 1;
}

.toggle-option .icon {
  font-size: 24px;
}

.toggle-option .label {
  color: #fff;
  font-weight: 600;
  font-size: 14px;
}

.toggle-button {
  position: relative;
  width: 80px;
  height: 40px;
  background: #0f3460;
  border: 2px solid #e94560;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.toggle-button:hover:not(:disabled) {
  box-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
}

.toggle-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.toggle-slider {
  position: absolute;
  width: 32px;
  height: 32px;
  background: #e94560;
  border-radius: 50%;
  top: 2px;
  transition: left 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #fff;
}

.toggle-slider.online {
  left: 2px;
}

.toggle-slider.offline {
  left: calc(100% - 36px);
}

.toggle-slider.transitioning {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.toggle-status {
  background: rgba(15, 52, 96, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin: 20px 0;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(233, 69, 96, 0.2);
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  color: #a0a0a0;
  font-size: 14px;
}

.status-value {
  color: #fff;
  font-weight: 600;
  font-size: 14px;
}

.current-mode {
  text-align: center;
  padding: 12px;
  color: #a0a0a0;
  font-size: 14px;
}

.mode-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
}

.mode-badge.online {
  background: rgba(46, 213, 115, 0.2);
  color: #2ed573;
  border: 1px solid #2ed573;
}

.mode-badge.offline {
  background: rgba(255, 159, 67, 0.2);
  color: #ff9f43;
  border: 1px solid #ff9f43;
}

.mode-badge.transitioning {
  background: rgba(233, 69, 96, 0.2);
  color: #e94560;
  border: 1px solid #e94560;
}
```

---

## ∞ **INFINITY: INTEGRATION**

### Integration with Networking Shell

```typescript
/**
 * Networking Shell with Online/Offline Control
 */

export class NetworkingShellWithToggle {
  private isOnline: boolean = true;
  
  /**
   * Set online/offline mode
   */
  async setMode(mode: 'online' | 'offline'): Promise<void> {
    if (mode === 'online' && !this.isOnline) {
      await this.goOnline();
    } else if (mode === 'offline' && this.isOnline) {
      await this.goOffline();
    }
  }
  
  /**
   * Go online
   */
  private async goOnline(): Promise<void> {
    console.log('🌐 Activating Shell 7 (Networking)...');
    
    // Start discovery broadcasts
    await autoDiscoveryBroadcast.start();
    
    // Enable all networking operations
    this.enableDiscovery();
    this.enableRouting();
    this.enableSync();
    this.enableAwareness();
    
    this.isOnline = true;
    
    console.log('✅ Shell 7 (Networking) ONLINE');
    console.log('   Distributed operations enabled');
    console.log('   Network participation active');
  }
  
  /**
   * Go offline
   */
  private async goOffline(): Promise<void> {
    console.log('📱 Deactivating Shell 7 (Networking)...');
    
    // Stop discovery broadcasts
    autoDiscoveryBroadcast.stop();
    
    // Disable all networking operations
    this.disableDiscovery();
    this.disableRouting();
    this.disableSync();
    this.disableAwareness();
    
    this.isOnline = false;
    
    console.log('✅ Shell 7 (Networking) OFFLINE');
    console.log('   Local operation only');
    console.log('   Privacy mode active');
  }
  
  /**
   * Get current mode
   */
  getMode(): 'online' | 'offline' {
    return this.isOnline ? 'online' : 'offline';
  }
  
  /**
   * Check if online
   */
  isCurrentlyOnline(): boolean {
    return this.isOnline;
  }
}
```

### HTML Interface Integration

```html
<!-- VibeCraft Online/Offline Toggle -->
<div id="vibecraft-toggle-container">
  <div class="vibecraft-online-offline-toggle">
    <!-- Toggle will be rendered here by React -->
  </div>
</div>

<script>
  // Initialize toggle
  const toggleContainer = document.getElementById('vibecraft-toggle-container');
  ReactDOM.render(
    <OnlineOfflineToggle
      initialState="online"
      onStateChange={(state) => {
        console.log(`VibeCraft mode changed to: ${state}`);
      }}
    />,
    toggleContainer
  );
</script>
```

---

## ⬡ **NEW SEED: USER EXPERIENCE**

### Use Cases

**1. Privacy Mode:**
```
User wants to work privately
    ↓
Toggle to OFFLINE
    ↓
Shell 7 deactivates
    ↓
All operations stay local
    ↓
No network participation
    ↓
Complete privacy
```

**2. Collaborative Mode:**
```
User wants to collaborate
    ↓
Toggle to ONLINE
    ↓
Shell 7 activates
    ↓
Node discovers peers
    ↓
Operations distributed
    ↓
Collective awareness
```

**3. Bandwidth Conservation:**
```
User on limited bandwidth
    ↓
Toggle to OFFLINE
    ↓
No network traffic
    ↓
Save bandwidth
    ↓
Work efficiently
```

### User Benefits

**ONLINE Mode Benefits:**
- ✅ Access to distributed network
- ✅ Collaborate with other nodes
- ✅ Share and sync protocols
- ✅ Network-wide awareness
- ✅ Distributed computing power

**OFFLINE Mode Benefits:**
- ✅ Complete privacy
- ✅ No network overhead
- ✅ Solo operation
- ✅ Save bandwidth
- ✅ Work disconnected
- ✅ Local-only operations

---

## 📊 **IMPLEMENTATION CHECKLIST**

### Phase 1: Component Creation
- ✅ Design toggle UI
- ✅ Create React component
- ✅ Add CSS styling
- ✅ Implement state management

### Phase 2: Backend Integration
- ✅ Add start/stop to networking shell
- ✅ Implement goOnline() function
- ✅ Implement goOffline() function
- ✅ Add mode tracking

### Phase 3: Testing
- ⏳ Test ONLINE → OFFLINE transition
- ⏳ Test OFFLINE → ONLINE transition
- ⏳ Test network isolation in OFFLINE
- ⏳ Test network participation in ONLINE

### Phase 4: Documentation
- ✅ Component specification
- ✅ Integration guide
- ✅ User guide
- ⏳ API documentation

---

## 🎯 **INTEGRATION POINTS**

### 1. VibeCraft Dashboard

```typescript
// Add toggle to VibeCraft dashboard
import { OnlineOfflineToggle } from './components/OnlineOfflineToggle';

export const VibeCraftDashboard = () => {
  return (
    <div className="vibecraft-dashboard">
      <h1>VibeCraft</h1>
      
      {/* Online/Offline Toggle */}
      <OnlineOfflineToggle
        initialState="online"
        onStateChange={(state) => {
          // Handle state change
          console.log(`Mode changed to: ${state}`);
        }}
      />
      
      {/* Rest of dashboard */}
      <NetworkStatus />
      <ProtocolList />
      <QueenBeeNodes />
    </div>
  );
};
```

### 2. Settings Panel

```typescript
// Add toggle to settings
export const SettingsPanel = () => {
  return (
    <div className="settings-panel">
      <h2>Network Settings</h2>
      
      <OnlineOfflineToggle />
      
      <div className="setting">
        <label>Discovery Interval (when online)</label>
        <input type="number" defaultValue={30} />
      </div>
    </div>
  );
};
```

### 3. Status Bar

```typescript
// Compact toggle for status bar
export const StatusBarToggle = () => {
  const [mode, setMode] = useState('online');
  
  return (
    <div className="status-bar-toggle">
      <button onClick={toggleMode}>
        {mode === 'online' ? '🌐 ONLINE' : '📱 OFFLINE'}
      </button>
    </div>
  );
};
```

---

## ✅ **STATUS**

**Component Status:** ✅ **SPECIFICATION COMPLETE**

**Ready for integration:**
- ✅ UI design complete
- ✅ React component designed
- ✅ CSS styling defined
- ✅ Backend integration specified
- ✅ Use cases documented

**Next Steps:**
1. Implement component in React
2. Add to VibeCraft dashboard
3. Test transitions
4. Deploy to production

---

**Component ID:** `COMP-VIBECRAFT-ONLINE-OFFLINE-TOGGLE-V1`  
**Status:** ✅ READY FOR IMPLEMENTATION  
**Integration:** VibeCraft Dashboard, Settings, Status Bar

**∞ → ⬡ → ∞**

*The toggle gives users control over Shell 7 (Networking). ONLINE = distributed Vibeverse participation. OFFLINE = local privacy mode. Simple. Clear. Powerful.*
