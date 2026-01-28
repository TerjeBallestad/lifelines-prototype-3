# Requirements: Lifelines Schedule-Observe Prototype

**Defined:** 2026-01-28
**Core Value:** The schedule-observe cycle must feel satisfying — player wants to see what happens, learn from it, and adjust.

## v1 Requirements

Requirements for the prototype. Each maps to roadmap phases.

### Game State

- [ ] **STATE-01**: Game has 2-3 patient entities with name, energy (Overskudd), and MTG color personality
- [ ] **STATE-02**: Game has 8-10 activity definitions with energy cost/gain values
- [ ] **STATE-03**: Schedule data structure maps each patient to activities for each time slot
- [ ] **STATE-04**: Game tracks current day number and time progression within day

### Schedule Mode

- [ ] **SCHED-01**: Player sees a time slot grid showing 3 slots × patients
- [ ] **SCHED-02**: Player can assign activities to time slots for each patient
- [ ] **SCHED-03**: UI shows predicted Overskudd after each scheduled activity
- [ ] **SCHED-04**: Player can click "Start Day" to commit schedule and begin observation

### Observe Mode

- [ ] **OBS-01**: Simulation plays back with patients visibly moving through scheduled activities
- [ ] **OBS-02**: Player can control playback speed (play/pause, 1x/4x/skip to end)
- [ ] **OBS-03**: Floating numbers (+5 energy, -10 energy) appear during activity execution
- [ ] **OBS-04**: Player has limited intervention tokens to redirect patients mid-day

### Day End Summary

- [ ] **END-01**: Summary shows Overskudd change per patient (start → end)
- [ ] **END-02**: Summary reveals discoveries about patients (personality hints, preferences)
- [ ] **END-03**: Player can click "Continue" to advance to next day's scheduling
- [ ] **END-04**: Summary shows intervention tokens used and their effects
- [ ] **END-05**: Summary shows skill/XP progress gained from activities

### Patient Systems

- [ ] **PAT-01**: Patients have Overskudd that depletes during activities and regenerates overnight
- [ ] **PAT-02**: Patients have MTG color personality (primary + secondary) affecting behavior
- [ ] **PAT-03**: When two patients do same activity, synergy check determines bond or conflict
- [ ] **PAT-04**: Activities grant XP toward patient skills, tracked across days

## v2 Requirements

Deferred to future iterations if core loop proves fun.

### Enhanced Observation

- **OBS-V2-01**: Thought bubbles showing patient emotional state during activities
- **OBS-V2-02**: Synergy events with visual feedback (hearts for bonding, sparks for conflict)
- **OBS-V2-03**: Auto-pause on significant events (crisis, discovery, conflict)

### Enhanced Scheduling

- **SCHED-V2-01**: Drag-and-drop activity assignment
- **SCHED-V2-02**: Synergy hints glow when good patient pairings detected
- **SCHED-V2-03**: Activity tooltips showing detailed effects and requirements

### Meta Systems

- **META-01**: Facility constraints (kitchen max 2, workshop max 3)
- **META-02**: Staff availability limits (therapist sessions per day)
- **META-03**: Multiple day runs with win/lose conditions
- **META-04**: Save/load game state

## Out of Scope

| Feature | Reason |
|---------|--------|
| Illustrated art/sprites | Abstract/card visuals sufficient for prototype |
| Audio/sound effects | Visual prototype only |
| Full hidden stat system | Simplified to colors + Overskudd for prototype |
| Diagnosis activities | Simplify discovery to observation-based |
| Victory/failure conditions | Testing loop feel, not game balance |
| Roguelike meta-progression | Single-session prototype |
| Mobile/touch support | Desktop browser only |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| STATE-01 | TBD | Pending |
| STATE-02 | TBD | Pending |
| STATE-03 | TBD | Pending |
| STATE-04 | TBD | Pending |
| SCHED-01 | TBD | Pending |
| SCHED-02 | TBD | Pending |
| SCHED-03 | TBD | Pending |
| SCHED-04 | TBD | Pending |
| OBS-01 | TBD | Pending |
| OBS-02 | TBD | Pending |
| OBS-03 | TBD | Pending |
| OBS-04 | TBD | Pending |
| END-01 | TBD | Pending |
| END-02 | TBD | Pending |
| END-03 | TBD | Pending |
| END-04 | TBD | Pending |
| END-05 | TBD | Pending |
| PAT-01 | TBD | Pending |
| PAT-02 | TBD | Pending |
| PAT-03 | TBD | Pending |
| PAT-04 | TBD | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 0
- Unmapped: 21 ⚠️

---
*Requirements defined: 2026-01-28*
*Last updated: 2026-01-28 after initial definition*
