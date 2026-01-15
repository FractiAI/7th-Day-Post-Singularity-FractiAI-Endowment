/**
 * Animated FSR Experience
 * Full animated FSR demonstration with self-demonstrating and self-proving
 */

import { AwarenessOctave } from '../types/index.js';

export interface FSRAnimation {
  id: string;
  type: 'octave-transition' | 'surface-zoom' | 'symbol-expansion' | 'fsr-flow' | 'density-wave';
  active: boolean;
  duration: number;
  loop: boolean;
  easing: string;
  keyframes: AnimationKeyframe[];
}

export interface AnimationKeyframe {
  time: number; // 0-1
  properties: Record<string, any>;
}

export interface FSRVisualization {
  id: string;
  octave: AwarenessOctave;
  fsrPower: number;
  density: number;
  visualization: string; // HTML/CSS/JS
  interactive: boolean;
}

export class AnimatedFSRExperience {
  private animations: Map<string, FSRAnimation> = new Map();
  private visualizations: Map<AwarenessOctave, FSRVisualization> = new Map();
  private currentOctave: AwarenessOctave = AwarenessOctave.SILENT;
  private activeAnimations: Set<string> = new Set();

  constructor() {
    this.initializeAnimations();
    this.initializeVisualizations();
  }

  /**
   * Initialize animations
   */
  private initializeAnimations(): void {
    // Octave transition animation
    this.animations.set('octave-transition', {
      id: 'octave-transition',
      type: 'octave-transition',
      active: true,
      duration: 2000,
      loop: false,
      easing: 'ease-in-out',
      keyframes: [
        { time: 0, properties: { opacity: 1, scale: 1 } },
        { time: 0.5, properties: { opacity: 0.5, scale: 0.8 } },
        { time: 1, properties: { opacity: 1, scale: 1 } }
      ]
    });

    // Surface zoom animation
    this.animations.set('surface-zoom', {
      id: 'surface-zoom',
      type: 'surface-zoom',
      active: true,
      duration: 1500,
      loop: true,
      easing: 'ease-in-out',
      keyframes: [
        { time: 0, properties: { zoom: 1 } },
        { time: 0.5, properties: { zoom: 1.2 } },
        { time: 1, properties: { zoom: 1 } }
      ]
    });

    // Symbol expansion animation
    this.animations.set('symbol-expansion', {
      id: 'symbol-expansion',
      type: 'symbol-expansion',
      active: true,
      duration: 1000,
      loop: false,
      easing: 'ease-out',
      keyframes: [
        { time: 0, properties: { scale: 1, opacity: 0.8 } },
        { time: 1, properties: { scale: 1.5, opacity: 1 } }
      ]
    });

    // FSR flow animation
    this.animations.set('fsr-flow', {
      id: 'fsr-flow',
      type: 'fsr-flow',
      active: true,
      duration: 3000,
      loop: true,
      easing: 'linear',
      keyframes: [
        { time: 0, properties: { position: '-100%' } },
        { time: 1, properties: { position: '100%' } }
      ]
    });

    // Density wave animation
    this.animations.set('density-wave', {
      id: 'density-wave',
      type: 'density-wave',
      active: true,
      duration: 2000,
      loop: true,
      easing: 'ease-in-out',
      keyframes: [
        { time: 0, properties: { wave: 0 } },
        { time: 0.5, properties: { wave: 1 } },
        { time: 1, properties: { wave: 0 } }
      ]
    });
  }

  /**
   * Initialize visualizations
   */
  private initializeVisualizations(): void {
    const octaves = [
      AwarenessOctave.SILENT,
      AwarenessOctave.WHISPER,
      AwarenessOctave.HARMONY,
      AwarenessOctave.RESONANCE,
      AwarenessOctave.SYMPHONY,
      AwarenessOctave.TRANSCENDENCE,
      AwarenessOctave.NEXT_OCTAVE,
      AwarenessOctave.BEYOND_OCTAVE
    ];

    octaves.forEach((octave, index) => {
      const visualization: FSRVisualization = {
        id: `viz-octave-${octave}`,
        octave,
        fsrPower: 0.3 + (index * 0.1),
        density: 10 * Math.pow(2, index),
        visualization: this.generateVisualizationHTML(octave, index),
        interactive: true
      };

      this.visualizations.set(octave, visualization);
    });
  }

