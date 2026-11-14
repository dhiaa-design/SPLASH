/**
 * Class View: Manajemen Kelas dan Akun Siswa (Guru)
 * Menampilkan kode kelas (tombol salin), daftar siswa, reset password siswa, hapus siswa.
 */

import { getStudentsByClass, resetStudentPassword, deleteStudent } from '../../services/storage.js';
import { appState } from '../../state.js';
import { showToast, openHelpModal } from '../../utils/dom-helpers.js';

export function renderClassView(container) {
  const user = appState.getUser();
  const classCode = user?.classCode || 'SPLDV8';

  function render() {
    const students = getStudentsByClass(classCode);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <a href="#/guru/dashboard" style="font-weight: 600; font-size: 0.9rem;">← Dashboard Guru</a>
              <span style="color: var(--color-text-light);">/</span>
              <span style="color: var(--color-primary); font-weight: 700; font-size: 0.9rem;">Manajemen Kelas & Siswa</span>
            </div>
            <h1 style="font-size: 2rem;">Daftar Siswa Kelas: ${user?.className || 'VIII-A'}</h1>
            <p style="font-size: 0.95rem; margin-top: 0.25rem;">
              Kelola akun peserta didik yang terdaftar pada kelas bimbinganmu.
            </p>
          </div>

          <!-- Banner Kode Kelas -->
          <div style="background: white; border: 2px solid var(--color-primary); border-radius: var(--radius-lg); padding: 0.75rem 1.25rem; display: flex; align-items: center; gap: 1rem; box-shadow: var(--shadow-sm);">
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted);">KODE KELAS PENDAFTARAN:</div>
              <div style="font-size: 1.5rem; font-weight: 800; color: var(--color-primary); letter-spacing: 2px;">
                ${classCode}
              </div>
            </div>
            <button class="btn btn-primary" id="btn-copy-class-code">
              📋 Salin Kode
            </button>
          </div>
        </div>

        <!-- Tabel Daftar Siswa -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">
              <span>👥</span> Siswa Terdaftar (${students.length} Siswa)
            </h2>
            <div style="font-size: 0.85rem; color: var(--color-text-muted);">
              Bagikan kode kelas <code>${classCode}</code> kepada siswa saat mendaftar.
            </div>
          </div>

          <div class="table-responsive">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Lengkap</th>
                  <th>Nama Pengguna (Username)</th>
                  <th>Tanggal Bergabung</th>
                  <th style="text-align: right;">Aksi Akun</th>
                </tr>
              </thead>
              <tbody>
                ${students.length === 0 ? `
                  <tr>
                    <td colspan="5" style="text-align: center; color: var(--color-text-light); padding: 2rem;">
                      Belum ada siswa yang mendaftar dengan kode kelas ini.
                    </td>
                  </tr>
                ` : students.map((s, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${s.name}</strong></td>
                    <td><code>${s.username}</code></td>
                    <td>${new Date(s.createdAt).toLocaleDateString('id-ID')}</td>
                    <td style="text-align: right;">
                      <div style="display: inline-flex; gap: 0.5rem;">
                        <button class="btn btn-sm btn-outline btn-reset-pass" data-id="${s.id}" data-name="${s.name}" title="Reset kata sandi siswa ini">
                          🔑 Reset Kata Sandi
                        </button>
                        <button class="btn btn-sm btn-outline btn-danger btn-delete-student" data-id="${s.id}" data-name="${s.name}" title="Hapus siswa">
                          🗑️ Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modal Reset Password -->
        <div id="reset-password-modal" class="modal-overlay hidden">
          <div class="modal-dialog">
            <div class="card-header">
              <h3 class="card-title"><span>🔑</span> Reset Kata Sandi Siswa</h3>
              <button class="btn btn-sm btn-outline" id="btn-close-reset-modal">✕</button>
            </div>
            <form id="reset-pass-form">
              <p style="font-size: 0.95rem; margin-bottom: 1rem;">
                Mengubah kata sandi untuk siswa: <strong id="reset-student-name"></strong>
              </p>
              <input type="hidden" id="reset-student-id">
              <div class="form-group">
                <label class="form-label" for="input-new-pass">Kata Sandi Baru:</label>
                <input type="password" id="input-new-pass" class="form-control" placeholder="Minimal 6 karakter" required minlength="6">
              </div>
              <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
                <button type="button" class="btn btn-secondary" id="btn-cancel-reset">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan Kata Sandi Baru</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const btnCopy = container.querySelector('#btn-copy-class-code');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(classCode);
        showToast(`Kode kelas ${classCode} berhasil disalin!`, 'success');
      });
    }

    const resetModal = container.querySelector('#reset-password-modal');
    const resetForm = container.querySelector('#reset-pass-form');
    const inputStudentId = container.querySelector('#reset-student-id');
    const labelStudentName = container.querySelector('#reset-student-name');
    const inputNewPass = container.querySelector('#input-new-pass');

    // Buka Reset Modal
    container.querySelectorAll('.btn-reset-pass').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        inputStudentId.value = id;
        labelStudentName.textContent = name;
        inputNewPass.value = '';
        resetModal.classList.remove('hidden');
      });
    });

    const closeResetModal = () => resetModal.classList.add('hidden');
    container.querySelector('#btn-close-reset-modal')?.addEventListener('click', closeResetModal);
    container.querySelector('#btn-cancel-reset')?.addEventListener('click', closeResetModal);

    // Submit Reset Password
    if (resetForm) {
      resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = inputStudentId.value;
        const newPass = inputNewPass.value;

        if (newPass.length < 6) {
          showToast('Kata sandi minimal 6 karakter!', 'warning');
          return;
        }

        const res = await resetStudentPassword(id, newPass);
        if (res.success) {
          showToast(res.message, 'success');
          closeResetModal();
        } else {
          showToast(res.message, 'error');
        }
      });
    }

    // Hapus Siswa
    container.querySelectorAll('.btn-delete-student').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');

        if (confirm(`Apakah Anda yakin ingin menghapus siswa "${name}" beserta seluruh data progres dan LKPD-nya? Tindakan ini tidak dapat dibatalkan.`)) {
          const res = deleteStudent(id);
          if (res.success) {
            showToast(res.message, 'success');
            render();
          }
        }
      });
    });
  }

  render();
}
