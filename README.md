# AC FURNITURES — DIRWA FRAMEWORK BUILD

React + Vite + Three.js furniture website adapted from the Dirwa 3D showroom framework.

## Included
- AC Furnitures branding and supplied business contact details.
- Premium charcoal, ivory, sand and brass visual direction.
- Responsive landing page, interactive 3D showroom and searchable product gallery.
- Eleven optimized product images generated as clean catalogue-style visuals from the supplied product references.
- Product detail panels and WhatsApp enquiry links to +263 77 306 7800.
- Existing GLB showroom assets reused as category-level illustrative concepts, not exact replicas of AC Furnitures stock.
- Mobile-conscious Three.js rendering and gallery fallback.

## Business details supplied in the WhatsApp profile screenshots
- Name: AC Furnitures
- Phone / WhatsApp: +263 77 306 7800
- Location: Corner Hyglen & Willowvale, Harare
- Address: Willowvale Road, Harare, Zimbabwe
- Delivery: Free delivery around Harare
- Payment: Payment on delivery accepted
- Hours: Profile lists open 24 hours; confirm before treating as staffed opening hours.

## Catalogue
The ten products in `src/data/galleryProducts.js` use the supplied WhatsApp catalogue screenshots and generated clean product visuals. Prices shown are only those visible in the supplied screenshots. Products without a confidently matched price are labelled Price on request.

## Run locally
```bash
npm install
npm run dev
```

Production build:
```bash
npm run build
npm run preview
```

## Cloudflare Pages
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: project root

## Important before public launch
1. AC Furnitures should approve the generated catalogue visuals; they are clean illustrative product representations, not photographs of exact stock.
2. Confirm each product's official name, current price, size, upholstery/material, included items and availability.
3. Add a cleaned kitchen-unit photo; the wardrobe image is an illustrative clean catalogue visual and should be approved by AC Furnitures.
4. Confirm address pin, opening hours and delivery terms.
5. Test the production build on Android, iPhone Safari and desktop browsers.
