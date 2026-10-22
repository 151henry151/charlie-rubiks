/**
 * Check that rigidly rotating the visible stickers lands exactly where cubejs
 * puts them. Exercise the app's actual functions, not a second facelet mapping.
 * Run: node --test scripts/verify-turn-continuity.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const cubeSource = fs.readFileSync(new URL('../lib/cube.js', import.meta.url), 'utf8');

function appFunction(name) {
  const start = html.indexOf(`  function ${name}(`);
  assert.notEqual(start, -1, `Missing app function ${name}`);
  const end = html.indexOf('\n  }', start);
  assert.notEqual(end, -1, `Missing end of ${name}`);
  return html.slice(start, end + 4);
}

// Minimal render objects: the geometry oracle below needs no WebGL or CDN.
class Vector3 {
  constructor(x = 0, y = 0, z = 0) { this.set(x, y, z); }
  set(x, y, z) { Object.assign(this, { x, y, z }); return this; }
  clone() { return new Vector3(this.x, this.y, this.z); }
  add(v) { return this.set(this.x + v.x, this.y + v.y, this.z + v.z); }
  multiplyScalar(n) { return this.set(this.x * n, this.y * n, this.z * n); }
  crossVectors(a, b) {
    return this.set(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  }
}
class Vector2 {
  constructor(x, y) { Object.assign(this, { x, y }); }
  sub(v) { this.x -= v.x; this.y -= v.y; return this; }
  dot(v) { return this.x * v.x + this.y * v.y; }
}
class Color {
  setHex(value) { this.value = value; }
}
const normals = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

function loadApp(algorithm = '') {
  const cubies = [];
  for (let ix = -1; ix <= 1; ix++)
    for (let iy = -1; iy <= 1; iy++)
      for (let iz = -1; iz <= 1; iz++) {
        cubies.push({
          userData: { ix, iy, iz, mats: normals.map(() => ({ color: new Color(), emissive: new Color() })) },
          position: new Vector3(),
          quaternion: { set() {} }
        });
      }
  const app = vm.createContext({ cubies, THREE: { Vector3 } });
  vm.runInContext(cubeSource, app);
  for (const name of ['COL', 'SP', 'FACELET_LETTER_TO_STICKER']) {
    const declaration = html.match(new RegExp(`  const ${name} = [\\s\\S]*?;`));
    assert.ok(declaration, `Missing constant ${name}`);
    vm.runInContext(declaration[0].replace('const ', 'var '), app);
  }
  for (const name of ['stickersFromCubeString', 'moveToNotation', 'applyMoveToStickers',
    'syncCubieMeshesToSolverCube', 'getSliceCubies', 'getAxisAngle', 'moveFromSwipe']) {
    vm.runInContext(appFunction(name), app);
  }
  app.solverCube = new app.Cube();
  if (algorithm) app.solverCube.move(algorithm);
  app.syncCubieMeshesToSolverCube();
  return app;
}

// Rodrigues' formula: rotate both sticker positions and outward normals.
function rotate(vector, axis, angle) {
  const [x, y, z] = vector;
  const { x: a, y: b, z: c } = axis;
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const dot = a * x + b * y + c * z;
  return [
    x * cos + (b * z - c * y) * sin + a * dot * (1 - cos),
    y * cos + (c * x - a * z) * sin + b * dot * (1 - cos),
    z * cos + (a * y - b * x) * sin + c * dot * (1 - cos)
  ].map(n => Math.round(n) || 0);
}

function visibleStickers(app, moving = new Set(), rotation = null) {
  const entries = [];
  for (const mesh of app.cubies) {
    const { ix, iy, iz, mats } = mesh.userData;
    for (let mi = 0; mi < 6; mi++) {
      const color = mats[mi].color.value;
      if (color === app.COL.X) continue;
      let position = [ix, iy, iz], normal = normals[mi];
      if (moving.has(mesh)) {
        position = rotate(position, rotation.axis, rotation.angle);
        normal = rotate(normal, rotation.axis, rotation.angle);
      }
      entries.push([`${position.join(',')}/${normal.join(',')}`, color]);
    }
  }
  assert.equal(entries.length, 54);
  assert.equal(new Set(entries.map(([key]) => key)).size, 54);
  return entries.sort(([a], [b]) => a.localeCompare(b));
}

function checkTurn(app, move) {
  const moving = new Set(app.getSliceCubies(move.face));
  assert.equal(moving.size, 9);
  const rotation = app.getAxisAngle(move);
  const beforeRepaint = visibleStickers(app, moving, rotation);
  for (const mesh of moving) {
    const { ix, iy, iz } = mesh.userData;
    const [x, y, z] = rotate([ix, iy, iz], rotation.axis, rotation.angle);
    Object.assign(mesh.userData, { ix: x, iy: y, iz: z });
  }
  app.applyMoveToStickers(move);
  app.syncCubieMeshesToSolverCube();
  assert.deepEqual(visibleStickers(app), beforeRepaint,
    `${app.moveToNotation(move)} must not change any sticker color when the animation finishes`);
}

const faces = [...'UDRLFBMES'];
const variants = [
  { prime: false, double: false },
  { prime: true, double: false },
  { prime: false, double: true }
];
for (const algorithm of ['', "R U F' L2 D B R' U2", "M E' S R U' F2 D L B'"]) {
  for (const face of faces) {
    for (const variant of variants) {
      const move = { face, ...variant };
      const notation = face + (variant.double ? '2' : variant.prime ? "'" : '');
      test(`${notation} keeps stickers continuous from ${algorithm || 'solved'}`, () => {
        checkTurn(loadApp(algorithm), move);
      });
    }
  }
}

test('mixed turns, inverse turns, and four-turn cycles preserve visible state', () => {
  const app = loadApp();
  const solved = visibleStickers(app);
  const moves = faces.flatMap(face => variants.map(variant => ({ face, ...variant })));
  for (const move of moves) checkTurn(app, move);
  for (const move of moves.toReversed()) checkTurn(app, { ...move, prime: !move.prime });
  assert.deepEqual(visibleStickers(app), solved);
  for (const face of faces) {
    for (let i = 0; i < 4; i++) checkTurn(app, { face, prime: false, double: false });
    assert.deepEqual(visibleStickers(app), solved, `${face}^4 should restore every sticker`);
  }
});

test('swipes follow clockwise sticker motion and reverse with the swipe', () => {
  const app = loadApp();
  // Known views and clockwise directions, independent of the app's gesture math.
  const front = p => new Vector2(p.x, -p.y);
  const back = p => new Vector2(-p.x, -p.y);
  const upsideDown = p => new Vector2(-p.x, p.y);
  const right = p => new Vector2(-p.z, -p.y);
  const top = p => new Vector2(p.x, p.z);
  const cases = [
    ['U', [0, 1, 1], [-1, 0], front],
    ['D', [0, -1, 1], [1, 0], front],
    ['E', [0, 0, 1], [1, 0], front],
    ['R', [1, 0, 1], [0, -1], front],
    ['L', [-1, 0, 1], [0, 1], front],
    ['M', [0, 0, 1], [0, 1], front],
    ['F', [1, 0, 1], [0, 1], front],
    ['B', [-1, 0, -1], [0, 1], back],
    ['S', [1, 0, 0], [0, 1], front],
    ['D', [0, -1, -1], [1, 0], back],
    ['E', [0, 0, -1], [1, 0], back],
    ['D', [0, -1, 1], [-1, 0], upsideDown],
    ['E', [0, 0, 1], [-1, 0], upsideDown],
    ['E', [1, 0, 0], [1, 0], right],
    ['R', [1, 0, -1], [0, 1], right],
    ['U', [1, 1, 0], [0, 1], top]
  ];
  for (const [face, position, direction, project] of cases) {
    app.worldToScreenPixel = project;
    const origin = new Vector3(...position);
    for (const sign of [1, -1]) {
      const swipe = new Vector2(direction[0] * sign, direction[1] * sign);
      const move = app.moveFromSwipe(face, origin, swipe, null, null);
      assert.ok(move, `${face} should recognize a swipe`);
      assert.equal(move.prime, sign < 0, `${face} at ${position} must follow the swipe`);
      checkTurn(app, move);
    }
  }
  app.worldToScreenPixel = front;
  assert.equal(app.moveFromSwipe('F', new Vector3(0, 0, 1), new Vector2(1, 0), null, null), null,
    'A sticker on the rotation axis has no directional motion');
});
