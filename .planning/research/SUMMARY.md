# Project Research Summary

**Project:** Lifelines Prototype
**Domain:** Schedule-then-observe simulation game
**Researched:** 2026-01-28
**Confidence:** MEDIUM-HIGH

## Executive Summary

Lifelines is a schedule-then-observe simulation game where players plan patient activities (Schedule Mode), watch the day play out with optional interventions (Observe Mode), and learn from outcomes (Summary Mode). Research reveals that this gameplay pattern has clear table stakes (phase separation, time controls, feedback loops) and known pitfalls (overengineering prototypes, fighting React's rendering model, scope creep).

The recommended approach uses **MobX for observable game state** with **precomputed simulation + animated playback** rather than real-time simulation. This aligns with React's strengths (declarative UI for cards and schedules) while avoiding weaknesses (60fps game loops). The stack leverages constrained technologies (React 19, MobX, Tailwind v4, DaisyUI) with Motion (Framer Motion) for enter/exit animations and layout transitions—critical for cards moving between time slots.

The biggest risk is **scope creep masquerading as "doing it right"**. Research shows successful prototypes in this domain timebox ruthlessly and use placeholder visuals. The core question—"Is schedule-then-observe fun for managing patient energy?"—must be answered before adding polish, progression systems, or complex animations. Mitigate by timeboxing to 2 weeks, building foundation-first (Phase 1: MobX stores), validating the loop early (Phase 2: Schedule Mode), and deferring differentiators (patient synergies, intervention tokens) until the base loop works.

## Key Findings

### Recommended Stack

The stack centers on **MobX's fine-grained reactivity** as the ideal fit for observable game entities. When a patient's energy changes, only components observing that specific patient re-render—React 19's concurrent features combined with MobX's automatic batching prevent cascade re-renders during simulation playback.

**Core technologies:**
- **React 19.2.4**: UI framework — constrained choice, latest stable with concurrent rendering features
- **MobX 6.15.0 + mobx-react-lite 4.1.1**: Observable state — explicitly supports React 19, class-based stores model game entities naturally, minimal boilerplate for prototype speed
- **Motion 12.29.2**: Animation library — `AnimatePresence` for enter/exit (cards appearing/disappearing), `layoutId` for smooth transitions between time slots, variant system for reusable entity states
- **Vite 7.3.1**: Build tool — fast dev server for rapid iteration, current stable release
- **Tailwind v4 + DaisyUI 5**: Styling — DaisyUI 5 fully compatible with Tailwind v4 via CSS plugin syntax, provides cozy component aesthetics without custom design work

**Critical stack insight:** Motion over React Spring because enter/exit animations (`AnimatePresence`) are non-negotiable for schedule-observe games—patients must smoothly appear in time slots and disappear when moved. Motion's `layoutId` handles position transitions automatically when cards move between slots.

**Avoid:** Redux (boilerplate kills prototype speed), canvas/WebGL (overkill for card-based visuals), XState (complexity without immediate benefit), requestAnimationFrame for game state updates (use for CSS animations only, not React state).

### Expected Features

Research analyzed similar games (Minami Lane, Punch Club, Game Dev Tycoon, The Sims, Football Manager) to identify table stakes vs differentiators.

**Must have (table stakes):**
- **Clear phase separation** — players need distinct Schedule vs Observe modes; mixing them destroys the loop's identity
- **Visible schedule/plan** — grid or timeline showing committed activities before playback
- **Time controls during observation** — 1x/2x/4x minimum; players fast-forward boring parts
- **End-of-day feedback** — summary showing what worked and what didn't; the feedback phase IS the learning mechanism
- **Undo/modify before committing** — mistakes during planning feel unfair without this
- **Character state visibility** — patient mood, energy, relationships must update in real-time during observation
- **Win/lose or progress feedback** — session comparison or streak tracking to know if improving

**Should have (competitive differentiators):**
- **Mid-day intervention tokens** — limited emergency actions create drama and mastery (Lifelines' planned system fits here)
- **Energy as strategic resource** — activities cost/restore different amounts, forcing tradeoffs (core to Lifelines' overskudd system)
- **Character synergy/conflict** — relationships between entities add strategic depth (Fire Emblem adjacent bonuses pattern)
- **"Almost" feedback** — showing near-misses creates engagement ("Patient A was 1 energy short of completing activity")

**Defer (v2+):**
- Full simulation rewind (removes consequence)
- Pause + direct control during observation (breaks the loop identity)
- Multiple simultaneous currencies (cognitive overload)
- Unlockable content progression (defers testing core loop)
- Detailed animation systems (scope creep before loop validation)
- Save/load mid-day (enables save-scumming)

### Architecture Approach

The recommended architecture uses **domain/UI store separation** with a **decoupled simulation engine** that runs independently from React's render cycle. This separates game logic (testable, deterministic) from presentation (animated, controllable).

**Major components:**
1. **GameStore (MobX domain state)** — patients, activities, schedule grid, day progress; observable entities that simulation updates
2. **UIStore (MobX presentation state)** — currentMode, simulationSpeed, selectedPatient, modals; ephemeral UI concerns separate from game logic
3. **SimulationEngine (pure TypeScript)** — precomputes day results as event timeline, emits events to stores, runs outside React render cycle
4. **Mode-specific views** — ScheduleView (drag-drop activity assignment), ObserveView (timeline playback with intervention panel), SummaryView (day-end metrics)

**Critical architectural pattern:** **Precompute simulation, then animate playback**. Instead of running simulation in real-time during Observe Mode, compute the entire day's events instantly (`simulateDay(schedule) → Event[]`), then animate through the event timeline at any speed. This decouples simulation (deterministic, instant) from presentation (animated, speed-controllable, pauseable).

**Data flow:** User action → Action creator → MobX store mutation → Reaction → UI update. Simulation engine updates stores via `runInAction` batching; MobX's fine-grained tracking ensures only affected components re-render.

### Critical Pitfalls

Research identified pitfalls specific to React-based schedule-observe games:

1. **Overengineering a prototype** — building save/load, undo/redo, multiplayer support before validating the core loop is fun. **Avoid:** Timebox entire prototype to 2 weeks, use gray boxes and text placeholders, define the ONE question ("Is schedule-then-observe fun?"), if a feature doesn't test the core loop cut it immediately.

2. **Fighting React's rendering model** — treating React like a game engine and tying requestAnimationFrame to setState for frame-by-frame updates. **Avoid:** Use React for UI (cards, menus, layout), keep animation state outside React (refs, motion values), precompute simulation results and animate with CSS/Motion, never tie requestAnimationFrame directly to setState.

3. **Game loop spiral of death** — when simulation takes too long, delta time grows, requiring more simulation, creating freeze/crash. **Avoid:** Cap delta time (`Math.min(actualDelta, 100)`), pause simulation when tab hidden, use fixed timestep or (better for Lifelines) precompute entire day then playback events.

4. **MobX reactivity broken silently** — components don't update when state changes because `observer` wrapper forgotten or observables dereferenced outside tracked context. **Avoid:** Wrap all components reading MobX state with `observer`, never access observables in async code expecting tracking, use `trace()` to debug tracking issues.

5. **State in two places** — game state split between MobX stores and React `useState`, causing sync bugs. **Avoid:** Domain state (schedule, characters, day progress) goes in MobX; ephemeral UI state (dropdown open, hover) can use `useState`; never sync MobX to `useState`.

## Implications for Roadmap

Based on research, suggested phase structure prioritizes foundation-first, loop validation before polish, and defers differentiators until core loop works.

### Phase 1: Foundation & State Management
**Rationale:** Everything depends on state management working correctly; MobX patterns must be established before building features.
**Delivers:** MobX stores (GameStore, UIStore, RootStore), data types (Patient, Activity, Schedule), React context provider, mode switching shell.
**Addresses:** Pitfall #4 (MobX reactivity), Pitfall #5 (state in two places), architecture pattern (domain/UI separation).
**Avoids:** Building features before state system exists.
**Research needs:** None — MobX patterns are well-documented.

### Phase 2: Schedule Mode (Core Loop Part 1)
**Rationale:** Simpler than Observe Mode; validates data model and proves players can input schedules.
**Delivers:** ScheduleView layout, PatientCard component, ActivitySlot grid (3 time slots per day), drag-and-drop activity assignment, basic constraint validation (facility capacity), commit button transitioning to Observe Mode.
**Addresses:** Must-have features (visible schedule, undo/modify), architecture component (ScheduleView).
**Uses:** Motion for layoutId transitions when cards move between slots.
**Avoids:** Pitfall #8 (drag-drop state desync) by keeping drag position in refs and only updating MobX on drop.
**Research needs:** None — drag-drop with Motion is standard pattern.

### Phase 3: Simulation Engine & Observe Mode
**Rationale:** Once players can create schedules, they need to see results; this tests the full loop.
**Delivers:** SimulationEngine (precomputes day events as timeline), ObserveView with timeline playback, TimeControls (1x/2x/4x speed, pause), PatientSprite animations, energy bar updates during playback, FloatingNumbers for stat changes.
**Addresses:** Must-have features (time controls, character state visibility), architecture component (simulation engine decoupled from React).
**Uses:** Motion AnimatePresence for enter/exit, CSS transforms for smooth position updates, MobX reactions to drive visual updates.
**Avoids:** Pitfall #2 (fighting React's rendering model) by precomputing simulation then animating events, Pitfall #3 (game loop spiral) by using event timeline instead of real-time loop, Pitfall #6 (immediate animation) by separating simulation from playback.
**Research needs:** MEDIUM — simulation playback pattern is custom; may need phase-specific research for timeline scrubbing.

### Phase 4: Feedback & Summary
**Rationale:** Without feedback, players can't learn; this completes the core loop.
**Delivers:** SummaryView with day-end metrics (patients' final energy, activities completed, "almost" near-misses), session comparison ("today vs previous best"), DiscoveryLog (what worked, what didn't), continue button looping back to Schedule Mode.
**Addresses:** Must-have features (end-of-day feedback, win/lose progress), differentiator ("almost" feedback showing near-misses).
**Avoids:** Pitfall #1 (overengineering) by limiting to 3 metrics maximum.
**Research needs:** None — read-only summary views are standard React patterns.

### Phase 5: Strategic Depth (Defer if Time Constrained)
**Rationale:** These are differentiators, not table stakes; only add if core loop is fun.
**Delivers:** Patient synergy system (adjacent bonuses during activities), activity-patient fit (preferences affecting outcomes), intervention tokens (limited mid-day actions).
**Addresses:** Should-have features (synergies, intervention tokens).
**Avoids:** Pitfall #1 (overengineering) by making this entire phase optional if prototype timeline is tight.
**Research needs:** MEDIUM — patient AI and synergy calculations may need domain-specific research.

### Phase Ordering Rationale

- **Foundation first (Phase 1)** because MobX patterns must be correct before features are built; fixing reactivity bugs across features is expensive.
- **Schedule before Observe (Phase 2 → 3)** because Schedule Mode is simpler and validates the data model; Observe Mode depends on having valid schedules to play back.
- **Observe before Summary (Phase 3 → 4)** because Summary displays simulation results; can't summarize without simulation running.
- **Core loop before strategic depth (Phase 4 → 5)** because differentiators only matter if the base loop is fun; research shows prototypes die adding features to broken loops.

This ordering follows research findings:
- **Architecture dependency graph** (from ARCHITECTURE.md Phase Build Order)
- **Feature dependencies** (from FEATURES.md: time system → schedule UI → observation playback → feedback)
- **Pitfall avoidance** (from PITFALLS.md: validate loop before polish, avoid scope creep)

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 3 (Simulation Engine):** Timeline playback pattern is custom; may need research on scrubbing, event interpolation, and deterministic simulation if loops need to be replayable.
- **Phase 5 (Strategic Depth):** Patient AI behaviors and synergy calculation patterns are domain-specific; standard game AI resources may not translate to cozy management sims.

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation):** MobX store organization is well-documented in official docs.
- **Phase 2 (Schedule Mode):** Drag-and-drop with Motion and grid layouts are established React patterns.
- **Phase 4 (Summary):** Read-only summary views are basic React; no special domain knowledge needed.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified via npm registry; MobX + React 19 support confirmed; Motion patterns documented |
| Features | MEDIUM | Multiple similar games analyzed for table stakes; confidence in must-haves; differentiators less certain without playtesting |
| Architecture | MEDIUM-HIGH | MobX domain/UI separation is documented best practice; simulation precompute pattern is sound but custom implementation |
| Pitfalls | MEDIUM | MobX reactivity pitfalls from official docs (HIGH); prototype scope creep from indie dev postmortems (MEDIUM); game loop patterns from JS game dev articles (MEDIUM) |

**Overall confidence:** MEDIUM-HIGH

Research is strongest on technical stack (verified versions, explicit React 19 support) and established architecture patterns (MobX store separation). Moderate confidence on features (based on competitive analysis, not first-party playtesting) and pitfalls (mixture of official docs and community consensus). The combination provides solid foundation for roadmap creation.

### Gaps to Address

**Gaps identified during research:**

- **Simulation determinism:** Not researched whether loops need to be replayable (same schedule → same results). If players expect consistency, simulation RNG seeding needs consideration. **Handle during Phase 3 planning.**

- **Drag-and-drop UX details:** Research identified the pitfall but didn't specify whether patients are dragged to slots, or activities are dragged to patient rows. **Handle during Phase 2 planning; prototype both and pick one.**

- **Intervention token mechanics:** Researched that limited mid-day actions are differentiators, but not HOW they interrupt playback (pause and choose? queued in advance?). **Handle during Phase 5 planning if included.**

- **Patient synergy visualization:** Identified synergies as differentiators but not how to show relationships during Schedule Mode (preview bonuses?) or Observe Mode (visual effects?). **Handle during Phase 5 planning if included.**

- **Sound/audio:** Not researched at all; unclear if time-lapse simulation needs audio cues or if cozy aesthetic expects ambient sound. **Defer to post-prototype unless playtesting demands it.**

- **Save/load implementation:** Deliberately excluded from MVP as anti-feature (enables save-scumming), but MobX stores serialize cleanly with `toJS()` if needed later. **Defer to v2+ unless prototype extends to multi-day progression.**

These gaps are acceptable for initial roadmap creation. They represent implementation details (not architectural decisions) and can be resolved during phase-specific planning or prototyping.

## Sources

### Primary (HIGH confidence)
- **npm registry verification** (2026-01-28): React 19.2.4, MobX 6.15.0, mobx-react-lite 4.1.1, Motion 12.29.2, Vite 7.3.1, Tailwind 4.1.18, DaisyUI 5.5.14
- **MobX official docs**: Store organization patterns, reactivity tracking, React 19 support discussion
- **DaisyUI 5 release notes**: Tailwind v4 compatibility confirmed
- **Motion for React docs**: Animation API reference, AnimatePresence patterns, layoutId usage

### Secondary (MEDIUM confidence)
- **Minami Lane revenue case study**: Development philosophy, hidden object mechanic, "too passive" criticism
- **Game Dev Tycoon wiki**: Score comparison system, feedback loop design
- **Punch Club mechanics**: Stat management, resource tension patterns
- **Football Manager match engine**: Tactical simulation architecture
- **MobX community articles**: Root store pattern with React hooks, domain/UI separation
- **React animation patterns**: requestAnimationFrame with hooks, RAF integration warnings
- **Game loop timing articles**: JavaScript game loops, spiral of death prevention, fixed timestep patterns
- **Indie game postmortems**: Scope creep in prototypes, playtesting-driven development

### Tertiary (LOW confidence)
- **Cozy game market research**: Genre growth expectations (market data, not design patterns)
- **Turn-based Redux architecture article**: Older patterns (pre-MobX 6, pre-React 19) requiring translation
- **State machine articles**: XState patterns that were explicitly deferred for MVP

---
*Research completed: 2026-01-28*
*Ready for roadmap: yes*
