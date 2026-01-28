import { makeAutoObservable, runInAction } from 'mobx';
import type { TimeSlot, SimulationSpeed } from '../models/types';
import { getGameStore } from './GameStore';

export type { SimulationSpeed };

// Day duration at 1x speed in milliseconds (75 seconds - midpoint of 60-90s range)
const DAY_DURATION_MS = 75000;

// Energy change event for visual feedback
export interface EnergyChangeEvent {
  id: string;
  patientId: string;
  value: number;
  timestamp: number; // progress value when created
}

export class SimulationStore {
  progress: number = 0; // 0 to 1, represents day progress
  speed: SimulationSpeed = 1;
  isPlaying: boolean = false;
  energyChanges: EnergyChangeEvent[] = [];
  interventionTokens: number = 3; // Per RESEARCH: "Assume 2-3 tokens per day"
  interveningPatientId: string | null = null;
  private lastAppliedSlot: TimeSlot | null = null;
  private changeIdCounter = 0;

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

  private generateChangeId(): string {
    return `ec-${++this.changeIdCounter}`;
  }

  removeEnergyChange(id: string): void {
    this.energyChanges = this.energyChanges.filter((c) => c.id !== id);
  }

  private applySlotEnergy(slot: TimeSlot): void {
    const gameStore = getGameStore();

    for (const patient of gameStore.patients) {
      const activity = gameStore.getAssignment(patient.id, slot);
      if (activity && activity.energyCost !== 0) {
        // Apply energy change to patient
        patient.energy += activity.energyCost;

        // Queue visual feedback
        this.energyChanges.push({
          id: this.generateChangeId(),
          patientId: patient.id,
          value: activity.energyCost,
          timestamp: this.progress,
        });
      }
    }
  }

  // Advance progress based on delta time and speed
  tick(deltaMs: number): void {
    if (!this.isPlaying || this.isDayComplete) {
      return;
    }

    const progressPerMs = 1 / DAY_DURATION_MS;
    const progressDelta = deltaMs * progressPerMs * this.speed;

    const prevSlot = this.currentSlot;

    runInAction(() => {
      this.progress = Math.min(1, this.progress + progressDelta);
      const newSlot = this.currentSlot;

      // Apply energy change when entering a new slot
      if (
        prevSlot !== newSlot ||
        (this.lastAppliedSlot === null && this.progress > 0)
      ) {
        this.applySlotEnergy(newSlot);
        this.lastAppliedSlot = newSlot;
      }

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
    this.energyChanges = [];
    this.lastAppliedSlot = null;
    this.interventionTokens = 3;
    this.interveningPatientId = null;
  }

  // Open intervention menu for a patient (auto-pauses)
  startIntervention(patientId: string): void {
    if (this.interventionTokens <= 0) return; // No tokens left
    if (this.isDayComplete) return; // Can't intervene after day ends

    this.interveningPatientId = patientId;
    this.pause(); // Auto-pause per CONTEXT
  }

  // Cancel intervention without using token
  cancelIntervention(): void {
    this.interveningPatientId = null;
    // Don't auto-resume - let player decide when to continue
  }

  // Apply intervention: change patient's current slot activity
  applyIntervention(newActivityId: string | null): void {
    if (!this.interveningPatientId) return;
    if (this.interventionTokens <= 0) return;

    const gameStore = getGameStore();

    // Update the schedule for current slot
    gameStore.assignActivity(
      this.interveningPatientId,
      this.currentSlot,
      newActivityId
    );

    // Consume token
    this.interventionTokens--;

    // Close menu
    this.interveningPatientId = null;

    // Auto-resume after intervention
    this.play();
  }

  // Get whether a patient can be intervened
  canIntervene(_patientId: string): boolean {
    return this.interventionTokens > 0 && !this.isDayComplete;
  }
}

// Singleton instance
const simulationStore = new SimulationStore();

// Hook for React components
export const useSimulationStore = (): SimulationStore => simulationStore;

// Getter for non-React access
export const getSimulationStore = (): SimulationStore => simulationStore;
