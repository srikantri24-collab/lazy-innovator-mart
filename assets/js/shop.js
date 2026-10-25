// =========================================================
// Halaman pelanggan
// =========================================================
import * as st from './store.js';
import { rp, esc, num, fmtDate } from './store.js';
import { STATUS, TIERS, DELIVERY, POINT_RULES } from './data.js';
import {
  icon, packshot, productCard, toast, modal, closeModal, demoQR, statusPill, emptyState, logo,
} from './ui.js';

const S = () => st.store.state;
const go = (h) => { location.hash = h; };
const catIcon = (c, size = 26) => `<div class="ic" style="background:${c.bg};color:${c.color}">${icon(c.icon, size)}</div>`;

// ---------------------------------------------------------
// BERANDA
// ---------------------------------------------------------
export function home() {
  const ps = st.products();
  const flash = ps.filter((p) => p.tags.includes('flash') && p.promo);
  const best = [...ps].sort((a, b) => b.sold - a.sold).slice(0, 12);
  const fresh = ps.filter((p) => p.tags.includes('new'));
  const recent = S().recent.map(st.productById).filter(Boolean).slice(0, 6);
  const br = st.currentBranch();
  const slides = [
    { bg: '#0E9F6E', tag: 'BELANJA HARIAN', title: 'Belanja online, ambil di toko 30 menit', text: `Pesan dari rumah, ambil di ${esc(br.name)} tanpa antre.`, cta: 'Belanja sekarang', href: '#/kategori', items: ['p17', 'p11', 'p12'] },
    { bg: '#FF7A1A', tag: 'FLASH SALE', title: 'Diskon hingga 25% setiap 3 jam', text: 'Harga spesial produk pilihan, stok terbatas.', cta: 'Lihat flash sale', href: '#/promo', items: ['p01', 'p08', 'p30'] },
    { bg: '#111827', tag: 'MEMBER LI MART', title: 'Kumpulkan poin, belanja makin hemat', text: '1 poin setiap Rp1.000. Tukar poin langsung saat checkout.', cta: 'Daftar gratis', href: '#/masuk', items: ['p21', 'p23', 'p24'] },
  ];
  return {
    html: `<div class="container">
      <section class="hero">
        <div class="slider" id="slider" aria-roledescription="carousel">
          ${slides.map((s, i) => `<div class="slide ${i === 0 ? 'on' : ''}" style="background:${s.bg}" aria-hidden="${i !== 0}">
            <div style="display:flex;flex-direction:column;position:relative;z-index:2">
              <span class="tag">${s.tag}</span><h1>${s.title}</h1><p>${s.text}</p>
              <a class="btn ${i === 1 ? 'btn-dark' : 'btn-accent'}" href="${s.href}" style="align-self:flex-start">${s.cta} ${icon('chevR', 18)}</a>
            </div>
            <div class="slide-art">${s.items.map((id) => `<div class="pk">${packshot(st.productById(id), { bg: false })}</div>`).join('')}</div>
          </div>`).join('')}
          <div class="dots">${slides.map((_, i) => `<button class="${i === 0 ? 'on' : ''}" data-slide="${i}" aria-label="Slide ${i + 1}"></button>`).join('')}</div>
        </div>
        <div class="hero-side">
          <a class="side-banner" href="#/kategori/segar" style="background:#16A34A">
            <div><h3>Buah & sayur segar setiap pagi</h3><p class="small" style="margin-top:6px">Dipilih langsung di cabang terdekat.</p></div>
            <span class="go">Belanja segar ${icon('chevR', 16)}</span>
            <div class="art">${packshot(st.productById('p26'), { bg: false })}</div>
          </a>
          <a class="side-banner" href="#/promo" style="background:#2563EB">
            <div><h3>Gratis ongkir min. Rp150rb</h3><p class="small" style="margin-top:6px">Atau pakai voucher GRATISONGKIR.</p></div>
            <span class="go">Lihat voucher ${icon('chevR', 16)}</span>
            <div class="art">${packshot(st.productById('p37'), { bg: false })}</div>
          </a>
        </div>
      </section>

      <section class="services">
        <div class="service"><div class="ic" style="background:var(--brand-50);color:var(--brand-700)">${icon('store', 22)}</div><div><b>Ambil di toko</b><span>Siap ±30 menit</span></div></div>
        <div class="service"><div class="ic" style="background:#DBEAFE;color:#1D4ED8">${icon('truck', 22)}</div><div><b>Antar 1 jam</b><span>Area sekitar cabang</span></div></div>
        <div class="service"><div class="ic" style="background:#EDE9FE;color:#6D28D9">${icon('qr', 22)}</div><div><b>Bayar QRIS</b><span>Semua e-wallet & bank</span></div></div>
        <div class="service"><div class="ic" style="background:var(--accent-50);color:var(--accent-600)">${icon('gift', 22)}</div><div><b>Poin member</b><span>Tukar jadi potongan</span></div></div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Kategori</h2><a href="#/kategori">Semua produk</a></div>
        <div class="cats">${S().categories.map((c) => `<a class="cat" href="#/kategori/${c.id}">${catIcon(c)}<span>${c.name}</span></a>`).join('')}</div>
      </section>

      ${flash.length ? `<section class="section flash">
        <div class="flash-head">
          <h2>${icon('bolt', 24).replace('fill="none"', 'fill="currentColor"')} Flash Sale</h2>
          <div class="countdown" id="countdown" aria-label="Sisa waktu flash sale">Berakhir dalam <b data-h>00</b>:<b data-m>00</b>:<b data-s>00</b></div>
          <a href="#/promo" style="color:#fff;font-weight:700;font-size:14px">Lihat semua ${icon('chevR', 14)}</a>
        </div>
        <div class="flash-body"><div class="hscroll">${flash.map((p) => productCard(p, { flash: true })).join('')}</div></div>
      </section>` : ''}

      <section class="section">
        <div class="section-head"><h2>Voucher untukmu</h2><a href="#/promo">Semua promo</a></div>
        <div class="vouchers">${S().vouchers.filter((v) => v.active).map(voucherCard).join('')}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Paling laris minggu ini</h2><a href="#/kategori?sort=laris">Lihat semua</a></div>
        <div class="grid-products">${best.map((p) => productCard(p)).join('')}</div>
      </section>

      <section class="section member-band">
        <div>
          <h2>Jadi member, belanja makin untung</h2>
          <p>Daftar gratis dan langsung dapat 100 poin. Naik level untuk poin berlipat dan gratis ongkir mingguan.</p>
          <div class="row" style="margin-top:18px;flex-wrap:wrap">
            <a class="btn btn-accent" href="${st.currentUser() ? '#/akun' : '#/masuk?daftar=1'}">${st.currentUser() ? 'Lihat poin saya' : 'Daftar gratis'}</a>
            <a class="btn" style="background:rgba(255,255,255,.16);color:#fff" href="#/promo">Cara kerja poin</a>
          </div>
        </div>
        <div class="tiers">${TIERS.map((t) => `<div class="tier"><b>${t.name}</b><span>${t.min ? 'Belanja ' + st.compact(t.min) : 'Saat daftar'}</span><div class="xs" style="margin-top:6px;opacity:.9">${t.perk}</div></div>`).join('')}</div>
      </section>

      ${fresh.length ? `<section class="section">
        <div class="section-head"><h2>Produk baru</h2><a href="#/kategori?sort=baru">Lihat semua</a></div>
        <div class="grid-products">${fresh.map((p) => productCard(p)).join('')}</div>
      </section>` : ''}

      ${recent.length ? `<section class="section">
        <div class="section-head"><h2>Terakhir dilihat</h2></div>
        <div class="grid-products">${recent.map((p) => productCard(p)).join('')}</div>
      </section>` : ''}

      <section class="section">
        <div class="section-head"><h2>Toko kami</h2><a href="#/toko">Semua cabang</a></div>
        <div class="stores">${S().branches.map(storeCard).join('')}</div>
      </section>
    </div>`,
    mount(root) {
      // slider
      let i = 0;
      const slidesEl = root.querySelectorAll('.slide');
      const dots = root.querySelectorAll('[data-slide]');
      const show = (n) => {
        i = (n + slidesEl.length) % slidesEl.length;
        slidesEl.forEach((s, k) => { s.classList.toggle('on', k === i); s.setAttribute('aria-hidden', k !== i); });
        dots.forEach((d, k) => d.classList.toggle('on', k === i));
      };
      dots.forEach((d) => d.addEventListener('click', () => { show(+d.dataset.slide); reset(); }));
      let timer;
      const reset = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 5000); };
      reset();
      // countdown
      const cd = root.querySelector('#countdown');
      let cdTimer;
      if (cd) {
        const tick = () => {
          const left = Math.max(0, st.flashEndsAt() - Date.now());
          const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000), s = Math.floor((left % 60000) / 1000);
          cd.querySelector('[data-h]').textContent = String(h).padStart(2, '0');
          cd.querySelector('[data-m]').textContent = String(m).padStart(2, '0');
          cd.querySelector('[data-s]').textContent = String(s).padStart(2, '0');
        };
        tick();
        cdTimer = setInterval(tick, 1000);
      }
      return () => { clearInterval(timer); clearInterval(cdTimer); };
    },
  };
}

