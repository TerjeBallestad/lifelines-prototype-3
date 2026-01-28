# Feature Landscape: Schedule-Observe Games

**Domain:** Schedule/observe gameplay loop (plan activities, watch them play out, adjust)
**Researched:** 2026-01-28
**Confidence:** MEDIUM (based on analysis of multiple similar games, cross-referenced patterns)

## Reference Games Analyzed

| Game | Core Loop | Key Mechanic |
|------|-----------|--------------|
| Minami Lane | Build shops, start day, watch customers | Passive observation with trash collection |
| Punch Club | Schedule training/work, watch stats change | Stat decay forces ongoing engagement |
| Game Dev Tycoon | Set sliders, watch development, read reviews | Hidden score comparison to previous best |
| The Sims | Queue activities, watch sims execute | Autonomy with override capability |
| Football Manager | Set tactics, watch match unfold | Quarter-second decision slices |

---

## Table Stakes

Features users expect. Missing = product feels incomplete or broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Clear phase separation** | Players need to know when they're planning vs observing | Low | Must be visually/mechanically distinct |
| **Visible schedule/plan** | Players must see what they've committed to | Low | Grid, timeline, or list format |
| **Time controls during observation** | Players expect to fast-forward boring parts | Low | 1x/2x/4x minimum; pause optional |
| **End-of-day feedback** | Players need to know what worked and what didn't | Medium | Summary screen with metrics |
| **Undo/modify before committing** | Mistakes during planning feel unfair without this | Low | Standard UI pattern |
| **Clear resource visualization** | Energy/money/time must be visible at a glance | Low | Bars, numbers, or icons |
| **Character/entity state visibility** | See patient mood, energy, relationships during observation | Medium | Must update in real-time during playback |
| **Win/lose or progress feedback** | Know if you're getting better or worse | Medium | Session comparison, streak tracking |
| **Tutorial or learn-by-doing** | New players must understand the loop quickly | Medium | First day should teach core mechanics |

### Why These Are Non-Negotiable

From Minami Lane reviews: "The only thing you can do during the day is pick up rubbish by clicking on it. It's too passive and even though the days aren't very long, you just sit there until the day is over." Players accept passive observation IF they had meaningful choices before and get useful feedback after. Without clear phases and feedback, the loop breaks.

From Game Dev Tycoon: "It is good to perform a game report after every release to find out what worked and what did not." The feedback phase IS the learning mechanism.

---

## Differentiators

Features that separate good from great. Not expected, but create competitive advantage.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Mid-day intervention tokens** | Limited "emergency actions" create drama and mastery | Medium | Lifelines' planned system fits here |
| **Character synergy/conflict system** | Relationships between entities add strategic depth | Medium | Fire Emblem's adjacent bonuses, Mass Effect loyalty |
| **Emergent narrative moments** | When the simulation produces surprising/memorable outcomes | High | Requires robust event system |
| **Energy as strategic resource** | Activities cost/restore different amounts, forcing tradeoffs | Medium | Core to Lifelines' overskudd system |
| **"Almost" feedback** | Showing near-misses creates learning and engagement | Low | "Patient A was 1 energy short of completing activity" |
| **Character personality affecting outcomes** | Not just stats but behaviors that feel individual | High | Sims autonomy + traits |
| **Cascading consequences** | Choices in day 1 affect day 3 meaningfully | High | Requires longer game arc |
| **Observable micro-moments** | Small animated moments that reward watching | Medium | Minami Lane's customer reactions |
| **Comparative scoring** | How did this day compare to your best? Others? | Low | Game Dev Tycoon's hidden comparison system |
| **Reason to re-watch** | Hidden details revealed on second viewing | Medium | Reward observation, not just fast-forward |

### What Makes These Differentiating

The intervention token system is particularly powerful because it addresses the core criticism of schedule-observe games (too passive) while preserving the loop. From research on indirect control: "By limiting its uses, players only use it when it's absolutely essential" - scarcity creates meaningful decisions.

Character synergies work because they add a combinatorial puzzle layer to scheduling. Fire Emblem demonstrates this: "Characters with good relationships grant boosts to each other when fighting in adjacent tiles."

---

## Anti-Features

Features to explicitly NOT build. Common mistakes in this domain, especially for a prototype.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Full simulation rewind** | Removes consequence, destroys tension | Allow restart of day, not moment-to-moment undo |
| **Pause + direct control during observation** | Breaks the loop's identity entirely | Use limited intervention tokens instead |
| **Complex stat systems visible to player** | Obscures the actual learning | Show outcomes, hide formula complexity |
| **Permanent failure from single day** | Too punishing for cozy/prototype | Allow recovery over multiple days |
| **Detailed animation systems early** | Scope creep, not core loop validation | Simple sprites/shapes that convey state |
| **Multiple simultaneous currencies** | Cognitive overload, obscures core mechanic | One resource (overskudd) for prototype |
| **Unlockable content progression** | Defers testing core loop, adds scope | Test if base loop is fun first |
| **Multiplayer/async features** | Massive scope increase | Single-player prototype only |
| **Deep customization options** | Distracts from core loop testing | Fixed patients, fixed activities for v1 |
| **Save/load mid-day** | Allows save-scumming, undermines decisions | Auto-save between days only |

### Why These Are Traps

From Minami Lane's development: "Their development process is very centered around playtests. The developer is persuaded that game design is always bad on paper and you cannot know what's fun without prototyping and testing it."

