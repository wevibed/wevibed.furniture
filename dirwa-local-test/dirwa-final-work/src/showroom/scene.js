// The 3D showroom. createShowroom() builds the scene inside a container element and
// returns a small controller. React talks to it through callbacks and these methods:
//   enter()  leave()  flyToRoom(room)  flyToProduct(id)  dispose()

import * as THREE from 'three';
import { K, M, box, cyl, canvas, tex } from './materials.js';
import { buildModel, DECOR } from './models.js';
import { ROOMS } from '../data/products.js';

const ENTRANCE = { p: [0, 1.6, 3.9], l: [0, 1.1, -4] };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

export function createShowroom(container, opts) {
  const { products, onPick, onFloorTap, onRoomChange, onHover, onInteract, onError } = opts;
  const coarse = window.matchMedia?.('(pointer:coarse)').matches || false;
  const reduced = window.matchMedia?.('(prefers-reduced-motion:reduce)').matches || false;
  const desktop = () => window.innerWidth > 820;

  // Let Three.js initialise the actual canvas. Avoid creating a separate probe
  // context, which can waste scarce WebGL contexts on mobile browsers.
  let renderer;
  const attempts = [
    { antialias: !coarse, alpha: false, powerPreference: coarse ? 'low-power' : 'default', failIfMajorPerformanceCaveat: false, stencil: false },
    { antialias: false, alpha: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: false, stencil: false },
  ];
  let rendererError;
  for (const options of attempts) {
    try { renderer = new THREE.WebGLRenderer(options); break; }
    catch (error) { rendererError = error; }
  }
  if (!renderer) throw new Error(`This browser or device could not initialise the 3D renderer: ${rendererError?.message || 'unknown graphics error'}. The photo-based showroom fallback is available.`);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.2 : 1.5));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = !coarse && window.innerWidth > 820;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  const el = renderer.domElement;
  el.style.touchAction = 'none';

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a2420);
  const camera = new THREE.PerspectiveCamera(60, 1, 0.05, 60);

  /* ---------- procedural textures ---------- */
  let seed = 11;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  function woodTex() {
    const size = coarse ? 512 : 1024;
    const c = canvas(size, size);
    const g = c.getContext('2d');
    const rows = 8;
    const rh = size / rows;
    for (let r = 0; r < rows; r++) {
      let x = -rnd() * 400;
      while (x < size) {
        const len = 450 + rnd() * 450;
        g.fillStyle = `hsl(${27 + rnd() * 6},${24 + rnd() * 8}%,${42 + rnd() * 7}%)`;
        g.fillRect(x, r * rh, len, rh);
        for (let i = 0; i < 14; i++) {
          g.strokeStyle = `rgba(60,38,20,${0.04 + rnd() * 0.07})`;
          g.lineWidth = 1;
          const y = r * rh + rnd() * rh;
          g.beginPath();
          g.moveTo(x, y);
          g.bezierCurveTo(x + len * 0.3, y + (rnd() - 0.5) * 6, x + len * 0.6, y + (rnd() - 0.5) * 6, x + len, y + (rnd() - 0.5) * 4);
          g.stroke();
        }
        g.fillStyle = 'rgba(30,18,8,.4)';
        g.fillRect(x, r * rh, 2, rh);
        x += len;
      }
      g.fillStyle = 'rgba(30,18,8,.4)';
      g.fillRect(0, r * rh, size, 2);
    }
    return tex(c, 14.5, 4.5);
  }
  function rugTex(base, edge) {
    const size = coarse ? 256 : 512;
    const c = canvas(size, size);
    const g = c.getContext('2d');
    g.fillStyle = edge;
    g.fillRect(0, 0, size, size);
    g.fillStyle = base;
    g.fillRect(size * 0.055, size * 0.055, size * 0.89, size * 0.89);
    g.strokeStyle = 'rgba(60,45,30,.25)';
    g.lineWidth = 3;
    g.strokeRect(size * 0.09, size * 0.09, size * 0.82, size * 0.82);
    for (let i = 0; i < (coarse ? 1200 : 5000); i++) {
      g.fillStyle = `rgba(${rnd() > 0.5 ? '255,250,240' : '60,45,30'},${0.03 + rnd() * 0.05})`;
      g.fillRect(rnd() * size, rnd() * size, 2, 2);
    }
    return tex(c, 1, 1);
  }
  function artTex(s) {
    seed = s;
    const c = canvas(256, 192);
    const g = c.getContext('2d');
    const pal = ['#d9c8ab', '#b8946a', '#6d5140', '#2f2a27', '#e8dfcd', '#8c7b66'];
    g.fillStyle = '#e8dfcd';
    g.fillRect(0, 0, 256, 192);
    for (let i = 0; i < 6; i++) {
      g.fillStyle = pal[Math.floor(rnd() * pal.length)];
      if (rnd() > 0.5) {
        g.beginPath();
        g.arc(40 + rnd() * 176, 30 + rnd() * 130, 18 + rnd() * 50, 0, 7);
        g.fill();
      } else g.fillRect(rnd() * 180, rnd() * 130, 30 + rnd() * 90, 24 + rnd() * 80);
    }
    return tex(c, 1, 1);
  }
  function glowTex() {
    const c = canvas(128, 128);
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(0,0,0,.9)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  const shadowMap = glowTex();

  /* ---------- room shell ---------- */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(29.2, 9.2),
    new THREE.MeshStandardMaterial({ map: woodTex(), roughness: 0.55, metalness: 0 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const wallMat = M(0xe9e1d3, 0.95);
  const partMat = M(0xddd2bf, 0.95);
  const baseMat = M(0xcdbfa8, 0.8);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(29.2, 9.2), M(0xf1ebe0, 1));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = 3.2;
  scene.add(ceil);

  function wall(w, h, d, mat, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.receiveShadow = true;
    scene.add(m);
    return m;
  }
  wall(29.4, 3.2, 0.2, wallMat, 0, 1.6, -4.6);
  wall(29.4, 3.2, 0.2, wallMat, 0, 1.6, 4.6);
  wall(0.2, 3.2, 9.4, wallMat, -14.6, 1.6, 0);
  wall(0.2, 3.2, 9.4, wallMat, 14.6, 1.6, 0);
  [-5, 5].forEach((px) => {
    wall(0.2, 3.2, 2.9, partMat, px, 1.6, -3.05);
    wall(0.2, 3.2, 2.9, partMat, px, 1.6, 3.05);
    wall(0.2, 0.5, 3.2, partMat, px, 2.95, 0);
  });
  wall(29, 0.12, 0.03, baseMat, 0, 0.06, -4.485);
  wall(0.03, 0.12, 9, baseMat, -14.485, 0.06, 0);
  wall(0.03, 0.12, 9, baseMat, 14.485, 0.06, 0);

  const glowMat = new THREE.MeshBasicMaterial({ color: 0xffe3bd, toneMapped: false });
  wall(29, 0.04, 0.14, glowMat, 0, 3.1, -4.4);
  [-10, 0, 10].forEach((x) => wall(4, 0.03, 0.5, glowMat, x, 3.18, -0.5));

  function windowOn(x, z, ry, w) {
    const g = new THREE.Group();
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(w, 2.1), new THREE.MeshBasicMaterial({ color: 0xfff2d8, toneMapped: false }));
    g.add(pane);
    const fr = M(0x2c2723, 0.6);
    [-1, 0, 1].forEach((i) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.2, 0.05), fr);
      b.position.set((i * w) / 2, 0, 0.02);
      g.add(b);
    });
    [-1, 1].forEach((i) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, 0.05, 0.05), fr);
      b.position.set(0, i * 1.05, 0.02);
      g.add(b);
    });
    const mid = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, 0.05), fr);
    mid.position.set(0, 0.2, 0.02);
    g.add(mid);
    g.position.set(x, 1.65, z);
    g.rotation.y = ry;
    scene.add(g);
  }
  windowOn(14.48, -0.4, -Math.PI / 2, 3.2);
  windowOn(-14.48, -3.0, Math.PI / 2, 2.2);

  function art(w, h, s, x, y, z, ry) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(w + 0.08, h + 0.08, 0.04), K.black));
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: artTex(s), roughness: 0.9 }));
    p.position.z = 0.022;
    g.add(p);
    g.position.set(x, y, z);
    g.rotation.y = ry || 0;
    scene.add(g);
  }
  art(1.7, 1.1, 3, -9, 1.85, -4.45, 0);
  art(0.7, 0.9, 8, -11.4, 1.75, -4.47, 0);
  art(1.5, 0.95, 5, 0, 2.05, -4.45, 0);
  art(0.9, 1.2, 9, 5.12, 1.55, -3.3, Math.PI / 2);

  function plant(x, z, s) {
    const g = new THREE.Group();
    cyl(0.2 * s, 0.15 * s, 0.4 * s, K.ivory, 0, 0.2 * s, 0, g, 24);
    for (let i = 0; i < 9; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.2 * s, 10, 8), K.green);
      m.scale.set(0.5, 1.5, 0.5);
      const a = (i / 9) * Math.PI * 2;
      m.position.set(Math.cos(a) * 0.14 * s, 0.75 * s + rnd() * 0.35 * s, Math.sin(a) * 0.14 * s);
      m.rotation.z = Math.cos(a) * 0.5;
      m.rotation.x = -Math.sin(a) * 0.5;
      m.castShadow = true;
      g.add(m);
    }
    g.position.set(x, 0, z);
    scene.add(g);
  }
  plant(-14, -4, 1.5);
  plant(4.3, -4, 1.3);
  plant(14, 3.8, 1.4);
  plant(-4.3, 3.8, 1.2);

  function floorLamp(x, z) {
    const g = new THREE.Group();
    cyl(0.17, 0.19, 0.03, K.black, 0, 0.015, 0, g, 24);
    cyl(0.012, 0.012, 1.5, K.brass, 0, 0.78, 0, g, 8);
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.24, 0.32, 28, 1, true), K.shade);
    sh.position.y = 1.6;
    g.add(sh);
    g.position.set(x, 0, z);
    scene.add(g);
    if (!coarse) {
      const l = new THREE.PointLight(0xffcf94, 0.55, 5, 1.6);
      l.position.set(x, 1.55, z);
      scene.add(l);
    }
  }
  floorLamp(-6.1, -3.9);
  floorLamp(13.8, -2.6);

  function rug(x, z, w, d, base, edge) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: rugTex(base, edge), roughness: 1 }));
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.008, z);
    m.receiveShadow = true;
    scene.add(m);
  }
  rug(-10.2, -2.3, 4.6, 3.2, '#c4b399', '#a39078');
  rug(0, -2.8, 3.4, 3.2, '#d3c8b4', '#b8a98f');
  rug(10, -1.7, 3.8, 2.6, '#bfae92', '#9a8668');

  // Pendant lights over the dining table
  {
    const g = new THREE.Group();
    [-0.7, 0, 0.7].forEach((o) => {
      cyl(0.003, 0.003, 1.0, K.black, o, 2.7, 0, g, 6);
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.22, 0.24, 24, 1, true), M(0xb99660, 0.3, 0.8));
      c.material.side = THREE.DoubleSide;
      c.position.set(o, 2.1, 0);
      g.add(c);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffe9c0, toneMapped: false }));
      b.position.set(o, 2.03, 0);
      g.add(b);
    });
    g.position.set(10, 0, -1.7);
    scene.add(g);
  }

  /* ---------- lights ---------- */
  scene.add(new THREE.HemisphereLight(0xfff1dc, 0x6b5a48, 0.62));
  const sun = new THREE.DirectionalLight(0xffe7c4, 0.55);
  sun.position.set(6, 10, 7);
  if (!coarse) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera;
    sc.left = -16;
    sc.right = 16;
    sc.top = 7;
    sc.bottom = -7;
    sc.near = 1;
    sc.far = 30;
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.03;
  }
  scene.add(sun);
  [-10, 0, 10].forEach((x) => {
    const l = new THREE.PointLight(0xffd9a8, 0.85, 12, 1.4);
    l.position.set(x, 2.9, -0.4);
    scene.add(l);
  });
  if (!coarse) {
    [[-9, -3.7], [0, -3.3], [10, -1.7]].forEach((p) => {
      const s = new THREE.SpotLight(0xffe2b8, 0.9, 9, 0.55, 0.7, 1.2);
      s.position.set(p[0], 3.1, p[1] + 1.2);
      s.target.position.set(p[0], 0.5, p[1]);
      scene.add(s);
      scene.add(s.target);
    });
  }
  const winLight = new THREE.PointLight(0xfff0d8, 0.6, 7, 1.5);
  winLight.position.set(13, 1.8, -0.4);
  scene.add(winLight);
  const winLight2 = new THREE.PointLight(0xfff0d8, 0.5, 6, 1.5);
  winLight2.position.set(-13, 1.8, -3);
  scene.add(winLight2);

  /* ---------- furniture ---------- */
  const contactShadow = (x, z, w, d, ry) => {
    const sp = new THREE.Mesh(
      new THREE.PlaneGeometry(w, d),
      new THREE.MeshBasicMaterial({ map: shadowMap, transparent: true, opacity: 0.5, depthWrite: false })
    );
    sp.rotation.x = -Math.PI / 2;
    sp.rotation.z = -ry;
    sp.position.set(x, 0.014, z);
    scene.add(sp);
  };
  const place = (g, x, z, ry) => {
    g.position.set(x, 0, z);
    g.rotation.y = ry;
    scene.add(g);
  };

  // Decor that is not for sale
  place(DECOR.coffeeTable(), -9, -1.95, 0);
  place(DECOR.media(), -14.18, -0.2, Math.PI / 2);
  place(DECOR.bedside(), 0, -4.25, 0);
  place(DECOR.sideboard(), 5.33, -3.3, Math.PI / 2);
  contactShadow(-9, -1.95, 1.4, 1.4, 0);
  contactShadow(-14.18, -0.2, 2.1, 0.9, Math.PI / 2);
  contactShadow(0, -4.25, 3.6, 0.8, 0);
  contactShadow(5.33, -3.3, 0.7, 2.0, Math.PI / 2);

  // Catalogue pieces that stand in the showroom
  const pickables = [];
  const sprites = [];
  const byId = {};
  function dotTex() {
    const c = canvas(128, 128);
    const g = c.getContext('2d');
    g.beginPath();
    g.arc(64, 64, 50, 0, 7);
    g.fillStyle = 'rgba(28,24,21,.55)';
    g.fill();
    g.lineWidth = 7;
    g.strokeStyle = '#f3ede2';
    g.stroke();
    g.beginPath();
    g.arc(64, 64, 16, 0, 7);
    g.fillStyle = '#f3ede2';
    g.fill();
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    return t;
  }
  const dotMap = dotTex();
  products.forEach((p, i) => {
    const s = p.showroom;
    byId[p.id] = p;
    const g = buildModel(p);
    place(g, s.pos[0], s.pos[1], s.ry);
    g.traverse((o) => {
      o.userData.pid = p.id;
      if (o.isMesh) pickables.push(o);
    });
    contactShadow(s.pos[0], s.pos[1], s.sh[0], s.sh[1], s.ry);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotMap, transparent: true }));
    const dot = s.dot || [0, 0];
    sp.position.set(s.pos[0] + dot[0], s.hy, s.pos[1] + dot[1]);
    sp.userData.pid = p.id;
    sp.userData.ph = i * 1.3;
    sp.userData.base = coarse ? 0.34 : 0.26;
    sp.scale.setScalar(sp.userData.base);
    scene.add(sp);
    sprites.push(sp);
  });

  /* ---------- camera ---------- */
  const st = { pos: v3(ENTRANCE.p), yaw: 0, pitch: 0 };
  const aim = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    return { yaw: Math.atan2(-dx, -dz), pitch: Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) };
  };
  const a0 = aim(st.pos, v3(ENTRANCE.l));
  st.yaw = a0.yaw;
  st.pitch = a0.pitch;
  const introYaw = st.yaw;
  let swayT0 = 0;
  let tween = null;
  let entered = false;
  let currentRoom = '';

  function flyTo(pos, look, o) {
    o = o || {};
    const a = aim(pos, look);
    const yaw = a.yaw + (o.yawOff || 0);
    const pitch = a.pitch + (o.pitchOff || 0);
    const d = ((((yaw - st.yaw + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;
    tween = {
      t0: performance.now(),
      dur: reduced ? 250 : o.dur || 1500,
      from: { x: st.pos.x, y: st.pos.y, z: st.pos.z, yaw: st.yaw, pitch: st.pitch },
      to: { x: pos.x, y: pos.y, z: pos.z, yaw: st.yaw + d, pitch },
    };
  }
  const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  function constrain(v) {
    v.x = clamp(v.x, -14.1, 14.1);
    v.z = clamp(v.z, -4.1, 4.1);
    [-5, 5].forEach((px) => {
      if (Math.abs(v.x - px) < 0.45 && Math.abs(v.z) > 1.45) v.x = v.x < px ? px - 0.45 : px + 0.45;
    });
  }
  const roomAt = (x) => (x < -5 ? 'living' : x < 5 ? 'bedroom' : 'dining');

  /* ---------- input ---------- */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function pick(cx, cy) {
    const r = el.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(sprites.concat(pickables), false)[0];
    const fl = ray.intersectObject(floor, false)[0];
    if (hit && (!fl || hit.distance < fl.distance + 0.05) && hit.object.userData.pid) return { pid: hit.object.userData.pid };
    if (fl) return { floor: fl.point };
    return {};
  }
  let drag = null;
  const onDown = (e) => {
    if (!entered) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
    try {
      el.setPointerCapture(e.pointerId);
    } catch (err) {
      /* ignore */
    }
  };
  const onMove = (e) => {
    if (drag && drag.id === e.pointerId) {
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      if (drag.moved > 8) {
        tween = null;
        el.style.cursor = 'grabbing';
        onInteract && onInteract();
        st.yaw += dx * 0.0042;
        st.pitch = clamp(st.pitch + dy * 0.0035, -0.7, 0.6);
      }
      return;
    }
    if (coarse || !entered) return;
    const h = pick(e.clientX, e.clientY);
    if (h.pid) {
      el.style.cursor = 'pointer';
      onHover && onHover({ name: byId[h.pid].name, x: e.clientX, y: e.clientY });
    } else {
      el.style.cursor = 'grab';
      onHover && onHover(null);
    }
  };
  const onUp = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const tap = drag.moved < 8 && performance.now() - drag.t < 600;
    drag = null;
    el.style.cursor = 'grab';
    if (!tap) return;
    const h = pick(e.clientX, e.clientY);
    if (h.pid) {
      onPick && onPick(h.pid);
    } else if (h.floor) {
      onFloorTap && onFloorTap();
      const t = new THREE.Vector3(h.floor.x, 1.6, h.floor.z);
      constrain(t);
      tween = {
        t0: performance.now(),
        dur: reduced ? 250 : 1100,
        from: { x: st.pos.x, y: st.pos.y, z: st.pos.z, yaw: st.yaw, pitch: st.pitch },
        to: { x: t.x, y: t.y, z: t.z, yaw: st.yaw, pitch: st.pitch },
      };
    }
  };
  const onCancel = () => {
    drag = null;
    el.style.cursor = 'grab';
  };
  const onLeave = () => onHover && onHover(null);
  el.style.cursor = 'grab';
  el.addEventListener('pointerdown', onDown);
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointercancel', onCancel);
  el.addEventListener('pointerleave', onLeave);

  const keys = {};
  const onKeyDown = (e) => {
    keys[e.key.toLowerCase()] = true;
  };
  const onKeyUp = (e) => {
    keys[e.key.toLowerCase()] = false;
  };
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  /* ---------- sizing and loop ---------- */
  function resize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = camera.aspect < 0.8 ? 76 : 60;
    camera.updateProjectionMatrix();
  }
  let ro = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(resize);
    ro.observe(container);
  } else {
    window.addEventListener('resize', resize);
  }
  resize();

  const onContextLost = (event) => {
    event.preventDefault();
    onError && onError(new Error('The graphics context was lost. The photo-based showroom fallback is available.'));
  };
  el.addEventListener('webglcontextlost', onContextLost, false);

  let last = performance.now();
  let raf = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = now / 1000;
    if (tween) {
      const k = clamp((now - tween.t0) / tween.dur, 0, 1);
      const e = ease(k);
      const a = tween.from;
      const b = tween.to;
      st.pos.set(a.x + (b.x - a.x) * e, a.y + (b.y - a.y) * e, a.z + (b.z - a.z) * e);
      st.yaw = a.yaw + (b.yaw - a.yaw) * e;
      st.pitch = a.pitch + (b.pitch - a.pitch) * e;
      if (k >= 1) tween = null;
    } else if (!entered && !reduced) {
      st.yaw = introYaw + Math.sin((t - swayT0) * 0.16) * 0.5;
    }
    if (entered && !tween) {
      const f = (keys.w || keys.arrowup ? 1 : 0) - (keys.s || keys.arrowdown ? 1 : 0);
      const s = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
      const r = (keys.arrowleft ? 1 : 0) - (keys.arrowright ? 1 : 0);
      if (r) st.yaw += r * dt * 1.4;
      if (f || s) {
        const sp = 2.2 * dt;
        st.pos.x += (-Math.sin(st.yaw) * f + Math.cos(st.yaw) * s) * sp;
        st.pos.z += (-Math.cos(st.yaw) * f - Math.sin(st.yaw) * s) * sp;
        constrain(st.pos);
      }
    }
    camera.position.copy(st.pos);
    camera.rotation.set(st.pitch, st.yaw, 0, 'YXZ');
    if (entered) {
      const r = roomAt(st.pos.x);
      if (r !== currentRoom) {
        currentRoom = r;
        onRoomChange && onRoomChange(r);
      }
    }
    if (!reduced) {
      sprites.forEach((s) => {
        const k2 = 0.5 + 0.5 * Math.sin(t * 2 + s.userData.ph);
        s.scale.setScalar(s.userData.base * (0.92 + 0.12 * k2));
        s.material.opacity = 0.72 + 0.28 * k2;
      });
    }
    if (document.hidden) { raf = 0; return; }
    try { renderer.render(scene, camera); }
    catch (error) { onError && onError(error); return; }
    raf = requestAnimationFrame(frame);
  }
  const onVisibilityChange = () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);
  raf = requestAnimationFrame(frame);

  /* ---------- controller ---------- */
  return {
    enter() {
      if (entered) return;
      entered = true;
      const r = ROOMS.bedroom;
      flyTo(v3(r.p), v3(r.l), { dur: 2000 });
      currentRoom = 'bedroom';
      onRoomChange && onRoomChange('bedroom');
    },
    leave() {
      entered = false;
      swayT0 = performance.now() / 1000 + 1.6;
      flyTo(v3(ENTRANCE.p), v3(ENTRANCE.l));
    },
    flyToRoom(room) {
      const r = ROOMS[room];
      if (!r) return;
      entered = true;
      flyTo(v3(r.p), v3(r.l));
    },
    flyToProduct(id) {
      const p = byId[id];
      if (!p) return;
      entered = true;
      const s = p.showroom;
      const f = [Math.sin(s.ry), 0, Math.cos(s.ry)];
      const pos = new THREE.Vector3(s.pos[0] + f[0] * s.dist, 1.45, s.pos[1] + f[2] * s.dist);
      const look = new THREE.Vector3(s.pos[0], s.ly, s.pos[1]);
      flyTo(pos, look, { yawOff: desktop() ? -0.17 : 0, pitchOff: desktop() ? 0 : -0.12, dur: 1300 });
    },
    dispose() {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      el.removeEventListener('webglcontextlost', onContextLost, false);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onCancel);
      el.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
      });
      renderer.dispose();
      if (renderer.forceContextLoss) renderer.forceContextLoss();
      if (el.parentNode) el.parentNode.removeChild(el);
    },
  };
}
