// =========================================================
// Data awal (demo). Tahap 2: dipindah ke database online.
// Semua nama produk generik — bukan merek nyata.
// =========================================================

export const STORE_INFO = {
  name: 'Lazy Innovator Mart',
  short: 'LI Mart',
  tagline: 'Belanja harian, tinggal klik',
  whatsapp: '6287744088784',
  phoneDisplay: '0877-4408-8784',
  email: 'halo@lazyinnovatormart.id',
};

export const BRANCHES = [
  { id: 'sdm', name: 'LI Mart Sudirman', area: 'Jakarta Pusat', address: 'Jl. Jend. Sudirman No. 45, Jakarta Pusat', open: '00:00', close: '24:00', is24: true, km: 1.2, phone: '021-5550-0101' },
  { id: 'kmg', name: 'LI Mart Kemang', area: 'Jakarta Selatan', address: 'Jl. Kemang Raya No. 12, Jakarta Selatan', open: '07:00', close: '23:00', km: 3.8, phone: '021-5550-0102' },
  { id: 'btr', name: 'LI Mart Bintaro', area: 'Tangerang Selatan', address: 'Jl. Bintaro Utama Sektor 3A No. 8, Tangsel', open: '07:00', close: '22:00', km: 9.5, phone: '021-5550-0103' },
  { id: 'dpk', name: 'LI Mart Margonda', area: 'Depok', address: 'Jl. Margonda Raya No. 210, Depok', open: '06:00', close: '22:00', km: 14.1, phone: '021-5550-0104' },
];

export const CATEGORIES = [
  { id: 'snack', name: 'Makanan Ringan', icon: 'cookie', color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'minuman', name: 'Minuman', icon: 'cup', color: '#0EA5E9', bg: '#E0F2FE' },
  { id: 'sembako', name: 'Sembako', icon: 'wheat', color: '#B45309', bg: '#FFEDD5' },
  { id: 'instan', name: 'Mie & Instan', icon: 'bowl', color: '#DC2626', bg: '#FEE2E2' },
  { id: 'sarapan', name: 'Susu & Sarapan', icon: 'milk', color: '#2563EB', bg: '#DBEAFE' },
  { id: 'segar', name: 'Buah & Sayur', icon: 'leaf', color: '#16A34A', bg: '#DCFCE7' },
  { id: 'beku', name: 'Frozen Food', icon: 'snow', color: '#0891B2', bg: '#CFFAFE' },
  { id: 'diri', name: 'Perawatan Diri', icon: 'sparkle', color: '#DB2777', bg: '#FCE7F3' },
  { id: 'rumah', name: 'Kebersihan Rumah', icon: 'spray', color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'bayi', name: 'Ibu & Bayi', icon: 'baby', color: '#EA580C', bg: '#FFEDD5' },
];

// img: { s: bentuk kemasan, c: warna utama, a: aksen, t: teks label }
const P = (id, name, cat, price, cost, opts = {}) => ({
  id, name, cat, price, cost,
  promo: opts.promo || null,
  unit: opts.unit || 'pcs',
  tags: opts.tags || [],
  rating: opts.rating || 4.7,
  sold: opts.sold || 120,
  desc: opts.desc || '',
  img: opts.img,
  stock: opts.stock || { sdm: 40, kmg: 30, btr: 25, dpk: 20 },
  active: true,
});

