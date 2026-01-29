# Phase 4: Day End Summary - Research

**Researched:** 2026-01-29
**Domain:** React summary views, step-through flows, card flip animations, MobX state transitions
**Confidence:** HIGH

## Summary

Phase 4 implements a feedback screen that summarizes the day's events and enables the player to advance to the next day. The core challenge is presenting multiple categories of information (energy changes, XP gains, discoveries, intervention usage) in a step-through guided flow with engaging animations like card flips for discoveries.

The recommended approach uses:
1. **Motion library** with `rotateY` transforms for 3D card flip animations (discovery reveals)
2. **CSS-only mini bar charts** using Tailwind flex/width utilities (no charting library needed)
3. **MobX store with reset action** for day transition state management
4. **Simple step-through pattern** using useState for current step index (no wizard library needed)

The existing codebase patterns (MobX singleton stores with hook accessors, DaisyUI components, Motion library) apply directly. Phase 4 displays data that Phase 5 will later make dynamic (XP tracking, overnight regeneration).

**Primary recommendation:** Use a step-through component with Motion card flip animations for discoveries, CSS-based mini bar charts for energy display, and a MobX store action to reset/advance day state.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.29.2 | Card flip animations | Already in use. rotateY with perspective for 3D flip effect |
| mobx | 6.15.0 | State management | Already in use. Action-based reset for day transition |
| react | 19.2.0 | Component framework | Already in use. useState for step-through flow |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.562.0 | Icons | Already in use. For next/skip buttons, energy arrows |
| clsx | 2.1.1 | Conditional classes | Already in use. For step indicators |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS bar charts | react-sparklines | Overkill for simple start/end/change bars. CSS is sufficient |
| useState step-through | react-step-wizard | Adds dependency for simple 4-step flow. useState simpler |
| Manual flip animation | react-card-flip | Motion already available, consistent with codebase |

**Installation:**
```bash
# No new dependencies needed - all libraries already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── stores/
│   ├── GameStore.ts        # Add startEnergySnapshot, xpGains tracking
│   └── SimulationStore.ts  # Add interventionLog for reporting
├── components/
│   └── summary/            # NEW folder for summary mode
│       ├── SummaryView.tsx       # Main container with step-through logic
│       ├── EnergySection.tsx     # Energy change display with mini bar charts
│       ├── XPSection.tsx         # Per-activity XP gains display
│       ├── DiscoverySection.tsx  # Card flip reveals
│       ├── InterventionSection.tsx # Token usage summary
│       ├── DaySplash.tsx         # "Day X" brief splash screen
│       └── ContinueButton.tsx    # Advance to next day
└── models/
    └── types.ts            # Add Discovery, InterventionLog types
```

