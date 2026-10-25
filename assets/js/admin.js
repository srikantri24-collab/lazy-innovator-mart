// =========================================================
// Panel admin
// =========================================================
import * as st from './store.js';
import { rp, esc, num, fmtDate, compact } from './store.js';
import { STATUS } from './data.js';
import { icon, logo, packshot, toast, modal, closeModal, statusPill, emptyState } from './ui.js';
import { initials } from './shop.js';

const S = () => st.store.state;
const go = (h) => { location.hash = h; };
const PAY = { qris: 'QRIS', va: 'Virtual Account', store: 'Bayar di kasir', cod: 'COD' };
const NEXT = {
  pickup: { menunggu_bayar: 'diproses', diproses: 'siap_diambil', siap_diambil: 'selesai' },
  delivery: { menunggu_bayar: 'diproses', diproses: 'dikirim', dikirim: 'selesai' },
};
const NEXT_LABEL = { diproses: 'Proses pesanan', siap_diambil: 'Tandai siap diambil', dikirim: 'Serahkan ke kurir', selesai: 'Selesaikan' };

const NAV = [
  ['', 'Dashboard', 'chart'],
  ['pesanan', 'Pesanan', 'box'],
  ['produk', 'Produk', 'grid'],
  ['stok', 'Stok cabang', 'store'],
  ['promo', 'Promo & voucher', 'ticket'],
  ['pelanggan', 'Pelanggan', 'users'],
  ['pengaturan', 'Pengaturan', 'settings'],
];

export function admin(ctx) {
  if (!st.isAdmin()) return login();
  const tab = ctx.params[0] || '';
  const views = { '': dashboard, pesanan: orders, produk: productsView, stok: stock, promo: promos, pelanggan: customers, pengaturan: settings };
  const view = (views[tab] || dashboard)(ctx);
  const pending = S().orders.filter((o) => ['menunggu_bayar', 'diproses'].includes(o.status)).length;
  return {
    layout: 'admin',
    html: `<div class="admin">
      <aside class="admin-side">
        <a class="logo" href="#/admin">${logo(38)}<span class="logo-text"><b>${esc(S().info.short)}</b><span>Admin</span></span></a>
        <nav>${NAV.map(([k, l, ic]) => `<a href="#/admin${k ? '/' + k : ''}" class="${tab === k ? 'on' : ''}">${icon(ic, 18)} ${l}${k === 'pesanan' && pending ? `<span class="cnt">${pending}</span>` : ''}</a>`).join('')}</nav>
        <div class="foot">
          <a class="btn btn-sm" style="background:#1F2937;color:#fff" href="#/" target="_blank" rel="noopener">${icon('external', 16)} Lihat toko</a>
          <button class="btn btn-sm btn-ghost" style="color:#FCA5A5" id="adminOut">${icon('logout', 16)} Keluar</button>
        </div>
      </aside>
      <div style="min-width:0">
        <nav class="admin-mobile-nav">${NAV.map(([k, l]) => `<a href="#/admin${k ? '/' + k : ''}" class="${tab === k ? 'on' : ''}">${l}</a>`).join('')}<a href="#/">Toko</a></nav>
        <main class="admin-main">${view.html}</main>
      </div>
    </div>`,
    mount(root, rerender) {
      root.querySelector('#adminOut').onclick = () => { st.adminLogout(); go('#/admin'); };
      return view.mount ? view.mount(root, rerender) : undefined;
    },
  };
}

function login() {
  return {
    layout: 'admin',
    html: `<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--ink);padding:16px">
      <form id="admLogin" class="card card-pad stack" style="width:100%;max-width:400px;gap:16px">
        <div class="row">${logo(44)}<div><b style="font-size:18px">${esc(S().info.name)}</b><div class="xs muted">Panel admin toko</div></div></div>
        <div class="field"><label for="au">Username</label><input class="input" id="au" name="u" required autocomplete="username"></div>
        <div class="field"><label for="ap">Password</label><input class="input" id="ap" name="p" type="password" required autocomplete="current-password"></div>
        <button class="btn btn-primary btn-lg">Masuk</button>
        <div class="demo-note">Akun demo: <b>admin</b> / <b>admin123</b></div>
        <a href="#/" class="small muted" style="text-align:center">← Kembali ke toko</a>
      </form>
    </div>`,
    mount(root) {
      root.querySelector('#admLogin').onsubmit = (e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.target));
        const err = st.adminLogin(f.u.trim(), f.p);
        if (err) toast(err, { icon: 'x' });
      };
    },
  };
}

