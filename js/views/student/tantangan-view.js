/**
 * Tantangan View: Misi Petualangan SPLDV Bertingkat
 * Menampilkan misi mudah, sedang, sulit dari Bank Soal terpusat di Storage Service,
 * tombol Petunjuk Cerdas, verifikasi jawaban, dan penyimpanan progres misi.
 */

import { getMissions, getProgress, saveProgress } from '../../services/storage.js';
import { appState } from '../../state.js';
import { showToast } from '../../utils/dom-helpers.js';

export function renderTantanganView(container) {
  const user = appState.getUser();
  const missions = getMissions();
  const progress = user ? getProgress(user.id) : { missionProgress: {} };
  const missionProgress = progress.missionProgress || {};

  let activeMissionIndex = 0;
  let showHint = false;

  function render() {
    const currentMission = missions[activeMissionIndex] || missions[0];
    const isCompleted = !!missionProgress[currentMission.id];

    // Hitung jumlah misi yang selesai
    const completedCount = missions.filter(m => missionProgress[m.id]).length;
    const progressPercent = Math.round((completedCount / missions.length) * 100);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 960px; margin: 0 auto;">
        
        <!-- Header -->
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="#/lkpd" style="font-weight: 600; font-size: 0.9rem;">← LKPD Digital</a>
            <span style="color: var(--color-text-light);">/</span>
            <span style="color: var(--color-primary); font-weight: 700; font-size: 0.9rem;">5. Tantangan Misi</span>
          </div>
          <h1 style="font-size: 2rem;">Tantangan Misi Matematika SPLDV</h1>
          <p style="font-size: 1.05rem; margin-top: 0.5rem;">
            Buktikan keahlian aljabarmu dengan menyelesaikan serangkaian misi nyata dari tingkat mudah hingga menantang!
          </p>
        </div>

        <!-- Banner Progres Misi -->
        <div class="card" style="background: white; border: 1.5px solid var(--color-primary-border); padding: 1.25rem 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 1rem;">
              ⭐ Prestasi Misi: ${completedCount} dari ${missions.length} Misi Selesai
            </div>
            <span class="badge ${progressPercent === 100 ? 'badge-success' : 'badge-warning'}">
              ${progressPercent}% Tuntas
            </span>
          </div>
          <div class="progress-track" style="height: 12px; background: #E2E8F0;">
            <div class="progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <!-- Tab Pilihan Misi (1 s.d. 5) -->
        <div style="display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem;">
          ${missions.map((m, idx) => {
            const isDone = !!missionProgress[m.id];
            const isActive = idx === activeMissionIndex;
            let diffBadge = 'badge-success';
            if (m.difficulty === 'sedang') diffBadge = 'badge-warning';
            if (m.difficulty === 'sulit') diffBadge = 'badge-danger';

            return `
              <button class="btn ${isActive ? 'btn-primary' : 'btn-secondary'} mission-tab-btn" data-index="${idx}" style="white-space: nowrap; flex-shrink: 0; min-height: 48px; border-radius: var(--radius-md); padding: 0.5rem 1rem;">
                <span>${isDone ? '✅' : '🎯'}</span>
                <span>Misi ${idx + 1} (${m.difficulty})</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Kartu Soal Misi Aktif -->
        <div class="card" style="border: 2px solid var(--color-primary-border); padding: 2rem;">
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                <span class="badge ${currentMission.difficulty === 'mudah' ? 'badge-success' : (currentMission.difficulty === 'sedang' ? 'badge-warning' : 'badge-danger')}">
                  Tingkat: ${currentMission.difficulty.toUpperCase()}
                </span>
                ${isCompleted ? '<span class="badge badge-success">✓ Misi Telah Selesai</span>' : ''}
              </div>
              <h2 style="font-size: 1.5rem; color: var(--color-primary-dark);">${currentMission.title}</h2>
            </div>
          </div>

          <!-- Cerita Soal Kontekstual -->
          <div style="background: var(--color-primary-lighter); border-left: 5px solid var(--color-primary); padding: 1.25rem; border-radius: var(--radius-sm); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            ${currentMission.story}
          </div>

          <!-- Dua Persamaan Terbentuk -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: white; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem; text-align: center;">
              <div style="font-size: 0.85rem; color: var(--color-text-muted); font-weight: 600;">Persamaan (1)</div>
              <div style="font-size: 1.35rem; font-family: var(--font-family-math); font-weight: 700; color: var(--color-primary-dark); margin-top: 0.25rem;">
                ${currentMission.eq1}
              </div>
            </div>
            <div style="background: white; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem; text-align: center;">
              <div style="font-size: 0.85rem; color: var(--color-text-muted); font-weight: 600;">Persamaan (2)</div>
              <div style="font-size: 1.35rem; font-family: var(--font-family-math); font-weight: 700; color: var(--color-primary-dark); margin-top: 0.25rem;">
                ${currentMission.eq2}
              </div>
            </div>
          </div>

          <!-- Form Input Jawaban Siswa -->
          <form id="mission-answer-form">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
              <div class="form-group">
                <label class="form-label" for="input-answer-x">Nilai <span class="math-var-x">x</span>:</label>
                <input type="number" id="input-answer-x" class="form-control" placeholder="Contoh: 3" step="any" required value="${isCompleted ? currentMission.solutionX : ''}">
              </div>
              <div class="form-group">
                <label class="form-label" for="input-answer-y">Nilai <span class="math-var-y">y</span>:</label>
                <input type="number" id="input-answer-y" class="form-control" placeholder="Contoh: 5" step="any" required value="${isCompleted ? currentMission.solutionY : ''}">
              </div>
            </div>

            <!-- Petunjuk Konsep Pintar -->
            <div id="mission-hint-box" class="${showHint ? '' : 'hidden'}" style="background: #FFF8E1; border: 1.5px solid #FFE082; padding: 1rem 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
              <div style="font-weight: 700; color: #795548; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.35rem;">
                <span>💡</span> Petunjuk Konsep:
              </div>
              <div style="font-size: 0.95rem; color: #5D4037; line-height: 1.5;">
                ${currentMission.hint || 'Gunakan metode eliminasi dengan menyamakan salah satu koefisien variabel terlebih dahulu.'}
              </div>
            </div>

            <div id="mission-feedback-box" class="form-feedback hidden" style="margin-bottom: 1.25rem; font-size: 1rem; font-weight: 600;"></div>

            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
              <button type="button" class="btn btn-outline" id="btn-toggle-hint">
                💡 ${showHint ? 'Sembunyikan Petunjuk' : 'Buka Petunjuk'}
              </button>
              <div style="display: flex; gap: 0.75rem;">
                <button type="submit" class="btn btn-primary btn-lg" id="btn-check-mission">
                  Periksa Jawaban Misi
                </button>
              </div>
            </div>
          </form>

        </div>

        <!-- Tombol Navigasi Bawah -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem;">
          <a href="#/lkpd" class="btn btn-outline">← Kembali ke LKPD Digital</a>
          <a href="#/tentang" class="btn btn-primary btn-lg" id="btn-to-tentang">
            Lihat Tentang SPLASH 💡 →
          </a>
        </div>

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Navigasi Tab Misi
    container.querySelectorAll('.mission-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeMissionIndex = Number(btn.getAttribute('data-index'));
        showHint = false;
        render();
      });
    });

    // Toggle Hint
    const btnHint = container.querySelector('#btn-toggle-hint');
    if (btnHint) {
      btnHint.addEventListener('click', () => {
        showHint = !showHint;
        render();
      });
    }

    // Submit Jawaban
    const form = container.querySelector('#mission-answer-form');
    const inputX = container.querySelector('#input-answer-x');
    const inputY = container.querySelector('#input-answer-y');
    const fbBox = container.querySelector('#mission-feedback-box');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentMission = missions[activeMissionIndex];
        const ansX = Number(inputX.value);
        const ansY = Number(inputY.value);

        if (isNaN(ansX) || isNaN(ansY)) {
          showToast('Masukkan angka yang valid untuk x dan y!', 'warning');
          return;
        }

        const isCorrectX = Math.abs(ansX - currentMission.solutionX) < 0.01;
        const isCorrectY = Math.abs(ansY - currentMission.solutionY) < 0.01;

        if (isCorrectX && isCorrectY) {
          fbBox.className = 'form-feedback success';
          fbBox.innerHTML = `🎉 TEPAT SEKALI! Nilai x = ${currentMission.solutionX} dan y = ${currentMission.solutionY} adalah penyelesaian benar untuk ${currentMission.title}!`;
          fbBox.classList.remove('hidden');

          showToast('Misi berhasil diselesaikan! ⭐', 'success');

          // Catat ke progres
          missionProgress[currentMission.id] = true;
          if (user) {
            saveProgress(user.id, {
              missionProgress,
              completedStages: ['tantangan']
            });
          }

          setTimeout(() => {
            if (activeMissionIndex < missions.length - 1) {
              activeMissionIndex++;
              showHint = false;
              render();
            } else {
              render();
            }
          }, 1500);

        } else {
          fbBox.className = 'form-feedback error';
          fbBox.innerHTML = `❌ Jawabanmu (x = ${ansX}, y = ${ansY}) belum sesuai. Periksa kembali perhitunganmu atau baca petunjuk konsep!`;
          fbBox.classList.remove('hidden');
          showToast('Jawaban belum tepat, coba hitung kembali.', 'warning');
        }
      });
    }

    const btnLkpd = container.querySelector('#btn-to-lkpd');
    if (btnLkpd) {
      btnLkpd.addEventListener('click', () => {
        if (user) {
          saveProgress(user.id, { completedStages: ['tantangan'] });
        }
      });
    }
  }

  render();
}
