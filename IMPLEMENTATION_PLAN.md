# Rencana Implementasi: SPLASH (Sistem Persamaan Linear Asyik dan Seru)

**SPLASH** adalah media pembelajaran interaktif berbasis web untuk materi Sistem Persamaan Linear Dua Variabel (SPLDV) kelas VIII SMP, dengan dua peran pengguna: **Siswa** dan **Guru**.

---

## 1. Struktur Folder dan Berkas

```
/d/MPM/
├── assets/
│   ├── images/         # Vektor SVG: logo SPLASH, timbangan, roti, susu, karakter siswa, bintang
│   └── icons/          # Ikon SVG UI (navigasi, aksi, status)
├── css/
│   ├── variables.css   # Variabel warna (#0B3D91, #1E6FD9, dll.), tipografi, radius, bayangan
│   ├── base.css        # Reset, font Poppins/Nunito, utilitas tata letak, tema, aksesibilitas
│   ├── layout.css      # Header, sidebar responsif, grid, drawer hamburger
│   ├── components.css  # Tombol (>=44px), kartu, modal bantuan, badge, tooltip, form, slider
│   ├── balance.css     # Style timbangan SVG/Canvas, balok interaktif, animasi kesetaraan
│   └── print.css       # Format cetak rapi untuk LKPD dan laporan guru
├── js/
│   ├── app.js          # Entry point utama, inisialisasi aplikasi, guard rute
│   ├── router.js       # Hash router (#/login, #/beranda, #/guru/..., dll.)
│   ├── state.js        # Sesi pengguna aktif & reactive state
│   ├── services/
│   │   ├── storage.js  # SATU-SATUNYA akses data (abstraksi localStorage -> siap migrasi Firebase)
│   │   ├── crypto.js   # Hash kata sandi Web Crypto SHA-256
│   │   └── seed-data.js# Data awal (Guru demo, 3 siswa demo, bank soal misi, materi awal)
│   ├── utils/
│   │   ├── math-parser.js     # Parser persamaan aljabar (toleransi spasi & urutan suku)
│   │   ├── balance-engine.js  # Engine perhitungan kesetaraan ruas kiri/kanan & rotasi timbangan
│   │   └── dom-helpers.js     # Helper manipulasi DOM & Pointer Events drag-and-drop
│   ├── views/
│   │   ├── auth-view.js       # Form login & registrasi (Siswa & Guru, pilih role, toggle pass)
│   │   ├── student/
│   │   │   ├── home-view.js          # Beranda siswa & navigasi awal
│   │   │   ├── materi-view.js        # Modul materi SPLDV + kuis pemahaman interaktif
│   │   │   ├── kontekstual-view.js   # Masalah kantin sekolah (roti & susu) + input pemodelan
│   │   │   ├── simulasi-view.js      # 2 Timbangan SVG dengan operasi kedua ruas & drag-drop
│   │   │   ├── eksplorasi-view.js    # Slider x & y, uji simultan, tabel pengamatan
│   │   │   ├── eliminasi-view.js     # Lab eliminasi bertahap, animasi eliminasi suku
│   │   │   ├── tantangan-view.js     # Misi bertingkat (mudah, sedang, sulit) + feedback cerdas
│   │   │   ├── lkpd-view.js          # LKPD digital, integrasi data eksplorasi, refleksi, cetak/kirim
│   │   │   └── tentang-view.js       # Info pengembang & capaian pembelajaran
│   │   └── teacher/
│   │       ├── dashboard-view.js     # Ringkasan statistik, kartu analitik kelas
│   │       ├── class-view.js         # Manajemen siswa (reset password, hapus, copy kode kelas)
│   │       ├── progress-view.js      # Tabel progres siswa & visualisasi grafik SVG
│   │       ├── lkpd-review-view.js   # Review LKPD siswa, form nilai + komentar, ekspor CSV
│   │       ├── missions-admin-view.js# CRUD Bank Soal Misi
│   │       └── guide-view.js         # Panduan guru & pertanyaan pemantik diskusi
├── index.html          # Shell aplikasi SPA utama
├── test.html           # Halaman unit test otomatis untuk logika matematika & storage
└── README.md           # Panduan instalasi, struktur, akun demo, & instruksi migrasi Firebase/Supabase
```

---

## 2. Alur Data dan Arsitektur Storage Service

Seluruh komponen mematuhi aturan ketat: **tidak ada pemanggilan `localStorage` di luar `js/services/storage.js`**.

### Model Data Utama:
- **`Users`**: `{ id, username, passwordHash, role: 'siswa'|'guru', name, classCode, className, createdAt }`
- **`Classes`**: `{ code: 'SPLDV8', name: 'VIII-A', teacherId, createdAt }`
- **`Progress`**: `{ userId, completedStages: [...], currentStage, missionProgress: {}, explorationTrials: [...], lastActive }`
- **`LKPD`**: `{ id, studentId, studentName, classCode, explorationData, eliminationSteps, reflection1, reflection2, conclusion, submittedAt, status: 'draft'|'submitted'|'reviewed', score, teacherFeedback }`
- **`Missions`**: `{ id, title, story, difficulty: 'mudah'|'sedang'|'sulit', eq1, eq2, solutionX, solutionY, hint, order }`

