// =========================================================
// Store: semua data & logika bisnis.
// Tahap 1: disimpan di localStorage browser (mode demo).
// Tahap 2: fungsi-fungsi di sini diganti ke database online
// tanpa perlu mengubah tampilan.
// =========================================================
import {
  BRANCHES, CATEGORIES, PRODUCTS, VOUCHERS, DEMO_USERS, ADMIN,
  DELIVERY, POINT_RULES, TIERS, STORE_INFO,
} from './data.js';

const KEY = 'lim_store_v1';
const clone = (o) => JSON.parse(JSON.stringify(o));
const listeners = new Set();

function fresh() {
  const s = {
    v: 1,
    info: clone(STORE_INFO),
    branches: clone(BRANCHES),
    categories: clone(CATEGORIES),
    products: clone(PRODUCTS),
    vouchers: clone(VOUCHERS),
    users: clone(DEMO_USERS),
    orders: [],
    cart: [], // { id, qty }
    wishlist: [],
    branchId: 'sdm',
    session: null, // user id
    admin: false,
    recent: [],
    flashEnds: null,
    seq: 1000,
  };
  seedOrders(s);
  return s;
}

let S;
try {
  S = JSON.parse(localStorage.getItem(KEY) || 'null');
} catch (_) {
  S = null;
}
if (!S || S.v !== 1) S = fresh();

let saveTimer = null;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) { /* mode privat */ }
  }, 50);
}
function commit() {
  persist();
  listeners.forEach((fn) => fn());
}

export const store = {
  get state() { return S; },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  reset() {
    const wasAdmin = S.admin;
    S = fresh();
    S.admin = wasAdmin;
    try { localStorage.removeItem(KEY); } catch (_) {}
    commit();
  },
};

// ---------- Format ----------
const rupiahFmt = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
export const rp = (n) => rupiahFmt.format(Math.round(n || 0)).replace(/ /g, ' ');
export const num = (n) => new Intl.NumberFormat('id-ID').format(n || 0);
export const compact = (n) => {
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(1).replace('.0', '').replace('.', ',') + 'M';
  if (a >= 1e6) return (n / 1e6).toFixed(1).replace('.0', '').replace('.', ',') + 'jt';
  if (a >= 1e3) return Math.round(n / 1e3) + 'rb';
  return String(Math.round(n));
};
export const fmtDate = (iso, opt = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) =>
  new Date(iso).toLocaleString('id-ID', opt);
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- Produk ----------
export const products = () => S.products.filter((p) => p.active);
export const productById = (id) => S.products.find((p) => p.id === id);
export const categoryById = (id) => S.categories.find((c) => c.id === id);
export const branchById = (id) => S.branches.find((b) => b.id === id);
export const currentBranch = () => branchById(S.branchId) || S.branches[0];
export const priceOf = (p) => (p.promo && p.promo < p.price ? p.promo : p.price);
export const discountPct = (p) => (p.promo && p.promo < p.price ? Math.round((1 - p.promo / p.price) * 100) : 0);
export const stockAt = (p, branchId = S.branchId) => Math.max(0, (p.stock && p.stock[branchId]) || 0);
export const totalStock = (p) => Object.values(p.stock || {}).reduce((a, b) => a + Math.max(0, b), 0);

export function setBranch(id) {
  S.branchId = id;
  // sesuaikan keranjang dengan stok cabang baru
  S.cart.forEach((it) => {
    const p = productById(it.id);
    if (p) it.qty = Math.min(it.qty, stockAt(p)) || it.qty;
  });
  commit();
}

