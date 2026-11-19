import { BUSINESS } from '../config.js';

const money = (n) => '$' + Number(n).toLocaleString('en-US');

// price is a number, or [min, max] for a range.
export function formatPrice(price) {
  if (price == null) return '';
  if (Array.isArray(price)) return `${money(price[0])}–${Number(price[1]).toLocaleString('en-US')}`;
  return money(price);
}

export function priceSortValue(price) {
  return Array.isArray(price) ? price[0] : price ?? 0;
}

export function whatsappLink(product) {
  const text = product
    ? `Hi ${BUSINESS.name}, I'd like to enquire about the ${product.name}.`
    : `Hi ${BUSINESS.name}, I'd like to enquire about your furniture.`;
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
}
