import { GALLERY_PRODUCTS } from '../data/galleryProducts.js';

export default function Landing({ go }) {
  return (
    <section className="intro" aria-label="Welcome">
      <div className="intro-in">
        <h1>Dirwa Furniture</h1>
        <p>Walk through the showroom, or browse every piece in the gallery.</p>
        <div className="choices">
          <button className="cta" type="button" onClick={() => go('showroom')}>
            Enter the showroom
          </button>
          <button className="cta ghost" type="button" onClick={() => go('gallery')}>
            Browse the gallery <span className="count">{GALLERY_PRODUCTS.length} photos</span>
          </button>
        </div>
        <small>Explore the product photographs, then open individual pieces for a 3D concept preview.</small>
      </div>
    </section>
  );
}