### Pattern 1: Step-Through Guided Flow
**What:** Sequential sections revealed by user clicks, with step indicator
**When to use:** For presenting summary information in digestible chunks
**Example:**
```typescript
// Source: Standard React pattern, no external library needed
import { useState } from 'react';

type SummaryStep = 'energy' | 'xp' | 'discoveries' | 'complete';
const STEPS: SummaryStep[] = ['energy', 'xp', 'discoveries', 'complete'];

function SummaryView() {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const skipToEnd = () => {
    setCurrentStep(STEPS.length - 1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Step indicator */}
      <div className="steps">
        {STEPS.map((step, i) => (
          <div
            key={step}
            className={`step ${i <= currentStep ? 'step-primary' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Current section content */}
      {STEPS[currentStep] === 'energy' && <EnergySection />}
      {STEPS[currentStep] === 'xp' && <XPSection />}
      {STEPS[currentStep] === 'discoveries' && <DiscoverySection />}
      {STEPS[currentStep] === 'complete' && <ContinueButton />}

      {/* Navigation */}
      <div className="flex justify-between">
        <button className="btn btn-ghost" onClick={skipToEnd}>
          Skip
        </button>
        {currentStep < STEPS.length - 1 && (
          <button className="btn btn-primary" onClick={nextStep}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
```

### Pattern 2: Card Flip Animation with Motion
**What:** 3D card rotation that reveals hidden content
**When to use:** For discovery reveals that need dramatic effect
**Example:**
```typescript
// Source: Motion docs + framer-motion flip patterns
import { useState } from 'react';
import { motion } from 'motion/react';

interface DiscoveryCardProps {
  discovery: { front: string; back: string };
  autoReveal?: boolean;
}

function DiscoveryCard({ discovery, autoReveal = false }: DiscoveryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative h-32 w-48 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative h-full w-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-base-200 p-4"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-2xl">?</span>
        </div>

        {/* Back face (pre-rotated 180deg) */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-primary p-4 text-primary-content"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <span className="text-center text-sm">{discovery.back}</span>
        </div>
      </motion.div>
    </div>
  );
}
```

### Pattern 3: CSS-Only Mini Bar Chart
**What:** Simple horizontal bars showing start/end/change values
**When to use:** For energy change visualization without chart libraries
**Example:**
```typescript
// Source: Pure CSS with Tailwind utilities
interface EnergyBarProps {
  startEnergy: number;
  endEnergy: number;
  maxEnergy: number;
}

function EnergyBar({ startEnergy, endEnergy, maxEnergy }: EnergyBarProps) {
  const startPercent = (startEnergy / maxEnergy) * 100;
  const endPercent = (endEnergy / maxEnergy) * 100;
  const change = endEnergy - startEnergy;

  return (
    <div className="flex flex-col gap-1">
      {/* Start bar */}
      <div className="flex items-center gap-2">
        <span className="w-12 text-xs text-base-content/60">Start</span>
        <div className="h-3 flex-1 rounded-full bg-base-300">
          <div
            className="h-full rounded-full bg-info transition-all"
            style={{ width: `${startPercent}%` }}
          />
        </div>
        <span className="w-8 text-right text-sm">{startEnergy}</span>
      </div>

      {/* End bar */}
      <div className="flex items-center gap-2">
        <span className="w-12 text-xs text-base-content/60">End</span>
        <div className="h-3 flex-1 rounded-full bg-base-300">
          <div
            className={`h-full rounded-full transition-all ${
              endEnergy >= startEnergy ? 'bg-success' : 'bg-error'
            }`}
            style={{ width: `${endPercent}%` }}
          />
        </div>
        <span className="w-8 text-right text-sm">{endEnergy}</span>
      </div>

      {/* Change indicator */}
      <div className={`text-center text-sm font-semibold ${
        change > 0 ? 'text-success' : change < 0 ? 'text-error' : 'text-base-content'
      }`}>
        {change > 0 ? '+' : ''}{change}
      </div>
    </div>
  );
}
```

### Pattern 4: MobX Day Transition Action
**What:** Atomic state reset and advancement for new day
**When to use:** When transitioning from summary to next day's schedule
**Example:**
```typescript
// Source: MobX actions pattern + existing codebase conventions
import { makeAutoObservable, runInAction } from 'mobx';

class GameStore {
  currentDay: number = 1;
  // Snapshot captured at day start for END-01 comparison
  startEnergySnapshot: Map<string, number> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  // Called when transitioning to observe mode
  captureStartEnergy(): void {
    for (const patient of this.patients) {
      this.startEnergySnapshot.set(patient.id, patient.energy);
    }
  }

  // Called when clicking Continue from summary
  advanceToNextDay(): void {
    runInAction(() => {
      // Increment day
      this.currentDay++;

      // Partial energy recovery (Phase 5 will make this more sophisticated)
      for (const patient of this.patients) {
        patient.energy = Math.min(
          patient.maxEnergy,
          patient.energy + 3 // +3 overnight recovery per CONTEXT
        );
      }

      // Clear snapshot
      this.startEnergySnapshot.clear();

      // Keep schedule (pre-filled for convenience per CONTEXT)
      // Don't clear: this.schedule

      // Reset to schedule mode
      this.currentMode = 'schedule';
    });
  }
}
```

### Anti-Patterns to Avoid
- **Resetting schedule on day advance:** CONTEXT says "previous day's schedule pre-filled" - keep it
- **Full energy reset:** CONTEXT says "partial recovery (+3), carry over deficits" - not full heal
- **One patient at a time display:** CONTEXT says "each step shows data for all 3 patients together"
- **Complex wizard library:** Simple useState step index is sufficient for 4 steps
- **Using framer-motion imports:** Use `motion/react` imports (React 19 compatible)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Card flip animation | Manual CSS transforms | Motion rotateY | Handles spring easing, interruption, reverse cleanly |
| 3D perspective | Per-element perspective | Parent container perspective | Single perspective point looks more natural |
| Step indicator | Custom step dots | DaisyUI steps component | Already themed, accessible |
| Modal/dialog | Custom overlay | DaisyUI modal or HTML dialog | Focus trap, escape key, backdrop click built in |

**Key insight:** The existing stack (Motion, DaisyUI) provides all animation and UI primitives needed. No new libraries required.

## Common Pitfalls

### Pitfall 1: Forgetting to Capture Start Energy
**What goes wrong:** Summary shows end energy but can't calculate change
**Why it happens:** Energy values update during observe mode, losing original values
**How to avoid:** Capture snapshot into Map when entering observe mode, before any energy changes
**Warning signs:** EnergyChange calculations showing zero or nonsensical values

### Pitfall 2: Card Flip Z-Index Issues
**What goes wrong:** Back of card visible through front during flip
**Why it happens:** Missing backfaceVisibility: hidden on both faces
**How to avoid:** Apply backfaceVisibility: hidden to BOTH front and back elements, and pre-rotate back by 180deg
**Warning signs:** Both sides visible during transition, flickering

### Pitfall 3: Perspective on Wrong Element
**What goes wrong:** Card looks flat or distorted during flip
**Why it happens:** perspective applied to animated element instead of parent
**How to avoid:** Apply perspective to container div, transformStyle: preserve-3d to animated child
**Warning signs:** No 3D depth effect, or extreme perspective distortion

### Pitfall 4: Step State Not Resetting Between Days
**What goes wrong:** Summary starts at "complete" step on day 2
**Why it happens:** Step index persisted in component state between mounts
**How to avoid:** Either reset step in advanceToNextDay, or use key prop on SummaryView to force remount
**Warning signs:** Summary skipping steps on subsequent days

### Pitfall 5: Schedule Being Cleared on Day Advance
**What goes wrong:** Player has to re-enter entire schedule each day
**Why it happens:** Overzealous reset clearing schedule Map
**How to avoid:** Explicitly preserve schedule in advanceToNextDay action
**Warning signs:** Empty schedule grid when returning to schedule mode

### Pitfall 6: XP/Discovery Data Not Available
**What goes wrong:** XP section shows nothing, discoveries empty
**Why it happens:** Phase 4 displays data that Phase 5 implements
**How to avoid:** Create placeholder/mock data for XP gains and discoveries that can be replaced in Phase 5
**Warning signs:** Empty sections, errors accessing undefined properties

## Code Examples

Verified patterns from official sources:

### Complete Discovery Section with Auto-Reveal
```typescript
// Source: Motion docs + existing codebase patterns
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'motion/react';

interface Discovery {
  id: string;
  patientId: string;
  text: string; // e.g., "Ada seems to enjoy cooking"
}

// Mock data for Phase 4 - Phase 5 will make this dynamic
const mockDiscoveries: Discovery[] = [
  { id: 'd1', patientId: 'patient-1', text: 'Elling finds therapy sessions draining' },
  { id: 'd2', patientId: 'patient-3', text: 'Nora seems to enjoy social activities' },
];

export const DiscoverySection = observer(function DiscoverySection() {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-reveal cards one by one
  useEffect(() => {
    if (currentIndex < mockDiscoveries.length) {
      const timer = setTimeout(() => {
        setRevealedIds(prev => new Set(prev).add(mockDiscoveries[currentIndex].id));
        setCurrentIndex(prev => prev + 1);
      }, 800); // Stagger reveals
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">Discoveries</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {mockDiscoveries.map((discovery) => (
          <DiscoveryCard
            key={discovery.id}
            discovery={discovery}
            isRevealed={revealedIds.has(discovery.id)}
          />
        ))}
      </div>
    </div>
  );
});

interface DiscoveryCardProps {
  discovery: Discovery;
  isRevealed: boolean;
}

function DiscoveryCard({ discovery, isRevealed }: DiscoveryCardProps) {
  return (
    <div
      className="relative h-28 w-44"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative h-full w-full"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front - mystery card */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg border border-base-300 bg-base-200"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-3xl opacity-50">?</span>
        </div>

        {/* Back - revealed content */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-accent p-3 text-accent-content"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <p className="text-center text-sm">{discovery.text}</p>
        </div>
      </motion.div>
    </div>
  );
}
```

### Intervention Summary
```typescript
// Source: Existing codebase patterns
import { observer } from 'mobx-react-lite';
import { useSimulationStore } from '../../stores/SimulationStore';

interface InterventionLog {
  patientName: string;
  slot: string;
  fromActivity: string | null;
  toActivity: string | null;
}

export const InterventionSection = observer(function InterventionSection() {
  const simulationStore = useSimulationStore();

  // For Phase 4, we track: tokens used = 3 - remaining
  const tokensUsed = 3 - simulationStore.interventionTokens;

  // Phase 5 will add detailed intervention logging
  // For now, just show count
  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">Interventions</h3>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Tokens Used</div>
          <div className="stat-value">{tokensUsed}/3</div>
          <div className="stat-desc">
            {tokensUsed === 0
              ? 'No interventions needed!'
              : `Redirected ${tokensUsed} ${tokensUsed === 1 ? 'activity' : 'activities'}`
            }
          </div>
        </div>
      </div>
    </div>
  );
});
```

### Day Splash Screen
```typescript
// Source: Motion animation patterns
import { motion } from 'motion/react';

interface DaySplashProps {
  day: number;
  onComplete: () => void;
}

export function DaySplash({ day, onComplete }: DaySplashProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-base-100"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      onAnimationComplete={onComplete}
    >
      <motion.h1
        className="text-6xl font-bold"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        Day {day}
      </motion.h1>
    </motion.div>
  );
}
```

### XP Section (Placeholder for Phase 5)
```typescript
// Source: Standard patterns - Phase 5 will implement real XP tracking
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../stores/GameStore';