### Fungsi Storage Service API:
- `registerUser(userObj)`
- `login(username, passwordPlain)` -> verifikasi via `crypto.js`
- `logout()` / `getCurrentUser()`
- `getProgress(studentId)` / `saveProgress(studentId, progressPatch)`
- `saveLKPD(lkpdObj)` / `getLKPD(studentId)` / `getLKPDByClass(classCode)` / `gradeLKPD(lkpdId, score, feedback)`
- `getStudentsByClass(classCode)` / `resetStudentPassword(studentId, newPasswordPlain)` / `deleteStudent(studentId)`
- `getMissions()` / `saveMission(missionObj)` / `deleteMission(missionId)`
- `getTeacherAnalytics(classCode)`

---

## 3. Desain Komponen Matematika & Interaktivitas

1. **Parser Persamaan (`math-parser.js`)**:
   - Memparse persamaan linear `ax + by = c`
   - Normalisasi spasi dan huruf besar/kecil (`2x + y = 11`, `y + 2x = 11`, `2x+1y=11`, `+2x + y = 11`)
   - Verifikasi ekuivalensi bentuk aljabar dan pengecekan substitusi nilai `(x, y)`

2. **Simulasi Timbangan SVG (`balance-engine.js` & `simulasi-view.js`)**:
   - Timbangan memiliki dua cawan (kiri: balok `x`, balok `y`, dan balok angka; kanan: balok angka/variabel)
   - Sudut kemiringan balok dihitung secara proporsional berdasarkan selisih berat:
     `beratKiri = (x_count * 3) + (y_count * 5) + (konstantaKiri)`
     `beratKanan = konstantaKanan`
     Jika `beratKiri == beratKanan` -> sudut = 0° (seimbang sempurna), jika beda -> miring maksimal ±15° dengan animasi transisi pegas (spring damping).
   - Operasi kedua ruas: Tambah (+), Kurang (-), Kali (x), Bagi (:), Batal (Undo), Reset.
   - Peringatan instan apabila pengguna hanya mengubah satu ruas tanpa menerapkan prinsip kesetaraan.

3. **Laboratorium Eliminasi**:
   - Visualisasi perkalian persamaan untuk menyamakan koefisien `x` atau `y`.
   - Animasi eliminasi visual (suku sejenis tersorot lalu memudar/coret dengan efek transisi CSS).
   - Tahap substitusi variabel yang telah ditemukan ke salah satu persamaan asal.

---

## 4. Rencana Tahapan Eksekusi

1. **Fase 1: Fondasi & Basis Data (Storage & Math Engine)**
   - Buat `variables.css`, `base.css`, `layout.css`, `components.css`, `balance.css`, `print.css`.
   - Buat `crypto.js` (Web Crypto SHA-256), `seed-data.js` (demo data lengkap).
   - Buat `storage.js` lengkap dengan semua CRUD method & fallback inisialisasi.
   - Buat `math-parser.js` dan `balance-engine.js`.
   - Buat `test.html` untuk memvalidasi algoritma math & storage service.

2. **Fase 2: Shell Aplikasi, Router & Autentikasi**
   - Buat `index.html` dengan header, navigasi sidebar responsif, dan modal bantuan.
   - Buat `router.js` dan `auth-view.js` (login/register siswa & guru, password hash, proteksi rute).

3. **Fase 3: 8 Halaman Siswa**
   - Beranda, Materi (dengan kuis interaktif), Masalah Kontekstual (kantin).
   - Simulasi 2 Timbangan SVG (Pointer Events drag-and-drop, operasi ruas, rotasi fisika).
   - Eksplorasi nilai x dan y (slider, auto-check, tabel riwayat).
   - Laboratorium Eliminasi (step-by-step, animasi cross-out suku sejenis).
   - Tantangan Misi (5+ misi bank soal, validasi, petunjuk berjenjang).
   - LKPD Digital (auto-fill dari eksplorasi, refleksi, cetak rapi, status penilaian) & Halaman Tentang.

4. **Fase 4: Dashboard Guru Lengkap**
   - Ringkasan analitik kelas & grafik batang SVG progres siswa.
   - Manajemen kelas & akun siswa (salin kode kelas, reset kata sandi, hapus).
   - Tabel progres & aktivitas siswa.
   - Review dan penilaian LKPD (skor, komentar, ekspor CSV, cetak).
   - CRUD Bank Soal Misi.
   - Panduan guru & pertanyaan pemantik diskusi + fitur "Pratinjau Siswa".

5. **Fase 5: Pengujian, Verifikasi Alur & Dokumentasi**
   - Jalankan `test.html` dan server lokal.
   - Uji alur E2E: registrasi/login siswa -> selesaikan simulasi & eksplorasi -> kirim LKPD -> login guru -> beri nilai -> cek di sisi siswa.
   - Dokumentasikan di `README.md` (cara pakai, akun demo, arsitektur, panduan migrasi Firebase/Supabase).
