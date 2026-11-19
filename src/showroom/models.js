// Demo 3D furniture, built from simple shapes. Every model is a THREE.Group with its
// origin at floor level, centred, and its front facing +z.
// These stand in for photographs until Dirwa's original product photos or real GLB models arrive.

import * as THREE from 'three';
import { K, box, cyl, rbox, leg4 } from './materials.js';

// Material factory used by the custom WA0008 cream sectional model.
const M = (color, roughness = 0.98, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

const soft = (mat) => (mat === 'fabric' ? K.fabricLt : K[mat] || K.fabric);

/* ---------- sofas ---------- */

function sofa({ seats = 3, mat = 'fabric', high = false } = {}) {
  const g = new THREE.Group();
  const w = seats * 0.7 + 0.1;
  const m = K[mat] || K.fabric;
  const s = soft(mat);
  const feet = w / 2 - 0.15;
  leg4(g, [-feet, feet], [-0.36, 0.36], 0.14, K.brass);
  rbox(w, 0.26, 0.94, 0.05, m, 0, 0.27, 0, g);
  const bh = high ? 0.8 : 0.62;
  rbox(w, bh, 0.2, 0.07, m, 0, 0.41 + bh / 2, -0.37, g);
  rbox(0.22, 0.52, 0.94, 0.07, m, -(w / 2 - 0.1), 0.58, 0, g);
  rbox(0.22, 0.52, 0.94, 0.07, m, w / 2 - 0.1, 0.58, 0, g);
  const cw = (w - 0.4) / seats;
  for (let i = 0; i < seats; i++) {
    const x = (i - (seats - 1) / 2) * cw;
    rbox(cw, 0.18, 0.72, 0.07, s, x, 0.5, 0.08, g);
    const b = rbox(cw - 0.02, high ? 0.5 : 0.44, 0.17, 0.07, s, x, high ? 0.88 : 0.82, -0.2, g);
    b.rotation.x = -0.14;
  }
  const p1 = rbox(0.38, 0.38, 0.12, 0.05, K.umber, -(w / 2 - 0.32), 0.8, -0.02, g);
  p1.rotation.set(0, 0.3, 0.2);
  const p2 = rbox(0.38, 0.38, 0.12, 0.05, K.charcoal, w / 2 - 0.32, 0.78, -0.02, g);
  p2.rotation.set(0, -0.3, -0.15);
  return g;
}

function lshape({ mat = 'fabric' } = {}) {
  const g = new THREE.Group();
  const m = K[mat] || K.fabric;
  const s = soft(mat);
  leg4(g, [-1.2, 1.2], [-0.36, 0.36], 0.14, K.brass);
  leg4(g, [0.5, 1.2], [1.3], 0.14, K.brass);
  rbox(2.6, 0.26, 0.94, 0.05, m, 0, 0.27, 0, g);
  rbox(2.6, 0.62, 0.2, 0.07, m, 0, 0.72, -0.37, g);
  rbox(0.22, 0.52, 0.94, 0.07, m, -1.2, 0.58, 0, g);
  rbox(0.95, 0.26, 1.06, 0.05, m, 0.825, 0.27, 1.0, g);
  rbox(0.22, 0.4, 1.06, 0.07, m, 1.27, 0.5, 1.0, g);
  [-0.72, 0].forEach((x) => rbox(0.72, 0.18, 0.72, 0.07, s, x, 0.5, 0.08, g));
  rbox(0.88, 0.18, 1.0, 0.07, s, 0.83, 0.5, 1.0, g);
  [-0.72, 0, 0.72].forEach((x) => {
    const b = rbox(0.7, 0.44, 0.17, 0.07, s, x, 0.82, -0.2, g);
    b.rotation.x = -0.14;
  });
  const p = rbox(0.38, 0.38, 0.12, 0.05, K.umber, -0.9, 0.8, -0.02, g);
  p.rotation.set(0, 0.3, 0.2);
  return g;
}

function ushape({ mat = 'fabricDk', hybrid = false } = {}) {
  const g = new THREE.Group();
  const m = K[mat] || K.fabricDk;
  const s = soft(mat);
  leg4(g, [-1.8, 1.8], [-0.36], 0.14, K.brass);
  leg4(g, [-1.8, 1.8], [1.35], 0.14, K.brass);
  rbox(3.8, 0.26, 0.9, 0.05, m, 0, 0.27, 0, g);
  rbox(3.8, 0.62, 0.2, 0.07, m, 0, 0.72, -0.37, g);
  [-1, 1].forEach((side) => {
    rbox(0.9, 0.26, 1.0, 0.05, m, side * 1.45, 0.27, 0.95, g);
    rbox(0.84, 0.18, 0.94, 0.07, s, side * 1.45, 0.5, 0.95, g);
    rbox(0.2, 0.5, 1.9, 0.07, m, side * 1.85, 0.55, 0.5, g);
  });
  [-0.5, 0.5].forEach((x) => rbox(0.98, 0.18, 0.72, 0.07, s, x, 0.5, 0.08, g));
  [-1.2, -0.4, 0.4, 1.2].forEach((x) => {
    const b = rbox(0.76, 0.44, 0.17, 0.07, s, x, 0.82, -0.2, g);
    b.rotation.x = -0.14;
  });
  if (hybrid) {
    rbox(0.8, 0.4, 0.7, 0.08, K.leather, 0, 0.22, 1.35, g);
    const p = rbox(0.38, 0.38, 0.12, 0.05, K.charcoal, -1.45, 0.78, 0.5, g);
    p.rotation.set(0, 1.2, 0.1);
  }
  return g;
}

function recliner({ seats = 1 } = {}) {
  const g = new THREE.Group();
  for (let i = 0; i < seats; i++) {
    const ox = (i - (seats - 1) / 2) * 0.98;
    rbox(0.9, 0.14, 0.95, 0.04, K.black, ox, 0.07, 0, g);
    rbox(0.9, 0.3, 0.95, 0.08, K.leather, ox, 0.3, 0, g);
    rbox(0.7, 0.16, 0.7, 0.07, K.leather, ox, 0.54, 0.05, g);
    const b = rbox(0.84, 0.78, 0.26, 0.1, K.leather, ox, 0.86, -0.4, g);
    b.rotation.x = -0.22;
    const h = rbox(0.5, 0.22, 0.14, 0.07, K.leather, ox, 1.24, -0.5, g);
    h.rotation.x = -0.22;
    const f = rbox(0.66, 0.16, 0.5, 0.07, K.leather, ox, 0.38, 0.72, g);
    f.rotation.x = 0.12;
  }
  const edge = ((seats - 1) / 2) * 0.98 + 0.48;
  rbox(0.2, 0.46, 0.9, 0.08, K.leather, -edge, 0.56, 0, g);
  rbox(0.2, 0.46, 0.9, 0.08, K.leather, edge, 0.56, 0, g);
  for (let i = 1; i < seats; i++) {
    rbox(0.14, 0.46, 0.9, 0.06, K.leather, (i - seats / 2) * 0.98, 0.56, 0, g);
  }
  return g;
}


/* ---------- Dirwa WA0008 cream chaise sectional ---------- */
// Built from the supplied front/three-quarter reference photograph. The chaise is
// on the viewer's left; the model faces +z. Dimensions are proportional estimates.
function wa0008Lshape() {
  const g = new THREE.Group();
  const upholstery = M(0xd8d0c2, 0.98, 0);
  const cushionMat = M(0xe5ddcf, 0.99, 0);
  const sideMat = M(0xd2c9ba, 0.98, 0);
  const shadowMat = M(0xb8ad9e, 0.98, 0);

  // Low upholstered plinth: long sofa body plus the left-hand chaise.
  rbox(3.05, 0.42, 1.02, 0.12, upholstery, 0.05, 0.25, -0.02, g);
  rbox(1.25, 0.42, 1.78, 0.12, upholstery, -0.92, 0.25, 0.48, g);
  // Subtle recessed dark base line, visible just above the floor.
  rbox(2.88, 0.055, 0.88, 0.018, shadowMat, 0.05, 0.045, -0.02, g);
  rbox(1.12, 0.055, 1.62, 0.018, shadowMat, -0.92, 0.045, 0.48, g);

  // Back rail and the two softly rounded arms.
  rbox(3.02, 0.72, 0.30, 0.11, upholstery, 0.05, 0.72, -0.43, g);
  rbox(0.34, 0.67, 1.02, 0.12, sideMat, -1.34, 0.62, -0.02, g);
  rbox(0.34, 0.67, 1.02, 0.12, sideMat, 1.44, 0.62, -0.02, g);

  // Deep seat cushions. The left cushion runs forward to form the chaise.
  const chaise = rbox(1.12, 0.20, 1.48, 0.085, cushionMat, -0.91, 0.55, 0.47, g);
  chaise.rotation.x = -0.012;
  rbox(1.02, 0.20, 0.83, 0.085, cushionMat, 0.18, 0.55, 0.02, g);
  rbox(1.02, 0.20, 0.83, 0.085, cushionMat, 1.22, 0.55, 0.02, g);

  // Loose back cushions, gently reclined, with the soft, generous profile in WA0008.
  const backs = [
    [-0.98, 0.92, -0.37, -0.10],
    [-0.35, 0.94, -0.38, -0.12],
    [0.36, 0.94, -0.38, -0.12],
    [1.02, 0.92, -0.37, -0.10],
  ];
  backs.forEach(([x, y, z, tilt], i) => {
    const b = rbox(i === 0 ? 0.62 : 0.67, 0.56, 0.22, 0.09, cushionMat, x, y, z, g);
    b.rotation.x = tilt;
    b.rotation.z = i === 0 ? 0.035 : (i === 3 ? -0.025 : 0);
  });

  // Four loose accent cushions: two at the chaise corner and two along the back.
  const pillows = [
    [-0.93, 0.91, 0.02, 0.39, 0.38, 0.16, -0.18, 0.20],
    [-0.42, 0.88, -0.04, 0.38, 0.38, 0.16, -0.16, -0.12],
    [0.10, 0.91, -0.05, 0.40, 0.39, 0.16, -0.15, 0.08],
    [0.62, 0.89, -0.03, 0.39, 0.38, 0.16, -0.16, -0.12],
  ];
  pillows.forEach(([x, y, z, w, h, d, rx, rz], i) => {
    const p = rbox(w, h, d, 0.07, i % 2 ? upholstery : cushionMat, x, y, z, g);
    p.rotation.set(rx, 0, rz);
  });

  // Fine seam accents along the front faces of the plinths and cushion edges.
  const seamMat = M(0xc8beaf, 0.98, 0);
  const seam = (x1, z1, x2, z2, y) => {
    const curve = new THREE.LineCurve3(new THREE.Vector3(x1, y, z1), new THREE.Vector3(x2, y, z2));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 1, 0.006, 5, false), seamMat);
    g.add(mesh);
  };
  seam(-1.43, 0.50, -0.38, 0.50, 0.57);
  seam(-0.38, 0.50, -0.38, 1.25, 0.57);
  seam(-0.38, 1.25, -1.43, 1.25, 0.57);
  seam(-1.43, 1.25, -1.43, 0.50, 0.57);
  return g;
}

