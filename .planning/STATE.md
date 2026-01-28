# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-28)

**Core value:** The schedule-observe cycle must feel satisfying — player wants to see what happens, learn from it, and adjust.
**Current focus:** Phase 2 Complete - Ready for Phase 3

## Current Position

Phase: 2 of 5 (Schedule Mode) - COMPLETE
Plan: 3 of 3 in phase (all complete)
Status: Phase 2 complete, ready for Phase 3
Last activity: 2026-01-28 — Completed 02-03-PLAN.md (Energy Predictions and Start Day)

Progress: [======....] 40%

## Performance Metrics

**Velocity:**
- Total plans completed: 6
- Average duration: 3.5 min
- Total execution time: 22 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3 | 10 min | 3.3 min |
| 02-schedule-mode | 3 | 12 min | 4 min |

**Recent Trend:**
- Last 5 plans: 01-03 (4 min), 02-01 (4 min), 02-02 (3 min), 02-03 (5 min)
- Trend: Consistent velocity

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- mobx-react-observer uses default export (not named export) for babel plugin
- Tailwind v4 uses CSS-based config only (no tailwind.config.js)
- DaisyUI configured via @plugin directive in CSS
- Singleton stores with hook accessors (useGameStore, useUIStore)
- Patient maxEnergy fixed at 10, energy status thresholds: high >= 6, medium >= 3, low < 3
- Activity sidebar on right side of layout
- MTG color border using border-l-4 for patient cards
- Sidebar only visible in schedule mode
- Schedule stored as Map<string, string|null> with key format patientId-timeSlot
- Used observable.map() from mobx for reactive schedule state
- Grid layout uses CSS grid with dynamic column template based on patient count
- 8px distance activation constraint on MouseSensor for click/drag coexistence
- DndContext wraps entire layout for shared drag context between sidebar and main
- DragOverlay renders in portal for proper z-index during drag
- dropAnimation={null} for immediate disappear on drop
- Energy predictions show even negative values (no clamping)

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-28
Stopped at: Completed 02-03-PLAN.md (Energy Predictions and Start Day) - Phase 2 complete
Resume file: None
