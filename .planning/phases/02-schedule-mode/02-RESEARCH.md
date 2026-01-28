# Phase 2: Schedule Mode - Research

**Researched:** 2026-01-28
**Domain:** React drag-and-drop scheduling interface with MobX state management
**Confidence:** HIGH

## Summary

This phase implements a scheduling grid where players assign activities to time slots for patients. The research focused on: (1) drag-and-drop implementation using dnd-kit, (2) schedule data structure design with MobX, (3) modal dialogs for confirmation using DaisyUI, and (4) transition animations.

The established approach is to use **@dnd-kit** for drag-and-drop interactions. dnd-kit is the modern standard for React DnD, offering zero dependencies, ~10kb core, and full accessibility support. The deprecated react-beautiful-dnd should not be used. The schedule data structure should use MobX observable Maps keyed by `patientId-timeSlot` for efficient lookups and reactive updates.

**Primary recommendation:** Use @dnd-kit/core + @dnd-kit/sortable with a single DndContext wrapping both the activity sidebar and schedule grid. Store schedule assignments in a MobX Map for instant energy prediction recalculation.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @dnd-kit/core | 6.3.1 | Drag-and-drop foundation | Modern, lightweight (~10kb), zero dependencies, built for React, accessible |
| @dnd-kit/sortable | 9.0.0 | Sortable preset (grid support) | Built on core, provides rectSortingStrategy for grids |
| @dnd-kit/utilities | 3.2.2 | CSS transform helpers | CSS.Transform.toString() for smooth positioning |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @headlessui/react | 2.x | Transition component | Fade animations for mode transitions |
| (existing) mobx | 6.15.0 | State management | Already in stack - use for schedule state |
| (existing) daisyui | 5.5.14 | Modal component | Confirmation dialog uses native dialog element |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @dnd-kit | react-dnd | react-dnd needed only for desktop file drag, not our use case |
| @dnd-kit | @hello-pangea/dnd | Fork of deprecated react-beautiful-dnd, less flexible |
| @headlessui/react | CSS only | Headless provides data-closed attribute for cleaner transitions |

**Installation:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @headlessui/react
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── schedule/
│   │   ├── ScheduleGrid.tsx        # Main grid container with DndContext
│   │   ├── TimeSlotRow.tsx         # Row for Morning/Afternoon/Evening
│   │   ├── ScheduleCell.tsx        # Droppable cell + assigned activity display
│   │   ├── DraggableActivity.tsx   # Activity item that can be dragged
│   │   └── StartDayModal.tsx       # Confirmation modal
│   └── ActivityList.tsx            # Update to make items draggable
├── stores/
│   └── GameStore.ts                # Add schedule Map and computed predictions
└── models/
    └── types.ts                    # Add ScheduleEntry type
```

### Pattern 1: Single DndContext for External Drag

**What:** Wrap both the activity sidebar AND schedule grid in ONE DndContext
**When to use:** When dragging items FROM one area TO another (external drag)
**Why:** dnd-kit requires all interacting elements share the same DndContext

```typescript
// Source: https://docs.dndkit.com/api-documentation/context-provider
// BAD: Separate contexts won't see each other
<DndContext><ActivitySidebar /></DndContext>
<DndContext><ScheduleGrid /></DndContext>

// GOOD: Single context wraps everything
<DndContext onDragEnd={handleDragEnd}>
  <div className="flex">
    <ScheduleGrid />
    <ActivitySidebar />
  </div>
</DndContext>
```

### Pattern 2: Schedule Data as MobX Map

**What:** Store assignments in `Map<string, Activity>` keyed by `${patientId}-${timeSlot}`
**When to use:** When you need fast lookups and reactive computed values
**Why:** Maps handle dynamic keys without memory leaks (unlike plain objects)

```typescript
// Source: https://mobx.js.org/observable-state.html
class GameStore {
  // Map key format: "patient-1-morning"
  schedule: Map<string, Activity | null> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  assignActivity(patientId: string, slot: TimeSlot, activity: Activity | null) {
    const key = `${patientId}-${slot}`;
    this.schedule.set(key, activity);
  }