/* ---------- bedroom ---------- */

function bed({ variant = 'standard', w = 1.84 } = {}) {
  const g = new THREE.Group();
  const hbMat = { standard: K.walnut, pillows: K.fabricDk, storage: K.fabric, allsize: K.umber }[variant] || K.walnut;
  const fw = w + 0.1;
  let my = 0.42;
  if (variant === 'storage') {
    my = 0.58;
    rbox(fw, 0.42, 2.14, 0.05, K.walnut, 0, 0.25, 0, g);
    [-1, 1].forEach((s) => {
      box(fw * 0.4, 0.28, 0.02, K.oak, s * fw * 0.24, 0.26, 1.075, g);
      box(0.2, 0.014, 0.02, K.brass, s * fw * 0.24, 0.36, 1.09, g);
    });
  } else {
    rbox(fw, 0.22, 2.14, 0.05, K.walnut, 0, 0.19, 0, g);
  }
  rbox(w, 0.24, 2.04, 0.1, K.linen, 0, my, 0.02, g);
  const top = my + 0.12;
  const hh = variant === 'standard' ? 0.95 : 1.2;
  rbox(fw, hh, 0.14, 0.06, hbMat, 0, hh / 2 + (variant === 'storage' ? 0.1 : 0), -1.08, g);
  const px = w * 0.245;
  [-px, px].forEach((x) => {
    const p = rbox(w * 0.4, 0.2, 0.46, 0.09, K.linen, x, top + 0.14, -0.72, g);
    p.rotation.x = -0.35;
  });
  if (variant === 'pillows') {
    [-px, px].forEach((x) => {
      const p = rbox(w * 0.27, 0.16, 0.34, 0.07, K.fabricLt, x, top + 0.2, -0.38, g);
      p.rotation.x = -0.25;
    });
    const r = rbox(0.5, 0.3, 0.12, 0.05, K.umber, 0, top + 0.28, -0.1, g);
    r.rotation.set(-0.4, 0.2, 0.1);
  }
  rbox(w * 1.01, 0.07, 0.9, 0.03, K.umber, 0, top + 0.045, 0.52, g);
  return g;
}

