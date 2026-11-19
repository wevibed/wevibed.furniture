# Dirwa mobile image experience update

## What changed

- Product gallery cards now load optimized WebP thumbnails from `public/products/thumbs/`.
- The 90 catalog photographs remain unchanged in `public/products/` and are used in the product detail view.
- Thumbnail derivatives are capped at 640 px on the longest side and encoded as WebP at quality 79.
- Gallery thumbnails load lazily and decode asynchronously; opened product photographs load eagerly.
- Gallery cards and product detail images use `object-fit: contain` so the complete photograph remains visible without cropping or distortion.
- The mobile product image area has a stable height and cannot collapse inside the scrollable product panel.
- The mobile product panel can expand to 90 svh so the photograph has room, while the rest of the product details remain scrollable.
- Gallery navigation has an opaque background so scrolling category labels and counts do not show through the fixed header.
- Photo mode is the default every time a different product is opened; 3D concept remains available as an optional view.

## Image weight

- Original product-image set: 10.81 MB
- Generated thumbnail set: 3.58 MB
- Thumbnail set is approximately 66.9% smaller than the original set.
- All 90 gallery photo references were checked: no missing original photographs or thumbnails.

## Local test

From the directory containing `package.json`:

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

The source bundle does not include `node_modules` or a prebuilt `dist` directory.
