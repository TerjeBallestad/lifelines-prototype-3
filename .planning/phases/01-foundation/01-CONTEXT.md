# Phase 1: Foundation - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Game state infrastructure exists and mode switching works. MobX stores, data types, patient cards with energy display, activity list with energy values, and mode indicator. This phase delivers the shell that subsequent phases build upon.

</domain>

<decisions>
## Implementation Decisions

### Patient card design
- Grid layout for patient cards (2x2 or similar, scalable)
- Colored border/accent showing MTG personality color
- Minimal content: name + energy only (no personality text, no current activity)
- Visual state indicators: Claude's discretion

### Activity list presentation
- Vertical scrollable list, one activity per row
- Visual indicator + number for energy (colored arrow/icon plus numeric value)
- Activity suitability hints: Claude's discretion
- Context-dependent visibility: visible in Schedule Mode, hidden in Observe Mode

### Layout structure
- Sidebar + main area orientation
- Activity sidebar on the right side
- Top header bar showing current mode, day number, time slot
- Game-like visual style: darker background, bold colors, visual punch

### Energy visualization
- Number + horizontal bar display on patient cards
- Scale: 0-10 (simple scale, bigger visual impact per point)
- Color-coded thresholds: 6+ green, 3-5 yellow, 0-2 red

### Claude's Discretion
- Patient card visual state changes (energy-based styling or static)
- Whether/how to hint at activity suitability for personality types
- Exact color palette and spacing within "game-like" style
- Sidebar collapse/expand behavior details

</decisions>

<specifics>
## Specific Ideas

- "Game-like" means darker background with bold colors — think strategy game UI rather than healthcare app
- Energy bar should have real visual punch — each point matters on a 0-10 scale
- Grid layout chosen for scalability as more patients are added

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-01-28*
