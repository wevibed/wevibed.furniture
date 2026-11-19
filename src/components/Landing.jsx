import { GALLERY_PRODUCTS } from '../data/galleryProducts.js';
import { BUSINESS } from '../config.js';
export default function Landing({ go }) {
  return (
    <section className="intro" aria-label="Welcome">
      <div className="intro-in">
        <p className="eyebrow">AC FURNITURES · HARARE</p>
        <h1>Furniture for living.</h1>
        <p>Explore the collection, step into the showroom, or enquire directly.</p>
        <div className="choices">
          <button className="cta" type="button" onClick={() => go('showroom')}>Enter the showroom</button>
          <button className="cta ghost" type="button" onClick={() => go('gallery')}>Browse the gallery <span className="count">{GALLERY_PRODUCTS.length} pieces</span></button>
        </div>
        <small>Free delivery around Harare · Payment on delivery accepted</small>
      </div>
    </section>
  );
}