export function voucherCard(v) {
  const big = v.type === 'percent' ? `${v.value}%` : v.type === 'shipping' ? 'Ongkir' : st.compact(v.value);
  const small = v.type === 'shipping' ? 'GRATIS' : 'DISKON';
  return `<div class="voucher">
    <div class="vl" style="background:${v.color}"><span>${small}</span><b>${big}</b></div>
    <div class="vr">
      <b style="font-size:14.5px">${esc(v.title)}</b>
      <span class="xs muted">${esc(v.desc)}</span>
      <div class="row-between"><span class="code">${esc(v.code)}</span><button class="btn btn-outline btn-sm" data-copy="${esc(v.code)}">Salin</button></div>
    </div>
  </div>`;
}

function isOpen(b) {
  if (b.is24) return true;
  const now = new Date();
  const m = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = b.open.split(':').map(Number);
  const [ch, cm] = b.close.split(':').map(Number);
  return m >= oh * 60 + om && m < ch * 60 + cm;
}
function storeCard(b) {
  const open = isOpen(b);
  const on = b.id === S().branchId;
  return `<div class="store" style="${on ? 'outline:2px solid var(--brand)' : ''}">
    <div class="row-between"><h3>${esc(b.name)}</h3><span class="open-pill ${open ? '' : 'closed'}">${open ? 'Buka' : 'Tutup'}</span></div>
    <div class="small muted">${esc(b.address)}</div>
    <div class="small">${icon('clock', 14)} ${b.is24 ? 'Buka 24 jam' : `${b.open} – ${b.close} WIB`}</div>
    <div class="small">${icon('pin', 14)} ± ${String(b.km).replace('.', ',')} km dari lokasimu</div>
    <button class="btn ${on ? 'btn-primary' : 'btn-outline'} btn-sm" data-branch="${b.id}" style="margin-top:4px">${on ? icon('check', 16) + ' Toko pilihanmu' : 'Belanja di toko ini'}</button>
  </div>`;
}

// ---------------------------------------------------------
// KATALOG / KATEGORI / PENCARIAN
// ---------------------------------------------------------
export function catalog({ params, query }) {
  const catId = params[0] || query.get('cat') || '';
  const q = query.get('q') || '';
  const sort = query.get('sort') || 'rekomendasi';
  const promoOnly = query.get('promo') === '1';
  const inStock = query.get('stok') === '1';
  const min = +query.get('min') || 0;
  const max = +query.get('max') || 0;
  const cat = catId ? st.categoryById(catId) : null;

  let list = q ? st.search(q) : st.products();
  if (cat) list = list.filter((p) => p.cat === cat.id);
  if (promoOnly) list = list.filter((p) => st.discountPct(p) > 0);
  if (inStock) list = list.filter((p) => st.stockAt(p) > 0);
  if (min) list = list.filter((p) => st.priceOf(p) >= min);
  if (max) list = list.filter((p) => st.priceOf(p) <= max);
  const sorters = {
    rekomendasi: (a, b) => (q ? 0 : b.sold * b.rating - a.sold * a.rating),
    laris: (a, b) => b.sold - a.sold,
    murah: (a, b) => st.priceOf(a) - st.priceOf(b),
    mahal: (a, b) => st.priceOf(b) - st.priceOf(a),
    diskon: (a, b) => st.discountPct(b) - st.discountPct(a),
    baru: (a, b) => (b.tags.includes('new') ? 1 : 0) - (a.tags.includes('new') ? 1 : 0),
  };
  list = [...list].sort(sorters[sort] || sorters.rekomendasi);

  const link = (patch) => {
    const qp = new URLSearchParams(query);
    Object.entries(patch).forEach(([k, v]) => (v === null || v === '' ? qp.delete(k) : qp.set(k, v)));
    const base = patch.__cat !== undefined ? (patch.__cat ? `#/kategori/${patch.__cat}` : '#/kategori') : (cat ? `#/kategori/${cat.id}` : '#/kategori');
    qp.delete('__cat');
    const s = qp.toString();
    return base + (s ? '?' + s : '');
  };
  const title = q ? `Hasil untuk “${esc(q)}”` : cat ? cat.name : 'Semua Produk';
  const counts = {};
  (q ? st.search(q) : st.products()).forEach((p) => { counts[p.cat] = (counts[p.cat] || 0) + 1; });

  return {
    html: `<div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="#/">Beranda</a><span>/</span><a href="#/kategori">Produk</a>${cat ? `<span>/</span><span>${cat.name}</span>` : ''}</nav>
      <div class="row-between" style="margin:10px 0 16px;flex-wrap:wrap">
        <h1 class="page-title" style="margin:0">${title}</h1>
        <button class="btn btn-outline btn-sm only-sm" id="toggleFilter">${icon('filter', 16)} Filter</button>
      </div>
      <div class="catalog">
        <aside class="filters card card-pad" id="filters">
          <div>
            <h4>Kategori</h4>
            <div class="filter-list">
              <a class="${!cat ? 'on' : ''}" href="${link({ __cat: '' })}"><span>Semua</span></a>
              ${S().categories.map((c) => `<a class="${cat?.id === c.id ? 'on' : ''}" href="${link({ __cat: c.id })}"><span>${c.name}</span><span class="muted xs">${counts[c.id] || 0}</span></a>`).join('')}
            </div>
          </div>
          <div>
            <h4>Harga</h4>
            <form id="priceForm" class="stack" style="gap:8px">
              <div class="row"><input class="input" name="min" inputmode="numeric" placeholder="Min" value="${min || ''}" aria-label="Harga minimum"><input class="input" name="max" inputmode="numeric" placeholder="Maks" value="${max || ''}" aria-label="Harga maksimum"></div>
              <button class="btn btn-outline btn-sm">Terapkan</button>
            </form>
          </div>
          <div class="stack" style="gap:8px">
            <h4 style="margin:0">Lainnya</h4>
            <label class="check"><input type="checkbox" id="fPromo" ${promoOnly ? 'checked' : ''}> Sedang promo</label>
            <label class="check"><input type="checkbox" id="fStock" ${inStock ? 'checked' : ''}> Tersedia di ${esc(st.currentBranch().name)}</label>
          </div>
        </aside>
        <div>
          <div class="toolbar">
            <span class="muted small">${list.length} produk</span>
            <div class="row"><label for="sortSel" class="small muted">Urutkan</label>
              <select class="select" id="sortSel" style="width:auto;min-height:40px;padding:6px 12px">
                ${[['rekomendasi', 'Rekomendasi'], ['laris', 'Terlaris'], ['diskon', 'Diskon terbesar'], ['murah', 'Harga terendah'], ['mahal', 'Harga tertinggi'], ['baru', 'Terbaru']].map(([k, l]) => `<option value="${k}" ${sort === k ? 'selected' : ''}>${l}</option>`).join('')}
              </select>
            </div>
          </div>
          ${list.length ? `<div class="grid-products">${list.map((p) => productCard(p)).join('')}</div>`
            : `<div class="card">${emptyState('search', 'Produk tidak ditemukan', 'Coba kata kunci lain atau hapus filter.', '<a class="btn btn-primary" href="#/kategori">Lihat semua produk</a>')}</div>`}
        </div>
      </div>
    </div>`,
    mount(root) {
      root.querySelector('#sortSel').addEventListener('change', (e) => go(link({ sort: e.target.value })));
      root.querySelector('#fPromo').addEventListener('change', (e) => go(link({ promo: e.target.checked ? '1' : '' })));
      root.querySelector('#fStock').addEventListener('change', (e) => go(link({ stok: e.target.checked ? '1' : '' })));
      root.querySelector('#priceForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const f = new FormData(e.target);
        go(link({ min: String(f.get('min')).replace(/\D/g, ''), max: String(f.get('max')).replace(/\D/g, '') }));
      });
      root.querySelector('#toggleFilter')?.addEventListener('click', () => root.querySelector('#filters').classList.toggle('open'));
    },
  };
}

