import * as THREE from 'three';

export const M = (c, r, m) =>
  new THREE.MeshStandardMaterial({ color: c, roughness: r === undefined ? 0.8 : r, metalness: m || 0 });

export const K = {
  fabric: M(0xcdbda5, 0.95),
  fabricLt: M(0xded2bf, 0.95),
  fabricDk: M(0x8a7763, 0.95),
  leather: M(0x6a4230, 0.5),
  walnut: M(0x5a3b28, 0.5),
  oak: M(0xb68f63, 0.6),
  charcoal: M(0x302c29, 0.7),
  ivory: M(0xefe8db, 0.8),
  brass: M(0xb99660, 0.3, 0.85),
  black: M(0x14110f, 0.45),
  stone: M(0xd8d2c6, 0.4),
  linen: M(0xe8e0d0, 0.95),
  umber: M(0x7a5a43, 0.95),
  steel: M(0x9a9690, 0.35, 0.6),
  green: M(0x6b7a58, 0.9),
  board: M(0xd9c8aa, 0.6),
  board2: M(0xcdb995, 0.6),
  shade: new THREE.MeshStandardMaterial({
    color: 0xf0e3cc,
    emissive: 0xffd9a0,
    emissiveIntensity: 0.85,
    side: THREE.DoubleSide,
    roughness: 1,
  }),
};

export function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

export function tex(c, rx, ry) {
  const t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx || 1, ry || 1);
  t.anisotropy = 4;
  return t;
}

export function add(parent, mesh, x, y, z) {
  mesh.position.set(x || 0, y || 0, z || 0);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export const box = (w, h, d, mat, x, y, z, p) =>
  add(p, new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat), x, y, z);

export const cyl = (rt, rb, h, mat, x, y, z, p, seg, open) =>
  add(p, new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 20, 1, !!open), mat), x, y, z);

// Box with soft rounded edges, used for cushions and upholstered parts.
export function rbox(w, h, d, r, mat, x, y, z, p) {
  r = Math.min(r, w / 2 - 0.002, h / 2 - 0.002, d / 2 - 0.002);
  const sw = w - 2 * r;
  const sh = h - 2 * r;
  const dep = Math.max(d - 2 * r, 0.002);
  const s = new THREE.Shape();
  s.moveTo(-sw / 2, -sh / 2);
  s.lineTo(sw / 2, -sh / 2);
  s.lineTo(sw / 2, sh / 2);
  s.lineTo(-sw / 2, sh / 2);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: dep,
    bevelEnabled: true,
    bevelThickness: r,
    bevelSize: r,
    bevelSegments: 3,
    curveSegments: 1,
  });
  g.translate(0, 0, -dep / 2);
  return add(p, new THREE.Mesh(g, mat), x, y, z);
}

export function leg4(g, xs, zs, h, mat) {
  xs.forEach((x) => zs.forEach((z) => cyl(0.025, 0.018, h, mat, x, h / 2, z, g, 10)));
}