// ---------------- Grafik SVG ----------------
function barChart(daily) {
  const W = 720, H = 260, pl = 48, pb = 28, pt = 12;
  const max = Math.max(1, ...daily.map((d) => d.revenue)) * 1.15;
  const bw = (W - pl) / daily.length;
  const y = (v) => pt + (H - pt - pb) * (1 - v / max);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => max * f);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik omzet harian">
    ${ticks.map((t) => `<line x1="${pl}" x2="${W}" y1="${y(t)}" y2="${y(t)}" stroke="#E5E7EB"/><text x="${pl - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#6B7280">${compact(t)}</text>`).join('')}
    ${daily.map((d, i) => {
      const x = pl + i * bw + bw * 0.18, w = bw * 0.64;
      const hp = (H - pt - pb) * (d.pickup / max), hd = (H - pt - pb) * (d.online / max);
      const base = H - pb;
      return `<g><title>${d.d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}: ${rp(d.revenue)} (${d.count} pesanan)</title>
        <rect x="${x}" y="${base - hp}" width="${w}" height="${hp}" fill="#0E9F6E" rx="2"/>
        <rect x="${x}" y="${base - hp - hd}" width="${w}" height="${hd}" fill="#FF7A1A" rx="2"/>
        ${i % (daily.length > 10 ? 2 : 1) === 0 ? `<text x="${x + w / 2}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#6B7280">${d.d.getDate()}/${d.d.getMonth() + 1}</text>` : ''}</g>`;
    }).join('')}
  </svg>`;
}
function donut(parts) {
  const total = parts.reduce((a, p) => a + p.v, 0) || 1;
  let acc = 0;
  const R = 54, C = 2 * Math.PI * R;
  return `<svg viewBox="0 0 160 160" style="max-width:180px;margin:0 auto" role="img" aria-label="Komposisi pembayaran">
    <circle cx="80" cy="80" r="${R}" fill="none" stroke="#F3F4F6" stroke-width="22"/>
    ${parts.map((p) => { const len = (p.v / total) * C; const s = `<circle cx="80" cy="80" r="${R}" fill="none" stroke="${p.c}" stroke-width="22" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-acc}" transform="rotate(-90 80 80)"/>`; acc += len; return s; }).join('')}
    <text x="80" y="76" text-anchor="middle" font-size="12" fill="#6B7280">Total</text>
    <text x="80" y="96" text-anchor="middle" font-size="17" font-weight="800" fill="#111827">${compact(total)}</text>
  </svg>`;
}
const delta = (a, b) => {
  if (!b) return '<span class="delta muted">—</span>';
  const d = ((a - b) / b) * 100;
  return `<span class="delta ${d >= 0 ? 'up' : 'down'}">${d >= 0 ? '▲' : '▼'} ${Math.abs(d).toFixed(0)}% vs periode lalu</span>`;
};

// ---------------- Dashboard ----------------
let dashDays = 14, dashBranch = 'all';
function dashboard() {
  const a = st.analytics(dashDays, dashBranch);
  const pays = [['qris', '#7C3AED'], ['va', '#2563EB'], ['store', '#0E9F6E'], ['cod', '#FF7A1A']].map(([k, c]) => ({ k, c, v: a.byPay[k] || 0 }));
  const low = st.lowStock(6);
  const latest = S().orders.slice(0, 6);
  const maxBranch = Math.max(1, ...a.byBranch.map((x) => x.revenue));
  return {
    html: `<div class="admin-top">
        <div><h1>Dashboard</h1><div class="small muted">${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
        <div class="row" style="flex-wrap:wrap">
          <select class="select" id="dBranch" style="width:auto;min-height:40px">${[['all', 'Semua cabang'], ...S().branches.map((b) => [b.id, b.name])].map(([k, l]) => `<option value="${k}" ${dashBranch === k ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>
          <select class="select" id="dDays" style="width:auto;min-height:40px">${[[7, '7 hari'], [14, '14 hari']].map(([k, l]) => `<option value="${k}" ${dashDays === k ? 'selected' : ''}>${l}</option>`).join('')}</select>
        </div>
      </div>
      <div class="kpis">
        <div class="kpi"><span class="lbl">${icon('chart', 16)} Omzet</span><span class="val">${rp(a.revenue)}</span>${delta(a.revenue, a.prevRevenue)}</div>
        <div class="kpi"><span class="lbl">${icon('box', 16)} Pesanan</span><span class="val">${num(a.count)}</span>${delta(a.count, a.prevCount)}</div>
        <div class="kpi"><span class="lbl">${icon('tag', 16)} Laba kotor</span><span class="val">${rp(a.profit)}</span><span class="delta muted">Margin ${a.revenue ? ((a.profit / a.revenue) * 100).toFixed(1) : 0}%</span></div>
        <div class="kpi"><span class="lbl">${icon('users', 16)} Rata-rata belanja</span><span class="val">${rp(a.aov)}</span><span class="delta muted">${num(a.customers)} pelanggan aktif</span></div>
      </div>
      <div class="admin-grid">
        <div class="panel chart"><div class="row-between" style="margin-bottom:10px;flex-wrap:wrap"><h3 style="margin:0">Omzet harian</h3><div class="legend"><span><i style="background:#0E9F6E"></i>Ambil di toko</span><span><i style="background:#FF7A1A"></i>Diantar</span></div></div>${barChart(a.daily)}</div>
        <div class="panel"><h3>Metode pembayaran</h3>${donut(pays)}
          <div class="stack" style="gap:6px;margin-top:12px">${pays.map((p) => `<div class="row-between small"><span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${p.c};margin-right:6px"></i>${PAY[p.k]}</span><b>${rp(p.v)}</b></div>`).join('')}</div>
        </div>
      </div>
      <div class="admin-grid">
        <div class="panel"><div class="row-between" style="margin-bottom:12px"><h3 style="margin:0">Pesanan terbaru</h3><a href="#/admin/pesanan" class="small bold" style="color:var(--brand-700)">Semua pesanan</a></div>
          <div class="table-wrap"><table class="table"><thead><tr><th>No.</th><th>Pelanggan</th><th>Cabang</th><th>Status</th><th class="num">Total</th></tr></thead><tbody>
            ${latest.map((o) => `<tr data-order="${o.id}" style="cursor:pointer"><td class="bold">${o.no}</td><td>${esc(o.customer.name)}</td><td class="small">${esc(st.branchById(o.branchId)?.name || '')}</td><td>${statusPill(o.status, STATUS[o.status])}</td><td class="num bold">${rp(o.total)}</td></tr>`).join('')}
          </tbody></table></div>
        </div>
        <div class="panel"><h3>Omzet per cabang</h3>
          <div class="stack" style="gap:12px">${a.byBranch.map((x) => `<div><div class="row-between small"><span>${esc(x.b.name)}</span><b>${rp(x.revenue)}</b></div><div class="stockbar" style="background:#E5E7EB;height:8px"><i style="width:${(x.revenue / maxBranch) * 100}%;background:var(--brand)"></i></div></div>`).join('')}</div>
        </div>
      </div>
      <div class="admin-grid">
        <div class="panel"><h3>Produk terlaris</h3>
          <div class="table-wrap"><table class="table"><thead><tr><th>Produk</th><th class="num">Terjual</th><th class="num">Omzet</th></tr></thead><tbody>
            ${a.top.map((t) => { const p = st.productById(t.id); return `<tr><td><div class="row"><div class="thumb">${p ? packshot(p) : ''}</div><span class="small bold">${esc(t.name)}</span></div></td><td class="num">${num(t.qty)}</td><td class="num bold">${rp(t.revenue)}</td></tr>`; }).join('')}
          </tbody></table></div>
        </div>
        <div class="panel"><div class="row-between" style="margin-bottom:12px"><h3 style="margin:0">Stok menipis</h3><a href="#/admin/stok" class="small bold" style="color:var(--brand-700)">Kelola</a></div>
          ${low.length ? `<div class="stack" style="gap:10px">${low.map((x) => `<div class="row"><div class="thumb" style="width:40px;height:40px;border-radius:10px;overflow:hidden;flex:none">${packshot(x.p)}</div><div class="grow"><div class="small bold" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(x.p.name)}</div><div class="xs muted">${esc(x.b.name)}</div></div><span class="status ${x.s === 0 ? 'st-dibatalkan' : 'st-menunggu_bayar'}">${x.s === 0 ? 'Habis' : 'Sisa ' + x.s}</span></div>`).join('')}</div>`
            : '<p class="small muted">Semua stok aman.</p>'}
        </div>
      </div>`,
    mount(root, rerender) {
      root.querySelector('#dDays').onchange = (e) => { dashDays = +e.target.value; rerender(); };
      root.querySelector('#dBranch').onchange = (e) => { dashBranch = e.target.value; rerender(); };
      root.querySelectorAll('[data-order]').forEach((tr) => (tr.onclick = () => orderModal(tr.dataset.order)));
    },
  };
}

// ---------------- Pesanan ----------------
let oFilter = 'aktif', oQuery = '', oBranch = 'all';
function orders() {
  const groups = {
    aktif: (o) => ['menunggu_bayar', 'diproses', 'siap_diambil', 'dikirim'].includes(o.status),
    semua: () => true,
    ...Object.fromEntries(Object.keys(STATUS).map((k) => [k, (o) => o.status === k])),
  };
  const count = (k) => S().orders.filter(groups[k]).length;
  const q = oQuery.toLowerCase();
  const list = S().orders.filter(groups[oFilter] || groups.semua)
    .filter((o) => oBranch === 'all' || o.branchId === oBranch)
    .filter((o) => !q || o.no.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q));
  return {
    html: `<div class="admin-top"><h1>Pesanan</h1>
        <div class="row" style="flex-wrap:wrap"><input class="input" id="oq" placeholder="Cari no. pesanan / nama" value="${esc(oQuery)}" style="width:240px;min-height:40px">
        <select class="select" id="ob" style="width:auto;min-height:40px">${[['all', 'Semua cabang'], ...S().branches.map((b) => [b.id, b.name])].map(([k, l]) => `<option value="${k}" ${oBranch === k ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
      </div>
      <div class="chips" style="margin-bottom:14px">${['aktif', 'menunggu_bayar', 'diproses', 'siap_diambil', 'dikirim', 'selesai', 'dibatalkan', 'semua'].map((k) => `<button class="chip ${oFilter === k ? 'on' : ''}" data-f="${k}">${k === 'aktif' ? 'Perlu diproses' : k === 'semua' ? 'Semua' : STATUS[k]} <b>${count(k)}</b></button>`).join('')}</div>
      <div class="panel" style="padding:0">
        ${list.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>No. pesanan</th><th>Waktu</th><th>Pelanggan</th><th>Tipe</th><th>Cabang</th><th>Bayar</th><th>Status</th><th class="num">Total</th><th></th></tr></thead><tbody>
          ${list.slice(0, 150).map((o) => { const nx = NEXT[o.method][o.status]; return `<tr>
            <td class="bold"><a href="#" data-order="${o.id}">${o.no}</a></td>
            <td class="small" style="white-space:nowrap">${fmtDate(o.createdAt, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
            <td>${esc(o.customer.name)}<div class="xs muted">${esc(o.customer.phone || '')}</div></td>
            <td class="small">${o.method === 'pickup' ? 'Ambil' : 'Antar'}${o.express ? ' ⚡' : ''}</td>
            <td class="small">${esc(st.branchById(o.branchId)?.name.replace('LI Mart ', '') || '')}</td>
            <td class="small">${PAY[o.payment]}${o.paid ? '' : '<div class="xs" style="color:var(--warn)">Belum lunas</div>'}</td>
            <td>${statusPill(o.status, STATUS[o.status])}</td>
            <td class="num bold">${rp(o.total)}</td>
            <td style="white-space:nowrap">${nx ? `<button class="btn btn-primary btn-sm" data-next="${o.id}" data-to="${nx}">${NEXT_LABEL[nx]}</button>` : ''}</td>
          </tr>`; }).join('')}
        </tbody></table></div>` : emptyState('box', 'Tidak ada pesanan', 'Belum ada pesanan dengan filter ini.')}
      </div>`,
    mount(root, rerender) {
      root.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => { oFilter = b.dataset.f; rerender(); }));
      const oq = root.querySelector('#oq');
      oq.oninput = () => { oQuery = oq.value; clearTimeout(oq._t); oq._t = setTimeout(() => { rerender(); const n = document.querySelector('#oq'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250); };
      root.querySelector('#ob').onchange = (e) => { oBranch = e.target.value; rerender(); };
      root.querySelectorAll('[data-order]').forEach((a) => (a.onclick = (e) => { e.preventDefault(); orderModal(a.dataset.order); }));
      root.querySelectorAll('[data-next]').forEach((b) => (b.onclick = () => advance(b.dataset.next, b.dataset.to)));
    },
  };
}
function advance(id, to) {
  const o = st.orderById(id);
  if (to === 'diproses' && !o.paid && ['qris', 'va'].includes(o.payment)) st.payOrder(id);
  else st.setStatus(id, to);
  toast(`${o.no}: ${STATUS[to]}`, { icon: 'check' });
}
function orderModal(id) {
  const o = st.orderById(id);
  if (!o) return;
  const br = st.branchById(o.branchId);
  const nx = NEXT[o.method][o.status];
  const wa = `https://wa.me/${String(o.customer.phone || '').replace(/^0/, '62').replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${o.customer.name}, pesanan ${o.no} dari ${S().info.name}: ${STATUS[o.status]}.`)}`;
  modal({
    title: `Pesanan ${o.no}`,
    wide: true,
    body: `<div class="row-between" style="flex-wrap:wrap;margin-bottom:14px">${statusPill(o.status, STATUS[o.status])}<span class="small muted">${fmtDate(o.createdAt)}</span></div>
      <div class="form-grid" style="margin-bottom:16px">
        <div class="card card-pad" style="box-shadow:none;background:var(--bg)"><div class="xs muted">Pelanggan</div><b>${esc(o.customer.name)}</b><div class="small">${esc(o.customer.phone || '-')}</div><div class="small muted">${esc(o.customer.email || '')}</div></div>
        <div class="card card-pad" style="box-shadow:none;background:var(--bg)"><div class="xs muted">${o.method === 'pickup' ? 'Ambil di toko' : 'Diantar' + (o.express ? ' (kilat)' : '')}</div><b>${esc(br?.name || '')}</b><div class="small">${esc(o.slot || '')}</div>${o.address ? `<div class="small muted">${esc(o.address.detail)}</div>` : ''}</div>
      </div>
      ${o.note ? `<div class="demo-note" style="margin-bottom:12px">Catatan: ${esc(o.note)}</div>` : ''}
      <table class="table"><thead><tr><th>Produk</th><th class="num">Qty</th><th class="num">Harga</th><th class="num">Subtotal</th></tr></thead><tbody>
        ${o.items.map((it) => `<tr><td class="small bold">${esc(it.name)}</td><td class="num">${it.qty}</td><td class="num">${rp(it.price)}</td><td class="num">${rp(it.price * it.qty)}</td></tr>`).join('')}
      </tbody></table>
      <div style="max-width:320px;margin-left:auto;margin-top:12px">
        <div class="sum-row"><span>Subtotal</span><span>${rp(o.subtotal)}</span></div>
        ${o.shipping ? `<div class="sum-row"><span>Ongkir</span><span>${rp(o.shipping)}</span></div>` : ''}
        ${o.discount + o.shipDiscount + o.pointsValue ? `<div class="sum-row"><span>Potongan</span><span>- ${rp(o.discount + o.shipDiscount + o.pointsValue)}</span></div>` : ''}
        <div class="sum-row total"><span>Total · ${PAY[o.payment]}</span><span>${rp(o.total)}</span></div>
        <div class="xs ${o.paid ? 'up' : 'down'}" style="text-align:right;font-weight:700">${o.paid ? 'Sudah dibayar' : 'Belum dibayar'}</div>
      </div>`,
    foot: `<a class="btn btn-outline" href="${wa}" target="_blank" rel="noopener">${icon('chat', 16)} WhatsApp</a>
      ${['menunggu_bayar', 'diproses'].includes(o.status) ? '<button class="btn btn-danger" id="mCancel">Batalkan</button>' : ''}
      ${nx ? `<button class="btn btn-primary" id="mNext">${NEXT_LABEL[nx]}</button>` : ''}`,
    onMount(ov) {
      ov.querySelector('#mNext')?.addEventListener('click', () => { advance(o.id, nx); closeModal(); });
      ov.querySelector('#mCancel')?.addEventListener('click', () => { if (confirm('Batalkan pesanan ini? Stok akan dikembalikan.')) { st.setStatus(o.id, 'dibatalkan'); closeModal(); toast('Pesanan dibatalkan'); } });
    },
  });
}

// ---------------- Produk ----------------
let pQuery = '', pCat = 'all';
function productsView() {
  const q = pQuery.toLowerCase();
  const list = S().products.filter((p) => (pCat === 'all' || p.cat === pCat) && (!q || p.name.toLowerCase().includes(q)));
  return {
    html: `<div class="admin-top"><h1>Produk <span class="muted" style="font-size:16px">(${S().products.length})</span></h1>
        <div class="row" style="flex-wrap:wrap"><input class="input" id="pq" placeholder="Cari produk" value="${esc(pQuery)}" style="width:220px;min-height:40px">
        <select class="select" id="pc" style="width:auto;min-height:40px"><option value="all">Semua kategori</option>${S().categories.map((c) => `<option value="${c.id}" ${pCat === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select>
        <button class="btn btn-primary" id="newP">${icon('plus', 18)} Produk baru</button></div>
      </div>
      <div class="panel" style="padding:0"><div class="table-wrap"><table class="table"><thead><tr><th>Produk</th><th>Kategori</th><th class="num">Harga modal</th><th class="num">Harga jual</th><th class="num">Harga promo</th><th class="num">Margin</th><th class="num">Total stok</th><th>Status</th><th></th></tr></thead><tbody>
        ${list.map((p) => { const price = st.priceOf(p); const m = price ? ((price - p.cost) / price) * 100 : 0; const ts = st.totalStock(p); return `<tr>
          <td><div class="row"><div class="thumb">${packshot(p)}</div><div><div class="small bold">${esc(p.name)}</div><div class="xs muted">${p.id.toUpperCase()} · ${num(p.sold)} terjual</div></div></div></td>
          <td class="small">${st.categoryById(p.cat)?.name || '-'}</td>
          <td class="num">${rp(p.cost)}</td><td class="num">${rp(p.price)}</td>
          <td class="num">${p.promo ? `<span style="color:var(--accent-600);font-weight:700">${rp(p.promo)}</span>` : '<span class="muted">-</span>'}</td>
          <td class="num ${m < 10 ? 'down' : 'up'}" style="font-weight:700">${m.toFixed(0)}%</td>
          <td class="num ${ts <= 10 ? 'down' : ''}" style="font-weight:700">${num(ts)}</td>
          <td>${p.active ? '<span class="status st-selesai">Aktif</span>' : '<span class="status st-dibatalkan">Nonaktif</span>'}</td>
          <td style="white-space:nowrap"><button class="btn btn-outline btn-sm" data-edit="${p.id}">${icon('edit', 14)} Ubah</button></td>
        </tr>`; }).join('')}
      </tbody></table></div></div>`,
    mount(root, rerender) {
      const pq = root.querySelector('#pq');
      pq.oninput = () => { pQuery = pq.value; clearTimeout(pq._t); pq._t = setTimeout(() => { rerender(); const n = document.querySelector('#pq'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250); };
      root.querySelector('#pc').onchange = (e) => { pCat = e.target.value; rerender(); };
      root.querySelector('#newP').onclick = () => productForm(null);
      root.querySelectorAll('[data-edit]').forEach((b) => (b.onclick = () => productForm(st.productById(b.dataset.edit))));
    },
  };
}
const SHAPES = [['box', 'Kotak'], ['bag', 'Kemasan snack'], ['bottle', 'Botol'], ['can', 'Kaleng'], ['pack', 'Bungkus'], ['carton', 'Karton susu'], ['jar', 'Toples'], ['pouch', 'Pouch'], ['sack', 'Karung'], ['fruit', 'Buah'], ['leafy', 'Sayur'], ['frozen', 'Beku'], ['tub', 'Cup es krim'], ['cup', 'Cup'], ['pump', 'Botol pompa'], ['tube', 'Tube'], ['tissue', 'Tisu'], ['bread', 'Roti'], ['eggs', 'Telur'], ['bar', 'Batang']];
function productForm(p) {
  const v = p || { name: '', cat: S().categories[0].id, price: '', cost: '', promo: '', unit: 'pcs', desc: '', tags: [], img: { s: 'box', c: '#0E9F6E', a: '#FFFFFF', t: '' }, stock: Object.fromEntries(S().branches.map((b) => [b.id, 0])), active: true };
  const preview = () => {
    const f = document.querySelector('#pForm');
    if (!f) return;
    const d = Object.fromEntries(new FormData(f));
    document.querySelector('#pPrev').innerHTML = packshot({ name: d.name || 'Produk', cat: d.cat, img: { s: d.shape, c: d.color, a: d.accent, t: (d.label || d.name.split(' ')[0] || '').toUpperCase().slice(0, 9) } });
    const price = +d.promo || +d.price;
    document.querySelector('#pMargin').textContent = price ? `Margin ${(((price - +d.cost) / price) * 100).toFixed(1)}% · laba ${rp(price - +d.cost)}/${d.unit || 'pcs'}` : '';
  };
  modal({
    title: p ? 'Ubah produk' : 'Produk baru',
    wide: true,
    body: `<form id="pForm" class="form-grid" style="grid-template-columns:180px minmax(0,1fr)">
      <div class="stack" style="gap:8px"><div id="pPrev" style="border-radius:16px;overflow:hidden;aspect-ratio:1/1"></div>
        <div class="field"><label for="psh">Bentuk kemasan</label><select class="select" id="psh" name="shape">${SHAPES.map(([k, l]) => `<option value="${k}" ${v.img.s === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div class="row"><div class="field grow"><label for="pcol">Warna</label><input type="color" class="input" id="pcol" name="color" value="${v.img.c}" style="padding:4px;min-height:42px"></div><div class="field grow"><label for="pacc">Aksen</label><input type="color" class="input" id="pacc" name="accent" value="${v.img.a}" style="padding:4px;min-height:42px"></div></div>
        <div class="field"><label for="plb">Teks kemasan</label><input class="input" id="plb" name="label" value="${esc(v.img.t)}" maxlength="9"></div>
      </div>
      <div class="form-grid" style="align-content:start">
        <div class="field full"><label for="pn">Nama produk</label><input class="input" id="pn" name="name" value="${esc(v.name)}" required></div>
        <div class="field"><label for="pk">Kategori</label><select class="select" id="pk" name="cat">${S().categories.map((c) => `<option value="${c.id}" ${v.cat === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
        <div class="field"><label for="pu">Satuan</label><input class="input" id="pu" name="unit" value="${esc(v.unit)}"></div>
        <div class="field"><label for="pcost">Harga modal</label><input class="input" id="pcost" name="cost" inputmode="numeric" value="${v.cost}" required></div>
        <div class="field"><label for="pprice">Harga jual</label><input class="input" id="pprice" name="price" inputmode="numeric" value="${v.price}" required></div>
        <div class="field"><label for="ppromo">Harga promo (opsional)</label><input class="input" id="ppromo" name="promo" inputmode="numeric" value="${v.promo || ''}"></div>
        <div class="field" style="justify-content:flex-end"><span class="small bold" id="pMargin" style="color:var(--brand-700)"></span></div>
        <div class="full row" style="flex-wrap:wrap;gap:14px">
          <label class="check"><input type="checkbox" name="t_flash" ${v.tags.includes('flash') ? 'checked' : ''}> Flash sale</label>
          <label class="check"><input type="checkbox" name="t_new" ${v.tags.includes('new') ? 'checked' : ''}> Produk baru</label>
          <label class="check"><input type="checkbox" name="t_best" ${v.tags.includes('best') ? 'checked' : ''}> Terlaris</label>
          <label class="check"><input type="checkbox" name="active" ${v.active ? 'checked' : ''}> Tampil di toko</label>
        </div>
        <div class="field full"><label for="pd">Deskripsi</label><textarea class="textarea" id="pd" name="desc">${esc(v.desc)}</textarea></div>
        ${!p ? `<div class="full"><b class="small">Stok awal per cabang</b><div class="form-grid" style="grid-template-columns:repeat(2,minmax(0,1fr));margin-top:8px">${S().branches.map((b) => `<div class="field"><label for="s_${b.id}">${esc(b.name)}</label><input class="input" id="s_${b.id}" name="s_${b.id}" inputmode="numeric" value="0"></div>`).join('')}</div></div>` : ''}
      </div>
    </form>`,
    foot: `${p ? '<button class="btn btn-danger" id="pDel" style="margin-right:auto">Hapus</button>' : ''}<button class="btn btn-ghost" data-close>Batal</button><button class="btn btn-primary" form="pForm">Simpan</button>`,
    onMount(ov) {
      const f = ov.querySelector('#pForm');
      f.addEventListener('input', preview);
      preview();
      f.onsubmit = (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(f));
        const n = (x) => parseInt(String(x).replace(/\D/g, ''), 10) || 0;
        if (n(d.promo) && n(d.promo) >= n(d.price)) { toast('Harga promo harus lebih kecil dari harga jual', { icon: 'x' }); return; }
        const data = {
          ...(p || {}),
          name: d.name.trim(), cat: d.cat, unit: d.unit || 'pcs', cost: n(d.cost), price: n(d.price), promo: n(d.promo) || null, desc: d.desc,
          tags: ['flash', 'new', 'best'].filter((t) => d['t_' + t]), active: !!d.active,
          img: { s: d.shape, c: d.color, a: d.accent, t: (d.label || d.name.split(' ')[0]).toUpperCase().slice(0, 9) },
          stock: p ? p.stock : Object.fromEntries(S().branches.map((b) => [b.id, n(d['s_' + b.id])])),
        };
        st.saveProduct(data);
        closeModal();
        toast('Produk tersimpan', { icon: 'check' });
      };
      ov.querySelector('#pDel')?.addEventListener('click', () => { if (confirm(`Hapus "${p.name}"?`)) { st.deleteProduct(p.id); closeModal(); toast('Produk dihapus'); } });
    },
  });
}

// ---------------- Stok per cabang ----------------
let sQuery = '';
function stock() {
  const q = sQuery.toLowerCase();
  const list = S().products.filter((p) => !q || p.name.toLowerCase().includes(q));
  const brs = S().branches;
  return {
    html: `<div class="admin-top"><div><h1>Stok per cabang</h1><div class="small muted">Ubah angka lalu tekan Enter atau pindah kolom — tersimpan otomatis.</div></div>
        <input class="input" id="sq" placeholder="Cari produk" value="${esc(sQuery)}" style="width:240px;min-height:40px"></div>
      <div class="panel" style="padding:0"><div class="table-wrap"><table class="table"><thead><tr><th>Produk</th>${brs.map((b) => `<th class="num">${esc(b.name.replace('LI Mart ', ''))}</th>`).join('')}<th class="num">Total</th></tr></thead><tbody>
        ${list.map((p) => `<tr><td><div class="row"><div class="thumb">${packshot(p)}</div><span class="small bold">${esc(p.name)}</span></div></td>
          ${brs.map((b) => { const s = p.stock[b.id] || 0; return `<td class="num"><input class="stock-input ${s === 0 ? 'zero' : s <= 5 ? 'low' : ''}" data-p="${p.id}" data-b="${b.id}" value="${s}" inputmode="numeric" aria-label="Stok ${esc(p.name)} di ${esc(b.name)}"></td>`; }).join('')}
          <td class="num bold" data-total="${p.id}">${num(st.totalStock(p))}</td></tr>`).join('')}
      </tbody></table></div></div>`,
    mount(root, rerender) {
      const sq = root.querySelector('#sq');
      sq.oninput = () => { sQuery = sq.value; clearTimeout(sq._t); sq._t = setTimeout(() => { rerender(); const n = document.querySelector('#sq'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250); };
      root.querySelectorAll('.stock-input').forEach((inp) => {
        inp.addEventListener('change', () => {
          const v = parseInt(inp.value.replace(/\D/g, ''), 10) || 0;
          st.setStock(inp.dataset.p, inp.dataset.b, v);
        });
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') inp.blur(); });
      });
    },
  };
}

// ---------------- Promo & voucher ----------------
function promos() {
  const promoProducts = S().products.filter((p) => p.promo);
  return {
    html: `<div class="admin-top"><h1>Promo & voucher</h1><button class="btn btn-primary" id="newV">${icon('plus', 18)} Voucher baru</button></div>
      <div class="panel" style="padding:0;margin-bottom:14px"><div class="table-wrap"><table class="table"><thead><tr><th>Kode</th><th>Jenis</th><th>Nilai</th><th class="num">Min. belanja</th><th>Dipakai</th><th>Status</th><th></th></tr></thead><tbody>
        ${S().vouchers.map((v) => { const used = S().orders.filter((o) => o.voucher === v.code).length; return `<tr>
          <td><span class="code" style="font-family:ui-monospace,monospace;font-weight:800">${esc(v.code)}</span><div class="xs muted">${esc(v.desc)}</div></td>
          <td class="small">${{ percent: 'Persen', fixed: 'Potongan', shipping: 'Gratis ongkir' }[v.type]}</td>
          <td class="small bold">${v.type === 'percent' ? `${v.value}% (maks ${rp(v.max)})` : v.type === 'shipping' ? `maks ${rp(v.max)}` : rp(v.value)}</td>
          <td class="num">${rp(v.min)}</td><td class="small">${used}×</td>
          <td>${v.active ? '<span class="status st-selesai">Aktif</span>' : '<span class="status st-dibatalkan">Nonaktif</span>'}</td>
          <td><button class="btn btn-outline btn-sm" data-ev="${esc(v.code)}">${icon('edit', 14)} Ubah</button></td></tr>`; }).join('')}
      </tbody></table></div></div>
      <div class="panel"><div class="row-between" style="margin-bottom:12px"><h3 style="margin:0">Produk dengan harga promo (${promoProducts.length})</h3><span class="small muted">Atur harga promo di menu Produk</span></div>
        <div class="table-wrap"><table class="table"><thead><tr><th>Produk</th><th class="num">Normal</th><th class="num">Promo</th><th class="num">Diskon</th><th>Flash sale</th></tr></thead><tbody>
          ${promoProducts.map((p) => `<tr><td><div class="row"><div class="thumb">${packshot(p)}</div><span class="small bold">${esc(p.name)}</span></div></td><td class="num">${rp(p.price)}</td><td class="num bold" style="color:var(--accent-600)">${rp(p.promo)}</td><td class="num">${st.discountPct(p)}%</td><td>${p.tags.includes('flash') ? '<span class="status st-menunggu_bayar">Ya</span>' : '<span class="muted small">-</span>'}</td></tr>`).join('')}
        </tbody></table></div></div>`,
    mount(root) {
      root.querySelector('#newV').onclick = () => voucherForm(null);
      root.querySelectorAll('[data-ev]').forEach((b) => (b.onclick = () => voucherForm(S().vouchers.find((v) => v.code === b.dataset.ev))));
    },
  };
}
function voucherForm(v) {
  const x = v || { code: '', title: '', desc: '', type: 'percent', value: 10, max: 20000, min: 50000, color: '#0E9F6E', active: true };
  modal({
    title: v ? 'Ubah voucher' : 'Voucher baru',
    body: `<form id="vForm" class="form-grid">
      <div class="field"><label for="vc">Kode</label><input class="input" id="vc" name="code" value="${esc(x.code)}" required style="text-transform:uppercase"></div>
      <div class="field"><label for="vt">Jenis</label><select class="select" id="vt" name="type">${[['percent', 'Diskon persen'], ['fixed', 'Potongan rupiah'], ['shipping', 'Gratis ongkir']].map(([k, l]) => `<option value="${k}" ${x.type === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
      <div class="field full"><label for="vti">Judul</label><input class="input" id="vti" name="title" value="${esc(x.title)}" required placeholder="Contoh: Diskon 10%"></div>
      <div class="field full"><label for="vd">Keterangan</label><input class="input" id="vd" name="desc" value="${esc(x.desc)}"></div>
      <div class="field"><label for="vv">Nilai (% atau Rp)</label><input class="input" id="vv" name="value" inputmode="numeric" value="${x.value}"></div>
      <div class="field"><label for="vm">Maks. potongan (Rp)</label><input class="input" id="vm" name="max" inputmode="numeric" value="${x.max}"></div>
      <div class="field"><label for="vmin">Min. belanja (Rp)</label><input class="input" id="vmin" name="min" inputmode="numeric" value="${x.min}"></div>
      <div class="field"><label for="vcol">Warna</label><input type="color" class="input" id="vcol" name="color" value="${x.color}" style="padding:4px"></div>
      <label class="check full"><input type="checkbox" name="active" ${x.active ? 'checked' : ''}> Aktif</label>
    </form>`,
    foot: `${v ? '<button class="btn btn-danger" id="vDel" style="margin-right:auto">Hapus</button>' : ''}<button class="btn btn-ghost" data-close>Batal</button><button class="btn btn-primary" form="vForm">Simpan</button>`,
    onMount(ov) {
      ov.querySelector('#vForm').onsubmit = (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.target));
        const n = (s) => parseInt(String(s).replace(/\D/g, ''), 10) || 0;
        st.saveVoucher({ ...(v || {}), code: d.code, title: d.title, desc: d.desc, type: d.type, value: n(d.value), max: n(d.max), min: n(d.min), color: d.color, active: !!d.active }, v?.code);
        closeModal();
        toast('Voucher tersimpan', { icon: 'check' });
      };
      ov.querySelector('#vDel')?.addEventListener('click', () => { if (confirm('Hapus voucher ini?')) { st.deleteVoucher(v.code); closeModal(); } });
    },
  });
}

// ---------------- Pelanggan ----------------
function customers() {
  const rows = S().users.map((u) => {
    const os = S().orders.filter((o) => o.userId === u.id && o.status !== 'dibatalkan');
    return { u, n: os.length, total: os.reduce((a, o) => a + o.total, 0), last: os[0]?.createdAt, tier: st.tierOf(u) };
  }).sort((a, b) => b.total - a.total);
  return {
    html: `<div class="admin-top"><h1>Pelanggan <span class="muted" style="font-size:16px">(${rows.length})</span></h1></div>
      <div class="panel" style="padding:0"><div class="table-wrap"><table class="table"><thead><tr><th>Pelanggan</th><th>Level</th><th class="num">Poin</th><th class="num">Pesanan</th><th class="num">Total belanja</th><th>Terakhir belanja</th><th></th></tr></thead><tbody>
        ${rows.map((r) => `<tr><td><div class="row"><div class="avatar">${esc(initials(r.u.name))}</div><div><div class="small bold">${esc(r.u.name)}</div><div class="xs muted">${esc(r.u.email)}</div></div></div></td>
          <td><span class="status ${r.tier.id === 'platinum' ? 'st-selesai' : r.tier.id === 'gold' ? 'st-menunggu_bayar' : 'st-dikirim'}">${r.tier.name}</span></td>
          <td class="num">${num(r.u.points)}</td><td class="num">${r.n}</td><td class="num bold">${rp(r.total)}</td>
          <td class="small">${r.last ? fmtDate(r.last, { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</td>
          <td>${r.u.phone ? `<a class="btn btn-outline btn-sm" target="_blank" rel="noopener" href="https://wa.me/${String(r.u.phone).replace(/^0/, '62').replace(/\D/g, '')}">${icon('chat', 14)} Chat</a>` : ''}</td></tr>`).join('')}
      </tbody></table></div></div>`,
  };
}

// ---------------- Pengaturan ----------------
function settings() {
  const i = S().info;
  return {
    html: `<div class="admin-top"><h1>Pengaturan</h1></div>
      <div class="admin-grid" style="margin-top:0">
        <form class="panel" id="infoForm"><h3>Profil toko</h3>
          <div class="form-grid">
            <div class="field full"><label for="in">Nama toko</label><input class="input" id="in" name="name" value="${esc(i.name)}" required></div>
            <div class="field"><label for="is">Nama singkat</label><input class="input" id="is" name="short" value="${esc(i.short)}"></div>
            <div class="field"><label for="it">Tagline</label><input class="input" id="it" name="tagline" value="${esc(i.tagline)}"></div>
            <div class="field"><label for="iw">WhatsApp (format 62...)</label><input class="input" id="iw" name="whatsapp" value="${esc(i.whatsapp)}" inputmode="numeric"></div>
            <div class="field"><label for="ip">No. tampil</label><input class="input" id="ip" name="phoneDisplay" value="${esc(i.phoneDisplay)}"></div>
            <div class="field full"><label for="ie">Email</label><input class="input" id="ie" name="email" value="${esc(i.email)}" type="email"></div>
          </div>
          <button class="btn btn-primary" style="margin-top:14px">Simpan</button>
        </form>
        <div class="panel stack"><h3 style="margin:0">Data demo</h3>
          <p class="small muted">Semua data saat ini tersimpan di browser ini (mode demo). Di tahap 2, data dipindah ke database online sehingga sama di semua perangkat.</p>
          <button class="btn btn-danger" id="resetAll">${icon('refresh', 16)} Reset semua data demo</button>
          <h3 style="margin:12px 0 0">Cabang</h3>
          ${S().branches.map((b) => `<div class="small"><b>${esc(b.name)}</b><div class="muted">${esc(b.address)} · ${b.is24 ? '24 jam' : `${b.open}–${b.close}`}</div></div>`).join('')}
        </div>
      </div>`,
    mount(root) {
      root.querySelector('#infoForm').onsubmit = (e) => { e.preventDefault(); st.saveInfo(Object.fromEntries(new FormData(e.target))); toast('Pengaturan tersimpan', { icon: 'check' }); };
      root.querySelector('#resetAll').onclick = () => { if (confirm('Reset semua produk, pesanan, dan akun ke data awal?')) { st.store.reset(); toast('Data demo direset'); } };
    },
  };
}