function headboard() {
  const g = new THREE.Group();
  rbox(2.04, 1.2, 0.14, 0.06, K.fabricDk, 0, 0.8, 0, g);
  for (let i = -4; i <= 4; i++) box(0.015, 1.0, 0.01, K.umber, i * 0.22, 0.8, 0.075, g);
  [-0.9, 0.9].forEach((x) => box(0.08, 0.2, 0.08, K.black, x, 0.1, 0, g));
  return g;
}

function wardrobe({ doors = 3, boards = false, seams = [] } = {}) {
  const g = new THREE.Group();
  const w = doors * 0.42;
  const body = boards ? K.board : K.oak;
  const door = boards ? K.board2 : K.walnut;
  box(w - 0.1, 0.08, 0.5, K.black, 0, 0.04, -0.02, g);
  box(w, 2.2, 0.58, body, 0, 1.18, 0, g);
  if (!boards) box(w, 0.05, 0.6, body, 0, 2.31, 0, g);
  const dw = w / doors;
  for (let i = 0; i < doors; i++) {
    const x = (i - (doors - 1) / 2) * dw;
    box(dw - 0.02, 2.14, 0.03, door, x, 1.18, 0.3, g);
    const side = i % 2 === 0 ? 1 : -1;
    box(0.02, 0.5, 0.025, K.brass, x + side * (dw / 2 - 0.07), 1.15, 0.33, g);
  }
  seams.forEach((k) => box(0.012, 2.2, 0.62, K.black, -w / 2 + k * dw, 1.18, 0, g));
  return g;
}

