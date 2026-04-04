/**
 * Regression check: cubejs state from random moves must solve quickly (no invalid / hung Kociemba).
 * Run: node scripts/verify-solver-state.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const libDir = new URL('../lib/', import.meta.url).pathname;

function loadCube() {
  const sand = { console };
  vm.createContext(sand);
  vm.runInContext(fs.readFileSync(`${libDir}cube.js`, 'utf8'), sand);
  sand.require = () => sand.Cube;
  vm.runInContext(fs.readFileSync(`${libDir}solve.js`, 'utf8'), sand);
  sand.Cube.initSolver();
  return sand.Cube;
}

const faces = ['U', 'D', 'R', 'L', 'F', 'B'];

function randomAlg(n) {
  const parts = [];
  for (let i = 0; i < n; i++) {
    const f = faces[Math.floor(Math.random() * 6)];
    const r = Math.random();
    parts.push(r < 0.33 ? f : r < 0.66 ? `${f}'` : `${f}2`);
  }
  return parts.join(' ');
}

test('toJSON clone solves within 5s after many random moves', () => {
  const Cube = loadCube();
  for (let trial = 0; trial < 40; trial++) {
    const c = new Cube();
    c.move(randomAlg(28));
    const worker = new Cube(c.toJSON());
    const t0 = Date.now();
    const sol = worker.solve();
    const dt = Date.now() - t0;
    assert.ok(dt < 5000, `solve took ${dt}ms (trial ${trial})`);
    const verify = new Cube(c.toJSON());
    verify.move(sol);
    assert.ok(verify.isSolved(), `trial ${trial}: solution should solve state`);
  }
});

test('fromString(asString()) round-trip after random moves', () => {
  const Cube = loadCube();
  for (let trial = 0; trial < 30; trial++) {
    const c = new Cube();
    c.move(randomAlg(22));
    const s = c.asString();
    assert.equal(Cube.fromString(s).asString(), s, `trial ${trial}`);
  }
});

/** Must match `syncCubieMeshesToSolverCube` in index.html (URFDLB string → grid cell + box face). */
function faceletAtCubieFace(str, ix, iy, iz, matIdx) {
  if (matIdx === 0 && ix === 1) return str[9 * 1 + (1 - iy) * 3 + (1 - iz)];
  if (matIdx === 1 && ix === -1) return str[9 * 4 + (1 - iy) * 3 + (iz + 1)];
  if (matIdx === 2 && iy === 1) return str[9 * 0 + (iz + 1) * 3 + (ix + 1)];
  if (matIdx === 3 && iy === -1) return str[9 * 3 + (iz + 1) * 3 + (ix + 1)];
  if (matIdx === 4 && iz === 1) return str[9 * 2 + (1 - iy) * 3 + (ix + 1)];
  if (matIdx === 5 && iz === -1) return str[9 * 5 + (1 - iy) * 3 + (1 - ix)];
  return null;
}

test('facelet grid map matches solved cube exterior', () => {
  const Cube = loadCube();
  const str = new Cube().asString();
  const exp = { 0: 'R', 1: 'L', 2: 'U', 3: 'D', 4: 'F', 5: 'B' };
  for (let ix = -1; ix <= 1; ix++) {
    for (let iy = -1; iy <= 1; iy++) {
      for (let iz = -1; iz <= 1; iz++) {
        for (let mi = 0; mi < 6; mi++) {
          const ch = faceletAtCubieFace(str, ix, iy, iz, mi);
          if (ch == null) continue;
          assert.equal(ch, exp[mi], `ix=${ix} iy=${iy} iz=${iz} mat=${mi}`);
        }
      }
    }
  }
});

test('after R, front left column stickers stay F (R does not move ix=-1 on F)', () => {
  const Cube = loadCube();
  const c = new Cube();
  c.move('R');
  const str = c.asString();
  for (const iy of [-1, 0, 1]) {
    assert.equal(faceletAtCubieFace(str, -1, iy, 1, 4), 'F', `iy=${iy}`);
  }
});
