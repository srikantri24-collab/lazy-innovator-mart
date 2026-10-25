// =========================================================
// Komponen UI: ikon, gambar kemasan produk (SVG), kartu produk,
// toast, modal, QR demo.
// =========================================================
import {
  rp, esc, priceOf, discountPct, stockAt, inWishlist, cartQty, categoryById,
} from './store.js';

// ---------- Ikon (stroke, 24x24) ----------
const P = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  cart: '<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>',
  heart: '<path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5c-2.2 4.6-9.2 9-9.2 9z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  store: '<path d="M4 10v10h16V10"/><path d="M3 4h18l-1.5 6a3 3 0 0 1-5.5 1 3 3 0 0 1-5 0A3 3 0 0 1 4.5 10z"/><path d="M10 20v-5h4v5"/>',
  truck: '<path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  chevR: '<path d="m9 6 6 6-6 6"/>',
  chevD: '<path d="m6 9 6 6 6-6"/>',
  arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
  ticket: '<path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 0 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 1 0-4V6H3z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  gift: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13"/><path d="M12 8S10.5 3 8 4s0 4 4 4zM12 8s1.5-5 4-4 0 4-4 4z"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v7h-6"/>',
  bank: '<path d="M3 10 12 4l9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  chat: '<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.3A8.5 8.5 0 1 1 21 12z"/>',
  filter: '<path d="M4 5h16l-6 8v6l-4-2v-4z"/>',
  logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11"/>',
  box: '<path d="M21 8 12 3 3 8l9 5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 20a6.5 6.5 0 0 0-2.5-5.2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  // ikon kategori
  cookie: '<circle cx="12" cy="12" r="9"/><path d="M8.5 9h.01M14 8h.01M15.5 13.5h.01M9.5 15h.01M12 12h.01"/>',
  cup: '<path d="M6 8h11l-1.2 11a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8z"/><path d="M5 8h13M12 8l2-5h3"/>',
  wheat: '<path d="M12 22V9"/><path d="M12 13c-3 0-4-2-4-4 2 0 4 1 4 4zM12 13c3 0 4-2 4-4-2 0-4 1-4 4zM12 9c-3 0-4-2-4-4 2 0 4 1 4 4zM12 9c3 0 4-2 4-4-2 0-4 1-4 4zM12 5c0-1.5.5-2.5 0-3-.5.5 0 1.5 0 3z"/>',
  bowl: '<path d="M3 12h18a9 9 0 0 1-18 0z"/><path d="M8 4v4M12 3v5M16 4v4"/>',
  milk: '<path d="M8 3h8v3l2 3v12H6V9l2-3z"/><path d="M6 13h12"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19 13 11"/>',
  snow: '<path d="M12 2v20M4 6l16 12M20 6 4 18"/><path d="m9 3 3 2 3-2M9 21l3-2 3 2"/>',
  sparkle: '<path d="M12 3c.6 4.2 2.3 6 6 6.5-3.7.6-5.4 2.3-6 6.5-.6-4.2-2.3-5.9-6-6.5 3.7-.5 5.4-2.3 6-6.5z"/><path d="M19 15c.3 1.8 1 2.6 2.5 3-1.5.3-2.2 1.1-2.5 3-.3-1.9-1-2.7-2.5-3 1.5-.4 2.2-1.2 2.5-3z"/>',
  spray: '<path d="M8 10h7v11H8z"/><path d="M9 10V6h5v4M14 6h2l1-2M18 7h2M18 4h2"/>',
  baby: '<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0"/><path d="M12 3c-1 1.5-1 2.5 0 3"/>',
};
export function icon(name, size = 20, stroke = 2) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
}

export function logo(size = 42) {
  return `<svg class="logo-mark" width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true">
    <rect width="48" height="48" rx="13" fill="#0E9F6E"/>
    <path d="M13 18h22l-2 18a3 3 0 0 1-3 2.7H18A3 3 0 0 1 15 36z" fill="#fff"/>
    <path d="M18.5 18v-2.5a5.5 5.5 0 0 1 11 0V18" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <path d="M25.5 22 19.5 30h4.5l-1.5 6 6.5-8.5h-4.6z" fill="#FF7A1A"/>
  </svg>`;
}

