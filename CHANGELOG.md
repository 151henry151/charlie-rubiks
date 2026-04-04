# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.29] - 2026-04-03

### Changed

- Correct D-face facelet row indexing in `syncCubieMeshesToSolverCube` so cubie materials match cubejs `_D(1)`..`_D(9)` (F-side vs B-side rows differ from U-face layout).

## [0.4.28] - 2026-03-18

### Changed

- Touch face-drag: apply the post–D/B/L `prime` invert only when the swipe is **mostly vertical** (`!mostlyHorizontal`); horizontal touch swipes no longer get that invert so they match slice motion while vertical stays correct.

## [0.4.27] - 2026-03-18

### Changed

- Touch face-drag: remove the horizontal-only `prime` flip and invert `prime` for every touch drag after the D/B/L correction, so gesture direction matches slice motion with negated `getAxisAngle`; mouse/pointer path unchanged.

## [0.4.26] - 2026-03-18

### Changed

- Drop the mouse-only sticker-drag `prime` invert from 0.4.24; it was compensating for the pre-0.4.25 animation chirality and now reverses desktop drags after `getAxisAngle` was negated.

## [0.4.25] - 2026-03-18

### Changed

- Negate `getAxisAngle` slice rotation so Three.js pivot animation matches cubejs `move()` / `applyMoveToStickers` chirality; removes end-of-turn sticker “jump” when stepping Watch/Next (meshes no longer finish one quarter-turn opposite the logical state before `syncCubieMeshesToSolverCube`).

## [0.4.24] - 2026-03-18

### Changed

- After deriving sticker-drag `prime`, invert quarter-turn direction for **mouse/pointer** drags only (`drag.touchId == null`) so desktop matches touch: touch still uses inverted screen Y and the touch-only horizontal flip; pointer path no longer stays opposite.

## [0.4.23] - 2026-03-18

### Changed

- Collapse scramble/solve panels fully when closed: `padding: 0`, `min-height: 0`, and `box-sizing: border-box` so “Scramble:” / “Solution:” labels do not show until **Show Scramble** or **Show Solve** opens the panel (or solve errors open it).

## [0.4.22] - 2026-03-18

### Changed

- On viewports wider than the mobile breakpoint, scale the default camera offset by `DESKTOP_CAMERA_DISTANCE_SCALE` (1.26) so the cube starts less zoomed-in; mobile framing unchanged.

## [0.4.21] - 2026-03-18

### Changed

- On **Reset**, set `OrbitControls.target` to the origin and re-apply the default camera pose for the current **Top** face (`applyTopFaceOrientation(rubiksViewTopFace)`), clearing orbit, pan, and zoom offsets.

### Documentation

- Mention Reset camera behavior in Shortcuts → POINTER.

## [0.4.20] - 2026-03-18

### Changed

- Replace single-key + rim lighting with `HemisphereLight`, stronger `AmbientLight`, and three weaker `DirectionalLight`s (including one from below/behind) so all faces stay evenly readable at any orbit angle.
- Disable shadow maps and cubie `castShadow` / `receiveShadow` so cubies do not darken each other’s stickers.

## [0.4.19] - 2026-03-18

### Changed

- When changing HUD **Top**, rotate the default eye offset with `Quaternion.setFromUnitVectors` (same mapping as `camera.up`) so the camera sits in the analogous octant (e.g. D-up uses a below/behind view that shows yellow + green + red instead of keeping the old above-the-cube position). Track `rubiksViewTopFace` for `applyCameraFraming` on resize.

## [0.4.18] - 2026-03-18

### Changed

- Apply the mostly-horizontal sticker-drag prime flip only for **touch** face drags; leave mouse/pointer drags on the screen-space tangent / `viewDir` derivation from 0.4.9.

## [0.4.17] - 2026-03-18

### Added

- HUD **Top** `<select>` to choose which WCA face (U/D/F/B/R/L) aligns with the top of the viewport via `camera.up` (outward face normal); persist choice in `localStorage` under `charlie-rubiks-top-face`. Default when unset is **U (white)**.

### Changed

- Remove fixed yellow-up-only camera; reframe with `applyCameraFraming` + `lookAt` when the top face changes.

### Documentation

- Describe the Top control in Shortcuts → COLORS and in `README.md`.

