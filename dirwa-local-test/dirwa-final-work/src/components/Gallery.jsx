import { useEffect, useMemo, useState } from 'react';
import { BUSINESS } from '../config.js';
import { CATEGORIES } from '../data/products.js';
import { GALLERY_PRODUCTS } from '../data/galleryProducts.js';
import { whatsappLink } from '../lib/format.js';
import ProductCard from './ProductCard.jsx';

export default function Gallery({ onSelect, onList }) {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = GALLERY_PRODUCTS.filter(
      (p) => (cat === 'all' || p.category === cat) && (!needle || p.name.toLowerCase().includes(needle))
    );
    return out;
  }, [cat, q]);

  useEffect(() => {
    onList(list);
  }, [list, onList]);

  const count = (id) => GALLERY_PRODUCTS.filter((p) => p.category === id).length;

  return (
    <main className="gallery">
      <div className="g-wrap">
        <div className="g-head">
          <h1>The gallery</h1>
          <p>
            {list.length} of {GALLERY_PRODUCTS.length} product photos
          </p>
        </div>

        <div className="g-tools">
          <div className="chips" role="group" aria-label="Filter by collection">
            <button type="button" className="chip" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>
              All <span>{GALLERY_PRODUCTS.length}</span>
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className="chip"
                aria-pressed={cat === c.id}
                onClick={() => setCat(c.id)}
              >
                {c.label} <span>{count(c.id)}</span>
              </button>
            ))}
          </div>
          <div className="g-find">
            <label className="sr" htmlFor="q">
              Search pieces
            </label>
            <input id="q" type="search" placeholder="Search pieces" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        {list.length === 0 ? (
          <p className="empty">Nothing matches "{q}". Clear the search or pick another collection.</p>
        ) : (
          <div className="grid">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={onSelect} />
            ))}
          </div>
        )}

        <footer className="g-foot">
          <div className="g-contact">
            <b>{BUSINESS.name}</b>
            <span>{BUSINESS.landmark}</span>
            <a href="https://www.google.com/maps/search/?api=1&query=10251+Willowvale+Road+Harare+Zimbabwe" target="_blank" rel="noopener noreferrer">{BUSINESS.location} · Get directions</a>
            {BUSINESS.phone && <a href={`tel:${BUSINESS.phone.replace(/[^+0-9]/g, '')}`}>Call {BUSINESS.phone}</a>}
            {BUSINESS.email && <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>}
            {BUSINESS.ecocash && <span>EcoCash: {BUSINESS.ecocash}</span>}
            {BUSINESS.salesText && <span>{BUSINESS.salesText}</span>}
            {BUSINESS.hours && <span>{BUSINESS.hours}</span>}
          </div>
          <a className="wa" href={whatsappLink(null)} target="_blank" rel="noopener noreferrer">
            Message us on WhatsApp
          </a>
        </footer>
      </div>
    </main>
  );
}
