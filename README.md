# Charlie (hromp.com/charlie)

Single-file **3D Rubik’s cube** (`index.html`): Three.js r128 + OrbitControls from CDN; **cubejs** Kociemba solver is vendored in `lib/` (same-origin worker for Firefox).

**Current release: 0.4.32.** Bottom and middle-layer turns keep their sticker colors through the animation, and sticker-drag direction follows the slice's motion on screen.

**Live site:** [hromp.com/charlie](https://hromp.com/charlie/). Nginx serves the server checkout at `/home/henry/webserver/www/html/hromp.com/charlie/`, a submodule of the webserver repository. Editing a separate local checkout does not deploy it.

**Controls:** Keyboard face turns (`U`…`S`, Shift for prime); mouse drag on a face to turn; left-drag orbit, right-drag pan, wheel zoom. Scramble / Show Scramble / Show Solve (reverse scramble) / Watch Solve. **Reset** restores the cube and snaps the camera to the default view for the current **Top** setting.

**View:** Use the HUD **Top** menu to pick which WCA face (U/D/F/B/R/L) points toward the top of the screen; the choice is stored in `localStorage`. The default camera distance is also rotated so you keep a similar “corner” perspective (not the old fixed position with only `camera.up` changed). Notation and solver stay standard (`U` = white on `+Y` in the model).

If the public URL moves later, update the `location` in `webserver/nginx/conf.d/00-hromp.com.conf` (or copy these files).

## Deployment

After testing, releasing, and pushing `main`, connect to the existing server with `ssh webserver`. Check that `/home/henry/webserver/www/html/hromp.com/charlie/` has a clean working tree, fetch `origin`, and fast-forward its `main` branch to the tested release commit. Nginx serves these static files directly, so no build or service restart is needed. Verify the public page and `/charlie/VERSION` after updating; reload any already-open game tab to load the fix.

## Local development and checks

No build or package installation is required. Serve the repository at `/charlie/` so the vendored solver scripts and worker load at their expected URLs. From the repository root, use a temporary server directory:

```sh
server_root=$(mktemp -d)
ln -s "$PWD" "$server_root/charlie"
python3 -m http.server 8765 --bind 127.0.0.1 --directory "$server_root"
```

Open [the local game](http://127.0.0.1:8765/charlie/). Internet access is needed for the Three.js CDN scripts. Reload after editing `index.html`.

Run the regression checks with Node.js 20 or later (no npm dependencies):

```sh
node --test scripts/verify-*.mjs
```

The checks cover solver round trips and solutions, plus continuity between animated sticker positions and the final logical state for all six faces and three middle slices. The continuity checks load the turn and material-mapping functions directly from `index.html` and compare them with independent geometric rotations, including scrambled cubes and inverse turns.

For a visual check, turn `D` and `E`, then reverse them with Shift or Undo. The stickers should follow the rotating pieces all the way to their final positions. Also try sticker drags and Scramble → Watch Solve.

**GitHub:** [151henry151/charlie-rubiks](https://github.com/151henry151/charlie-rubiks)
