# Quest Academy: DESIGN

A Prodigy-style fantasy RPG for high school through college students. The older-student sibling of Reading Quest: same engine lineage, same six heroes, but every dungeon teaches a subject at tiers 17-32 (Grade 9 Early through College Year 4 Late). Answer to cast. Learn to win.

Reading Quest stays exactly as it is (repo NJShell2/reading-quest, untouched). Quest Academy is a separate site and repo (NJShell2/quest-academy). They share no save data.

## The six heroes (continuity with Reading Quest)

Same roster, same stats, spells reframed subject-neutral, same familiars, same Beast Within challenge classes (unlock at hero level 5, harder tiers, double XP):

| Class | Flavor | Beast Within |
|---|---|---|
| Codebreaker Knight | Pattern Breaker | Minotaur |
| Echo Monk | Deep Listener | Jackal |
| Sight Wizard | Quick Thinker | Medusa |
| Fleetfoot Archer | Swift Striker | Tigress |
| Word Druid | Master of Meanings | Treant |
| Story Bard | Keeper of Stories | Unicorn |

Heroes are the player's party across ALL dungeons. Levels, XP, spells, familiars, and shop upgrades are per hero and shared across subjects. Difficulty tiers are tracked PER SUBJECT PER HERO: a hero can be College Year 2 in Science and Grade 10 in History at the same time.

## Core dungeons (5 nodes each: 4 monsters + boss)

| Subject | Dungeon | Boss |
|---|---|---|
| Science | The Alchemy Depths | DOCTOR ENTROPY |
| Social Studies | The Archives of Ages | THE REVISIONIST |
| English | The Inkbound Library | THE PLAGIARIST |
| Health | The Vital Sanctum | THE SEDENTARY |
| Business | The Gilded Exchange | THE MONOPOLIST |
| Technology | The Circuit Citadel | THE GLITCH KING |
| Math | The Infinite Tower | THE DIVIDE-BY-ZERO |

Math was built LAST by Nicholas's explicit order.

Business also absorbs the business electives: accounting, marketing, and personal finance content lives in the main Business dungeon rather than duplicating it.

## The Electives Wing (3 nodes each: 2 monsters + boss, scaled to the wing)

Nicholas's rule for electives: **if it can't be learned from a website, it doesn't go in.** Knowledge-based electives only. Deliberately excluded: band, choir, orchestra, theatre performance, studio art (2D/3D), culinary, automotive, construction, agriculture, PE electives, yearbook production, early-childhood practicum, health-science clinicals. All hands-on, not website-learnable.

| Elective | Dungeon | Boss |
|---|---|---|
| Psychology (AP depth) | The Mind Maze | EGO |
| Sociology | The Society Halls | THE CONFORMIST |
| Law (Street/Constitutional) | The Hall of Justice | THE LOOPHOLE |
| Mythology | The Pantheon | CRONUS THE TITAN |
| Creative Writing | The Story Forge | WRITER'S BLOCK |
| Music Theory (AP depth) | The Harmonic Halls | CACOPHONY |
| Art History (AP depth) | The Grand Gallery | THE FORGER |
| Spanish (101 basics first) | The Sunlit Plaza | EL OLVIDO |
| CS Principles | The Logic Labyrinth | THE BLACK BOX |

Spanish leads with 101-level basics at tiers 17-20 (Nicholas is learning Spanish himself): cognates, greetings, numbers, then progressing to AP Spanish and college literature.

Math comes LAST by Nicholas's explicit order (Prodigy owns that space, and he has a separate math site).

## Systems

