import { useEffect, useRef, useState } from 'react';
import { createShowroom } from '../showroom/scene.js';
import { FEATURED, ROOMS } from '../data/products.js';
import ProductCard from './ProductCard.jsx';
import { GALLERY_PRODUCTS } from '../data/galleryProducts.js';
import { CATEGORIES } from '../data/products.js';

export default function Showroom({ mode, selectedId, onSelect, onFloorTap }) {
  const stageRef = useRef(null);
  const api = useRef(null);
  const cbs = useRef({});
  cbs.current = { onSelect, onFloorTap };

  const [room, setRoom] = useState('bedroom');
  const [hover, setHover] = useState(null);
  const [hint, setHint] = useState(false);
  const [folded, setFolded] = useState(false);
  const [failed, setFailed] = useState('');
  const [fallbackCategory, setFallbackCategory] = useState('living');

  useEffect(() => {
    let s;
    try {
      s = createShowroom(stageRef.current, {
        products: FEATURED,
        onPick: (id) => cbs.current.onSelect(id),
        onFloorTap: () => cbs.current.onFloorTap(),
        onRoomChange: setRoom,
        onHover: setHover,
        onInteract: () => setHint(false),
        onError: (error) => {
          console.error('Dirwa showroom rendering error:', error);
          setFailed(error?.message || 'The 3D renderer stopped unexpectedly.');
        },
      });
      setFailed('');
    } catch (e) {
      console.error('Dirwa showroom failed to initialise:', e);
      setFailed(e?.message || 'The 3D renderer could not initialise.');
      return undefined;
    }
    api.current = s;
    return () => {
      s.dispose();
      api.current = null;
    };
  }, []);

  // Home shows the idle showroom behind the welcome screen; #showroom lets the visitor walk in.
  useEffect(() => {
    const s = api.current;
    if (!s) return undefined;
    if (mode === 'showroom') {
      s.enter();
      setHint(true);
      const t = setTimeout(() => setHint(false), 9000);
      return () => clearTimeout(t);
    }
    s.leave();
    return undefined;
  }, [mode]);

  useEffect(() => {
    if (mode === 'showroom' && selectedId && api.current) {
      setHint(false);
      api.current.flyToProduct(selectedId);
    }
  }, [selectedId, mode]);

  const goRoom = (r) => {
    onSelect(null);
    api.current && api.current.flyToRoom(r);
    setRoom(r);
  };

  const inRoom = FEATURED.filter((p) => p.showroom.room === room);
  const showDock = mode === 'showroom' && !selectedId;

  return (
    <>
      <div className={'stage' + (failed ? ' stage-static' : '')} ref={stageRef} role="img" aria-label="Interactive 3D furniture showroom" />
      {failed && mode === 'showroom' && (
        <div className="nogl">
          <div className="nogl-content">
            <p className="nogl-kicker">DIRWA FURNITURE / SHOWROOM</p>
            <h2>Explore by collection</h2>
            <p>The interactive 3D scene could not start on this device. You can still browse the real product photographs below.</p>
            <p className="nogl-diagnostic">Technical detail: {failed}</p>
            <div className="fallback-categories">
              {CATEGORIES.map((c) => (
                <button key={c.id} type="button" aria-pressed={fallbackCategory === c.id} onClick={() => setFallbackCategory(c.id)}>{c.label}</button>
              ))}
            </div>
            <div className="fallback-products">
              {GALLERY_PRODUCTS.filter((p) => p.category === fallbackCategory).slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} onOpen={onSelect} />
              ))}
            </div>
            <button className="link" type="button" onClick={() => window.location.hash = 'gallery'}>Open full product gallery</button>
          </div>
        </div>
      )}
      <div className={'hint' + (hint && mode === 'showroom' && !selectedId ? ' show' : '')} role="status">
        Drag to look around. Tap the floor to walk. Tap a dot to view a piece.
      </div>
      {hover && (
        <div className="tip" style={{ left: hover.x, top: hover.y }}>
          {hover.name}
        </div>
      )}
      {!failed && <nav className={'dock' + (showDock ? '' : ' away')} aria-label="Showroom rooms and pieces">
        <div className="tabs">
          {Object.entries(ROOMS).map(([id, r]) => (
            <button
              key={id}
              type="button"
              className="tab"
              aria-current={room === id ? 'true' : 'false'}
              onClick={() => goRoom(id)}
            >
              {r.label}
            </button>
          ))}
          <span className="sp" />
          <button type="button" className="fold" aria-expanded={!folded} onClick={() => setFolded(!folded)}>
            {folded ? 'Show pieces' : 'Hide pieces'}
          </button>
        </div>
        {!folded && (
          <div className="strip">
            {inRoom.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={onSelect} compact />
            ))}
          </div>
        )}
      </nav>}
    </>
  );
}