// ---------------------------------------------------------
// DETAIL PRODUK
// ---------------------------------------------------------
let pdpQty = 1;
export function product({ params }) {
  const p = st.productById(params[0]);
  if (!p || !p.active) return notFound();
  st.addRecent(p.id);
  const cat = st.categoryById(p.cat);
  const price = st.priceOf(p);
  const disc = st.discountPct(p);
  const stock = st.stockAt(p);
  pdpQty = Math.min(Math.max(1, pdpQty), Math.max(1, stock));
  const related = st.products().filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 6);
  const wish = st.inWishlist(p.id);
  const desc = p.desc || `${p.name} pilihan Lazy Innovator Mart. Kualitas terjamin, disimpan sesuai standar penyimpanan toko, dan siap diambil atau diantar dari cabang terdekat.`;
  return {
    html: `<div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="#/">Beranda</a><span>/</span><a href="#/kategori/${cat.id}">${cat.name}</a><span>/</span><span>${esc(p.name)}</span></nav>
      <div class="pdp">
        <div class="pdp-media">${packshot(p)}
          ${disc ? `<span class="ribbon"><span class="r-flash">HEMAT ${disc}%</span></span>` : ''}
        </div>
        <div class="stack" style="gap:16px">
          <div>
            <a href="#/kategori/${cat.id}" class="small bold" style="color:var(--brand-700)">${cat.name}</a>
            <h1 style="margin-top:6px">${esc(p.name)}</h1>
            <div class="row small muted" style="margin-top:8px;flex-wrap:wrap"><span class="stars">${icon('star', 15).replace('fill="none"', 'fill="currentColor"')} ${p.rating.toFixed(1)}</span><span>·</span><span>${num(p.sold)} terjual</span><span>·</span><span>per ${esc(p.unit)}</span></div>
          </div>
          <div>
            <div class="price-big">${rp(price)}</div>
            ${disc ? `<div class="row small" style="margin-top:4px"><span class="disc">-${disc}%</span><span class="strike">${rp(p.price)}</span><span class="bold" style="color:var(--brand-700)">Hemat ${rp(p.price - price)}</span></div>` : ''}
          </div>
          <div class="card card-pad stack" style="gap:10px">
            <div class="row-between"><b>Ketersediaan stok</b><button class="btn btn-ghost btn-sm" data-open-branch>${icon('store', 16)} Ganti toko</button></div>
            <div class="branch-stock">
              ${S().branches.map((b) => { const s = st.stockAt(p, b.id); return `<div class="bs ${b.id === S().branchId ? 'on' : ''}"><span>${esc(b.name)}${b.id === S().branchId ? ' <b class="xs" style="color:var(--brand-700)">· dipilih</b>' : ''}</span><span class="bold" style="color:${s === 0 ? 'var(--danger)' : s <= 5 ? 'var(--warn)' : 'var(--brand-700)'}">${s === 0 ? 'Habis' : s <= 5 ? `Sisa ${s}` : 'Tersedia'}</span></div>`; }).join('')}
            </div>
          </div>
          ${stock > 0 ? `<div class="row" style="flex-wrap:wrap;gap:12px">
              <div class="qty"><button id="qMinus" aria-label="Kurangi">−</button><input id="qInput" value="${pdpQty}" inputmode="numeric" aria-label="Jumlah"><button id="qPlus" aria-label="Tambah">+</button></div>
              <span class="small muted">Stok ${stock} di cabang ini</span>
            </div>
            <div class="row" style="flex-wrap:wrap">
              <button class="btn btn-outline btn-lg grow" id="addBtn">${icon('cart', 20)} Tambah ke keranjang</button>
              <button class="btn btn-primary btn-lg grow" id="buyBtn">Beli sekarang</button>
              <button class="btn btn-outline btn-lg" data-wish="${p.id}" aria-label="Wishlist" style="color:${wish ? '#E11D48' : 'inherit'}">${wish ? icon('heart', 20).replace('fill="none"', 'fill="currentColor"') : icon('heart', 20)}</button>
            </div>`
          : `<div class="demo-note">Stok habis di ${esc(st.currentBranch().name)}. Coba ganti toko yang masih tersedia.</div>
             <button class="btn btn-outline btn-lg" data-wish="${p.id}">${icon('heart', 20)} ${wish ? 'Ada di wishlist' : 'Simpan ke wishlist'}</button>`}
          <div class="card card-pad">
            <h3 style="font-size:16px;margin-bottom:10px">Deskripsi</h3>
            <p class="small" style="color:var(--ink-2);line-height:1.65">${esc(desc)}</p>
            <dl class="kv" style="margin-top:14px">
              <dt>Kategori</dt><dd>${cat.name}</dd>
              <dt>Satuan</dt><dd>${esc(p.unit)}</dd>
              <dt>Kode produk</dt><dd>${p.id.toUpperCase()}</dd>
              <dt>Pengiriman</dt><dd>Ambil di toko · Antar 1 jam</dd>
            </dl>
          </div>
        </div>
      </div>
      ${related.length ? `<section class="section"><div class="section-head"><h2>Produk serupa</h2><a href="#/kategori/${cat.id}">Lihat semua</a></div>
        <div class="grid-products">${related.map((x) => productCard(x)).join('')}</div></section>` : ''}
    </div>`,
    mount(root) {
      const input = root.querySelector('#qInput');
      if (!input) return;
      const set = (v) => { pdpQty = Math.max(1, Math.min(stock, v || 1)); input.value = pdpQty; };
      root.querySelector('#qMinus').onclick = () => set(pdpQty - 1);
      root.querySelector('#qPlus').onclick = () => set(pdpQty + 1);
      input.onchange = () => set(parseInt(input.value.replace(/\D/g, ''), 10));
      const add = () => {
        const err = st.addToCart(p.id, pdpQty);
        if (err) { toast(err, { icon: 'x' }); return false; }
        return true;
      };
      root.querySelector('#addBtn').onclick = () => { if (add()) toast(`${pdpQty} × ${esc(p.name)} masuk keranjang`, { icon: 'check', link: { href: '#/keranjang', text: 'Lihat' } }); };
      root.querySelector('#buyBtn').onclick = () => { if (add()) go('#/keranjang'); };
    },
  };
}

