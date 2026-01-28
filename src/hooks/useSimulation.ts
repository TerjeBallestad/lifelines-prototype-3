import { useEffect, useRef, useCallback } from 'react';
import { runInAction } from 'mobx';
import { useSimulationStore } from '../stores/SimulationStore';

/**
 * Hook that drives the simulation game loop using requestAnimationFrame.
 * Should be used in the ObserveView component to advance simulation progress.
 */
export function useSimulation(): void {
  const store = useSimulationStore();
  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const tick = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }

    const deltaMs = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Cap delta to prevent huge jumps (e.g., after tab switch)
    const cappedDelta = Math.min(deltaMs, 100);

    runInAction(() => {
      store.tick(cappedDelta);
    });

    if (store.isPlaying && !store.isDayComplete) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [store]);

  useEffect(() => {
    if (store.isPlaying && !store.isDayComplete) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [store.isPlaying, store.isDayComplete, tick]);
}
