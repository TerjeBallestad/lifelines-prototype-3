# Phase 4: Day End Summary - Context

**Gathered:** 2026-01-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Feedback screen showing what happened during the day and enabling transition to the next day. Shows energy changes, XP gains, intervention usage, and discoveries. Player advances to next day's Schedule Mode.

</domain>

<decisions>
## Implementation Decisions

### Stat presentation
- Energy change shown as mini bar chart (visual bar showing start level, end level, change)
- XP displayed as per-activity gains: list each activity done with XP earned ("Cooking +15 XP")
- Intervention usage shown as simple token count: "Interventions: 2/3 used"

### Discovery reveals
- Card flip animation for dramatic reveal
- Triggered by activity completion (first time doing an activity or hitting XP threshold)
- Content is preference hints: "Ada seems to enjoy cooking" — gameplay-relevant info
- Unlimited discoveries per day (show all that were triggered)

### Layout & flow
- Step-through guided flow: energy → XP → discoveries → continue
- Click to continue between sections (player controls pace)
- Skip button always visible for players who want to move on
- Each step shows data for all 3 patients together (not one patient at a time)

### Day transition
- Partial energy recovery overnight (e.g., +3, but carry over deficits — not full reset)
- Intervention tokens: get 3 fresh, but can keep 1 unused from previous day (max 4)
- Previous day's schedule pre-filled in Schedule Mode (player can modify)
- Brief "Day X" splash screen before entering Schedule Mode

### Claude's Discretion
- Grouping approach (by patient vs by category) — pick what fits layout best
- Mini bar chart visual design details
- Card flip animation specifics
- Day splash screen duration and styling

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-day-end-summary*
*Context gathered: 2026-01-29*
