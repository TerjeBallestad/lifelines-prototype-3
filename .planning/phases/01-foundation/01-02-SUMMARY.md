---
phase: 01-foundation
plan: 02
subsystem: state-management
tags: [mobx, typescript, react, state, observable]

# Dependency graph
requires:
  - phase: 01-01
    provides: Vite + React + MobX build toolchain
provides:
  - TypeScript type definitions (GameMode, TimeSlot, MTGColor, PatientData, ActivityData)
  - Patient class with observable energy and computed status
  - Activity class with energy cost and formatted display
  - GameStore with 3 patients and 8 activities
  - UIStore for selection and sidebar state
  - RootStore composing both stores
  - Store hooks for React component consumption
affects: [01-03, 02-01, 02-02]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - MobX singleton stores with hooks
    - makeAutoObservable for automatic observability
    - Computed getters for derived state

key-files:
  created:
    - src/models/types.ts
    - src/models/Patient.ts
    - src/models/Activity.ts
    - src/stores/GameStore.ts
    - src/stores/UIStore.ts
    - src/stores/RootStore.ts
  modified:
    - src/App.tsx

key-decisions:
  - "Singleton stores with hook accessors for React and getter functions for non-React access"
  - "Patient maxEnergy set to 10 as fixed constant"
  - "Energy status thresholds: high >= 6, medium >= 3, low < 3"

patterns-established:
  - "Store pattern: class with makeAutoObservable, singleton instance, useXxxStore hook, getXxxStore getter"
  - "Model pattern: class takes Data interface in constructor, uses makeAutoObservable"
  - "Computed properties for derived state (energyPercent, energyStatus, formattedCost)"

# Metrics
duration: 2min
completed: 2026-01-28
---

# Phase 01 Plan 02: MobX Stores and Data Models Summary

**MobX stores with 3 observable patients (Elling, Kjell-Bjarne, Nora) and 8 activities using MTG color system**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-28T15:54:25Z
- **Completed:** 2026-01-28T15:56:18Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- TypeScript types for GameMode, TimeSlot, MTGColor, PatientData, ActivityData
- Patient class with observable energy tracking and computed status (high/medium/low)
- Activity class with energy cost and formatted display helpers (+N/-N)
- GameStore initialized with 3 patients and 8 activities from the Norwegian film inspiration
- UIStore for patient selection and sidebar expansion state
- Store hooks ready for React component consumption

## Task Commits

Each task was committed atomically:

1. **Task 1: Create TypeScript type definitions** - `27329a8` (feat)
2. **Task 2: Create Patient and Activity observable classes** - `4da17f0` (feat)
3. **Task 3: Create MobX stores with initial data** - `8eb177e` (feat)

## Files Created/Modified

- `src/models/types.ts` - GameMode, TimeSlot, MTGColor, PatientData, ActivityData types
- `src/models/Patient.ts` - Observable patient with energy tracking and computed status
- `src/models/Activity.ts` - Activity with energy cost and formatted display
- `src/stores/GameStore.ts` - Domain store with patients, activities, day/mode tracking
- `src/stores/UIStore.ts` - UI state for selection and sidebar
- `src/stores/RootStore.ts` - Store composition and re-exports
- `src/App.tsx` - Updated to display store data for verification

## Decisions Made

1. **Singleton pattern with hooks:** Stores are singletons accessed via `useGameStore()` hook for React and `getGameStore()` for non-React code (tests, utilities)
2. **Fixed maxEnergy:** Patient maxEnergy is 10 as a readonly property, not configurable per-patient
3. **Energy status thresholds:** high >= 6, medium >= 3, low < 3 for clear visual feedback

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Store layer complete and verified
- Ready for Phase 01 Plan 03 (layout components)
- Stores accessible from any React component via hooks

---
*Phase: 01-foundation*
*Completed: 2026-01-28*
