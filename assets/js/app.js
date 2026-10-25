// =========================================================
// App: router, header, footer, navigasi bawah, event global
// =========================================================
import * as st from './store.js';
import { esc, rp } from './store.js';
import { icon, logo, packshot, productCard, toast } from './ui.js';
import * as shop from './shop.js';
import { admin } from './admin.js';

const S = () => st.store.state;
const $ = (sel, root = document) => root.querySelector(sel);

const ROUTES = {
  '': shop.home,
  kategori: shop.catalog,
  cari: shop.catalog,
  produk: shop.product,
  keranjang: shop.cart,
  checkout: shop.checkout,
  pesanan: shop.order,
  akun: shop.account,
  masuk: shop.auth,
  wishlist: shop.wishlist,
  promo: shop.promo,
  toko: shop.stores,
  admin,
};

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, qs = ''] = raw.split('?');
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  return { name: parts[0] || '', params: parts.slice(1), query: new URLSearchParams(qs), key: raw };
}

let cleanup = null;
let lastKey = null;
let patchOnly = false;

function render() {
  const ctx = parseHash();
  const viewFn = ROUTES[ctx.name] || shop.notFound;
  if (cleanup) { try { cleanup(); } catch (_) {} cleanup = null; }
  const view = viewFn(ctx) || { html: '' };
  const isAdmin = view.layout === 'admin';
  document.body.classList.toggle('is-admin', isAdmin);
  $('#app-header').hidden = isAdmin;
  $('#app-footer').hidden = isAdmin;
  $('#bottom-nav').hidden = isAdmin;
  if (!isAdmin) renderHeader(ctx);
  const main = $('#view');
  main.innerHTML = view.html;
  if (view.mount) cleanup = view.mount(main, rerender) || null;
  if (ctx.key !== lastKey) {
    const samePage = lastKey !== null && lastKey.split('?')[0] === ctx.key.split('?')[0] && ctx.name === 'kategori';
    if (!samePage) window.scrollTo(0, 0);
    lastKey = ctx.key;
    document.title = titleFor(ctx);
  }
  updateBottomNav(ctx);
}
function rerender() {
  const y = window.scrollY;
  render();
  window.scrollTo(0, y);
}
function titleFor(ctx) {
  const n = S().info.name;
  const map = { '': `${n} — ${S().info.tagline}`, kategori: 'Produk', cari: 'Pencarian', keranjang: 'Keranjang', checkout: 'Checkout', pesanan: 'Detail pesanan', akun: 'Akun saya', masuk: 'Masuk', wishlist: 'Wishlist', promo: 'Promo & voucher', toko: 'Cabang toko', admin: 'Admin' };
  if (ctx.name === 'produk') { const p = st.productById(ctx.params[0]); if (p) return `${p.name} | ${n}`; }
  if (ctx.name === 'kategori' && ctx.params[0]) { const c = st.categoryById(ctx.params[0]); if (c) return `${c.name} | ${n}`; }
  return ctx.name === '' ? map[''] : `${map[ctx.name] || 'Halaman'} | ${n}`;
}

