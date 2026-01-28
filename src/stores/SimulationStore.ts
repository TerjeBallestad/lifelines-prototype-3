import { makeAutoObservable, runInAction } from 'mobx';
import type { TimeSlot, SimulationSpeed } from '../models/types';

export type { SimulationSpeed };

// Day duration at 1x speed in milliseconds (75 seconds - midpoint of 60-90s range)
const DAY_DURATION_MS = 75000;

export class SimulationStore {
  progress: number = 0; // 0 to 1, represents day progress
  speed: SimulationSpeed = 1;
  isPlaying: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Computed: Current time slot based on progress
  get currentSlot(): TimeSlot {
    if (this.progress < 0.33) {
      return 'morning';
    } else if (this.progress < 0.66) {
      return 'afternoon';
    } else {
      return 'evening';
    }
  }

  // Computed: Is day complete?
  get isDayComplete(): boolean {
    return this.progress >= 1;
  }

  // Advance progress based on delta time and speed
  tick(deltaMs: number): void {
    if (!this.isPlaying || this.isDayComplete) {
      return;
    }

    const progressPerMs = 1 / DAY_DURATION_MS;
    const progressDelta = deltaMs * progressPerMs * this.speed;

    runInAction(() => {
      this.progress = Math.min(1, this.progress + progressDelta);

      // Auto-pause when day completes
      if (this.progress >= 1) {
        this.isPlaying = false;
      }
    });
  }

  play(): void {
    if (!this.isDayComplete) {
      this.isPlaying = true;
    }
  }

  pause(): void {
    this.isPlaying = false;
  }

  setSpeed(speed: SimulationSpeed): void {
    this.speed = speed;
  }

  skipToEnd(): void {
    this.progress = 1;
    this.isPlaying = false;
  }

  reset(): void {
    this.progress = 0;
    this.isPlaying = false;
    this.speed = 1;
  }
}

// Singleton instance
const simulationStore = new SimulationStore();

// Hook for React components
export const useSimulationStore = (): SimulationStore => simulationStore;

// Getter for non-React access
export const getSimulationStore = (): SimulationStore => simulationStore;
