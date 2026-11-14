/**
 * Kontekstual View: Masalah Kantin Sekolah (Roti & Susu)
 * Pemodelan matematika SPLDV dengan pemeriksaan persamaan toleran urutan suku & spasi.
 */

import { isEquationMatching } from '../../utils/math-parser.js';
import { saveProgress, getProgress } from '../../services/storage.js';
import { appState } from '../../state.js';
import { showToast } from '../../utils/dom-helpers.js';

export function renderKontekstualView(container) {
  const user = appState.getUser();
  const currentProgress = user ? getProgress(user.id) : { completedStages: [] };

  let isVerified = false;

  function render() {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 900px; margin: 0 auto;">
        
        <!-- Breadcrumb & Header -->
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="#/materi" style="font-weight: 600; font-size: 0.9rem;">← Materi SPLDV</a>
            <span style="color: var(--color-text-light);">/</span>
            <span style="color: var(--color-primary); font-weight: 700; font-size: 0.9rem;">Masalah Kontekstual</span>
          </div>
          <h1 style="font-size: 2rem;">Masalah Kantin Sekolah: Roti Manis & Susu Kotak</h1>
          <p style="font-size: 1.05rem; margin-top: 0.5rem;">
            Bantu ibu kantin membuat model matematika aljabar berdasarkan paket pembelian siswa!
          </p>
        </div>

        <!-- Ilustrasi Skenario Kantin -->
        <div class="card" style="background: linear-gradient(135deg, #FFF8E1 0%, #FFFFFF 100%); border: 2px solid #FFE082;">
          <div style="display: flex; flex-wrap: wrap; gap: 2rem; align-items: center;">
            <div style="flex: 1; min-width: 280px;">
              <div class="badge badge-warning" style="margin-bottom: 0.75rem;">🥪 Cerita Masalah Kantin</div>
              <h2 style="font-size: 1.4rem; color: #795548; margin-bottom: 0.75rem;">
                Pesanan Andi & Citra di Jam Istirahat
              </h2>
              <p style="font-size: 1rem; line-height: 1.6; color: var(--color-text-main);">
                Pada jam istirahat pertama, <strong>Andi</strong> membeli <strong>2 potong roti manis</strong> dan <strong>1 kotak susu</strong> dengan total harga <strong>Rp11.000</strong>.
              </p>
              <p style="font-size: 1rem; line-height: 1.6; color: var(--color-text-main);">
                Beberapa saat kemudian, <strong>Citra</strong> membeli <strong>1 potong roti manis</strong> dan <strong>2 kotak susu</strong> dengan total harga <strong>Rp13.000</strong>.
              </p>
              <div style="background: white; border-radius: var(--radius-md); padding: 0.75rem 1rem; border: 1px dashed #FFA000; font-size: 0.9rem; font-weight: 600; color: #D84315;">
                💡 Catatan: Agar penulisan aljabar lebih ringkas, satuan harga dinyatakan dalam <strong>ribuan rupiah</strong> (contoh: Rp11.000 ditulis 11, dan Rp13.000 ditulis 13).
              </div>
            </div>

            <!-- Ilustrasi Visual Makanan Kantin -->
            <div style="display: flex; gap: 1rem; justify-content: center; align-items: center; padding: 1rem;">
              <div style="text-align: center; width: 110px;">
                <img src="assets/images/bread.svg" alt="Roti Manis" style="width: 90px; height: 90px; margin: 0 auto;">
                <div style="font-weight: 700; font-size: 0.9rem; margin-top: 0.4rem; color: #E65100;">Roti (x)</div>
                <div style="font-size: 0.75rem; color: var(--color-text-muted);">Variabel x</div>
              </div>
              <span style="font-size: 2rem; font-weight: 800; color: var(--color-primary);">+</span>
              <div style="text-align: center; width: 110px;">
                <img src="assets/images/milk.svg" alt="Kotak Susu" style="width: 90px; height: 90px; margin: 0 auto;">
                <div style="font-weight: 700; font-size: 0.9rem; margin-top: 0.4rem; color: #7B1FA2;">Susu (y)</div>
                <div style="font-size: 0.75rem; color: var(--color-text-muted);">Variabel y</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Langkah 1: Menentukan Pemisalan Variabel -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span>1️⃣</span> Langkah 1: Tentukan Arti Variabel</h3>
          </div>
          <p>Cocokkan variabel dengan harga barang yang diwakilinya:</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
            <div class="form-group">
              <label class="form-label" for="select-var-x">Variabel <span class="math-var-x">x</span> mewakili:</label>
              <select id="select-var-x" class="form-control">
                <option value="">-- Pilih arti variabel x --</option>
                <option value="roti" selected>Harga 1 potong roti manis (ribuan rupiah)</option>
                <option value="susu">Harga 1 kotak susu (ribuan rupiah)</option>
                <option value="jumlah">Jumlah seluruh pesanan makanan</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="select-var-y">Variabel <span class="math-var-y">y</span> mewakili:</label>
              <select id="select-var-y" class="form-control">
                <option value="">-- Pilih arti variabel y --</option>
                <option value="roti">Harga 1 potong roti manis (ribuan rupiah)</option>
                <option value="susu" selected>Harga 1 kotak susu (ribuan rupiah)</option>
                <option value="jumlah">Jumlah seluruh pesanan makanan</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Langkah 2: Menyusun Model Matematika SPLDV -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span>2️⃣</span> Langkah 2: Tuliskan Dua Persamaan Linear</h3>
          </div>
          <p>
            Tuliskan persamaan aljabar dari masing-masing pesanan. Sistem pemeriksa pintar SPLASH menerima berbagai urutan penulisan yang setara (misal: <code>2x + y = 11</code> atau <code>y + 2x = 11</code>).
          </p>

          <form id="equation-modeling-form" style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1rem;">
            
            <!-- Persamaan 1: Pesanan Andi -->
            <div class="card" style="background: #FAFCFF; border: 1.5px solid var(--color-primary-border); padding: 1.25rem;">
              <div style="font-weight: 700; margin-bottom: 0.5rem; color: var(--color-primary-dark);">
                🥪 Pesanan Andi (2 roti + 1 susu = Rp11.000):
              </div>
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <input type="text" id="input-eq1" class="form-control" placeholder="Ketik persamaan 1, contoh: 2x + y = 11" style="font-family: var(--font-family-math); font-size: 1.1rem; font-weight: 600;" required>
              </div>
              <div id="eq1-feedback" class="form-feedback hidden"></div>
            </div>

            <!-- Persamaan 2: Pesanan Citra -->
            <div class="card" style="background: #FAFCFF; border: 1.5px solid var(--color-primary-border); padding: 1.25rem;">
              <div style="font-weight: 700; margin-bottom: 0.5rem; color: var(--color-primary-dark);">
                🥛 Pesanan Citra (1 roti + 2 susu = Rp13.000):
              </div>
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <input type="text" id="input-eq2" class="form-control" placeholder="Ketik persamaan 2, contoh: x + 2y = 13" style="font-family: var(--font-family-math); font-size: 1.1rem; font-weight: 600;" required>
              </div>
              <div id="eq2-feedback" class="form-feedback hidden"></div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 1rem;">
              <button type="submit" class="btn btn-primary btn-lg" id="btn-verify-model">
                Periksa Model Persamaan
              </button>
            </div>
          </form>
        </div>

        <!-- Banner Umpan Balik Sukses & Tombol Lanjut ke Simulasi Timbangan -->
        <div id="success-banner" class="card card-accent-blue hidden" style="border: 2px solid var(--color-success); text-align: center; padding: 2rem;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
          <h2 style="color: var(--color-success); margin-bottom: 0.5rem;">Hebat! Model SPLDV Berhasil Dibentuk</h2>
          <p style="font-size: 1.05rem; max-width: 650px; margin: 0 auto 1.5rem auto;">
            Kamu telah berhasil merumuskan dua persamaan: <code>2x + y = 11</code> dan <code>x + 2y = 13</code>. Sekarang, mari kita visualisasikan kedua persamaan ini ke dalam timbangan dua lengan interaktif untuk mencari nilai x dan y!
          </p>
          <a href="#/simulasi" class="btn btn-success btn-lg" id="btn-to-scale" style="box-shadow: 0 4px 15px rgba(46, 158, 107, 0.4);">
            Buka Simulasi Timbangan ⚖️ →
          </a>
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

        if (varX !== 'roti' || varY !== 'susu') {
          showToast('Periksa kembali pemisalan variabel x dan y pada Langkah 1!', 'warning');
          return;
        }

        const eq1Text = input1.value;
        const eq2Text = input2.value;

        // Cek persamaan 1 target: 2x + 1y = 11 (urutan apapun)
        const check1 = isEquationMatching(eq1Text, 2, 1, 11);
        if (check1.matches) {
          fb1.className = 'form-feedback success';
          fb1.innerHTML = '✅ Tepat sekali! Model aljabar pesanan Andi: 2x + y = 11.';
          fb1.classList.remove('hidden');
        } else {
          fb1.className = 'form-feedback error';
          fb1.innerHTML = `❌ ${check1.reason || 'Periksa kembali koefisien dan konstanta pesanan Andi.'}`;
          fb1.classList.remove('hidden');
        }

        // Cek persamaan 2 target: 1x + 2y = 13 (urutan apapun)
        const check2 = isEquationMatching(eq2Text, 1, 2, 13);
        if (check2.matches) {
          fb2.className = 'form-feedback success';
          fb2.innerHTML = '✅ Tepat sekali! Model aljabar pesanan Citra: x + 2y = 13.';
          fb2.classList.remove('hidden');
        } else {
          fb2.className = 'form-feedback error';
          fb2.innerHTML = `❌ ${check2.reason || 'Periksa kembali koefisien dan konstanta pesanan Citra.'}`;
          fb2.classList.remove('hidden');
        }

        if (check1.matches && check2.matches) {
          isVerified = true;
          successBanner.classList.remove('hidden');
          successBanner.scrollIntoView({ behavior: 'smooth' });
          showToast('Kedua persamaan tepat! Silakan lanjut ke simulasi timbangan.', 'success');
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
