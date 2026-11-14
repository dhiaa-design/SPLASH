/**
 * Materi View: Modul Teori SPLDV & Kuis Cek Pemahaman Interaktif
 */

import { INITIAL_QUIZ_QUESTIONS } from '../../services/seed-data.js';
import { saveProgress, getProgress } from '../../services/storage.js';
import { appState } from '../../state.js';
import { showToast } from '../../utils/dom-helpers.js';

export function renderMateriView(container) {
  const user = appState.getUser();
  const currentProgress = user ? getProgress(user.id) : { completedStages: [] };

  let activeQuizAnswers = {};
  let quizSubmitted = false;

  function render() {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 900px; margin: 0 auto;">
        
        <!-- Header Materi -->
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="#/beranda" style="font-weight: 600; font-size: 0.9rem;">← Kembali ke Beranda</a>
            <span style="color: var(--color-text-light);">/</span>
            <span style="color: var(--color-primary); font-weight: 700; font-size: 0.9rem;">Materi Pembelajaran</span>
          </div>
          <h1 style="font-size: 2rem;">Mengenal Sistem Persamaan Linear Dua Variabel (SPLDV)</h1>
          <p style="font-size: 1.05rem; margin-top: 0.5rem;">
            Pelajari konsep kesetaraan aljabar, variabel, koefisien, dan bentuk umum SPLDV sebelum masuk ke laboratorium timbangan.
          </p>
        </div>

        <!-- Highlight Banner Konsep Kunci Wajib -->
        <div class="card card-accent-blue" style="border-left: 6px solid var(--color-primary); padding: 1.5rem;">
          <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <span style="font-size: 2.2rem;">💡</span>
            <div>
              <h3 style="font-size: 1.2rem; color: var(--color-primary-dark); margin-bottom: 0.4rem;">Konsep Inti SPLDV</h3>
              <p style="font-size: 1.05rem; line-height: 1.6; margin-bottom: 0; color: var(--color-text-main); font-weight: 500;">
                "SPLDV terdiri atas dua persamaan linear yang memiliki dua variabel. Nilai kedua variabel harus memenuhi kedua persamaan secara bersamaan."
              </p>
            </div>
          </div>
        </div>

        <!-- Bagian 1: Pengertian & Representasi Balok Interaktif -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title"><span>🧩</span> 1. Representasi Visual Balok SPLASH</h2>
          </div>
          <p>
            Dalam media SPLASH, kita menggunakan balok warna-warni untuk membantu membayangkan persamaan matematika:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1rem;">
            
            <div class="card card-hover" style="background: var(--color-primary-lighter); border: 1.5px solid #FFCC80; text-align: center; padding: 1.25rem;">
              <div class="algebra-block block-x" style="width: 50px; height: 50px; font-size: 1.3rem; margin: 0 auto 0.75rem auto;">x</div>
              <h4 style="color: #BF360C; margin-bottom: 0.25rem;">Balok Variabel x</h4>
              <p style="font-size: 0.85rem; margin-bottom: 0;">Mewakili nilai atau benda pertama yang belum diketahui nilainya (misal: harga 1 roti).</p>
            </div>

            <div class="card card-hover" style="background: var(--color-primary-lighter); border: 1.5px solid #E1BEE7; text-align: center; padding: 1.25rem;">
              <div class="algebra-block block-y" style="width: 50px; height: 50px; font-size: 1.3rem; margin: 0 auto 0.75rem auto;">y</div>
              <h4 style="color: #4A148C; margin-bottom: 0.25rem;">Balok Variabel y</h4>
              <p style="font-size: 0.85rem; margin-bottom: 0;">Mewakili nilai atau benda kedua yang belum diketahui nilainya (misal: harga 1 susu).</p>
            </div>

            <div class="card card-hover" style="background: var(--color-primary-lighter); border: 1.5px solid #B3E5FC; text-align: center; padding: 1.25rem;">
              <div class="algebra-block block-num" style="min-width: 44px; height: 44px; font-size: 1.1rem; margin: 0.25rem auto 0.75rem auto;">+1</div>
              <h4 style="color: #01579B; margin-bottom: 0.25rem;">Balok Konstanta (Angka)</h4>
              <p style="font-size: 0.85rem; margin-bottom: 0;">Mewakili nilai bilangan satuan yang nilainya sudah pasti dan tetap.</p>
            </div>

          </div>
        </div>

        <!-- Bagian 2: Unsur-unsur Persamaan (Kartu Istilah yang Bisa Diklik) -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title"><span>🏷️</span> 2. Unsur-unsur Persamaan Aljabar</h2>
          </div>
          <p>Klik kartu istilah di bawah ini untuk melihat contoh dan penjelasan rincinya:</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1rem;">
            <button class="btn btn-secondary term-tab-btn" data-term="variabel" style="justify-content: flex-start; padding: 0.85rem;">
              <strong>1. Variabel</strong>
            </button>
            <button class="btn btn-secondary term-tab-btn" data-term="koefisien" style="justify-content: flex-start; padding: 0.85rem;">
              <strong>2. Koefisien</strong>
            </button>
            <button class="btn btn-secondary term-tab-btn" data-term="konstanta" style="justify-content: flex-start; padding: 0.85rem;">
              <strong>3. Konstanta</strong>
            </button>
            <button class="btn btn-secondary term-tab-btn" data-term="suku" style="justify-content: flex-start; padding: 0.85rem;">
              <strong>4. Suku</strong>
            </button>
          </div>

          <!-- Wadah Detail Istilah Interaktif -->
          <div id="term-detail-box" style="margin-top: 1rem; padding: 1.25rem; background: var(--color-primary-lighter); border-radius: var(--radius-md); border: 1px solid var(--color-primary-border);">
            <h4 id="term-title" style="color: var(--color-primary-dark); margin-bottom: 0.4rem;">Variabel (Peubah)</h4>
            <p id="term-desc" style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--color-text-main);">
              Lambang pengganti suatu bilangan yang belum diketahui nilainya secara pasti. Biasanya dilambangkan dengan huruf kecil seperti <em>x</em> dan <em>y</em>.
            </p>
            <div id="term-example" style="font-size: 0.9rem; font-weight: 600; color: var(--color-primary);">
              Contoh pada 2x + y = 11: Variabelnya adalah huruf <strong>x</strong> dan <strong>y</strong>.
            </div>
          </div>
        </div>

        <!-- Bagian 3: Bentuk Umum SPLDV -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title"><span>📐</span> 3. Bentuk Umum SPLDV</h2>
          </div>
          <p>Sistem Persamaan Linear Dua Variabel biasanya dituliskan dalam bentuk standar:</p>
          
          <div style="background: #F1F5F9; border-radius: var(--radius-md); padding: 1.25rem; text-align: center; margin: 1rem 0;">
            <div style="font-size: 1.4rem; font-weight: 700; color: var(--color-primary-dark); font-family: var(--font-family-math);">
              ax + by = c<br>
              px + qy = r
            </div>
            <div style="font-size: 0.88rem; color: var(--color-text-muted); margin-top: 0.5rem;">
              Dengan <em>a, b, c, p, q, r</em> adalah bilangan real, serta <em>a, b ≠ 0</em> dan <em>p, q ≠ 0</em>.
            </div>
          </div>

          <div class="alert alert-info" style="margin-bottom: 0;">
            <span>ℹ️</span>
            <div>
              <strong>Contoh Utama Pembelajaran Kita:</strong><br>
              Persamaan (1): <code>2x + y = 11</code><br>
              Persamaan (2): <code>x + 2y = 13</code><br>
              Pasangan penyelesaiannya adalah <strong>x = 3</strong> dan <strong>y = 5</strong>, karena jika disubstitusikan ke kedua persamaan sekaligus, hasilnya tepat seimbang!
            </div>
          </div>
        </div>

        <!-- Bagian 4: Kuis Cek Pemahaman Mandiri -->
        <div class="card" style="border: 2px solid var(--color-primary-border);">
          <div class="card-header">
            <h2 class="card-title"><span>✍️</span> 4. Cek Pemahaman Cepat</h2>
            <span class="badge badge-warning">3 Soal Interaktif</span>
          </div>
          <p>Uji pemahamanmu sebelum melanjutkan ke simulasi praktis:</p>

          <form id="quiz-form" style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem;">
            ${INITIAL_QUIZ_QUESTIONS.map((q, idx) => `
              <div class="card" style="background: #FAFBFD; border: 1px solid var(--color-border); padding: 1.25rem;">
                <div style="font-weight: 700; font-size: 1rem; color: var(--color-primary-dark); margin-bottom: 0.75rem;">
                  Soal ${idx + 1}: ${q.question}
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  ${q.options.map((opt, optIdx) => `
                    <label style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.85rem; background: white; border: 1.5px solid var(--color-border); border-radius: var(--radius-sm); cursor: pointer; transition: all 150ms ease;">
                      <input type="radio" name="${q.id}" value="${optIdx}" ${activeQuizAnswers[q.id] === optIdx ? 'checked' : ''} style="accent-color: var(--color-primary); width: 18px; height: 18px;">
                      <span style="font-size: 0.95rem;">${opt}</span>
                    </label>
                  `).join('')}
                </div>
                <div id="feedback-${q.id}" class="form-feedback hidden" style="margin-top: 0.75rem; font-weight: 600; font-size: 0.9rem;"></div>
              </div>
            `).join('')}

            <div style="display: flex; justify-content: flex-end; gap: 1rem; align-items: center;">
              <button type="submit" class="btn btn-primary btn-lg" id="btn-submit-quiz">
                Periksa Jawaban Kuis
              </button>
            </div>
          </form>
        </div>

        <!-- Tombol Lanjut ke Tahap Berikutnya -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem;">
          <a href="#/beranda" class="btn btn-outline">← Beranda</a>
          <a href="#/kontekstual" class="btn btn-success btn-lg" id="btn-next-stage">
            Lanjut ke Masalah Kontekstual 🥪 →
          </a>
        </div>

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Interaktivitas Istilah
    const terms = {
      variabel: {
        title: 'Variabel (Peubah)',
        desc: 'Lambang pengganti bilangan yang nilainya belum diketahui secara pasti, umumnya berupa huruf seperti x dan y.',
        example: 'Pada persamaan 2x + y = 11, variabelnya adalah x dan y.'
      },
      koefisien: {
        title: 'Koefisien',
        desc: 'Bilangan pengali yang berada di depan variabel aljabar.',
        example: 'Pada 2x + y = 11, angka 2 adalah koefisien dari x, dan angka 1 adalah koefisien dari y.'
      },
      konstanta: {
        title: 'Konstanta',
        desc: 'Bilangan yang berdiri sendiri dan tidak memuat variabel apa pun (nilainya tetap).',
        example: 'Pada 2x + y = 11, angka 11 di ruas kanan adalah konstanta.'
      },
      suku: {
        title: 'Suku',
        desc: 'Bagian dari bentuk aljabar yang dipisahkan oleh tanda operasi penjumlahan (+) atau pengurangan (-).',
        example: 'Persamaan 2x + y = 11 memiliki 3 suku: suku 2x, suku y, dan suku 11.'
      }
    };

    container.querySelectorAll('.term-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const termKey = btn.getAttribute('data-term');
        const data = terms[termKey];
        if (data) {
          container.querySelector('#term-title').textContent = data.title;
          container.querySelector('#term-desc').textContent = data.desc;
          container.querySelector('#term-example').innerHTML = `Contoh: ${data.example}`;

          container.querySelectorAll('.term-tab-btn').forEach(b => {
            b.className = 'btn btn-secondary term-tab-btn';
          });
          btn.className = 'btn btn-primary term-tab-btn';
        }
      });
    });

    // Handle Kuis
    const quizForm = container.querySelector('#quiz-form');
    if (quizForm) {
      quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let allCorrect = true;
        let answeredAll = true;

        INITIAL_QUIZ_QUESTIONS.forEach(q => {
          const selected = container.querySelector(`input[name="${q.id}"]:checked`);
          const fbBox = container.querySelector(`#feedback-${q.id}`);

          if (!selected) {
            answeredAll = false;
            return;
          }

          const val = Number(selected.value);
          activeQuizAnswers[q.id] = val;

          if (val === q.correctAnswer) {
            fbBox.className = 'form-feedback success';
            fbBox.innerHTML = `✅ Benar! ${q.explanation}`;
            fbBox.classList.remove('hidden');
          } else {
            allCorrect = false;
            fbBox.className = 'form-feedback error';
            fbBox.innerHTML = `❌ Kurang tepat. ${q.explanation}`;
            fbBox.classList.remove('hidden');
          }
        });

        if (!answeredAll) {
          showToast('Silakan jawab semua soal terlebih dahulu!', 'warning');
          return;
        }

        if (allCorrect) {
          showToast('Luar biasa! Semua jawaban kuis kamu benar!', 'success');
          if (user) {
            saveProgress(user.id, { completedStages: ['materi'] });
          }
        } else {
          showToast('Ada jawaban yang belum tepat, baca penjelasannya lalu perbaiki.', 'warning');
        }
      });
    }

    // Tombol Lanjut Stage
    const btnNext = container.querySelector('#btn-next-stage');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (user) {
          saveProgress(user.id, { completedStages: ['materi'] });
        }
      });
    }
  }

  render();
}
