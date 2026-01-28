# Technology Stack

**Project:** Lifelines Prototype
**Researched:** 2026-01-28
**Confidence:** HIGH (versions verified via npm registry and official sources)

## Executive Summary

This stack leverages the constrained technologies (React 19, MobX, Vite, Tailwind v4, DaisyUI) with targeted additions for animation and simulation playback. The key insight: **MobX's fine-grained reactivity is ideal for game state** — entities update independently without cascade re-renders, and the observable pattern maps naturally to simulation ticks.

For animation, **Motion (formerly Framer Motion)** is recommended over React Spring because:
1. Better enter/exit animations via `AnimatePresence` (critical for cards appearing/disappearing)
2. Layout animations built-in (entities moving between slots)
3. Variant system for reusable animation states (perfect for entity behaviors)

---

## Recommended Stack

### Core Framework (Constrained)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| React | 19.2.4 | UI framework | HIGH |
| TypeScript | 5.7+ | Type safety | HIGH |
| Vite | 7.3.1 | Build tool, dev server | HIGH |

**Why these versions:**
- React 19.2.4 is the current stable release (verified 2026-01-28)
- Vite 7.3.1 is the current stable (v8 is in beta)
- These versions are production-ready and well-documented

### Styling (Constrained)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| Tailwind CSS | 4.1.18 | Utility CSS | HIGH |
| DaisyUI | 5.5.14 | Component library | HIGH |

**Critical:** DaisyUI 5 is fully compatible with Tailwind v4. Configuration now happens in CSS, not `tailwind.config.js`:

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: light, dark;
}
```

### State Management (Constrained)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| MobX | 6.15.0 | Observable state | HIGH |
| mobx-react-lite | 4.1.1 | React bindings | HIGH |

**Why MobX for game state:**
- Fine-grained reactivity: Only affected components re-render
- No boilerplate: Direct mutation with `@action` decorator
- Observable collections: Track arrays/maps of entities naturally
- React 19 support confirmed in mobx-react-lite 4.1.0+

**MobX vs alternatives for this use case:**
- Redux: Too much boilerplate for prototype speed
- Zustand: Good, but MobX's class-based stores model game entities better
- XState: Overkill for MVP; consider for complex entity AI later

### Animation

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| motion | 12.29.2 | Animation library | HIGH |

**Why Motion (Framer Motion) over React Spring:**
- `AnimatePresence`: Handles enter/exit animations when entities appear/disappear
- `layoutId`: Smooth transitions when cards move between containers
- Variant system: Define reusable animation states ("idle", "walking", "busy")
- Bundle size: 34kb full, reducible to ~6kb with `LazyMotion`

**Installation:**
```bash
npm install motion
```

Note: The package is now called `motion` (not `framer-motion`), though `framer-motion` still works as an alias.

### Simulation / Game Loop

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| mobx-utils | 6.1.1 | Time-as-observable, async utilities | MEDIUM |
| (custom hook) | - | Game tick management | HIGH |

**Pattern for simulation playback:**

The simulation is NOT a real-time game loop. It's a **turn-based timeline playback**:

1. Player schedules activities (editing state)
2. Player clicks "Play Day"
3. Simulation advances through time slots, triggering animations
4. Results shown, player adjusts for next day

**Recommended approach:**

```typescript
// SimulationStore.ts
import { makeAutoObservable, runInAction } from 'mobx';

class SimulationStore {
  currentTick = 0;
  isPlaying = false;
  playbackSpeed = 1; // multiplier

  constructor() {
    makeAutoObservable(this);
  }

  async playDay() {
    this.isPlaying = true;
    const totalTicks = 24; // e.g., 24 time slots

    for (let tick = 0; tick < totalTicks; tick++) {
      await this.advanceTick();
      await this.waitForAnimations();
    }

    runInAction(() => {
      this.isPlaying = false;
    });
  }

  private async advanceTick() {
    runInAction(() => {
      this.currentTick++;
      // Update all entity positions based on schedule
    });
  }

  private waitForAnimations(): Promise<void> {
    const baseDelay = 500; // ms per tick
    return new Promise(resolve =>
      setTimeout(resolve, baseDelay / this.playbackSpeed)
    );
  }
}
```

**Why NOT requestAnimationFrame for this:**
- This isn't a 60fps game — it's a timeline visualization
- `setTimeout` with configurable delay gives player control over playback speed
- MobX reactions handle UI updates automatically when state changes

**When to use requestAnimationFrame:**
- Smooth CSS transitions during movement (handled by Motion)
- Optional: Continuous particle effects or ambient animations

### Utility Libraries

| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| uuid | 13.0.0 | Entity IDs | Every entity needs a stable ID |
| @use-gesture/react | 10.3.1 | Drag-and-drop | If drag scheduling is added |

---

## What NOT to Use

| Technology | Why Not |
|------------|---------|
| Redux | Too much boilerplate; MobX is faster for prototyping |
| XState | Overkill for MVP; adds complexity without immediate benefit |
| React Query/TanStack Query | No server data; this is client-only simulation |
| Canvas/WebGL/PixiJS | Overkill for card-based visuals; CSS + Motion is sufficient |
| GSAP | More powerful than needed; Motion covers all use cases here |
| React Spring | No `AnimatePresence` equivalent; enter/exit animations harder |
| Zustand | Fine choice, but MobX class stores model entities better |
| MobX-State-Tree | Adds unnecessary complexity for a prototype |
| Immer | MobX already handles mutability; combining adds confusion |
| Web Workers | Simulation logic is too simple to need threading |

---

## Architecture Recommendations

### Entity Modeling with MobX

```typescript
// Entity.ts
import { makeAutoObservable } from 'mobx';

