import { makeAutoObservable, observable } from 'mobx';
import { Patient } from '../models/Patient';
import { Activity } from '../models/Activity';
import type { GameMode, TimeSlot } from '../models/types';
import { getSimulationStore } from './SimulationStore';

export class GameStore {
  currentDay: number = 1;
  currentTimeSlot: TimeSlot = 'morning';
  currentMode: GameMode = 'schedule';
  patients: Patient[] = [];
  activities: Activity[] = [];
  schedule: Map<string, string | null> = observable.map();
  startEnergySnapshot: Map<string, number> = observable.map();

  constructor() {
    makeAutoObservable(this);
    this.initializeGame();
  }

  private initializeGame(): void {
    // Create 3 patients with distinct MTG colors and energy values
    this.patients = [
      new Patient({
        id: 'patient-1',
        name: 'Elling',
        energy: 7,
        primaryColor: 'blue',
        secondaryColor: 'green',
      }),
      new Patient({
        id: 'patient-2',
        name: 'Kjell-Bjarne',
        energy: 5,
        primaryColor: 'green',
        secondaryColor: 'white',
      }),
      new Patient({
        id: 'patient-3',
        name: 'Nora',
        energy: 8,
        primaryColor: 'red',
        secondaryColor: 'blue',
      }),
    ];

    // Create 8 activities with energy cost/gain values
    this.activities = [
      new Activity({ id: 'activity-1', name: 'Cooking', energyCost: -2, color: 'green' }),
      new Activity({ id: 'activity-2', name: 'Therapy', energyCost: -3, color: 'blue' }),
      new Activity({ id: 'activity-3', name: 'Gardening', energyCost: -1, color: 'green' }),
      new Activity({ id: 'activity-4', name: 'Rest', energyCost: 2, color: 'white' }),
      new Activity({ id: 'activity-5', name: 'Reading', energyCost: -1, color: 'blue' }),
      new Activity({ id: 'activity-6', name: 'Social Hour', energyCost: -2, color: 'red' }),
      new Activity({ id: 'activity-7', name: 'Crafts', energyCost: -1, color: 'red' }),
      new Activity({ id: 'activity-8', name: 'Exercise', energyCost: -2, color: 'green' }),
    ];
  }

  setMode(mode: GameMode): void {
    this.currentMode = mode;
  }

  // Schedule management methods
  private getScheduleKey(patientId: string, slot: TimeSlot): string {
    return `${patientId}-${slot}`;
  }

  assignActivity(patientId: string, slot: TimeSlot, activityId: string | null): void {
    const key = this.getScheduleKey(patientId, slot);
    this.schedule.set(key, activityId);
  }

  clearAssignment(patientId: string, slot: TimeSlot): void {
    const key = this.getScheduleKey(patientId, slot);
    this.schedule.set(key, null);
  }

  getAssignment(patientId: string, slot: TimeSlot): Activity | null {
    const key = this.getScheduleKey(patientId, slot);
    const activityId = this.schedule.get(key);
    if (!activityId) return null;
    return this.activities.find((a) => a.id === activityId) ?? null;
  }

  clearAllAssignments(): void {
    this.schedule.clear();
  }

  // Get energy after all scheduled activities for a patient
  getPredictedEnergy(patientId: string): number {
    const patient = this.patients.find((p) => p.id === patientId);
    if (!patient) return 0;

    const slots: TimeSlot[] = ['morning', 'afternoon', 'evening'];
    let energy = patient.energy;

    for (const slot of slots) {
      const activity = this.getAssignment(patientId, slot);
      if (activity) {
        energy += activity.energyCost;
      }
    }
    return energy;
  }

  // Get energy at a specific point in the day (after a given slot)
  getEnergyAfterSlot(patientId: string, throughSlot: TimeSlot): number {
    const patient = this.patients.find((p) => p.id === patientId);
    if (!patient) return 0;

    const slots: TimeSlot[] = ['morning', 'afternoon', 'evening'];
    const slotIndex = slots.indexOf(throughSlot);
    let energy = patient.energy;

    for (let i = 0; i <= slotIndex; i++) {
      const activity = this.getAssignment(patientId, slots[i]);
      if (activity) {
        energy += activity.energyCost;
      }
    }
    return energy;
  }

  // Capture current energy values for all patients at day start
  captureStartEnergy(): void {
    this.startEnergySnapshot.clear();
    for (const patient of this.patients) {
      this.startEnergySnapshot.set(patient.id, patient.energy);
    }
  }

  // Advance to next day with partial energy recovery
  advanceToNextDay(): void {
    const simulationStore = getSimulationStore();
    const maxEnergy = 10;

    // Increment day
    this.currentDay++;

    // Apply partial energy recovery: +3, capped at maxEnergy
    for (const patient of this.patients) {
      patient.energy = Math.min(maxEnergy, patient.energy + 3);
    }

    // Handle intervention tokens: get 3 fresh, keep 1 unused from previous day (max 4)
    const unusedTokens = simulationStore.interventionTokens;
    const carryOver = Math.min(unusedTokens, 1); // Can carry over at most 1
    simulationStore.reset(); // This resets tokens to 3
    simulationStore.interventionTokens = 3 + carryOver; // 3 fresh + carryover

    // Clear start energy snapshot
    this.startEnergySnapshot.clear();

    // Keep schedule intact (previous day's schedule pre-filled per CONTEXT)

    // Switch to schedule mode
    this.currentMode = 'schedule';
  }
}

// Singleton instance
const gameStore = new GameStore();

// Hook for React components
export const useGameStore = (): GameStore => gameStore;

// Getter for non-React access
export const getGameStore = (): GameStore => gameStore;