// ---------------------------------------------------------
// KERANJANG
// ---------------------------------------------------------
export function cart() {
  const lines = st.cartLines();
  const br = st.currentBranch();
  if (!lines.length) {
    return { html: `<div class="container"><h1 class="page-title">Keranjang</h1><div class="card">${emptyState('cart', 'Keranjangmu masih kosong', 'Yuk isi dengan kebutuhan harian dari ' + esc(br.name) + '.', '<a class="btn btn-primary" href="#/">Mulai belanja</a>')}</div></div>` };
  }
  const sub = st.cartSubtotal();
  const save = st.cartSavings();
  const problems = lines.filter((l) => l.qty > l.stock);
  const toFree = Math.max(0, DELIVERY.freeAbove - sub);
  return {
    html: `<div class="container">
      <h1 class="page-title">Keranjang <span class="muted" style="font-size:18px">(${st.cartCount()} item)</span></h1>
      <div class="cart-layout">
        <div class="stack">
          <div class="card card-pad row-between" style="flex-wrap:wrap">
            <div class="row">${icon('store', 22)}<div><div class="xs muted">Belanja dari</div><b>${esc(br.name)}</b></div></div>
            <button class="btn btn-outline btn-sm" data-open-branch>Ganti toko</button>
          </div>
          ${problems.length ? `<div class="demo-note">${problems.length} produk melebihi stok di cabang ini. Kurangi jumlah atau ganti toko.</div>` : ''}
          <div class="card card-pad">
            <div class="row-between" style="margin-bottom:4px"><b>Daftar belanja</b><button class="btn btn-ghost btn-sm" id="clearCart">${icon('trash', 16)} Kosongkan</button></div>
            ${lines.map((l) => `<div class="cart-item">
              <a class="thumb" href="#/produk/${l.p.id}">${packshot(l.p)}</a>
              <div class="stack" style="gap:4px">
                <a href="#/produk/${l.p.id}" class="bold" style="font-size:14.5px">${esc(l.p.name)}</a>
                <div class="row small"><b>${rp(l.unit)}</b>${l.unit < l.p.price ? `<span class="strike">${rp(l.p.price)}</span>` : ''}</div>
                <div class="xs" style="color:${l.qty > l.stock ? 'var(--danger)' : 'var(--muted)'}">${l.qty > l.stock ? `Stok hanya ${l.stock}` : `Stok ${l.stock}`}</div>
              </div>
              <div class="ci-right stack" style="align-items:flex-end;gap:8px">
                <b>${rp(l.total)}</b>
                <div class="row" style="gap:6px">
                  <button class="icon-btn" data-remove="${l.p.id}" aria-label="Hapus">${icon('trash', 18)}</button>
                  <div class="qty" style="height:40px"><button data-dec="${l.p.id}" aria-label="Kurangi" style="width:38px">−</button><input value="${l.qty}" readonly aria-label="Jumlah" style="width:40px"><button data-inc="${l.p.id}" aria-label="Tambah" style="width:38px">+</button></div>
                </div>
              </div>
            </div>`).join('')}
          </div>
        </div>
        <aside class="card card-pad summary">
          <h3 style="font-size:18px;margin-bottom:12px">Ringkasan belanja</h3>
          <div class="sum-row"><span>Total harga (${st.cartCount()} item)</span><span>${rp(sub + save)}</span></div>
          ${save ? `<div class="sum-row" style="color:var(--brand-700)"><span>Hemat promo</span><span>- ${rp(save)}</span></div>` : ''}
          <div class="sum-row total"><span>Subtotal</span><span>${rp(sub)}</span></div>
          <div class="small" style="margin:12px 0;padding:10px 12px;border-radius:12px;background:${toFree ? 'var(--accent-50)' : 'var(--brand-50)'}">
            ${toFree ? `Belanja <b>${rp(toFree)}</b> lagi untuk <b>gratis ongkir</b>.` : `${icon('check', 14)} Kamu dapat <b>gratis ongkir</b> untuk pesanan diantar.`}
          </div>
          <button class="btn btn-primary btn-lg btn-block" id="toCheckout" ${problems.length ? 'disabled' : ''}>Lanjut ke pembayaran</button>
          <a class="btn btn-ghost btn-block" href="#/" style="margin-top:6px">Lanjut belanja</a>
        </aside>
      </div>
    </div>`,
    mount(root) {
      root.querySelector('#clearCart').onclick = () => { if (confirmBox('Kosongkan keranjang?')) st.clearCart(); };
      root.querySelectorAll('[data-remove]').forEach((b) => (b.onclick = () => st.setCartQty(b.dataset.remove, 0)));
      root.querySelector('#toCheckout').onclick = () => go(st.currentUser() ? '#/checkout' : '#/masuk?next=checkout');
    },
  };
}
function confirmBox(msg) { return window.confirm(msg); }

// ---------------------------------------------------------
// CHECKOUT
// ---------------------------------------------------------
const co = { method: 'pickup', express: false, slot: null, addressId: null, payment: 'qris', voucher: '', voucherInput: '', usePoints: false, note: '' };

function slotsFor(method, branch) {
  const now = new Date();
  const out = [];
  const close = branch.is24 ? 24 : +branch.close.split(':')[0];
  const open = branch.is24 ? 0 : +branch.open.split(':')[0];
  if (method === 'pickup') out.push({ v: 'Secepatnya (±30 menit)', l: 'Secepatnya', s: '±30 menit' });
  const step = method === 'pickup' ? 1 : 2;
  for (let day = 0; day < 2 && out.length < 7; day++) {
    for (let h = open; h < close && out.length < 7; h += step) {
      const t = new Date(now.getFullYear(), now.getMonth(), now.getDate() + day, h);
      if (t.getTime() < now.getTime() + 90 * 60000) continue;
      const end = method === 'pickup' ? h + 1 : h + 2;
      const lbl = `${day === 0 ? 'Hari ini' : 'Besok'}`;
      const range = `${String(h).padStart(2, '0')}.00–${String(Math.min(end, 24)).padStart(2, '0')}.00`;
      out.push({ v: `${lbl}, ${range}`, l: lbl, s: range });
    }
  }
  return out;
}

