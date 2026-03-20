# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
