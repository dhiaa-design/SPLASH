/**
 * Kontekstual View: Membuat Model dan Menyelesaikan Masalah Kontekstual
 * Materi pemodelan masalah kontekstual nyata: paket alat tulis pensil (x) & buku tulis (y).
 * Sumber: Bahan Ajar Resmi Matematika SMP/MTs (Kemendikbudristek).
 */

import { isEquationMatching } from '../../utils/math-parser.js';
import { saveProgress, getProgress } from '../../services/storage.js';
import { appState } from '../../state.js';
import { showToast } from '../../utils/dom-helpers.js';

export function renderKontekstualView(container) {
  const user = appState.getUser();

  function render() {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 900px; margin: 0 auto; padding-bottom: 2rem;">
        
        <!-- Breadcrumb & Header -->
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="#/materi" style="font-weight: 600; font-size: 0.9rem;">← Bahan Ajar SPLDV</a>
            <span style="color: var(--color-text-light);">/</span>
            <span style="color: var(--color-primary); font-weight: 700; font-size: 0.9rem;">Tahap 2: Masalah Kontekstual</span>
          </div>
          <div class="badge badge-warning" style="margin-bottom: 0.5rem; font-size: 0.85rem; padding: 0.35rem 0.8rem; font-weight: 700;">
            ✏️ TAHAP 2 PEMBELAJARAN
          </div>
          <h1 style="font-size: clamp(1.5rem, 3.5vw, 2.1rem); color: var(--color-primary-dark); font-weight: 800; line-height: 1.3;">
            Membuat Model dan Menyelesaikan Masalah Kontekstual
          </h1>
          <p style="font-size: 1.05rem; margin-top: 0.5rem; color: var(--color-text-muted); line-height: 1.6;">
            SPLDV sangat banyak digunakan untuk memecahkan permasalahan nyata sehari-hari, seperti perdagangan/belanja barang, tiket pertunjukan, dan kecepatan. Kuncinya adalah <strong>menerjemahkan informasi soal cerita menjadi dua persamaan linear</strong>.
          </p>
        </div>

        <!-- 5 Langkah Pemecahan Masalah Kontekstual (Sesuai Bahan Ajar) -->
        <div class="card card-accent-blue" style="border: 2px solid var(--color-primary-border); padding: 1.5rem;">
          <h3 style="font-size: 1.25rem; color: var(--color-primary-dark); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>📋</span> 5 Langkah Pemecahan Masalah Kontekstual:
          </h3>
          <ol style="padding-left: 1.25rem; font-size: 0.95rem; line-height: 1.8; color: var(--color-text-main); display: flex; flex-direction: column; gap: 0.4rem;">
            <li><strong>Pahami Masalah:</strong> Tentukan informasi apa yang diketahui dan hal apa yang ditanyakan.</li>
            <li><strong>Tentukan Variabel:</strong> Misalkan dua hal yang belum diketahui sebagai <span class="math-var-x">x</span> dan <span class="math-var-y">y</span>, serta tuliskan artinya dengan jelas (misal: <em>x</em> = harga 1 pensil dlm ribu rupiah).</li>
            <li><strong>Susun Dua Persamaan:</strong> Buat dua persamaan aljabar berdasarkan dua kalimat transaksi pada soal.</li>
            <li><strong>Selesaikan SPLDV:</strong> Gunakan salah satu metode (grafik, substitusi, eliminasi, atau campuran).</li>
            <li><strong>Tafsirkan dan Periksa:</strong> Berikan kesimpulan akhir sesuai konteks nyata dan uji ke kedua persamaan.</li>
          </ol>
        </div>

        <!-- Skenario Masalah Kontekstual: Pensil & Buku Tulis -->
        <div class="card" style="background: linear-gradient(135deg, #FFF8E1 0%, #FFFFFF 100%); border: 2px solid #FFE082;">
          <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
            <div style="flex: 1; min-width: min(100%, 280px);">
              <div class="badge badge-warning" style="margin-bottom: 0.5rem;">✏️ Contoh Pemodelan Nyata</div>
              <h2 style="font-size: 1.35rem; color: #795548; margin-bottom: 0.5rem;">
                Paket Alat Tulis Koperasi Sekolah
              </h2>
              <p style="font-size: 1.05rem; line-height: 1.6; color: var(--color-text-main); margin-bottom: 0.5rem;">
                "<strong>Dua pensil</strong> dan <strong>satu buku tulis</strong> berharga <strong>Rp8.000,00</strong>. Sementara itu, <strong>satu pensil</strong> dan <strong>dua buku tulis</strong> berharga <strong>Rp10.000,00</strong>. Tentukan harga masing-masing barang!"
              </p>
              <div style="background: white; border-radius: var(--radius-md); padding: 0.6rem 0.9rem; border: 1px dashed #FFA000; font-size: 0.88rem; font-weight: 600; color: #D84315;">
                💡 Catatan Praktis: Nyatakan satuan harga dalam <strong>ribuan rupiah</strong> (Rp8.000 ditulis 8, dan Rp10.000 ditulis 10) agar penulisan persamaan lebih sederhana.
              </div>
            </div>

            <!-- Ilustrasi Vektor Pensil & Buku -->
            <div style="display: flex; gap: 1rem; justify-content: center; align-items: center; padding: 0.5rem;">
              <div style="text-align: center; width: 100px;">
                <div style="background: #FFF3E0; border: 2px solid #FF7A00; border-radius: 12px; padding: 12px; font-size: 2.2rem;">
                  ✏️
                </div>
                <div style="font-weight: 700; font-size: 0.9rem; margin-top: 0.35rem; color: #E65100;">Pensil (x)</div>
                <div style="font-size: 0.75rem; color: var(--color-text-muted);">Variabel x</div>
              </div>
              <span style="font-size: 2rem; font-weight: 800; color: var(--color-primary);">+</span>
              <div style="text-align: center; width: 100px;">
                <div style="background: #F3E5F5; border: 2px solid #9C27B0; border-radius: 12px; padding: 12px; font-size: 2.2rem;">
                  📓
                </div>
                <div style="font-weight: 700; font-size: 0.9rem; margin-top: 0.35rem; color: #7B1FA2;">Buku (y)</div>
                <div style="font-size: 0.75rem; color: var(--color-text-muted);">Variabel y</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Langkah 1: Menentukan Pemisalan Variabel -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span>1️⃣</span> Langkah 1: Tentukan Arti Variabel x dan y</h3>
          </div>
          <p style="font-size: 0.95rem;">Tentukan hal apa yang diwakili oleh masing-masing variabel:</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 1.25rem;">
            <div class="form-group">
              <label class="form-label" for="select-var-x">Variabel <span class="math-var-x">x</span> mewakili:</label>
              <select id="select-var-x" class="form-control">
                <option value="">-- Pilih arti variabel x --</option>
                <option value="pensil" selected>Harga 1 pensil (ribu rupiah)</option>
                <option value="buku">Harga 1 buku tulis (ribu rupiah)</option>
                <option value="jumlah">Jumlah total barang belanjaan</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="select-var-y">Variabel <span class="math-var-y">y</span> mewakili:</label>
              <select id="select-var-y" class="form-control">
                <option value="">-- Pilih arti variabel y --</option>
                <option value="pensil">Harga 1 pensil (ribu rupiah)</option>
                <option value="buku" selected>Harga 1 buku tulis (ribu rupiah)</option>
                <option value="jumlah">Jumlah total barang belanjaan</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Langkah 2: Menyusun Model Matematika SPLDV -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span>2️⃣</span> Langkah 2: Susun Dua Persamaan Linear</h3>
          </div>
          <p style="font-size: 0.95rem;">
            Tuliskan bentuk aljabar untuk masing-masing transaksi paket belanja (sistem pemeriksa pintar menerima urutan penulisan yang setara, misalnya <code>2x + y = 8</code> atau <code>y + 2x = 8</code>):
          </p>

          <form id="equation-modeling-form" style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1rem;">
            
            <!-- Transaksi 1: 2 pensil + 1 buku = Rp8.000 -->
            <div class="card" style="background: #FAFCFF; border: 1.5px solid var(--color-primary-border); padding: 1.25rem;">
              <div style="font-weight: 700; margin-bottom: 0.4rem; color: var(--color-primary-dark);">
                ✏️ Transaksi 1 (2 pensil + 1 buku tulis = Rp8.000):
              </div>
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <input type="text" id="input-eq1" class="form-control" placeholder="Ketik persamaan 1, contoh: 2x + y = 8" style="font-family: var(--font-family-math); font-size: 1.1rem; font-weight: 600;" required>
              </div>
              <div id="eq1-feedback" class="form-feedback hidden"></div>
            </div>

            <!-- Transaksi 2: 1 pensil + 2 buku = Rp10.000 -->
            <div class="card" style="background: #FAFCFF; border: 1.5px solid var(--color-primary-border); padding: 1.25rem;">
              <div style="font-weight: 700; margin-bottom: 0.4rem; color: var(--color-primary-dark);">
                📓 Transaksi 2 (1 pensil + 2 buku tulis = Rp10.000):
              </div>
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <input type="text" id="input-eq2" class="form-control" placeholder="Ketik persamaan 2, contoh: x + 2y = 10" style="font-family: var(--font-family-math); font-size: 1.1rem; font-weight: 600;" required>
              </div>
              <div id="eq2-feedback" class="form-feedback hidden"></div>
            </div>

            <div style="display: flex; justify-content: flex-end;">
              <button type="submit" class="btn btn-primary btn-lg" id="btn-verify-model">
                Periksa Model Persamaan
              </button>
            </div>
          </form>
        </div>

        <!-- Banner Umpan Balik Sukses & Langkah Penyelesaian Lengkap -->
        <div id="success-banner" class="card card-accent-blue hidden" style="border: 2px solid var(--color-success); padding: 1.75rem; background: linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%);">
          <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <div style="font-size: 2.8rem; line-height: 1;">🎉</div>
            <div style="flex: 1;">
              <h2 style="color: var(--color-success); font-size: 1.35rem; margin-bottom: 0.35rem;">
                Tepat Sekali! Model Matematika Berhasil Disusun
              </h2>
              <p style="font-size: 0.95rem; color: var(--color-text-main); margin-bottom: 1rem;">
                Dua persamaan linear yang terbentuk adalah: <code>2x + y = 8</code> dan <code>x + 2y = 10</code>.
              </p>

              <!-- Uraian Langkah 3, 4, dan 5 Sesuai Panduan Kemendikbudristek -->
              <div style="background: white; border-radius: var(--radius-md); padding: 1.25rem; border: 1.5px solid #BBF7D0; margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
                <div style="font-weight: 700; color: #166534; font-size: 1.05rem; border-bottom: 1px solid #DCFCE7; padding-bottom: 0.4rem;">
                  Langkah 4 & 5: Penyelesaian dan Penafsiran Masalah
                </div>
                
                <div style="font-size: 0.92rem; line-height: 1.6;">
                  <strong>Penyelesaian SPLDV (Metode Campuran):</strong><br>
                  1) Dari persamaan (1): <code>y = 8 - 2x</code><br>
                  2) Substitusikan ke persamaan (2): <code>x + 2(8 - 2x) = 10 ⟹ x + 16 - 4x = 10 ⟹ -3x = -6 ⟹ x = 2</code><br>
                  3) Cari nilai y: <code>y = 8 - 2(2) = 8 - 4 = 4</code>.<br>
                  Diperoleh nilai <strong>x = 2</strong> dan <strong>y = 4</strong>.
                </div>

                <div style="background: #F0FDF4; padding: 0.75rem 1rem; border-radius: 6px; border-left: 4px solid var(--color-success); font-size: 0.92rem; line-height: 1.6;">
                  <strong>Kesimpulan Kontekstual (Langkah 5):</strong><br>
                  • Harga <strong>1 pensil</strong> adalah <strong>Rp2.000,00</strong>.<br>
                  • Harga <strong>1 buku tulis</strong> adalah <strong>Rp4.000,00</strong>.<br>
                  <span style="color: #15803D; font-size: 0.85rem;">✓ Uji periksa: 2(2.000) + 4.000 = Rp8.000 (Cocok!) dan 2.000 + 2(4.000) = Rp10.000 (Cocok!).</span>
                </div>
              </div>

              <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center;">
                <a href="#/simulasi" class="btn btn-success btn-lg" id="btn-to-scale" style="box-shadow: 0 4px 15px rgba(46, 158, 107, 0.4); font-weight: 700;">
                  Lanjut ke Tahap 3: Simulasi Timbangan ⚖️ →
                </a>
                <a href="#/materi" class="btn btn-outline" style="font-size: 0.9rem;">
                  ← Kembali ke Materi
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Kesalahan yang Perlu Dihindari (Sesuai Bahan Ajar Baru) -->
        <div class="card" style="border-left: 5px solid #E5484D; background: #FFF9F9;">
          <h3 style="color: #B91C1C; font-size: 1.15rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>⚠️</span> Kesalahan yang Sering Terjadi (Perlu Dihindari):
          </h3>
          <ul style="padding-left: 1.25rem; font-size: 0.92rem; color: var(--color-text-main); line-height: 1.7; display: flex; flex-direction: column; gap: 0.3rem;">
            <li><strong>Tidak menjelaskan arti x dan y:</strong> Jawaban akhir menjadi membingungkan dan sulit ditafsirkan konteksnya.</li>
            <li><strong>Hanya memeriksa ke salah satu persamaan:</strong> Penyelesaian SPLDV wajib memenuhi <em>kedua</em> persamaan sekaligus.</li>
            <li><strong>Lupa mengalikan semua suku:</strong> Saat menyamakan koefisien pada metode eliminasi, seluruh suku pada baris tersebut harus dikalikan.</li>
            <li><strong>Keliru membaca pasangan berurutan:</strong> Pasangan (x, y) berbeda maknanya dengan (y, x).</li>
          </ul>
        </div>

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const form = container.querySelector('#equation-modeling-form');
    const input1 = container.querySelector('#input-eq1');
    const input2 = container.querySelector('#input-eq2');
    const fb1 = container.querySelector('#eq1-feedback');
    const fb2 = container.querySelector('#eq2-feedback');
    const successBanner = container.querySelector('#success-banner');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const varX = container.querySelector('#select-var-x').value;
        const varY = container.querySelector('#select-var-y').value;

        if (varX !== 'pensil' || varY !== 'buku') {
          showToast('Periksa kembali pemisalan variabel x (pensil) dan y (buku) pada Langkah 1!', 'warning');
          return;
        }

        const eq1Text = input1.value;
        const eq2Text = input2.value;

        // Cek persamaan 1 target: 2x + 1y = 8 (2 pensil + 1 buku = 8)
        const check1 = isEquationMatching(eq1Text, 2, 1, 8);
        if (check1.matches) {
          fb1.className = 'form-feedback success';
          fb1.innerHTML = '✅ Tepat sekali! Model aljabar transaksi 1: 2x + y = 8.';
          fb1.classList.remove('hidden');
        } else {
          fb1.className = 'form-feedback error';
          fb1.innerHTML = `❌ ${check1.reason || 'Periksa kembali koefisien dan konstanta transaksi 1 (2 pensil + 1 buku = 8).'}`;
          fb1.classList.remove('hidden');
        }

        // Cek persamaan 2 target: 1x + 2y = 10 (1 pensil + 2 buku = 10)
        const check2 = isEquationMatching(eq2Text, 1, 2, 10);
        if (check2.matches) {
          fb2.className = 'form-feedback success';
          fb2.innerHTML = '✅ Tepat sekali! Model aljabar transaksi 2: x + 2y = 10.';
          fb2.classList.remove('hidden');
        } else {
          fb2.className = 'form-feedback error';
          fb2.innerHTML = `❌ ${check2.reason || 'Periksa kembali koefisien dan konstanta transaksi 2 (1 pensil + 2 buku = 10).'}`;
          fb2.classList.remove('hidden');
        }

        if (check1.matches && check2.matches) {
          successBanner.classList.remove('hidden');
          successBanner.scrollIntoView({ behavior: 'smooth' });
          showToast('Kedua persamaan tepat! Model SPLDV berhasil dibentuk.', 'success');
          if (user) {
            saveProgress(user.id, { completedStages: ['kontekstual'] });
          }
        }
      });
    }

    const btnToScale = container.querySelector('#btn-to-scale');
    if (btnToScale) {
      btnToScale.addEventListener('click', () => {
        if (user) {
          saveProgress(user.id, { completedStages: ['kontekstual'] });
        }
      });
    }
  }

  render();
}
