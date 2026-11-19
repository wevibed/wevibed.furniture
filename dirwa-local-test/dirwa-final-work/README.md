# DIRWA FURNITURE — WEBSITE RELEASE CANDIDATE

React + Vite + Three.js website for Dirwa Furniture, Highglen Shops, Harare.

## Included

- Premium charcoal, ivory and brass visual design.
- Responsive homepage, product gallery and 3D showroom navigation.
- 90 gallery photographs organised across living room, bedroom, headboards, wardrobes,
  kitchen, dining and TV/media categories.
- Product detail panel with photo view, category-level 3D concept preview and WhatsApp enquiry.
- Dedicated procedural WA0008 cream L-shaped sofa model in the showroom and 3D preview.
- Mobile-oriented rendering profile, reduced texture sizes, frame pause while tab is hidden,
  improved renderer fallback attempts and a photo-based showroom fallback.
- WhatsApp enquiry number configured as +263 71 802 2928.
- Prices hidden pending confirmation from Dirwa.

## Run locally

```bash
npm install
npm run dev
```

Create and test the production bundle:

```bash
npm run build
npm run preview
```

## Cloudflare Pages

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: project root

## 3D representation notes

Every gallery product can open a draggable 3D concept preview. These are procedural models
representing the product category (sofa, bed, headboard, wardrobe, kitchen unit, dining set
or media unit). They are not 90 separately sculpted, dimensionally verified replicas.
The `DIRWA-0008` photograph is mapped to the dedicated WA0008 L-shaped sofa reconstruction.
Exact SKU-level models require adequate front, side and rear photographs plus measurements.

The main navigable room showroom currently contains a curated set of 3D pieces. It is not
a literal room containing all 90 catalogue items at once; loading all assets simultaneously
would be poor practice on mobile. Product-level 3D previews are loaded on demand instead.

## Launch items to confirm before publishing

1. Final image cleanup: eight images have first-pass cleaned versions; other photos may still
   have catalogue numbers or overlays. Replace them with clean originals or complete retouching.
2. Confirm official product names, reference numbers, prices, dimensions, material/finish and stock.
3. Confirm delivery coverage, payment terms and the public contact/address details.
4. Confirm the WhatsApp number +263 71 802 2928 remains the preferred enquiry number.
5. Test the production build on target Android phones and iPhone Safari, plus desktop browsers.

This package is a deployable technical candidate, but the content checks above should be
completed before describing it as the final client-approved production release.


## Business contact details (from Dirwa's supplied business-profile screenshot)

- Main WhatsApp / phone: +263 71 802 2928
- EcoCash contact: +263 78 308 9538
- Email: munashedirwa0@gmail.com
- Address: 10251 Willowvale Road, Harare, Zimbabwe
- Landmark description: Highglen Road and Willowvale Road, opposite Kidcamp
- The profile lists the business as open 24 hours; the site labels this as listing information, not verified staffed opening hours.
- The business profile describes video-call sales and local pay-on-delivery; delivery coverage and EcoCash payment terms should be confirmed before publishing stronger promises.


## Compatibility and 3D scope

The 3D showroom uses Three.js with mobile-conscious pixel ratio and shadow settings, a photo/category fallback when the full showroom renderer cannot start, and an automatic product-photo fallback if a product 3D preview loses its WebGL context. The WA0008 L-shaped sofa is a procedural first-pass reconstruction from its supplied photo. The remaining product 3D previews are category-level illustrative models, not individually modelled exact replicas of all photographed SKUs. This package is a deployment candidate pending a successful local production build and real-device browser testing.
