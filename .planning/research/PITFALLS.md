# Domain Pitfalls: React Game Prototype

**Domain:** Schedule-then-observe card game prototype (Lifelines)
**Stack:** React 19 + TypeScript + MobX
**Researched:** 2026-01-28
**Confidence:** MEDIUM (verified with official docs and multiple sources)

---

## Critical Pitfalls

Mistakes that cause rewrites, blocked progress, or fundamental architecture problems.

---

### Pitfall 1: Overengineering a Prototype

**What goes wrong:** Building production-quality systems (save/load, undo/redo, multiplayer support, complex animations) before validating the core loop is fun.

**Why it happens:**
- Developer instinct to "do it right the first time"
- Fear of technical debt
- Confusing prototype with MVP/vertical slice

**Consequences:**
- Weeks spent on systems that get thrown away when the loop isn't fun
- Analysis paralysis choosing the "right" architecture
- Prototype never finishes; core question never answered

**Prevention:**
- Define the prototype's ONE question: "Is schedule-then-observe fun?"
- Timebox the entire prototype (e.g., 2 weeks max)
- Use ugly placeholders - gray boxes and text are fine
- If a feature doesn't test the core loop, cut it

**Detection (warning signs):**
- Spending more than a day on any single system
- Designing for "what if we add multiplayer later"
- Polishing animations before the loop works
- Building save/load before testing fun

**Phase relevance:** Address in Phase 1 planning. Explicitly list what NOT to build.