/* ---------- kitchen ---------- */

function kitchen({ doors = 6, tall = false, hood = false, unit = 'charcoal' } = {}) {
  const g = new THREE.Group();
  const dw = 0.5;
  const w = doors * dw;
  const bm = K[unit] || K.charcoal;
  box(w, 0.08, 0.52, K.black, 0, 0.04, -0.03, g);
  box(w - 0.02, 0.78, 0.58, bm, 0, 0.47, 0, g);
  for (let i = 0; i < doors; i++) {
    const x = (i - (doors - 1) / 2) * dw;
    box(dw - 0.02, 0.74, 0.02, bm, x, 0.47, 0.3, g);
    box(0.18, 0.012, 0.02, K.brass, x, 0.8, 0.32, g);
  }
  box(w + 0.02, 0.04, 0.62, K.stone, 0, 0.88, 0.01, g);
  box(w, 0.5, 0.02, K.stone, 0, 1.15, -0.28, g);
  if (w >= 2) box(0.6, 0.01, 0.5, K.black, 0, 0.905, 0, g);
  for (let i = 0; i < doors; i++) {
    const x = (i - (doors - 1) / 2) * dw;
    if (hood && Math.abs(x) < 0.4) continue;
    box(dw - 0.02, 0.7, 0.34, K.ivory, x, 1.75, -0.12, g);
    box(0.18, 0.012, 0.02, K.brass, x, 1.45, 0.06, g);
  }
  if (hood) {
    box(0.8, 0.12, 0.45, K.steel, 0, 1.55, -0.1, g);
    box(0.26, 1.6, 0.24, K.steel, 0, 2.4, -0.17, g);
  }
  if (tall) {
    box(0.9, 2.05, 0.62, K.steel, w / 2 + 0.45, 1.05, 0.02, g);
    box(0.02, 0.6, 0.03, K.black, w / 2 + 0.08, 1.25, 0.34, g);
    box(0.9, 0.01, 0.02, K.black, w / 2 + 0.45, 0.75, 0.34, g);
  }
  return g;
}

