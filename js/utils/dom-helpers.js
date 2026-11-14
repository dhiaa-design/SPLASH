/**
 * Kumpulan Helper DOM & UI Interaktif SPLASH
 */

/**
 * Menampilkan notifikasi Toast instan
 */
export function showToast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  let borderColor = 'var(--color-primary)';
  if (type === 'success') {
    icon = '✅';
    borderColor = 'var(--color-success)';
  } else if (type === 'danger' || type === 'error') {
    icon = '⚠️';
    borderColor = 'var(--color-danger)';
  } else if (type === 'warning') {
    icon = '💡';
    borderColor = 'var(--color-accent-yellow)';
  }

  toast.style.borderLeftColor = borderColor;
  toast.innerHTML = `
    <span style="font-size: 1.2rem;">${icon}</span>
    <span style="font-weight: 600; font-size: 0.95rem; color: var(--color-text-main);">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 300ms ease, transform 300ms ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Membuka Modal Dialog Bantuan Singkat per Halaman
 */
export function openHelpModal(title, htmlContent) {
  // Tutup modal lama jika ada
  closeModal();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'app-active-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modal-help-title');

  overlay.innerHTML = `
    <div class="modal-dialog">
      <div class="card-header" style="margin-bottom: 1rem;">
        <h3 id="modal-help-title" class="card-title">
          <span>💡</span> Petunjuk: ${title}
        </h3>
        <button class="btn btn-sm btn-outline" id="btn-modal-close" aria-label="Tutup Dialog">✕</button>
      </div>
      <div class="modal-body" style="font-size: 0.95rem; line-height: 1.6; color: var(--color-text-main);">
        ${htmlContent}
      </div>
      <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
        <button class="btn btn-primary" id="btn-modal-ok">Saya Mengerti</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeHandler = () => closeModal();
  overlay.querySelector('#btn-modal-close').addEventListener('click', closeHandler);
  overlay.querySelector('#btn-modal-ok').addEventListener('click', closeHandler);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeHandler();
  });

  // Esc key listener
  const keyHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      window.removeEventListener('keydown', keyHandler);
    }
  };
  window.addEventListener('keydown', keyHandler);
}

export function closeModal() {
  const existing = document.getElementById('app-active-modal');
  if (existing) existing.remove();
}

/**
 * Render Komponen Timbangan SVG Interaktif dengan Pointer Events Drag & Drop
 */
