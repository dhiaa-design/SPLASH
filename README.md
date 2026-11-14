# SPLASH – Sistem Persamaan Linear Asyik dan Seru

**SPLASH** adalah media pembelajaran interaktif berbasis web untuk mata pelajaran Matematika, materi **Sistem Persamaan Linear Dua Variabel (SPLDV)** dengan sasaran peserta didik kelas VIII SMP (Fase D Kurikulum Merdeka).

Media ini dirancang dengan tema tetesan air/percikan (*splash*) berwarna biru yang dipadukan dengan timbangan dua lengan dan balok aljabar interaktif. Dua peran pengguna didukung secara penuh: **SISWA** (pengguna utama) dan **GURU** (fasilitator).

---

## 1. Akun Demo Siap Pakai

Sistem telah dilengkapi dengan data awal (*seed data*) otomatis:

| Peran | Nama Pengguna (*Username*) | Kata Sandi (*Password*) | Keterangan / Kode Kelas |
| :--- | :--- | :--- | :--- |
| **Guru** | `guru` | `guru123` | Fasilitator Kelas VIII-A (Kode: **SPLDV8**) |
| **Siswa 1** | `siswa1` | `siswa123` | Andi Pratama (Sudah ada data eksplorasi & draf LKPD) |
| **Siswa 2** | `siswa2` | `siswa123` | Citra Dewi (Kelas VIII-A) |
| **Siswa 3** | `siswa3` | `siswa123` | Doni Saputra (Kelas VIII-A) |

> 🔒 **Keamanan Sandi:** Kata sandi di-hash menggunakan **Web Crypto API (SHA-256)** sebelum disimpan. Teks asli kata sandi tidak pernah disimpan dalam penyimpanan.

---

## 2. Struktur Folder Proyek

```
d:/MPM/
├── assets/
│   └── images/             # Ilustrasi SVG: logo SPLASH, roti (x), susu (y), avatar siswa
├── css/
│   ├── variables.css       # Definisi CSS custom properties (palet biru, font, radius, transisi)
│   ├── base.css            # Reset, Google Fonts (Poppins & Nunito), utilitas
│   ├── layout.css          # Header, sidebar responsif, drawer mobile, grid
│   ├── components.css      # Tombol >=44px, kartu membulat 16px, badge, slider, toast
│   ├── balance.css         # Styling timbangan SVG, balok aljabar, animasi kesetaraan
│   └── print.css           # Format cetak rapi untuk LKPD dan laporan rekap guru
├── js/
│   ├── app.js              # Entry point aplikasi, header, sidebar, help modals
│   ├── router.js           # Hash-based routing (#/...) dengan proteksi rute
│   ├── state.js            # State reactive & mode pratinjau guru
│   ├── services/
│   │   ├── storage.js      # SATU-SATUNYA gerbang data (abstraksi penyimpanan lengkap)
│   │   ├── crypto.js       # Hashing SHA-256 via Web Crypto
│   │   └── seed-data.js    # Data awal guru, siswa, kelas, kuis, dan bank soal misi
│   ├── utils/
│   │   ├── math-parser.js  # Parser persamaan linear (toleransi urutan suku & spasi)
│   │   ├── balance-engine.js# Engine fisika timbangan, kesetaraan, operasi ruas, undo/reset
│   │   └── dom-helpers.js  # Toast, modal bantuan, SVG balance builder, pointer drag-drop
│   └── views/
│       ├── auth-view.js    # Login & registrasi akun siswa/guru (toggle show password)
│       ├── student/        # 8 Halaman Siswa (Beranda, Materi, Kontekstual, Simulasi, Eksplorasi, Eliminasi, Tantangan, LKPD, Tentang)
│       └── teacher/        # 6 Halaman Guru (Dashboard, Kelas, Progres, Review LKPD, Bank Misi, Panduan)
├── index.html              # Shell aplikasi utama
├── test.html               # Pengujian otomatis algoritma aljabar, timbangan, & storage
├── IMPLEMENTATION_PLAN.md  # Rencana implementasi teknis
└── README.md               # Dokumentasi lengkap & panduan migrasi
```

---

## 3. Fitur Utama Pembelajaran

### A. Fitur Siswa (8 Tahapan Terstruktur)
1. **Beranda:** Kartu navigasi pembelajaran dan indikator progres belajar real-time di sidebar.
2. **Materi SPLDV:** Konsep SPLDV, pengertian variabel, koefisien, konstanta, suku (kartu istilah interaktif yang bisa diklik), representasi visual balok aljabar, dan 3 soal kuis pemahaman mandiri berumpan balik instan.
3. **Masalah Kontekstual (Kantin):** Pemodelan harga 2 roti + 1 susu = Rp11.000 dan 1 roti + 2 susu = Rp13.000. Pemeriksa persamaan pintar mendukung variasi urutan penulisan suku (misal: `y + 2x = 11` diakui setara).
4. **Simulasi Dua Timbangan SVG:** Dua timbangan simultan dengan balok $x$, $y$, dan angka. Dilengkapi fitur *Pointer Events drag-and-drop* (berjalan di mouse dan layar sentuh HP/tablet), operasi kedua ruas (+, -, $\times$, :, $-y$), tombol *Undo* dan *Reset*, serta peringatan ketidakseimbangan jika hanya satu ruas yang diubah.
5. **Eksplorasi Nilai $x$ dan $y$:** Slider interaktif untuk menguji nilai secara simultan pada kedua persamaan, indikator status terpenuhi/belum, animasi bintang jika solusi ditemukan, dan tabel pengamatan otomatis.
6. **Laboratorium Eliminasi:** Pemilihan variabel target, pengaturan faktor pengali, animasi suku sejenis saling meniadakan, dan langkah substitusi terarah untuk menemukan penyelesaian lengkap $x=3, y=5$.
7. **Tantangan Misi Bertingkat:** Bank soal misi (mudah, sedang, sulit) dengan cerita kontekstual, validasi jawaban, petunjuk konsep cerdas berjenjang, dan penyimpanan capaian misi.
8. **LKPD Digital & Refleksi:** Identitas otomatis, tabel pengamatan terintegrasi dari tahap eksplorasi, uraian eliminasi, pertanyaan refleksi pedagogis, kesimpulan, simpan draf, kirim ke guru, cetak rapi (`@media print`), serta tampilan nilai dan ulasan guru.
9. **Tentang SPLASH:** Profil media dan capaian pembelajaran Fase D Kurikulum Merdeka.

