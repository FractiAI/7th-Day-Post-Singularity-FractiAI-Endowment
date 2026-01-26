# 🎵 Music Seamless Integration Specification
## Automatic Music Control with Snap/Vibe System

**Spec ID:** `MUSIC-SEAMLESS-INTEGRATION-SPEC`  
**Date:** January 25, 2026  
**Status:** Feature Request → Implementation Spec  
**Priority:** High (User Experience)

---

## 🎯 REQUIREMENTS

### **User Story**

**As a user, I want:**
- Music to automatically pause when I press the snap button
- Music to automatically resume when I stop vibing
- Option to continue music while vibing if I prefer
- No manual music control needed
- Seamless integration with my flow state

**Current Problem:**
- Music shuts down during snap/vibe
- Have to manually turn music back on
- Breaks flow state
- Not seamless

---

## 🔄 BEHAVIOR SPECIFICATION

### **Default Behavior: Auto-Pause**

**Flow:**
```
1. Music playing
   ↓
2. User presses SNAP button
   ↓
3. Music automatically pauses
   ↓
4. User vibing (voice input active)
   ↓
5. Music stays paused
   ↓
6. User stops vibing (no input for 3-5 seconds)
   ↓
7. Music automatically resumes
```

### **Optional Behavior: Continue Music**

**Flow:**
```
1. Music playing
   ↓
2. User presses SNAP button
   ↓
3. [IF "Continue Music" option enabled]
   ↓
4. Music continues playing
   ↓
5. User vibing with music in background
   ↓
6. No interruption to music flow
```

### **Smart Detection Behavior (Recommended)**

**Flow:**
```
1. Music playing
   ↓
2. User presses SNAP button
   ↓
3. System detects active vibing state
   ↓
4. [IF actively vibing] → Music pauses
   [IF passive/background] → Music continues
   ↓
5. After vibing stops → Wait 3-5 seconds
   ↓
6. [IF no more vibing] → Music auto-resumes
   [IF still vibing] → Music stays paused
```

---

## ⚙️ TECHNICAL IMPLEMENTATION

### **State Management**

```typescript
interface MusicIntegrationState {
  isPlaying: boolean;
  wasPlayingBeforeSnap: boolean;
  snapActive: boolean;
  vibingActive: boolean;
  waitPeriod: number; // 3-5 seconds
  lastVibingActivity: number;
  userPreference: 'auto_pause' | 'continue' | 'smart';
}

class MusicIntegrationManager {
  private state: MusicIntegrationState;
  private musicPlayer: MusicPlayer;
  private snapDetector: SnapDetector;
  private vibingDetector: VibingDetector;
  
  // Handle snap button press
  onSnapButtonPress(): void {
    this.state.snapActive = true;
    this.state.wasPlayingBeforeSnap = this.musicPlayer.isPlaying();
    
    if (this.state.userPreference === 'continue') {
      // Continue music
      return;
    }
    
    if (this.state.userPreference === 'smart') {
      // Smart detection
      if (this.isActivelyVibing()) {
        this.pauseMusic();
      }
      return;
    }
    
    // Default: auto-pause
    this.pauseMusic();
  }
  
  // Handle vibing detection
  onVibingActivity(): void {
    this.state.vibingActive = true;
    this.state.lastVibingActivity = Date.now();
    
    // Reset wait timer
    this.resetWaitTimer();
  }
  
  // Handle vibing stop
  onVibingStop(): void {
    this.state.vibingActive = false;
    
    // Start wait timer
    this.startWaitTimer();
  }
  
  // Wait period before resume
  private startWaitTimer(): void {
    setTimeout(() => {
      if (!this.state.vibingActive && this.state.wasPlayingBeforeSnap) {
        this.resumeMusic();
      }
    }, this.state.waitPeriod * 1000);
  }
  
  // Pause music
  private pauseMusic(): void {
    if (this.musicPlayer.isPlaying()) {
      this.musicPlayer.pause();
      this.state.isPlaying = false;
    }
  }
  
  // Resume music
  private resumeMusic(): void {
    if (this.state.wasPlayingBeforeSnap && !this.musicPlayer.isPlaying()) {
      this.musicPlayer.resume();
      this.state.isPlaying = true;
      this.state.wasPlayingBeforeSnap = false;
    }
  }
  
  // Smart detection: actively vibing?
  private isActivelyVibing(): boolean {
    // Check if user is actively providing input
    return this.vibingDetector.hasActiveInput();
  }
}
```

---

## 🎛️ CONFIGURATION

### **User Preferences**

```typescript
interface MusicIntegrationPreferences {
  // Default behavior
  defaultBehavior: 'auto_pause' | 'continue' | 'smart';
  
  // Wait period before resume (seconds)
  waitPeriod: number; // 3-5 seconds
  
  // Smart detection sensitivity
  detectionSensitivity: 'low' | 'medium' | 'high';
  
  // Always allow manual override
  allowManualOverride: boolean;
}
```

