/**
 * Teacher Dashboard View: Ringkasan Analitik Kelas & Akses Cepat Guru
 */

import { getTeacherAnalytics, getStudentsByClass, getLKPDByClass } from '../../services/storage.js';
import { appState } from '../../state.js';
import { showToast } from '../../utils/dom-helpers.js';

export function renderTeacherDashboardView(container) {
  const user = appState.getUser();
  const classCode = user?.classCode || 'SPLDV8';
  const analytics = getTeacherAnalytics(classCode);
  const students = getStudentsByClass(classCode);
  const lkpds = getLKPDByClass(classCode);

  function render() {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header Dashboard Guru -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--color-accent-yellow-light); color: #854D0E; padding: 0.3rem 0.75rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 700; margin-bottom: 0.5rem;">
              👨‍🏫 Dashboard Fasilitator Guru
            </div>
            <h1 style="font-size: 2rem;">Ruang Guru: ${user?.className || 'Kelas VIII-A'}</h1>
            <p style="font-size: 0.95rem; margin-top: 0.25rem;">
              Pantau progres belajar aljabar siswa, tinjau LKPD, dan kelola aktivitas pembelajaran kelas.
            </p>
          </div>

          <!-- Aksi Cepat: Mode Pratinjau Siswa & Kode Kelas -->
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <a href="#/beranda" class="btn btn-warning" id="btn-preview-student" title="Jelajahi materi dari sudut pandang siswa">
              👀 Pratinjau sebagai Siswa
            </a>
            <div style="background: white; border: 1.5px solid var(--color-primary-border); border-radius: var(--radius-md); padding: 0.4rem 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-text-muted);">KODE KELAS:</span>
              <strong style="color: var(--color-primary); font-size: 1.1rem; letter-spacing: 1px;">${classCode}</strong>
              <button class="btn btn-sm btn-outline" id="btn-copy-code" title="Salin Kode Kelas">📋</button>
            </div>
          </div>
        </div>

        <!-- 4 Kartu Metrik Utama -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
          
          <div class="card card-hover" style="border-left: 5px solid var(--color-primary);">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 0.25rem;">TOTAL SISWA TERDAFTAR</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--color-primary);">${analytics.totalStudents} Siswa</div>
            <div style="font-size: 0.8rem; color: var(--color-text-light); margin-top: 0.25rem;">Kelas ${user?.className || 'VIII-A'}</div>
          </div>

          <div class="card card-hover" style="border-left: 5px solid var(--color-success);">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 0.25rem;">RATA-RATA PROGRES</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--color-success);">${analytics.avgProgress}%</div>
            <div style="font-size: 0.8rem; color: var(--color-text-light); margin-top: 0.25rem;">Penyelesaian 8 tahapan belajar</div>
          </div>

          <div class="card card-hover" style="border-left: 5px solid var(--color-accent-yellow);">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 0.25rem;">LKPD DIGITAL MASUK</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: #B45309;">${analytics.submittedLKPD} LKPD</div>
            <div style="font-size: 0.8rem; color: var(--color-text-light); margin-top: 0.25rem;">${analytics.reviewedLKPD} sudah diberi nilai</div>
          </div>

          <div class="card card-hover" style="border-left: 5px solid var(--color-danger);">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 0.25rem;">MISI PALING MENANTANG</div>
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--color-danger); line-height: 1.2; margin-top: 0.25rem;">Misi 5 (Pentas Seni)</div>
            <div style="font-size: 0.8rem; color: var(--color-text-light); margin-top: 0.25rem;">Tingkat kesulitan tinggi</div>
          </div>

        </div>

        <!-- Menu Pintas Navigasi Guru -->
        <div>
          <h2 style="font-size: 1.3rem; margin-bottom: 1rem;">Menu Manajemen Pembelajaran</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
            
            <a href="#/guru/kelas" class="card card-hover" style="border-top: 4px solid var(--color-primary);">
              <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">👥</div>
              <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Manajemen Kelas & Siswa</h3>
              <p style="font-size: 0.88rem; color: var(--color-text-muted);">Kelola akun siswa, salin kode kelas, reset kata sandi siswa, atau hapus data siswa.</p>
              <span style="font-weight: 700; color: var(--color-primary); font-size: 0.85rem;">Buka Daftar Siswa →</span>
            </a>

            <a href="#/guru/progres" class="card card-hover" style="border-top: 4px solid var(--color-success);">
              <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📊</div>
              <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Pantau Progres Belajar</h3>
              <p style="font-size: 0.88rem; color: var(--color-text-muted);">Tinjau grafik visual dan status penyelesaian tahapan materi setiap peserta didik.</p>
              <span style="font-weight: 700; color: var(--color-success); font-size: 0.85rem;">Lihat Grafik Progres →</span>
            </a>

            <a href="#/guru/lkpd" class="card card-hover" style="border-top: 4px solid #B45309;">
              <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📝</div>
              <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Review & Nilai LKPD</h3>
              <p style="font-size: 0.88rem; color: var(--color-text-muted);">Periksa jawaban refleksi siswa, berikan nilai skor (0-100), komentar, dan ekspor ke CSV.</p>
              <span style="font-weight: 700; color: #B45309; font-size: 0.85rem;">Tinjau Lembar LKPD →</span>
            </a>

            <a href="#/guru/misi" class="card card-hover" style="border-top: 4px solid #7C3AED;">
              <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🗂️</div>
              <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Bank Soal Misi (CRUD)</h3>
              <p style="font-size: 0.88rem; color: var(--color-text-muted);">Tambah soal baru, ubah cerita kontekstual, atau atur tingkat kesulitan misi pembelajaran.</p>
              <span style="font-weight: 700; color: #7C3AED; font-size: 0.85rem;">Kelola Bank Soal →</span>
            </a>

            <a href="#/guru/panduan" class="card card-hover" style="border-top: 4px solid #0D8ABC;">
              <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📖</div>
              <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Panduan Fasilitator & Pemantik</h3>
              <p style="font-size: 0.88rem; color: var(--color-text-muted);">Strategi pedagogis, tujuan pembelajaran, dan daftar pertanyaan pemantik diskusi per tahap.</p>
              <span style="font-weight: 700; color: #0D8ABC; font-size: 0.85rem;">Baca Panduan →</span>
            </a>

          </div>
        </div>

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const btnCopy = container.querySelector('#btn-copy-code');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(classCode);
        showToast(`Kode kelas ${classCode} disalin ke papan klip!`, 'success');
      });
    }

    const btnPreview = container.querySelector('#btn-preview-student');
    if (btnPreview) {
      btnPreview.addEventListener('click', () => {
        appState.setPreviewMode(true);
        showToast('Mode Pratinjau Siswa diaktifkan.', 'info');
      });
    }
  }

  render();
}