**Sources:** [Wayline - Scope Creep](https://www.wayline.io/blog/scope-creep-indie-games-avoiding-development-hell), [GameMakerBlog](https://gamemakerblog.com/2017/02/21/gamedev-behind-the-scenes-2-killing-scope-creep-and-finishing-your-game/)

---

### Pitfall 2: Wrong Tool for the Job (React for Real-Time Simulation)

**What goes wrong:** Treating React like a game engine and fighting its rendering model for frame-by-frame animations.

**Why it happens:**
- Assuming React can handle any UI
- Not understanding React's batched, asynchronous rendering
- Trying to use requestAnimationFrame to drive React state

**Consequences:**
- Janky animations due to React's rendering cycle
- State/UI desynchronization
- Performance death spiral as state updates queue up

**Prevention:**
- Use React for what it's good at: UI, menus, cards, layout
- For the "observe" simulation playback, consider:
  - Pre-compute simulation results, animate with CSS/Framer Motion
  - Keep animation state outside React (refs, motion values)
  - Never tie requestAnimationFrame directly to setState
- Abstract visuals (cards) are a GOOD fit for React; sprites are not

**Detection (warning signs):**
- Using setInterval/requestAnimationFrame to update MobX state every frame
- UI lagging behind game state
- State updates causing cascade of re-renders

**Phase relevance:** Architecture decision in Phase 1. Choose the animation strategy BEFORE building the observe mode.

**Sources:** [LogRocket - React in Games](https://blog.logrocket.com/using-react-web-games/), [JSLegendDev - Why React for Games](https://jslegenddev.substack.com/p/why-use-react-for-game-development)

---

### Pitfall 3: Game Loop Spiral of Death

**What goes wrong:** When simulation takes too long, delta time grows, requiring more simulation, which takes longer, creating a death spiral until crash/freeze.

**Why it happens:**
- Using variable delta time for simulation
- Not capping maximum simulation step
- Trying to "catch up" after tab-switch/background

**Consequences:**
- Application freeze on slow devices
- Crash when returning from background tab (4 hours = 864,000 update calls)
- Inconsistent game behavior across devices

**Prevention:**
```typescript
// Cap delta time to prevent spiral
const MAX_DELTA = 100; // 100ms max per frame
const cappedDelta = Math.min(actualDelta, MAX_DELTA);

// Or: pause simulation when tab is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseSimulation();
});
```
- Use fixed-timestep simulation for determinism
- For Lifelines: pre-compute day simulation, don't run in real-time

**Detection (warning signs):**
- Game speeds up when you return to a background tab
- Inconsistent results on different hardware
- CPU spikes during "observe" mode

**Phase relevance:** Design the simulation approach in Phase 1. Implementation detail for "observe" phase.

**Sources:** [Aleksandr Hovhannisyan - Game Loops](https://www.aleksandrhovhannisyan.com/blog/javascript-game-loop/), [Isaac Sukin - Game Loop Timing](https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing)

---

### Pitfall 4: MobX Reactivity Broken Silently

**What goes wrong:** Components don't update when state changes, or update constantly when they shouldn't.

**Why it happens:**
- Forgetting `observer` wrapper (THE most common mistake per MobX docs)
- Dereferencing observables outside tracked context
- Using `setTimeout`/`await` which breaks tracking
- Array index access on out-of-bounds indices

**Consequences:**
- "Bug" where UI doesn't reflect state (stale UI)
- Debugging nightmare - state is correct but UI is wrong
- Or: constant re-renders killing performance

**Prevention:**
```typescript
// WRONG: dereferenced outside tracked function
const title = store.title; // title is now a string, not tracked
useEffect(() => {
  console.log(title); // won't react to changes
}, []);

// RIGHT: access observable inside tracked context
const MyComponent = observer(() => {
  return <div>{store.title}</div>; // tracked automatically
});

// WRONG: async breaks tracking
autorun(async () => {
  await fetch('/api');
  console.log(store.data); // NOT tracked - after await
});

// RIGHT: track before async
autorun(() => {
  const data = store.data; // tracked
  fetch('/api').then(() => console.log(data));
});
```
- Use `trace()` to debug what MobX is tracking
- Never access observables in async code expecting tracking

**Detection (warning signs):**
- Console logging shows correct state, but UI shows old value
- Adding `observer` fixes the problem
- Changes only appear after navigation/remount

**Phase relevance:** Every phase. Establish MobX patterns early (Phase 1) and review in code.

**Sources:** [MobX - Understanding Reactivity](https://mobx.js.org/understanding-reactivity.html), [MobX - React Integration](https://mobx.js.org/react-integration.html)

---

## Moderate Pitfalls

Mistakes that cause delays, refactoring, or technical debt.

---

### Pitfall 5: State in Two Places (MobX vs React useState)

**What goes wrong:** Game state split between MobX stores and React component state, leading to synchronization bugs.

**Why it happens:**
- Mixing patterns from different tutorials
- Using `useState` for "local" state that's actually shared
- Incremental migration that never completes

**Consequences:**
- State sync bugs ("I updated the store but the component shows old data")
- Unclear source of truth
- Debugging requires checking two state systems

**Prevention:**
- **Rule:** Domain state (schedule, characters, day progress) goes in MobX
- **Rule:** Ephemeral UI state (dropdown open, hover effects) can use useState
- Start with MobX for everything, optimize later if needed
- Never sync MobX to useState - use computed values instead

**Detection (warning signs):**
- useEffect that syncs store.value to local state
- Same data in both MobX store and useState
- Props drilling MobX values instead of accessing store directly

**Phase relevance:** Phase 1 - establish the convention and stick to it.

**Sources:** [MobX - React Integration](https://mobx.js.org/react-integration.html), [Nearform - MobX State Management](https://nearform.com/insights/mobx-state-management-in-react/)

---

### Pitfall 6: Immediate Animation During Simulation

**What goes wrong:** Trying to animate each simulation tick in real-time instead of computing results then animating.

**Why it happens:**
- Natural assumption that "observe mode" = "watch simulation run"
- Game engine thinking applied to UI framework

**Consequences:**
- Animation tied to simulation speed (slow device = slow animation)
- Can't speed up/slow down playback without recomputing
- Complex state management for pause/resume

**Prevention:**
For schedule-then-observe games, two-phase approach:
1. **Compute phase:** Run entire day simulation instantly, record events
2. **Playback phase:** Animate through recorded events at any speed

```typescript
// Phase 1: Compute
const dayEvents = simulateDay(schedule); // [{time: 0.1, event: 'wakeup'}, ...]

// Phase 2: Playback (can control speed, pause, scrub)
const [playbackTime, setPlaybackTime] = useState(0);
const visibleEvents = dayEvents.filter(e => e.time <= playbackTime);
```

This separates simulation (deterministic, instant) from presentation (animated, controllable).

**Detection (warning signs):**
- Simulation and animation code are intertwined
- Can't implement "skip day" without running full animation
- Playback speed affects game outcome

**Phase relevance:** Core architecture decision for Phase 2 (simulation system).

**Sources:** [Medium - Run Loop in React](https://medium.com/projector-hq/writing-a-run-loop-in-javascript-react-9605f74174b)

---

### Pitfall 7: Computed Values Not Actually Computed

**What goes wrong:** Using MobX `computed` for values that don't need to be reactive, or not using computed for derived state that should be.

**Why it happens:**
- Not understanding when computed vs stored state is appropriate
- Storing derived values that could be computed
- Creating expensive computeds that recalculate unnecessarily

**Consequences:**
- Stale derived state (stored remainingTasks != actual remaining)
- Unnecessary re-renders (computed not memoizing)
- Memory leaks (unused computeds still running)

**Prevention:**
```typescript
// WRONG: storing derived state
class Store {
  @observable todos = [];
  @observable remainingCount = 0; // must manually sync!

  addTodo(todo) {
    this.todos.push(todo);
    this.remainingCount = this.todos.filter(t => !t.done).length; // easy to forget
  }
}

// RIGHT: computed derives automatically
class Store {
  @observable todos = [];

  @computed get remainingCount() {
    return this.todos.filter(t => !t.done).length; // always correct
  }
}
```

- Rule: If it can be computed from other observables, make it `@computed`
- Computed values are lazy - only compute when accessed and observed

**Detection (warning signs):**
- Manual syncing of values in actions
- Values that "should" match but sometimes don't
- Actions that update multiple related values

**Phase relevance:** MobX store design in Phase 1.

**Sources:** [MobX - Computeds](https://mobx.js.org/computeds.html)

---

### Pitfall 8: Card Drag-Drop State Desync

**What goes wrong:** During drag operations, visual position and state position diverge, causing snapping or flickering.

**Why it happens:**
- React state updates are async; drag position updates are sync
- Updating state on every drag frame
- Animation library fighting with React renders

**Consequences:**
- Cards flicker/snap during drag
- Drop zones don't highlight correctly
- Drag cancel leaves card in wrong visual position

**Prevention:**
- Keep drag position in refs or motion values, not React state
- Only update MobX state on drop (not during drag)
- Use Framer Motion's `whileDrag` for visual feedback
- Store original position in ref before drag starts

```typescript
const positionRef = useRef({ x: 0, y: 0 });

const handleDragStart = () => {
  positionRef.current = getCurrentPosition();
};

const handleDragEnd = (newPosition) => {
  // Only now update MobX state
  store.moveCard(cardId, newPosition);
};
```

**Detection (warning signs):**
- Cards "fighting" with themselves during drag
- Lag between finger and card position
- setState calls on every mouse move

**Phase relevance:** Phase 3 (schedule UI) if implementing drag-drop for scheduling.

**Sources:** [React-DnD Issues](https://github.com/react-dnd/react-dnd/issues/3649), [Motion - React Drag](https://motion.dev/docs/react-drag)

---

## Minor Pitfalls

Mistakes that cause annoyance but are easily fixed.

---

### Pitfall 9: Console.log Doesn't Show Observable Values

**What goes wrong:** `console.log(store)` shows Proxy object, not actual values.

**Why it happens:** MobX wraps objects in Proxies for reactivity.

**Prevention:**
```typescript
// Shows Proxy
console.log(store);

// Shows actual values
console.log(toJS(store));
console.log({ ...store });
console.log(JSON.stringify(store));
```

**Phase relevance:** Day 1 debugging. Just know this going in.

---

### Pitfall 10: Action Batching Surprise

**What goes wrong:** Multiple state changes in one function trigger multiple renders instead of one.

**Why it happens:** Not wrapping multi-step mutations in `@action` or `runInAction`.

**Prevention:**
```typescript
// WRONG: each line triggers reactions
store.name = 'Alice';
store.age = 30;

// RIGHT: batched, single reaction
runInAction(() => {
  store.name = 'Alice';
  store.age = 30;
});
```

**Phase relevance:** Any phase with complex state updates.

**Sources:** [MobX - Actions](https://mobx.js.org/actions.html)

---

### Pitfall 11: Strict Mode Double Renders

**What goes wrong:** Components render twice in development, confusing debugging.

**Why it happens:** React 18+ Strict Mode intentionally double-renders to catch side effects.

**Prevention:**
- Know it's intentional (development only)
- Don't rely on render count
- Ensure effects are idempotent

**Phase relevance:** Don't waste time debugging this - it's expected behavior.

**Sources:** [React Strict Mode](https://react.dev/reference/react/StrictMode)

---

## Prototype-Specific Warnings

| Risk | Why It Matters for Prototype | Mitigation |
|------|------------------------------|------------|
| Scope creep | "Just one more feature" kills prototype timeline | Timebox to 2 weeks, define done criteria upfront |
| Polish addiction | Tweaking animations instead of testing fun | Use placeholder art, focus on loop |
| Architecture astronomy | Designing for scale you'll never need | Build for today's prototype, refactor if it works |
| Tool shopping | Evaluating 5 animation libraries | Pick one (Framer Motion), move on |
| Feature accretion | Adding features without removing any | For every feature added, consider one to cut |

---

## Phase-Specific Warnings

| Phase | Likely Pitfall | Mitigation |
|-------|---------------|------------|
| Core Loop (Schedule Mode) | Overbuilding the schedule UI | Cards + slots + confirm button. Done. |
| Simulation Engine | Real-time simulation instead of precompute | Compute results → then animate |
| Observe Mode | Animation tied to simulation | Events array + playback scrubber |
| Day Summary | Analysis paralysis on metrics | 3 metrics max. What tells you if day was good? |
| Polish | Scope creep disguised as "polish" | Only polish what's needed to test fun |

---

## Checklist: Before Building Each Feature

- [ ] Does this test whether the core loop is fun?
- [ ] Can this be a gray box / text placeholder?
- [ ] Will this take more than 1 day?
- [ ] Am I building for "maybe later" instead of "right now"?
- [ ] Is this in MobX (domain) or useState (ephemeral UI)?

---

## Sources

### Official Documentation
- [MobX - Understanding Reactivity](https://mobx.js.org/understanding-reactivity.html)
- [MobX - React Integration](https://mobx.js.org/react-integration.html)
- [MobX - Computeds](https://mobx.js.org/computeds.html)
- [MobX - Actions](https://mobx.js.org/actions.html)

### Game Development
- [Aleksandr Hovhannisyan - Performant Game Loops](https://www.aleksandrhovhannisyan.com/blog/javascript-game-loop/)
- [Isaac Sukin - Game Loop Timing](https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing)
- [LogRocket - Using React in Games](https://blog.logrocket.com/using-react-web-games/)

### Scope Management
- [Wayline - Scope Creep in Indie Games](https://www.wayline.io/blog/scope-creep-indie-games-avoiding-development-hell)
- [GameMakerBlog - Killing Scope Creep](https://gamemakerblog.com/2017/02/21/gamedev-behind-the-scenes-2-killing-scope-creep-and-finishing-your-game/)
- [Medium - Scope Creep vs Future Creep](https://www.manuelsanchezdev.com/blog/scope-vs-future-creep-game-development)

### React Patterns
- [Trashmoon - Turn-Based Games with Redux](https://trashmoon.com/blog/2019/architecting-a-turn-based-game-engine-with-redux/)
- [Motion - React Drag](https://motion.dev/docs/react-drag)