export function search(q) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  const words = t.split(/\s+/);
  return products()
    .map((p) => {
      const hay = (p.name + ' ' + (categoryById(p.cat)?.name || '')).toLowerCase();
      let score = 0;
      for (const w of words) {
        if (!hay.includes(w)) return null;
        score += hay.startsWith(w) ? 3 : 1;
      }
      return { p, score: score + p.sold / 10000 };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

export function addRecent(id) {
  S.recent = [id, ...S.recent.filter((x) => x !== id)].slice(0, 12);
  persist();
}

// ---------- Flash sale ----------
export function flashEndsAt() {
  const now = Date.now();
  if (!S.flashEnds || S.flashEnds < now) {
    // berakhir di kelipatan 3 jam berikutnya
    const d = new Date();
    const h = Math.floor(d.getHours() / 3) * 3 + 3;
    d.setHours(h, 0, 0, 0);
    S.flashEnds = d.getTime();
    persist();
  }
  return S.flashEnds;
}

// ---------- Wishlist ----------
export const inWishlist = (id) => S.wishlist.includes(id);
export function toggleWishlist(id) {
  if (inWishlist(id)) S.wishlist = S.wishlist.filter((x) => x !== id);
  else S.wishlist = [id, ...S.wishlist];
  commit();
  return inWishlist(id);
}

// ---------- Keranjang ----------
export const cartQty = (id) => S.cart.find((x) => x.id === id)?.qty || 0;
export const cartCount = () => S.cart.reduce((a, x) => a + x.qty, 0);
export function cartLines() {
  return S.cart
    .map((x) => {
      const p = productById(x.id);
      if (!p) return null;
      const unit = priceOf(p);
      return { p, qty: x.qty, unit, total: unit * x.qty, stock: stockAt(p) };
    })
    .filter(Boolean);
}
export const cartSubtotal = () => cartLines().reduce((a, l) => a + l.total, 0);
export const cartSavings = () => cartLines().reduce((a, l) => a + (l.p.price - l.unit) * l.qty, 0);

/** Mengembalikan pesan error atau null jika berhasil */
export function addToCart(id, qty = 1) {
  const p = productById(id);
  if (!p) return 'Produk tidak ditemukan';
  const have = cartQty(id);
  const max = stockAt(p);
  if (max <= 0) return `Stok habis di ${currentBranch().name}`;
  if (have + qty > max) return `Stok tersisa ${max} di ${currentBranch().name}`;
  const line = S.cart.find((x) => x.id === id);
  if (line) line.qty += qty;
  else S.cart.push({ id, qty });
  commit();
  return null;
}
export function setCartQty(id, qty) {
  const p = productById(id);
  if (!p) return;
  if (qty <= 0) S.cart = S.cart.filter((x) => x.id !== id);
  else {
    const line = S.cart.find((x) => x.id === id);
    const q = Math.min(qty, stockAt(p));
    if (line) line.qty = q;
    else S.cart.push({ id, qty: q });
  }
  commit();
}
export function clearCart() {
  S.cart = [];
  commit();
}

// ---------- Voucher & ongkir ----------
export const voucherByCode = (code) => S.vouchers.find((v) => v.code === String(code || '').trim().toUpperCase() && v.active);

/** Hitung total pesanan dari pilihan checkout */
export function quote({ method = 'pickup', express = false, voucher = null, usePoints = false } = {}) {
  const lines = cartLines();
  const subtotal = lines.reduce((a, l) => a + l.total, 0);
  const savings = lines.reduce((a, l) => a + (l.p.price - l.unit) * l.qty, 0);
  let shipping = 0;
  if (method === 'delivery') {
    shipping = subtotal >= DELIVERY.freeAbove ? 0 : DELIVERY.baseFee;
    if (express) shipping += DELIVERY.expressFee;
  }
  let discount = 0;
  let shipDiscount = 0;
  let voucherError = null;
  const v = voucher ? voucherByCode(voucher) : null;
  if (voucher && !v) voucherError = 'Kode voucher tidak ditemukan';
  else if (v) {
    const u = currentUser();
    if (subtotal < v.min) voucherError = `Minimal belanja ${rp(v.min)}`;
    else if (v.firstOnly && u && S.orders.some((o) => o.userId === u.id)) voucherError = 'Hanya untuk pesanan pertama';
    else if (v.type === 'shipping') {
      if (method !== 'delivery') voucherError = 'Hanya untuk pesanan diantar';
      else shipDiscount = Math.min(shipping, v.max || shipping);
    } else if (v.type === 'percent') discount = Math.min(Math.round((subtotal * v.value) / 100), v.max || Infinity);
    else discount = Math.min(v.value, subtotal);
  }
  const u = currentUser();
  let pointsUsed = 0;
  const before = subtotal - discount + shipping - shipDiscount;
  if (usePoints && u && u.points > 0) {
    const maxByValue = Math.floor((before * 0.5) / POINT_RULES.pointValue); // maks 50% total
    pointsUsed = Math.min(u.points, maxByValue);
  }
  const pointsValue = pointsUsed * POINT_RULES.pointValue;
  const total = Math.max(0, before - pointsValue);
  const earn = Math.floor(total / POINT_RULES.earnPer) * tierOf(u).mult;
  return {
    lines, subtotal, savings, shipping, discount, shipDiscount, pointsUsed, pointsValue, total,
    earn: Math.floor(earn), voucher: v && !voucherError ? v.code : null, voucherError,
  };
}

// ---------- Akun ----------
export const currentUser = () => S.users.find((u) => u.id === S.session) || null;
export function tierOf(u) {
  const spent = u?.spent || 0;
  let t = TIERS[0];
  for (const x of TIERS) if (spent >= x.min) t = x;
  const mult = t.id === 'platinum' ? 2 : t.id === 'gold' ? 1.5 : 1;
  const next = TIERS[TIERS.indexOf(t) + 1] || null;
  return { ...t, mult, next };
}
export function login(email, password) {
  const u = S.users.find((x) => x.email.toLowerCase() === String(email).trim().toLowerCase());
  if (!u || u.password !== password) return 'Email atau password salah';
  S.session = u.id;
  commit();
  return null;
}
export function register({ name, email, phone, password }) {
  if (!name || !email || !password) return 'Lengkapi nama, email, dan password';
  if (password.length < 6) return 'Password minimal 6 karakter';
  if (S.users.some((x) => x.email.toLowerCase() === email.trim().toLowerCase())) return 'Email sudah terdaftar';
  const u = { id: 'u' + Date.now(), name: name.trim(), email: email.trim(), phone: (phone || '').trim(), password, points: 100, spent: 0, addresses: [] };
  S.users.push(u);
  S.session = u.id;
  commit();
  return null;
}
export function logout() {
  S.session = null;
  commit();
}
export function updateProfile(patch) {
  const u = currentUser();
  if (!u) return;
  Object.assign(u, patch);
  commit();
}
export function saveAddress(addr) {
  const u = currentUser();
  if (!u) return;
  if (addr.id) {
    const i = u.addresses.findIndex((a) => a.id === addr.id);
    if (i >= 0) u.addresses[i] = addr;
  } else {
    addr.id = 'a' + Date.now();
    u.addresses.push(addr);
  }
  commit();
  return addr.id;
}
export function deleteAddress(id) {
  const u = currentUser();
  if (!u) return;
  u.addresses = u.addresses.filter((a) => a.id !== id);
  commit();
}

// ---------- Pesanan ----------
function nextOrderNo(s, date = new Date()) {
  s.seq = (s.seq || 1000) + 1;
  const d = date;
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `LIM-${ymd}-${s.seq}`;
}

export function placeOrder(opts) {
  const u = currentUser();
  if (!u) return { error: 'Silakan masuk terlebih dahulu' };
  const q = quote(opts);
  if (!q.lines.length) return { error: 'Keranjang kosong' };
  for (const l of q.lines) {
    if (l.qty > l.stock) return { error: `Stok ${l.p.name} tidak cukup di cabang ini` };
  }
  if (opts.voucher && q.voucherError) return { error: q.voucherError };
  if (opts.method === 'delivery' && !opts.address) return { error: 'Pilih alamat pengiriman' };

  const now = new Date();
  const payNow = opts.payment === 'qris' || opts.payment === 'va';
  const order = {
    id: 'o' + Date.now(),
    no: nextOrderNo(S, now),
    userId: u.id,
    customer: { name: u.name, phone: u.phone, email: u.email },
    branchId: S.branchId,
    createdAt: now.toISOString(),
    items: q.lines.map((l) => ({ id: l.p.id, name: l.p.name, price: l.unit, normal: l.p.price, cost: l.p.cost, qty: l.qty })),
    method: opts.method,
    express: !!opts.express,
    slot: opts.slot || null,
    address: opts.method === 'delivery' ? opts.address : null,
    note: opts.note || '',
    payment: opts.payment,
    voucher: q.voucher,
    subtotal: q.subtotal,
    shipping: q.shipping,
    discount: q.discount,
    shipDiscount: q.shipDiscount,
    pointsUsed: q.pointsUsed,
    pointsValue: q.pointsValue,
    total: q.total,
    earn: q.earn,
    paid: false,
    status: payNow ? 'menunggu_bayar' : 'diproses',
    history: [{ status: payNow ? 'menunggu_bayar' : 'diproses', at: now.toISOString() }],
    va: opts.payment === 'va' ? '8808' + String(Math.floor(Math.random() * 1e10)).padStart(10, '0') : null,
    payBy: payNow ? new Date(now.getTime() + 60 * 60 * 1000).toISOString() : null,
  };
  // kurangi stok cabang & poin
  for (const it of order.items) {
    const p = productById(it.id);
    p.stock[order.branchId] = Math.max(0, (p.stock[order.branchId] || 0) - it.qty);
    p.sold += it.qty;
  }
  u.points -= q.pointsUsed;
  S.orders.unshift(order);
  S.cart = [];
  commit();
  return { order };
}

export const orderById = (id) => S.orders.find((o) => o.id === id);
export const ordersOfUser = () => {
  const u = currentUser();
  return u ? S.orders.filter((o) => o.userId === u.id) : [];
};

export function payOrder(id) {
  const o = orderById(id);
  if (!o || o.paid) return;
  o.paid = true;
  o.paidAt = new Date().toISOString();
  setStatus(id, 'diproses', true);
}

export function setStatus(id, status, silent = false) {
  const o = orderById(id);
  if (!o) return;
  if (status === 'dibatalkan' && o.status !== 'dibatalkan') {
    // kembalikan stok & poin
    for (const it of o.items) {
      const p = productById(it.id);
      if (p) {
        p.stock[o.branchId] = (p.stock[o.branchId] || 0) + it.qty;
        p.sold = Math.max(0, p.sold - it.qty);
      }
    }
    const u = S.users.find((x) => x.id === o.userId);
    if (u) u.points += o.pointsUsed;
  }
  if (status === 'selesai' && o.status !== 'selesai') {
    o.paid = true;
    const u = S.users.find((x) => x.id === o.userId);
    if (u) {
      u.points += o.earn;
      u.spent += o.total;
    }
  }
  o.status = status;
  o.history.push({ status, at: new Date().toISOString() });
  if (!silent) commit();
  else commit();
}

export function cancelOrder(id) {
  const o = orderById(id);
  if (!o || !['menunggu_bayar', 'diproses'].includes(o.status)) return 'Pesanan tidak bisa dibatalkan';
  setStatus(id, 'dibatalkan');
  return null;
}

export function buyAgain(id) {
  const o = orderById(id);
  if (!o) return 0;
  let added = 0;
  for (const it of o.items) if (!addToCart(it.id, it.qty)) added++;
  return added;
}

// ---------- Admin ----------
export const isAdmin = () => !!S.admin;
export function adminLogin(user, pass) {
  if (user === ADMIN.username && pass === ADMIN.password) {
    S.admin = true;
    commit();
    return null;
  }
  return 'Username atau password admin salah';
}
export function adminLogout() {
  S.admin = false;
  commit();
}
export function saveProduct(p) {
  if (!p.id) {
    p.id = 'p' + Date.now();
    p.sold = 0;
    p.rating = 5;
    p.active = true;
    S.products.unshift(p);
  } else {
    const i = S.products.findIndex((x) => x.id === p.id);
    if (i >= 0) S.products[i] = { ...S.products[i], ...p };
  }
  commit();
  return p.id;
}
export function deleteProduct(id) {
  S.products = S.products.filter((p) => p.id !== id);
  S.cart = S.cart.filter((x) => x.id !== id);
  S.wishlist = S.wishlist.filter((x) => x !== id);
  commit();
}
export function setStock(pid, bid, qty) {
  const p = productById(pid);
  if (!p) return;
  p.stock[bid] = Math.max(0, Math.floor(qty) || 0);
  commit();
}
export function saveVoucher(v, originalCode) {
  v.code = v.code.trim().toUpperCase();
  const i = S.vouchers.findIndex((x) => x.code === (originalCode || v.code));
  if (i >= 0) S.vouchers[i] = v;
  else S.vouchers.push(v);
  commit();
}
export function deleteVoucher(code) {
  S.vouchers = S.vouchers.filter((v) => v.code !== code);
  commit();
}
export function saveInfo(patch) {
  Object.assign(S.info, patch);
  commit();
}

/** Ringkasan untuk dashboard admin */
export function analytics(days = 14, branchId = 'all') {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1));
  const prevStart = new Date(start.getTime() - days * 86400000);
  const valid = S.orders.filter((o) => o.status !== 'dibatalkan' && (branchId === 'all' || o.branchId === branchId));
  const inRange = valid.filter((o) => new Date(o.createdAt) >= start);
  const prev = valid.filter((o) => new Date(o.createdAt) >= prevStart && new Date(o.createdAt) < start);
  const sum = (arr, f) => arr.reduce((a, o) => a + f(o), 0);
  const revenue = sum(inRange, (o) => o.total);
  const prevRevenue = sum(prev, (o) => o.total);
  const profit = sum(inRange, (o) => o.items.reduce((a, it) => a + (it.price - it.cost) * it.qty, 0) - o.discount - o.pointsValue);
  const daily = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const e = new Date(d.getTime() + 86400000);
    const os = inRange.filter((o) => { const t = new Date(o.createdAt); return t >= d && t < e; });
    daily.push({ d, revenue: sum(os, (o) => o.total), online: sum(os.filter((o) => o.method === 'delivery'), (o) => o.total), pickup: sum(os.filter((o) => o.method === 'pickup'), (o) => o.total), count: os.length });
  }
  const prodMap = {};
  inRange.forEach((o) => o.items.forEach((it) => {
    prodMap[it.id] = prodMap[it.id] || { id: it.id, name: it.name, qty: 0, revenue: 0 };
    prodMap[it.id].qty += it.qty;
    prodMap[it.id].revenue += it.price * it.qty;
  }));
  const top = Object.values(prodMap).sort((a, b) => b.revenue - a.revenue).slice(0, 6);
  const byBranch = S.branches.map((b) => ({ b, revenue: sum(inRange.filter((o) => o.branchId === b.id), (o) => o.total) }));
  const byStatus = {};
  S.orders.forEach((o) => { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });
  const byPay = {};
  inRange.forEach((o) => { byPay[o.payment] = (byPay[o.payment] || 0) + o.total; });
  const customers = new Set(inRange.map((o) => o.userId)).size;
  return {
    revenue, prevRevenue, profit, count: inRange.length, prevCount: prev.length,
    aov: inRange.length ? revenue / inRange.length : 0, customers, daily, top, byBranch, byStatus, byPay,
  };
}

