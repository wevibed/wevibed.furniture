// Renders a small picture of each demo model, used by gallery cards and showroom cards.
// One hidden WebGL renderer is shared and jobs run one at a time so the page stays smooth.

import * as THREE from 'three';
import { buildModel } from './models.js';

const W = 480;
const H = 360;
let ctx = null;
let broken = false;
const cache = new Map();
const queue = [];
let running = false;

function init() {
  if (ctx || broken) return ctx;
  try {
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setSize(W, H, false);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe4d9c6);
    scene.add(new THREE.HemisphereLight(0xfff3e0, 0x8a7660, 1.05));
    const d = new THREE.DirectionalLight(0xffffff, 0.85);
    d.position.set(3, 5, 4);
    scene.add(d);
    const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 60);
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(9, 48),
      new THREE.MeshStandardMaterial({ color: 0xd6c8b0, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
    ctx = { renderer, scene, camera };
  } catch (e) {
    broken = true;
  }
  return ctx;
}

function render(product) {
  const c = init();
  if (!c) return null;
  const g = buildModel(product);
  c.scene.add(g);
  const bb = new THREE.Box3().setFromObject(g);
  const size = bb.getSize(new THREE.Vector3());
  const ctr = bb.getCenter(new THREE.Vector3());
  const dist = (size.length() / 2 / Math.sin(THREE.MathUtils.degToRad(16))) * 0.92;
  c.camera.position.set(ctr.x + dist * 0.6, ctr.y + size.y * 0.3 + dist * 0.2, ctr.z + dist * 0.78);
  c.camera.lookAt(ctr);
  c.renderer.render(c.scene, c.camera);
  let url = null;
  try {
    url = c.renderer.domElement.toDataURL('image/jpeg', 0.88);
  } catch (e) {
    url = null;
  }
  c.scene.remove(g);
  g.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
  });
  return url;
}

function pump() {
  if (running) return;
  running = true;
  const step = () => {
    const job = queue.shift();
    if (!job) {
      running = false;
      return;
    }
    let url = null;
    try {
      url = render(job.product);
    } catch (e) {
      url = null;
    }
    job.resolve(url);
    setTimeout(step, 12);
  };
  step();
}

export function requestThumb(product) {
  if (cache.has(product.id)) return cache.get(product.id);
  const p = new Promise((resolve) => {
    queue.push({ product, resolve });
    pump();
  });
  cache.set(product.id, p);
  return p;
}
