import { GameStore, useGameStore, getGameStore } from './GameStore';
import { UIStore, useUIStore, getUIStore } from './UIStore';

export class RootStore {
  gameStore: GameStore;
  uiStore: UIStore;

  constructor() {
    this.gameStore = getGameStore();
    this.uiStore = getUIStore();
  }
}

// Singleton instance
const rootStore = new RootStore();

// Hook for React components
export const useRootStore = (): RootStore => rootStore;

// Re-export individual store hooks for convenience
export { useGameStore, useUIStore };
