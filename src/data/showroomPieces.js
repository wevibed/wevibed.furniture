// Illustrative showroom models adapted from the Dirwa framework. These are category-level
// concepts, not exact replicas of AC Furnitures' photographed stock.
import { GALLERY_PRODUCTS } from './galleryProducts.js';
const G = Object.fromEntries(GALLERY_PRODUCTS.map((p) => [p.id, p]));
const NOTE = 'Illustrative 3D concept based on this furniture category. The gallery photo is the product reference; confirm the exact finish, dimensions and availability with AC Furnitures.';
const RAW = [
  { id:'ac-pumpkin-3d', gallery:'ac-pumpkin-velvet', name:'Pumpkin 3-seater sofa concept', category:'living', room:'living', modelFile:'cream-modular-sectional', pos:[-7.7,-3.37], ry:0, sh:[4.2,2.9], dist:4.6, ly:0.7, hy:1.75 },
  { id:'ac-sixseat-3d', gallery:'ac-sixseat-grey', name:'Six-seater sofa set concept', category:'living', room:'living', modelFile:'charcoal-leather-set', pos:[-12.15,-3.28], ry:0, scale:0.7, sh:[5.4,3.2], dist:4.1, ly:0.6, hy:1.4 },
  { id:'ac-havard-3d', gallery:'ac-havard-sofa', name:'Havard sofa concept', category:'living', room:'living', modelFile:'grey-l-sectional', pos:[-13.16,1.5], ry:Math.PI/2, sh:[3.3,4.3], dist:4.6, ly:0.7, hy:1.7 },
  { id:'ac-mini-l-3d', gallery:'ac-mini-l', name:'Mini L-shaped sofa concept', category:'living', room:'living', modelFile:'grey-l-sectional', pos:[-9.5,4.11], ry:Math.PI, sh:[4.1,1.3], dist:3.7, ly:1.2, hy:2.0 },
  { id:'ac-headboard-3d', gallery:'ac-queen-headboard', name:'Queen headboard concept', category:'headboards', room:'bedroom', modelFile:'tufted-purple-trim-bed', pos:[0,-3.27], ry:0, sh:[3.1,3.0], dist:4.4, ly:0.8, hy:1.95 },
  { id:'ac-bed-3d', gallery:'ac-bed-set', name:'Upholstered bed concept', category:'bedroom', room:'bedroom', modelFile:'lift-up-storage-bed', pos:[2.9,-3.32], ry:0, sh:[2.3,2.9], dist:4.2, ly:0.8, hy:1.8 },
  { id:'ac-wardrobe-3d', gallery:'ac-wardrobe', name:'Three-door wardrobe concept', category:'wardrobes', room:'dining', modelFile:'white-mirror-wardrobe', pos:[10,-1.7], ry:Math.PI/2, sh:[2.5,1.4], dist:3.9, ly:1.0, hy:2.0 },
];
const LABEL = { living:'Living Room', bedroom:'Bedroom', headboards:'Headboards' };
export const SHOWROOM_PIECES = RAW.map((r) => {
  const g = G[r.gallery] || {};
  const { id, name, category, gallery, room, modelFile, ...cfg } = r;
  return {
    id, name, category, categoryLabel:LABEL[category], price:g.price ?? null,
    model:'glb', params:{}, glb:`/models/${modelFile}.glb`, gallery,
    photo:g.photo || null, reference:null, description:NOTE, details:[],
    showroom:{ room, ...cfg },
  };
});