export function checkout() {
  const u = st.currentUser();
  if (!u) { go('#/masuk?next=checkout'); return { html: '' }; }
  if (!st.cartLines().length) { go('#/keranjang'); return { html: '' }; }
  const br = st.currentBranch();
  if (!co.addressId && u.addresses[0]) co.addressId = u.addresses[0].id;
  if (co.method === 'pickup' && co.payment === 'cod') co.payment = 'store';
  if (co.method === 'delivery' && co.payment === 'store') co.payment = 'cod';
  const slots = slotsFor(co.method, br);
  if (!slots.some((s) => s.v === co.slot)) co.slot = slots[0]?.v || null;
  const q = st.quote({ method: co.method, express: co.express, voucher: co.voucher, usePoints: co.usePoints });
  const addr = u.addresses.find((a) => a.id === co.addressId);
  const pays = [
    { id: 'qris', ic: 'qr', t: 'QRIS', s: 'GoPay, OVO, DANA, ShopeePay, m-banking' },
    { id: 'va', ic: 'bank', t: 'Transfer Virtual Account', s: 'BCA, BNI, BRI, Mandiri' },
    co.method === 'pickup'
      ? { id: 'store', ic: 'cash', t: 'Bayar di kasir', s: 'Tunai/QRIS saat ambil barang' }
      : { id: 'cod', ic: 'cash', t: 'Bayar di tempat (COD)', s: 'Tunai ke kurir' },
  ];
  return {
    html: `<div class="container">
      <nav class="breadcrumb"><a href="#/keranjang">Keranjang</a><span>/</span><span>Checkout</span></nav>
      <h1 class="page-title">Checkout</h1>
      <div class="cart-layout">
        <div class="stack" style="gap:16px">
          <section class="card card-pad">
            <div class="step-title"><span class="n">1</span>Cara terima pesanan</div>
            <div class="opts">
              <button class="opt ${co.method === 'pickup' ? 'on' : ''}" data-method="pickup"><div class="ic">${icon('store', 20)}</div><div><b>Ambil di toko</b><span>Gratis · ${esc(br.name)}</span></div></button>
              <button class="opt ${co.method === 'delivery' ? 'on' : ''}" data-method="delivery"><div class="ic">${icon('truck', 20)}</div><div><b>Diantar ke alamat</b><span>${rp(DELIVERY.baseFee)} · gratis min. ${st.compact(DELIVERY.freeAbove)}</span></div></button>
            </div>
            ${co.method === 'delivery' ? `<div style="margin-top:16px" class="stack">
              <div class="row-between"><b>Alamat pengiriman</b><button class="btn btn-ghost btn-sm" id="addAddr">${icon('plus', 16)} Alamat baru</button></div>
              ${u.addresses.length ? u.addresses.map((a) => `<button class="opt ${a.id === co.addressId ? 'on' : ''}" data-addr="${a.id}"><div class="ic">${icon('pin', 20)}</div><div><b>${esc(a.label)} · ${esc(a.name)}</b><span>${esc(a.phone)}<br>${esc(a.detail)}</span></div></button>`).join('')
                : '<div class="demo-note">Belum ada alamat. Tambahkan alamat pengiriman dulu.</div>'}
              <label class="check" style="margin-top:4px"><input type="checkbox" id="express" ${co.express ? 'checked' : ''}> ${icon('bolt', 16)} Antar kilat ±1 jam (+${rp(DELIVERY.expressFee)})</label>
            </div>` : `<div class="small muted" style="margin-top:12px">${icon('pin', 14)} ${esc(br.address)} · ${br.is24 ? 'Buka 24 jam' : `${br.open}–${br.close}`}</div>`}
            ${!(co.method === 'delivery' && co.express) ? `<div style="margin-top:16px"><b class="small">${co.method === 'pickup' ? 'Waktu ambil' : 'Jadwal antar'}</b>
              <div class="slots" style="margin-top:8px">${slots.map((s) => `<button class="chip ${s.v === co.slot ? 'on' : ''}" data-slot="${esc(s.v)}"><b>${s.l}</b> ${s.s}</button>`).join('')}</div></div>` : ''}
          </section>

          <section class="card card-pad">
            <div class="step-title"><span class="n">2</span>Pesanan dari ${esc(br.name)}</div>
            ${q.lines.map((l) => `<div class="row" style="padding:8px 0;border-bottom:1px solid var(--line)"><div style="width:48px;height:48px;border-radius:10px;overflow:hidden;flex:none">${packshot(l.p)}</div><div class="grow"><div class="small bold">${esc(l.p.name)}</div><div class="xs muted">${l.qty} × ${rp(l.unit)}</div></div><b class="small">${rp(l.total)}</b></div>`).join('')}
            <div class="field" style="margin-top:14px"><label for="note">Catatan untuk toko (opsional)</label><input class="input" id="note" value="${esc(co.note)}" placeholder="Contoh: pisang yang agak hijau ya"></div>
          </section>

          <section class="card card-pad">
            <div class="step-title"><span class="n">3</span>Metode pembayaran</div>
            <div class="stack" style="gap:10px">${pays.map((p) => `<button class="opt ${co.payment === p.id ? 'on' : ''}" data-pay="${p.id}"><div class="ic">${icon(p.ic, 20)}</div><div class="grow"><b>${p.t}</b><span>${p.s}</span></div>${co.payment === p.id ? `<span style="color:var(--brand)">${icon('check', 20)}</span>` : ''}</button>`).join('')}</div>
          </section>
        </div>

        <aside class="card card-pad summary stack" style="gap:12px">
          <h3 style="font-size:18px">Ringkasan pembayaran</h3>
          <div class="stack" style="gap:6px">
            <label class="small bold" for="vc">Voucher</label>
            <div class="row"><input class="input" id="vc" placeholder="Masukkan kode" value="${esc(co.voucherInput || co.voucher)}" style="text-transform:uppercase"><button class="btn btn-outline" id="applyV">Pakai</button></div>
            ${co.voucher && q.voucherError ? `<span class="xs" style="color:var(--danger)">${q.voucherError}</span>` : ''}
            ${q.voucher ? `<span class="xs" style="color:var(--brand-700)">${icon('check', 12)} Voucher ${q.voucher} terpasang · <a href="#" id="rmV" style="text-decoration:underline">hapus</a></span>` : ''}
            <div class="row" style="flex-wrap:wrap;gap:6px">${S().vouchers.filter((v) => v.active).map((v) => `<button class="chip" data-v="${v.code}" style="min-height:30px;font-size:12px">${v.code}</button>`).join('')}</div>
          </div>
          ${u.points > 0 ? `<label class="check" style="background:var(--accent-50);padding:10px 12px;border-radius:12px"><input type="checkbox" id="usePts" ${co.usePoints ? 'checked' : ''}><span>Pakai poin <b>${num(u.points)}</b> <span class="xs muted">(1 poin = ${rp(POINT_RULES.pointValue)})</span></span></label>` : ''}
          <div>
            <div class="sum-row"><span>Subtotal</span><span>${rp(q.subtotal)}</span></div>
            ${q.savings ? `<div class="sum-row" style="color:var(--brand-700)"><span>Sudah hemat promo</span><span>${rp(q.savings)}</span></div>` : ''}
            ${co.method === 'delivery' ? `<div class="sum-row"><span>Ongkos kirim${co.express ? ' (kilat)' : ''}</span><span>${q.shipping ? rp(q.shipping) : 'Gratis'}</span></div>` : ''}
            ${q.shipDiscount ? `<div class="sum-row" style="color:var(--brand-700)"><span>Diskon ongkir</span><span>- ${rp(q.shipDiscount)}</span></div>` : ''}
            ${q.discount ? `<div class="sum-row" style="color:var(--brand-700)"><span>Voucher</span><span>- ${rp(q.discount)}</span></div>` : ''}
            ${q.pointsUsed ? `<div class="sum-row" style="color:var(--brand-700)"><span>Poin (${num(q.pointsUsed)})</span><span>- ${rp(q.pointsValue)}</span></div>` : ''}
            <div class="sum-row total"><span>Total bayar</span><span>${rp(q.total)}</span></div>
            <div class="xs muted" style="margin-top:6px">${icon('gift', 12)} Dapat ${num(q.earn)} poin setelah pesanan selesai</div>
          </div>
          <button class="btn btn-primary btn-lg btn-block" id="placeOrder">${co.payment === 'qris' || co.payment === 'va' ? 'Bayar sekarang' : 'Buat pesanan'} · ${rp(q.total)}</button>
          <p class="xs muted" style="text-align:center">${icon('shield', 12)} Pembayaran aman & terenkripsi</p>
        </aside>
      </div>
    </div>`,
    mount(root, rerender) {
      const upd = (patch) => { co.note = root.querySelector('#note')?.value ?? co.note; Object.assign(co, patch); rerender(); };
      root.querySelectorAll('[data-method]').forEach((b) => (b.onclick = () => upd({ method: b.dataset.method })));
      root.querySelectorAll('[data-addr]').forEach((b) => (b.onclick = () => upd({ addressId: b.dataset.addr })));
      root.querySelectorAll('[data-slot]').forEach((b) => (b.onclick = () => upd({ slot: b.dataset.slot })));
      root.querySelectorAll('[data-pay]').forEach((b) => (b.onclick = () => upd({ payment: b.dataset.pay })));
      root.querySelectorAll('[data-v]').forEach((b) => (b.onclick = () => upd({ voucher: b.dataset.v, voucherInput: b.dataset.v })));
      root.querySelector('#express')?.addEventListener('change', (e) => upd({ express: e.target.checked }));
      root.querySelector('#usePts')?.addEventListener('change', (e) => upd({ usePoints: e.target.checked }));
      root.querySelector('#applyV').onclick = () => { const v = root.querySelector('#vc').value.trim().toUpperCase(); upd({ voucher: v, voucherInput: v }); };
      root.querySelector('#rmV')?.addEventListener('click', (e) => { e.preventDefault(); upd({ voucher: '', voucherInput: '' }); });
      root.querySelector('#addAddr')?.addEventListener('click', () => addressForm(null, (id) => upd({ addressId: id })));
      root.querySelector('#placeOrder').onclick = () => {
        co.note = root.querySelector('#note').value;
        const res = st.placeOrder({ method: co.method, express: co.express, slot: co.method === 'delivery' && co.express ? 'Antar kilat ±1 jam' : co.slot, address: addr, payment: co.payment, voucher: co.voucher, usePoints: co.usePoints, note: co.note });
        if (res.error) { toast(res.error, { icon: 'x' }); return; }
        Object.assign(co, { voucher: '', voucherInput: '', usePoints: false, note: '' });
        go('#/pesanan/' + res.order.id);
        toast('Pesanan berhasil dibuat', { icon: 'check' });
      };
    },
  };
}

export function addressForm(a, onSaved) {
  const u = st.currentUser();
  const v = a || { label: 'Rumah', name: u?.name || '', phone: u?.phone || '', detail: '', note: '' };
  modal({
    title: a ? 'Ubah alamat' : 'Alamat baru',
    body: `<form id="addrForm" class="form-grid">
      <div class="field"><label for="al">Label</label><input class="input" id="al" name="label" value="${esc(v.label)}" required placeholder="Rumah / Kantor"></div>
      <div class="field"><label for="an">Nama penerima</label><input class="input" id="an" name="name" value="${esc(v.name)}" required></div>
      <div class="field full"><label for="ap">No. HP</label><input class="input" id="ap" name="phone" value="${esc(v.phone)}" inputmode="tel" required></div>
      <div class="field full"><label for="ad">Alamat lengkap</label><textarea class="textarea" id="ad" name="detail" required placeholder="Jalan, nomor, RT/RW, kelurahan, kecamatan">${esc(v.detail)}</textarea></div>
      <div class="field full"><label for="ano">Patokan (opsional)</label><input class="input" id="ano" name="note" value="${esc(v.note || '')}"></div>
    </form>`,
    foot: `<button class="btn btn-ghost" data-close>Batal</button><button class="btn btn-primary" form="addrForm">Simpan alamat</button>`,
    onMount(ov) {
      ov.querySelector('#addrForm').onsubmit = (e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.target));
        const id = st.saveAddress({ ...(a || {}), ...f });
        closeModal();
        toast('Alamat tersimpan', { icon: 'check' });
        onSaved && onSaved(id);
      };
    },
  });
}

