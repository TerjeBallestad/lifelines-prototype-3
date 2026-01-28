# Phase 3: Observe Mode - Research

**Researched:** 2026-01-28
**Domain:** React simulation playback, time-based animation, reactive state management
**Confidence:** HIGH

## Summary

Phase 3 requires implementing a real-time simulation playback system where patients execute their scheduled activities over 60-90 seconds (at 1x speed). The core challenge is managing continuous time-based state updates with smooth animations, floating energy change numbers, and player intervention capabilities.

The recommended approach uses:
1. **Motion library (not framer-motion)** for React 19 compatible animations - AnimatePresence for floating numbers that exit, basic motion components for state transitions
2. **MobX with runInAction** for simulation tick updates - the existing store architecture works well, just needs a SimulationStore with time progress and tick logic
3. **requestAnimationFrame** for the game loop with proper delta time handling - critical for smooth 1x/4x speed control
4. **CSS keyframes** for simple repeating animations (card glow/pulse) to offload work from JavaScript

**Primary recommendation:** Use Motion library's AnimatePresence for floating energy numbers, MobX action-based simulation loop with requestAnimationFrame, and CSS animations for ambient effects like card glow.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.26.0 | React animations | Only animation lib compatible with React 19. Replaces framer-motion. |
| mobx | 6.15.0 | State management | Already in use. runInAction + actions handle tick updates cleanly |
| requestAnimationFrame | (browser) | Game loop timing | Browser-native, syncs with display refresh, auto-pauses on tab switch |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.1.1 | Conditional classes | Already in use. For energy state class switching |
| lucide-react | 0.562.0 | Icons | Already in use. For play/pause/skip buttons, up/down arrows |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| motion | react-spring | React-spring has physics-based feel but Motion has simpler API for enter/exit |
| motion | CSS-only | CSS lacks AnimatePresence (exit animations) - need JS for floating numbers cleanup |
| MobX simulation | useReducer + tick | Already using MobX - adding another state pattern would split architecture |

**Installation:**
```bash
npm install motion
```

Note: The project already has all other required dependencies.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── stores/
│   ├── GameStore.ts        # Existing - add observe mode state
│   └── SimulationStore.ts  # NEW - simulation time, tick logic
├── components/
│   └── observe/            # NEW folder for observe mode
│       ├── ObserveView.tsx        # Main observe mode container
│       ├── TimeControls.tsx       # Play/pause/speed buttons + timeline
│       ├── PatientObserve.tsx     # Patient card during simulation
│       ├── EnergyChange.tsx       # Floating +5/-10 numbers
│       └── InterventionMenu.tsx   # Click-to-intervene popup
└── hooks/
    └── useSimulation.ts    # Game loop hook
```

### Pattern 1: Game Loop with requestAnimationFrame
**What:** A simulation loop that updates time progress based on elapsed real time
**When to use:** For continuous smooth animation synchronized with display refresh
**Example:**
```typescript
// Source: MDN Web Docs, Aleksandr Hovhannisyan game loop guide
function useSimulationLoop(
  onTick: (deltaMs: number) => void,
  isRunning: boolean
) {
  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isRunning) return;

    const loop = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }
      const deltaMs = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      onTick(deltaMs);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [isRunning, onTick]);
}
```

### Pattern 2: MobX Simulation Store with Actions
**What:** Centralized simulation state with action-wrapped tick updates
**When to use:** When simulation state needs to be reactive and observed by multiple components
**Example:**
```typescript
// Source: MobX official docs - actions
import { makeAutoObservable, runInAction } from 'mobx';

class SimulationStore {
  // Time progress: 0 = start of day, 1 = end of day
  progress: number = 0;
  speed: 1 | 4 = 1;
  isPlaying: boolean = false;