export const PRODUCTS = [
  // Makanan ringan
  P('p01', 'Keripik Kentang Rumput Laut 68g', 'snack', 12500, 8200, { promo: 9900, tags: ['flash', 'best'], sold: 2140, rating: 4.8, img: { s: 'bag', c: '#16A34A', a: '#FDE047', t: 'KRIPIK' }, desc: 'Keripik kentang tipis renyah dengan taburan rumput laut gurih. Cocok untuk teman nonton dan kumpul keluarga.' }),
  P('p02', 'Biskuit Kelapa Renyah 300g', 'snack', 15900, 10500, { tags: ['best'], sold: 980, img: { s: 'box', c: '#F59E0B', a: '#FFFFFF', t: 'BISKUIT' } }),
  P('p03', 'Cokelat Batang Susu 100g', 'snack', 18500, 12000, { promo: 14900, tags: ['flash'], sold: 1320, rating: 4.9, img: { s: 'bar', c: '#7C2D12', a: '#FBBF24', t: 'COKELAT' } }),
  P('p04', 'Kacang Mete Panggang 150g', 'snack', 42000, 31000, { tags: ['new'], sold: 210, img: { s: 'jar', c: '#B45309', a: '#FEF3C7', t: 'METE' } }),
  P('p05', 'Wafer Krim Vanila 10 pcs', 'snack', 11900, 7600, { sold: 640, img: { s: 'pack', c: '#FDE68A', a: '#B45309', t: 'WAFER' } }),
  // Minuman
  P('p06', 'Air Mineral 600ml', 'minuman', 3500, 2100, { promo: 2900, tags: ['flash', 'best'], sold: 8900, rating: 4.9, unit: 'botol', img: { s: 'bottle', c: '#38BDF8', a: '#FFFFFF', t: 'AIR' } }),
  P('p07', 'Teh Melati Botol 350ml', 'minuman', 5500, 3300, { tags: ['best'], sold: 4300, unit: 'botol', img: { s: 'bottle', c: '#65A30D', a: '#FEF9C3', t: 'TEH' } }),
  P('p08', 'Kopi Susu Gula Aren 220ml', 'minuman', 9900, 6200, { promo: 7900, tags: ['flash', 'new'], sold: 2750, rating: 4.8, unit: 'botol', img: { s: 'bottle', c: '#78350F', a: '#FDE68A', t: 'KOPI' } }),
  P('p09', 'Minuman Isotonik 500ml', 'minuman', 7500, 4800, { sold: 1900, unit: 'botol', img: { s: 'bottle', c: '#1D4ED8', a: '#E0F2FE', t: 'ION' } }),
  P('p10', 'Soda Jeruk Kaleng 330ml', 'minuman', 7000, 4500, { sold: 860, unit: 'kaleng', img: { s: 'can', c: '#F97316', a: '#FFFFFF', t: 'SODA' } }),
  // Sembako
  P('p11', 'Beras Premium Pulen 5kg', 'sembako', 78000, 69000, { promo: 72500, tags: ['best'], sold: 3100, rating: 4.9, unit: 'karung', img: { s: 'sack', c: '#F5F5F4', a: '#16A34A', t: 'BERAS' } }),
  P('p12', 'Minyak Goreng Sawit 2L', 'sembako', 38500, 33500, { tags: ['best'], sold: 2600, unit: 'pouch', img: { s: 'pouch', c: '#FACC15', a: '#B45309', t: 'MINYAK' } }),
  P('p13', 'Gula Pasir Kristal 1kg', 'sembako', 17900, 15600, { sold: 2200, img: { s: 'pack', c: '#FFFFFF', a: '#2563EB', t: 'GULA' } }),
  P('p14', 'Telur Ayam Negeri 10 butir', 'sembako', 28500, 24000, { promo: 26900, tags: ['flash'], sold: 1800, unit: 'tray', img: { s: 'eggs', c: '#FDE7C8', a: '#B45309', t: 'TELUR' } }),
  P('p15', 'Tepung Terigu Serbaguna 1kg', 'sembako', 13500, 11000, { sold: 900, img: { s: 'pack', c: '#FEF3C7', a: '#DC2626', t: 'TERIGU' } }),
  P('p16', 'Kecap Manis Botol 520ml', 'sembako', 24500, 18800, { sold: 760, unit: 'botol', img: { s: 'bottle', c: '#1C1917', a: '#FBBF24', t: 'KECAP' } }),
  // Instan
  P('p17', 'Mie Goreng Instan isi 5', 'instan', 15500, 12200, { promo: 13900, tags: ['flash', 'best'], sold: 5400, rating: 4.9, unit: 'pack', img: { s: 'pack', c: '#DC2626', a: '#FDE047', t: 'MIE' } }),
  P('p18', 'Mie Kuah Ayam Bawang isi 5', 'instan', 14500, 11400, { sold: 2300, unit: 'pack', img: { s: 'pack', c: '#FDE047', a: '#DC2626', t: 'MIE KUAH' } }),
  P('p19', 'Bubur Ayam Instan Cup', 'instan', 8500, 5900, { tags: ['new'], sold: 410, img: { s: 'cup', c: '#FFFFFF', a: '#EA580C', t: 'BUBUR' } }),
  P('p20', 'Sarden Saus Tomat 425g', 'instan', 21500, 16500, { sold: 690, unit: 'kaleng', img: { s: 'can', c: '#B91C1C', a: '#FDE68A', t: 'SARDEN' } }),
  // Sarapan
  P('p21', 'Susu UHT Cokelat 1L', 'sarapan', 19900, 15200, { promo: 17500, tags: ['flash'], sold: 2100, rating: 4.8, unit: 'kotak', img: { s: 'carton', c: '#7C2D12', a: '#FFFFFF', t: 'SUSU' } }),
  P('p22', 'Susu UHT Full Cream 1L', 'sarapan', 18900, 14600, { tags: ['best'], sold: 2500, unit: 'kotak', img: { s: 'carton', c: '#2563EB', a: '#FFFFFF', t: 'SUSU' } }),
  P('p23', 'Sereal Cokelat Renyah 330g', 'sarapan', 36500, 27500, { tags: ['new'], sold: 380, unit: 'kotak', img: { s: 'box', c: '#92400E', a: '#FDE68A', t: 'SEREAL' } }),
  P('p24', 'Roti Tawar Gandum', 'sarapan', 17500, 12500, { sold: 1500, unit: 'bungkus', img: { s: 'bread', c: '#D97706', a: '#FEF3C7', t: 'ROTI' } }),
  P('p25', 'Selai Stroberi 250g', 'sarapan', 22500, 16000, { sold: 330, unit: 'toples', img: { s: 'jar', c: '#E11D48', a: '#FFE4E6', t: 'SELAI' } }),
  // Segar
  P('p26', 'Pisang Cavendish 1kg', 'segar', 26900, 19500, { tags: ['best'], sold: 1250, unit: 'kg', img: { s: 'fruit', c: '#FACC15', a: '#65A30D', t: 'PISANG' } }),
  P('p27', 'Apel Fuji Merah 1kg', 'segar', 42500, 33000, { promo: 37900, tags: ['flash'], sold: 870, unit: 'kg', img: { s: 'fruit', c: '#DC2626', a: '#65A30D', t: 'APEL' } }),
  P('p28', 'Bayam Hijau Segar 250g', 'segar', 6500, 4200, { tags: ['new'], sold: 520, unit: 'ikat', img: { s: 'leafy', c: '#16A34A', a: '#BBF7D0', t: 'BAYAM' } }),
  P('p29', 'Tomat Merah 500g', 'segar', 9900, 6800, { sold: 610, unit: 'pack', img: { s: 'fruit', c: '#EF4444', a: '#15803D', t: 'TOMAT' } }),
  // Beku
  P('p30', 'Nugget Ayam Crispy 500g', 'beku', 45900, 34500, { promo: 39900, tags: ['flash', 'best'], sold: 1670, rating: 4.8, img: { s: 'frozen', c: '#F97316', a: '#FEF3C7', t: 'NUGGET' } }),
  P('p31', 'Sosis Sapi Bakar 375g', 'beku', 38500, 28900, { sold: 940, img: { s: 'frozen', c: '#B91C1C', a: '#FDE68A', t: 'SOSIS' } }),
  P('p32', 'Es Krim Vanila 700ml', 'beku', 32500, 23500, { tags: ['new'], sold: 760, unit: 'box', img: { s: 'tub', c: '#FDE68A', a: '#DB2777', t: 'ES KRIM' } }),
  // Perawatan diri
  P('p33', 'Sabun Mandi Cair 450ml', 'diri', 27500, 19800, { promo: 23900, tags: ['flash'], sold: 1100, unit: 'pouch', img: { s: 'pump', c: '#06B6D4', a: '#FFFFFF', t: 'SABUN' } }),
  P('p34', 'Sampo Anti Ketombe 340ml', 'diri', 39500, 29000, { tags: ['best'], sold: 980, unit: 'botol', img: { s: 'tube', c: '#1E3A8A', a: '#93C5FD', t: 'SAMPO' } }),
  P('p35', 'Pasta Gigi Herbal 190g', 'diri', 16500, 11800, { sold: 1420, img: { s: 'paste', c: '#FFFFFF', a: '#16A34A', t: 'PASTA' } }),
  P('p36', 'Tisu Wajah 250 lembar', 'diri', 14500, 9800, { tags: ['best'], sold: 2050, unit: 'pack', img: { s: 'tissue', c: '#F0ABFC', a: '#FFFFFF', t: 'TISU' } }),
  // Rumah
  P('p37', 'Deterjen Bubuk 1,8kg', 'rumah', 34900, 26500, { promo: 29900, tags: ['flash', 'best'], sold: 1560, img: { s: 'box', c: '#2563EB', a: '#FDE047', t: 'DETERJEN' } }),
  P('p38', 'Sabun Cuci Piring Jeruk 780ml', 'rumah', 16900, 11500, { sold: 1890, unit: 'pouch', img: { s: 'pouch', c: '#84CC16', a: '#FEF9C3', t: 'CUCI' } }),
  P('p39', 'Pembersih Lantai Lavender 800ml', 'rumah', 19900, 13800, { sold: 720, unit: 'pouch', img: { s: 'pouch', c: '#A78BFA', a: '#FFFFFF', t: 'LANTAI' } }),
  // Bayi
  P('p40', 'Popok Celana Bayi M isi 30', 'bayi', 89000, 71000, { promo: 79900, tags: ['flash'], sold: 640, rating: 4.9, unit: 'pack', img: { s: 'pack', c: '#F9A8D4', a: '#FFFFFF', t: 'POPOK' } }),
  P('p41', 'Tisu Basah Bayi 50 lembar', 'bayi', 15900, 10900, { sold: 980, unit: 'pack', img: { s: 'tissue', c: '#7DD3FC', a: '#FFFFFF', t: 'TISU' } }),
  P('p42', 'Minyak Telon Bayi 60ml', 'bayi', 24900, 17500, { tags: ['new'], sold: 300, unit: 'botol', img: { s: 'bottle', c: '#FBBF24', a: '#FFFFFF', t: 'TELON' } }),
];