  getAssignment(patientId: string, slot: TimeSlot): Activity | null {
    return this.schedule.get(`${patientId}-${slot}`) ?? null;
  }

  // Computed: predicted energy after all assignments
  getPredictedEnergy(patient: Patient): number {
    const slots: TimeSlot[] = ['morning', 'afternoon', 'evening'];
    let energy = patient.energy;

    for (const slot of slots) {
      const activity = this.getAssignment(patient.id, slot);
      if (activity) {
        energy += activity.energyCost;
      }
    }
    return energy;
  }
}
```

### Pattern 3: useDraggable with Data Payload

**What:** Pass activity data through the `data` property for identification on drop
**When to use:** When the drop handler needs to know WHAT was dropped

```typescript
// Source: https://docs.dndkit.com/api-documentation/draggable/usedraggable
function DraggableActivity({ activity }: { activity: Activity }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `activity-${activity.id}`,
    data: {
      type: 'activity',
      activity: activity,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {activity.name} ({activity.formattedCost})
    </div>
  );
}
```

### Pattern 4: useDroppable for Schedule Cells

**What:** Each schedule cell is a droppable target identified by patient+slot
**When to use:** For the target zones in the schedule grid

```typescript
// Source: https://docs.dndkit.com/api-documentation/droppable/usedroppable
function ScheduleCell({ patientId, slot }: { patientId: string; slot: TimeSlot }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${patientId}-${slot}`,
    data: {
      type: 'cell',
      patientId,
      slot,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'min-h-16 border rounded p-2',
        isOver && 'bg-primary/20 border-primary'
      )}
    >
      {/* Assigned activity or empty state */}
    </div>
  );
}
```

### Pattern 5: DaisyUI Dialog for Confirmation

**What:** Use native HTML dialog element with showModal()/close() methods
**When to use:** For the "Start Day X?" confirmation modal

```typescript
// Source: https://daisyui.com/components/modal/
function StartDayModal({ day, onConfirm }: { day: number; onConfirm: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button className="btn btn-primary" onClick={open}>
        Start Day
      </button>
      <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Start Day {day}?</h3>
          <p className="py-4">Once started, you cannot change the schedule.</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Cancel</button>
            </form>
            <button className="btn btn-primary" onClick={() => { onConfirm(); close(); }}>
              Confirm
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
```

### Anti-Patterns to Avoid

- **Multiple DndContexts for connected areas:** Draggables and droppables must share ONE context to detect each other
- **Using useSortable inside DragOverlay:** Creates duplicate IDs; use a presentational component instead
- **Plain objects for schedule map:** MobX caches object descriptors aggressively; dynamic keys cause memory leaks
- **Storing schedule in component state:** Loses data on re-render; use MobX store for persistence

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drag-and-drop | Custom mouse event handlers | @dnd-kit | Touch/keyboard/pointer sensors, collision detection, accessibility |
| CSS transforms during drag | Manual transform strings | CSS.Transform.toString() from @dnd-kit/utilities | Handles scale, translate, null safety |
| Modal backdrop click | Document click listeners | DaisyUI modal-backdrop with form method="dialog" | Handles ESC key, proper focus trap |
| Enter/leave transitions | Manual opacity + setTimeout | @headlessui/react Transition | Handles mount/unmount timing, data-closed attribute |
| Keyboard navigation for DnD | Custom keydown handlers | dnd-kit Keyboard sensor | sortableKeyboardCoordinates built-in |

**Key insight:** dnd-kit is a toolkit, not a solution. It requires more setup than higher-level libraries, but the patterns above provide the structure. Hand-rolling any drag-and-drop logic is significantly harder than it appears due to edge cases (touch devices, accessibility, collision detection).

## Common Pitfalls

### Pitfall 1: Rendering useSortable Component in DragOverlay

**What goes wrong:** Duplicate IDs cause unpredictable behavior
**Why it happens:** DragOverlay renders outside normal flow; if the same component calls useSortable, two elements have same ID
**How to avoid:** Create a separate presentational component for the overlay
**Warning signs:** Items jumping or disappearing during drag

```typescript
// BAD
<DragOverlay>
  <SortableItem id={activeId} /> // This calls useSortable internally!
</DragOverlay>

// GOOD
<DragOverlay>
  <ActivityPreview activity={activeActivity} /> // Pure presentation
</DragOverlay>
```

### Pitfall 2: SortableContext Items Not Matching Render Order

**What goes wrong:** Unexpected item movements or no movement at all
**Why it happens:** SortableContext expects items array sorted in render order
**How to avoid:** Ensure `items` prop matches the order items appear in JSX
**Warning signs:** Items animate to wrong positions

### Pitfall 3: MobX Observables Not Triggering Re-render

**What goes wrong:** Schedule changes but UI doesn't update
**Why it happens:** Reading Map values without observer, or using regular JS Map methods
**How to avoid:** Wrap all components with observer(), use MobX Map methods
**Warning signs:** Console shows state changed but component doesn't re-render

```typescript
// BAD: Reading values outside observer tracking
const value = store.schedule.get(key); // Won't track in observer

// GOOD: Access observable properties that observer can track
const ScheduleCell = observer(function ScheduleCell({ patientId, slot }) {
  const assignment = gameStore.getAssignment(patientId, slot);
  // ...
});
```

### Pitfall 4: Click-to-Assign Conflicting with Drag

**What goes wrong:** Click handler fires during drag attempt
**Why it happens:** Both click and drag start with mousedown
**How to avoid:** Use dnd-kit's activation constraints (distance or delay)
**Warning signs:** Items are assigned on accidental micro-drags

```typescript
// Source: https://docs.dndkit.com
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Require 8px movement before drag starts
    },
  })
);
```

### Pitfall 5: Forgetting to Clear Assignment

**What goes wrong:** Clicking X doesn't remove assignment from state
**Why it happens:** Only handling drops, not clears
**How to avoid:** Add explicit clearAssignment action, wire X button to it
**Warning signs:** UI shows empty slot but energy prediction unchanged

## Code Examples

### Complete DndContext Setup with onDragEnd

```typescript
// Source: https://docs.dndkit.com/api-documentation/context-provider
import { DndContext, DragEndEvent, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

function ScheduleMode() {
  const gameStore = useGameStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return; // Dropped outside any droppable

    const activeData = active.data.current;
    const overData = over.data.current;

    // Only handle activity -> cell drops
    if (activeData?.type === 'activity' && overData?.type === 'cell') {
      gameStore.assignActivity(
        overData.patientId,
        overData.slot,
        activeData.activity
      );
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex">
        <main className="flex-1">
          <ScheduleGrid />
          <StartDayButton />
        </main>
        <aside className="w-72">
          <ActivityList />
        </aside>
      </div>
    </DndContext>
  );
}
```

### Energy Prediction Computed Values

```typescript
// Source: https://mobx.js.org/computeds.html
class GameStore {
  schedule = new Map<string, Activity | null>();

  constructor() {
    makeAutoObservable(this);
  }

  // Get running total at each slot for a patient
  getEnergyAtSlot(patient: Patient, targetSlot: TimeSlot): number {
    const slots: TimeSlot[] = ['morning', 'afternoon', 'evening'];
    let energy = patient.energy;

    for (const slot of slots) {
      const activity = this.schedule.get(`${patient.id}-${slot}`);
      if (activity) {
        energy += activity.energyCost;
      }
      if (slot === targetSlot) break;
    }

    return energy;
  }

  // Final predicted energy
  getPredictedFinalEnergy(patient: Patient): number {
    return this.getEnergyAtSlot(patient, 'evening');
  }
}
```

### Headless UI Transition for Mode Change

```typescript
// Source: https://headlessui.com/react/transition
import { Transition } from '@headlessui/react';

function GameShell() {
  const gameStore = useGameStore();

  return (
    <div className="relative">
      <Transition
        show={gameStore.currentMode === 'schedule'}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ScheduleMode />
      </Transition>

      <Transition
        show={gameStore.currentMode === 'observe'}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ObserveMode />
      </Transition>
    </div>
  );
}
```

### Synergy Visual Connection (Same Activity Same Slot)

```typescript
// Pattern for detecting synergy during scheduling
function detectSynergies(
  schedule: Map<string, Activity | null>,
  patients: Patient[],
  slot: TimeSlot
): string[][] {
  const activityGroups = new Map<string, string[]>();

  for (const patient of patients) {
    const activity = schedule.get(`${patient.id}-${slot}`);
    if (activity) {
      const group = activityGroups.get(activity.id) || [];
      group.push(patient.id);
      activityGroups.set(activity.id, group);
    }
  }

  // Return groups with 2+ patients (synergies)
  return Array.from(activityGroups.values()).filter(g => g.length > 1);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-beautiful-dnd | @dnd-kit | 2022 deprecation | Must use dnd-kit for new projects |
| HTML5 drag API | Pointer events (dnd-kit) | ~2020 | Better touch support, no file drag |
| useState for grid state | MobX observable Map | - | Computed predictions auto-update |
| checkbox modals (DaisyUI) | dialog element | HTML 5.2 | Better accessibility, ESC key support |

**Deprecated/outdated:**
- react-beautiful-dnd: Deprecated by Atlassian in 2022, no longer maintained
- react-sortable-hoc: Superseded by dnd-kit
- Custom drag event handlers: dnd-kit handles all edge cases

## Open Questions

1. **Click-to-assign activity picker design**
   - What we know: CONTEXT.md says "click slot to open activity picker and reassign"
   - What's unclear: Modal, dropdown, or popover?
   - Recommendation: Use DaisyUI dropdown for simplicity; modal feels heavy for frequent action

2. **Synergy connection visual style**
   - What we know: Need to "show visual connection when patients have same activity in same time slot"
   - What's unclear: Lines, highlights, badges?
   - Recommendation: Use matching colored border/glow on cells + small badge indicator

3. **DragOverlay styling**
   - What we know: Need visual feedback during drag
   - What's unclear: Opacity, scale, shadow?
   - Recommendation: Semi-transparent (opacity-75), slight scale-up (scale-105), drop shadow

## Sources

### Primary (HIGH confidence)
- [dnd-kit documentation](https://docs.dndkit.com) - useDraggable, useDroppable, DndContext, sortable preset
- [MobX official docs](https://mobx.js.org/observable-state.html) - observable Maps, computed values
- [DaisyUI modal component](https://daisyui.com/components/modal/) - dialog element pattern

### Secondary (MEDIUM confidence)
- [Puck Top 5 DnD Libraries 2026](https://puckeditor.com/blog/top-5-drag-and-drop-libraries-for-react) - ecosystem comparison
- [Headless UI Transition](https://headlessui.com/react/transition) - enter/leave animations
- [npm @dnd-kit/core](https://cloudsmith.com/navigator/npm/@dnd-kit/core) - version 6.3.1 confirmed

### Tertiary (LOW confidence)
- Medium articles on dnd-kit patterns - implementation examples
- GitHub discussions on dnd-kit context sharing - external drag patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - dnd-kit is the clear modern choice, verified via multiple sources
- Architecture: HIGH - patterns verified against official dnd-kit and MobX docs
- Pitfalls: HIGH - documented in official sources and GitHub issues

**Research date:** 2026-01-28
**Valid until:** 2026-03-28 (60 days - dnd-kit is stable, unlikely to change)
