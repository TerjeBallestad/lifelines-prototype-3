# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-28)

**Core value:** The schedule-observe cycle must feel satisfying — player wants to see what happens, learn from it, and adjust.
**Current focus:** Phase 3 - Observe Mode (visual feedback complete)

## Current Position

Phase: 3 of 5 (Observe Mode)
Plan: 3 of 4 in phase
Status: In progress
Last activity: 2026-01-28 — Completed 03-03-PLAN.md (Visual Feedback)

Progress: [========..] 59%

## Performance Metrics

**Velocity:**
- Total plans completed: 9
- Average duration: 3.1 min
- Total execution time: 28 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3 | 10 min | 3.3 min |
| 02-schedule-mode | 3 | 12 min | 4 min |
| 03-observe-mode | 3 | 6 min | 2 min |

**Recent Trend:**
- Last 5 plans: 02-03 (5 min), 03-01 (2 min), 03-02 (1 min), 03-03 (3 min)
- Trend: Phase 03 executing efficiently with focused component scopes

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- mobx-react-observer uses default export (not named export) for babel plugin
- Tailwind v4 uses CSS-based config only (no tailwind.config.js)
- DaisyUI configured via @plugin directive in CSS
- Singleton stores with hook accessors (useGameStore, useUIStore, useSimulationStore)
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
- Day duration 75000ms at 1x speed (midpoint of 60-90s range)
- Delta capped at 100ms to prevent huge jumps after tab switch
- Time slot thresholds at 0.33 and 0.66 for even thirds
- DaisyUI join component for grouped speed buttons
- Clock uses 12-hour format (8 AM to 8 PM)
- tabular-nums for stable clock width
- motion library for React animations (ESM-native framer-motion successor)
- Energy changes apply at slot boundaries in SimulationStore
- Glow animation speed inversely proportional to energy state
- OKLCH colors in CSS for glow effects matching DaisyUI theme

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-28
Stopped at: Completed 03-03-PLAN.md (Visual Feedback)
Resume file: None