// ---------------------------------------------------------
// DETAIL PESANAN / LACAK
// ---------------------------------------------------------
export function order({ params }) {
  const o = st.orderById(params[0]);
  const u = st.currentUser();
  if (!o || (!st.isAdmin() && (!u || o.userId !== u.id))) return notFound('Pesanan tidak ditemukan');
  const br = st.branchById(o.branchId);
  const steps = o.method === 'pickup'
    ? ['menunggu_bayar', 'diproses', 'siap_diambil', 'selesai']
    : ['menunggu_bayar', 'diproses', 'dikirim', 'selesai'];
  const labels = { menunggu_bayar: 'Pembayaran', diproses: 'Pesanan disiapkan', siap_diambil: 'Siap diambil di toko', dikirim: 'Sedang diantar kurir', selesai: 'Pesanan selesai' };
  const descs = {
    menunggu_bayar: o.paid ? 'Pembayaran diterima' : ['store', 'cod'].includes(o.payment) ? 'Bayar saat terima barang' : 'Menunggu pembayaran',
    diproses: 'Petugas toko sedang menyiapkan barang',
    siap_diambil: `Tunjukkan kode ambil ke kasir ${br.name}`,
    dikirim: 'Kurir menuju alamatmu',
    selesai: `+${num(o.earn)} poin masuk ke akunmu`,
  };
  const idx = o.status === 'dibatalkan' ? -1 : steps.indexOf(o.status);
  const pickupCode = String(parseInt(o.id.replace(/\D/g, '').slice(-6), 10) % 10000).padStart(4, '0');
  const waitPay = o.status === 'menunggu_bayar' && !o.paid && ['qris', 'va'].includes(o.payment);
  const payLabel = { qris: 'QRIS', va: 'Virtual Account', store: 'Bayar di kasir', cod: 'Bayar di tempat' }[o.payment];
  const wa = `https://wa.me/${S().info.whatsapp}?text=${encodeURIComponent(`Halo ${S().info.name}, saya mau tanya pesanan ${o.no}.`)}`;
  return {
    html: `<div class="container">
      <nav class="breadcrumb"><a href="#/akun/pesanan">Pesanan saya</a><span>/</span><span>${o.no}</span></nav>
      <div class="row-between" style="flex-wrap:wrap;margin:14px 0 18px">
        <div><h1 class="page-title" style="margin:0">Pesanan ${o.no}</h1><div class="small muted">${fmtDate(o.createdAt)} · ${esc(br.name)}</div></div>
        ${statusPill(o.status, STATUS[o.status])}
      </div>
      <div class="cart-layout">
        <div class="stack" style="gap:16px">
          ${waitPay ? `<section class="card card-pad stack" style="align-items:center;text-align:center">
            <h3 style="font-size:18px">${o.payment === 'qris' ? 'Scan QRIS untuk membayar' : 'Transfer ke Virtual Account'}</h3>
            <div class="small muted">Bayar sebelum <b id="payBy">${fmtDate(o.payBy, { hour: '2-digit', minute: '2-digit' })}</b> · sisa <b id="payLeft">--:--</b></div>
            ${o.payment === 'qris' ? `<div class="qr-box">${demoQR(o.no)}<b style="font-size:22px">${rp(o.total)}</b><span class="xs muted">${esc(S().info.name)} · ${o.no}</span></div>`
              : `<div class="qr-box" style="width:100%;max-width:380px"><span class="small muted">Nomor Virtual Account</span><b style="font-size:24px;letter-spacing:2px;font-family:ui-monospace,monospace">${o.va}</b><button class="btn btn-outline btn-sm" data-copy="${o.va}">${icon('copy', 16)} Salin nomor</button><b style="font-size:22px">${rp(o.total)}</b></div>`}
            <div class="demo-note" style="max-width:420px">Mode demo: ${o.payment === 'qris' ? 'QR ini tidak bisa dipindai' : 'nomor ini tidak aktif'}. Pembayaran otomatis aktif di tahap 3 (Midtrans/Xendit).</div>
            <button class="btn btn-primary btn-lg" id="simPay">${icon('check', 18)} Simulasi: saya sudah bayar</button>
          </section>` : ''}
          ${o.method === 'pickup' && ['diproses', 'siap_diambil'].includes(o.status) ? `<section class="card card-pad row-between" style="flex-wrap:wrap;background:var(--brand-50)">
            <div><div class="small bold" style="color:var(--brand-700)">Kode ambil di kasir</div><div style="font-size:40px;font-weight:800;letter-spacing:8px">${pickupCode}</div><div class="xs muted">${esc(o.slot || '')}</div></div>
            <div class="small" style="max-width:260px">${icon('store', 16)} ${esc(br.name)}<br><span class="muted">${esc(br.address)}</span></div>
          </section>` : ''}
          <section class="card card-pad">
            <h3 style="font-size:16px;margin-bottom:16px">Status pesanan</h3>
            ${o.status === 'dibatalkan' ? `<div class="demo-note" style="background:#FEE2E2;color:#991B1B">Pesanan dibatalkan. Stok & poin sudah dikembalikan.</div>` : `<div class="timeline">
              ${steps.map((s, i) => `<div class="tl ${i < idx || o.status === 'selesai' ? 'done' : ''} ${i === idx && o.status !== 'selesai' ? 'now' : ''}">
                <div class="dot">${i < idx || o.status === 'selesai' ? icon('check', 14, 3) : ''}</div>
                <div><b>${labels[s]}</b><div class="small muted">${descs[s]}</div>${(() => { const h = o.history.find((x) => x.status === s); return h ? `<div class="xs muted">${fmtDate(h.at)}</div>` : ''; })()}</div>
              </div>`).join('')}
            </div>`}
          </section>
          <section class="card card-pad">
            <h3 style="font-size:16px;margin-bottom:10px">Barang (${o.items.reduce((a, i) => a + i.qty, 0)})</h3>
            ${o.items.map((it) => { const p = st.productById(it.id); return `<div class="row" style="padding:8px 0;border-bottom:1px solid var(--line)"><div style="width:48px;height:48px;border-radius:10px;overflow:hidden;flex:none">${p ? packshot(p) : ''}</div><div class="grow"><div class="small bold">${esc(it.name)}</div><div class="xs muted">${it.qty} × ${rp(it.price)}</div></div><b class="small">${rp(it.price * it.qty)}</b></div>`; }).join('')}
          </section>
        </div>
        <aside class="stack summary" style="gap:16px">
          <section class="card card-pad">
            <h3 style="font-size:16px;margin-bottom:10px">Rincian</h3>
            <dl class="kv" style="grid-template-columns:120px 1fr">
              <dt>Pengambilan</dt><dd>${o.method === 'pickup' ? 'Ambil di toko' : 'Diantar' + (o.express ? ' (kilat)' : '')}</dd>
              <dt>Jadwal</dt><dd>${esc(o.slot || '-')}</dd>
              ${o.address ? `<dt>Alamat</dt><dd>${esc(o.address.name)} · ${esc(o.address.phone)}<br><span class="muted" style="font-weight:500">${esc(o.address.detail)}</span></dd>` : ''}
              <dt>Pembayaran</dt><dd>${payLabel} ${o.paid ? '<span style="color:var(--brand-700)">· Lunas</span>' : ''}</dd>
              ${o.note ? `<dt>Catatan</dt><dd>${esc(o.note)}</dd>` : ''}
            </dl>
            <div style="margin-top:14px">
              <div class="sum-row"><span>Subtotal</span><span>${rp(o.subtotal)}</span></div>
              ${o.method === 'delivery' ? `<div class="sum-row"><span>Ongkir</span><span>${o.shipping ? rp(o.shipping) : 'Gratis'}</span></div>` : ''}
              ${o.shipDiscount ? `<div class="sum-row"><span>Diskon ongkir</span><span>- ${rp(o.shipDiscount)}</span></div>` : ''}
              ${o.discount ? `<div class="sum-row"><span>Voucher ${o.voucher || ''}</span><span>- ${rp(o.discount)}</span></div>` : ''}
              ${o.pointsValue ? `<div class="sum-row"><span>Poin</span><span>- ${rp(o.pointsValue)}</span></div>` : ''}
              <div class="sum-row total"><span>Total</span><span>${rp(o.total)}</span></div>
            </div>
          </section>
          <div class="stack" style="gap:8px">
            <a class="btn btn-outline btn-block" href="${wa}" target="_blank" rel="noopener">${icon('chat', 18)} Hubungi toko</a>
            ${o.status === 'selesai' || o.status === 'dibatalkan' ? `<button class="btn btn-primary btn-block" id="again">${icon('refresh', 18)} Beli lagi</button>` : ''}
            ${['menunggu_bayar', 'diproses'].includes(o.status) ? `<button class="btn btn-danger btn-block" id="cancel">Batalkan pesanan</button>` : ''}
            <p class="xs muted" style="text-align:center">Demo: status pesanan diubah dari <a href="#/admin/pesanan" style="text-decoration:underline">panel admin</a>.</p>
          </div>
        </aside>
      </div>
    </div>`,
    mount(root) {
      root.querySelector('#simPay')?.addEventListener('click', () => { st.payOrder(o.id); toast('Pembayaran diterima', { icon: 'check' }); });
      root.querySelector('#cancel')?.addEventListener('click', () => { if (confirmBox('Batalkan pesanan ini?')) { const e = st.cancelOrder(o.id); toast(e || 'Pesanan dibatalkan', { icon: e ? 'x' : 'check' }); } });
      root.querySelector('#again')?.addEventListener('click', () => { const n = st.buyAgain(o.id); toast(n ? `${n} produk masuk keranjang` : 'Stok produk sedang habis', { icon: n ? 'check' : 'x', link: n ? { href: '#/keranjang', text: 'Lihat' } : null }); });
      const left = root.querySelector('#payLeft');
      let t;
      if (left) {
        const tick = () => {
          const ms = Math.max(0, new Date(o.payBy) - Date.now());
          left.textContent = `${String(Math.floor(ms / 60000)).padStart(2, '0')}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`;
        };
        tick();
        t = setInterval(tick, 1000);
      }
      return () => clearInterval(t);
    },
  };
}

