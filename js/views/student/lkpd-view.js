/**
 * LKPD View: Lembar Kerja Peserta Didik (LKPD) Digital & Refleksi Mandiri
 * Integrasi data otomatis dari tahap Eksplorasi, Validasi, Simpan Draf,
 * Pengiriman ke Guru, Cetak Format Standar Pendidikan, & Melihat Nilai/Komentar Guru.
 */

import { getLKPD, saveLKPD, getProgress, saveProgress } from '../../services/storage.js';
import { appState } from '../../state.js';
import { showToast } from '../../utils/dom-helpers.js';

export function renderLKPDView(container) {
  const user = appState.getUser();
  const progress = user ? getProgress(user.id) : { explorationTrials: [] };
  const existingLKPD = user ? getLKPD(user.id) : null;

  // Data eksplorasi yang diambil dari riwayat siswa
  const explorationData = existingLKPD?.explorationData || progress.explorationTrials || [
    { x: 1, y: 5, eq1Val: 7, eq2Val: 11, match1: false, match2: false, isSolution: false },
    { x: 3, y: 5, eq1Val: 11, eq2Val: 13, match1: true, match2: true, isSolution: true }
  ];

  function render() {
    const isSubmitted = existingLKPD?.status === 'submitted' || existingLKPD?.status === 'reviewed';
    const isReviewed = existingLKPD?.status === 'reviewed';

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 900px; margin: 0 auto;">
        
        <!-- Header Non-Print -->
        <div class="btn-print-hide">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="#/tantangan" style="font-weight: 600; font-size: 0.9rem;">← Tantangan Misi</a>
            <span style="color: var(--color-text-light);">/</span>
            <span style="color: var(--color-primary); font-weight: 700; font-size: 0.9rem;">LKPD Digital & Refleksi</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h1 style="font-size: 2rem;">Lembar Kerja Peserta Didik (LKPD) Digital</h1>
              <p style="font-size: 1rem; margin-top: 0.25rem;">
                Dokumentasikan hasil eksplorasi, refleksi pemikiran aljabarmu, dan kirimkan ke gurumu.
              </p>
            </div>
            <div style="display: flex; gap: 0.75rem;">
              <button class="btn btn-outline" id="btn-print-lkpd" title="Cetak atau Simpan sebagai PDF">
                🖨️ Cetak / Simpan PDF
              </button>
            </div>
          </div>
        </div>

        <!-- Banner Nilai & Komentar Guru (Jika Sudah Dinilai) -->
        ${isReviewed ? `
          <div class="card card-accent-blue" style="border: 2px solid var(--color-success); padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.8rem;">🏆</span>
                <div>
                  <h3 style="font-size: 1.25rem; color: var(--color-success); margin: 0;">Ulasan dari Guru</h3>
                  <div style="font-size: 0.8rem; color: var(--color-text-muted);">Dinilai pada: ${new Date(existingLKPD.reviewedAt).toLocaleDateString('id-ID')}</div>
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-text-muted);">NILAI AKHIR:</div>
                <div style="font-size: 2.2rem; font-weight: 800; color: var(--color-success); line-height: 1;">${existingLKPD.score} / 100</div>
              </div>
            </div>
            <div style="background: white; border-radius: var(--radius-sm); padding: 1rem; border: 1px dashed #86EFAC;">
              <div style="font-weight: 700; font-size: 0.9rem; color: #166534; margin-bottom: 0.25rem;">💬 Komentar Guru:</div>
              <p style="font-size: 0.95rem; margin: 0; color: var(--color-text-main); font-style: italic;">
                "${existingLKPD.teacherFeedback || 'Kerja bagus! Pemahaman konsep SPLDV dan refleksimu sangat terstruktur.'}"
              </p>
            </div>
          </div>
        ` : (isSubmitted ? `
          <div class="alert alert-info">
            <span>ℹ️</span>
            <div>
              <strong>LKPD Telah Dikirim ke Guru:</strong> Pekerjaanmu sedang dalam antrean pemeriksaan guru. Kamu masih bisa mencetak atau melihat isianmu di bawah ini.
            </div>
          </div>
        ` : '')}

        <!-- LEMBAR LKPD (Siap Cetak) -->
        <div class="card" id="printable-lkpd-sheet" style="padding: 2.5rem; background: white; border: 1.5px solid var(--color-border); box-shadow: var(--shadow-sm);">
          
          <!-- Kop Cetak LKPD -->
          <div class="print-header" style="text-align: center; border-bottom: 2px solid var(--color-primary-dark); padding-bottom: 1rem; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: center; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <img src="assets/images/logo.svg" alt="Logo" style="width: 48px; height: 48px;" class="btn-print-hide">
              <h2 style="font-size: 1.5rem; color: var(--color-primary-dark); margin: 0;">
                LEMBAR KERJA PESERTA DIDIK (LKPD) DIGITAL
              </h2>
            </div>
            <div style="font-weight: 700; font-size: 1.1rem; color: var(--color-primary);">
              SPLASH – Sistem Persamaan Linear Asyik dan Seru
            </div>
            <div style="font-size: 0.85rem; color: var(--color-text-muted);">
              Materi: Sistem Persamaan Linear Dua Variabel (SPLDV) | Sasaran: Kelas VIII SMP
            </div>
          </div>

          <!-- Identitas Siswa Otomatis -->
          <div style="background: var(--color-primary-lighter); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
            <div><strong>Nama Siswa:</strong> ${user ? user.name : 'Siswa Tamu'}</div>
            <div><strong>Kelas:</strong> ${user ? user.className : 'VIII-A'}</div>
            <div><strong>Kode Kelas:</strong> <code>${user ? user.classCode : 'SPLDV8'}</code></div>
            <div><strong>Status:</strong> <span class="badge ${isSubmitted ? 'badge-success' : 'badge-warning'}">${isSubmitted ? (isReviewed ? 'Sudah Dinilai' : 'Terkirim') : 'Draf Siswa'}</span></div>
          </div>

          <!-- Tujuan Pembelajaran -->
          <div style="margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.15rem; color: var(--color-primary-dark); margin-bottom: 0.4rem;">A. Tujuan Pembelajaran</h3>
            <ol style="padding-left: 1.25rem; font-size: 0.95rem; line-height: 1.6; color: var(--color-text-main);">
              <li>Peserta didik dapat memodelkan masalah kontekstual ke dalam bentuk persamaan linear dua variabel.</li>
              <li>Peserta didik dapat memahami prinsip kesetaraan aljabar melalui simulasi timbangan dua lengan.</li>
              <li>Peserta didik dapat menentukan himpunan penyelesaian SPLDV menggunakan metode eliminasi dan substitusi.</li>
            </ol>
          </div>

          <!-- Bagian B: Tabel Data Pengamatan Eksplorasi (Auto-fill) -->
          <div style="margin-bottom: 1.75rem;">
            <h3 style="font-size: 1.15rem; color: var(--color-primary-dark); margin-bottom: 0.4rem;">
              B. Tabel Pengamatan Nilai Pasangan (x, y)
            </h3>
            <p style="font-size: 0.88rem; margin-bottom: 0.75rem;">
              Data pengamatan pasangan nilai x dan y yang diuji pada persamaan <code>2x + y = 11</code> dan <code>x + 2y = 13</code>:
            </p>

            <div class="table-responsive">
              <table class="table-custom">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>x (Roti)</th>
                    <th>y (Susu)</th>
                    <th>2x + y = 11</th>
                    <th>x + 2y = 13</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  ${explorationData.map((d, idx) => `
                    <tr style="${d.isSolution ? 'background: #E8F5E9; font-weight: bold;' : ''}">
                      <td>${idx + 1}</td>
                      <td>${d.x}</td>
                      <td>${d.y}</td>
                      <td>${d.eq1Val} (${d.match1 ? 'Benar' : 'Salah'})</td>
                      <td>${d.eq2Val} (${d.match2 ? 'Benar' : 'Salah'})</td>
                      <td>${d.isSolution ? '⭐ Solusi SPLDV' : (d.match1 || d.match2 ? 'Hanya 1 Benar' : 'Belum Memenuhi')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Form Isian Refleksi & Kesimpulan -->
          <form id="lkpd-submission-form">
            
            <!-- Bagian C: Langkah Eliminasi Siswa -->
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label class="form-label" for="lkpd-elimination-text" style="font-size: 1.05rem; color: var(--color-primary-dark);">
                C. Tuliskan Langkah-langkah Eliminasi yang Kamu Lakukan:
              </label>
              <textarea id="lkpd-elimination-text" class="form-control" rows="4" placeholder="Jelaskan bagaimana kamu menyamakan koefisien, mengurangkan persamaan, dan melakukan substitusi..." ${isSubmitted ? 'readonly' : ''} required>${existingLKPD?.eliminationSteps || ''}</textarea>
            </div>

            <!-- Bagian D: Pertanyaan Refleksi Wajib -->
            <div style="margin-bottom: 1.5rem;">
              <h3 style="font-size: 1.15rem; color: var(--color-primary-dark); margin-bottom: 0.75rem;">D. Pertanyaan Refleksi Konseptual</h3>
              
              <div class="form-group">
                <label class="form-label" for="lkpd-reflection-1">
                  1. Apa yang kamu pelajari dari interaksi dua timbangan aljabar?
                </label>
                <textarea id="lkpd-reflection-1" class="form-control" rows="3" placeholder="Tuliskan pemahamanmu mengenai prinsip kesetaraan pada kedua ruas..." ${isSubmitted ? 'readonly' : ''} required>${existingLKPD?.reflection1 || ''}</textarea>
              </div>

              <div class="form-group" style="margin-top: 1rem;">
                <label class="form-label" for="lkpd-reflection-2">
                  2. Mengapa satu pasangan nilai (x, y) harus memenuhi kedua persamaan secara bersamaan agar sah menjadi penyelesaian SPLDV?
                </label>
                <textarea id="lkpd-reflection-2" class="form-control" rows="3" placeholder="Jelaskan keterkaitan simultan antara kedua persamaan..." ${isSubmitted ? 'readonly' : ''} required>${existingLKPD?.reflection2 || ''}</textarea>
              </div>
            </div>

            <!-- Bagian E: Kesimpulan Akhir -->
            <div class="form-group" style="margin-bottom: 2rem;">
              <label class="form-label" for="lkpd-conclusion" style="font-size: 1.05rem; color: var(--color-primary-dark);">
                E. Kesimpulan Akhir:
              </label>
              <textarea id="lkpd-conclusion" class="form-control" rows="3" placeholder="Berapakah harga 1 potong roti (x) dan harga 1 kotak susu (y)? Apa kesimpulanmu?" ${isSubmitted ? 'readonly' : ''} required>${existingLKPD?.conclusion || ''}</textarea>
            </div>

            <!-- Bagian Tanda Tangan Khusus Cetak -->
            <div class="print-signature-section" style="display: none;">
              <div class="signature-box">
                <div>Mengetahui,</div>
                <div>Guru Mata Pelajaran</div>
                <div class="signature-line">( Budi Santoso, S.Pd. )</div>
              </div>
              <div class="signature-box">
                <div>Peserta Didik,</div>
                <div>${user ? user.className : 'Kelas VIII'}</div>
                <div class="signature-line">( ${user ? user.name : '......................'} )</div>
              </div>
            </div>

            <!-- Tombol Aksi Non-Print -->
            ${!isSubmitted ? `
              <div class="btn-print-hide" style="display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
                <button type="button" class="btn btn-secondary" id="btn-save-draft">
                  💾 Simpan Draf
                </button>
                <button type="submit" class="btn btn-success btn-lg" id="btn-submit-lkpd">
                  🚀 Kirim LKPD ke Guru
                </button>
              </div>
            ` : ''}

          </form>

        </div>

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Tombol Cetak
    const btnPrint = container.querySelector('#btn-print-lkpd');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    const form = container.querySelector('#lkpd-submission-form');
    const inputElim = container.querySelector('#lkpd-elimination-text');
    const inputRef1 = container.querySelector('#lkpd-reflection-1');
    const inputRef2 = container.querySelector('#lkpd-reflection-2');
    const inputConc = container.querySelector('#lkpd-conclusion');

    // Simpan Draf Otomatis
    const btnDraft = container.querySelector('#btn-save-draft');
    if (btnDraft) {
      btnDraft.addEventListener('click', () => {
        saveLKPDRecord('draft');
        showToast('Draf LKPD berhasil disimpan.', 'info');
      });
    }

    // Submit LKPD ke Guru
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!inputElim.value.trim() || !inputRef1.value.trim() || !inputRef2.value.trim() || !inputConc.value.trim()) {
          showToast('Harap lengkapi seluruh isian LKPD sebelum mengirim!', 'warning');
          return;
        }

        saveLKPDRecord('submitted');
        if (user) {
          saveProgress(user.id, { completedStages: ['lkpd'] });
        }
        showToast('LKPD berhasil dikirimkan ke guru! 🎉', 'success');
        render();
      });
    }

    function saveLKPDRecord(status) {
      if (!user) return;
      saveLKPD({
        studentId: user.id,
        studentName: user.name,
        classCode: user.classCode,
        explorationData,
        eliminationSteps: inputElim ? inputElim.value : '',
        reflection1: inputRef1 ? inputRef1.value : '',
        reflection2: inputRef2 ? inputRef2.value : '',
        conclusion: inputConc ? inputConc.value : '',
        status,
        submittedAt: new Date().toISOString()
      });
    }
  }

  render();
}