/* ---------- dining ---------- */

function chair(g, x, z, ry, slat) {
  const c = new THREE.Group();
  const frame = K.oak;
  const seat = slat ? K.oak : K.fabricDk;
  [-0.19, 0.19].forEach((a) => [-0.19, 0.19].forEach((b) => cyl(0.016, 0.012, 0.44, frame, a, 0.22, b, c, 8)));
  rbox(0.46, 0.06, 0.46, 0.025, seat, 0, 0.46, 0, c);
  if (slat) {
    [0.62, 0.74, 0.86].forEach((y) => box(0.42, 0.07, 0.025, K.oak, 0, y, -0.21, c));
    box(0.04, 0.46, 0.04, frame, -0.19, 0.66, -0.21, c);
    box(0.04, 0.46, 0.04, frame, 0.19, 0.66, -0.21, c);
  } else {
    const b = rbox(0.44, 0.4, 0.05, 0.025, K.fabricDk, 0, 0.78, -0.21, c);
    b.rotation.x = -0.08;
    box(0.04, 0.34, 0.04, frame, -0.19, 0.64, -0.21, c);
    box(0.04, 0.34, 0.04, frame, 0.19, 0.64, -0.21, c);
  }
  c.position.set(x, 0, z);
  c.rotation.y = ry;
  g.add(c);
}

function diningChairs({ n = 6 } = {}) {
  const g = new THREE.Group();
  const per = Math.ceil(n / 2);
  for (let i = 0; i < per; i++) {
    const x = (i - (per - 1) / 2) * 0.7;
    chair(g, x, -0.78, 0, false);
    if (i < n - per) chair(g, x, 0.78, Math.PI, false);
  }
  return g;
}

function kitchenChairs({ n = 4 } = {}) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) chair(g, (i - (n - 1) / 2) * 0.62, 0, 0, true);
  return g;
}

function table() {
  const g = new THREE.Group();
  rbox(2.2, 0.06, 1.0, 0.025, K.walnut, 0, 0.74, 0, g);
  [-0.95, 0.95].forEach((x) => [-0.4, 0.4].forEach((z) => box(0.07, 0.71, 0.07, K.walnut, x, 0.355, z, g)));
  cyl(0.2, 0.14, 0.07, K.brass, 0, 0.8, 0, g, 28);
  cyl(0.05, 0.07, 0.28, K.ivory, 0.5, 0.91, 0.05, g, 20);
  return g;
}

/* ---------- showroom decor (not products) ---------- */

function coffeeTable() {
  const g = new THREE.Group();
  cyl(0.5, 0.5, 0.05, K.walnut, 0, 0.4, 0, g, 40);
  cyl(0.34, 0.34, 0.03, K.walnut, 0, 0.16, 0, g, 32);
  [0, 1, 2].forEach((i) => {
    const a = (i * Math.PI * 2) / 3 + 0.5;
    cyl(0.02, 0.02, 0.38, K.brass, Math.cos(a) * 0.36, 0.19, Math.sin(a) * 0.36, g, 10);
  });
  cyl(0.05, 0.07, 0.2, K.ivory, 0.12, 0.52, 0.05, g, 20);
  box(0.3, 0.04, 0.22, K.charcoal, -0.16, 0.445, 0.08, g);
  box(0.26, 0.03, 0.19, K.oak, -0.15, 0.48, 0.08, g);
  return g;
}

