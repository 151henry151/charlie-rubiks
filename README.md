# Charlie (hromp.com/charlie)

Single-file **3D Rubik’s cube** (`index.html`): Three.js r128 + OrbitControls from CDN; **cubejs** Kociemba solver is vendored in `lib/` (same-origin worker for Firefox).

**Live workflow:** Edit `index.html`, reload **https://hromp.com/charlie/**. Nginx aliases `/charlie/` to this directory.

**Controls:** Keyboard face turns (`U`…`S`, Shift for prime); mouse drag on a face to turn; left-drag orbit, right-drag pan, wheel zoom. Scramble / Show Scramble / Show Solve (reverse scramble) / Watch Solve. **Reset** restores the cube and snaps the camera to the default view for the current **Top** setting.

**View:** Use the HUD **Top** menu to pick which WCA face (U/D/F/B/R/L) points toward the top of the screen; the choice is stored in `localStorage`. The default camera distance is also rotated so you keep a similar “corner” perspective (not the old fixed position with only `camera.up` changed). Notation and solver stay standard (`U` = white on `+Y` in the model).

If the public URL moves later, update the `location` in `webserver/nginx/conf.d/00-hromp.com.conf` (or copy these files).

**GitHub:** [151henry151/charlie-rubiks](https://github.com/151henry151/charlie-rubiks)
