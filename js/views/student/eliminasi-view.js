/**
 * Eliminasi View: Laboratorium Metode Eliminasi & Substitusi Bertahap
 * Memilih variabel yang dieliminasi, memilih faktor pengali, animasi visual suku yang saling menghapus,
 * serta tahap substitusi untuk menemukan penyelesaian lengkap (x = 3, y = 5).
 */

import { saveProgress, getProgress } from '../../services/storage.js';
import { appState } from '../../state.js';
import { showToast } from '../../utils/dom-helpers.js';

export function renderEliminasiView(container) {
  const user = appState.getUser();

  // State langkah interaktif
  let currentStep = 1; // 1: Pilih target, 2: Kalikan, 3: Eliminasi (kurangkan), 4: Substitusi
  let targetVar = 'y'; // 'y' atau 'x'
  let multiplier1 = 2; // Pengali persamaan 1
  let multiplier2 = 1; // Pengali persamaan 2
  let solvedX = null;
  let solvedY = null;

  function render() {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 900px; margin: 0 auto;">
        
        <!-- Header -->
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="#/eksplorasi" style="font-weight: 600; font-size: 0.9rem;">← Eksplorasi x & y</a>
            <span style="color: var(--color-text-light);">/</span>
            <span style="color: var(--color-primary); font-weight: 700; font-size: 0.9rem;">Laboratorium Eliminasi</span>
          </div>
          <h1 style="font-size: 2rem;">Laboratorium Eliminasi SPLDV</h1>
          <p style="font-size: 1.05rem; margin-top: 0.5rem;">
            Pelajari cara aljabar sistematis untuk mengeliminasi (menghilangkan) salah satu variabel dengan menyamakan koefisiennya.
          </p>
        </div>

        <!-- Kartu Dua Persamaan Awal -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          <div class="card card-accent-blue" style="border: 2px solid var(--color-primary-border);">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 0.25rem;">
              Persamaan (1) – Kantin Andi:
            </div>
            <div style="font-size: 1.5rem; font-family: var(--font-family-math); font-weight: 700; color: var(--color-primary-dark);">
              2x + y = 11
            </div>
            <div style="font-size: 0.82rem; color: var(--color-text-muted); margin-top: 0.25rem;">
              Koefisien x = 2, Koefisien y = 1
            </div>
          </div>

          <div class="card card-accent-blue" style="border: 2px solid var(--color-primary-border);">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 0.25rem;">
              Persamaan (2) – Kantin Citra:
            </div>
            <div style="font-size: 1.5rem; font-family: var(--font-family-math); font-weight: 700; color: var(--color-primary-dark);">
              x + 2y = 13
            </div>
            <div style="font-size: 0.82rem; color: var(--color-text-muted); margin-top: 0.25rem;">
              Koefisien x = 1, Koefisien y = 2
            </div>
          </div>
        </div>

        <!-- TAHAP 1: Memilih Variabel Target Eliminasi -->
        <div class="card" style="border-left: 5px solid ${currentStep >= 1 ? 'var(--color-primary)' : 'var(--color-border)'};">
          <div class="card-header">
            <h3 class="card-title">
              <span>1️⃣</span> Langkah 1: Pilih Variabel yang Ingin Dieliminasi
            </h3>
            ${currentStep > 1 ? '<span class="badge badge-success">✓ Selesai</span>' : ''}
          </div>
          <p>Variabel mana yang ingin kamu hilangkan terlebih dahulu dari sistem?</p>

          <div style="display: flex; gap: 1rem; margin-top: 0.75rem;">
            <button class="btn ${targetVar === 'y' ? 'btn-primary' : 'btn-outline'}" id="btn-target-y" ${currentStep > 1 ? 'disabled' : ''}>
              🎯 Eliminasi Variabel y (Direkomendasikan)
            </button>
            <button class="btn ${targetVar === 'x' ? 'btn-primary' : 'btn-outline'}" id="btn-target-x" ${currentStep > 1 ? 'disabled' : ''}>
              🎯 Eliminasi Variabel x
            </button>
          </div>

          ${currentStep === 1 ? `
            <div style="margin-top: 1.25rem; display: flex; justify-content: flex-end;">
              <button class="btn btn-primary" id="btn-confirm-step1">
                Lanjut ke Penyetaraan Koefisien →
              </button>
            </div>
          ` : ''}
        </div>

        <!-- TAHAP 2: Menyamakan Koefisien (Mengalikan Persamaan) -->
        ${currentStep >= 2 ? `
          <div class="card" style="border-left: 5px solid ${currentStep >= 2 ? 'var(--color-primary)' : 'var(--color-border)'}; animation: fadeIn 300ms ease;">
            <div class="card-header">
              <h3 class="card-title">
                <span>2️⃣</span> Langkah 2: Samakan Koefisien Variabel ${targetVar.toUpperCase()}
              </h3>
              ${currentStep > 2 ? '<span class="badge badge-success">✓ Selesai</span>' : ''}
            </div>
            <p>
              Koefisien ${targetVar} pada Persamaan (1) adalah <strong>${targetVar === 'y' ? '1' : '2'}</strong>, dan pada Persamaan (2) adalah <strong>${targetVar === 'y' ? '2' : '1'}</strong>.
              Tentukan faktor pengali agar koefisien ${targetVar} bernilai sama!
            </p>

            <div style="background: var(--color-primary-lighter); padding: 1.25rem; border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 1rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                <span style="font-family: var(--font-family-math); font-size: 1.15rem; font-weight: 700;">
                  Persamaan (1): 2x + y = 11
                </span>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span>dikalikan</span>
                  <select id="sel-mult-1" class="form-control" style="width: 80px;" ${currentStep > 2 ? 'disabled' : ''}>
                    <option value="1" ${multiplier1 === 1 ? 'selected' : ''}>× 1</option>
                    <option value="2" ${multiplier1 === 2 ? 'selected' : ''}>× 2</option>
                    <option value="3" ${multiplier1 === 3 ? 'selected' : ''}>× 3</option>
                  </select>
                  <span>menjadi: <strong style="color: var(--color-primary);">${2 * multiplier1}x + ${1 * multiplier1}y = ${11 * multiplier1}</strong></span>
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                <span style="font-family: var(--font-family-math); font-size: 1.15rem; font-weight: 700;">
                  Persamaan (2): x + 2y = 13
                </span>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span>dikalikan</span>
                  <select id="sel-mult-2" class="form-control" style="width: 80px;" ${currentStep > 2 ? 'disabled' : ''}>
                    <option value="1" ${multiplier2 === 1 ? 'selected' : ''}>× 1</option>
                    <option value="2" ${multiplier2 === 2 ? 'selected' : ''}>× 2</option>
                  </select>
                  <span>menjadi: <strong style="color: var(--color-primary);">${1 * multiplier2}x + ${2 * multiplier2}y = ${13 * multiplier2}</strong></span>
                </div>
              </div>
            </div>

            ${currentStep === 2 ? `
              <div style="margin-top: 1.25rem; display: flex; justify-content: flex-end;">
                <button class="btn btn-primary" id="btn-confirm-step2">
                  Lakukan Pengurangan (Eliminasi) →
                </button>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- TAHAP 3: Animasi Eliminasi Suku & Menemukan Nilai Pertama -->
        ${currentStep >= 3 ? `
          <div class="card" style="border-left: 5px solid ${currentStep >= 3 ? 'var(--color-primary)' : 'var(--color-border)'}; animation: fadeIn 300ms ease;">
            <div class="card-header">
              <h3 class="card-title">
                <span>3️⃣</span> Langkah 3: Eliminasi Suku Sejenis
              </h3>
              ${currentStep > 3 ? '<span class="badge badge-success">✓ Selesai</span>' : ''}
            </div>
            
            <p>Perhatikan bagaimana suku <strong style="background: #FFF9C4; padding: 2px 6px; border-radius: 4px;">2y</strong> saling meniadakan saat kedua persamaan dikurangkan:</p>

            <div style="background: #1E293B; color: white; padding: 1.5rem; border-radius: var(--radius-md); font-family: var(--font-family-math); font-size: 1.3rem; line-height: 1.8;">
              <div style="display: flex; justify-content: space-between; max-width: 380px;">
                <span>&nbsp; 4x + <span style="background: #854D0E; padding: 2px 6px; border-radius: 4px; text-decoration: line-through; color: #FDE047;">2y</span> = 22</span>
              </div>
              <div style="display: flex; justify-content: space-between; max-width: 380px; border-bottom: 2px solid white; padding-bottom: 4px;">
                <span>&nbsp; 1x + <span style="background: #854D0E; padding: 2px 6px; border-radius: 4px; text-decoration: line-through; color: #FDE047;">2y</span> = 13</span>
                <span style="font-weight: 700; color: #EF4444;">&minus;</span>
              </div>
              <div style="color: #4ADE80; font-weight: 700; margin-top: 8px;">
                3x + 0 = 9 &nbsp;⟹&nbsp; x = 9 / 3 = 3
              </div>
            </div>

            <div class="alert alert-success" style="margin-top: 1rem;">
              <span>✅</span>
              <div>
                Nilai pertama berhasil ditemukan: <strong>x = 3</strong> (Harga 1 roti manis = Rp3.000).
              </div>
            </div>

            ${currentStep === 3 ? `
              <div style="display: flex; justify-content: flex-end;">
                <button class="btn btn-primary" id="btn-confirm-step3">
                  Lanjut ke Langkah Substitusi →
                </button>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- TAHAP 4: Substitusi untuk Menemukan Variabel Kedua -->
        ${currentStep >= 4 ? `
          <div class="card" style="border-left: 5px solid var(--color-success); animation: fadeIn 300ms ease;">
            <div class="card-header">
              <h3 class="card-title">
                <span>4️⃣</span> Langkah 4: Substitusi Nilai x = 3 ke Salah Satu Persamaan
              </h3>
              <span class="badge badge-success">✓ Lengkap</span>
            </div>

            <p>Masukkan nilai <strong>x = 3</strong> ke Persamaan (1): <code>2x + y = 11</code>:</p>

            <div style="background: var(--color-primary-lighter); padding: 1.25rem; border-radius: var(--radius-md); font-size: 1.05rem; line-height: 1.8;">
              <div>1. Tulis persamaan asal: <code>2x + y = 11</code></div>
              <div>2. Ganti x dengan 3: <code>2(3) + y = 11</code></div>
              <div>3. Kalikan: <code>6 + y = 11</code></div>
              <div>4. Kurangkan kedua ruas dengan 6: <code>y = 11 - 6</code></div>
              <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 1.25rem; margin-top: 0.5rem;">
                ⟹ <strong>y = 5</strong> (Harga 1 susu kotak = Rp5.000)
              </div>
            </div>

            <!-- Rangkuman Solusi Lengkap -->
            <div class="card card-accent-blue" style="border: 2px solid var(--color-success); text-align: center; margin-top: 1.5rem; padding: 1.5rem;">
              <span style="font-size: 2.5rem;">🎉</span>
              <h2 style="color: var(--color-success); margin: 0.25rem 0;">Penyelesaian SPLDV Lengkap Ditemukan!</h2>
              <div style="font-size: 1.2rem; font-weight: 700; color: var(--color-primary-dark); margin: 0.5rem 0;">
                Himpunan Penyelesaian: { (x, y) } = { (3, 5) }
              </div>
              <p style="font-size: 0.95rem; margin-bottom: 1.25rem;">
                Kamu telah memahami metode eliminasi dan substitusi. Sekarang kamu siap menguji kemampuanmu dalam berbagai Misi Tantangan!
              </p>
              <a href="#/tantangan" class="btn btn-success btn-lg" id="btn-to-missions">
                Masuk ke Tantangan Misi ⭐ →
              </a>
            </div>
          </div>
        ` : ''}

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Tombol Target Variabel
    const btnTargetY = container.querySelector('#btn-target-y');
    const btnTargetX = container.querySelector('#btn-target-x');
    if (btnTargetY) {
      btnTargetY.addEventListener('click', () => {
        targetVar = 'y';
        multiplier1 = 2;
        multiplier2 = 1;
        render();
      });
    }
    if (btnTargetX) {
      btnTargetX.addEventListener('click', () => {
        targetVar = 'x';
        multiplier1 = 1;
        multiplier2 = 2;
        render();
      });
    }

    // Konfirmasi Step 1
    const btnStep1 = container.querySelector('#btn-confirm-step1');
    if (btnStep1) {
      btnStep1.addEventListener('click', () => {
        currentStep = 2;
        render();
        showToast('Variabel target dipilih. Sekarang samakan koefisiennya.', 'info');
      });
    }

    // Dropdown Multiplier
    const selMult1 = container.querySelector('#sel-mult-1');
    const selMult2 = container.querySelector('#sel-mult-2');
    if (selMult1) selMult1.addEventListener('change', (e) => { multiplier1 = Number(e.target.value); render(); });
    if (selMult2) selMult2.addEventListener('change', (e) => { multiplier2 = Number(e.target.value); render(); });

    // Konfirmasi Step 2
    const btnStep2 = container.querySelector('#btn-confirm-step2');
    if (btnStep2) {
      btnStep2.addEventListener('click', () => {
        // Cek apakah koefisien sudah sama
        const coeff1 = (targetVar === 'y' ? 1 : 2) * multiplier1;
        const coeff2 = (targetVar === 'y' ? 2 : 1) * multiplier2;

        if (coeff1 !== coeff2) {
          showToast(`Koefisien ${targetVar} belum sama (${coeff1} ≠ ${coeff2}). Sesuaikan pengali!`, 'warning');
          return;
        }

        currentStep = 3;
        render();
        showToast(`Hebat! Koefisien ${targetVar} kini sama (${coeff1}). Lakukan pengurangan!`, 'success');
      });
    }

    // Konfirmasi Step 3
    const btnStep3 = container.querySelector('#btn-confirm-step3');
    if (btnStep3) {
      btnStep3.addEventListener('click', () => {
        currentStep = 4;
        solvedX = 3;
        solvedY = 5;
        if (user) {
          saveProgress(user.id, { completedStages: ['eliminasi'] });
        }
        render();
      });
    }

    const btnNext = container.querySelector('#btn-to-missions');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (user) {
          saveProgress(user.id, { completedStages: ['eliminasi'] });
        }
      });
    }
  }

  render();
}