// ---------------- Header ----------------
function renderHeader(ctx) {
  const u = st.currentUser();
  const br = st.currentBranch();
  const cartN = st.cartCount();
  const wishN = S().wishlist.length;
  const q = ctx.name === 'cari' ? ctx.query.get('q') || '' : '';
  const activeCat = ctx.name === 'kategori' ? ctx.params[0] : null;
  const searchFocused = document.activeElement && document.activeElement.id === 'searchInput';
  if (searchFocused) { updateBadges(); return; }
  $('#app-header').innerHTML = `
    <div class="topbar"><div class="container">
      <span>${icon('truck', 14)} Gratis ongkir min. ${st.compact(150000)} · Ambil di toko siap ±30 menit</span>
      <div class="tb-links"><a href="#/toko">Cabang toko</a><a href="#/promo">Promo</a><a href="https://wa.me/${esc(S().info.whatsapp)}" target="_blank" rel="noopener">Bantuan ${esc(S().info.phoneDisplay)}</a><a href="#/admin">Admin</a></div>
    </div></div>
    <header class="header">
      <div class="container header-main">
        <a class="logo" href="#/" aria-label="${esc(S().info.name)} beranda">${logo()}<span class="logo-text"><b>${esc(S().info.name)}</b><span>${esc(S().info.tagline)}</span></span></a>
        <button class="branch-btn" data-open-branch aria-label="Pilih toko">${icon('pin', 18)}<span><span class="lbl" style="display:block">Belanja dari</span><span class="val" data-branch-name>${esc(br.name)}</span></span>${icon('chevD', 16)}</button>
        <form class="search" id="searchForm" role="search">
          <span class="s-icon">${icon('search', 18)}</span>
          <input id="searchInput" type="search" placeholder="Cari beras, susu, minyak goreng…" value="${esc(q)}" autocomplete="off" aria-label="Cari produk" aria-autocomplete="list" aria-controls="suggest">
          <button class="s-go" aria-label="Cari">${icon('search', 18)}</button>
          <div class="suggest" id="suggest" hidden role="listbox"></div>
        </form>
        <div class="header-actions">
          <a class="icon-btn" href="#/wishlist" aria-label="Wishlist">${icon('heart', 22)}<span class="badge-dot" data-wish-count ${wishN ? '' : 'hidden'}>${wishN}</span></a>
          <a class="icon-btn" href="#/keranjang" aria-label="Keranjang">${icon('cart', 22)}<span class="badge-dot" data-cart-count ${cartN ? '' : 'hidden'}>${cartN}</span></a>
          ${u ? `<a class="account-btn" href="#/akun"><span class="avatar">${esc(shop.initials(u.name))}</span><span class="hide-sm" style="text-align:left;line-height:1.2"><span class="xs muted" style="display:block">${st.tierOf(u).name} · ${st.num ? st.num(u.points) : u.points} poin</span><b class="small">${esc(u.name.split(' ')[0])}</b></span></a>`
            : `<a class="btn btn-outline btn-sm" href="#/masuk">Masuk</a><a class="btn btn-primary btn-sm" href="#/masuk?daftar=1" style="margin-left:6px">Daftar</a>`}
        </div>
      </div>
      <nav class="catnav" aria-label="Kategori"><div class="container">
        <a href="#/promo" class="hot">${icon('bolt', 14)} Promo</a>
        ${S().categories.map((c) => `<a href="#/kategori/${c.id}" class="${activeCat === c.id ? 'active' : ''}">${c.name}</a>`).join('')}
      </div></nav>
    </header>`;
  bindSearch();
}
function updateBadges() {
  const cartN = st.cartCount();
  const wishN = S().wishlist.length;
  document.querySelectorAll('[data-cart-count]').forEach((b) => { b.textContent = cartN; b.hidden = !cartN; });
  document.querySelectorAll('[data-wish-count]').forEach((b) => { b.textContent = wishN; b.hidden = !wishN; });
  document.querySelectorAll('[data-branch-name]').forEach((b) => { b.textContent = st.currentBranch().name; });
}

function bindSearch() {
  const form = $('#searchForm');
  const input = $('#searchInput');
  const box = $('#suggest');
  let active = -1;
  const show = () => {
    const q = input.value.trim();
    if (q.length < 2) { box.hidden = true; return; }
    const res = st.search(q).slice(0, 6);
    active = -1;
    box.innerHTML = res.map((p) => `<a href="#/produk/${p.id}" role="option"><span class="thumb">${packshot(p)}</span><span class="grow">${esc(p.name)}</span><b class="small">${rp(st.priceOf(p))}</b></a>`).join('')
      + `<a href="#/cari?q=${encodeURIComponent(q)}" role="option"><span class="thumb" style="display:flex;align-items:center;justify-content:center;background:var(--bg)">${icon('search', 18)}</span><span>Cari “<b>${esc(q)}</b>”</span></a>`;
    box.hidden = false;
  };
  input.addEventListener('input', show);
  input.addEventListener('focus', show);
  input.addEventListener('keydown', (e) => {
    const items = [...box.querySelectorAll('a')];
    if (!items.length || box.hidden) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items.forEach((a, i) => a.classList.toggle('active', i === active));
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      location.hash = items[active].getAttribute('href');
      box.hidden = true;
      input.blur();
    } else if (e.key === 'Escape') box.hidden = true;
  });
  document.addEventListener('click', (e) => { if (!form.contains(e.target)) box.hidden = true; }, { once: false });
  box.addEventListener('click', () => { box.hidden = true; input.blur(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    box.hidden = true;
    input.blur();
    if (q) location.hash = '#/cari?q=' + encodeURIComponent(q);
  });
}

