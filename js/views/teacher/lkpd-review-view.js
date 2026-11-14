/**
 * LKPD Review View: Penilaian, Ulasan, dan Ekspor Rekapitulasi LKPD Guru
 */

import { getLKPDByClass, gradeLKPD } from '../../services/storage.js';
import { appState } from '../../state.js';
import { showToast } from '../../utils/dom-helpers.js';

export function renderTeacherLKPDView(container) {
  const user = appState.getUser();
  const classCode = user?.classCode || 'SPLDV8';

  let selectedLKPD = null;

  function render() {
    const list = getLKPDByClass(classCode);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <a href="#/guru/dashboard" style="font-weight: 600; font-size: 0.9rem;">← Dashboard Guru</a>
              <span style="color: var(--color-text-light);">/</span>
              <span style="color: var(--color-primary); font-weight: 700; font-size: 0.9rem;">Review LKPD Siswa</span>
            </div>
            <h1 style="font-size: 2rem;">Pemeriksaan & Penilaian LKPD Digital</h1>
            <p style="font-size: 0.95rem; margin-top: 0.25rem;">
              Tinjau lembar kerja, berikan umpan balik pedagogis, dan ekspor rekap nilai kelas.
            </p>
          </div>

          <!-- Tombol Ekspor CSV -->
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-primary" id="btn-export-csv" title="Unduh rekap nilai seluruh siswa format CSV">
              📊 Ekspor Rekap Nilai CSV
            </button>
          </div>
        </div>

        <!-- Tabel Daftar Pengumpulan LKPD -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">
              <span>📝</span> Berkas LKPD Siswa (${list.length} Berkas Masuk)
            </h2>
          </div>

          <div class="table-responsive">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Peserta Didik</th>
                  <th>Waktu Pengiriman</th>
                  <th>Status Penilaian</th>
                  <th>Nilai (Skor)</th>
                  <th style="text-align: right;">Aksi Pemeriksaan</th>
                </tr>
              </thead>
              <tbody>
                ${list.length === 0 ? `
                  <tr>
                    <td colspan="6" style="text-align: center; color: var(--color-text-light); padding: 2rem;">
                      Belum ada LKPD yang dikirimkan oleh siswa.
                    </td>
                  </tr>
                ` : list.map((item, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${item.studentName}</strong></td>
                    <td>${item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td>
                      <span class="badge ${item.status === 'reviewed' ? 'badge-success' : 'badge-warning'}">
                        ${item.status === 'reviewed' ? '✅ Sudah Dinilai' : '⏳ Menunggu Diperiksa'}
                      </span>
                    </td>
                    <td>
                      ${item.score !== null && item.score !== undefined 
                        ? `<strong style="font-size: 1.1rem; color: var(--color-success);">${item.score}</strong> / 100` 
                        : '<span style="color: var(--color-text-light);">-</span>'}
                    </td>
                    <td style="text-align: right;">
                      <button class="btn btn-sm btn-primary btn-review-detail" data-id="${item.id}">
                        🔍 Periksa & Nilai
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Panel / Modal Detail Pemeriksaan LKPD Siswa -->
        ${selectedLKPD ? `
          <div class="card" style="border: 2px solid var(--color-primary); background: #FFFFFF; padding: 2rem; animation: fadeIn 250ms ease;">
            <div class="card-header" style="border-bottom: 2px solid var(--color-primary-border); padding-bottom: 1rem;">
              <div>
                <span class="badge badge-info" style="margin-bottom: 0.35rem;">Lembar Kerja Siswa</span>
                <h2 style="font-size: 1.5rem; color: var(--color-primary-dark); margin: 0;">
                  Detail LKPD: ${selectedLKPD.studentName}
                </h2>
              </div>
              <button class="btn btn-sm btn-outline" id="btn-close-detail">✕ Tutup Tinjauan</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem;">
              
              <!-- 1. Data Eksplorasi Pasangan -->
              <div>
                <h4 style="color: var(--color-primary-dark); margin-bottom: 0.5rem;">A. Data Pengamatan Pasangan x dan y:</h4>
                <div class="table-responsive">
                  <table class="table-custom">
                    <thead>
                      <tr>
                        <th>x (Roti)</th>
                        <th>y (Susu)</th>
                        <th>2x + y = 11</th>
                        <th>x + 2y = 13</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${(selectedLKPD.explorationData || []).map(d => `
                        <tr style="${d.isSolution ? 'background: #E8F5E9; font-weight: bold;' : ''}">
                          <td>${d.x}</td>
                          <td>${d.y}</td>
                          <td>${d.eq1Val}</td>
                          <td>${d.eq2Val}</td>
                          <td>${d.isSolution ? '⭐ Solusi SPLDV' : 'Belum Memenuhi'}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 2. Langkah Eliminasi Siswa -->
              <div>
                <h4 style="color: var(--color-primary-dark); margin-bottom: 0.4rem;">B. Penjelasan Langkah Eliminasi Siswa:</h4>
                <div style="background: var(--color-primary-lighter); padding: 1rem; border-radius: var(--radius-sm); white-space: pre-wrap; font-size: 0.95rem;">${selectedLKPD.eliminationSteps || 'Tidak ada penjelasan.'}</div>
              </div>

              <!-- 3. Refleksi Konseptual Siswa -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                <div style="background: #F8FAFC; border: 1px solid var(--color-border); padding: 1rem; border-radius: var(--radius-sm);">
                  <strong style="color: var(--color-primary-dark); font-size: 0.9rem;">1. Refleksi Dua Timbangan:</strong>
                  <p style="margin-top: 0.4rem; font-size: 0.92rem; color: var(--color-text-main); font-style: italic;">
                    "${selectedLKPD.reflection1 || '-'}"
                  </p>
                </div>
                <div style="background: #F8FAFC; border: 1px solid var(--color-border); padding: 1rem; border-radius: var(--radius-sm);">
                  <strong style="color: var(--color-primary-dark); font-size: 0.9rem;">2. Refleksi Syarat Simultan:</strong>
                  <p style="margin-top: 0.4rem; font-size: 0.92rem; color: var(--color-text-main); font-style: italic;">
                    "${selectedLKPD.reflection2 || '-'}"
                  </p>
                </div>
              </div>

              <!-- 4. Kesimpulan Siswa -->
              <div>
                <h4 style="color: var(--color-primary-dark); margin-bottom: 0.4rem;">C. Kesimpulan Akhir Siswa:</h4>
                <div style="background: #F8FAFC; border: 1px solid var(--color-border); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.95rem;">${selectedLKPD.conclusion || '-'}</div>
              </div>

              <!-- FORM PENILAIAN GURU -->
              <div style="background: linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%); border: 2px solid #FDE68A; border-radius: var(--radius-md); padding: 1.5rem; margin-top: 1rem;">
                <h3 style="font-size: 1.2rem; color: #92400E; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                  <span>🎯</span> Form Penilaian Guru
                </h3>

                <form id="grade-lkpd-form">
                  <div style="display: grid; grid-template-columns: 140px 1fr; gap: 1.25rem; align-items: flex-start;">
                    <div class="form-group">
                      <label class="form-label" for="input-grade-score">Nilai (0 - 100):</label>
                      <input type="number" id="input-grade-score" class="form-control" min="0" max="100" required value="${selectedLKPD.score !== null && selectedLKPD.score !== undefined ? selectedLKPD.score : 85}">
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="input-grade-feedback">Komentar & Saran Konstruktif:</label>
                      <textarea id="input-grade-feedback" class="form-control" rows="3" placeholder="Tuliskan umpan balik untuk membimbing pemikiran aljabar siswa...">${selectedLKPD.teacherFeedback || ''}</textarea>
                    </div>
                  </div>

                  <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;">
                    <button type="submit" class="btn btn-success btn-lg">
                      💾 Simpan Nilai & Kirim Ulasan ke Siswa
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        ` : ''}

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Tombol Pilih Review
    container.querySelectorAll('.btn-review-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const list = getLKPDByClass(classCode);
        selectedLKPD = list.find(item => item.id === id);
        render();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      });
    });

    // Tutup Detail
    const btnClose = container.querySelector('#btn-close-detail');
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        selectedLKPD = null;
        render();
      });
    }

    // Submit Penilaian
    const gradeForm = container.querySelector('#grade-lkpd-form');
    if (gradeForm && selectedLKPD) {
      gradeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const score = container.querySelector('#input-grade-score').value;
        const feedback = container.querySelector('#input-grade-feedback').value;

        const res = gradeLKPD(selectedLKPD.id, score, feedback);
        if (res.success) {
          showToast(`LKPD ${selectedLKPD.studentName} berhasil dinilai: ${score}!`, 'success');
          selectedLKPD = null;
          render();
        }
      });
    }

    // Ekspor CSV
    const btnExport = container.querySelector('#btn-export-csv');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const list = getLKPDByClass(classCode);
        if (list.length === 0) {
          showToast('Belum ada data LKPD untuk diekspor.', 'warning');
          return;
        }

        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'No,Nama Siswa,Kelas,Kode Kelas,Status,Nilai,Tanggal Dikirim,Komentar Guru\r\n';

        list.forEach((item, idx) => {
          const row = [
            idx + 1,
            `"${item.studentName}"`,
            `"${user?.className || 'VIII-A'}"`,
            `"${classCode}"`,
            `"${item.status}"`,
            item.score !== null ? item.score : '',
            `"${item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('id-ID') : ''}"`,
            `"${(item.teacherFeedback || '').replace(/"/g, '""')}"`
          ];
          csvContent += row.join(',') + '\r\n';
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Rekap_LKPD_SPLASH_${classCode}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        showToast('File rekap CSV berhasil diunduh!', 'success');
      });
    }
  }

  render();
}
