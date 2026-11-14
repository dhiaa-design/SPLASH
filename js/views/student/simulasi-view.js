/**
 * Simulasi View: Dua Timbangan Interaktif SPLASH
 * Timbangan 1: 2x + y = 11 | Timbangan 2: x + 2y = 13
 * Pointer Events Drag-and-Drop, Operasi Ruas, Visualisasi Kesetaraan.
 */

import { BalanceScale } from '../../utils/balance-engine.js';
import { renderBalanceScaleSVG, bindBalanceScaleEvents, showToast } from '../../utils/dom-helpers.js';
import { saveProgress, getProgress } from '../../services/storage.js';
import { appState } from '../../state.js';

export function renderSimulasiView(container) {
  const user = appState.getUser();

  // Inisialisasi Engine untuk Dua Timbangan
  // Nilai konsisten: x = 3, y = 5
  const scale1 = new BalanceScale({
    solutionX: 3,
    solutionY: 5,
    initialLeftX: 2,
    initialLeftY: 1,
    initialLeftNum: 0,
    initialRightNum: 11
  });

  const scale2 = new BalanceScale({
    solutionX: 3,
    solutionY: 5,
    initialLeftX: 1,
    initialLeftY: 2,
    initialLeftNum: 0,
    initialRightNum: 13
  });

  let updateScale1UI = null;
  let updateScale2UI = null;

  function render() {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.75rem; width: 100%;">
        
        <!-- Header & Instruksi Wajib -->
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="#/kontekstual" style="font-weight: 600; font-size: 0.9rem;">← Masalah Kontekstual</a>
            <span style="color: var(--color-text-light);">/</span>
            <span style="color: var(--color-primary); font-weight: 700; font-size: 0.9rem;">Simulasi Dua Timbangan</span>
          </div>
          <h1 style="font-size: 2rem;">Laboratorium Timbangan Dua Lengan Interaktif</h1>
        </div>

        <!-- Highlight Banner Pesan Wajib Instruksi -->
        <div class="card card-accent-blue" style="border-left: 6px solid var(--color-primary); padding: 1.25rem 1.5rem;">
          <div style="display: flex; align-items: flex-start; gap: 0.85rem;">
            <span style="font-size: 1.8rem;">⚖️</span>
            <div>
              <h3 style="font-size: 1.15rem; color: var(--color-primary-dark); margin-bottom: 0.35rem;">Prinsip Kesetaraan Aljabar</h3>
              <p style="font-size: 1rem; color: var(--color-text-main); font-weight: 600; margin-bottom: 0; line-height: 1.5;">
                "Lakukan operasi yang sama pada kedua ruas agar kesetaraan tetap terjaga. Amati bagaimana perubahan balok memengaruhi persamaan."
              </p>
            </div>
          </div>
        </div>

        <!-- Palet Balok Tersedia (Toolbox Drag and Drop) -->
        <div class="blocks-toolbox">
          <div>
            <div class="toolbox-title">📦 Kotak Balok Aljabar (Tarik ke Cawan Kiri/Kanan):</div>
            <div style="font-size: 0.8rem; color: var(--color-text-muted);">
              Tarik (drag) balok di bawah ini ke dalam cawan timbangan mana pun untuk melihat perubahan timbangan secara langsung.
            </div>
          </div>

          <div class="toolbox-blocks-row">
            <div class="toolbox-block-item">
              <div class="algebra-block block-x draggable-source" data-type="x" title="Balok Variabel x (Berat 3)">x</div>
              <span class="toolbox-block-label">Balok x</span>
            </div>

            <div class="toolbox-block-item">
              <div class="algebra-block block-y draggable-source" data-type="y" title="Balok Variabel y (Berat 5)">y</div>
              <span class="toolbox-block-label">Balok y</span>
            </div>

            <div class="toolbox-block-item">
              <div class="algebra-block block-num draggable-source" data-type="num" title="Balok Satuan +1">+1</div>
              <span class="toolbox-block-label">Angka 1</span>
            </div>
          </div>
        </div>

        <!-- Dua Timbangan SVG Berdampingan (Grid) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(440px, 1fr)); gap: 1.5rem;">
          
          <!-- Timbangan 1: 2x + y = 11 -->
          <div>
            ${renderBalanceScaleSVG('scale1', 'Timbangan 1 (Pesanan Andi)', '2x + y = 11', scale1)}
          </div>

          <!-- Timbangan 2: x + 2y = 13 -->
          <div>
            ${renderBalanceScaleSVG('scale2', 'Timbangan 2 (Pesanan Citra)', 'x + 2y = 13', scale2)}
          </div>

        </div>

        <!-- Kotak Analisis Pembelajaran & Tombol Eksplorasi -->
        <div class="card" style="background: white; border: 2px solid var(--color-primary-border); padding: 1.5rem;">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
            <div>
              <h3 style="font-size: 1.15rem; color: var(--color-primary-dark); margin-bottom: 0.35rem;">
                💡 Apa yang Kamu Temukan?
              </h3>
              <p style="font-size: 0.92rem; margin-bottom: 0;">
                Operasi pada satu timbangan tidak otomatis mengubah timbangan lain, namun <strong>nilai tersembunyi x dan y konsisten sama</strong> pada kedua timbangan. Sekarang mari kita uji berbagai kemungkinan nilai x dan y secara langsung!
              </p>
            </div>
            <a href="#/eksplorasi" class="btn btn-primary btn-lg" id="btn-to-exploration">
              Lanjut ke Eksplorasi Nilai x & y 🎛️ →
            </a>
          </div>
        </div>

      </div>
    `;

    setupLogic();
  }

  function setupLogic() {
    // Kaitkan events timbangan
    updateScale1UI = bindBalanceScaleEvents('scale1', scale1, () => checkProgress());
    updateScale2UI = bindBalanceScaleEvents('scale2', scale2, () => checkProgress());

    // Setup Pointer Events Drag-and-Drop yang kompatibel Mouse & Layar Sentuh
    setupPointerDragAndDrop();

    const btnNext = container.querySelector('#btn-to-exploration');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (user) {
          saveProgress(user.id, { completedStages: ['simulasi'] });
        }
      });
    }
  }

  function checkProgress() {
    if (user) {
      saveProgress(user.id, { completedStages: ['simulasi'] });
    }
  }

  // Pointer Events Drag & Drop Handler Modern
  function setupPointerDragAndDrop() {
    const draggables = container.querySelectorAll('.draggable-source');
    let draggedEl = null;
    let blockType = null;
    let ghostEl = null;

    draggables.forEach(item => {
      item.addEventListener('pointerdown', (e) => {
        draggedEl = item;
        blockType = item.getAttribute('data-type');
        item.setPointerCapture(e.pointerId);

        // Buat ghost element yang mengikuti kursor / jari
        ghostEl = item.cloneNode(true);
        ghostEl.classList.add('is-dragging');
        ghostEl.style.position = 'fixed';
        ghostEl.style.left = `${e.clientX - 22}px`;
        ghostEl.style.top = `${e.clientY - 22}px`;
        ghostEl.style.pointerEvents = 'none';
        ghostEl.style.zIndex = '9999';
        document.body.appendChild(ghostEl);
      });

      item.addEventListener('pointermove', (e) => {
        if (!ghostEl) return;
        ghostEl.style.left = `${e.clientX - 22}px`;
        ghostEl.style.top = `${e.clientY - 22}px`;

        // Highlight dropzone di bawah pointer
        highlightDropzoneUnder(e.clientX, e.clientY);
      });

      const onPointerEnd = (e) => {
        if (!ghostEl) return;
        
        // Cek elemen drop target di bawah titik akhir
        const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
        const dropzone = elemBelow?.closest('.tray-dropzone');

        if (dropzone) {
          const scaleId = dropzone.getAttribute('data-scale');
          const side = dropzone.getAttribute('data-side');

          if (scaleId === 'scale1') {
            scale1.addBlock(side, blockType, 1);
            if (updateScale1UI) updateScale1UI();
          } else if (scaleId === 'scale2') {
            scale2.addBlock(side, blockType, 1);
            if (updateScale2UI) updateScale2UI();
          }
          showToast(`Balok ${blockType} ditambahkan ke cawan ${side === 'left' ? 'kiri' : 'kanan'}!`, 'info');
        }

        clearHighlights();
        if (ghostEl) ghostEl.remove();
        ghostEl = null;
        draggedEl = null;
        blockType = null;
      };

      item.addEventListener('pointerup', onPointerEnd);
      item.addEventListener('pointercancel', onPointerEnd);
    });

    function highlightDropzoneUnder(x, y) {
      clearHighlights();
      const elem = document.elementFromPoint(x, y);
      const dropzone = elem?.closest('.tray-dropzone');
      if (dropzone) {
        dropzone.classList.add('drag-hover');
      }
    }

    function clearHighlights() {
      container.querySelectorAll('.tray-dropzone').forEach(dz => dz.classList.remove('drag-hover'));
    }
  }

  render();
}