export function lowStock(limit = 8) {
  const rows = [];
  S.products.forEach((p) => S.branches.forEach((b) => {
    const s = p.stock[b.id] || 0;
    if (s <= 5) rows.push({ p, b, s });
  }));
  return rows.sort((a, b) => a.s - b.s).slice(0, limit);
}

// ---------- Data demo pesanan (untuk dashboard) ----------
function seedOrders(s) {
  const names = ['Budi Santoso', 'Siti Aminah', 'Andi Pratama', 'Dewi Lestari', 'Joko Susilo', 'Maya Sari', 'Rizky Hidayat', 'Putri Ayu', 'Fajar Nugroho', 'Lina Marlina', 'Agus Salim', 'Nadia Putri'];
  const demoUsers = names.map((n, i) => ({
    id: 'd' + i, name: n, email: n.toLowerCase().replace(/\s+/g, '.') + '@contoh.id', phone: '08' + (1200000000 + i * 7777777),
    password: 'demo123', points: 200 + i * 75, spent: 250000 + i * 180000, addresses: [], demo: true,
  }));
  s.users.push(...demoUsers);
  let seed = 42;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const now = new Date();
  const out = [];
  for (let d = 13; d >= 0; d--) {
    const count = 4 + Math.floor(rnd() * 6) + (d < 3 ? 2 : 0);
    for (let k = 0; k < count; k++) {
      const t = new Date(now.getFullYear(), now.getMonth(), now.getDate() - d, 7 + Math.floor(rnd() * 14), Math.floor(rnd() * 60));
      if (t > now) continue;
      const u = rnd() < 0.15 ? s.users[0] : pick(demoUsers);
      const n = 1 + Math.floor(rnd() * 4);
      const items = [];
      for (let j = 0; j < n; j++) {
        const p = pick(s.products);
        if (items.some((x) => x.id === p.id)) continue;
        const price = p.promo && rnd() < 0.6 ? p.promo : p.price;
        items.push({ id: p.id, name: p.name, price, normal: p.price, cost: p.cost, qty: 1 + Math.floor(rnd() * 3) });
      }
      const subtotal = items.reduce((a, it) => a + it.price * it.qty, 0);
      const method = rnd() < 0.55 ? 'delivery' : 'pickup';
      const shipping = method === 'delivery' && subtotal < DELIVERY.freeAbove ? DELIVERY.baseFee : 0;
      const total = subtotal + shipping;
      const age = (now - t) / 3600000;
      let status = 'selesai';
      if (age < 2) status = pick(['menunggu_bayar', 'diproses']);
      else if (age < 8) status = method === 'delivery' ? pick(['diproses', 'dikirim']) : pick(['diproses', 'siap_diambil']);
      else if (rnd() < 0.06) status = 'dibatalkan';
      s.seq = (s.seq || 1000) + 1;
      const ymd = `${String(t.getFullYear()).slice(2)}${String(t.getMonth() + 1).padStart(2, '0')}${String(t.getDate()).padStart(2, '0')}`;
      out.push({
        id: 'o' + t.getTime() + k, no: `LIM-${ymd}-${s.seq}`, userId: u.id,
        customer: { name: u.name, phone: u.phone, email: u.email },
        branchId: pick(s.branches).id, createdAt: t.toISOString(), items, method, express: false,
        slot: method === 'pickup' ? 'Secepatnya' : null,
        address: method === 'delivery' ? { label: 'Rumah', name: u.name, phone: u.phone, detail: 'Alamat pelanggan (demo)' } : null,
        note: '', payment: pick(['qris', 'qris', 'va', method === 'pickup' ? 'store' : 'cod']), voucher: null,
        subtotal, shipping, discount: 0, shipDiscount: 0, pointsUsed: 0, pointsValue: 0, total,
        earn: Math.floor(total / 1000), paid: status !== 'menunggu_bayar', status,
        history: [{ status, at: t.toISOString() }], demo: true,
      });
    }
  }
  s.orders = out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