// ---------------------------------------------------------
// AKUN
// ---------------------------------------------------------
export function account({ params }) {
  const u = st.currentUser();
  if (!u) { go('#/masuk?next=akun'); return { html: '' }; }
  const tab = params[0] || 'ringkasan';
  const tier = st.tierOf(u);
  const orders = st.ordersOfUser();
  const nav = [['ringkasan', 'Ringkasan', 'user'], ['pesanan', 'Pesanan saya', 'box'], ['alamat', 'Alamat', 'pin'], ['profil', 'Profil', 'settings']];
  let content = '';
  if (tab === 'ringkasan') {
    const pct = tier.next ? Math.min(100, Math.round((u.spent / tier.next.min) * 100)) : 100;
    const active = orders.filter((o) => !['selesai', 'dibatalkan'].includes(o.status));
    content = `<div class="stack" style="gap:16px">
      <div class="member-card ${tier.id}">
        <div class="row-between"><div><div class="small" style="opacity:.85">Member ${tier.name}</div><b style="font-size:18px">${esc(u.name)}</b></div>${icon('gift', 28)}</div>
        <div><div class="small" style="opacity:.85">Poin kamu</div><div class="pts">${num(u.points)}</div><div class="xs" style="opacity:.85">≈ ${rp(u.points * POINT_RULES.pointValue)} potongan belanja</div></div>
        <div>${tier.next ? `<div class="row-between xs" style="margin-bottom:6px"><span>Belanja ${rp(u.spent)}</span><span>${tier.next.name}: ${rp(tier.next.min)}</span></div><div class="progress"><i style="width:${pct}%"></i></div>` : '<div class="xs">Level tertinggi. Terima kasih sudah setia belanja!</div>'}</div>
      </div>
      <div class="kpis" style="grid-template-columns:repeat(3,minmax(0,1fr))">
        <div class="kpi"><span class="lbl">Total pesanan</span><span class="val">${orders.length}</span></div>
        <div class="kpi"><span class="lbl">Sedang berjalan</span><span class="val">${active.length}</span></div>
        <div class="kpi"><span class="lbl">Wishlist</span><span class="val">${S().wishlist.length}</span></div>
      </div>
      <div class="card card-pad"><div class="row-between" style="margin-bottom:12px"><h3 style="font-size:16px">Pesanan terbaru</h3><a href="#/akun/pesanan" class="small bold" style="color:var(--brand-700)">Semua</a></div>
        ${orders.length ? `<div class="stack" style="gap:10px">${orders.slice(0, 3).map(orderRow).join('')}</div>` : emptyState('box', 'Belum ada pesanan', 'Pesanan pertamamu akan muncul di sini.', '<a class="btn btn-primary" href="#/">Mulai belanja</a>')}
      </div>
    </div>`;
  } else if (tab === 'pesanan') {
    content = `<div class="card card-pad"><h2 style="font-size:20px;margin-bottom:14px">Pesanan saya</h2>
      ${orders.length ? `<div class="stack" style="gap:10px">${orders.map(orderRow).join('')}</div>` : emptyState('box', 'Belum ada pesanan', 'Yuk mulai belanja kebutuhan harian.', '<a class="btn btn-primary" href="#/">Mulai belanja</a>')}</div>`;
  } else if (tab === 'alamat') {
    content = `<div class="card card-pad"><div class="row-between" style="margin-bottom:14px"><h2 style="font-size:20px">Alamat</h2><button class="btn btn-primary btn-sm" id="newAddr">${icon('plus', 16)} Tambah</button></div>
      ${u.addresses.length ? `<div class="stack" style="gap:10px">${u.addresses.map((a) => `<div class="order-row"><div><b>${esc(a.label)}</b> · ${esc(a.name)} · ${esc(a.phone)}<div class="small muted">${esc(a.detail)}</div>${a.note ? `<div class="xs muted">Patokan: ${esc(a.note)}</div>` : ''}</div><div class="row"><button class="btn btn-outline btn-sm" data-edit-addr="${a.id}">Ubah</button><button class="btn btn-ghost btn-sm" data-del-addr="${a.id}" aria-label="Hapus">${icon('trash', 16)}</button></div></div>`).join('')}</div>`
        : emptyState('pin', 'Belum ada alamat', 'Tambahkan alamat untuk pesanan diantar.')}</div>`;
  } else {
    content = `<div class="card card-pad"><h2 style="font-size:20px;margin-bottom:14px">Profil</h2>
      <form id="profForm" class="form-grid">
        <div class="field full"><label for="pn">Nama lengkap</label><input class="input" id="pn" name="name" value="${esc(u.name)}" required></div>
        <div class="field"><label for="pe">Email</label><input class="input" id="pe" name="email" value="${esc(u.email)}" type="email" required></div>
        <div class="field"><label for="pp">No. HP</label><input class="input" id="pp" name="phone" value="${esc(u.phone)}" inputmode="tel"></div>
        <div class="full"><button class="btn btn-primary">Simpan perubahan</button></div>
      </form></div>`;
  }
  return {
    html: `<div class="container"><div class="acc-layout">
      <aside class="card card-pad">
        <div class="row" style="margin-bottom:14px"><div class="avatar" style="width:46px;height:46px;font-size:16px">${esc(initials(u.name))}</div><div class="grow"><b>${esc(u.name)}</b><div class="xs muted">${tier.name} · ${num(u.points)} poin</div></div></div>
        <nav class="acc-nav">${nav.map(([k, l, ic]) => `<a href="#/akun/${k}" class="${tab === k ? 'on' : ''}">${icon(ic, 18)} ${l}</a>`).join('')}
          <a href="#/wishlist">${icon('heart', 18)} Wishlist</a>
          <a href="#" id="logout" style="color:var(--danger)">${icon('logout', 18)} Keluar</a></nav>
      </aside>
      <div>${content}</div>
    </div></div>`,
    mount(root) {
      root.querySelector('#logout').onclick = (e) => { e.preventDefault(); st.logout(); go('#/'); toast('Kamu sudah keluar'); };
      root.querySelector('#newAddr')?.addEventListener('click', () => addressForm(null));
      root.querySelectorAll('[data-edit-addr]').forEach((b) => (b.onclick = () => addressForm(u.addresses.find((a) => a.id === b.dataset.editAddr))));
      root.querySelectorAll('[data-del-addr]').forEach((b) => (b.onclick = () => { if (confirmBox('Hapus alamat ini?')) st.deleteAddress(b.dataset.delAddr); }));
      root.querySelector('#profForm')?.addEventListener('submit', (e) => { e.preventDefault(); st.updateProfile(Object.fromEntries(new FormData(e.target))); toast('Profil tersimpan', { icon: 'check' }); });
    },
  };
}
export const initials = (n) => String(n || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

function orderRow(o) {
  const br = st.branchById(o.branchId);
  return `<a class="order-row" href="#/pesanan/${o.id}">
    <div class="grow"><div class="row" style="flex-wrap:wrap;gap:8px"><b>${o.no}</b>${statusPill(o.status, STATUS[o.status])}</div>
      <div class="xs muted" style="margin-top:4px">${fmtDate(o.createdAt)} · ${o.method === 'pickup' ? 'Ambil di' : 'Diantar dari'} ${esc(br?.name || '')}</div>
      <div class="thumbs">${o.items.slice(0, 5).map((it) => { const p = st.productById(it.id); return `<div>${p ? packshot(p) : ''}</div>`; }).join('')}${o.items.length > 5 ? `<span class="xs muted" style="align-self:center">+${o.items.length - 5}</span>` : ''}</div>
    </div>
    <div style="text-align:right"><div class="xs muted">Total</div><b>${rp(o.total)}</b><div style="margin-top:8px;color:var(--brand-700)">${icon('chevR', 18)}</div></div>
  </a>`;
}

// ---------------------------------------------------------
// MASUK / DAFTAR
// ---------------------------------------------------------
export function auth({ query }) {
  if (st.currentUser()) { go(query.get('next') ? '#/' + query.get('next') : '#/akun'); return { html: '' }; }
  const reg = query.get('daftar') === '1';
  const next = query.get('next');
  return {
    html: `<div class="container"><div class="auth card card-pad stack" style="gap:18px">
      <div style="text-align:center"><div style="display:inline-block">${logo(56)}</div><h1 style="font-size:24px;margin-top:10px">${reg ? 'Daftar member gratis' : 'Masuk ke akunmu'}</h1>
        <p class="small muted" style="margin-top:6px">${reg ? 'Langsung dapat 100 poin selamat datang.' : 'Lacak pesanan, kumpulkan poin, dan checkout lebih cepat.'}</p></div>
      <div class="tabs" role="tablist"><button class="${!reg ? 'on' : ''}" data-tab="0" role="tab">Masuk</button><button class="${reg ? 'on' : ''}" data-tab="1" role="tab">Daftar</button></div>
      ${reg ? `<form id="regForm" class="stack">
          <div class="field"><label for="rn">Nama lengkap</label><input class="input" id="rn" name="name" required autocomplete="name"></div>
          <div class="field"><label for="re">Email</label><input class="input" id="re" name="email" type="email" required autocomplete="email"></div>
          <div class="field"><label for="rp">No. HP</label><input class="input" id="rp" name="phone" inputmode="tel" autocomplete="tel"></div>
          <div class="field"><label for="rpw">Password</label><input class="input" id="rpw" name="password" type="password" minlength="6" required autocomplete="new-password"></div>
          <button class="btn btn-primary btn-lg">Daftar & dapat 100 poin</button>
        </form>`
        : `<form id="loginForm" class="stack">
          <div class="field"><label for="le">Email</label><input class="input" id="le" name="email" type="email" required autocomplete="email"></div>
          <div class="field"><label for="lp">Password</label><input class="input" id="lp" name="password" type="password" required autocomplete="current-password"></div>
          <button class="btn btn-primary btn-lg">Masuk</button>
          <button type="button" class="btn btn-outline" id="demoLogin">Coba akun demo</button>
        </form>`}
      <div class="demo-note">Akun demo: <b>demo@limart.id</b> / <b>demo123</b><br>Admin: <a href="#/admin" style="text-decoration:underline">panel admin</a> (admin / admin123)</div>
    </div></div>`,
    mount(root) {
      const done = () => { toast('Selamat datang!', { icon: 'check' }); go(next ? '#/' + next : '#/akun'); };
      root.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => go(`#/masuk?${b.dataset.tab === '1' ? 'daftar=1&' : ''}${next ? 'next=' + next : ''}`)));
      root.querySelector('#loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.target));
        const err = st.login(f.email, f.password);
        if (err) toast(err, { icon: 'x' }); else done();
      });
      root.querySelector('#demoLogin')?.addEventListener('click', () => { st.login('demo@limart.id', 'demo123'); done(); });
      root.querySelector('#regForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const err = st.register(Object.fromEntries(new FormData(e.target)));
        if (err) toast(err, { icon: 'x' }); else done();
      });
    },
  };
}

