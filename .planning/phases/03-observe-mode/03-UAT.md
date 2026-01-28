---
status: complete
phase: 03-observe-mode
source: [03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md, 03-04-SUMMARY.md]
started: 2026-01-28T23:15:00Z
updated: 2026-01-28T23:25:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Observe Mode Renders After Start Day
expected: After scheduling activities and clicking "Start Day", the app transitions to Observe Mode with a timeline, time controls, and patient cards visible.
result: pass

### 2. Simulation Progresses Automatically
expected: When you click Play, the simulation progresses. The clock advances from 8:00 AM toward 8:00 PM, and the timeline bar fills in from left to right through Morning, Afternoon, Evening sections.
result: pass

### 3. Play/Pause Works
expected: Clicking the play button starts progress. Clicking pause stops it. The circular button toggles between play and pause icons.
result: pass

### 4. Speed Toggle (1x/4x)
expected: Clicking the 1x/4x buttons changes playback speed. At 4x, the simulation completes roughly 4 times faster than at 1x.
result: pass

### 5. Skip to End
expected: Clicking the skip button (fast-forward icon) immediately jumps to 8:00 PM / 100% progress and pauses the simulation.
result: pass

### 6. Patient Cards Show Current Activity
expected: During simulation, each patient card shows their scheduled activity for the current time slot (Morning/Afternoon/Evening) with a progress bar that fills as the slot progresses.
result: pass

### 7. Floating Energy Numbers Appear
expected: When a time slot changes (e.g., Morning→Afternoon), floating numbers appear above patient cards showing energy changes (+N in green with up arrow, -N in red with down arrow). Numbers animate upward and fade out.
result: pass

### 8. Energy Bars Update Live
expected: Patient energy bars update after each time slot's activity applies. If a patient does Therapy (-3), their energy bar visibly decreases. If they Rest (+2), it increases.
result: pass

### 9. Card Glow Based on Energy
expected: Patient cards have a subtle pulsing glow effect that reflects their energy state - green glow for high energy, yellow for medium, red for low energy.
result: pass

### 10. Intervention Token Display
expected: Near the time controls, there's a sparkle icon with a number (starts at 3). This shows available intervention tokens.
result: pass

### 11. Click Patient Opens Intervention Menu
expected: Clicking a patient card during simulation pauses the simulation and opens a modal menu showing the current activity and options to swap to a different activity or send to rest.
result: pass

### 12. Apply Intervention Changes Activity
expected: After selecting a new activity in the intervention menu, the menu closes, simulation resumes, patient switches to the new activity, and token count decreases by 1.
result: pass

### 13. Cancel Intervention Preserves Tokens
expected: Opening the intervention menu and clicking the X to cancel closes the menu without using a token. Token count stays the same.
result: pass

### 14. No Intervention When Tokens Depleted
expected: When intervention tokens reach 0, patient cards appear dimmed/faded and clicking them does nothing (no menu opens).
result: pass

## Summary

total: 14
passed: 14
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