// ---------- Gambar kemasan produk (SVG) ----------
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}
function isLight(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 170;
}

let uid = 0;
export function packshot(p, { bg = true } = {}) {
  const img = p.img || { s: 'box', c: '#0E9F6E', a: '#FFFFFF', t: (p.name || '').split(' ')[0].toUpperCase().slice(0, 8) };
  const c = img.c, a = img.a, t = esc(img.t || '');
  const dark = shade(c, -40), light = shade(c, 40);
  const txt = isLight(c) ? '#1F2937' : '#FFFFFF';
  const id = 'g' + (++uid);
  const cat = categoryById(p.cat);
  const bgc = cat ? cat.bg : '#F3F4F6';
  const label = (y, size = 15) => `<text x="100" y="${y}" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="${size}" fill="${txt}" letter-spacing="1">${t}</text>`;
  const band = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${a}" opacity=".95"/>`;
  const gloss = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2}" fill="#fff" opacity=".22"/>`;
  let body = '';
  switch (img.s) {
    case 'bottle':
      body = `<rect x="88" y="34" width="24" height="14" rx="3" fill="${dark}"/>
        <path d="M84 50h32l6 18v92a10 10 0 0 1-10 10H88a10 10 0 0 1-10-10V68z" fill="url(#${id})"/>
        ${band(78, 92, 44, 40)}<text x="100" y="117" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="10" fill="${c}">${t}</text>${gloss(84, 70, 6, 80)}`;
      break;
    case 'can':
      body = `<ellipse cx="100" cy="46" rx="32" ry="8" fill="${shade(c, 70)}"/>
        <path d="M68 46h64v110c0 5-14 9-32 9s-32-4-32-9z" fill="url(#${id})"/>
        ${band(68, 92, 64, 30)}<text x="100" y="112" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="13" fill="${c}">${t}</text>${gloss(74, 52, 7, 96)}`;
      break;
    case 'bag':
      body = `<path d="M58 40h84l-4 10 6 10-6 92 4 12H58l4-12-6-92 6-10z" fill="url(#${id})"/>
        <path d="M58 40h84M58 164h84" stroke="${dark}" stroke-width="4" stroke-dasharray="4 3"/>
        <ellipse cx="100" cy="112" rx="34" ry="26" fill="${a}"/>${label(117, 14)}${gloss(66, 60, 8, 70)}`;
      break;
    case 'pack':
      body = `<rect x="52" y="52" width="96" height="104" rx="10" fill="url(#${id})"/>
        <path d="M52 66h96M52 142h96" stroke="${dark}" stroke-width="3" stroke-dasharray="3 3" opacity=".5"/>
        <rect x="64" y="86" width="72" height="40" rx="20" fill="${a}"/>${label(111, 13)}`;
      break;
    case 'box':
      body = `<path d="M60 52 76 38h76l-16 14z" fill="${light}"/><path d="M136 52l16-14v110l-16 14z" fill="${dark}"/>
        <rect x="60" y="52" width="76" height="110" rx="4" fill="url(#${id})"/>
        ${band(64, 92, 68, 32)}<text x="98" y="113" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="11" fill="${c}">${t}</text>`;
      break;
    case 'carton':
      body = `<path d="M70 52 82 34h40l12 18z" fill="${light}"/><rect x="96" y="26" width="12" height="10" rx="2" fill="${a}"/>
        <rect x="70" y="52" width="64" height="112" rx="5" fill="url(#${id})"/>
        <path d="M70 120c16-10 32 10 64 0v44H70z" fill="${a}" opacity=".95"/>${label(96, 14)}`;
      break;
    case 'jar':
      body = `<rect x="70" y="42" width="60" height="18" rx="5" fill="${dark}"/>
        <rect x="64" y="58" width="72" height="104" rx="18" fill="url(#${id})"/>
        <rect x="70" y="88" width="60" height="42" rx="6" fill="${a}"/><text x="100" y="114" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="12" fill="${c}">${t}</text>${gloss(70, 64, 7, 80)}`;
      break;
    case 'sack':
      body = `<path d="M60 48c10-8 70-8 80 0l6 104c-10 14-82 14-92 0z" fill="url(#${id})" stroke="#D6D3D1" stroke-width="2"/>
        <path d="M70 46c8 6 52 6 60 0" stroke="#A8A29E" stroke-width="3" fill="none"/>
        <rect x="68" y="88" width="64" height="44" rx="8" fill="${a}"/><text x="100" y="116" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="14" fill="#fff">${t}</text>
        <text x="100" y="146" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="11" fill="${a}">5 KG</text>`;
      break;
    case 'pouch':
      body = `<path d="M66 40h68l4 116c-14 10-62 10-76 0z" fill="url(#${id})"/><rect x="112" y="40" width="14" height="14" rx="3" fill="${dark}"/>
        <ellipse cx="100" cy="108" rx="28" ry="22" fill="${a}"/>${label(113, 11)}${gloss(72, 56, 6, 80)}`;
      break;
    case 'bar':
      body = `<g transform="rotate(-12 100 100)"><rect x="40" y="76" width="120" height="52" rx="6" fill="url(#${id})"/>
        <rect x="40" y="76" width="30" height="52" rx="6" fill="${dark}"/>
        <rect x="80" y="90" width="70" height="24" rx="5" fill="${a}"/><text x="115" y="107" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="12" fill="${c}">${t}</text></g>`;
      break;
    case 'eggs':
      body = `<rect x="44" y="118" width="112" height="36" rx="8" fill="#D6D3D1"/>
        ${[60, 82, 104, 126, 148].map((x, i) => `<ellipse cx="${x - 4}" cy="${112 - (i % 2) * 6}" rx="13" ry="17" fill="${i % 2 ? '#FFF7ED' : c}"/>`).join('')}
        <rect x="64" y="130" width="72" height="16" rx="4" fill="${a}"/><text x="100" y="142" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="10" fill="#fff">${t}</text>`;
      break;
    case 'fruit':
      body = `<circle cx="78" cy="112" r="30" fill="url(#${id})"/><circle cx="122" cy="112" r="30" fill="${shade(c, -15)}"/><circle cx="100" cy="86" r="30" fill="url(#${id})"/>
        <path d="M100 56c2-8 8-12 14-12-2 6-6 10-14 12z" fill="${a}"/>${gloss(86, 70, 7, 22)}
        <rect x="68" y="146" width="64" height="18" rx="5" fill="#fff"/><text x="100" y="159" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="10" fill="${shade(c, -50)}">${t}</text>`;
      break;
    case 'leafy':
      body = `<path d="M100 160c-30-20-44-60-30-100 14 18 30 50 30 100zM100 160c30-20 44-60 30-100-14 18-30 50-30 100zM100 160c-8-40-4-80 0-110 4 30 8 70 0 110z" fill="url(#${id})"/>
        <path d="M100 160V60" stroke="${a}" stroke-width="3"/><rect x="74" y="140" width="52" height="16" rx="4" fill="#fff"/><text x="100" y="152" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="10" fill="${c}">${t}</text>`;
      break;
    case 'frozen':
      body = `<rect x="46" y="58" width="108" height="92" rx="10" fill="url(#${id})"/>
        <path d="M46 72h108" stroke="#fff" stroke-width="2" opacity=".5"/>
        <rect x="58" y="86" width="84" height="38" rx="8" fill="${a}"/><text x="100" y="110" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="13" fill="${c}">${t}</text>
        <g stroke="#fff" stroke-width="2" opacity=".85"><path d="M134 132v12M128 138h12M130 134l8 8M138 134l-8 8"/></g>`;
      break;
    case 'tub':
      body = `<ellipse cx="100" cy="62" rx="46" ry="12" fill="${shade(a, -20)}"/>
        <path d="M54 62h92l-8 90c-1 6-18 10-38 10s-37-4-38-10z" fill="url(#${id})"/>
        <rect x="64" y="92" width="72" height="34" rx="8" fill="${a}"/><text x="100" y="114" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="11" fill="#fff">${t}</text>`;
      break;
    case 'cup':
      body = `<rect x="56" y="56" width="88" height="14" rx="4" fill="${a}"/>
        <path d="M60 70h80l-10 88H70z" fill="url(#${id})" stroke="#E5E7EB" stroke-width="2"/>
        <rect x="70" y="98" width="60" height="30" rx="6" fill="${a}"/><text x="100" y="118" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="11" fill="#fff">${t}</text>`;
      break;
    case 'pump':
      body = `<path d="M92 26h26v8h-14v12h-12z" fill="${dark}"/><rect x="90" y="44" width="20" height="12" fill="${dark}"/>
        <rect x="68" y="56" width="64" height="106" rx="14" fill="url(#${id})"/>
        ${band(68, 94, 64, 34)}<text x="100" y="116" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="12" fill="${c}">${t}</text>${gloss(74, 62, 6, 84)}`;
      break;
    case 'tube':
      body = `<rect x="86" y="146" width="28" height="16" rx="3" fill="${dark}"/>
        <path d="M72 36h56l-6 112H78z" fill="url(#${id})"/><rect x="72" y="36" width="56" height="8" fill="${dark}"/>
        <rect x="78" y="78" width="44" height="44" rx="22" fill="${a}"/><text x="100" y="104" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="9" fill="${c}">${t}</text>`;
      break;
    case 'paste':
      body = `<g transform="rotate(-20 100 100)"><path d="M40 84h104l14 8v20l-14 8H40z" fill="url(#${id})" stroke="#D1D5DB" stroke-width="2"/>
        <rect x="158" y="94" width="14" height="16" rx="2" fill="${a}"/><rect x="58" y="92" width="64" height="20" rx="5" fill="${a}"/>
        <text x="90" y="106" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="10" fill="#fff">${t}</text></g>`;
      break;
    case 'tissue':
      body = `<rect x="46" y="74" width="108" height="78" rx="10" fill="url(#${id})"/>
        <path d="M84 74c4-18 28-18 32 0" fill="#fff" stroke="#E5E7EB" stroke-width="2"/>
        <rect x="62" y="102" width="76" height="28" rx="6" fill="${a}"/><text x="100" y="121" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="12" fill="${c}">${t}</text>`;
      break;
    case 'bread':
      body = `<path d="M50 96c0-30 100-30 100 0v56a8 8 0 0 1-8 8H58a8 8 0 0 1-8-8z" fill="url(#${id})"/>
        <path d="M58 98c0-20 84-20 84 0v52H58z" fill="${a}"/>
        <rect x="64" y="112" width="72" height="24" rx="6" fill="${c}"/><text x="100" y="129" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="12" fill="#fff">${t}</text>`;
      break;
    default:
      body = `<rect x="56" y="48" width="88" height="112" rx="12" fill="url(#${id})"/>${label(108)}`;
  }
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${esc(p.name)}" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${light}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs>
    ${bg ? `<rect width="200" height="200" fill="${bgc}"/><circle cx="160" cy="40" r="46" fill="#fff" opacity=".45"/><ellipse cx="100" cy="174" rx="58" ry="8" fill="#000" opacity=".08"/>` : ''}
    ${body}
  </svg>`;
}

// ---------- Kartu produk ----------
export function productCard(p, { flash = false } = {}) {
  const price = priceOf(p);
  const disc = discountPct(p);
  const stock = stockAt(p);
  const inCart = cartQty(p.id);
  const wish = inWishlist(p.id);
  const ribbons = [];
  if (stock <= 0) ribbons.push('<span class="r-out">HABIS</span>');
  else if (p.tags.includes('flash') && p.promo) ribbons.push('<span class="r-flash">FLASH SALE</span>');
  else if (p.tags.includes('new')) ribbons.push('<span class="r-new">BARU</span>');
  else if (p.tags.includes('best')) ribbons.push('<span class="r-best">TERLARIS</span>');
  const flashBar = flash ? (() => {
    const total = Math.max(stock + Math.floor(p.sold / 20), 1);
    const pct = Math.min(96, Math.round((1 - stock / total) * 100));
    return `<div class="xs bold" style="color:var(--accent-600);margin-top:4px">${stock <= 5 ? 'Segera habis!' : `Terjual ${pct}%`}</div><div class="stockbar"><i style="width:${pct}%"></i></div>`;
  })() : '';
  const action = stock <= 0
    ? `<button class="btn btn-outline btn-sm btn-block add" disabled>Stok habis</button>`
    : inCart
      ? `<div class="qty-mini"><button data-dec="${p.id}" aria-label="Kurangi">−</button><span>${inCart}</span><button data-inc="${p.id}" aria-label="Tambah">+</button></div>`
      : `<button class="btn btn-primary btn-sm btn-block add" data-add="${p.id}">${icon('plus', 16, 2.5)} Keranjang</button>`;
  return `<article class="pcard" data-pid="${p.id}" data-flash="${flash ? 1 : 0}">
    <button class="wish ${wish ? 'on' : ''}" data-wish="${p.id}" aria-label="${wish ? 'Hapus dari' : 'Tambah ke'} wishlist">${wish ? icon('heart', 18).replace('fill="none"', 'fill="currentColor"') : icon('heart', 18)}</button>
    <div class="ribbon">${ribbons.join('')}</div>
    <a class="media" href="#/produk/${p.id}" aria-label="${esc(p.name)}">${packshot(p)}</a>
    <div class="body">
      <a class="name" href="#/produk/${p.id}">${esc(p.name)}</a>
      <div class="price">${rp(price)}</div>
      <div class="old">${disc ? `<span class="disc">-${disc}%</span><span class="strike">${rp(p.price)}</span>` : ''}</div>
      <div class="meta"><span class="stars">${icon('star', 13).replace('fill="none"', 'fill="currentColor"')} ${p.rating.toFixed(1)}</span><span>${p.sold >= 1000 ? (p.sold / 1000).toFixed(1).replace('.', ',') + 'rb' : p.sold} terjual</span></div>
      ${flashBar}
      ${action}
    </div>
  </article>`;
}

// ---------- Toast ----------
export function toast(msg, opts = {}) {
  let box = document.querySelector('.toasts');
  if (!box) {
    box = document.createElement('div');
    box.className = 'toasts';
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    document.body.appendChild(box);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${opts.icon ? icon(opts.icon, 18) : ''}<span>${msg}</span>${opts.link ? `<a href="${opts.link.href}">${opts.link.text}</a>` : ''}`;
  box.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; }, opts.ms || 2600);
  setTimeout(() => el.remove(), (opts.ms || 2600) + 350);
}