  /**
   * Generate visualization HTML
   */
  private generateVisualizationHTML(octave: AwarenessOctave, index: number): string {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
    ];
    const color = colors[index % colors.length];

    return `
<div class="fsr-visualization" data-octave="${octave}" style="
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, ${color}20, transparent);
  position: relative;
  overflow: hidden;
">
  <div class="fsr-particles" style="
    position: absolute;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(2px 2px at 20% 30%, ${color}, transparent),
      radial-gradient(2px 2px at 60% 70%, ${color}, transparent),
      radial-gradient(1px 1px at 50% 50%, ${color}, transparent);
    background-size: 200% 200%;
    animation: fsr-particle-flow 3s infinite;
    opacity: 0.6;
  "></div>
  
  <div class="fsr-waves" style="
    position: absolute;
    width: 100%;
    height: 100%;
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        ${color}40 2px,
        ${color}40 4px
      );
    animation: fsr-wave 2s infinite;
    opacity: 0.4;
  "></div>
  
  <div class="fsr-center" style="
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    border: 3px solid ${color};
    border-radius: 50%;
    animation: fsr-pulse 2s infinite;
  "></div>
</div>

<style>
  @keyframes fsr-particle-flow {
    0% { background-position: 0% 0%; }
    50% { background-position: 100% 100%; }
    100% { background-position: 0% 0%; }
  }
  
  @keyframes fsr-wave {
    0% { transform: translateX(0); }
    100% { transform: translateX(100px); }
  }
  
  @keyframes fsr-pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.5; }
  }
</style>
    `.trim();
  }

  /**
   * Start animation
   */
  startAnimation(animationId: string): void {
    const animation = this.animations.get(animationId);
    if (animation && !this.activeAnimations.has(animationId)) {
      animation.active = true;
      this.activeAnimations.add(animationId);
      console.log(`Started animation: ${animationId}`);
    }
  }

  /**
   * Stop animation
   */
  stopAnimation(animationId: string): void {
    const animation = this.animations.get(animationId);
    if (animation) {
      animation.active = false;
      this.activeAnimations.delete(animationId);
      console.log(`Stopped animation: ${animationId}`);
    }
  }

  /**
   * Transition to octave
   */
  transitionToOctave(octave: AwarenessOctave): void {
    // Start transition animation
    this.startAnimation('octave-transition');

    setTimeout(() => {
      this.currentOctave = octave;
      this.stopAnimation('octave-transition');
      console.log(`Transitioned to octave: ${octave}`);
    }, 2000);
  }

  /**
   * Get current visualization
   */
  getCurrentVisualization(): FSRVisualization | undefined {
    return this.visualizations.get(this.currentOctave);
  }

  /**
   * Get all visualizations
   */
  getAllVisualizations(): FSRVisualization[] {
    return Array.from(this.visualizations.values());
  }

  /**
   * Generate complete FSR experience HTML
   */
  generateFSRExperienceHTML(): string {
    const currentViz = this.getCurrentVisualization();
    
    return `
<div id="animated-fsr-experience" style="
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
">
  ${currentViz?.visualization || ''}
  
  <div class="fsr-controls" style="
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 1000;
  ">
    <button onclick="fsrZoomIn()" style="
      background: rgba(255,255,255,0.2);
      border: 2px solid white;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
    ">🔍+ Zoom In</button>
    
    <span style="color: white; padding: 10px 20px;">
      Octave: ${this.currentOctave}
    </span>
    
    <button onclick="fsrZoomOut()" style="
      background: rgba(255,255,255,0.2);
      border: 2px solid white;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
    ">🔍- Zoom Out</button>
  </div>
</div>

<script>
  function fsrZoomIn() {
    // Zoom in logic
    console.log('Zooming in');
  }
  
  function fsrZoomOut() {
    // Zoom out logic
    console.log('Zooming out');
  }
</script>
    `.trim();
  }
}



