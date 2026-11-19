// npm run check  -> confirms every showroom piece has its 3D model, client photo and a spot inside its room.
import fs from 'node:fs';
import { SHOWROOM_PIECES } from '../src/data/showroomPieces.js';
const B = { living: [-14.5, -5.1], bedroom: [-4.9, 4.9], dining: [5.1, 14.5] };
let fail = 0;
const bad = (m) => { fail++; console.log('FAIL', m); };
const ids = new Set();
for (const p of SHOWROOM_PIECES) {
  if (ids.has(p.id)) bad('duplicate id ' + p.id); ids.add(p.id);
  if (!fs.existsSync('public' + p.glb)) bad('missing model ' + p.glb);
  if (!p.photo) bad('no client photo linked for ' + p.id);
  else if (!fs.existsSync('public' + p.photo)) bad('missing photo ' + p.photo);
  const [x, z] = p.showroom.pos, [a, b] = B[p.showroom.room];
  if (x < a || x > b || Math.abs(z) > 4.5) bad('outside its room: ' + p.id);
  console.log('ok ', p.id.padEnd(32), p.showroom.room.padEnd(8), p.reference || '');
}
console.log(fail ? `${fail} problem(s)` : `All ${SHOWROOM_PIECES.length} pieces OK`);
process.exit(fail ? 1 : 0);
