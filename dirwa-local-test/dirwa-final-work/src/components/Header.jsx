import { BUSINESS } from '../config.js';

export default function Header({ view, go }) {
  return (
    <header className="top">
      <button className="mark" type="button" onClick={() => go('home')} aria-label="Back to the start">
        <b>Dirwa</b>
        <span>{BUSINESS.location}</span>
      </button>
      {view !== 'home' && (
        <nav className="views" aria-label="Choose how to browse">
          <button type="button" aria-current={view === 'showroom' ? 'page' : undefined} onClick={() => go('showroom')}>
            Showroom
          </button>
          <button type="button" aria-current={view === 'gallery' ? 'page' : undefined} onClick={() => go('gallery')}>
            Gallery
          </button>
        </nav>
      )}
    </header>
  );
}
