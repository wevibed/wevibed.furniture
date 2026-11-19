import { useCallback, useEffect, useState } from 'react';
import { BY_ID, FEATURED } from './data/products.js';
import { GALLERY_PRODUCTS } from './data/galleryProducts.js';

// Gallery photos that have a 3D model in the showroom link to it ("See it in the showroom").
const PIECE_OF_PHOTO = Object.fromEntries(FEATURED.map((p) => [p.gallery, p]));
const ALL_BY_ID = {
  ...BY_ID,
  ...Object.fromEntries(
    GALLERY_PRODUCTS.map((p) => {
      const piece = PIECE_OF_PHOTO[p.id];
      return [p.id, piece ? { ...p, showroom: piece.showroom, showroomId: piece.id } : p];
    })
  ),
  ...Object.fromEntries(FEATURED.map((p) => [p.id, p])),
};
import Header from './components/Header.jsx';
import Landing from './components/Landing.jsx';
import Showroom from './components/Showroom.jsx';
import Gallery from './components/Gallery.jsx';
import ProductPanel from './components/ProductPanel.jsx';

// The page lives at one of three hashes: #home (default), #showroom, #gallery.
const readView = () => {
  const h = window.location.hash.replace('#', '');
  return h === 'showroom' || h === 'gallery' ? h : 'home';
};

export default function App() {
  const [view, setViewState] = useState(readView);
  const [selId, setSelId] = useState(null);
  const [galleryList, setGalleryList] = useState([]);

  useEffect(() => {
    const onHash = () => {
      setViewState(readView());
      setSelId(null);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = useCallback((next, productId = null) => {
    setSelId(productId);
    setViewState(next);
    const hash = next === 'home' ? '' : '#' + next;
    if (window.location.hash !== hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search + hash);
    }
  }, []);

  const sel = selId ? ALL_BY_ID[selId] : null;
  const panelUsesGallery = view === 'gallery' || (!!sel && !!sel.photo && !sel.showroom);
  const navList = view === 'gallery' ? galleryList : (panelUsesGallery ? GALLERY_PRODUCTS : FEATURED);
  const idx = sel ? navList.findIndex((p) => p.id === sel.id) : -1;
  const step = (d) => {
    if (!navList.length) return;
    const i = idx < 0 ? 0 : (idx + d + navList.length) % navList.length;
    setSelId(navList[i].id);
  };

  return (
    <>
      {view !== 'gallery' && (
        <Showroom
          mode={view}
          selectedId={selId}
          onSelect={setSelId}
          onFloorTap={() => setSelId(null)}
        />
      )}
      {view === 'gallery' && <Gallery onSelect={setSelId} onList={setGalleryList} />}
      <Header view={view} go={go} />
      {view === 'home' && <Landing go={go} />}
      <ProductPanel
        product={sel}
        inGallery={panelUsesGallery}
        onClose={() => setSelId(null)}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        onViewInShowroom={sel && sel.showroom && view === 'gallery' ? () => go('showroom', sel.showroomId || sel.id) : null}
      />
    </>
  );
}