  // Energy changes queue for floating numbers
  pendingEnergyChanges: EnergyChangeEvent[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Called from game loop
  tick(deltaMs: number) {
    if (!this.isPlaying) return;

    // Day duration at 1x: 75 seconds (midpoint of 60-90)
    const dayDurationMs = 75000;
    const progressDelta = (deltaMs * this.speed) / dayDurationMs;

    runInAction(() => {
      this.progress = Math.min(1, this.progress + progressDelta);
      this.processEnergyChanges();
    });
  }

  setSpeed(speed: 1 | 4) {
    this.speed = speed;
  }

  skipToEnd() {
    runInAction(() => {
      this.progress = 1;
      this.isPlaying = false;
    });
  }
}
```

### Pattern 3: AnimatePresence for Floating Numbers
**What:** Motion component that keeps elements in DOM during exit animation
**When to use:** For floating energy numbers that rise and fade out
**Example:**
```typescript
// Source: motion.dev docs - AnimatePresence
import { AnimatePresence, motion } from 'motion/react';

interface EnergyChange {
  id: string;
  value: number;
  patientId: string;
}

function EnergyChanges({ changes }: { changes: EnergyChange[] }) {
  return (
    <AnimatePresence>
      {changes.map((change) => (
        <motion.div
          key={change.id}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: -20 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 1.5 }}
          className={change.value > 0 ? 'text-success' : 'text-error'}
        >
          {change.value > 0 ? '+' : ''}{change.value}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

### Pattern 4: CSS Keyframes for Ambient Effects
**What:** Pure CSS animations for continuous effects like glow/pulse
**When to use:** For repeating animations that don't need JS state control
**Example:**
```css
/* Card glow based on energy state */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px var(--glow-color); }
  50% { box-shadow: 0 0 15px var(--glow-color); }
}

.patient-card-high {
  --glow-color: theme('colors.success');
  animation: pulse-glow 2s ease-in-out infinite;
}

.patient-card-low {
  --glow-color: theme('colors.error');
  animation: pulse-glow 1s ease-in-out infinite;
}
```

### Anti-Patterns to Avoid
- **setTimeout/setInterval for game loop:** Drift, not synced with display. Use requestAnimationFrame.
- **Modifying MobX state outside runInAction in async code:** Breaks reactivity tracking. Always wrap in runInAction.
- **Using framer-motion with React 19:** Incompatible. Use motion package instead.
- **Animating with setState on every frame:** Too slow. Use CSS animations or motion library.
- **Wrapping AnimatePresence children in React.Fragment:** Breaks exit animations silently.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Exit animations | Manual timeout + remove | motion AnimatePresence | Handles React reconciliation timing correctly |
| Smooth number transitions | CSS counter-increment | motion animate prop | Springs/easing work better for incremental changes |
| Game loop timing | setInterval | requestAnimationFrame | Syncs with display, auto-pauses on tab switch |
| Floating element positioning | Manual x/y calculation | CSS absolute + transform | Hardware accelerated, simpler |
| Speed multiplier | Manual time math | deltaMs * speed | Standard game loop pattern |

**Key insight:** Animation timing and element lifecycle are tightly coupled in React. Motion's AnimatePresence solves the "element removed before animation completes" problem that pure CSS cannot handle.

## Common Pitfalls

### Pitfall 1: requestAnimationFrame Not Pausing on Tab Switch
**What goes wrong:** Simulation continues while tab is backgrounded, then jumps forward when returning
**Why it happens:** Browser throttles RAF but doesn't stop it completely
**How to avoid:** Check document.hidden or use visibilitychange event to explicitly pause
**Warning signs:** Large deltaMs values (> 100ms) after returning to tab

### Pitfall 2: MobX Reactions Not Firing on Tick
**What goes wrong:** UI doesn't update even though state changes
**Why it happens:** State modification happens outside of action context in async code
**How to avoid:** Always wrap state changes in runInAction() or use flow() generator
**Warning signs:** Console warnings about modifying state outside action

### Pitfall 3: AnimatePresence Children Missing Keys
**What goes wrong:** Exit animations don't play, elements just disappear
**Why it happens:** AnimatePresence needs unique keys to track which elements exited
**How to avoid:** Always provide unique key prop to direct children of AnimatePresence
**Warning signs:** No animation on removal, console warnings about keys

### Pitfall 4: Memory Leak from Energy Change Events
**What goes wrong:** App slows down over time during simulation
**Why it happens:** Floating number components created but never cleaned up
**How to avoid:** Remove energy change events from store after animation completes using onAnimationComplete callback
**Warning signs:** Growing array of energy changes, increasing DOM element count

### Pitfall 5: Speed Change Causing Time Jump
**What goes wrong:** Changing from 1x to 4x causes sudden time jump
**Why it happens:** Using absolute time instead of delta-based progress
**How to avoid:** Always calculate progress from deltaMs * speed, never from wall clock
**Warning signs:** Progress jumps when speed changes mid-simulation

### Pitfall 6: CSS Transform Breaking Child Positioning
**What goes wrong:** Floating numbers appear in wrong position during parent animation
**Why it happens:** CSS transform creates new stacking context, changes offset parent
**How to avoid:** Keep floating numbers outside the transformed container, or use portal
**Warning signs:** Numbers appearing offset from expected position

## Code Examples

Verified patterns from official sources:

### Complete Simulation Hook
```typescript
// Combines game loop with MobX store
import { useEffect, useRef, useCallback } from 'react';
import { runInAction } from 'mobx';

export function useSimulation(store: SimulationStore) {
  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const tick = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }

    const deltaMs = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Cap delta to prevent huge jumps
    const cappedDelta = Math.min(deltaMs, 100);

    runInAction(() => {
      store.tick(cappedDelta);
    });

    if (store.isPlaying && store.progress < 1) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [store]);

  useEffect(() => {
    if (store.isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [store.isPlaying, tick]);
}
```

### Floating Energy Number Component
```typescript
// Source: Motion docs - AnimatePresence + custom animation
import { motion } from 'motion/react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface EnergyChangeProps {
  value: number;
  onComplete: () => void;
}

export function EnergyChange({ value, onComplete }: EnergyChangeProps) {
  const isPositive = value > 0;

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{
        opacity: [1, 1, 0],
        y: [0, -30, -50],
        scale: [1, 1.1, 0.9]
      }}
      transition={{
        duration: 1.5,
        times: [0, 0.6, 1],
        ease: "easeOut"
      }}
      onAnimationComplete={onComplete}
      className={`absolute flex items-center gap-1 font-bold text-lg
        ${isPositive ? 'text-success' : 'text-error'}`}
    >
      {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
      {isPositive ? '+' : ''}{value}
    </motion.div>
  );
}
```

### Time Controls Component
```typescript
// Source: DaisyUI button patterns + game UI conventions
import { Play, Pause, FastForward } from 'lucide-react';
import { observer } from 'mobx-react-lite';

interface TimeControlsProps {
  isPlaying: boolean;
  speed: 1 | 4;
  onPlayPause: () => void;
  onSetSpeed: (speed: 1 | 4) => void;
  onSkip: () => void;
}

export const TimeControls = observer(function TimeControls({
  isPlaying,
  speed,
  onPlayPause,
  onSetSpeed,
  onSkip
}: TimeControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="btn btn-circle btn-primary"
        onClick={onPlayPause}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      <div className="join">
        <button
          className={`btn join-item ${speed === 1 ? 'btn-active' : ''}`}
          onClick={() => onSetSpeed(1)}
        >
          1x
        </button>
        <button
          className={`btn join-item ${speed === 4 ? 'btn-active' : ''}`}
          onClick={() => onSetSpeed(4)}
        >
          4x
        </button>
      </div>

      <button className="btn btn-square" onClick={onSkip}>
        <FastForward size={20} />
      </button>
    </div>
  );
});
```

### Progress Timeline
```typescript
// Time slot progress indicator
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];

interface TimelineProps {
  progress: number; // 0 to 1
}

export function Timeline({ progress }: TimelineProps) {
  // Convert progress to clock time (8 AM to 8 PM = 12 hours)
  const hours = 8 + progress * 12;
  const hour = Math.floor(hours);
  const minutes = Math.floor((hours % 1) * 60);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Clock display */}
      <div className="text-xl font-mono">
        {displayHour}:{minutes.toString().padStart(2, '0')} {ampm}
      </div>

      {/* Timeline bar */}
      <div className="flex w-80 h-2 bg-base-300 rounded-full overflow-hidden">
        {TIME_SLOTS.map((slot, i) => (
          <div
            key={slot}
            className="flex-1 relative"
          >
            {/* Fill based on progress */}
            <div
              className="absolute inset-0 bg-primary transition-all duration-100"
              style={{
                width: `${Math.max(0, Math.min(100, (progress * 3 - i) * 100))}%`
              }}
            />
          </div>
        ))}
      </div>

      {/* Slot labels */}
      <div className="flex w-80 justify-between text-xs text-base-content/60">
        {TIME_SLOTS.map((slot) => (
          <span key={slot}>{slot}</span>
        ))}
      </div>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| framer-motion | motion | 2025 | framer-motion incompatible with React 19. Use motion package with imports from "motion/react" |
| forwardRef for motion components | Direct ref props | React 19 | No need for forwardRef wrapper when passing refs |
| setInterval game loops | requestAnimationFrame | Long-standing | RAF syncs with display, handles tab backgrounding |
| MobX decorators | makeAutoObservable | MobX 6 | Simpler setup, no decorators needed |

**Deprecated/outdated:**
- framer-motion: Use motion package instead for React 19 compatibility
- MobX @observable/@action decorators: Use makeAutoObservable instead

## Open Questions

Things that couldn't be fully resolved:

1. **Exact animation curve for energy numbers sliding to energy bar**
   - What we know: Decision says "slide toward energy bar, then merge"
   - What's unclear: Exact bezier curve, should number physically touch bar or fade near it
   - Recommendation: Start with easeOut curve moving 50px up then fading. Iterate based on feel.

2. **Intervention token persistence**
   - What we know: Limited uses, displayed near time controls
   - What's unclear: Reset per day? Per game? Starting count?
   - Recommendation: Assume 2-3 tokens per day, clarify with user during implementation

3. **Activity progress indicator visual**
   - What we know: Patients show "activity icon AND progress indicator"
   - What's unclear: Progress ring around icon? Linear bar? Radial fill?
   - Recommendation: Use circular progress ring around activity icon (common game pattern)

## Sources

### Primary (HIGH confidence)
- [Motion docs - AnimatePresence](https://motion.dev/docs/react-animate-presence) - Exit animation patterns
- [Motion docs - React Animation](https://motion.dev/docs/react-animation) - Basic animation API
- [MobX docs - Actions](https://mobx.js.org/actions.html) - runInAction, async patterns
- [MDN - Using CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations/Using) - Keyframes syntax

### Secondary (MEDIUM confidence)
- [LogRocket - Best React Animation Libraries 2026](https://blog.logrocket.com/best-react-animation-libraries/) - Library comparison
- [Aleksandr Hovhannisyan - Performant Game Loops](https://www.aleksandrhovhannisyan.com/blog/javascript-game-loop/) - RAF patterns
- [Motion GitHub Issue #2668](https://github.com/framer/motion/issues/2668) - React 19 compatibility confirmation
- [npm framer-motion](https://www.npmjs.com/package/framer-motion) - Version info (12.27.0)

### Tertiary (LOW confidence)
- [DEV.to - Game loop with useReducer](https://www.skies.dev/refactoring-to-reducers) - Alternative state pattern
- [CSS-Tricks - Animating Number Counters](https://css-tricks.com/animating-number-counters/) - CSS-only number animation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Motion/React 19 compatibility verified via GitHub issue and npm
- Architecture: HIGH - MobX patterns from official docs, RAF is standard browser API
- Pitfalls: MEDIUM - Compiled from multiple sources and common React/animation gotchas
- Animation patterns: HIGH - Motion docs examples directly applicable

**Research date:** 2026-01-28
**Valid until:** 2026-02-28 (Motion stable, patterns well-established)