function media() {
  const g = new THREE.Group();
  leg4(g, [-0.85, 0.85], [-0.17, 0.17], 0.14, K.brass);
  rbox(1.9, 0.4, 0.44, 0.02, K.walnut, 0, 0.34, 0, g);
  [-0.62, 0, 0.62].forEach((x) => {
    box(0.6, 0.32, 0.02, K.oak, x, 0.34, 0.225, g);
    box(0.2, 0.014, 0.02, K.brass, x, 0.46, 0.24, g);
  });
  box(0.3, 0.04, 0.2, K.black, 0, 0.56, 0, g);
  box(0.06, 0.12, 0.04, K.black, 0, 0.63, 0, g);
  box(1.4, 0.8, 0.04, K.black, 0, 1.05, 0, g);
  return g;
}

function bedside() {
  const g = new THREE.Group();
  [-1.45, 1.45].forEach((x) => {
    leg4(g, [x - 0.2, x + 0.2], [-0.15, 0.15], 0.17, K.walnut);
    rbox(0.5, 0.46, 0.4, 0.02, K.walnut, x, 0.4, 0, g);
    rbox(0.44, 0.16, 0.02, 0.01, K.oak, x, 0.46, 0.205, g);
    box(0.1, 0.014, 0.02, K.brass, x, 0.5, 0.22, g);
    cyl(0.07, 0.08, 0.03, K.brass, x, 0.655, 0, g, 20);
    cyl(0.012, 0.012, 0.3, K.brass, x, 0.8, 0, g, 8);
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.22, 28, 1, true), K.shade);
    sh.position.set(x, 1.0, 0);
    g.add(sh);
  });
  return g;
}

function sideboard() {
  const g = new THREE.Group();
  leg4(g, [-0.8, 0.8], [-0.15, 0.15], 0.22, K.walnut);
  rbox(1.8, 0.58, 0.45, 0.02, K.walnut, 0, 0.51, 0, g);
  [-0.6, 0, 0.6].forEach((x) => {
    box(0.58, 0.52, 0.02, K.oak, x, 0.51, 0.23, g);
    box(0.015, 0.15, 0.02, K.brass, x + 0.22, 0.51, 0.25, g);
  });
  cyl(0.06, 0.09, 0.3, K.ivory, -0.6, 0.95, 0, g, 20);
  box(0.4, 0.03, 0.28, K.charcoal, 0.4, 0.825, 0, g);
  return g;
}

const MODELS = { sofa, lshape, wa0008Lshape, ushape, recliner, bed, headboard, wardrobe, kitchen, diningChairs, kitchenChairs, table, diningSet, media };
export const DECOR = { coffeeTable, media, bedside, sideboard };

export function buildModel(product) {
  const fn = MODELS[product.model];
  if (!fn) throw new Error(`Unknown model "${product.model}" for product ${product.id}`);
  return fn(product.params || {});
}

// A compact concept model for the product-photo gallery. These are category-level
// visualisations, not dimensionally verified copies of every photographed SKU.
function diningSet() {
  const g = new THREE.Group();
  g.add(table());
  g.add(diningChairs({ n: 6 }));
  return g;
}

export function buildGalleryConceptModel(product) {
  const ref = String(product.reference || '');
  const category = product.category;
  let model = 'sofa';
  let params = { seats: 3, mat: 'fabric' };

  if (category === 'living') {
    if (ref === 'DIRWA-0008') {
      model = 'wa0008Lshape';
      params = {};
    } else if (/recliner/i.test(product.name || '')) {
      model = 'recliner';
      params = { seats: 2 };
    }
  } else if (category === 'bedroom') {
    model = 'bed';
    params = { variant: 'standard', w: 1.84 };
  } else if (category === 'headboards') {
    model = 'headboard';
    params = {};
  } else if (category === 'wardrobes') {
    model = 'wardrobe';
    params = { doors: 4 };
  } else if (category === 'kitchen') {
    model = 'kitchen';
    params = { doors: 5, tall: false, unit: 'charcoal' };
  } else if (category === 'dining') {
    model = 'diningSet';
    params = {};
  } else if (category === 'media') {
    model = 'media';
    params = {};
  }

  return buildModel({ ...product, model, params });
}