// ---------------------------------------------------------
// WISHLIST, PROMO, TOKO, 404
// ---------------------------------------------------------
export function wishlist() {
  const list = S().wishlist.map(st.productById).filter(Boolean);
  return {
    html: `<div class="container"><h1 class="page-title">Wishlist <span class="muted" style="font-size:18px">(${list.length})</span></h1>
      ${list.length ? `<div class="grid-products">${list.map((p) => productCard(p)).join('')}</div>`
        : `<div class="card">${emptyState('heart', 'Wishlist masih kosong', 'Tap ikon hati di produk untuk menyimpannya di sini.', '<a class="btn btn-primary" href="#/">Jelajahi produk</a>')}</div>`}</div>`,
  };
}

export function promo() {
  const flash = st.products().filter((p) => st.discountPct(p) > 0).sort((a, b) => st.discountPct(b) - st.discountPct(a));
  return {
    html: `<div class="container">
      <h1 class="page-title">Promo & Voucher</h1>
      <div class="vouchers">${S().vouchers.filter((v) => v.active).map(voucherCard).join('')}</div>
      <section class="section card card-pad">
        <h2 style="font-size:20px;margin-bottom:12px">Cara kerja poin member</h2>
        <div class="services" style="margin-top:0">
          <div class="service" style="box-shadow:none;background:var(--bg)"><div class="ic" style="background:#fff">${icon('cart', 20)}</div><div><b>Belanja</b><span>1 poin tiap Rp1.000</span></div></div>
          <div class="service" style="box-shadow:none;background:var(--bg)"><div class="ic" style="background:#fff">${icon('gift', 20)}</div><div><b>Kumpulkan</b><span>Poin masuk saat pesanan selesai</span></div></div>
          <div class="service" style="box-shadow:none;background:var(--bg)"><div class="ic" style="background:#fff">${icon('tag', 20)}</div><div><b>Tukar</b><span>1 poin = ${rp(POINT_RULES.pointValue)} saat checkout</span></div></div>
          <div class="service" style="box-shadow:none;background:var(--bg)"><div class="ic" style="background:#fff">${icon('star', 20)}</div><div><b>Naik level</b><span>Gold 1,5x · Platinum 2x</span></div></div>
        </div>
      </section>
      <section class="section"><div class="section-head"><h2>Semua produk promo</h2></div>
        <div class="grid-products">${flash.map((p) => productCard(p, { flash: p.tags.includes('flash') })).join('')}</div></section>
    </div>`,
  };
}

export function stores() {
  return {
    html: `<div class="container"><h1 class="page-title">Cabang Lazy Innovator Mart</h1>
      <p class="muted" style="margin:-6px 0 18px">Pilih toko terdekat. Harga & stok yang tampil mengikuti toko pilihanmu.</p>
      <div class="stores">${S().branches.map(storeCard).join('')}</div></div>`,
  };
}

export function notFound(msg = 'Halaman tidak ditemukan') {
  return { html: `<div class="container"><div class="card" style="margin-top:24px">${emptyState('search', msg, 'Link mungkin salah atau sudah tidak tersedia.', '<a class="btn btn-primary" href="#/">Kembali ke beranda</a>')}</div></div>` };
}

// ---------------------------------------------------------
// Pilih cabang (modal)
// ---------------------------------------------------------
export function branchPicker() {
  modal({
    title: 'Pilih toko',
    body: `<p class="small muted" style="margin-bottom:12px">Harga, stok, dan jadwal ambil/antar mengikuti toko yang kamu pilih.</p>
      <div class="stack" style="gap:10px">${S().branches.map((b) => `<button class="opt ${b.id === S().branchId ? 'on' : ''}" data-pick-branch="${b.id}">
        <div class="ic">${icon('store', 20)}</div><div class="grow"><b>${esc(b.name)}</b><span>${esc(b.address)}</span><span class="xs" style="display:block;margin-top:2px">${b.is24 ? 'Buka 24 jam' : `${b.open}–${b.close}`} · ± ${String(b.km).replace('.', ',')} km</span></div>
        <span class="open-pill ${isOpen(b) ? '' : 'closed'}">${isOpen(b) ? 'Buka' : 'Tutup'}</span></button>`).join('')}</div>`,
    onMount(ov) {
      ov.querySelectorAll('[data-pick-branch]').forEach((b) => (b.onclick = () => {
        st.setBranch(b.dataset.pickBranch);
        closeModal();
        toast(`Belanja dari ${esc(st.currentBranch().name)}`, { icon: 'store' });
      }));
    },
  });
}
