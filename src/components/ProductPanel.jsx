import { useEffect, useRef, useState } from 'react';
import { BUSINESS, DEMO_NOTICE, SHOW_PRICES } from '../config.js';
import { formatPrice, whatsappLink } from '../lib/format.js';
import useThumb from './useThumb.js';
import ModelPreview from './ModelPreview.jsx';

function Picture({ product }) {
  const img = useThumb(product);
  return <div className="p-img">{img && <img src={img} alt={product.name} loading="eager" decoding="async" fetchPriority="high" />}</div>;
}

export default function ProductPanel({ product, inGallery, onClose, onPrev, onNext, onViewInShowroom }) {
  const title = useRef(null);
  const [modelSelection, setModelSelection] = useState({ id: null, enabled: false });
  const showModel = !!product && modelSelection.id === product.id && modelSelection.enabled;
  const open = !!product;
  const isPiece = !!(product && product.showroom && product.photo && !inGallery);
  const [zoom, setZoom] = useState(false);
  useEffect(() => setZoom(false), [product?.id]);
  const selectPhoto = () => setModelSelection({ id: product?.id ?? null, enabled: false });
  const selectModel = () => setModelSelection({ id: product?.id ?? null, enabled: true });

  useEffect(() => {
    setModelSelection({ id: product?.id ?? null, enabled: false });
  }, [product?.id]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') (zoom ? setZoom(false) : onClose());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, zoom]);

  const id = product ? product.id : null;
  useEffect(() => {
    if (id && inGallery && title.current) title.current.focus();
  }, [id, inGallery]);

  return (
    <>
      {inGallery && <div className={'scrim' + (open ? ' open' : '')} onClick={onClose} aria-hidden="true" />}
      {zoom && product && (
        <div className="lightbox" role="dialog" aria-label={`Product photo of ${product.name}`} onClick={() => setZoom(false)}>
          <button className="x" type="button" onClick={() => setZoom(false)} aria-label="Close photo">&times;</button>
          <img src={product.photo} alt={`Product photo of ${product.name}`} />
          <p>Product photo from AC Furnitures</p>
        </div>
      )}
      <aside className={'panel' + (open ? ' open' : '') + (isPiece ? ' panel-piece' : '')} aria-label="Product details" aria-hidden={!open}>
        {product && (
          <>
            <div className="p-head">
              <span className="p-cat">{product.categoryLabel}</span>
              <button className="x" type="button" onClick={onClose} aria-label="Close product details">
                &times;
              </button>
            </div>
            {inGallery && (
              <>
                {!showModel && <Picture product={product} />}
                {showModel && <ModelPreview product={product} />}
                <div className="p-view-toggle" role="group" aria-label="Choose product view">
                  <button type="button" aria-pressed={!showModel} onClick={selectPhoto}>Photo</button>
                  <button type="button" aria-pressed={showModel} onClick={selectModel}>3D concept</button>
                </div>
              </>
            )}
            {isPiece ? (
              <div className="piece-row">
                <button className="piece-photo" type="button" onClick={() => setZoom(true)} aria-label={`Enlarge the product photo of ${product.name}`}>
                  <img src={product.photo.replace('/products/', '/products/thumbs/')} alt={`Product photo of ${product.name}`} />
                  <span className="zoom-tag">Tap to enlarge</span>
                </button>
                <div className="piece-info">
                  <h2 ref={title} tabIndex={-1}>{product.name}</h2>
                  {SHOW_PRICES && (
                    <p className={'p-price' + (product.price == null ? ' ask' : '')}>
                      {product.price != null ? formatPrice(product.price) : 'Price on request'}
                      {product.price != null && <span>USD</span>}
                    </p>
                  )}
                  <p className="piece-note">Drag the 3D view to look around.</p>
                  <p className="d piece-desc">{product.description}</p>
                </div>
              </div>
            ) : (
              <>
                <h2 ref={title} tabIndex={-1}>
                  {product.name}
                </h2>
                {SHOW_PRICES && product.price != null && (
                  <p className="p-price">
                    {formatPrice(product.price)} <span>USD, catalogue price</span>
                  </p>
                )}
                <p className="d">{product.description}</p>
                {product.reference && <p className="d small">Client photo reference: {product.reference}</p>}
              </>
            )}
            {product.details.length > 0 && (
              <dl className="specs">
                {product.details.map(([k, v]) => (
                  <div key={k} className="row">
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {DEMO_NOTICE && !product.photo && (
              <div className="demo">
                <i />
                <span>{DEMO_NOTICE}</span>
              </div>
            )}
            {BUSINESS.deliveryText && <p className="d small">{BUSINESS.deliveryText}</p>}
            <div className="acts">
              <button className="nv" type="button" onClick={onPrev} aria-label="Previous piece">
                &lsaquo;
              </button>
              <a className="wa" href={whatsappLink(product)} target="_blank" rel="noopener noreferrer">
                Enquire on WhatsApp
              </a>
              <button className="nv" type="button" onClick={onNext} aria-label="Next piece">
                &rsaquo;
              </button>
            </div>
            {onViewInShowroom && (
              <button className="link" type="button" onClick={onViewInShowroom}>
                See it in the showroom
              </button>
            )}
          </>
        )}
      </aside>
    </>
  );
}
