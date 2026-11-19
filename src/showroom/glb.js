// Loads the client's 3D product models (GLB) and makes them showroom-ready:
//  - the files are Z-up, the showroom is Y-up, so they are stood upright (front faces +Z)
//  - each model is centred on its footprint and rests on the floor
//  - the exported materials are all flagged "fully metallic", which turns fabric and wood black
//    under showroom lighting, so each material is given a proper finish (fabric, leather, wood,
//    paint, chrome, glass) and a soft reflection map
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const loader = new GLTFLoader();
const cache = new Map();
let envMap = null;

export function makeEnvironment(renderer) {
  if (envMap) return envMap;
  const pm = new THREE.PMREMGenerator(renderer);
  envMap = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  pm.dispose();
  return envMap;
}

// Finish rules. `fix(material, index)` runs once per material of a model.
function finishMaterial(m, tune) {
  // The files store ordinary screen colours in a field that expects linear values, which is why
  // everything looks washed out. Convert them so greys, creams, tans and purples come out true.
  m.color.convertSRGBToLinear();
  const metal = m.metalness;
  const rough = m.roughness;
  if (metal >= 0.9 && rough >= 0.45) {
    m.metalness = 0; // fabric, paint, wood exported as metal
  } else if (metal >= 0.5 && rough < 0.45) {
    m.metalness = Math.min(0.9, metal); // chrome, brass, mirror stay shiny
    m.roughness = Math.max(0.12, rough);
  }
  if (m.transparent || m.alphaMode === 'BLEND') {
    m.transparent = true;
    m.opacity = Math.min(m.opacity, 0.35);
    m.depthWrite = false;
    m.metalness = 0.1;
  }
  m.envMap = envMap;
  m.envMapIntensity = m.metalness > 0.4 ? 1.0 : 0.35;
  if (tune) tune(m);
  m.needsUpdate = true;
}

// The supplied models are faceted (every triangle is shaded flat). This rebuilds the shading so
// rounded parts (cushions, arms, chair backs) look smooth while sharp corners (cabinet edges,
// mattress edges) stay crisp: each corner is blended only with neighbouring faces that are
// within the crease angle of it.
function smoothGeometry(geo, creaseDeg = 40) {
  const pos = geo.attributes.position;
  if (!pos || pos.count > 150000) return geo;
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  const P = g.attributes.position.array;
  const faces = P.length / 9;
  const fn = new Float32Array(faces * 3); // face normal, area weighted
  const fu = new Float32Array(faces * 3); // face normal, unit length
  const buckets = new Map();
  const key = (i) => Math.round(P[i] * 1e4) + '_' + Math.round(P[i + 1] * 1e4) + '_' + Math.round(P[i + 2] * 1e4);
  for (let f = 0; f < faces; f++) {
    const o = f * 9;
    const ax = P[o + 3] - P[o], ay = P[o + 4] - P[o + 1], az = P[o + 5] - P[o + 2];
    const bx = P[o + 6] - P[o], by = P[o + 7] - P[o + 1], bz = P[o + 8] - P[o + 2];
    const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
    const len = Math.hypot(nx, ny, nz) || 1;
    fn[f * 3] = nx; fn[f * 3 + 1] = ny; fn[f * 3 + 2] = nz;
    fu[f * 3] = nx / len; fu[f * 3 + 1] = ny / len; fu[f * 3 + 2] = nz / len;
    for (let v = 0; v < 3; v++) {
      const k = key(o + v * 3);
      let list = buckets.get(k);
      if (!list) buckets.set(k, (list = []));
      list.push(f);
    }
  }
  const cosC = Math.cos((creaseDeg * Math.PI) / 180);
  const N = new Float32Array(P.length);
  for (let f = 0; f < faces; f++) {
    for (let v = 0; v < 3; v++) {
      const list = buckets.get(key(f * 9 + v * 3));
      let x = 0, y = 0, z = 0;
      for (let i = 0; i < list.length; i++) {
        const q = list[i];
        if (fu[f * 3] * fu[q * 3] + fu[f * 3 + 1] * fu[q * 3 + 1] + fu[f * 3 + 2] * fu[q * 3 + 2] >= cosC) {
          x += fn[q * 3]; y += fn[q * 3 + 1]; z += fn[q * 3 + 2];
        }
      }
      const l = Math.hypot(x, y, z) || 1;
      const o = f * 9 + v * 3;
      N[o] = x / l; N[o + 1] = y / l; N[o + 2] = z / l;
    }
  }
  g.setAttribute('normal', new THREE.BufferAttribute(N, 3));
  geo.dispose();
  return g;
}

export function loadPiece(url, { scale = 1, coarse = false, tune } = {}) {
  const key = url + '|' + scale + '|' + (tune ? tune.toString() : '');
  if (!cache.has(key)) {
    cache.set(key, new Promise((resolve, reject) => {
      // (the single-file preview page supplies models as embedded data)
      const src = (typeof window !== 'undefined' && window.__DIRWA_ASSETS && window.__DIRWA_ASSETS[url]) || url;
      loader.load(src, (gltf) => {
        const root = gltf.scene;
        root.rotation.x = -Math.PI / 2; // Z-up -> Y-up, front towards +Z
        const holder = new THREE.Group();
        holder.add(root);
        holder.scale.setScalar(scale);
        holder.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(holder);
        root.position.set(-(box.min.x + box.max.x) / 2 / scale, -box.min.y / scale, -(box.min.z + box.max.z) / 2 / scale);
        holder.updateMatrixWorld(true);
        const size = box.getSize(new THREE.Vector3());
        const done = new Set();
        root.traverse((o) => {
          if (!o.isMesh) return;
          o.geometry = smoothGeometry(o.geometry);
          o.castShadow = !coarse;
          o.receiveShadow = !coarse;
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m, i) => { if (!done.has(m)) { done.add(m); finishMaterial(m, tune && ((mm) => tune(mm, i, o))); } });
        });
        holder.userData.size = [size.x, size.y, size.z];
        resolve(holder);
      }, undefined, reject);
    }));
  }
  return cache.get(key).then((h) => {
    const c = h.clone(true);
    c.userData.size = h.userData.size;
    return c;
  });
}
