# Phase 01: Foundation - Research

**Researched:** 2026-01-28
**Domain:** React + MobX game state infrastructure with mode switching
**Confidence:** HIGH

## Summary

Phase 1 establishes the foundational architecture for the Lifelines prototype: MobX stores for game state, TypeScript data models for patients and activities, and a mode-switching shell with basic layout. This is a greenfield project scaffolding phase.

The primary challenge is setting up MobX correctly from the start to avoid the common pitfalls documented in prior research (reactivity breaks, state-in-two-places syndrome). The recommended approach follows patterns from the existing `mental-sine-waves` prototype, adapted for the schedule-observe gameplay loop.

Key insight: The prior prototype provides a working reference for MobX + React 19 + Vite + Tailwind v4 + DaisyUI integration. The main differences are: (1) this prototype needs distinct game modes, (2) simpler patient model (MTG colors vs complex traits), and (3) energy (Overskudd) as the primary resource instead of multiple resources.

**Primary recommendation:** Scaffold project from scratch using the `mental-sine-waves` package.json and vite config as reference, then build MobX stores with the domain/UI store separation pattern documented in ARCHITECTURE.md.

## Standard Stack

The stack is constrained by PROJECT.md. All versions verified against the prior prototype and npm registry.

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.x | UI framework | Project constraint, React 19 stable |
| TypeScript | 5.9.x | Type safety | Matches prior prototype |
| Vite (via rolldown-vite) | 7.2.x | Build tool, dev server | Prior prototype uses rolldown-vite for speed |
| MobX | 6.15.0 | Observable state | Project constraint, excellent for game state |
| mobx-react-observer | 1.1.0 | React bindings with auto-observer | Prior prototype uses this for automatic observer wrapping |

### Styling

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.1.x | Utility CSS | Project constraint |
| @tailwindcss/vite | 4.1.x | Vite plugin for Tailwind v4 | Required for Tailwind v4 with Vite |
| DaisyUI | 5.5.x | Component library | Project constraint, v5 compatible with Tailwind v4 |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.1.x | Class name utility | Conditional class composition |
| lucide-react | 0.56x.x | Icons | UI icons for mode indicator, energy bars |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| mobx-react-observer | mobx-react-lite | mobx-react-observer auto-wraps observer, less boilerplate |
| rolldown-vite | standard vite | rolldown-vite is faster, prior prototype uses it |

**Installation:**
```bash
npm install react@19.2.0 react-dom@19.2.0 mobx@6.15.0 mobx-react-observer@1.1.0 clsx@2.1.1 lucide-react@0.562.0
npm install -D typescript@5.9.3 @types/react@19.2.5 @types/react-dom@19.2.3 @vitejs/plugin-react@5.1.1 babel-plugin-react-compiler@1.0.0 tailwindcss@4.1.18 @tailwindcss/vite@4.1.18 daisyui@5.5.14 vite@npm:rolldown-vite@7.2.5
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── stores/              # MobX stores
│   ├── GameStore.ts     # Domain state (patients, activities, schedule, day)
│   ├── UIStore.ts       # UI state (current mode, selections)
│   └── RootStore.ts     # Store composition and React context
├── models/              # TypeScript types and classes
│   ├── Patient.ts       # Patient entity with MTG color
│   ├── Activity.ts      # Activity definition with energy cost/gain
│   └── types.ts         # Shared types (GameMode, TimeSlot, etc.)
├── components/          # React components
│   ├── GameShell.tsx    # Mode switching container
│   ├── PatientCard.tsx  # Patient display with energy bar
│   ├── ActivityList.tsx # Activity sidebar
│   └── DayHeader.tsx    # Day number and time slot display
├── index.css            # Tailwind + DaisyUI imports
├── main.tsx             # React entry point
└── Game.tsx             # Root game component
```

### Pattern 1: MobX Store Singleton with Hook Access