## [0.4.16] - 2026-03-18

### Changed

- Set default camera `up` to `(0, -1, 0)` so the D (yellow) face appears at the top of the viewport; WCA face letters and solver notation stay the same. Document default view in Shortcuts → COLORS.

### Documentation

- Note default yellow-up camera framing in `README.md`.

## [0.4.15] - 2026-03-18

### Changed

- Count each solution playback move in Moves again (`enqueue` with `countMove` during watch forward steps); decrement Moves when stepping Previous during playback so the counter tracks applied solution moves.

## [0.4.14] - 2026-03-18

### Changed

- Watch Solve playback: add Previous and Next to step one solution move at a time (enabled while paused or when not auto-playing); keep Pause/Resume and step controls visible after playback finishes; use Play to resume auto-play from the current step. Reset and Scramble clear playback state and hide the bar. Show Solve with a non-empty move list opens the same playback bar at step 0.

## [0.4.13] - 2026-03-23

### Changed

- Keep the GL view square: `#canvas-view` is sized to `min(host width, host height)` with `camera.aspect = 1` so opening scramble/solve panels does not stretch the cube; center the square in `#canvas-host`. Observe `#canvas-host` with `ResizeObserver` so layout updates when panels open without a window resize.

## [0.4.12] - 2026-03-23

### Changed

- Shortcuts panel: raise open `max-height` with a viewport cap (`min(560px, calc(100vh - …))`), use `overflow-y: auto` and touch scrolling so wrapped text is not clipped on small or zoomed screens.

## [0.4.11] - 2026-03-23

### Changed

- Shorten the Shortcuts panel: drop Singmaster `'`/`2` prose and slice-axis trivia; state clearly that **Shift + face key** is CCW (not the apostrophe key); one-line color key; remove unused `.face-swatch` styles; lower legend `max-height`.

## [0.4.10] - 2026-03-22

### Changed

- Invert prime (quarter-turn direction) for mostly-horizontal face drags so horizontal swipes match expected “pull the slice” direction; vertical drags unchanged.

## [0.4.9] - 2026-03-22

### Changed

- Derive slice turns from swipe direction plus sticker grid: on each visible face, mostly-horizontal drags turn `U`/`E`/`D` or `L`/`M`/`R` (or `F`/`S`/`B` on side/top/bottom faces) by cubie row/column; mostly-vertical drags turn the orthogonal family. Prime direction uses the chosen slice’s normal so drags no longer always map to the front (`F`) face when touching front stickers.

## [0.4.8] - 2026-03-22

### Changed

- Invert vertical component of touch face-drag deltas so on-screen motion matches expected turn direction; pointer/mouse drags unchanged.

## [0.4.7] - 2026-03-22

### Changed

- On viewports `max-width: 768px`, scale the default orbit camera distance (~1.52×) so the full cube fits; desktop framing unchanged. Reapply on `resize`.

## [0.4.6] - 2026-03-22

### Added

- Extend `scripts/verify-solver-state.mjs` with tests for the facelet→grid map (solved exterior) and F left column after `R`.

### Changed

- Fix `syncCubieMeshesToSolverCube` front/back column indexing: cubejs F uses slot column `ix + 1` (UFL → slot 0, URF → slot 2); B uses `1 - ix`. The previous formulas swapped F left/right (and B), so after an `R` the mesh repaint showed yellow on the wrong side of the front face.

## [0.4.5] - 2026-03-22

### Changed

- After each completed slice animation, call `syncCubieMeshesToSolverCube()` to reset cubie positions/quaternions and repaint box materials from `solverCube.asString()` so the 3D view matches cubejs (animations still use the older turn model; logical state was correct, so “Solved!” could show while the mesh stayed scrambled).
- Restore `solverCube` from JSON in `selfTestSliceCycles` `finally` and sync meshes so the M/E/S self-test cannot leave state desynced; sync once after init.
- Increment `moveCount` before the solved celebration so the overlay matches the HUD move counter.

## [0.4.4] - 2026-03-22

### Added

- Add `scripts/verify-solver-state.mjs` to assert Kociemba completes quickly on random cubejs states and `fromString`/`asString` round-trips.

### Changed