interface XPGain {
  activityName: string;
  xp: number;
}

// Mock XP gains - Phase 5 will calculate from actual activities
function getMockXPGains(patientId: string): XPGain[] {
  // Generate mock data based on completed schedule
  return [
    { activityName: 'Cooking', xp: 15 },
    { activityName: 'Reading', xp: 10 },
  ];
}

export const XPSection = observer(function XPSection() {
  const gameStore = useGameStore();

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">Skills Practiced</h3>
      <div className="grid grid-cols-3 gap-4">
        {gameStore.patients.map((patient) => (
          <div key={patient.id} className="card bg-base-200 p-4">
            <h4 className="mb-2 font-medium">{patient.name}</h4>
            <ul className="space-y-1 text-sm">
              {getMockXPGains(patient.id).map((gain) => (
                <li key={gain.activityName} className="flex justify-between">
                  <span>{gain.activityName}</span>
                  <span className="text-success">+{gain.xp} XP</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| framer-motion | motion | 2025 | Use `motion/react` imports for React 19 compatibility |
| CSS perspective per element | Container perspective | N/A | Single perspective point creates more natural 3D |
| Complex wizard state libs | useState step index | N/A | Simple flows don't need library overhead |

**Deprecated/outdated:**
- framer-motion: Use motion package with `motion/react` imports
- react-card-flip: Adds dependency when Motion already provides flip capability

## Open Questions

Things that couldn't be fully resolved:

1. **XP calculation formula**
   - What we know: Display per-activity XP gains in summary
   - What's unclear: How much XP per activity? Fixed or variable?
   - Recommendation: Use placeholder fixed values (15 XP per activity) for Phase 4. Phase 5 implements real formula.

2. **Discovery trigger conditions**
   - What we know: Triggered by "first time doing activity or hitting XP threshold"
   - What's unclear: Exact threshold values, which discoveries exist
   - Recommendation: Mock 1-2 discoveries per day for Phase 4. Phase 5 implements trigger system.

3. **Intervention carry-over mechanic**
   - What we know: "Get 3 fresh, but can keep 1 unused from previous day (max 4)"
   - What's unclear: Does this apply in Phase 4 or is it Phase 5 scope?
   - Recommendation: Implement token carry-over in advanceToNextDay for Phase 4 since it affects day transition.

## Sources

### Primary (HIGH confidence)
- Motion docs - Animation API: https://motion.dev/docs/react-animation
- Motion docs - React component: https://motion.dev/docs/react-motion-component
- MobX docs - Actions: https://mobx.js.org/actions.html
- React docs - Preserving and Resetting State: https://react.dev/learn/preserving-and-resetting-state
- Existing codebase - EnergyChange.tsx, SimulationStore.ts patterns

### Secondary (MEDIUM confidence)
- DEV.to - Framer Motion flip card: https://dev.to/graciesharma/how-to-create-a-flipping-card-animation-using-framer-motion-5djh (verified rotateY pattern with Motion)
- DaisyUI - Steps component: https://daisyui.com/components/steps/ (for step indicator)

### Tertiary (LOW confidence)
- WebSearch wizard patterns - Multiple React wizard libraries exist but simple useState sufficient

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in use, patterns verified
- Architecture: HIGH - Follows existing codebase conventions exactly
- Card flip animation: HIGH - Verified with Motion docs and framer-motion patterns
- Step-through flow: HIGH - Standard React useState pattern
- Day transition: MEDIUM - Logic clear, but XP/discovery data structures need Phase 5

**Research date:** 2026-01-29
**Valid until:** 2026-02-28 (Stack stable, patterns well-established)