**What:** Create store as singleton, expose via custom hook for components.

**When to use:** All store access in React components.

**Example:**
```typescript
// stores/GameStore.ts
import { makeAutoObservable } from 'mobx';

export class GameStore {
  currentDay = 1;
  currentMode: 'schedule' | 'observe' | 'summary' = 'schedule';
  patients: Patient[] = [];
  activities: Activity[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setMode(mode: GameMode) {
    this.currentMode = mode;
  }
}

const gameStore = new GameStore();
export const useGameStore = () => gameStore;
export const getGameStore = () => gameStore; // for non-React access
```

### Pattern 2: Domain/UI Store Separation

**What:** Separate game logic state from presentation state.

**When to use:** Always. Domain store holds game data, UI store holds view state.

**Example:**
```typescript
// stores/UIStore.ts
export class UIStore {
  selectedPatientId: string | null = null;
  sidebarExpanded = true;

  constructor() {
    makeAutoObservable(this);
  }
}

// stores/RootStore.ts
export class RootStore {
  gameStore: GameStore;
  uiStore: UIStore;

  constructor() {
    this.gameStore = new GameStore();
    this.uiStore = new UIStore();
  }
}
```

### Pattern 3: Observable Entity Classes

**What:** Model game entities as observable classes with makeAutoObservable.

**When to use:** Patients, activities, any entity with mutable state.

**Example:**
```typescript
// models/Patient.ts
import { makeAutoObservable } from 'mobx';
import type { MTGColor } from './types';

export class Patient {
  id: string;
  name: string;
  energy: number;
  maxEnergy = 10;
  primaryColor: MTGColor;
  secondaryColor?: MTGColor;

  constructor(data: PatientData) {
    this.id = data.id;
    this.name = data.name;
    this.energy = data.energy;
    this.primaryColor = data.primaryColor;
    this.secondaryColor = data.secondaryColor;
    makeAutoObservable(this);
  }

  get energyPercent(): number {
    return (this.energy / this.maxEnergy) * 100;
  }

  get energyStatus(): 'high' | 'medium' | 'low' {
    if (this.energy >= 6) return 'high';
    if (this.energy >= 3) return 'medium';
    return 'low';
  }
}
```

### Anti-Patterns to Avoid

- **Mixing useState and MobX for same data:** Use MobX for all domain state. useState only for ephemeral UI state like hover effects.
- **Forgetting observer wrapper:** With mobx-react-observer and babel plugin, this is handled automatically. But verify the plugin is configured.
- **Storing derived state:** Use computed getters instead of storing derived values.
- **Deep nesting observables:** Keep entity classes flat. Don't nest observable arrays in observable arrays.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class name composition | String concatenation | clsx | Edge cases with falsy values |
| Icon system | Custom SVGs | lucide-react | Consistent sizing, tree-shakable |
| Component styling | Custom CSS | DaisyUI components | Consistent theme, dark mode |
| Observable state | Custom pub/sub | MobX | Reactivity edge cases, batching |
| Color theming | Manual CSS variables | DaisyUI themes | Built-in dark/light, semantic colors |

**Key insight:** DaisyUI provides `card`, `badge`, `progress` components that directly match Phase 1 UI needs (patient cards, color indicators, energy bars).

## Common Pitfalls

### Pitfall 1: MobX Observer Not Triggering Re-render

**What goes wrong:** Component doesn't update when MobX state changes.

**Why it happens:**
- Component not wrapped with observer (should be auto-handled by mobx-react-observer plugin)
- Dereferencing observable outside render (in useEffect callback, after await)
- Accessing array by index that doesn't exist

**How to avoid:**
1. Verify babel plugin is configured in vite.config.ts
2. Access observables directly in JSX, not in variables above the return
3. Use `toJS()` for debugging to see actual values

**Warning signs:** Console.log shows correct state but UI shows old value.

### Pitfall 2: State in Two Places

