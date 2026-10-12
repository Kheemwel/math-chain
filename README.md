# Math Chain

A Bookworm-style arcade battler where you fight with math. Tap number and operator tiles to build a formula in a tray. The result of the formula is the damage you deal. Survive as many rounds as you can, then see your run on the leaderboard.

Built with SvelteKit and Capacitor, as an offline Android app. No backend, no accounts, no network needed.

## How to play

1. A 6×6 board of number and operator tiles is shown, with an enemy above it.
2. Tap tiles to move them into the 7-slot tray. A formula must alternate **number, operator, number, ...** and start and end with a number.
3. The tray shows the formula and its result live. Press **Attack** when it is valid.
4. The result is dealt as damage. Used tiles disappear and the board refills.
5. Every 3 turns the enemy hits back. Defeat the enemy to move to the next round. If your HP reaches 0, the run ends.

Tap a tray tile to return it to the board. That tile and everything after it go back, so the formula always stays valid.

### Rules

- **Operators:** `+`, `−`, `×`, `÷`, with normal precedence (`×` and `÷` before `+` and `−`).
- **No digit joining.** Two numbers can never sit side by side. Bigger values come from rare two-digit tiles (10-99), which appear from round 4, at most 2 on the board.
- **Division by zero** is blocked. Results are **rounded down**. A negative result deals 0 damage.
- **Board guarantee:** every refill keeps at least 10 number tiles and 2 of each operator.

### Enemies

- Enemy HP is `200 × 1.3^(round − 1)`. Enemy damage is `10 + 2 × round`, dealt every 3 turns.
- Each round has a trait: **Plain**, **Seven Lover** (double damage from multiples of 7), **Armored** (ignores damage under 15), or **Even Hater** (halves even damage).
- Every 5th round is a **Boss** that halves all damage.
- Beating an enemy heals you for 10 HP.

### Weak spot

Each turn shows a weak spot number. If your result equals it exactly, damage is **×3**. The number is always reachable with the tiles on the board, and `−` and `÷` are the cheap way to hit it.

### Runs and leaderboard

- The run is saved after every attack. Close the app and tap **Continue** on the menu to resume.
- Finished runs go into a top-10 leaderboard on the device, ranked by round reached, then best hit. Each entry also records the best single hit and the formula behind it.

## Tech stack

- SvelteKit (Svelte 5, runes) with TypeScript
- `@sveltejs/adapter-static` in single-page-app mode
- Capacitor for Android packaging
- `@capacitor/preferences` for save data and the leaderboard
- Vitest for unit tests

## Project structure

```
src/
  lib/
    game/
      constants.ts    tuning values (change these to rebalance)
      types.ts
      random.ts       seedable RNG and shuffle
      evaluator.ts    formula evaluation (no eval())
      board.ts        tile generation and refill rules
      target.ts       weak spot picker
      enemy.ts        traits, enemy HP and damage
      game.svelte.ts  the Game class: state and rules
      snapshot.ts     save-data validation
      storage.ts      Preferences wrapper, leaderboard
      *.test.ts       unit tests
    components/       Board, Tray, EnemyPanel, Readout, Controls, ...
    styles/global.css
  routes/
    +page.svelte         menu
    play/+page.svelte    the game
    leaderboard/+page.svelte
    +layout.svelte, +layout.ts
```

The game rules live in plain TypeScript. Svelte components only display state and call `Game` methods.

## Getting started

Requirements: Node.js (a current LTS version) and npm.

```
npm install
npm run dev
```

Open the address it prints. To test on a phone's browser, run `npm run dev -- --host` and open the network address on the same Wi-Fi.

### Scripts

| Command         | What it does                        |
| --------------- | ----------------------------------- |
| `npm run dev`   | Start the dev server                |
| `npm run check` | Type-check the project              |
| `npm test`      | Run the unit tests once             |
| `npm run build` | Build the static site into `build/` |

## Building the Android app

You need Android Studio (or the Android SDK) for this step.

```
npm run build
npx cap sync android
npx cap open android
```

In Android Studio, run it on a device, or use Build, then Build APK(s).

Notes:

- Capacitor's `webDir` must be `build`.
- After every web change, run `npm run build` and `npx cap sync android` again.
- Google Play requires a signed Android App Bundle (`.aab`). Keep your keystore file and passwords backed up and out of Git. Losing the keystore means you cannot update the published app.

## Tuning the game

All balance values are in `src/lib/game/constants.ts` and `src/lib/game/enemy.ts`: tray size, board guarantees, enemy HP growth, heal per win, weak spot multiplier, and more. The balance is untuned. For example, on a fresh board a "multiply the biggest digits" opening can deal far more than round 1's HP.

## Known limitations

- Balance is untuned, and there is no limit on multiplication per formula.
- No reward picks between rounds. Winning only heals 10 HP.
- No `^`, `!`, parentheses, sound, or animations.
- The leaderboard is local to the device.
- Android back-button handling is not implemented.