Building complex systems before validating the core loop wastes time. The prototype question is: "Is schedule-observe-adjust with patients fun?" Not "Can we build a feature-rich management sim?"

---

## Feature Dependencies

```
FOUNDATION (build first):
  Time System (day phases)
       |
       v
  Schedule UI --> Activity Assignment --> Observation Playback
       |                                        |
       v                                        v
  Patient State Model <-----------------> State Updates During Play
       |
       v
  End-of-Day Feedback

LAYER 2 (adds strategy):
  Overskudd (Energy) System
       |
       v
  Activity Costs/Gains --> Visible Energy During Observation
       |
       v
  "Ran Out of Energy" Feedback

LAYER 3 (adds depth):
  Patient Synergies
       |
       v
  Pair Bonding/Conflict --> Visible Relationship Effects
       |
       v
  "Patient A helped Patient B" Feedback

LAYER 4 (adds drama):
  Intervention Tokens
       |
       v
  Mid-Day Actions --> Interrupt Observation Phase
       |
       v
  "You saved the day" Moments
```

### Critical Path for Prototype

1. **Phase system** - Without distinct plan/observe phases, there's no game
2. **Schedule UI** - Without input, there's nothing to observe
3. **Observation playback** - Without watching, there's no payoff
4. **Feedback** - Without learning, there's no reason to play again
5. **Energy** - Without constraint, there's no strategy

Synergies and intervention tokens are AFTER core loop validation.

---

## MVP Feature Set

For prototype to test "is this fun?":

### Must Have (validates core loop)
1. 3 time slots per day (morning, afternoon, evening)
2. 2-3 patients to schedule
3. 4-6 activities to choose from
4. Simple energy system (activities cost/restore energy)
5. Observation phase with 2x/4x speed controls
6. End-of-day summary showing what happened
7. "Day success" metric (did patients meet goals?)

### Should Have (adds strategic interest)
1. Patient synergies (at least "these two work well together")
2. Activity-patient fit (some patients prefer certain activities)
3. "Almost" feedback showing near-misses

### Defer to Post-MVP
- Intervention tokens (test if core loop works first)
- Multiple days/progression
- Complex relationships (stick to simple +/- synergy)
- Emergent narrative events
- Character customization
- Win/lose conditions beyond single day

---

## Competitive Analysis Summary

| Game | Strength to Learn From | Weakness to Avoid |
|------|----------------------|-------------------|
| Minami Lane | Cozy aesthetics, clear feedback, hidden object engagement | "Too passive" criticism during observation |
| Punch Club | Stat management creates meaningful tradeoffs | Decay mechanics can feel punishing |
| Game Dev Tycoon | Hidden comparison creates "beat your best" motivation | Formula obscurity frustrates some players |
| The Sims | Autonomy creates surprise, player override maintains control | Autonomy can feel broken/random without careful tuning |
| Football Manager | Tactical depth rewards learning, match engine creates drama | Complexity barrier is extremely high |

### Lifelines' Position

Lifelines should aim for:
- Minami Lane's coziness and feedback clarity
- Game Dev Tycoon's "learn what works" loop
- Fire Emblem's synergy system (simplified)
- Punch Club's meaningful resource tension (without harsh decay)

Avoid:
- Football Manager's complexity
- Sims' autonomy unpredictability (patients should be more predictable)
- Pure passivity during observation (intervention tokens address this)

---

## Sources

### Primary Sources (MEDIUM confidence - multiple sources agree)
- [Minami Lane Revenue Case Study](https://howtomarketagame.com/2024/12/18/minami-lane-6-months-of-development-750k-revenue/) - Development philosophy and hidden object mechanic
- [Game Dev Tycoon Wiki](https://gamedevtycoon.fandom.com/wiki/Success_Guide) - Score comparison system details
- [Punch Club Wiki](https://punchclub.wiki.gg/wiki/Game_Mechanics_(Punch_Club_2)) - Combat and stat systems
- [Football Manager Match AI](https://www.footballmanager.com/news/match-engine-ai-fm21) - Quarter-second decision slices

### Design Theory Sources (MEDIUM confidence)
- [Indirect Control in Game Design](https://game-studies.fandom.com/wiki/Indirect_Control) - Jesse Schell's framework
- [Feedback Loops - Machinations](https://machinations.io/articles/game-systems-feedback-loops-and-how-they-help-craft-player-experiences) - Positive/negative loop design
- [Stamina System Design](https://www.larksuite.com/en_us/topics/gaming-glossary/stamina-system) - Energy as strategic resource
- [Game Speed Controls Analysis](https://nyskogamesblog.wordpress.com/2021/08/01/game-speed-controls/) - Toggle vs hold, design tradeoffs

### Character/Relationship Sources (LOW-MEDIUM confidence)
- [Creating Bonds with NPCs](https://www.gamedeveloper.com/design/creating-stronger-bonds-between-players-and-npcs-through-group-conflict) - Group dynamics and empathy
- [Fire Emblem Synergies](https://gamerant.com/relationship-building-games-important/) - Adjacent bonuses and mechanical depth

### Cozy Game Market (LOW confidence - market research)
- [Cozy Game Market 2025-2032](https://www.intelmarketresearch.com/online-cozy-game-market-6937) - Genre growth and expectations
- [Cozy Management Features](https://thecozygamingnook.com/cozy-management-games/) - Player expectations for the genre