**What goes wrong:** Same data exists in both MobX store and React useState, goes out of sync.

**Why it happens:** Mixing patterns from different tutorials.

**How to avoid:**
- Rule: Domain state (patients, day, mode) = MobX
- Rule: Ephemeral UI state (hover, animation in-progress) = useState/useRef
- Never sync MobX to useState

**Warning signs:** useEffect that copies store.value to local state.

### Pitfall 3: Wrong Tailwind v4 Configuration

**What goes wrong:** Styles don't apply, DaisyUI components unstyled.

**Why it happens:** Tailwind v4 changed config from tailwind.config.js to CSS-based.

**How to avoid:**
```css
/* index.css - CORRECT for Tailwind v4 + DaisyUI 5 */
@import "tailwindcss";
@plugin "daisyui" {
  themes: dracula;
}
```
Do NOT create tailwind.config.js - that's the v3 pattern.

**Warning signs:** Build succeeds but no Tailwind classes apply.

### Pitfall 4: Overengineering for Phase 1

**What goes wrong:** Building complex systems (simulation engine, animation, save/load) in foundation phase.

**Why it happens:** Anticipating future phases.

**How to avoid:** Phase 1 success criteria are narrow:
1. App loads with mode indicator
2. Patient cards with energy display
3. Activity list with energy values
4. Day/time visible

If you're building anything beyond displaying static data and mode switching, you're overbuilding.

**Warning signs:** Implementing schedule assignment, animation, or simulation in Phase 1.

## Code Examples

### GameStore Initial Setup

```typescript
// stores/GameStore.ts
import { makeAutoObservable } from 'mobx';
import { Patient } from '../models/Patient';
import { Activity } from '../models/Activity';
import type { GameMode, TimeSlot } from '../models/types';

export class GameStore {
  // STATE-04: Day and time tracking
  currentDay = 1;
  currentTimeSlot: TimeSlot = 'morning';
  currentMode: GameMode = 'schedule';

  // STATE-01: Patient entities
  patients: Patient[] = [];

  // STATE-02: Activity definitions
  activities: Activity[] = [];

  // STATE-03: Schedule (implemented in Phase 2)
  // schedule: Map<string, (string | null)[]> = new Map();

  constructor() {
    makeAutoObservable(this);
    this.initializeGame();
  }

  private initializeGame() {
    // Initialize with hardcoded patients for Phase 1
    this.patients = [
      new Patient({ id: '1', name: 'Elling', energy: 7, primaryColor: 'blue', secondaryColor: 'green' }),
      new Patient({ id: '2', name: 'Kjell-Bjarne', energy: 5, primaryColor: 'green', secondaryColor: 'white' }),
      new Patient({ id: '3', name: 'Nora', energy: 8, primaryColor: 'red', secondaryColor: 'blue' }),
    ];

    // Initialize with hardcoded activities
    this.activities = [
      new Activity({ id: 'cooking', name: 'Cooking', energyCost: -2, color: 'green' }),
      new Activity({ id: 'therapy', name: 'Therapy', energyCost: -3, color: 'blue' }),
      new Activity({ id: 'garden', name: 'Gardening', energyCost: -1, color: 'green' }),
      new Activity({ id: 'rest', name: 'Rest', energyCost: 2, color: 'white' }),
      new Activity({ id: 'reading', name: 'Reading', energyCost: -1, color: 'blue' }),
      new Activity({ id: 'social', name: 'Social Hour', energyCost: -2, color: 'red' }),
      new Activity({ id: 'craft', name: 'Crafts', energyCost: -1, color: 'red' }),
      new Activity({ id: 'exercise', name: 'Exercise', energyCost: -2, color: 'green' }),
    ];
  }

  setMode(mode: GameMode) {
    this.currentMode = mode;
  }
}
```

### Patient Card Component

