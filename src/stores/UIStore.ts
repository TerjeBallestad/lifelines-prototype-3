import { makeAutoObservable } from 'mobx';
import { getGameStore } from './GameStore';
import type { Activity } from '../models/Activity';

export class UIStore {
  selectedPatientId: string | null = null;
  sidebarExpanded: boolean = true;
  selectedActivityId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedPatient(id: string | null): void {
    this.selectedPatientId = id;
  }

  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }

  selectActivity(activityId: string | null): void {
    this.selectedActivityId = activityId;
  }

  clearSelection(): void {
    this.selectedActivityId = null;
  }

  get selectedActivity(): Activity | null {
    if (!this.selectedActivityId) return null;
    const gameStore = getGameStore();
    return gameStore.activities.find((a) => a.id === this.selectedActivityId) ?? null;
  }
}

// Singleton instance
const uiStore = new UIStore();

// Hook for React components
export const useUIStore = (): UIStore => uiStore;

// Getter for non-React access
export const getUIStore = (): UIStore => uiStore;
