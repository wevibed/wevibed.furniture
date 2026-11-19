// The Dirwa catalogue (24 listings from the WhatsApp catalogue).
//
// To add or change a product, edit this file. Fields:
//   id        unique, lowercase, no spaces
//   name      shown to customers
//   category  one of: living, bedroom, wardrobes, kitchen, dining
//   price     number (USD) or [min, max] for a range
//   model     which demo 3D model draws the picture (see src/showroom/models.js)
//   params    options passed to that model
//   photos    add real photographs in the PHOTOS list below the catalogue. When a product has
//             one, the gallery shows it instead of the demo 3D picture.
//   description / details   fill in once Dirwa confirms sizes, materials and warranty

export const CATEGORIES = [
  { id: 'living', label: 'Living Room' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'wardrobes', label: 'Wardrobes' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'dining', label: 'Dining' },
  { id: 'media', label: 'TV & Media' },
  { id: 'headboards', label: 'Headboards' },
];

// The 3D showroom has three rooms. Wardrobes sit in the bedroom, kitchen units beside the dining area.
export const ROOMS = {
  living: { label: 'Living room', p: [-9.8, 1.6, 3.0], l: [-10, 0.9, -3] },
  bedroom: { label: 'Bedroom', p: [0, 1.6, 3.2], l: [0, 1, -3.5] },
  dining: { label: 'Dining and kitchen', p: [9.8, 1.6, 3.0], l: [10, 0.9, -2] },
};
export const ROOM_OF_CATEGORY = {
  living: 'living',
  bedroom: 'bedroom',
  wardrobes: 'bedroom',
  kitchen: 'dining',
  dining: 'dining',
};

// [id, name, category, price, model, params]
const RAW = [
  // Living room
  ['recliner-sofa', 'Recliner sofa', 'living', 1400, 'recliner', { seats: 2 }],
  ['kirst-sofa', 'Kirst sofa', 'living', 950, 'sofa', { seats: 3, mat: 'fabric' }],
  ['harvard-sofa', 'Harvard sofa', 'living', 500, 'sofa', { seats: 3, mat: 'leather', high: true }],
  ['bachelors-sofa', 'Bachelors sofa', 'living', 220, 'sofa', { seats: 2, mat: 'fabricDk' }],
  ['l-shape-sofa', 'L-shape sofa', 'living', 350, 'wa0008Lshape', {}],
  ['u-shape-sofa', 'U-shape sofa', 'living', 420, 'ushape', { mat: 'fabricDk' }],
  ['hybrid-u-sofa', 'Hybrid U-shape sofa', 'living', 490, 'ushape', { mat: 'umber', hybrid: true }],
  // Bedroom
  ['storage-bed', 'Storage bed', 'bedroom', 850, 'bed', { variant: 'storage' }],
  ['ordinary-double-bed', 'Ordinary double bed', 'bedroom', 210, 'bed', { variant: 'standard' }],
  ['double-bed-pillows', 'Double bed with pillows', 'bedroom', 240, 'bed', { variant: 'pillows' }],
  ['all-size-bed', 'All-size bed', 'bedroom', 750, 'bed', { variant: 'allsize', w: 2.1 }],
  ['headboard', 'Headboard', 'bedroom', 250, 'headboard', {}],
  // Wardrobes
  ['wardrobe-6-door', '6-door wardrobe (3-piece)', 'wardrobes', 500, 'wardrobe', { doors: 6, seams: [2, 4] }],
  ['wardrobe-5-door', '5-door wardrobe (2-piece)', 'wardrobes', 450, 'wardrobe', { doors: 5, seams: [3] }],
  ['wardrobe-4-door-boards', '4-door wardrobe boards', 'wardrobes', 300, 'wardrobe', { doors: 4, boards: true }],
  ['wardrobe-3-door-boards', '3-door wardrobe boards', 'wardrobes', 230, 'wardrobe', { doors: 3, boards: true }],
  // Kitchen
  ['kitchen-2-piece-6-door', '2-piece 6-door kitchen unit', 'kitchen', 450, 'kitchen', { doors: 6 }],
  ['kitchen-3-piece', '3-piece kitchen unit', 'kitchen', [650, 680], 'kitchen', { doors: 8, tall: true, hood: true }],
  ['kitchen-5-door', '5-door kitchen unit', 'kitchen', 450, 'kitchen', { doors: 5, unit: 'ivory' }],
  ['kitchen-3-door', '3-door kitchen unit', 'kitchen', 230, 'kitchen', { doors: 3 }],
  ['kitchen-4-door', '4-door kitchen unit', 'kitchen', 280, 'kitchen', { doors: 4, unit: 'ivory' }],
  // Dining
  ['dining-chairs', 'Dining chairs', 'dining', 850, 'diningChairs', { n: 6 }],
  ['kitchen-chairs', 'Kitchen chairs', 'dining', 360, 'kitchenChairs', { n: 4 }],
  ['table', 'Table', 'dining', 250, 'table', {}],
];

// Pieces that stand in the 3D showroom. pos is [x, z] on the floor, ry the turn in radians.
// dist: how far the camera stands back. ly: height the camera looks at. hy: height of the tap dot.
const SHOWROOM = {
  'kirst-sofa': { pos: [-12.0, -3.65], ry: 0, sh: [2.5, 1.35], dist: 3.2, ly: 0.6, hy: 1.3 },
  'l-shape-sofa': { pos: [-8.8, -3.35], ry: 0, sh: [3.35, 2.1], dist: 3.8, ly: 0.75, hy: 1.35 },
  'recliner-sofa': { pos: [-12.0, -1.25], ry: 0.75, sh: [2.4, 2.2], dist: 3.5, ly: 0.6, hy: 1.5 },
  'storage-bed': { pos: [0, -3.35], ry: 0, sh: [2.5, 2.7], dist: 4.2, ly: 0.7, hy: 1.5 },
  'wardrobe-6-door': { pos: [-4.6, -3.2], ry: Math.PI / 2, sh: [0.9, 2.9], dist: 3.0, ly: 1.2, hy: 2.6 },
  'kitchen-3-piece': { pos: [11.5, -4.17], ry: 0, sh: [5.2, 0.9], dist: 4.4, ly: 1.1, hy: 2.4 },
  table: { pos: [10, -1.7], ry: 0, sh: [2.9, 2.5], dist: 3.7, ly: 0.6, hy: 1.1 },
  'dining-chairs': { pos: [10, -1.7], ry: 0, sh: [2.9, 2.5], dist: 3.7, ly: 0.6, hy: 1.3, dot: [1.2, 0.9] },
};

// Real photographs, by product id. Put clean images in /public/products and list them here.
// Example: 'kirst-sofa': '/products/kirst-sofa.jpg'
const PHOTOS = {};

export const PRODUCTS = RAW.map(([id, name, category, price, model, params]) => {
  const cat = CATEGORIES.find((c) => c.id === category);
  const showroom = SHOWROOM[id] ? { ...SHOWROOM[id], room: ROOM_OF_CATEGORY[category] } : null;
  return {
    id,
    name,
    category,
    categoryLabel: cat.label,
    price,
    model,
    params,
    photo: PHOTOS[id] || null,
    description: `${name} from Dirwa's ${cat.label.toLowerCase()} range.`,
    details: [], // for example [['Size', '220 × 95 × 88 cm'], ['Material', 'Fabric']]
    showroom,
  };
});

export const BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
export const FEATURED = PRODUCTS.filter((p) => p.showroom);