```typescript
// components/PatientCard.tsx
import { useGameStore } from '../stores/GameStore';
import clsx from 'clsx';

const colorMap = {
  white: 'border-amber-100',
  blue: 'border-blue-500',
  black: 'border-gray-800',
  red: 'border-red-500',
  green: 'border-green-500',
};

const energyColorMap = {
  high: 'progress-success',
  medium: 'progress-warning',
  low: 'progress-error',
};

export function PatientCard({ patientId }: { patientId: string }) {
  const store = useGameStore();
  const patient = store.patients.find(p => p.id === patientId);

  if (!patient) return null;

  return (
    <div className={clsx(
      'card bg-base-200 shadow-lg border-l-4',
      colorMap[patient.primaryColor]
    )}>
      <div className="card-body p-4">
        <h3 className="card-title text-lg">{patient.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-70">Energy:</span>
          <span className="font-bold">{patient.energy}</span>
        </div>
        <progress
          className={clsx('progress w-full', energyColorMap[patient.energyStatus])}
          value={patient.energy}
          max={patient.maxEnergy}
        />
      </div>
    </div>
  );
}
```

### Types Definition

```typescript
// models/types.ts
export type GameMode = 'schedule' | 'observe' | 'summary';
export type TimeSlot = 'morning' | 'afternoon' | 'evening';
export type MTGColor = 'white' | 'blue' | 'black' | 'red' | 'green';

export interface PatientData {
  id: string;
  name: string;
  energy: number;
  primaryColor: MTGColor;
  secondaryColor?: MTGColor;
}

export interface ActivityData {
  id: string;
  name: string;
  energyCost: number; // negative = costs energy, positive = restores
  color: MTGColor;    // activity's natural affinity
}
```

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import observerPlugin from 'mobx-react-observer/babel-plugin';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler', observerPlugin()],
      },
    }),
    tailwindcss(),
  ],
});
```

### CSS Setup

```css
/* src/index.css */
@import "tailwindcss";
@plugin "daisyui" {
  themes: dracula;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind config.js | CSS-based @plugin | Tailwind v4 (2024) | No config file needed |
| mobx-react-lite + manual observer | mobx-react-observer + babel plugin | 2024 | Auto-wrapping, less boilerplate |
| framer-motion | motion | Late 2024 | Package renamed, same API |

**Deprecated/outdated:**
- tailwind.config.js: Use CSS @import and @plugin instead for Tailwind v4
- mobx decorators (@observable, @action): Use makeAutoObservable instead

## Open Questions

1. **Color palette for game-like feel**
   - What we know: CONTEXT.md says "darker background, bold colors, strategy game UI"
   - What's unclear: Exact DaisyUI theme choice - dracula vs custom
   - Recommendation: Start with dracula theme (dark, colorful), adjust if needed

2. **Activity energy sign convention**
   - What we know: Activities cost OR restore energy
   - What's unclear: Should positive = gain or positive = cost?
   - Recommendation: Use negative for cost, positive for gain (intuitive for display: "+2" means you gain)

## Sources

### Primary (HIGH confidence)
- Prior prototype `/Users/godstemning/Projects/mental-sine-waves` - Working MobX + React 19 + Vite + Tailwind v4 reference
- `.planning/research/STACK.md` - Verified library versions
- `.planning/research/ARCHITECTURE.md` - Store patterns and component hierarchy
- `.planning/research/PITFALLS.md` - Common mistakes to avoid

### Secondary (MEDIUM confidence)
- MobX official docs for makeAutoObservable patterns
- DaisyUI 5 documentation for Tailwind v4 integration

### Tertiary (LOW confidence)
- None - Phase 1 research is well-grounded in existing project research

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Directly matches prior prototype and project constraints
- Architecture: HIGH - Verified patterns from existing research documents
- Pitfalls: HIGH - Documented in prior research, specific to this stack

**Research date:** 2026-01-28
**Valid until:** 60 days (stable foundations, no fast-moving dependencies)