// ---------- Modal ----------
export function modal({ title, body, foot = '', wide = false, onMount }) {
  closeModal();
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}" style="${wide ? 'max-width:720px' : ''}">
    <div class="modal-head"><h3>${title}</h3><button class="icon-btn" data-close aria-label="Tutup">${icon('x')}</button></div>
    <div class="modal-body">${body}</div>${foot ? `<div class="modal-foot">${foot}</div>` : ''}</div>`;
  ov.addEventListener('click', (e) => { if (e.target === ov || e.target.closest('[data-close]')) closeModal(); });
  document.body.appendChild(ov);
  document.body.style.overflow = 'hidden';
  const first = ov.querySelector('input, select, textarea, button:not([data-close])');
  if (first) setTimeout(() => first.focus(), 30);
  if (onMount) onMount(ov);
  return ov;
}
export function closeModal() {
  document.querySelectorAll('.overlay').forEach((o) => o.remove());
  document.body.style.overflow = '';
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ---------- QR demo (bukan QR sungguhan) ----------
export function demoQR(seedText, size = 29) {
  let h = 0;
  for (const ch of seedText) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
  const cells = [];
  const finder = (x, y) => (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    if (finder(x, y)) continue;
    if (rnd() < 0.48) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
  }
  const f = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#111"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#111"/>`;
  const m = size / 2 - 3;
  return `<svg viewBox="-2 -2 ${size + 4} ${size + 4}" role="img" aria-label="QR code demo" shape-rendering="crispEdges">
    <rect x="-2" y="-2" width="${size + 4}" height="${size + 4}" fill="#fff"/><g fill="#111">${cells.join('')}</g>
    ${f(0, 0)}${f(size - 7, 0)}${f(0, size - 7)}
    <rect x="${m}" y="${m}" width="6" height="6" rx="1.2" fill="#0E9F6E"/>
  </svg>`;
}

export function statusPill(status, label) {
  return `<span class="status st-${status}">${label}</span>`;
}

export function emptyState(ic, title, text, action = '') {
  return `<div class="empty"><div class="ic">${icon(ic, 38, 1.8)}</div><h3>${title}</h3><p class="muted">${text}</p>${action}</div>`;
}
