import { SHOW_PRICES } from '../config.js';
import { formatPrice } from '../lib/format.js';
import useThumb from './useThumb.js';

export default function ProductCard({ product, onOpen, compact = false }) {
  const img = useThumb(product, { thumbnail: true });
  return (
    <button type="button" className={'card' + (compact ? ' compact' : '')} onClick={() => onOpen(product.id)}>
      <span className="ph">{img && <img src={img} alt="" loading="lazy" decoding="async" fetchPriority="low" />}</span>
      <span className="tx">
        <span className="nm">{product.name}</span>
        <span className="ct">
          {product.categoryLabel}
          {SHOW_PRICES && product.price != null && <span className="pr">{formatPrice(product.price)}</span>}
        </span>
      </span>
    </button>
  );
}
