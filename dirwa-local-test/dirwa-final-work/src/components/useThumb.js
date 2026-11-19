import { useEffect, useState } from 'react';
import { requestThumb } from '../showroom/thumbs.js';

// Returns the picture for a product: the real photo if one is set, otherwise the demo 3D render.
export default function useThumb(product) {
  const [url, setUrl] = useState(product.photo || null);
  useEffect(() => {
    if (product.photo) {
      setUrl(product.photo);
      return undefined;
    }
    let live = true;
    requestThumb(product).then((u) => {
      if (live && u) setUrl(u);
    });
    return () => {
      live = false;
    };
  }, [product]);
  return url;
}
