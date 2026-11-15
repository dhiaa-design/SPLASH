/**
 * Materi View: Bahan Ajar Lengkap SPLDV (Sistem Persamaan Linear Dua Variabel)
 * Sumber: Kristanto, Y. D., dkk. (2022). Matematika untuk SMP/MTs Kelas IX. Pusat Perbukuan Kemendikbudristek.
 */

import { saveProgress, getProgress } from '../../services/storage.js';
import { appState } from '../../state.js';
import { showToast } from '../../utils/dom-helpers.js';

export function renderMateriView(container) {
  const user = appState.getUser();

  // Tab aktif untuk 4 metode penyelesaian
  let activeMethodTab = 'grafik';

  // State untuk kuis latihan pemahaman
  let quizAnswers = {
    q1: null,
    q2_x: '',
    q2_y: '',
    q3_d: '',
    q3_a: ''
  };

  function render() {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 960px; margin: 0 auto; padding-bottom: 2rem;">
        
        <!-- Header & Breadcrumb -->
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="#/beranda" style="font-weight: 600; font-size: 0.9rem;">← Kembali ke Beranda</a>
            <span style="color: var(--color-text-light);">/</span>
            <span style="color: var(--color-primary); font-weight: 700; font-size: 0.9rem;">Bahan Ajar SPLDV</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 1rem;">
            <div>
              <span class="badge badge-info" style="margin-bottom: 0.4rem;">📘 BAHAN AJAR RESMI KEMENDIKBUDRISTEK</span>
              <h1 style="font-size: 2.1rem; line-height: 1.2; color: var(--color-primary-dark);">
                Sistem Persamaan Linear Dua Variabel (SPLDV)
              </h1>
              <p style="font-size: 0.95rem; color: var(--color-text-muted); margin-top: 0.25rem;">
                Matematika SMP/MTs Kelas VIII & IX • Kurikulum Merdeka
              </p>
            </div>
          </div>
        </div>

        <!-- Gagasan Utama Banner -->
        <div class="card card-accent-blue" style="border-left: 6px solid var(--color-primary); padding: 1.5rem;">
          <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <span style="font-size: 2.2rem; flex-shrink: 0;">💡</span>
            <div>
              <h3 style="font-size: 1.15rem; color: var(--color-primary-dark); margin-bottom: 0.35rem;">Gagasan Utama</h3>
              <p style="font-size: 1rem; line-height: 1.6; margin-bottom: 0; color: var(--color-text-main); font-weight: 500;">
                SPLDV membantu kita menentukan <strong>dua nilai yang belum diketahui dari dua informasi yang saling berkaitan</strong>. Contohnya, menentukan harga dua jenis barang berdasarkan total belanja pada dua transaksi berbeda di kehidupan sehari-hari.
              </p>
            </div>
          </div>
        </div>

        <!-- Tujuan Pembelajaran & Alur Materi (Responsif) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 1.25rem;">
          
          <div class="card" style="border-top: 4px solid var(--color-primary);">
            <h3 style="font-size: 1.15rem; color: var(--color-primary-dark); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>🎯</span> Tujuan Pembelajaran
            </h3>
            <ul style="padding-left: 1.25rem; font-size: 0.92rem; line-height: 1.6; color: var(--color-text-main); display: flex; flex-direction: column; gap: 0.4rem;">
              <li>Menjelaskan pengertian <strong>PLDV</strong> dan <strong>SPLDV</strong>.</li>
              <li>Menentukan <strong>pasangan berurutan (x, y)</strong> yang memenuhi suatu SPLDV.</li>
              <li>Menyelesaikan SPLDV menggunakan <strong>4 metode</strong>: grafik, substitusi, eliminasi, dan campuran.</li>
              <li>Membuat <strong>model matematika</strong> dan menyelesaikan masalah kontekstual nyata.</li>
            </ul>
          </div>

          <div class="card" style="border-top: 4px solid #FF7A00;">
            <h3 style="font-size: 1.15rem; color: #BF360C; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>🗺️</span> Alur Materi Pembelajaran
            </h3>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
              <div style="background: var(--color-primary-lighter); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">
                <strong>1. Bentuk Persamaan:</strong> Mengenali variabel, koefisien, konstanta, dan PLDV.
              </div>
              <div style="background: var(--color-primary-lighter); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">
                <strong>2. Sistem Persamaan:</strong> Menggabungkan dua PLDV yang saling berkaitan.
              </div>
              <div style="background: var(--color-primary-lighter); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">
                <strong>3. Menentukan Penyelesaian:</strong> Mencari pasangan (x, y) dengan 4 metode.
              </div>
              <div style="background: var(--color-primary-lighter); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">
                <strong>4. Masalah Kontekstual:</strong> Mengubah informasi nyata jadi model aljabar.
              </div>
            </div>
          </div>

        </div>

        <!-- BAGIAN 1: Persamaan Linear Dua Variabel (PLDV) -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">
              <span>1️⃣</span> 1. Persamaan Linear Dua Variabel (PLDV)
            </h2>
          </div>
          <p style="font-size: 1rem; line-height: 1.6;">
            Sebelum mempelajari SPLDV, kita perlu memahami apa itu PLDV. <strong>Persamaan Linear Dua Variabel (PLDV)</strong> adalah persamaan yang memuat dua variabel berpangkat satu (derajat satu) dan dapat dituliskan dalam bentuk umum:
          </p>

          <div style="background: #F1F5F9; border-radius: var(--radius-md); padding: 1.25rem; text-align: center; margin: 1rem 0; border: 1.5px dashed var(--color-primary);">
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-primary-dark); font-family: var(--font-family-math);">
              ax + by = c
            </div>
          </div>

          <div class="table-responsive" style="margin-bottom: 1.25rem;">
            <table class="table-custom">
              <thead>
                <tr>
                  <th style="width: 25%;">Simbol</th>
                  <th>Keterangan dan Makna</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>x dan y</strong></td>
                  <td><strong>Variabel (peubah)</strong>: Nilai yang belum diketahui secara pasti.</td>
                </tr>
                <tr>
                  <td><strong>a dan b</strong></td>
                  <td><strong>Koefisien</strong>: Bilangan pengali di depan variabel (a, b ≠ 0).</td>
                </tr>
                <tr>
                  <td><strong>c</strong></td>
                  <td><strong>Konstanta</strong>: Bilangan tetap yang berdiri sendiri tanpa variabel.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: var(--color-primary-lighter); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
            <h4 style="color: var(--color-primary-dark); margin-bottom: 0.35rem;">Contoh PLDV:</h4>
            <div style="font-size: 1.2rem; font-family: var(--font-family-math); font-weight: 700; color: var(--color-primary);">
              3x + 2y = 12
            </div>
            <p style="margin: 0.4rem 0 0 0; font-size: 0.92rem;">
              Pada persamaan tersebut: <strong>x</strong> dan <strong>y</strong> adalah variabel, <strong>3</strong> dan <strong>2</strong> adalah koefisien, sedangkan <strong>12</strong> adalah konstanta.
            </p>
          </div>

          <!-- Penyelesaian PLDV & Contoh Uji Pasangan -->
          <div style="border-top: 1px solid var(--color-border); padding-top: 1rem;">
            <h4 style="color: var(--color-primary-dark); margin-bottom: 0.5rem;">Penyelesaian PLDV:</h4>
            <p style="font-size: 0.95rem; line-height: 1.6;">
              Penyelesaian PLDV berupa pasangan berurutan <strong>(x, y)</strong> yang membuat persamaan bernilai benar. Sebuah PLDV dapat memiliki <em>lebih dari satu pasangan penyelesaian</em>. Jika x dan y merupakan bilangan real, seluruh penyelesaiannya digambarkan sebagai titik-titik pada satu garis lurus.
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 1rem; margin-top: 0.75rem;">
              
              <div style="background: #E8F5E9; border: 1px solid #A5D6A7; border-radius: var(--radius-sm); padding: 1rem;">
                <div style="font-weight: 700; color: #1B5E20; margin-bottom: 0.25rem;">✓ Pasangan (2, 3) Memenuhi:</div>
                <div style="font-family: var(--font-family-math); font-size: 0.95rem;">
                  3(<strong>2</strong>) + 2(<strong>3</strong>) = 6 + 6 = <strong>12</strong> (BENAR)
                </div>
                <small style="color: #2E7D32;">Karena hasilnya 12, maka (2, 3) adalah penyelesaian.</small>
              </div>

              <div style="background: #FFEBEE; border: 1px solid #EF9A9A; border-radius: var(--radius-sm); padding: 1rem;">
                <div style="font-weight: 700; color: #B71C1C; margin-bottom: 0.25rem;">✗ Pasangan (1, 2) Tidak Memenuhi:</div>
                <div style="font-family: var(--font-family-math); font-size: 0.95rem;">
                  3(<strong>1</strong>) + 2(<strong>2</strong>) = 3 + 4 = <strong>7 ≠ 12</strong> (SALAH)
                </div>
                <small style="color: #C62828;">Hasilnya 7 bukan 12, maka (1, 2) bukan penyelesaian.</small>
              </div>

            </div>
          </div>
        </div>

        <!-- BAGIAN 2: Sistem Persamaan Linear Dua Variabel (SPLDV) -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">
              <span>2️⃣</span> 2. Sistem Persamaan Linear Dua Variabel (SPLDV)
            </h2>
          </div>
          <p style="font-size: 1rem; line-height: 1.6;">
            <strong>SPLDV</strong> adalah gabungan dari <strong>dua persamaan linear dua variabel</strong> yang saling berkaitan satu sama lain. Penyelesaiannya adalah <em>satu pasangan berurutan (x, y)</em> yang memenuhi kedua persamaan secara bersamaan.
          </p>

          <div style="background: #F1F5F9; border-radius: var(--radius-md); padding: 1.25rem; text-align: center; margin: 1rem 0;">
            <div style="font-size: 1.4rem; font-weight: 800; color: var(--color-primary-dark); font-family: var(--font-family-math); line-height: 1.8;">
              ax + by = c<br>
              dx + ey = f
            </div>
            <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.25rem;">
              Bentuk Umum SPLDV
            </div>
          </div>

          <div style="background: var(--color-primary-lighter); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1rem;">
            <h4 style="color: var(--color-primary-dark); margin-bottom: 0.35rem;">Contoh Bentuk SPLDV:</h4>
            <div style="font-size: 1.2rem; font-family: var(--font-family-math); font-weight: 700; color: var(--color-primary); line-height: 1.6;">
              2x + y = 8 &nbsp;&nbsp;(Persamaan I)<br>
              x + 2y = 10 &nbsp;(Persamaan II)
            </div>
          </div>

          <div class="alert alert-warning" style="margin-bottom: 0;">
            <span>⚠️</span>
            <div>
              <strong>INGAT KONSEP KUNCI!</strong><br>
              Pasangan (x, y) <strong>belum menjadi penyelesaian SPLDV</strong> apabila hanya memenuhi salah satu persamaan saja. Nilai x dan y harus membuat <strong>Persamaan I dan Persamaan II sama-sama bernilai benar</strong> secara serentak/simultan!
            </div>
          </div>
        </div>

        <!-- BAGIAN 3: 4 Metode Menyelesaikan SPLDV (Tab Interaktif) -->
        <div class="card" style="border: 2px solid var(--color-primary-border);">
          <div class="card-header">
            <div>
              <span class="badge badge-warning" style="margin-bottom: 0.35rem;">4 METODE UTAMA</span>
              <h2 class="card-title">
                <span>📐</span> 3. Menyelesaikan SPLDV dengan 4 Metode
              </h2>
            </div>
          </div>
          <p style="font-size: 0.95rem;">
            Pilih salah satu tab di bawah ini untuk mempelajari langkah dan contoh penyelesaian SPLDV <code>2x + y = 8</code> dan <code>x + 2y = 10</code>:
          </p>

          <!-- Navigasi 4 Tab Metode -->
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; background: var(--color-primary-lighter); padding: 6px; border-radius: var(--radius-md);">
            <button class="btn method-tab-btn ${activeMethodTab === 'grafik' ? 'btn-primary' : 'btn-secondary'}" data-tab="grafik" style="flex: 1; min-width: 130px; font-weight: 700;">
              📈 1. Grafik
            </button>
            <button class="btn method-tab-btn ${activeMethodTab === 'substitusi' ? 'btn-primary' : 'btn-secondary'}" data-tab="substitusi" style="flex: 1; min-width: 130px; font-weight: 700;">
              🔄 2. Substitusi
            </button>
            <button class="btn method-tab-btn ${activeMethodTab === 'eliminasi' ? 'btn-primary' : 'btn-secondary'}" data-tab="eliminasi" style="flex: 1; min-width: 130px; font-weight: 700;">
              ❌ 3. Eliminasi
            </button>
            <button class="btn method-tab-btn ${activeMethodTab === 'campuran' ? 'btn-primary' : 'btn-secondary'}" data-tab="campuran" style="flex: 1; min-width: 130px; font-weight: 700;">
              ⚡ 4. Campuran
            </button>
          </div>

          <!-- KONTEN TAB 1: METODE GRAFIK -->
          <div id="method-tab-grafik" class="method-tab-content ${activeMethodTab === 'grafik' ? '' : 'hidden'}">
            <h3 style="color: var(--color-primary-dark); margin-bottom: 0.5rem;">Metode Grafik</h3>
            <p style="font-size: 0.95rem; line-height: 1.6;">
              Metode grafik dilakukan dengan <strong>menggambar kedua persamaan pada satu bidang koordinat Kartesius</strong>. Penyelesaian SPLDV ditunjukkan oleh <strong>titik potong</strong> kedua garis lurus tersebut.
            </p>

            <div style="background: #F8FAFC; border-left: 4px solid var(--color-primary); padding: 1rem; border-radius: var(--radius-sm); margin: 1rem 0;">
              <strong>Langkah-langkah Metode Grafik:</strong>
              <ol style="padding-left: 1.25rem; font-size: 0.92rem; margin-top: 0.35rem; line-height: 1.6;">
                <li>Tentukan beberapa pasangan titik yang memenuhi masing-masing persamaan (biasanya titik potong sumbu x saat y=0 dan sumbu y saat x=0).</li>
                <li>Gambarkan kedua garis pada bidang koordinat yang sama.</li>
                <li>Tentukan titik potong kedua garis.</li>
                <li>Periksa titik potong dengan mensubstitusikannya ke kedua persamaan.</li>
              </ol>
            </div>

            <!-- Tabel Titik Potong Sumbu -->
            <h4 style="color: var(--color-primary-dark); margin-top: 1rem; margin-bottom: 0.5rem;">Contoh Menentukan Titik Potong Sumbu:</h4>
            <div class="table-responsive">
              <table class="table-custom">
                <thead>
                  <tr>
                    <th>Persamaan</th>
                    <th>Titik saat x = 0 (Sumbu y)</th>
                    <th>Titik saat y = 0 (Sumbu x)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>2x + y = 8</strong></td>
                    <td>2(0) + y = 8 ⟹ <strong>(0, 8)</strong></td>
                    <td>2x + 0 = 8 ⟹ x = 4 ⟹ <strong>(4, 0)</strong></td>
                  </tr>
                  <tr>
                    <td><strong>x + 2y = 10</strong></td>
                    <td>0 + 2y = 10 ⟹ y = 5 ⟹ <strong>(0, 5)</strong></td>
                    <td>x + 2(0) = 10 ⟹ x = 10 ⟹ <strong>(10, 0)</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Ilustrasi Grafik Koordinat SVG -->
            <div style="background: white; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; margin: 1.25rem 0; text-align: center;">
              <h5 style="color: var(--color-text-muted); margin-bottom: 0.75rem;">Visualisasi Titik Potong pada Bidang Koordinat:</h5>
              <svg viewBox="0 0 400 240" style="max-width: 480px; width: 100%; height: auto; margin: 0 auto; display: block; background: #FAFBFD; border-radius: 8px; border: 1px solid #E2E8F0;">
                <!-- Grid -->
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" stroke-width="1"/>
                  </pattern>
                </defs>
                <rect width="400" height="240" fill="url(#grid)" />
                <!-- Sumbu X dan Y -->
                <line x1="40" y1="200" x2="380" y2="200" stroke="#64748B" stroke-width="2"/>
                <line x1="60" y1="20" x2="60" y2="220" stroke="#64748B" stroke-width="2"/>
                <text x="370" y="195" font-size="12" font-weight="bold" fill="#64748B">x</text>
                <text x="65" y="30" font-size="12" font-weight="bold" fill="#64748B">y</text>
                
                <!-- Garis 1: 2x + y = 8 (melewati (0,8) dan (4,0)) -->
                <!-- Skala: x 1 unit = 28px, y 1 unit = 20px. Origin di (60, 200) -->
                <!-- (0,8) -> x=60, y=200 - 8*20 = 40. (4,0) -> x=60 + 4*28 = 172, y=200 -->
                <line x1="50" y1="20" x2="190" y2="225" stroke="#E11D48" stroke-width="3"/>
                <text x="140" y="55" font-size="11" font-weight="bold" fill="#E11D48">2x + y = 8</text>

                <!-- Garis 2: x + 2y = 10 (melewati (0,5) dan (10,0)) -->
                <!-- (0,5) -> x=60, y=200 - 5*20 = 100. (10,0) -> x=60 + 10*28 = 340, y=200 -->
                <line x1="40" y1="90" x2="360" y2="210" stroke="#2563EB" stroke-width="3"/>
                <text x="260" y="165" font-size="11" font-weight="bold" fill="#2563EB">x + 2y = 10</text>

                <!-- Titik Potong (2, 4) -->
                <!-- x = 60 + 2*28 = 116, y = 200 - 4*20 = 120 -->
                <circle cx="116" cy="120" r="6" fill="#F59E0B" stroke="#B45309" stroke-width="2"/>
                <line x1="116" y1="120" x2="116" y2="200" stroke="#F59E0B" stroke-dasharray="3,3"/>
                <line x1="60" y1="120" x2="116" y2="120" stroke="#F59E0B" stroke-dasharray="3,3"/>
                <text x="125" y="115" font-size="13" font-weight="800" fill="#B45309">Titik Potong (2, 4)</text>
              </svg>
              <div style="font-size: 0.9rem; color: #166534; font-weight: 700; margin-top: 0.5rem;">
                Kedua garis berpotongan tepat di titik (2, 4). Diperiksa: 2(2) + 4 = 8 ✓ dan 2 + 2(4) = 10 ✓.
              </div>
            </div>

            <!-- Tiga Kemungkinan Grafik -->
            <h4 style="color: var(--color-primary-dark); margin-top: 1rem; margin-bottom: 0.5rem;">3 Kemungkinan Bentuk Grafik SPLDV:</h4>
            <div class="table-responsive">
              <table class="table-custom">
                <thead>
                  <tr>
                    <th>Bentuk Grafik</th>
                    <th>Banyak Penyelesaian</th>
                    <th>Makna Geometris</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Dua Garis Berpotongan</strong></td>
                    <td><span class="badge badge-success">Satu</span></td>
                    <td>Ada satu pasangan (x, y) unik yang memenuhi kedua persamaan.</td>
                  </tr>
                  <tr>
                    <td><strong>Dua Garis Sejajar</strong></td>
                    <td><span class="badge badge-danger">Tidak Ada</span></td>
                    <td>Kedua garis tidak pernah bertemu; tidak ada pasangan yang memenuhi keduanya.</td>
                  </tr>
                  <tr>
                    <td><strong>Dua Garis Berimpit</strong></td>
                    <td><span class="badge badge-info">Tak Hingga</span></td>
                    <td>Kedua persamaan memiliki garis yang sama persis; semua titik memenuhi keduanya.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- KONTEN TAB 2: METODE SUBSTITUSI -->
          <div id="method-tab-substitusi" class="method-tab-content ${activeMethodTab === 'substitusi' ? '' : 'hidden'}">
            <h3 style="color: var(--color-primary-dark); margin-bottom: 0.5rem;">Metode Substitusi</h3>
            <p style="font-size: 0.95rem; line-height: 1.6;">
              Metode substitusi dilakukan dengan <strong>menyatakan salah satu variabel dalam bentuk variabel lainnya</strong>, kemudian menggantikan (mensubstitusikan) variabel tersebut ke persamaan yang lain.
            </p>

            <div style="background: #F8FAFC; border-left: 4px solid var(--color-primary); padding: 1rem; border-radius: var(--radius-sm); margin: 1rem 0;">
              <strong>Langkah-langkah Metode Substitusi:</strong>
              <ol style="padding-left: 1.25rem; font-size: 0.92rem; margin-top: 0.35rem; line-height: 1.6;">
                <li>Pilih salah satu persamaan, lalu nyatakan x dalam bentuk y (x = ...) atau y dalam bentuk x (y = ...).</li>
                <li>Substitusikan bentuk tersebut ke persamaan yang lain sehingga tersisa satu variabel saja.</li>
                <li>Tentukan nilai variabel yang diperoleh.</li>
                <li>Substitusikan kembali nilai tersebut ke salah satu persamaan untuk memperoleh variabel lainnya.</li>
              </ol>
            </div>

            <div style="background: var(--color-primary-lighter); border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1rem;">
              <h4 style="color: var(--color-primary-dark); margin-bottom: 0.5rem;">Contoh Penyelesaian:</h4>
              <div style="font-size: 0.95rem; line-height: 1.8;">
                <div>Persamaan I: <code>2x + y = 8</code> &nbsp;|&nbsp; Persamaan II: <code>x + 2y = 10</code></div>
                <div style="margin-top: 0.5rem;">
                  <strong>1) Nyatakan y dari Persamaan I:</strong><br>
                  <code>2x + y = 8 &nbsp;⟹&nbsp; y = 8 - 2x</code>
                </div>
                <div style="margin-top: 0.5rem;">
                  <strong>2) Substitusikan ke Persamaan II:</strong><br>
                  <code>x + 2(8 - 2x) = 10</code><br>
                  <code>x + 16 - 4x = 10</code><br>
                  <code>-3x = 10 - 16</code><br>
                  <code>-3x = -6 &nbsp;⟹&nbsp; x = 2</code>
                </div>
                <div style="margin-top: 0.5rem;">
                  <strong>3) Substitusikan x = 2 ke y = 8 - 2x:</strong><br>
                  <code>y = 8 - 2(2) = 8 - 4 = 4</code>
                </div>
                <div style="margin-top: 0.75rem; background: white; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 700; color: var(--color-success);">
                  Diperoleh x = 2 dan y = 4. Himpunan penyelesaiannya adalah (2, 4).
                </div>
              </div>
            </div>

            <div class="alert alert-info" style="margin-top: 1rem; margin-bottom: 0;">
              <span>💡</span>
              <div>
                <strong>Kapan metode ini paling praktis?</strong><br>
                Metode substitusi sangat praktis ketika salah satu persamaan mudah diubah menjadi <code>x = ...</code> atau <code>y = ...</code>, terutama jika koefisien salah satu variabel adalah <strong>1</strong> atau <strong>-1</strong>.
              </div>
            </div>
          </div>

          <!-- KONTEN TAB 3: METODE ELIMINASI -->
          <div id="method-tab-eliminasi" class="method-tab-content ${activeMethodTab === 'eliminasi' ? '' : 'hidden'}">
            <h3 style="color: var(--color-primary-dark); margin-bottom: 0.5rem;">Metode Eliminasi</h3>
            <p style="font-size: 0.95rem; line-height: 1.6;">
              Metode eliminasi dilakukan dengan <strong>menghilangkan (mengeliminasi) salah satu variabel</strong> agar nilai variabel yang lain dapat ditentukan. Untuk menghilangkan variabel, koefisiennya dibuat sama terlebih dahulu dengan mengalikan bilangan tertentu, kemudian kedua persamaan dijumlahkan atau dikurangkan.
            </p>

            <div style="background: #F8FAFC; border-left: 4px solid var(--color-primary); padding: 1rem; border-radius: var(--radius-sm); margin: 1rem 0;">
              <strong>Langkah-langkah Metode Eliminasi:</strong>
              <ol style="padding-left: 1.25rem; font-size: 0.92rem; margin-top: 0.35rem; line-height: 1.6;">
                <li>Tentukan variabel mana yang akan dihilangkan terlebih dahulu (x atau y).</li>
                <li>Samakan koefisien variabel tersebut dengan mengalikan masing-masing persamaan dengan bilangan pengali yang sesuai.</li>
                <li>Jumlahkan (jika tanda koefisien berlawanan) atau kurangkan (jika tanda koefisien sama) kedua persamaan sehingga variabel tersebut hilang.</li>
                <li>Ulangi proses untuk menentukan variabel lainnya, atau substitusikan nilai yang sudah diperoleh.</li>
              </ol>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 1rem; margin-top: 1rem;">
              
              <div style="background: var(--color-primary-lighter); padding: 1rem; border-radius: var(--radius-md);">
                <h4 style="color: var(--color-primary-dark); margin-bottom: 0.4rem;">A. Menghilangkan x:</h4>
                <p style="font-size: 0.88rem;">Kalikan Persamaan II dengan 2, lalu kurangkan dengan Persamaan I:</p>
                <div style="background: white; padding: 0.75rem; border-radius: var(--radius-sm); font-family: var(--font-family-math); font-size: 1.05rem;">
                  2x + 4y = 20<br>
                  <u>2x + &nbsp;y = &nbsp;8</u> &minus;<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3y = 12 ⟹ <strong>y = 4</strong>
                </div>
              </div>

              <div style="background: var(--color-primary-lighter); padding: 1rem; border-radius: var(--radius-md);">
                <h4 style="color: var(--color-primary-dark); margin-bottom: 0.4rem;">B. Menghilangkan y:</h4>
                <p style="font-size: 0.88rem;">Kalikan Persamaan I dengan 2, lalu kurangkan dengan Persamaan II:</p>
                <div style="background: white; padding: 0.75rem; border-radius: var(--radius-sm); font-family: var(--font-family-math); font-size: 1.05rem;">
                  4x + 2y = 16<br>
                  <u>&nbsp;x + 2y = 10</u> &minus;<br>
                  3x &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= &nbsp;6 ⟹ <strong>x = 2</strong>
                </div>
              </div>

            </div>

            <div style="background: #FFF8E1; border: 1px solid #FFE082; padding: 1rem; border-radius: var(--radius-sm); margin-top: 1rem; font-size: 0.9rem;">
              <strong style="color: #795548;">Hal Penting yang Perlu Diperhatikan:</strong>
              <ul style="padding-left: 1.25rem; margin-top: 0.25rem; color: #5D4037; line-height: 1.5;">
                <li>Jika koefisien sudah sama, persamaan bisa langsung dijumlahkan atau dikurangkan.</li>
                <li>Jika salah satu persamaan dikalikan suatu bilangan, <strong>semua suku</strong> pada persamaan tersebut harus dikalikan secara adil (prinsip timbangan).</li>
                <li>Perhatikan tanda positif (+) dan negatif (&minus;) saat menjumlahkan atau mengurangkan.</li>
              </ul>
            </div>
          </div>

          <!-- KONTEN TAB 4: METODE CAMPURAN -->
          <div id="method-tab-campuran" class="method-tab-content ${activeMethodTab === 'campuran' ? '' : 'hidden'}">
            <h3 style="color: var(--color-primary-dark); margin-bottom: 0.5rem;">Metode Campuran (Eliminasi + Substitusi)</h3>
            <p style="font-size: 0.95rem; line-height: 1.6;">
              Metode campuran menggabungkan kecepatan eliminasi dan kepraktisan substitusi. Biasanya, <strong>eliminasi digunakan terlebih dahulu</strong> untuk memperoleh nilai satu variabel, kemudian <strong>substitusi digunakan</strong> untuk menentukan variabel lainnya.
            </p>

            <div style="background: var(--color-primary-lighter); border-radius: var(--radius-md); padding: 1.25rem; margin: 1rem 0;">
              <h4 style="color: var(--color-primary-dark); margin-bottom: 0.5rem;">Langkah Contoh Metode Campuran:</h4>
              <div style="font-size: 0.95rem; line-height: 1.8;">
                <div><strong>Langkah 1 (Eliminasi x):</strong></div>
                <div>Kalikan Persamaan II dengan 2, lalu kurangkan Persamaan I:</div>
                <div style="background: white; padding: 0.5rem 1rem; border-radius: 4px; display: inline-block; font-family: var(--font-family-math); margin: 0.25rem 0;">
                  2x + 4y = 20<br>
                  <u>2x + &nbsp;y = &nbsp;8</u> &minus;<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3y = 12 ⟹ <strong>y = 4</strong>
                </div>
                <div style="margin-top: 0.75rem;"><strong>Langkah 2 (Substitusi y = 4 ke Persamaan II):</strong></div>
                <div><code>x + 2y = 10 ⟹ x + 2(4) = 10 ⟹ x + 8 = 10 ⟹ <strong>x = 2</strong></code></div>
                <div style="margin-top: 0.5rem; font-weight: 700; color: var(--color-success);">
                  Diperoleh penyelesaian: (x, y) = (2, 4).
                </div>
              </div>
            </div>

            <!-- Tabel Perbandingan 4 Metode -->
            <h4 style="color: var(--color-primary-dark); margin-top: 1rem; margin-bottom: 0.5rem;">Perbandingan 4 Metode Penyelesaian SPLDV:</h4>
            <div class="table-responsive">
              <table class="table-custom">
                <thead>
                  <tr>
                    <th>Metode</th>
                    <th>Ide Utama</th>
                    <th>Yang Dilakukan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Grafik</strong></td>
                    <td>Titik potong dua garis</td>
                    <td>Gambar dua garis pada bidang koordinat, lalu baca dan periksa titik potong.</td>
                  </tr>
                  <tr>
                    <td><strong>Substitusi</strong></td>
                    <td>Mengganti variabel</td>
                    <td>Ubah satu variabel jadi bentuk variabel lain, lalu masukkan ke persamaan kedua.</td>
                  </tr>
                  <tr>
                    <td><strong>Eliminasi</strong></td>
                    <td>Menghilangkan variabel</td>
                    <td>Samakan koefisien variabel, lalu jumlahkan atau kurangkan persamaan.</td>
                  </tr>
                  <tr>
                    <td><strong>Campuran</strong></td>
                    <td>Eliminasi + Substitusi</td>
                    <td>Cari satu nilai dengan eliminasi, lalu cari nilai lainnya dengan substitusi.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- Transisi Menuju Masalah Kontekstual -->
        <div class="card card-accent-blue" style="border: 2px solid var(--color-primary-border); padding: 1.5rem; background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
            <div>
              <span class="badge badge-warning" style="margin-bottom: 0.35rem;">TAHAP SELANJUTNYA</span>
              <h3 style="color: var(--color-primary-dark); font-size: 1.25rem; margin-bottom: 0.25rem;">
                ✏️ Membuat Model dan Menyelesaikan Masalah Kontekstual
              </h3>
              <p style="font-size: 0.95rem; color: var(--color-text-main); margin-bottom: 0; max-width: 620px;">
                Materi pemodelan kontekstual lengkap (5 langkah pemecahan masalah soal cerita & simulasi belanja alat tulis) dipelajari dan dipraktikkan langsung pada menu <strong>2. Masalah Kontekstual</strong>.
              </p>
            </div>
            <a href="#/kontekstual" class="btn btn-primary btn-lg" style="font-weight: 700; white-space: nowrap;">
              Buka Masalah Kontekstual →
            </a>
          </div>
        </div>

        <!-- BAGIAN 4: Ringkasan Inti Konsep -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">
              <span>📋</span> 4. Ringkasan Inti Materi
            </h2>
          </div>
          <div class="table-responsive">
            <table class="table-custom">
              <thead>
                <tr>
                  <th style="width: 25%;">Istilah</th>
                  <th>Inti yang Wajib Diingat</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>PLDV</strong></td>
                  <td>Persamaan dua variabel berpangkat satu berbentuk <code>ax + by = c</code>.</td>
                </tr>
                <tr>
                  <td><strong>SPLDV</strong></td>
                  <td>Dua PLDV yang saling berkaitan; penyelesaian harus memenuhi keduanya secara simultan.</td>
                </tr>
                <tr>
                  <td><strong>Penyelesaian</strong></td>
                  <td>Pasangan berurutan <code>(x, y)</code> yang membuat kedua persamaan bernilai benar.</td>
                </tr>
                <tr>
                  <td><strong>Metode Grafik</strong></td>
                  <td>Penyelesaian ditunjukkan oleh titik potong kedua garis pada bidang koordinat.</td>
                </tr>
                <tr>
                  <td><strong>Metode Substitusi</strong></td>
                  <td>Mengganti satu variabel dengan bentuk yang setara dari persamaan lain.</td>
                </tr>
                <tr>
                  <td><strong>Metode Eliminasi</strong></td>
                  <td>Menghilangkan satu variabel dengan menyamakan koefisien kedua persamaan.</td>
                </tr>
                <tr>
                  <td><strong>Metode Campuran</strong></td>
                  <td>Menggabungkan metode eliminasi dan substitusi.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- BAGIAN 5: Latihan Pemahaman Interaktif (3 Soal dari Bahan Ajar) -->
        <div class="card" style="border: 2px solid var(--color-primary-border); background: white;">
          <div class="card-header">
            <div>
              <span class="badge badge-success" style="margin-bottom: 0.35rem;">UJI PEMAHAMAN</span>
              <h2 class="card-title">
                <span>✍️</span> 5. Latihan Pemahaman Mandiri
              </h2>
            </div>
            <span style="font-size: 0.85rem; color: var(--color-text-muted);">Kerjakan 3 soal di bawah ini</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem;">
            
            <!-- Soal 1 -->
            <div class="card" style="background: #FAFBFD; border: 1.5px solid var(--color-border); padding: 1.25rem;">
              <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 1rem; margin-bottom: 0.5rem;">
                Soal 1. Dari persamaan <code>4x + 3y = 18</code>, tentukan apakah pasangan (3, 2) merupakan penyelesaian PLDV tersebut!
              </div>
              <div style="display: flex; gap: 1rem; align-items: center; margin-top: 0.75rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="radio" name="q1_option" value="ya" style="accent-color: var(--color-primary); width: 18px; height: 18px;">
                  <span><strong>Ya</strong>, merupakan penyelesaian</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="radio" name="q1_option" value="tidak" style="accent-color: var(--color-primary); width: 18px; height: 18px;">
                  <span><strong>Tidak</strong>, bukan penyelesaian</span>
                </label>
              </div>
              <div id="fb-q1" class="form-feedback hidden" style="margin-top: 0.75rem; font-size: 0.9rem;"></div>
            </div>

            <!-- Soal 2 -->
            <div class="card" style="background: #FAFBFD; border: 1.5px solid var(--color-border); padding: 1.25rem;">
              <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 1rem; margin-bottom: 0.5rem;">
                Soal 2. Selesaikan SPLDV berikut:<br>
                <code>x + y = 11</code><br>
                <code>2x + y = 17</code>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 0.75rem;">
                <div>
                  <label class="form-label" for="ans-q2-x">Nilai x:</label>
                  <input type="number" id="ans-q2-x" class="form-control" placeholder="Ketik nilai x" style="font-weight: 700;">
                </div>
                <div>
                  <label class="form-label" for="ans-q2-y">Nilai y:</label>
                  <input type="number" id="ans-q2-y" class="form-control" placeholder="Ketik nilai y" style="font-weight: 700;">
                </div>
              </div>
              <div id="fb-q2" class="form-feedback hidden" style="margin-top: 0.75rem; font-size: 0.9rem;"></div>
            </div>

            <!-- Soal 3 -->
            <div class="card" style="background: #FAFBFD; border: 1.5px solid var(--color-border); padding: 1.25rem;">
              <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 1rem; margin-bottom: 0.5rem;">
                Soal 3. Harga 2 tiket dewasa dan 1 tiket anak-anak adalah Rp55.000,00. Harga 1 tiket dewasa dan 2 tiket anak-anak adalah Rp50.000,00. Tentukan harga tiket dewasa (d) dan tiket anak (a) dalam ribuan rupiah!
              </div>
              <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">
                Model: <code>2d + a = 55</code> dan <code>d + 2a = 50</code>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 0.5rem;">
                <div>
                  <label class="form-label" for="ans-q3-d">Tiket Dewasa d (Rp... ribu):</label>
                  <input type="number" id="ans-q3-d" class="form-control" placeholder="Contoh: 20" style="font-weight: 700;">
                </div>
                <div>
                  <label class="form-label" for="ans-q3-a">Tiket Anak a (Rp... ribu):</label>
                  <input type="number" id="ans-q3-a" class="form-control" placeholder="Contoh: 15" style="font-weight: 700;">
                </div>
              </div>
              <div id="fb-q3" class="form-feedback hidden" style="margin-top: 0.75rem; font-size: 0.9rem;"></div>
            </div>

            <!-- Tombol Periksa Jawaban Latihan -->
            <div style="display: flex; justify-content: flex-end;">
              <button class="btn btn-primary btn-lg" id="btn-check-all-quiz">
                Periksa Seluruh Latihan
              </button>
            </div>

          </div>
        </div>

        <!-- BAGIAN 7: Sumber Materi Resmi -->
        <div class="card" style="background: #F8FAFC; border: 1px solid var(--color-border); font-size: 0.88rem; color: var(--color-text-muted);">
          <div style="font-weight: 700; color: var(--color-text-main); margin-bottom: 0.25rem;">📚 Sumber Referensi Bahan Ajar:</div>
          <div>Kristanto, Y. D., Taqiyuddin, M., Yulfiana, E., & Rukmana, I. (2022). <em>Matematika untuk SMP/MTs Kelas IX</em>. Jakarta: Pusat Perbukuan, Badan Standar, Kurikulum, dan Asesmen Pendidikan, Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. Bab I: Sistem Persamaan Linear Dua Variabel (hlm. 2–32).</div>
        </div>

        <!-- Tombol Lanjut ke Tahap Berikutnya -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem;">
          <a href="#/beranda" class="btn btn-outline">← Beranda</a>
          <a href="#/kontekstual" class="btn btn-success btn-lg" id="btn-next-stage">
            Lanjut ke Masalah Kontekstual ✏️ →
          </a>
        </div>

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Event pergantian Tab 4 Metode
    container.querySelectorAll('.method-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabKey = btn.getAttribute('data-tab');
        activeMethodTab = tabKey;

        // Update tampilan tab tombol
        container.querySelectorAll('.method-tab-btn').forEach(b => {
          b.className = 'btn method-tab-btn btn-secondary';
        });
        btn.className = 'btn method-tab-btn btn-primary';

        // Update konten tab
        container.querySelectorAll('.method-tab-content').forEach(content => {
          content.classList.add('hidden');
        });
        const targetContent = container.querySelector(`#method-tab-${tabKey}`);
        if (targetContent) targetContent.classList.remove('hidden');
      });
    });

    // Event tombol periksa latihan pemahaman
    const btnCheck = container.querySelector('#btn-check-all-quiz');
    if (btnCheck) {
      btnCheck.addEventListener('click', () => {
        let allCorrect = true;

        // Soal 1: Apakah (3, 2) memenuhi 4x + 3y = 18? Jawab: Ya (4*3 + 3*2 = 12 + 6 = 18)
        const q1Selected = container.querySelector('input[name="q1_option"]:checked');
        const fb1 = container.querySelector('#fb-q1');
        if (q1Selected) {
          if (q1Selected.value === 'ya') {
            fb1.className = 'form-feedback success';
            fb1.innerHTML = '✅ <strong>Benar!</strong> Substitusikan x = 3 dan y = 2: 4(3) + 3(2) = 12 + 6 = 18 (Bernilai Benar).';
            fb1.classList.remove('hidden');
          } else {
            allCorrect = false;
            fb1.className = 'form-feedback error';
            fb1.innerHTML = '❌ <strong>Kurang tepat.</strong> Pasangan (3, 2) menghasilkan 4(3) + 3(2) = 12 + 6 = 18, jadi (3, 2) adalah penyelesaian.';
            fb1.classList.remove('hidden');
          }
        } else {
          allCorrect = false;
          fb1.className = 'form-feedback error';
          fb1.innerHTML = '⚠️ Silakan pilih jawaban untuk Soal 1.';
          fb1.classList.remove('hidden');
        }

        // Soal 2: x + y = 11 dan 2x + y = 17 -> x = 6, y = 5
        const ansX = Number(container.querySelector('#ans-q2-x')?.value);
        const ansY = Number(container.querySelector('#ans-q2-y')?.value);
        const fb2 = container.querySelector('#fb-q2');

        if (!isNaN(ansX) && !isNaN(ansY) && ansX === 6 && ansY === 5) {
          fb2.className = 'form-feedback success';
          fb2.innerHTML = '✅ <strong>Tepat Sekali!</strong> x = 6 dan y = 5. (Kurangkan persamaan 2 dengan 1: (2x-x) + (y-y) = 17-11 ⟹ x = 6, lalu y = 11 - 6 = 5).';
          fb2.classList.remove('hidden');
        } else {
          allCorrect = false;
          fb2.className = 'form-feedback error';
          fb2.innerHTML = '❌ <strong>Belum tepat.</strong> Coba kurangkan Persamaan 2 dengan Persamaan 1 untuk mengeliminasi y!';
          fb2.classList.remove('hidden');
        }

        // Soal 3: 2d + a = 55 dan d + 2a = 50 -> d = 20, a = 15
        const ansD = Number(container.querySelector('#ans-q3-d')?.value);
        const ansA = Number(container.querySelector('#ans-q3-a')?.value);
        const fb3 = container.querySelector('#fb-q3');

        if (!isNaN(ansD) && !isNaN(ansA) && ansD === 20 && ansA === 15) {
          fb3.className = 'form-feedback success';
          fb3.innerHTML = '✅ <strong>Hebat!</strong> Tiket Dewasa (d) = Rp20.000,00 dan Tiket Anak (a) = Rp15.000,00.';
          fb3.classList.remove('hidden');
        } else {
          allCorrect = false;
          fb3.className = 'form-feedback error';
          fb3.innerHTML = '❌ <strong>Belum tepat.</strong> Gunakan metode eliminasi/substitusi pada model 2d + a = 55 dan d + 2a = 50.';
          fb3.classList.remove('hidden');
        }

        if (allCorrect) {
          showToast('Luar biasa! Seluruh soal latihan pemahaman berhasil dijawab benar! ⭐', 'success');
          if (user) {
            saveProgress(user.id, { completedStages: ['materi'] });
          }
        } else {
          showToast('Ada jawaban yang belum tepat. Baca petunjuk lalu coba lagi ya!', 'warning');
        }
      });
    }

    // Tombol Lanjut ke Tahap Berikutnya
    const btnNext = container.querySelector('#btn-next-stage');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (user) {
          saveProgress(user.id, { completedStages: ['materi'] });
        }
      });
    }
  }

  render();
}