- Keep a `solverCube` (cubejs `Cube`) updated with `move()` on every completed turn and derive sticker arrays from `asString()` so exported facelets match cubejs; pass `solverCube.toJSON()` into the worker instead of `Cube.fromString(getSolverFacelets())`.
- Document cause: manual sticker permutations disagreed with cubejs face indexing (e.g. after `R`), so `fromString`/`asString` did not round-trip and Kociemba could run until the UI hit the 30s timeout.

## [0.4.3] - 2026-03-22

### Changed

- Vendor cubejs `lib/` (`cube.js`, `solve.js`, `async.js`, `worker.js`) under `/charlie/lib/` and load from same origin so Firefox allows the solver worker (cross-origin `Worker` from jsDelivr was blocked).

## [0.4.2] - 2026-03-22

### Changed

- Run Kociemba `solve()` inside cubejs’s Web Worker (`lib/async.js` + `lib/worker.js`) so the main thread stays responsive; add init warmup and 30s solve timeout message.
- Document cause: synchronous `cube.solve()` after `setTimeout(0)` still blocked the UI and could trigger “page is slowing down” warnings.

## [0.4.1] - 2026-03-20

### Added

- Run a sticker-only self-test on load: apply `M^4`, `E^4`, and `S^4` and assert solved state; log pass or warn on failure.

### Changed

- Re-verify M/E/S slice sticker cycles against `L`/`D`/`F` sense; no logic change required after checks.

## [0.4.0] - 2026-03-20

### Added

- Load `cubejs` (`lib/cube.js`, `lib/solve.js`) from jsDelivr; add `getSolverFacelets()` (U R F D L B order) and async Kociemba solve via `setTimeout(0)`.
- Wire “Show Solve” / “Watch Solve” to Kociemba (loading state on buttons); label panel “Kociemba solution”; handle already-solved and solver errors.

### Changed

- Replace inverse-scramble solution with two-phase solver output; enable “Watch Solve” when the cube is unsolved (`updateWatchButton`).

## [0.3.3] - 2026-03-18

### Added

- Detect solved state after each move; show “Solved!” overlay with move count (fade after 4s) and brief emissive pulse on cubies.
- Fire celebration only when the cube transitions from unsolved to solved (skip initial pristine solved state).

## [0.3.2] - 2026-03-18

### Added

- Mobile touch face-turning: `touchstart`/`touchmove`/`touchend` with raycast, `controls` disabled during one-finger face drags, two-finger gestures pass through to OrbitControls; `touch-action: none` on canvas.

### Changed

- Route mouse drags through `pointer` events for `pointerType === 'mouse'` only so touch uses the dedicated touch handlers.

## [0.3.1] - 2026-03-18

### Changed

- Replace mouse face-turn heuristic with view-independent drag: project face tangent axes to screen space, compare drag to dominant axis, derive turn direction from `cross(faceNormal, tangent)` vs camera; ignore drags under 15px.

## [0.3.0] - 2026-03-18

### Changed

- Document WCA/Singmaster orientation (U white, D yellow, F green, B blue, R red, L orange) in code comments and shortcut panel; add color swatch legend and slice notes (M follows L, E follows D, S follows F); note `'` and `2` notation.
- Set default camera so the solved cube shows white up and green front (+Z toward viewer).

## [0.2.2] - 2026-03-18

### Changed

- Add GitHub repository link to `README.md`.

## [0.2.1] - 2026-03-18

### Added

- Add `.gitignore`.
- Initialize Git repository and publish to GitHub as `charlie-rubiks`.

## [0.2.0] - 2026-03-18

### Added

- Replace placeholder page with single-file 3D Rubik’s cube (Three.js r128): 27 cubies, standard colors, gaps, OrbitControls, keyboard `U/D/R/L/F/B/M/E/S` (+ Shift), queued animated turns, mouse drag on face, scramble (20 moves), show scramble, reverse solution + “Watch Solve” playback with move counter, dark HUD, collapsible shortcut legend, cubie hover highlight.

### Changed

- Load `three.min.js` from jsDelivr so scripts run under hromp.com Content-Security-Policy (cdnjs is not in `script-src`).

## [0.1.0] - 2026-03-18

### Added

- Add initial `index.html` with placeholder “Hello, World” text.
- Add README describing live-edit workflow via nginx alias.
