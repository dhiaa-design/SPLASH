/**
 * Missions Admin View: Manajemen Bank Soal Misi SPLDV (CRUD Guru)
 * Tambah, edit, dan hapus soal misi bertingkat dengan cerita kontekstual dan petunjuk konsep.
 */

import { getMissions, saveMission, deleteMission } from '../../services/storage.js';
import { showToast } from '../../utils/dom-helpers.js';

export function renderTeacherMissionsView(container) {
  let editingMission = null;

  function render() {
    const missions = getMissions();

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <a href="#/guru/dashboard" style="font-weight: 600; font-size: 0.9rem;">← Dashboard Guru</a>
              <span style="color: var(--color-text-light);">/</span>
              <span style="color: var(--color-primary); font-weight: 700; font-size: 0.9rem;">Bank Soal Misi</span>
            </div>
            <h1 style="font-size: 2rem;">Bank Soal & Misi SPLDV</h1>
            <p style="font-size: 0.95rem; margin-top: 0.25rem;">
              Kelola daftar misi bertingkat yang dapat dipecahkan oleh peserta didik pada menu Tantangan.
            </p>
          </div>

          <button class="btn btn-primary" id="btn-add-mission">
            ➕ Tambah Misi Baru
          </button>
        </div>

        <!-- Daftar Kartu Misi yang Ada -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${missions.map((m, idx) => `
            <div class="card card-hover" style="border-left: 5px solid ${m.difficulty === 'mudah' ? 'var(--color-success)' : (m.difficulty === 'sedang' ? 'var(--color-accent-yellow)' : 'var(--color-danger)')}; padding: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <div style="flex: 1; min-width: 280px;">
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                    <span class="badge ${m.difficulty === 'mudah' ? 'badge-success' : (m.difficulty === 'sedang' ? 'badge-warning' : 'badge-danger')}">
                      ${m.difficulty.toUpperCase()}
                    </span>
                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-light);">Misi #${idx + 1}</span>
                  </div>
                  <h3 style="font-size: 1.25rem; color: var(--color-primary-dark); margin-bottom: 0.5rem;">${m.title}</h3>
                  <p style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--color-text-main);">${m.story}</p>
                  
                  <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem;">
                    <div style="background: var(--color-primary-lighter); padding: 0.3rem 0.75rem; border-radius: var(--radius-sm);">
                      Persamaan: <code>${m.eq1}</code> & <code>${m.eq2}</code>
                    </div>
                    <div style="background: #E8F5E9; padding: 0.3rem 0.75rem; border-radius: var(--radius-sm); color: #166534; font-weight: 700;">
                      Kunci: x = ${m.solutionX}, y = ${m.solutionY}
                    </div>
                  </div>
                </div>

                <!-- Tombol Aksi -->
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn btn-sm btn-outline btn-edit-mission" data-id="${m.id}">
                    ✏️ Ubah
                  </button>
                  <button class="btn btn-sm btn-outline btn-danger btn-delete-mission" data-id="${m.id}" data-title="${m.title}">
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Modal Tambah / Edit Misi -->
        <div id="mission-modal" class="modal-overlay hidden">
          <div class="modal-dialog" style="max-width: 640px;">
            <div class="card-header">
              <h3 class="card-title" id="mission-modal-title"><span>➕</span> Tambah Misi SPLDV Baru</h3>
              <button class="btn btn-sm btn-outline" id="btn-close-mission-modal">✕</button>
            </div>
            
            <form id="mission-admin-form" style="display: flex; flex-direction: column; gap: 1rem;">
              <input type="hidden" id="form-mission-id">

              <div class="form-group">
                <label class="form-label" for="form-mission-title">Judul Misi:</label>
                <input type="text" id="form-mission-title" class="form-control" placeholder="Contoh: Misi Tiket Bioskop" required>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label" for="form-mission-difficulty">Tingkat Kesulitan:</label>
                  <select id="form-mission-difficulty" class="form-control" required>
                    <option value="mudah">Mudah</option>
                    <option value="sedang">Sedang</option>
                    <option value="sulit">Sulit</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="form-mission-story">Cerita Soal Kontekstual:</label>
                <textarea id="form-mission-story" class="form-control" rows="3" placeholder="Tuliskan skenario kehidupan nyata yang melibatkan dua besaran..." required></textarea>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label" for="form-mission-eq1">Persamaan (1):</label>
                  <input type="text" id="form-mission-eq1" class="form-control" placeholder="Contoh: 2x + y = 10" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="form-mission-eq2">Persamaan (2):</label>
                  <input type="text" id="form-mission-eq2" class="form-control" placeholder="Contoh: x + 3y = 15" required>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label" for="form-mission-solx">Kunci Solusi x:</label>
                  <input type="number" id="form-mission-solx" class="form-control" placeholder="Contoh: 3" step="any" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="form-mission-soly">Kunci Solusi y:</label>
                  <input type="number" id="form-mission-soly" class="form-control" placeholder="Contoh: 4" step="any" required>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="form-mission-hint">Petunjuk Konsep Siswa:</label>
                <input type="text" id="form-mission-hint" class="form-control" placeholder="Petunjuk tanpa membocorkan jawaban langsung...">
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;">
                <button type="button" class="btn btn-secondary" id="btn-cancel-mission">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan Misi</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const modal = container.querySelector('#mission-modal');
    const form = container.querySelector('#mission-admin-form');
    const modalTitle = container.querySelector('#mission-modal-title');

    const openModal = (mission = null) => {
      editingMission = mission;
      if (mission) {
        modalTitle.textContent = '✏️ Ubah Misi SPLDV';
        container.querySelector('#form-mission-id').value = mission.id;
        container.querySelector('#form-mission-title').value = mission.title;
        container.querySelector('#form-mission-difficulty').value = mission.difficulty;
        container.querySelector('#form-mission-story').value = mission.story;
        container.querySelector('#form-mission-eq1').value = mission.eq1;
        container.querySelector('#form-mission-eq2').value = mission.eq2;
        container.querySelector('#form-mission-solx').value = mission.solutionX;
        container.querySelector('#form-mission-soly').value = mission.solutionY;
        container.querySelector('#form-mission-hint').value = mission.hint || '';
      } else {
        modalTitle.textContent = '➕ Tambah Misi SPLDV Baru';
        form.reset();
        container.querySelector('#form-mission-id').value = '';
      }
      modal.classList.remove('hidden');
    };

    const closeModal = () => modal.classList.add('hidden');

    container.querySelector('#btn-add-mission')?.addEventListener('click', () => openModal(null));
    container.querySelector('#btn-close-mission-modal')?.addEventListener('click', closeModal);
    container.querySelector('#btn-cancel-mission')?.addEventListener('click', closeModal);

    // Edit Soal
    container.querySelectorAll('.btn-edit-mission').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const missions = getMissions();
        const target = missions.find(m => m.id === id);
        if (target) openModal(target);
      });
    });

    // Hapus Soal
    container.querySelectorAll('.btn-delete-mission').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        if (confirm(`Hapus soal "${title}" dari bank misi?`)) {
          deleteMission(id);
          showToast(`Misi "${title}" berhasil dihapus.`, 'success');
          render();
        }
      });
    });

    // Submit Form Tambah / Edit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = container.querySelector('#form-mission-id').value;
        const missionData = {
          title: container.querySelector('#form-mission-title').value.trim(),
          difficulty: container.querySelector('#form-mission-difficulty').value,
          story: container.querySelector('#form-mission-story').value.trim(),
          eq1: container.querySelector('#form-mission-eq1').value.trim(),
          eq2: container.querySelector('#form-mission-eq2').value.trim(),
          solutionX: Number(container.querySelector('#form-mission-solx').value),
          solutionY: Number(container.querySelector('#form-mission-soly').value),
          hint: container.querySelector('#form-mission-hint').value.trim()
        };

        if (id) missionData.id = id;

        saveMission(missionData);
        showToast('Misi berhasil disimpan ke Bank Soal!', 'success');
        closeModal();
        render();
      });
    }
  }

  render();
}