// Beberapa stok dibuat tipis supaya peringatan stok terlihat di demo
PRODUCTS.find((p) => p.id === 'p04').stock = { sdm: 4, kmg: 0, btr: 2, dpk: 6 };
PRODUCTS.find((p) => p.id === 'p32').stock = { sdm: 3, kmg: 5, btr: 0, dpk: 1 };
PRODUCTS.find((p) => p.id === 'p40').stock = { sdm: 6, kmg: 2, btr: 4, dpk: 0 };
PRODUCTS.find((p) => p.id === 'p27').stock = { sdm: 12, kmg: 3, btr: 0, dpk: 8 };

export const VOUCHERS = [
  { code: 'HEMAT10', title: 'Diskon 10%', desc: 'Min. belanja Rp75.000, maks. potongan Rp20.000', type: 'percent', value: 10, max: 20000, min: 75000, color: '#0E9F6E', active: true },
  { code: 'GRATISONGKIR', title: 'Gratis Ongkir', desc: 'Untuk pesanan diantar, min. belanja Rp50.000', type: 'shipping', value: 0, max: 15000, min: 50000, color: '#2563EB', active: true },
  { code: 'MEMBARU', title: 'Rp15rb', desc: 'Khusus pesanan pertama, min. belanja Rp60.000', type: 'fixed', value: 15000, max: 15000, min: 60000, firstOnly: true, color: '#FF7A1A', active: true },
];

