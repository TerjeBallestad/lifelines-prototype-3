import { makeAutoObservable } from 'mobx';
import { Patient } from '../models/Patient';
import { Activity } from '../models/Activity';
import type { GameMode, TimeSlot } from '../models/types';

export class GameStore {
  currentDay: number = 1;
  currentTimeSlot: TimeSlot = 'morning';
  currentMode: GameMode = 'schedule';
  patients: Patient[] = [];
  activities: Activity[] = [];

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
}

// Singleton instance
const gameStore = new GameStore();

// Hook for React components
export const useGameStore = (): GameStore => gameStore;

// Getter for non-React access
export const getGameStore = (): GameStore => gameStore;
