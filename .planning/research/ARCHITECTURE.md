# Architecture Patterns

**Domain:** React game with schedule-observe simulation mechanics
**Researched:** 2026-01-28
**Confidence:** MEDIUM-HIGH (patterns verified through multiple sources)

## Executive Summary

This document defines the architecture for a React game with distinct **Schedule Mode** and **Observe Mode** phases. The core challenge is separating game logic from UI rendering while supporting smooth time-lapse simulation. The recommended approach uses **MobX domain/UI store separation** with a **decoupled game engine** that runs independently from React's render cycle.

---

## Recommended Architecture

```
+------------------------------------------------------------------+
|                         React Application                         |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------+     +------------------+                    |
|  |   Schedule Mode  |     |   Observe Mode   |                    |
|  |   Components     |     |   Components     |                    |
|  +--------+---------+     +--------+---------+                    |
|           |                        |                              |
|           v                        v                              |
|  +--------------------------------------------------+            |
|  |              UI Store (MobX)                      |            |
|  |  - currentMode: 'schedule' | 'observe' | 'summary'|            |
|  |  - selectedPatient, selectedActivity              |            |
|  |  - simulationSpeed, isPaused                      |            |
|  |  - modalState, tooltips                           |            |
|  +--------------------------------------------------+            |
|           |                        |                              |
|           v                        v                              |
|  +--------------------------------------------------+            |
|  |              Game Store (MobX Domain)             |            |
|  |  - patients[], activities[], schedule[][]         |            |
|  |  - currentDay, currentTimeSlot                    |            |
|  |  - interventionTokens, discoveries[]              |            |
|  |  - gamePhase: 'scheduling' | 'simulating' | 'end' |            |
|  +------------------------+--------------------------+            |
|                           |                                       |
+---------------------------|---------------------------------------+
                            |
                            v
+------------------------------------------------------------------+
|                    Game Engine (Pure TypeScript)                  |
|  +------------------------+  +-----------------------------+      |
|  |   Simulation Engine    |  |   Event System              |      |
|  |   - tick(deltaTime)    |  |   - emit(event)             |      |
|  |   - processTimeSlot()  |  |   - subscribe(type, cb)     |      |
|  |   - resolveActivity()  |  |   - queue: Event[]          |      |
|  +------------------------+  +-----------------------------+      |
|                                                                   |
|  +------------------------+  +-----------------------------+      |
|  |   Patient AI           |  |   Schedule Validator        |      |
|  |   - decideBehavior()   |  |   - validateSchedule()      |      |
|  |   - calculateOutcome() |  |   - predictOutcome()        |      |
|  +------------------------+  +-----------------------------+      |
+------------------------------------------------------------------+
```

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **MobX over Redux** | Project constraint + better fit for observable-heavy simulation |
| **Domain/UI store split** | [MobX best practice](https://mobx.js.org/defining-data-stores.html) - domain store testable independently |
| **Decoupled game engine** | Game logic runs without React; React observes state changes |
| **Event-driven updates** | Simulation emits events; UI subscribes to what it needs |
| **requestAnimationFrame for simulation** | Smooth visual updates independent of React render cycle |

---

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **GameShell** | Top-level router between modes | UI Store (reads currentMode) |
| **ScheduleView** | Schedule editing interface | Game Store (patients, schedule), UI Store |
| **ObserveView** | Time-lapse simulation display | Game Store, Simulation Engine events |
| **SummaryView** | Day-end summary screen | Game Store (read-only) |
| **PatientCard** | Individual patient display | Game Store (single patient) |
| **ActivitySlot** | Drag target for scheduling | Game Store (schedule mutations) |
| **SimulationCanvas** | Animated facility view | Simulation Engine (positions, events) |
| **InterventionPanel** | Token-based actions | Game Store (interventionTokens) |

### Component Hierarchy

```
App
+-- GameShell
    +-- ScheduleView (mode === 'schedule')
    |   +-- DayHeader
    |   +-- PatientRow[]
    |   |   +-- PatientCard
    |   |   +-- ActivitySlot[] (Morning, Afternoon, Evening)
    |   +-- ActivityPalette
    |   +-- ConstraintWarnings
    |   +-- CommitButton
    |
    +-- ObserveView (mode === 'observe')
    |   +-- TimeControls (speed, pause, skip)
    |   +-- SimulationCanvas
    |   |   +-- FacilityMap
    |   |   +-- PatientSprite[] (animated positions)
    |   |   +-- FloatingNumbers[] (+Overskudd, etc.)
    |   |   +-- EventPopups[]
    |   +-- InterventionPanel
    |   +-- DiscoveryLog
    |
    +-- SummaryView (mode === 'summary')
        +-- PatientSummaryCard[]
        +-- DiscoveriesPanel
        +-- TokenUsagePanel
        +-- ContinueButton
```

---

## Data Flow

### Unidirectional Flow Pattern

```
User Action --> Action Creator --> Store Mutation --> Reaction --> UI Update
                                        |
                                        v
                              Side Effects (simulation, events)
```

### Schedule Mode Data Flow

```
1. User drags activity to slot
2. UI calls gameStore.scheduleActivity(patientId, slotIndex, activityId)
3. Store validates (sync) and updates schedule[][]
4. MobX reactions:
   - ConstraintWarnings component re-renders
   - Predicted outcomes recalculated (computed property)
5. User clicks "Start Day"
6. Store commits schedule, sets mode to 'observe'
```

### Observe Mode Data Flow

```
1. ObserveView mounts, starts simulation loop
2. Simulation engine runs tick(deltaTime):
   - Updates simulated time (0.0 -> 1.0 for time slot)
   - Calculates patient positions (interpolated)
   - Resolves activity outcomes at completion
   - Emits events (discovery, crisis, milestone)
3. Events flow to Game Store:
   - Patient stats updated
   - Discoveries added
   - Relationships modified
4. MobX observes changes:
   - PatientSprite positions update (smooth animation)
   - FloatingNumbers appear
   - DiscoveryLog appends
5. Time slot completes -> next slot or day end
```

### The Simulation Loop (Critical Pattern)

```typescript
// Simulation runs OUTSIDE React's render cycle
class SimulationEngine {
  private rafId: number | null = null;
  private lastTime: number = 0;

  start() {
    this.lastTime = performance.now();
    this.loop();
  }

  private loop = () => {
    const now = performance.now();
    const deltaTime = (now - this.lastTime) / 1000; // seconds
    this.lastTime = now;

    if (!this.isPaused) {
      this.tick(deltaTime * this.speedMultiplier);
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  tick(deltaTime: number) {
    // Update simulation state (NOT React state)
    this.simulationTime += deltaTime;

    // Update patient positions (smooth interpolation)
    for (const patient of this.patients) {
      patient.visualPosition = this.interpolatePosition(
        patient.startPosition,
        patient.targetPosition,
        this.getSlotProgress()
      );
    }

    // Check for events
    if (this.simulationTime >= this.nextEventTime) {
      this.processEvent();
    }

    // Push updates to MobX store (batched)
    runInAction(() => {
      this.gameStore.updateSimulationState({
        time: this.simulationTime,
        positions: this.getPatientPositions(),
        pendingEvents: this.eventQueue
      });
    });
  }
}
```

**Why this matters:** React re-renders are expensive. The simulation runs at 60fps, but React components should only re-render when meaningful state changes (not every frame). MobX's fine-grained reactivity handles this automatically - only components observing changed values re-render.

---

## MobX Store Structure

### Game Store (Domain State)

```typescript
class GameStore {
  // === Core Entities ===
  patients: Patient[] = [];
  activities: Activity[] = [];

  // === Schedule State ===
  // schedule[patientIndex][slotIndex] = activityId | null
  schedule: (string | null)[][] = [];

  // === Time State ===
  currentDay: number = 1;
  currentTimeSlot: 0 | 1 | 2 = 0; // Morning, Afternoon, Evening

  // === Simulation State (updated by engine) ===
  simulationTime: number = 0; // 0.0 to 1.0 within slot
  patientPositions: Map<string, Position> = new Map();

  // === Game Progress ===
  interventionTokens: number = 3;
  discoveries: Discovery[] = [];
  dayLog: DayEvent[] = [];

  // === Computed Properties ===
  get currentSlotActivities(): ScheduledActivity[] {
    return this.patients.map((p, i) => ({
      patient: p,
      activity: this.getActivity(this.schedule[i][this.currentTimeSlot])
    }));
  }

  get predictedOutcomes(): PredictedOutcome[] {
    // Calculate what WILL happen based on current schedule
    // Used in Schedule Mode to show player expected results
  }

  get canCommitSchedule(): boolean {
    // Validate no constraint violations
  }

  // === Actions ===
  scheduleActivity(patientId: string, slot: number, activityId: string) {
    // Mutate schedule
  }

  commitSchedule() {
    // Lock in schedule, transition to observe mode
  }

  useInterventionToken(type: InterventionType, targetId: string) {
    // Spend token, trigger intervention effect
  }

  advanceToNextSlot() {
    // Called by simulation when slot completes
  }

  endDay() {
    // Finalize day, calculate summary
  }

  constructor() {
    makeAutoObservable(this);
  }
}
```

### UI Store (Presentation State)

```typescript
class UIStore {
  // === Mode State ===
  currentMode: 'schedule' | 'observe' | 'summary' = 'schedule';

  // === Schedule Mode UI ===
  selectedPatientId: string | null = null;
  draggedActivityId: string | null = null;
  hoveredSlot: { patient: number; slot: number } | null = null;

  // === Observe Mode UI ===
  simulationSpeed: 1 | 4 | 16 = 4;
  isPaused: boolean = false;
  showInterventionMenu: boolean = false;
  activePopup: PopupData | null = null;

  // === Shared UI ===
  tooltipContent: string | null = null;
  modalStack: Modal[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}
```

### Root Store Pattern

```typescript
class RootStore {
  gameStore: GameStore;
  uiStore: UIStore;
  simulationEngine: SimulationEngine;

  constructor() {
    this.gameStore = new GameStore();
    this.uiStore = new UIStore();
    this.simulationEngine = new SimulationEngine(this.gameStore);
  }
}

// Context provider
const StoreContext = createContext<RootStore | null>(null);

export function useStores() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('Store not provided');
  return store;
}

export function useGameStore() {
  return useStores().gameStore;
}

export function useUIStore() {
  return useStores().uiStore;
}
```

---

## Patterns to Follow

### Pattern 1: Observer Components

**What:** Wrap components with MobX `observer` to auto-subscribe to observables.

**When:** Any component that reads MobX state.

**Example:**
```typescript
import { observer } from 'mobx-react-lite';

export const PatientCard = observer(({ patientId }: Props) => {
  const { gameStore } = useStores();
  const patient = gameStore.patients.find(p => p.id === patientId);

  // Component only re-renders when THIS patient's data changes
  return (
    <div className="patient-card">
      <h3>{patient.name}</h3>
      <OverskuddBar value={patient.overskudd} />
    </div>
  );
});
```

### Pattern 2: Computed Values for Derived State

**What:** Use `computed` for any derived data to ensure automatic memoization.

**When:** Filtering, aggregating, or transforming store data.

**Example:**
```typescript
class GameStore {
  @computed get patientsNeedingIntervention(): Patient[] {
    return this.patients.filter(p => p.overskudd < 20);
  }

  @computed get slotConflicts(): Conflict[] {
    // Check facility capacity, staff availability
    return this.schedule.flatMap((patientSchedule, pIdx) =>
      patientSchedule.map((activityId, slot) =>
        this.checkConflict(pIdx, slot, activityId)
      ).filter(Boolean)
    );
  }
}
```

### Pattern 3: Actions for All Mutations

**What:** Wrap all state mutations in `action` (automatic with `makeAutoObservable`).

**When:** Any function that modifies observable state.

**Example:**
```typescript
class GameStore {
  // Automatic with makeAutoObservable
  scheduleActivity(patientId: string, slot: number, activityId: string) {
    const patientIndex = this.patients.findIndex(p => p.id === patientId);
    this.schedule[patientIndex][slot] = activityId;
  }

  // For async operations, use runInAction
  async loadGameData() {
    const data = await fetchGameData();
    runInAction(() => {
      this.patients = data.patients;
      this.activities = data.activities;
    });
  }
}
```

### Pattern 4: Reactions for Side Effects

**What:** Use `reaction` or `autorun` for side effects triggered by state changes.

**When:** Simulation needs to respond to store changes, save game state, etc.

**Example:**
```typescript
// In simulation engine setup
autorun(() => {
  if (this.gameStore.currentMode === 'observe') {
    this.start();
  } else {
    this.stop();
  }
});

// React to speed changes
reaction(
  () => this.uiStore.simulationSpeed,
  (speed) => {
    this.simulationEngine.setSpeed(speed);
  }
);
```

### Pattern 5: Separate Animation from Game State

**What:** Keep visual interpolation separate from authoritative game state.

**When:** Smooth animations that don't affect game logic.

**Example:**
```typescript
// Game state (authoritative)
class Patient {
  currentRoom: string; // "kitchen" | "garden" | etc.
  activityProgress: number; // 0.0 to 1.0
}

// Visual state (interpolated)
class PatientVisual {
  displayX: number;
  displayY: number;

  // Smoothly interpolate toward target
  update(target: Position, deltaTime: number) {
    this.displayX = lerp(this.displayX, target.x, deltaTime * 5);
    this.displayY = lerp(this.displayY, target.y, deltaTime * 5);
  }
}
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: React State for Game Logic

**What:** Using `useState` for game state that simulation needs to access.

**Why bad:** React state is async and component-scoped. Simulation engine can't reliably read it.

**Instead:** All game state lives in MobX stores. Components observe stores.

### Anti-Pattern 2: Rendering Every Frame

**What:** Causing React re-renders on every animation frame.

**Why bad:** React reconciliation is expensive. 60fps re-renders will lag.

**Instead:**
- Animation runs outside React (requestAnimationFrame)
- MobX batches updates
- Only push meaningful state changes to stores
- Use CSS transforms for visual positioning (GPU-accelerated)

### Anti-Pattern 3: Monolithic Store

**What:** Single store with all application state mixed together.

**Why bad:** Hard to test, hard to reason about, unnecessary re-renders.

**Instead:** Domain store (game logic) + UI store (presentation). Additional stores if needed (e.g., AudioStore).

### Anti-Pattern 4: Direct DOM Manipulation

**What:** Bypassing React to manipulate DOM for animations.

**Why bad:** React will overwrite your changes on next render.

**Instead:**
- Use refs for imperative animation control
- Use CSS animations/transitions where possible
- For complex canvas animations, use a dedicated canvas element React doesn't re-render

### Anti-Pattern 5: Derived State in Component

**What:** Computing derived data inside render functions.

**Why bad:** Recalculated on every render, no memoization.

**Instead:** Use MobX `computed` in stores, or `useMemo` in components.

---

## Build Order (Dependencies)

Based on component dependencies, recommended implementation order:

### Phase 1: Foundation (Must build first)
1. **MobX Store Structure** - GameStore, UIStore, RootStore
2. **Data Types** - Patient, Activity, Schedule interfaces
3. **Store Provider** - React context setup

**Why first:** Everything else depends on state management.

### Phase 2: Schedule Mode (Build second)
4. **GameShell** - Mode switching logic
5. **PatientCard** - Patient display (reused in both modes)
6. **ActivitySlot** - Basic slot display
7. **ScheduleView** - Grid layout
8. **Drag-and-drop** - Activity assignment
9. **Constraint validation** - Warnings and errors
10. **CommitButton** - Transition to observe

**Why second:** Simpler than observe mode, validates data model.

### Phase 3: Simulation Engine (Build third)
11. **SimulationEngine class** - Core tick loop
12. **Activity resolution** - Outcome calculation
13. **Event system** - Discovery, crisis events
14. **Position interpolation** - Smooth movement

**Why third:** Needs store structure; observe UI needs engine.

### Phase 4: Observe Mode (Build fourth)
15. **ObserveView** - Container component
16. **TimeControls** - Speed, pause, skip
17. **SimulationCanvas** - Visual display
18. **PatientSprite** - Animated patient display
19. **FloatingNumbers** - Stat change indicators
20. **InterventionPanel** - Token-based actions
21. **Event popups** - Discovery, crisis alerts

**Why fourth:** Depends on simulation engine and schedule mode data.

### Phase 5: Summary Mode (Build last)
22. **SummaryView** - Day-end summary
23. **Day loop integration** - Summary -> next day -> schedule

**Why last:** Simplest mode, just displays finalized data.

---

## How Simulation/Animation Loop Integrates with React

### The Core Challenge

React's declarative model conflicts with game loops:
- **React:** Re-render when state changes
- **Games:** Update state continuously, render at 60fps

### The Solution: MobX as Bridge

```
[Simulation Engine]           [MobX Store]           [React Components]
     |                             |                        |
     | (runs at 60fps)             |                        |
     |------ tick(dt) ------------>|                        |
     |                             | (batched updates)      |
     |                             |----------------------->|
     |                             |                        | (re-render)
     |                             |                        |
```

### Implementation Pattern

```typescript
// SimulationEngine.ts (pure TypeScript, no React)
class SimulationEngine {
  private gameStore: GameStore;
  private frameCount = 0;

  tick(deltaTime: number) {
    this.frameCount++;

    // Update simulation state every frame
    this.updatePositions(deltaTime);
    this.updateTimers(deltaTime);

    // Only push to MobX store every N frames or on meaningful changes
    if (this.frameCount % 3 === 0 || this.hasSignificantChange()) {
      runInAction(() => {
        // Batch all updates
        this.gameStore.simulationTime = this.time;
        this.gameStore.patientPositions = this.getPositions();

        // Process queued events
        while (this.eventQueue.length > 0) {
          this.gameStore.processEvent(this.eventQueue.shift()!);
        }
      });
    }
  }
}

// ObserveView.tsx (React component)
export const ObserveView = observer(() => {
  const { gameStore, simulationEngine } = useStores();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start/stop simulation based on mode
  useEffect(() => {
    simulationEngine.start();
    return () => simulationEngine.stop();
  }, []);

  // The component re-renders when gameStore observables change
  // But the canvas animation runs independently

  return (
    <div className="observe-view">
      <TimeControls />
      <SimulationCanvas
        ref={canvasRef}
        positions={gameStore.patientPositions}
      />
      <InterventionPanel />
    </div>
  );
});
```

### For Smooth Visual Animation

Two approaches:

**Option A: Canvas-based (recommended for complex animations)**
```typescript
// Canvas runs its own render loop, reads from store
function SimulationCanvas({ positions }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    let rafId: number;

    function render() {
      // Read current positions (MobX observable)
      // Interpolate visually for smoothness
      // Draw to canvas
      ctx.clearRect(0, 0, width, height);
      for (const [id, pos] of positions) {
        drawPatient(ctx, id, pos);
      }
      rafId = requestAnimationFrame(render);
    }

    render();
    return () => cancelAnimationFrame(rafId);
  }, [positions]);

  return <canvas ref={canvasRef} />;
}
```

**Option B: CSS transforms (simpler, for basic movement)**
```typescript
// Use CSS transitions for smooth movement
const PatientSprite = observer(({ patientId }) => {
  const { gameStore } = useStores();
  const position = gameStore.patientPositions.get(patientId);

  return (
    <div
      className="patient-sprite"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.1s linear' // CSS handles interpolation
      }}
    >
      <PatientAvatar id={patientId} />
    </div>
  );
});
```

---

## Sources

### MobX Architecture
- [MobX: Defining Data Stores](https://mobx.js.org/defining-data-stores.html) - Official store organization patterns (HIGH confidence)
- [MobX Root Store Pattern](https://dev.to/ivandotv/mobx-root-store-pattern-with-react-hooks-318d) - React hooks integration (MEDIUM confidence)
- [MobX Reactions](https://mobx.js.org/reactions.html) - Side effects and autorun (HIGH confidence)

### React Animation Patterns
- [Using requestAnimationFrame with React Hooks](https://css-tricks.com/using-requestanimationframe-with-react-hooks/) - RAF integration patterns (MEDIUM confidence)
- [Motion for React useAnimationFrame](https://motion.dev/docs/react-use-animation-frame) - Animation frame hook (MEDIUM confidence)

### Game Architecture
- [Architecting a Turn-Based Game with Redux](https://trashmoon.com/blog/2019/architecting-a-turn-based-game-engine-with-redux/) - Turn-based patterns applicable to schedule-observe (LOW-MEDIUM confidence, older)
- [Game Programming Patterns: State](https://gameprogrammingpatterns.com/state.html) - FSM patterns for game modes (HIGH confidence)
- [State Machines in React](https://mastery.games/post/state-machines-in-react/) - React + state machines (MEDIUM confidence)

### ECS and Separation of Concerns
- [ECS Architecture in Game Development](https://www.daydreamsoft.com/blog/mastering-entity-component-system-ecs-in-game-development) - Component separation principles (MEDIUM confidence)
- [Game Engine Architecture Design Patterns](https://30dayscoding.com/blog/game-engine-architecture-design-patterns-and-principles) - Decoupling logic from rendering (MEDIUM confidence)