export class Patient {
  id: string;
  name: string;
  currentLocation: string;
  schedule: ScheduleEntry[] = [];
  status: 'idle' | 'moving' | 'busy' = 'idle';

  constructor(data: PatientData) {
    this.id = data.id;
    this.name = data.name;
    this.currentLocation = data.startLocation;
    makeAutoObservable(this);
  }

  moveTo(location: string) {
    this.status = 'moving';
    this.currentLocation = location;
  }

  arrive() {
    this.status = 'busy';
  }
}
```

### Animation Integration

```tsx
// PatientCard.tsx
import { motion, AnimatePresence } from 'motion/react';
import { observer } from 'mobx-react-lite';

export const PatientCard = observer(({ patient }: { patient: Patient }) => {
  return (
    <motion.div
      layoutId={patient.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3 }
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="card bg-base-100 shadow-xl"
    >
      <div className="card-body">
        <h2 className="card-title">{patient.name}</h2>
        <p>Status: {patient.status}</p>
      </div>
    </motion.div>
  );
});
```

### Time Slot Grid with Layout Animations

```tsx
// TimeSlot.tsx
import { motion, AnimatePresence } from 'motion/react';

export const TimeSlot = observer(({ slot, patients }: Props) => {
  return (
    <div className="min-h-24 border border-base-300 p-2">
      <AnimatePresence mode="popLayout">
        {patients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </AnimatePresence>
    </div>
  );
});
```

The `layoutId` on PatientCard enables smooth transitions when a patient moves from one slot to another — Motion handles the animation automatically.

---

## Installation

```bash
# Core (already in project based on constraints)
npm install react@19.2.4 react-dom@19.2.4

# State management
npm install mobx@6.15.0 mobx-react-lite@4.1.1

# Animation
npm install motion@12.29.2

# Utilities
npm install uuid@13.0.0
npm install -D @types/uuid

# Styling (via Vite plugin or PostCSS)
npm install -D tailwindcss@4.1.18 daisyui@5.5.14
```

**Tailwind v4 + DaisyUI 5 Setup (CSS file):**

```css
/* src/index.css */
@import "tailwindcss";
@plugin "daisyui" {
  themes: light, dark, retro;
}
```

---

## Performance Considerations

### MobX Optimization

1. **Use `observer` on leaf components** — wrapping small components prevents parent re-renders
2. **Avoid passing observables to non-observer components** — it breaks reactivity
3. **Use `runInAction` for batched updates** — multiple state changes in one render

### Motion Optimization

1. **Use `LazyMotion` for smaller bundles:**
```tsx
import { LazyMotion, domAnimation, m } from 'motion/react';

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <m.div animate={{ opacity: 1 }} />
    </LazyMotion>
  );
}
```

2. **Prefer `layout` over `layoutId` when possible** — less overhead
3. **Use `mode="popLayout"` on AnimatePresence** — prevents layout shift during exit

### Simulation Playback

1. **Batch entity updates per tick** — update all entities in one `runInAction`
2. **Debounce UI updates if needed** — MobX handles this automatically for most cases
3. **Keep playback delay configurable** — users may want faster/slower playback

---

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| Core stack versions | HIGH | Verified via npm registry |
| MobX + React 19 | HIGH | mobx-react-lite 4.1.0+ explicitly supports React 19 |
| DaisyUI + Tailwind v4 | HIGH | DaisyUI 5 specifically built for Tailwind v4 |
| Motion for animation | HIGH | Production-proven, version 12.x is stable |
| Simulation pattern | MEDIUM | Custom implementation needed; pattern is sound but untested |
| mobx-utils for time | LOW | May not be needed; simple setTimeout likely sufficient |

---

## Open Questions for Implementation

1. **Drag-and-drop scheduling**: Should patients be draggable between time slots? If yes, add `@use-gesture/react`
2. **Undo/redo**: If needed, consider adding Immer for schedule editing (not simulation)
3. **Sound effects**: Not researched; add if time-lapse needs audio cues
4. **Save/load game state**: MobX stores serialize cleanly with `toJS()`; JSON storage is straightforward

---

## Sources

### Verified via npm registry (2026-01-28)
- React 19.2.4, MobX 6.15.0, mobx-react-lite 4.1.1
- Motion 12.29.2, Vite 7.3.1
- Tailwind CSS 4.1.18, DaisyUI 5.5.14

### Official documentation
- [MobX React 19 Support Discussion](https://github.com/mobxjs/mobx/discussions/3984) - Confirms mobx-react 9.2.0+ supports React 19
- [DaisyUI 5 Release Notes](https://daisyui.com/docs/v5/) - Confirms Tailwind v4 compatibility
- [Motion for React Docs](https://motion.dev/docs/react) - Animation API reference

### Ecosystem research
- [State Management in 2026](https://www.nucamp.co/blog/state-management-in-2026-redux-context-api-and-modern-patterns) - MobX market position
- [React Animation Libraries 2026](https://www.syncfusion.com/blogs/post/top-react-animation-libraries) - Motion vs React Spring comparison
- [State Machines in React](https://mastery.games/post/state-machines-in-react/) - XState game development patterns
- [JavaScript Game Loop](https://www.aleksandrhovhannisyan.com/blog/javascript-game-loop/) - requestAnimationFrame vs setTimeout
- [MobX Utils](https://github.com/mobxjs/mobx-utils) - now() function for time-based reactivity
