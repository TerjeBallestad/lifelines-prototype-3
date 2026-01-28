# Phase 2: Schedule Mode - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Players assign activities to time slots for each patient. This phase delivers the scheduling interface, energy predictions, and the transition to Observe Mode. Activity execution and synergy outcomes happen in Phase 3 (Observe Mode).

</domain>

<decisions>
## Implementation Decisions

### Grid layout & interaction
- Grid orientation: time slots as rows, patients as columns (Morning/Afternoon/Evening down the side, patients across)
- Assignment methods: support both drag-and-drop AND click-to-select
- Slot display: show activity name + energy cost (e.g., "Reading (-2)")
- Editing: X button to clear a slot, click slot to open activity picker and reassign

### Energy prediction display
- Dual display: slot shows energy delta, patient column header shows running total
- Color coding: green for energy gain, red for energy drain
- No enforcement: show predictions even when energy would go negative or exceed max (player decides)
- Update timing: instant recalculation as activities are assigned

### Schedule validation
- Empty slots allowed: empty means "free time" — patient chooses autonomously during Observe Mode
- Repeat activities: unlimited — same activity can be assigned to all 3 slots if desired
- Shared activities: multiple patients can do same activity in same slot (triggers synergy in Phase 5)
- Synergy hint: show visual connection when patients have same activity in same time slot

### Start Day transition
- Confirmation: simple modal — "Start Day X?" with confirm/cancel
- Button placement: bottom of schedule grid, after all assignments
- Transition: brief animation (fade or slide) to Observe Mode
- Commitment: once day starts, cannot return to re-schedule — must complete the day

### Claude's Discretion
- Exact drag-and-drop implementation details
- Activity picker modal/dropdown design
- Synergy connection visual style
- Animation duration and easing

</decisions>

<specifics>
## Specific Ideas

- Empty time slots = autonomous patient choice (interesting emergent behavior during observation)
- Synergy hints during scheduling let player intentionally create or avoid patient interactions

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-schedule-mode*
*Context gathered: 2026-01-28*