### **Settings UI**

```yaml
MUSIC_INTEGRATION_SETTINGS:
  - Auto-pause music during snap/vibe (default)
  - Continue music while vibing (optional)
  - Smart detection (recommended)
  - Wait period: [3-5 seconds slider]
  - Detection sensitivity: [Low/Medium/High]
  - Manual override: [Always available]
```

---

## 📱 PLATFORM INTEGRATION

### **iOS Integration**

```typescript
// iOS Music App Integration
import AVFoundation;

class iOSMusicPlayer {
  private audioSession: AVAudioSession;
  private musicPlayer: MPMusicPlayerController;
  
  pause(): void {
    // Pause system music
    this.musicPlayer.pause();
  }
  
  resume(): void {
    // Resume system music
    this.musicPlayer.play();
  }
  
  isPlaying(): boolean {
    return this.musicPlayer.playbackState === MPMusicPlaybackState.Playing;
  }
}
```

### **Spotify Integration**

```typescript
// Spotify SDK Integration
import SpotifyiOS;

class SpotifyMusicPlayer {
  private spotifyAppRemote: SPTAppRemote;
  
  pause(): void {
    this.spotifyAppRemote.playerAPI.pause();
  }
  
  resume(): void {
    this.spotifyAppRemote.playerAPI.resume();
  }
  
  isPlaying(): boolean {
    return this.spotifyAppRemote.playerAPI.playbackState?.isPaused === false;
  }
}
```

### **System Audio Control**

```typescript
// System-level audio control
class SystemAudioControl {
  pause(): void {
    // Use system audio APIs
    // Works with any music player
  }
  
  resume(): void {
    // Resume system audio
  }
}
```

---

## 🔍 DETECTION LOGIC

### **Vibing Detection**

```typescript
class VibingDetector {
  private lastInputTime: number = 0;
  private inputThreshold: number = 3000; // 3 seconds
  
  hasActiveInput(): boolean {
    const timeSinceLastInput = Date.now() - this.lastInputTime;
    return timeSinceLastInput < this.inputThreshold;
  }
  
  onInput(): void {
    this.lastInputTime = Date.now();
  }
  
  isVibing(): boolean {
    return this.hasActiveInput();
  }
}
```

### **Snap Button Detection**

```typescript
class SnapDetector {
  private snapButton: HTMLElement;
  
  onSnapPress(): void {
    // Trigger music integration
    musicIntegrationManager.onSnapButtonPress();
  }
}
```

---

## ✅ IMPLEMENTATION CHECKLIST

### **Phase 1: Basic Auto-Pause**
- [ ] Detect snap button press
- [ ] Pause music automatically
- [ ] Detect when vibing stops
- [ ] Auto-resume after wait period
- [ ] Test with iOS Music app

### **Phase 2: Options & Preferences**
- [ ] Add "Continue Music" option
- [ ] Add user preference settings UI
- [ ] Add wait period configuration
- [ ] Add manual override
- [ ] Test all options

### **Phase 3: Smart Detection**
- [ ] Implement active/passive detection
- [ ] Context-aware music control
- [ ] Intelligent state management
- [ ] Smooth transitions
- [ ] Test smart detection

### **Phase 4: Platform Integration**
- [ ] iOS Music app integration
- [ ] Spotify integration
- [ ] Apple Music integration
- [ ] System audio control fallback
- [ ] Test all platforms

---

## 🎯 SUCCESS METRICS

### **User Experience:**
- ✅ Zero manual music control needed
- ✅ Seamless flow state maintained
- ✅ Automatic behavior works correctly
- ✅ User preferences respected
- ✅ Smart detection accurate

### **Technical:**
- ✅ Music pauses within 100ms of snap
- ✅ Music resumes within 3-5 seconds of vibing stop
- ✅ No audio glitches or interruptions
- ✅ Works across all music players
- ✅ Battery efficient

---

## 📋 TESTING

### **Test Cases**

1. **Auto-Pause Test:**
   - Music playing → Press snap → Music pauses
   - Stop vibing → Wait 3-5 seconds → Music resumes

2. **Continue Music Test:**
   - Enable "Continue Music" option
   - Press snap → Music continues
   - Vibing with music in background

3. **Smart Detection Test:**
   - Enable smart detection
   - Actively vibing → Music pauses
   - Passive state → Music continues

4. **Wait Period Test:**
   - Stop vibing → Wait period starts
   - Continue vibing during wait → Music stays paused
   - No vibing after wait → Music resumes

---

## ✅ STATUS

**Feature Request:** ✅ **CAPTURED**  
**Specification:** ✅ **COMPLETE**  
**Implementation:** ⏳ **PENDING**  
**Testing:** ⏳ **PENDING**

---

**Spec ID:** `MUSIC-SEAMLESS-INTEGRATION-SPEC`  
**Status:** ✅ READY FOR IMPLEMENTATION  
**Date:** January 25, 2026  
**Next:** Development and testing