All inherited from the Reading Quest engine, adapted:
- **Battles:** turn-based, hero + familiar vs monster. Pick a spell, answer a subject question to cast. Correct = damage. Wrong = fumble (turn lost, no damage). Enemy deals small damage; defeat = safe retreat with XP kept.
- **Question kinds:** choice, story (passage + question), order (tap steps in sequence; new renderer added for Quest Academy, ideal for timelines and processes). Build/flash renderers exist in the engine but are unused here.
- **Adaptive flow-state engine** (`engine/adaptive.js`): rolling 12-answer window per subject per hero, tracking accuracy AND per-kind-calibrated response time (each subject sets its own fast/slow marks). Whizzing (92%+ and fast) advances a tier early; steady holds; stomped (45% and slow) drops one tier framed as a "Secret Side Quest", never a demotion. Anti-yo-yo: 6-answer eval cadence, 8-answer cooldown, window reset on move. Tiers clamp to 17-32.
- **The ladder:** 32 tiers, two per grade. Quest Academy covers tiers 17-32 only (Grade 9 Early to College Year 4 Late). Grade select at the start of a new game seeds every hero's tier in every subject (Grade 9 = 17, 10 = 19, 11 = 21, 12 = 23, College = 25); the adaptive engine keeps working from there. Beasts enter at tier 19.
- **Progression:** XP/levels 1-10 per hero, 4 spells per class at levels 1/3/5/8, familiars, coins, treasure chests, shop (potions, crystals, elixirs, permanent upgrades), streaks with celebrations.
- **Magic meter:** every battle starts with a full meter (maxMagic = 100 + gear magic bonus). Spells cost magic (default 30; `sp.cost` overrides). Spell cards show Power (from mult), Aim (default 100), and Recharge (cooldown turns), and grey out when unaffordable. The MEDITATE button answers a question to refill the meter (correct +45, wrong +15) without spending the turn.
- **Familiars:** each hero picks one of 5 starter familiars (Quill the Inkfox, Volt the Circuit Mouse, Tome the Bookbat, Flask the Bubble Frog, Orbit the Starpup), each with art, rarity ribbon, and Power/Hearts/Magic/Speed stats. The chosen familiar fights beside the hero and evolves at level 7. Rescued wild creatures join the petbook (Familiars screen): collection grid with rarity ribbons, "Rescued" stamps, and "New!" badges; the active familiar is set per hero.
- **Rescue:** non-boss monsters weakened below 30% HP show a pulsing RESCUE paw badge. Freeing one plays the light-column sequence and adds it to the petbook with a "Rescued" stamp.
- **Gear / Backpack:** five slots (wand, hat, garb, boots, ring). Gear defs live in `academy-core.js` (id, name, icon, slot, power/hp/magic bonuses, desc). Bonuses feed `S.power` / `S.maxHp` / `S.maxMagic`. Inventory equips with one tap. The Scholar set (Wand, Cap, Robes, Boots) is earned through the opening: the wand is Professor Wren's free gift, the rest arrive via goals.
- **Goals engine** (`RQGoals` in `engine/onboarding.js`): goals list `[{id, title, desc, done, reward}]`; completion checks fire on game events; gear rewards open a Wear / Not now modal. The "Your Goals" panel auto-opens after the tutorial battle; the Quests toolbar button opens it anytime.
- **Main quest:** THE UNMAKER shattered the 7 Seals of Knowledge. "Recover the 7 Seals": one seal per core dungeon boss (science, social, english, health, business, technology, math). A quest tracker banner in the HUD shows seals recovered and the current objective.
- **World map with locks:** the 7 core dungeons unlock sequentially (Science open first; each boss beaten unlocks the next; Math's Infinite Tower unlocks after the Technology boss, math stays last). The Electives Wing unlocks after any 2 core dungeon bosses. Each dungeon card shows % explored (nodes beaten / total); nodes unlock sequentially within a dungeon. "New!" badges mark never-battled monsters.
- **Guide NPCs:** Professor Wren the owl (intro dialogue, battle coach, hub NPC) and the Registrar (hub NPC with tip lines).
- **Wizard names:** adjective + noun picker with Random button ("Don't choose your real name!"), saved and shown in the HUD portrait.
- **Daily reward:** the gift box claims once per calendar day (localStorage date), with a streak counter, coins, and an occasional item (Ember Ring on 5-day streaks). The gift box pulses "Collect!" when claimable.
- **Loading tips:** `pack.tips` rotates on the title screen and the map screen.
- **Saves:** localStorage key `quest-academy-save-v1` (never collides with Reading Quest), schema v3 (v1 migrates automatically: familiarStage becomes a classic familiar object, bossesBeaten seeds zone unlocks, veterans meet the new systems once via catch-up). Per-hero: xp, level, bonuses, familiar `{id, stage}`, gear slots, battlesWon, plus `tiers[subjectId]` records (untouched by the migration). Also stored: wizardName, grade, onboarding state, inventory, goals, petbook, seenMonsters, zone progress, daily streak.

## Architecture

`engine/` is subject-agnostic: screens, battle loop, renderers, progression, shop, saves, audio, adaptive engine. `engine/onboarding.js` holds the scripted new-player opening (grade select, Professor Wren, tutorial battle, familiar choice, villain cutscene, rescue tutorial, name picker, world map) plus the `RQGoals` goals engine. `content/` holds packs: `academy-core.js` (heroes, beasts, shop, ladder, helpers, subject assembly order) plus one `subject-<id>.js` per subject implementing the pack interface:

```
window.SubjectPacks.<id> = { id, name, icon, elective?,
  dungeon: { name, icon, desc },
  monsters: [{ id, name, icon, hp, power, xp, coins:[lo,hi], boss?, intro?, outro? }],
  nodes: [{ id, name, monster, boss? }],
  gens: [fn(tier, helpers)],   // each returns { kind, prompt, choices, answer,
                               //   passage, items, timeMs, tier }
  pacing: { fastMs: {kind:ms}, slowMs: {kind:ms} } }
```

The engine's `pack()` returns `window.ContentPacks.academy`; `RQSave.activeSubject()` resolves the current dungeon. Battles draw questions from the active subject's generators at the hero's tier in that subject. A future subject ships as one new file plus one line in the core ORDER list. No engine changes needed.

## Content honesty

v1 content is authored for tiers 17-32 across all dungeons (this IS the high school to college game, so the full range is written, unlike Reading Quest's starter scope). Tiers above authored content reuse the hardest bank via `helpers.band`. Question counts: core dungeons 48-56 choice questions + 4 story passages + 3 order sequences each; electives 36 choice + 3 stories + 2-3 orders each.
