# Phase 3: Observe Mode - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Simulation playback where players watch the scheduled day unfold with control over time. Players can play, pause, speed up, and skip. They can intervene mid-day to redirect patients using limited tokens. Visual feedback shows energy changes happening in real-time.

</domain>

<decisions>
## Implementation Decisions

### Playback feel
- Smooth continuous time flow, not discrete ticks or event jumps
- Full day at 1x speed takes 60-90 seconds
- Patients show both activity icon AND progress indicator during activities
- Time slot transitions (Morning → Afternoon → Evening) are smooth crossfades, no hard boundaries

### Visual feedback
- Energy change numbers (+5, -10) animate by sliding toward the energy bar, then merging
- Energy changes appear gradually throughout the activity, not just at start/end
- Positive changes: green with up-arrow icon
- Negative changes: red with down-arrow icon
- Energy bar updates live as changes happen
- Card glow/pulse reflects current energy state (bright when high, dim when low)

### Intervention UX
- Click patient card to open intervention menu
- Two options available: swap to different activity OR send to rest
- Simulation auto-pauses when intervention menu opens — no time pressure
- Intervention token count displayed near time controls

### Time controls
- Three speed options: 1x, 4x, and skip to end
- Game-style distinct buttons (1x | 4x | >>), not media player dropdown
- Progress shown as: timeline bar (Morning|Afternoon|Evening) AND clock display (e.g., 10:30 AM)
- Controls and timeline positioned at top center of screen

### Claude's Discretion
- Exact animation curves and durations
- Specific colors/styling for energy states
- Intervention menu layout and styling
- Skip-to-end transition animation

</decisions>

<specifics>
## Specific Ideas

- Day should feel unhurried at 1x — 60-90 seconds gives time to observe and decide on interventions
- Energy numbers sliding to merge with the energy bar creates visual connection between cause and effect
- Auto-pause on intervention removes time pressure, making interventions feel strategic not frantic

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-observe-mode*
*Context gathered: 2026-01-28*
