/**
 * Eksplorasi View: Uji Coba Pasangan Nilai x dan y secara Simultan
 * Menampilkan slider & input angka, evaluasi otomatis kedua persamaan,
 * indikator status (ikon + teks), animasi bintang, dan tabel riwayat pengamatan.
 */

import { evaluateEquation } from '../../utils/math-parser.js';
import { saveProgress, getProgress } from '../../services/storage.js';
import { appState } from '../../state.js';
import { showToast } from '../../utils/dom-helpers.js';

export function renderEksplorasiView(container) {
  const user = appState.getUser();
  const progress = user ? getProgress(user.id) : { explorationTrials: [] };
  
  let valX = 1;
  let valY = 1;
  let trials = progress.explorationTrials || [];

  function evaluateCurrent() {
    // Persamaan 1: 2x + y = 11
    const res1 = evaluateEquation(2, 1, 11, valX, valY);
    // Persamaan 2: x + 2y = 13
    const res2 = evaluateEquation(1, 2, 13, valX, valY);

    const isBothSatisfied = res1.isSatisfied && res2.isSatisfied;
    const isOneSatisfied = (res1.isSatisfied && !res2.isSatisfied) || (!res1.isSatisfied && res2.isSatisfied);

    return { res1, res2, isBothSatisfied, isOneSatisfied };
  }

  function render() {
    const { res1, res2, isBothSatisfied, isOneSatisfied } = evaluateCurrent();

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 960px; margin: 0 auto;">
        
        <!-- Header -->
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="#/simulasi" style="font-weight: 600; font-size: 0.9rem;">← Simulasi Timbangan</a>
            <span style="color: var(--color-text-light);">/</span>
            <span style="color: var(--color-primary); font-weight: 700; font-size: 0.9rem;">Eksplorasi Nilai Variabel</span>
          </div>
          <h1 style="font-size: 2rem;">Eksplorasi Nilai x dan y (Metode Uji Coba Terarah)</h1>
          <p style="font-size: 1.05rem; margin-top: 0.5rem;">
            Ubah nilai <strong>x</strong> (harga roti) dan <strong>y</strong> (harga susu) untuk mencari pasangan yang memenuhi <em>kedua</em> persamaan sekaligus.
          </p>
        </div>

        <!-- Panel Kontrol Nilai x & y (Slider + Number Input) -->
        <div class="card" style="border: 2px solid var(--color-primary-border); background: white;">
          <div class="card-header">
            <h2 class="card-title"><span>🎛️</span> Atur Nilai x dan y</h2>
            <button class="btn btn-sm btn-outline" id="btn-save-trial">
              📥 Catat ke Tabel Pengamatan
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 1.25rem;">
            
            <!-- Kontrol Variabel x -->
            <div style="background: #FFF3E0; padding: 1.25rem; border-radius: var(--radius-md); border: 1.5px solid #FFE0B2;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <label for="slider-x" style="font-weight: 700; color: #BF360C; font-size: 1.05rem;">
                  Nilai x (Harga Roti):
                </label>
                <div class="slider-val-box" id="display-val-x" style="background: #FFE0B2; color: #BF360C;">
                  ${valX}
                </div>
              </div>
              <div class="slider-group">
                <span style="font-weight: 600; font-size: 0.85rem;">0</span>
                <input type="range" id="slider-x" class="slider-input" min="0" max="12" step="1" value="${valX}" style="accent-color: #FF7A00;">
                <span style="font-weight: 600; font-size: 0.85rem;">12</span>
              </div>
            </div>

            <!-- Kontrol Variabel y -->
            <div style="background: #F3E5F5; padding: 1.25rem; border-radius: var(--radius-md); border: 1.5px solid #E1BEE7;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <label for="slider-y" style="font-weight: 700; color: #4A148C; font-size: 1.05rem;">
                  Nilai y (Harga Susu):
                </label>
                <div class="slider-val-box" id="display-val-y" style="background: #E1BEE7; color: #4A148C;">
                  ${valY}
                </div>
              </div>
              <div class="slider-group">
                <span style="font-weight: 600; font-size: 0.85rem;">0</span>
                <input type="range" id="slider-y" class="slider-input" min="0" max="12" step="1" value="${valY}" style="accent-color: #9C27B0;">
                <span style="font-weight: 600; font-size: 0.85rem;">12</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Kartu Evaluasi Kedua Persamaan Secara Simultan (Responsif) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 1.25rem;">
          
          <!-- Evaluasi Persamaan 1 -->
          <div class="card ${res1.isSatisfied ? 'card-accent-blue' : ''}" style="border: 2px solid ${res1.isSatisfied ? 'var(--color-success)' : 'var(--color-border)'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span style="font-weight: 700; color: var(--color-primary-dark);">Persamaan (1)</span>
              <span class="badge ${res1.isSatisfied ? 'badge-success' : 'badge-danger'}">
                ${res1.isSatisfied ? '✅ Terpenuhi' : '❌ Belum Terpenuhi'}
              </span>
            </div>
            <div style="font-size: 1.25rem; font-family: var(--font-family-math); font-weight: 700; color: var(--color-primary-dark); margin-bottom: 0.5rem;">
              2x + y = 11
            </div>
            <div style="background: #F8FAFC; padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.95rem; margin-bottom: 0.5rem;">
              Substitusi: 2(<span class="math-var-x">${valX}</span>) + (<span class="math-var-y">${valY}</span>) = <strong>${res1.leftResult}</strong>
            </div>
            <div style="font-size: 0.85rem; color: ${res1.isSatisfied ? 'var(--color-success)' : 'var(--color-danger)'}; font-weight: 600;">
              ${res1.isSatisfied ? '✓ Ruas kiri sama dengan 11 (Seimbang)' : `Selisih: ${res1.leftResult} ≠ 11 (${res1.difference > 0 ? '+' : ''}${res1.difference})`}
            </div>
          </div>

          <!-- Evaluasi Persamaan 2 -->
          <div class="card ${res2.isSatisfied ? 'card-accent-blue' : ''}" style="border: 2px solid ${res2.isSatisfied ? 'var(--color-success)' : 'var(--color-border)'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span style="font-weight: 700; color: var(--color-primary-dark);">Persamaan (2)</span>
              <span class="badge ${res2.isSatisfied ? 'badge-success' : 'badge-danger'}">
                ${res2.isSatisfied ? '✅ Terpenuhi' : '❌ Belum Terpenuhi'}
              </span>
            </div>
            <div style="font-size: 1.25rem; font-family: var(--font-family-math); font-weight: 700; color: var(--color-primary-dark); margin-bottom: 0.5rem;">
              x + 2y = 13
            </div>
            <div style="background: #F8FAFC; padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.95rem; margin-bottom: 0.5rem;">
              Substitusi: (<span class="math-var-x">${valX}</span>) + 2(<span class="math-var-y">${valY}</span>) = <strong>${res2.leftResult}</strong>
            </div>
            <div style="font-size: 0.85rem; color: ${res2.isSatisfied ? 'var(--color-success)' : 'var(--color-danger)'}; font-weight: 600;">
              ${res2.isSatisfied ? '✓ Ruas kiri sama dengan 13 (Seimbang)' : `Selisih: ${res2.leftResult} ≠ 13 (${res2.difference > 0 ? '+' : ''}${res2.difference})`}
            </div>
          </div>

        </div>

        <!-- Banner Status Kesimpulan Pasangan -->
        <div id="conclusion-status-card">
          ${isBothSatisfied ? `
            <div class="card" style="background: linear-gradient(135deg, #E7F6ED 0%, #FFFFFF 100%); border: 2px solid var(--color-success); text-align: center; padding: 2rem;">
              <div style="font-size: 3rem; animation: starPop 400ms ease;">⭐ ⭐ ⭐</div>
              <h2 style="color: var(--color-success); margin: 0.5rem 0;">LUAR BIASA! Pasangan Solusi SPLDV Ditemukan!</h2>
              <p style="font-size: 1.1rem; color: #14532d; font-weight: 600; margin-bottom: 1.5rem;">
                Pasangan <strong>x = 3</strong> dan <strong>y = 5</strong> memenuhi KEDUA persamaan sekaligus! Harga 1 roti adalah Rp3.000 dan harga 1 susu adalah Rp5.000.
              </p>
              <div style="display: flex; justify-content: center; gap: 1rem;">
                <a href="#/eliminasi" class="btn btn-success btn-lg" id="btn-to-elimination">
                  Lanjut ke Lab Eliminasi 🔬 →
                </a>
              </div>
            </div>
          ` : (isOneSatisfied ? `
            <div class="alert alert-warning" style="font-size: 1rem;">
              <span>⚠️</span>
              <div>
                <strong>Perhatian:</strong> Pasangan (x = ${valX}, y = ${valY}) hanya memenuhi salah satu persamaan saja, sehingga <strong>belum menjadi solusi SPLDV</strong>! Ingat konsep kunci: penyelesaian harus memenuhi kedua persamaan secara bersamaan.
              </div>
            </div>
          ` : `
            <div class="alert alert-info">
              <span>ℹ️</span>
              <div>
                Pasangan (x = ${valX}, y = ${valY}) belum memenuhi kedua persamaan. Geser slider untuk mencoba kombinasi angka lain!
              </div>
            </div>
          `)}
        </div>

        <!-- Tabel Riwayat Pengamatan Otomatis (Akan Diintegrasikan ke LKPD) -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span>📋</span> Tabel Riwayat Pengamatan Siswa</h3>
            <span class="badge badge-info">${trials.length} Percobaan Dicatat</span>
          </div>
          <p style="font-size: 0.88rem;">Data tabel di bawah ini tersimpan otomatis dan akan langsung muncul di Lembar Kerja Peserta Didik (LKPD).</p>

          <div class="table-responsive">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nilai x (Roti)</th>
                  <th>Nilai y (Susu)</th>
                  <th>2x + y = 11</th>
                  <th>x + 2y = 13</th>
                  <th>Status Kesimpulan</th>
                </tr>
              </thead>
              <tbody>
                ${trials.length === 0 ? `
                  <tr>
                    <td colspan="6" style="text-align: center; color: var(--color-text-light); padding: 1.5rem;">
                      Belum ada data dicatat. Klik tombol "Catat ke Tabel Pengamatan" setelah memilih angka.
                    </td>
                  </tr>
                ` : trials.map((t, idx) => `
                  <tr style="${t.isSolution ? 'background: #E8F5E9; font-weight: 700;' : ''}">
                    <td>${idx + 1}</td>
                    <td><span class="math-var-x">${t.x}</span></td>
                    <td><span class="math-var-y">${t.y}</span></td>
                    <td>${t.eq1Val} (${t.match1 ? '✅ Benar' : '❌ Salah'})</td>
                    <td>${t.eq2Val} (${t.match2 ? '✅ Benar' : '❌ Salah'})</td>
                    <td>
                      ${t.isSolution 
                        ? '<span class="badge badge-success">⭐ Solusi SPLDV</span>' 
                        : (t.match1 || t.match2 
                            ? '<span class="badge badge-warning">Hanya 1 Benar</span>' 
                            : '<span class="badge badge-danger">Belum Tepat</span>')}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const sliderX = container.querySelector('#slider-x');
    const sliderY = container.querySelector('#slider-y');
    const dispX = container.querySelector('#display-val-x');
    const dispY = container.querySelector('#display-val-y');

    const onValChange = () => {
      valX = Number(sliderX.value);
      valY = Number(sliderY.value);
      if (dispX) dispX.textContent = valX;
      if (dispY) dispY.textContent = valY;

      // Evaluasi ulang UI tanpa reload penuh slider
      const { res1, res2, isBothSatisfied, isOneSatisfied } = evaluateCurrent();
      
      // Auto-save jika solusi ditemukan
      if (isBothSatisfied) {
        recordTrial(true);
        if (user) {
          saveProgress(user.id, { completedStages: ['eksplorasi'] });
        }
      }
      render();
    };

    if (sliderX) sliderX.addEventListener('input', onValChange);
    if (sliderY) sliderY.addEventListener('input', onValChange);

    // Tombol simpan manual ke riwayat pengamatan
    const btnSaveTrial = container.querySelector('#btn-save-trial');
    if (btnSaveTrial) {
      btnSaveTrial.addEventListener('click', () => {
        recordTrial();
        render();
        showToast(`Pasangan (${valX}, ${valY}) berhasil dicatat ke tabel!`, 'success');
      });
    }

    const btnNext = container.querySelector('#btn-to-elimination');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (user) {
          saveProgress(user.id, { completedStages: ['eksplorasi'] });
        }
      });
    }
  }

  function recordTrial(isAuto = false) {
    const { res1, res2, isBothSatisfied } = evaluateCurrent();
    const existing = trials.find(t => t.x === valX && t.y === valY);
    if (!existing) {
      trials.push({
        x: valX,
        y: valY,
        eq1Val: res1.leftResult,
        eq2Val: res2.leftResult,
        match1: res1.isSatisfied,
        match2: res2.isSatisfied,
        isSolution: isBothSatisfied,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      if (user) {
        saveProgress(user.id, {
          explorationTrials: trials,
          completedStages: isBothSatisfied ? ['eksplorasi'] : []
        });
      }
    }
  }

  render();
}
