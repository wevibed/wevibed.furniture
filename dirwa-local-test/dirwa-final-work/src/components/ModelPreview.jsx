import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { buildGalleryConceptModel } from '../showroom/models.js';

export default function ModelPreview({ product }) {
  const hostRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const host = hostRef.current;
    setError('');
    if (!host) return undefined;
    let renderer;
    let raf = 0;
    let observer;
    let disposed = false;
    let drag = null;
    let yaw = -0.45;
    let pitch = 0.12;
    let cameraDistance = 4.6;

    try {
      const coarse = window.matchMedia?.('(pointer: coarse)').matches || false;
      renderer = new THREE.WebGLRenderer({
        antialias: !coarse,
        alpha: true,
        powerPreference: coarse ? 'low-power' : 'default',
        failIfMajorPerformanceCaveat: false,
        stencil: false,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      host.appendChild(renderer.domElement);
      renderer.domElement.style.touchAction = 'none';
      renderer.domElement.setAttribute('aria-label', `Interactive 3D concept preview of ${product.name}`);
    } catch (err) {
      setError(err?.message || 'This browser could not initialise 3D graphics.');
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x29231f);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    scene.add(new THREE.HemisphereLight(0xfff3e1, 0x5d4c3d, 1.15));
    const key = new THREE.DirectionalLight(0xffe5c2, 2.1);
    key.position.set(4, 7, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xd7e0f0, 0.65);
    fill.position.set(-5, 3, -4);
    scene.add(fill);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(2.15, 48),
      new THREE.MeshStandardMaterial({ color: 0x4a4037, roughness: 0.92, metalness: 0 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.035;
    scene.add(ground);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.84, 0.008, 6, 80),
      new THREE.MeshBasicMaterial({ color: 0xb99660 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.02;
    scene.add(ring);

    let model;
    try {
      model = buildGalleryConceptModel(product);
      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const maxSize = Math.max(size.x, size.y, size.z, 0.1);
      const scale = 2.65 / maxSize;
      model.scale.setScalar(scale);
      model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
      scene.add(model);
      cameraDistance = Math.max(4.6, maxSize * scale * 2.2);
      camera.position.set(cameraDistance * 0.68, cameraDistance * 0.42, cameraDistance);
      camera.lookAt(0, 0.75, 0);
    } catch (err) {
      setError(err?.message || 'The 3D concept model could not be created.');
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      return undefined;
    }

    const resize = () => {
      if (!host || disposed) return;
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(resize);
      observer.observe(host);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();

    const canvas = renderer.domElement;
    const onContextLost = (event) => {
      event.preventDefault();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      setError('3D graphics stopped on this device. The product photograph is shown instead.');
    };
    canvas.addEventListener('webglcontextlost', onContextLost, false);
    const onDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
      try { canvas.setPointerCapture(event.pointerId); } catch (_) { /* optional */ }
    };
    const onMove = (event) => {
      if (!drag || drag.id !== event.pointerId) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      drag.x = event.clientX;
      drag.y = event.clientY;
      yaw += dx * 0.008;
      pitch = Math.max(-0.24, Math.min(0.42, pitch + dy * 0.004));
    };
    const onUp = () => { drag = null; };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && !disposed) {
        raf = requestAnimationFrame(frame);
      }
    };
    let last = performance.now();
    function frame(now) {
      raf = 0;
      if (disposed || document.hidden) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (model) {
        if (!drag) yaw += dt * 0.12;
        const orbitPitch = Math.max(0.08, 0.28 + pitch);
        camera.position.set(
          Math.sin(yaw) * cameraDistance * Math.cos(pitch),
          cameraDistance * orbitPitch,
          Math.cos(yaw) * cameraDistance * Math.cos(pitch)
        );
        camera.lookAt(0, 0.75, 0);
      }
      try {
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      } catch (err) {
        setError(err?.message || '3D rendering stopped. The product photograph is shown instead.');
      }
    }
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost, false);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      scene.traverse((object) => { if (object.geometry) object.geometry.dispose(); });
      renderer.dispose();
      renderer.forceContextLoss?.();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [product.id, product.reference, product.category, product.name]);

  return (
    <div className="model-preview-wrap">
      <div className={'model-preview' + (error ? ' model-preview-fallback' : '')} ref={hostRef}>
        {error && product.photo && <img className="model-preview-photo-fallback" src={product.photo} alt={product.name} />}
      </div>
      <div className="model-preview-caption">
        <span>3D concept preview</span>
        <span>Drag to rotate</span>
      </div>
      {error && (
        <div className="model-preview-error" role="status">
          3D preview unavailable in this browser. The product photograph remains available. ({error})
        </div>
      )}
      <p className="model-disclaimer">Representative category model, not a verified exact replica of this photographed product.</p>
    </div>
  );
}
