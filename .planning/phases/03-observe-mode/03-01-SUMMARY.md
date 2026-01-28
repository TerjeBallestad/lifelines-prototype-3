---
phase: 03-observe-mode
plan: 01
subsystem: simulation
tags: [mobx, requestAnimationFrame, game-loop, time-based]

# Dependency graph
requires:
  - phase: 02-schedule-mode
    provides: GameStore with mode switching, schedule data
provides:
  - SimulationStore with progress/speed/isPlaying state
  - useSimulation hook for requestAnimationFrame game loop
  - ObserveView component for observe mode rendering
affects: [03-02-time-controls, 03-03-patient-activity, 03-04-energy-animation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - requestAnimationFrame game loop with delta capping
    - Computed time slots from progress (0-0.33 morning, 0.33-0.66 afternoon, 0.66-1 evening)

key-files:
  created:
    - src/stores/SimulationStore.ts
    - src/hooks/useSimulation.ts
    - src/components/observe/ObserveView.tsx
  modified:
    - src/models/types.ts
    - src/components/GameShell.tsx

key-decisions:
  - "Day duration 75000ms at 1x speed (midpoint of 60-90s range from CONTEXT)"
  - "Delta capped at 100ms to prevent huge jumps after tab switch"
  - "Time slot thresholds: 0.33 and 0.66 for even thirds"
  - "Re-export SimulationSpeed from both types.ts and SimulationStore.ts for flexibility"

patterns-established:
  - "useSimulation hook pattern: requestAnimationFrame with delta capping"
  - "Computed slots from progress for consistent time mapping"

# Metrics
duration: 2min
completed: 2026-01-28
---

# Phase 3 Plan 1: Simulation Infrastructure Summary

**SimulationStore with progress tracking (0-1), speed multiplier (1x/4x), and useSimulation hook driving requestAnimationFrame game loop**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-28T22:18:33Z
- **Completed:** 2026-01-28T22:20:37Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- SimulationStore tracks progress 0-1 with computed time slots (morning/afternoon/evening)
- useSimulation hook drives tick via requestAnimationFrame with 100ms delta cap
- ObserveView renders when game mode is 'observe' with temporary debug controls
- Progress advances smoothly (~75s at 1x, ~19s at 4x) and auto-pauses at 100%

## Task Commits

Each task was committed atomically:

1. **Task 1: Create SimulationStore** - `dddd297` (feat)
2. **Task 2: Create useSimulation hook** - `2f3e841` (feat)
3. **Task 3: Create ObserveView and integrate into GameShell** - `5136e02` (feat)

## Files Created/Modified
- `src/stores/SimulationStore.ts` - Simulation state with progress, speed, isPlaying, computed slots
- `src/hooks/useSimulation.ts` - requestAnimationFrame game loop hook
- `src/components/observe/ObserveView.tsx` - Observe mode container with debug UI
- `src/models/types.ts` - Added SimulationSpeed type
- `src/components/GameShell.tsx` - Conditional rendering for observe mode

## Decisions Made
- Day duration set to 75000ms (75 seconds) at 1x speed, matching CONTEXT midpoint
- Delta capped at 100ms to prevent large jumps after tab switching
- Time slot thresholds at 0.33 and 0.66 for even distribution
- Temporary debug UI in ObserveView (will be replaced by TimeControls in 03-02)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Simulation infrastructure complete and tested
- Ready for 03-02: TimeControls with progress bar and speed controls
- ObserveView provides placeholder for future patient observation components

---
*Phase: 03-observe-mode*
*Completed: 2026-01-28*
