# Roadmap: Lifelines Schedule-Observe Prototype

## Overview

This prototype tests whether the Schedule-Observe-Adjust loop is engaging for managing patient activities in a social housing facility. The journey starts with foundational state management (MobX stores, data types), builds the player input phase (Schedule Mode), implements animated simulation playback (Observe Mode), closes the feedback loop (Day End Summary), and finally adds strategic depth through patient systems (energy, synergies, interventions). Each phase delivers a complete, testable capability building toward the core question: Is this loop fun?

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - MobX stores, data types, and mode switching shell
- [ ] **Phase 2: Schedule Mode** - Player assigns activities to time slots for each patient
- [ ] **Phase 3: Observe Mode** - Simulation playback with time controls and visual feedback
- [ ] **Phase 4: Day End Summary** - Feedback screen showing outcomes and enabling next day
- [ ] **Phase 5: Patient Systems** - Energy mechanics, synergies, and intervention tokens

## Phase Details

### Phase 1: Foundation
**Goal**: Game state infrastructure exists and mode switching works
**Depends on**: Nothing (first phase)
**Requirements**: STATE-01, STATE-02, STATE-03, STATE-04
**Success Criteria** (what must be TRUE):
  1. App loads and displays current game mode (Schedule/Observe/Summary)
  2. Player can see 2-3 patient cards with names, energy values, and color indicators
  3. Activity list shows 8-10 activities with energy cost/gain values
  4. Day number and time slot are visible in UI
**Plans**: TBD

Plans:
- [ ] 01-01: Project scaffolding and MobX store setup
- [ ] 01-02: Patient and activity data models
- [ ] 01-03: Mode switching shell and basic layout

### Phase 2: Schedule Mode
**Goal**: Players can create and commit daily schedules for all patients
**Depends on**: Phase 1
**Requirements**: SCHED-01, SCHED-02, SCHED-03, SCHED-04
**Success Criteria** (what must be TRUE):
  1. Player sees a grid with 3 time slots (Morning, Afternoon, Evening) for each patient
  2. Player can assign any activity to any time slot for any patient
  3. Predicted Overskudd after each activity is visible before committing
  4. Player can click "Start Day" to commit schedule and transition to Observe Mode
**Plans**: TBD

Plans:
- [ ] 02-01: Schedule grid layout and time slot components
- [ ] 02-02: Activity assignment interaction
- [ ] 02-03: Energy prediction display and Start Day transition

### Phase 3: Observe Mode
**Goal**: Players watch the scheduled day unfold with control over playback
**Depends on**: Phase 2
**Requirements**: OBS-01, OBS-02, OBS-03, OBS-04
**Success Criteria** (what must be TRUE):
  1. Patients visibly move through their scheduled activities during playback
  2. Player can play, pause, and speed up simulation (1x, 4x, skip to end)
  3. Floating numbers (+5, -10) appear when energy changes during activities
  4. Player can use intervention tokens to redirect a patient mid-day (limited uses)
**Plans**: TBD

Plans:
- [ ] 03-01: Simulation engine (precompute day events)
- [ ] 03-02: Timeline playback with time controls
- [ ] 03-03: Visual feedback (floating numbers, patient movement)
- [ ] 03-04: Intervention token system

### Phase 4: Day End Summary
**Goal**: Players receive feedback on the day and can advance to the next
**Depends on**: Phase 3
**Requirements**: END-01, END-02, END-03, END-04, END-05
**Success Criteria** (what must be TRUE):
  1. Summary shows each patient's Overskudd change (start vs end of day)
  2. Summary reveals at least one discovery about patient preferences or personality
  3. Summary shows intervention tokens used and what they accomplished
  4. Summary shows skill/XP progress gained from activities
  5. Player can click "Continue" to advance to next day's Schedule Mode
**Plans**: TBD

Plans:
- [ ] 04-01: Summary view layout and stat displays
- [ ] 04-02: Discovery and intervention reporting
- [ ] 04-03: Day transition and next-day reset

### Phase 5: Patient Systems
**Goal**: Patient behavior has strategic depth through energy, personalities, and synergies
**Depends on**: Phase 4
**Requirements**: PAT-01, PAT-02, PAT-03, PAT-04
**Success Criteria** (what must be TRUE):
  1. Patient Overskudd depletes during activities and regenerates overnight
  2. Patient personality (MTG colors) visibly affects behavior during activities
  3. When two patients do the same activity, synergy outcome (bond or conflict) is visible
  4. Activity XP accumulates across days and is visible per patient
**Plans**: TBD

Plans:
- [ ] 05-01: Energy depletion and overnight regeneration
- [ ] 05-02: Personality-driven behavior variations
- [ ] 05-03: Patient synergy system (same-activity interactions)
- [ ] 05-04: Cross-day XP tracking

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/3 | Not started | - |
| 2. Schedule Mode | 0/3 | Not started | - |
| 3. Observe Mode | 0/4 | Not started | - |
| 4. Day End Summary | 0/3 | Not started | - |
| 5. Patient Systems | 0/4 | Not started | - |

---
*Roadmap created: 2026-01-28*
*Depth: standard | Phases: 5 | Total plans: 17*