### B. Fitur Guru (Dashboard Fasilitator)
- **Ringkasan Analitik:** Jumlah siswa, rata-rata ketuntasan progres belajar kelas, jumlah LKPD masuk, dan identifikasi misi tersulit.
- **Manajemen Kelas & Siswa:** Kode kelas unik (tombol salin sekali klik), daftar peserta didik, fitur reset kata sandi siswa, dan hapus akun siswa.
- **Pemantauan Progres:** Tabel aktivitas dan grafik batang visual SVG progres belajar per siswa.
- **Pemeriksaan & Penilaian LKPD:** Tinjauan detail jawaban siswa, form input nilai (0–100) dan komentar pedagogis guru, tombol ekspor rekap nilai ke format CSV, serta fitur cetak.
- **Bank Soal Misi (CRUD):** Tambah, ubah, dan hapus misi kontekstual secara dinamis.
- **Panduan Fasilitator:** Skenario pembelajaran tatap muka dan bank pertanyaan pemantik diskusi per tahapan materi.
- **Mode Pratinjau Siswa:** Memungkinkan guru menjelajahi seluruh simulasi dari sudut pandang siswa tanpa perlu keluar akun.

---

## 4. Cara Menjalankan Aplikasi

Aplikasi ini dibangun menggunakan **standar modern murni (HTML5, CSS3, dan Vanilla JavaScript ES Modules)** tanpa membutuhkan alat kompilasi (*build step* seperti Webpack atau Vite).

Karena menggunakan modul ES6 (`import`/`export`), jalankan aplikasi melalui web server lokal sederhana:

### Opsi A: Menggunakan Node.js (`npx serve`)
```bash
npx serve d:/MPM
```
Buka peramban di `http://localhost:3000`.

### Opsi B: Menggunakan Python
```bash
cd d:/MPM
python -m http.server 8080
```
Buka peramban di `http://localhost:8080`.

### Opsi C: Ekstensi VS Code "Live Server"
Klik kanan file `index.html` lalu pilih **"Open with Live Server"**.

---

## 5. Menjalankan Verifikasi Algoritma Otomatis

Buka berkas `test.html` di peramban:
```
http://localhost:8080/test.html
```
Halaman ini memvalidasi:
- Kriptografi Web Crypto SHA-256 dan verifikasi hash kata sandi.
- Parser persamaan aljabar (toleransi spasi dan variasi urutan suku aljabar).
- Perhitungan fisika kesetaraan timbangan (*balance engine*), operasi kedua ruas, dan *undo*.
- Penyelesaian sistem persamaan linear dua variabel menggunakan aturan Cramer ($2x+y=11$ dan $x+2y=13$ menghasilkan $x=3, y=5$).
- Penyimpanan dan pengambilan data *storage service*.

---

## 6. Panduan Peningkatan ke Cloud (Firebase / Supabase)

### Mengapa Sekarang Menggunakan LocalStorage?
Saat ini seluruh data disimpan menggunakan `localStorage` peramban. Artinya, data tersimpan pada satu peramban di perangkat yang sedang digunakan. Siswa dan guru yang menggunakan peramban yang sama dapat saling bertukar data (misal saat demonstrasi atau lab komputer bersama).

### Langkah Migrasi ke Firebase / Supabase
Kode aplikasi dirancang dengan arsitektur **Clean Architecture (Single Source of Truth Data Access)**. Seluruh interaksi data dilakukan melalui **SATU MODUL TUNGGAL: `js/services/storage.js`**. Halaman lain DILARANG memanggil `localStorage` secara langsung.

Untuk menghubungkan siswa dan guru dari perangkat yang berbeda (laptop siswa di rumah dan laptop guru di sekolah), ikuti langkah mudah berikut:

1. **Tambahkan Firebase / Supabase SDK** di `index.html`:
   ```html
   <script type="module" src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"></script>
   <script type="module" src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"></script>
   ```

2. **Perbarui fungsi di dalam `js/services/storage.js`**:
   - Ganti implementasi `getLocalItem` dan `setLocalItem` menjadi panggilan Firestore:
     - `collection('users')` untuk `login` dan `registerUser`.
     - `collection('lkpd')` untuk `saveLKPD`, `getLKPD`, dan `gradeLKPD`.
     - `collection('progress')` untuk `saveProgress` dan `getProgress`.
     - `collection('missions')` untuk `getMissions` dan `saveMission`.

3. **Selesai!** Seluruh antarmuka siswa (simulasi timbangan, lab eliminasi, LKPD) dan antarmuka guru (dashboard analitik, review LKPD) akan langsung sinkron secara *real-time* lintas perangkat tanpa mengubah satu baris pun kode tampilan (*view*).
