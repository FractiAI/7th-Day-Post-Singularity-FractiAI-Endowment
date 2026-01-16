/**
 * Guided Tour Engine
 * Automatic guided tour with interactive elements
 */

import { AwarenessOctave } from '../types/index.js';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  type: 'presentation' | 'interactive' | 'demo' | 'surface';
  octave?: AwarenessOctave;
  duration?: number; // seconds
  autoAdvance: boolean;
  interactiveElements: InteractiveElement[];
}

export interface InteractiveElement {
  id: string;
  type: 'button' | 'input' | 'demo' | 'visualization';
  label: string;
  action: string;
  data?: any;
}

export interface TourProgress {
  tourId: string;
  currentStep: number;
  totalSteps: number;
  progress: number;
  startedAt: number;
  estimatedCompletion: number;
}

export class GuidedTourEngine {
  private activeTours: Map<string, TourProgress> = new Map();
  private stepIntervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Start guided tour
   */
  startTour(tourId: string, steps: TourStep[]): TourProgress {
    const progress: TourProgress = {
      tourId,
      currentStep: 0,
      totalSteps: steps.length,
      progress: 0,
      startedAt: Date.now(),
      estimatedCompletion: Date.now() + (steps.reduce((sum, s) => sum + (s.duration || 30), 0) * 1000)
    };

    this.activeTours.set(tourId, progress);

    // Auto-advance if enabled
    if (steps[0]?.autoAdvance) {
      this.autoAdvanceTour(tourId, steps);
    }

    return progress;
  }

  /**
   * Auto-advance tour
   */
  private autoAdvanceTour(tourId: string, steps: TourStep[]): void {
    let currentIndex = 0;

    const advance = () => {
      if (currentIndex >= steps.length) {
        this.completeTour(tourId);
        return;
      }

      const step = steps[currentIndex];
      const progress = this.activeTours.get(tourId);
      
      if (progress) {
        progress.currentStep = currentIndex;
        progress.progress = ((currentIndex + 1) / steps.length) * 100;
      }

      // Trigger step display
      this.displayStep(tourId, step);

      currentIndex++;

      // Schedule next step
      if (step.autoAdvance && currentIndex < steps.length) {
        const duration = step.duration || 30;
        const interval = setTimeout(advance, duration * 1000);
        this.stepIntervals.set(tourId, interval);
      }
    };

    // Start first step
    advance();
  }

  /**
   * Display step
   */
  private displayStep(tourId: string, step: TourStep): void {
    // In real implementation, this would update the UI
    console.log(`Tour ${tourId}: Displaying step "${step.title}"`);
  }

  /**
   * Complete tour
   */
  private completeTour(tourId: string): void {
    const progress = this.activeTours.get(tourId);
    if (progress) {
      progress.progress = 100;
    }

    const interval = this.stepIntervals.get(tourId);
    if (interval) {
      clearTimeout(interval);
      this.stepIntervals.delete(tourId);
    }
  }

  /**
   * Get tour progress
   */
  getTourProgress(tourId: string): TourProgress | undefined {
    return this.activeTours.get(tourId);
  }

  /**
   * Pause tour
   */
  pauseTour(tourId: string): void {
    const interval = this.stepIntervals.get(tourId);
    if (interval) {
      clearTimeout(interval);
      this.stepIntervals.delete(tourId);
    }
  }

  /**
   * Resume tour
   */
  resumeTour(tourId: string, steps: TourStep[]): void {
    const progress = this.activeTours.get(tourId);
    if (progress && progress.currentStep < steps.length) {
      this.autoAdvanceTour(tourId, steps.slice(progress.currentStep));
    }
  }
}