// ---------------- Footer & bottom nav ----------------
function renderFooter() {
  const i = S().info;
  $('#app-footer').innerHTML = `<footer class="footer"><div class="container">
    <div class="footer-grid">
      <div class="stack" style="gap:10px">
        <div class="logo">${logo(40)}<span class="logo-text"><b style="color:#fff">${esc(i.name)}</b><span>${esc(i.tagline)}</span></span></div>
        <p class="small">Minimarket modern dengan ${S().branches.length} cabang. Belanja online, ambil di toko atau diantar ke rumah.</p>
        <div class="pay-chips"><span>QRIS</span><span>Virtual Account</span><span>Bayar di kasir</span><span>COD</span></div>
      </div>
      <div><h4>Belanja</h4><ul><li><a href="#/kategori">Semua produk</a></li><li><a href="#/promo">Promo & voucher</a></li><li><a href="#/kategori/segar">Buah & sayur</a></li><li><a href="#/wishlist">Wishlist</a></li></ul></div>
      <div><h4>Layanan</h4><ul><li><a href="#/toko">Cabang toko</a></li><li><a href="#/akun/pesanan">Lacak pesanan</a></li><li><a href="#/akun">Member & poin</a></li><li><a href="#/admin">Panel admin</a></li></ul></div>
      <div><h4>Hubungi kami</h4><ul><li><a href="https://wa.me/${esc(i.whatsapp)}" target="_blank" rel="noopener">${icon('chat', 14)} WhatsApp ${esc(i.phoneDisplay)}</a></li><li><a href="mailto:${esc(i.email)}">${esc(i.email)}</a></li><li>Setiap hari 07.00–22.00</li></ul></div>
    </div>
    <div class="legal"><span>© ${new Date().getFullYear()} ${esc(i.name)}. Website demo.</span><span>Dibuat oleh Tim Kasir Pro · ${esc(i.phoneDisplay)}</span></div>
  </div></footer>`;
}
function renderBottomNav() {
  $('#bottom-nav').innerHTML = `<nav aria-label="Navigasi utama">
    <a href="#/" data-bn="">${icon('home', 22)}Beranda</a>
    <a href="#/kategori" data-bn="kategori">${icon('grid', 22)}Kategori</a>
    <a href="#/promo" data-bn="promo">${icon('tag', 22)}Promo</a>
    <a href="#/keranjang" data-bn="keranjang">${icon('cart', 22)}Keranjang<span class="badge-dot" data-cart-count hidden></span></a>
    <a href="#/akun" data-bn="akun">${icon('user', 22)}Akun</a>
  </nav>`;
}
function updateBottomNav(ctx) {
  const name = ctx.name === 'cari' || ctx.name === 'produk' ? 'kategori' : ctx.name === 'masuk' || ctx.name === 'pesanan' ? 'akun' : ctx.name;
  document.querySelectorAll('[data-bn]').forEach((a) => a.classList.toggle('on', a.dataset.bn === name));
  updateBadges();
}

// ---------------- Event global ----------------
function patchCards(id) {
  const p = st.productById(id);
  if (!p) return;
  document.querySelectorAll(`.pcard[data-pid="${id}"]`).forEach((el) => {
    el.outerHTML = productCard(p, { flash: el.dataset.flash === '1' });
  });
  updateBadges();
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-add],[data-inc],[data-dec],[data-wish],[data-copy],[data-branch],[data-open-branch]');
  if (!t) return;
  const inCard = !!t.closest('.pcard');
  const d = t.dataset;
  if (d.openBranch !== undefined) { e.preventDefault(); shop.branchPicker(); return; }
  if (d.branch) { st.setBranch(d.branch); toast(`Belanja dari ${esc(st.currentBranch().name)}`, { icon: 'store' }); return; }
  if (d.copy) {
    e.preventDefault();
    const done = () => toast(`${esc(d.copy)} disalin`, { icon: 'copy' });
    if (navigator.clipboard) navigator.clipboard.writeText(d.copy).then(done, done); else done();
    return;
  }
  e.preventDefault();
  if (inCard) patchOnly = true;
  if (d.add) {
    const err = st.addToCart(d.add, 1);
    if (err) { patchOnly = false; toast(err, { icon: 'x' }); }
    else toast('Masuk keranjang', { icon: 'check', link: { href: '#/keranjang', text: 'Lihat' }, ms: 1800 });
    if (inCard) patchCards(d.add);
  } else if (d.inc) {
    const err = st.addToCart(d.inc, 1);
    if (err) { patchOnly = false; toast(err, { icon: 'x' }); }
    if (inCard) patchCards(d.inc);
  } else if (d.dec) {
    st.setCartQty(d.dec, st.cartQty(d.dec) - 1);
    if (inCard) patchCards(d.dec);
  } else if (d.wish) {
    const on = st.toggleWishlist(d.wish);
    toast(on ? 'Disimpan ke wishlist' : 'Dihapus dari wishlist', { icon: 'heart', ms: 1600 });
    if (inCard) patchCards(d.wish);
  }
});

st.store.subscribe(() => {
  if (patchOnly) { patchOnly = false; updateBadges(); return; }
  rerender();
  renderFooter();
});

window.addEventListener('hashchange', render);
renderFooter();
renderBottomNav();
render();
