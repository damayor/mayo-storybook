// Prints or edits ONLY the first camera keyframe (t = 0) of theatreState.json.
//
//   node scripts/set-camera-start.mjs                       # print current start
//   node scripts/set-camera-start.mjs --pos 0,300,-10       # position x,y,z
//   node scripts/set-camera-start.mjs --rot -90,0,-26 --deg # rotation x,y,z (radians unless --deg)
//
// Rotation is Euler XYZ. Any omitted axis group is left untouched.
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const FILE = 'src/stories/three/stories-components/experiences/camera-path/theatreState.json';
const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1].split(',').map(Number) : null;
};
const deg = process.argv.includes('--deg');
const pos = arg('pos');
const rot = arg('rot')?.map((v) => (deg ? (v * Math.PI) / 180 : v));

const state = JSON.parse(readFileSync(FILE, 'utf8'));
const cam = state.sheetsById.Scene.sequence.tracksByObject.Camera;
const first = (path) =>
  cam.trackData[cam.trackIdByPropPath[JSON.stringify(path)]].keyframes.find(
    (k) => k.position === 0
  );

const props = [
  [['position', 'x'], pos?.[0]],
  [['position', 'y'], pos?.[1]],
  [['position', 'z'], pos?.[2]],
  [['rotation', 'x'], rot?.[0]],
  [['rotation', 'y'], rot?.[1]],
  [['rotation', 'z'], rot?.[2]],
];
for (const [path, v] of props) if (v !== undefined && !Number.isNaN(v)) first(path).value = v;

const get = (g) => ['x', 'y', 'z'].map((a) => first([g, a]).value);
const r = get('rotation');
console.log(
  'position   :',
  get('position')
    .map((v) => +v.toFixed(3))
    .join(', ')
);
console.log('rotation   :', r.map((v) => +v.toFixed(4)).join(', '), '(rad)');
console.log('rotation   :', r.map((v) => +((v * 180) / Math.PI).toFixed(1)).join(', '), '(deg)');
if (pos || rot) {
  writeFileSync(FILE, JSON.stringify(state, null, 2) + '\n');
  // Re-apply the repo's prettier formatting so the git diff only shows the changed values.
  execFileSync('npx', ['prettier', '--write', FILE], { stdio: 'ignore' });
  console.log('saved →', FILE);
}
