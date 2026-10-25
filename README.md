# Lazy Innovator Mart

Website minimarket modern: **belanja online, ambil di toko atau diantar**. Demo untuk calon klien.

Live: `https://srikantri24-collab.github.io/lazy-innovator-mart/`

## Fitur (tahap 1)

**Pelanggan**
- Beranda: slider promo, kategori, flash sale + hitung mundur, voucher, produk terlaris/baru, terakhir dilihat
- Pilih cabang toko: stok, jam buka, dan jadwal mengikuti cabang
- Pencarian dengan saran otomatis, filter kategori/harga/promo/stok, urutkan
- Detail produk: stok per cabang, jumlah, beli sekarang, produk serupa
- Keranjang, wishlist
- Checkout: ambil di toko / diantar (+ antar kilat), jadwal, alamat, voucher, tukar poin, QRIS / Virtual Account / bayar di kasir / COD
- Lacak pesanan dengan timeline, kode ambil di kasir, simulasi pembayaran QRIS/VA, batalkan, beli lagi
- Akun member: level Silver/Gold/Platinum, poin, riwayat pesanan, alamat, profil

**Admin** (`#/admin`, demo: admin / admin123)
- Dashboard: omzet, pesanan, laba, rata-rata belanja, grafik harian, metode bayar, omzet per cabang, produk terlaris, stok menipis
- Pesanan: filter status/cabang, cari, ubah status satu klik, detail + WhatsApp pelanggan
- Produk: tambah/ubah/hapus, harga modal/jual/promo, margin, label flash sale
- Stok per cabang (edit langsung di tabel)
- Promo & voucher, pelanggan, pengaturan toko, reset data demo

Akun pelanggan demo: `demo@limart.id` / `demo123`

## Teknologi
HTML + CSS + JavaScript (tanpa build), di-hosting gratis di GitHub Pages.
Tahap 1 menyimpan data di browser (localStorage). Semua logika data ada di `assets/js/store.js`.

## Rencana
- Tahap 2: database online (Supabase) — akun, pesanan, stok tersinkron antar perangkat
- Tahap 3: pembayaran otomatis QRIS / VA (Midtrans / Xendit sandbox)

## Struktur
```
index.html
assets/css/style.css
assets/js/
  app.js     router, header, footer, event global
  data.js    data awal: cabang, kategori, produk, voucher
  store.js   data & logika (keranjang, voucher, poin, pesanan, laporan)
  ui.js      ikon, gambar kemasan produk (SVG), kartu, modal, toast
  shop.js    halaman pelanggan
  admin.js   panel admin
```

Dibuat oleh Tim Kasir Pro · 0877-4408-8784