export const DEMO_USERS = [
  { id: 'u1', name: 'Rina Kartika', email: 'demo@limart.id', phone: '081234567890', password: 'demo123', points: 1250, spent: 1850000,
    addresses: [{ id: 'a1', label: 'Rumah', name: 'Rina Kartika', phone: '081234567890', detail: 'Jl. Melati No. 7, RT 03/RW 05, Setiabudi, Jakarta Selatan', note: 'Pagar hijau' }] },
];

export const ADMIN = { username: 'admin', password: 'admin123' };

export const DELIVERY = {
  baseFee: 10000,
  expressFee: 5000,
  freeAbove: 150000,
};

export const POINT_RULES = {
  earnPer: 1000, // 1 poin per Rp1.000
  pointValue: 10, // 1 poin = Rp10
};

export const TIERS = [
  { id: 'silver', name: 'Silver', min: 0, perk: 'Kumpulkan poin di setiap belanja' },
  { id: 'gold', name: 'Gold', min: 1000000, perk: 'Poin 1,5x + voucher ulang tahun' },
  { id: 'platinum', name: 'Platinum', min: 5000000, perk: 'Poin 2x + gratis ongkir tiap minggu' },
];

export const STATUS = {
  menunggu_bayar: 'Menunggu Pembayaran',
  diproses: 'Diproses',
  siap_diambil: 'Siap Diambil',
  dikirim: 'Sedang Diantar',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};