export function renderBalanceScaleSVG(scaleId, title, eqLabel, scaleEngine, onScaleChange) {
  const weights = scaleEngine.getWeights();
  const rotation = weights.rotationDeg; // Rotasi lengan timbangan
  const isBalanced = weights.isBalanced;

  // Bangun elemen balok untuk cawan kiri
  const renderBlocks = (countX, countY, countNum) => {
    let html = '';
    for (let i = 0; i < countX; i++) {
      html += `<div class="algebra-block block-x" title="Balok Variabel x" aria-label="Balok x">x</div>`;
    }
    for (let i = 0; i < countY; i++) {
      html += `<div class="algebra-block block-y" title="Balok Variabel y" aria-label="Balok y">y</div>`;
    }
    if (countNum > 0) {
      html += `<div class="algebra-block block-num" title="Nilai Angka ${countNum}" aria-label="Nilai ${countNum}">+${countNum}</div>`;
    }
    return html;
  };

  const leftBlocksHtml = renderBlocks(scaleEngine.state.leftX, scaleEngine.state.leftY, scaleEngine.state.leftNum);
  const rightBlocksHtml = renderBlocks(scaleEngine.state.rightX, scaleEngine.state.rightY, scaleEngine.state.rightNum);

  return `
    <div class="balance-card" id="${scaleId}-card">
      <div class="balance-header">
        <div class="balance-title">
          <span>⚖️</span> ${title}
        </div>
        <div class="balance-eq-tag" id="${scaleId}-eq-tag">${eqLabel || scaleEngine.getEquationString()}</div>
      </div>

      <div class="balance-status-banner ${isBalanced ? 'balanced' : 'unbalanced'}" id="${scaleId}-status">
        <span>${isBalanced ? '✅ Timbangan Seimbang (Kedua Ruas Bernilai Sama)' : '⚠️ Timbangan Miring (Kedua Ruas Belum Seimbang)'}</span>
      </div>

      <div class="balance-viewport" id="${scaleId}-viewport">
        <!-- SVG Timbangan (Tiang, Titik Tumpu, Lengan Rotasi) -->
        <svg class="balance-svg-canvas" viewBox="0 0 600 280">
          <defs>
            <linearGradient id="${scaleId}-beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#FFD54F"/>
              <stop offset="50%" stop-color="#FFB300"/>
              <stop offset="100%" stop-color="#FFA000"/>
            </linearGradient>
            <linearGradient id="${scaleId}-standGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#78909C"/>
              <stop offset="100%" stop-color="#37474F"/>
            </linearGradient>
          </defs>

          <!-- Alas & Tiang Penopang Statis -->
          <ellipse cx="300" cy="260" rx="90" ry="14" fill="#CFD8DC"/>
          <ellipse cx="300" cy="256" rx="85" ry="10" fill="#90A4AE"/>
          <path d="M 292 80 L 308 80 L 314 256 L 286 256 Z" fill="url(#${scaleId}-standGrad)"/>
          <polygon points="300,68 288,88 312,88" fill="#F57C00"/>

          <!-- Grup Lengan yang Berotasi Mengikuti Beban -->
          <g class="balance-beam-group" id="${scaleId}-beam" style="transform: rotate(${rotation}deg);">
            <!-- Balok Lengan Utama -->
            <rect x="70" y="74" width="460" height="12" rx="6" fill="url(#${scaleId}-beamGrad)" stroke="#FFA000" stroke-width="1.5"/>
            <!-- Engsel Tengah -->
            <circle cx="300" cy="80" r="9" fill="#FFFFFF" stroke="#F57C00" stroke-width="3"/>

            <!-- Pengait Kiri -->
            <circle cx="120" cy="80" r="5" fill="#37474F"/>
            <line x1="120" y1="80" x2="80" y2="180" stroke="#78909C" stroke-width="2.5"/>
            <line x1="120" y1="80" x2="160" y2="180" stroke="#78909C" stroke-width="2.5"/>
            <ellipse cx="120" cy="180" rx="55" ry="10" fill="#B0BEC5"/>

            <!-- Pengait Kanan -->
            <circle cx="480" cy="80" r="5" fill="#37474F"/>
            <line x1="480" y1="80" x2="440" y2="180" stroke="#78909C" stroke-width="2.5"/>
            <line x1="480" y1="80" x2="520" y2="180" stroke="#78909C" stroke-width="2.5"/>
            <ellipse cx="480" cy="180" rx="55" ry="10" fill="#B0BEC5"/>
          </g>
        </svg>

        <!-- Wadah Interaktif Balok (Dropzones Ruas Kiri dan Kanan) -->
        <div class="tray-dropzone left" id="${scaleId}-tray-left" data-scale="${scaleId}" data-side="left" title="Cawan Ruas Kiri">
          ${leftBlocksHtml}
        </div>
        <div class="tray-dropzone right" id="${scaleId}-tray-right" data-scale="${scaleId}" data-side="right" title="Cawan Ruas Kanan">
          ${rightBlocksHtml}
        </div>
      </div>

      <!-- Warning Alert jika satu ruas diubah -->
      <div id="${scaleId}-warning" class="balance-warning-alert ${scaleEngine.warningMessage ? '' : 'hidden'}">
        <span>⚠️</span>
        <span id="${scaleId}-warning-text">${scaleEngine.warningMessage}</span>
      </div>

      <!-- Panel Kontrol Operasi Ruas Aljabar -->
      <div class="balance-operations-panel">
        <div class="operations-title">
          <span>⚙️</span> Operasi Kedua Ruas:
        </div>
        <div class="operations-buttons-group">
          <button class="btn btn-sm btn-secondary" id="${scaleId}-op-add-num" title="Tambah 1 pada kedua ruas">+1</button>
          <button class="btn btn-sm btn-secondary" id="${scaleId}-op-sub-num" title="Kurang 1 pada kedua ruas">-1</button>
          <button class="btn btn-sm btn-outline" id="${scaleId}-op-mul-2" title="Kali 2 pada kedua ruas">×2</button>
          <button class="btn btn-sm btn-outline" id="${scaleId}-op-div-2" title="Bagi 2 pada kedua ruas">:2</button>
          <button class="btn btn-sm btn-secondary" id="${scaleId}-op-sub-y" title="Kurang 1 balok y pada kedua ruas">- y</button>
          <button class="btn btn-sm btn-secondary" id="${scaleId}-op-undo" title="Batal operasi terakhir">↩️ Undo</button>
          <button class="btn btn-sm btn-outline btn-danger" id="${scaleId}-op-reset" title="Kembalikan timbangan ke kondisi awal">🔄 Reset</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Mengaitkan event listener tombol operasi dan pointer drag & drop ke elemen timbangan
 */
export function bindBalanceScaleEvents(scaleId, scaleEngine, onScaleChange) {
  const updateUI = () => {
    const weights = scaleEngine.getWeights();
    const beam = document.getElementById(`${scaleId}-beam`);
    const status = document.getElementById(`${scaleId}-status`);
    const eqTag = document.getElementById(`${scaleId}-eq-tag`);
    const warning = document.getElementById(`${scaleId}-warning`);
    const warningText = document.getElementById(`${scaleId}-warning-text`);

    if (beam) beam.style.transform = `rotate(${weights.rotationDeg}deg)`;
    if (status) {
      if (weights.isBalanced) {
        status.className = 'balance-status-banner balanced';
        status.innerHTML = '<span>✅ Timbangan Seimbang (Kedua Ruas Bernilai Sama)</span>';
      } else {
        status.className = 'balance-status-banner unbalanced';
        status.innerHTML = '<span>⚠️ Timbangan Miring (Kedua Ruas Belum Seimbang)</span>';
      }
    }

    if (eqTag) eqTag.textContent = scaleEngine.getEquationString();

    if (warning && warningText) {
      if (scaleEngine.warningMessage) {
        warningText.textContent = scaleEngine.warningMessage;
        warning.classList.remove('hidden');
      } else {
        warning.classList.add('hidden');
      }
    }

    // Perbarui isi cawan kiri & kanan
    const renderBlocks = (countX, countY, countNum) => {
      let html = '';
      for (let i = 0; i < countX; i++) {
        html += `<div class="algebra-block block-x" title="Balok Variabel x">x</div>`;
      }
      for (let i = 0; i < countY; i++) {
        html += `<div class="algebra-block block-y" title="Balok Variabel y">y</div>`;
      }
      if (countNum > 0) {
        html += `<div class="algebra-block block-num" title="Nilai Satuan">+${countNum}</div>`;
      }
      return html;
    };

    const trayLeft = document.getElementById(`${scaleId}-tray-left`);
    const trayRight = document.getElementById(`${scaleId}-tray-right`);
    if (trayLeft) trayLeft.innerHTML = renderBlocks(scaleEngine.state.leftX, scaleEngine.state.leftY, scaleEngine.state.leftNum);
    if (trayRight) trayRight.innerHTML = renderBlocks(scaleEngine.state.rightX, scaleEngine.state.rightY, scaleEngine.state.rightNum);

    if (onScaleChange) onScaleChange(scaleEngine);
  };

  // Tombol operasi
  const bindBtn = (idSuffix, action) => {
    const el = document.getElementById(`${scaleId}-${idSuffix}`);
    if (el) el.addEventListener('click', () => { action(); updateUI(); });
  };

  bindBtn('op-add-num', () => scaleEngine.applyBothSidesOperation('add', 1, 'num'));
  bindBtn('op-sub-num', () => scaleEngine.applyBothSidesOperation('subtract', 1, 'num'));
  bindBtn('op-mul-2', () => scaleEngine.applyBothSidesOperation('multiply', 2));
  bindBtn('op-div-2', () => scaleEngine.applyBothSidesOperation('divide', 2));
  bindBtn('op-sub-y', () => scaleEngine.applyBothSidesOperation('subtract', 1, 'y'));
  bindBtn('op-undo', () => scaleEngine.undo());
  bindBtn('op-reset', () => scaleEngine.reset());

  return updateUI;
}
