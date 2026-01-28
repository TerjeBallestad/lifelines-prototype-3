# Lifelines Schedule-Observe Prototype

## What This Is

A web-based prototype to test the **Schedule → Observe → Adjust** core loop for Lifelines. The player schedules activities for 2-3 patients across 3 daily time slots, then watches the day unfold as patients move through activities, interact with each other, and respond to limited player interventions. The goal is to answer: **Is this loop fun?**

## Core Value

The schedule-observe cycle must feel satisfying — the player should want to see what happens, learn from it, and adjust tomorrow's schedule.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Schedule Mode where player assigns activities to time slots for each patient
- [ ] 3 time slots per day (Morning, Afternoon, Evening)
- [ ] 2-3 patients with distinct personalities (MTG color-based)
- [ ] 8-10 activities (cooking, therapy, garden, rest, reading, etc.)
- [ ] Overskudd (energy) system — activities cost/restore energy
- [ ] Observe Mode with full simulation — patients visibly move through facility
- [ ] Patient synergies — pairs doing same activity can bond or conflict
- [ ] Intervention tokens — limited mid-day actions during observation
- [ ] Day-end summary screen showing stat changes and discoveries
- [ ] Day loop — schedule → observe → summary → next day

### Out of Scope

- Facility capacity constraints — not needed to test core loop
- Full hidden stats / diagnosis system — simplify for prototype
- Meta-progression / unlocks — single-run focus
- Victory/failure conditions — just loop testing
- Audio — visual prototype only
- Illustrated art — abstract/card-based visuals
- Skill progression (Piaget tiers) — simplify to basic stat changes
- Multiple cohorts / roguelike structure — single session

## Context

This prototype is part of **Lifelines**, a cozy roguelike life-sim about managing a Norwegian social housing facility. The full game has extensive design documentation covering:
- MTG color wheel for patient personalities
- Overskudd (energy) as the central visible resource
- Hidden stats revealed through diagnosis
- Piaget-inspired skill progression
- Norwegian storytelling themes (identity, "klokskap over kraft")

The Schedule-Observe loop is a design exploration inspired by Minami Lane's passive observation mechanic. This prototype tests whether the rhythm of **intention → observation → learning** is engaging before committing to this direction in the full game.

**Existing work:**
- Extensive design documents (GDD, color system, skill system)
- Previous prototype at `../mental-sine-waves/` using same tech stack

## Constraints

- **Tech stack**: React 19 + TypeScript + Vite + Tailwind v4 + DaisyUI + MobX (match existing prototype)
- **Visuals**: Abstract/card-based — patients as cards, rooms as labeled areas, focus on data over polish
- **Scope**: Prototype to test a single question — is the loop fun?
- **Platform**: Web browser

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 3 time slots (not 6) | Minimal viable complexity for testing the loop | — Pending |
| Abstract visuals | Focus effort on mechanics, not art | — Pending |
| No facility constraints | Simplify scheduling decisions for initial test | — Pending |
| Full simulation in Observe Mode | Core hypothesis is that watching is satisfying | — Pending |

---
*Last updated: 2026-01-28 after initialization*
