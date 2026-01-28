import { makeAutoObservable } from 'mobx';

export class UIStore {
  selectedPatientId: string | null = null;
  sidebarExpanded: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedPatient(id: string | null): void {
    this.selectedPatientId = id;
  }

  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
}

// Singleton instance
const uiStore = new UIStore();

// Hook for React components
export const useUIStore = (): UIStore => uiStore;

// Getter for non-React access
export const getUIStore = (): UIStore => uiStore;
