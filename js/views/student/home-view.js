/**
 * Home View: Beranda Siswa SPLASH
 */

import { appState } from '../../state.js';
import { getProgress } from '../../services/storage.js';

export function renderHomeView(container) {
  const user = appState.getUser();
  const progress = user ? getProgress(user.id) : { completedStages: [] };
  const stages = progress.completedStages || [];

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      
      <!-- Hero Banner Ceria -->
      <div class="card" style="background: linear-gradient(135deg, #0B3D91 0%, #1E6FD9 100%); color: white; padding: 2.5rem; position: relative; overflow: hidden;">
        <div style="max-width: 680px; position: relative; z-index: 2;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255, 255, 255, 0.2); padding: 0.35rem 0.85rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 700; margin-bottom: 1rem;">
            <span>👋</span> Halo, ${user ? user.name : 'Siswa Hebat'}! (Kelas ${user ? user.className : 'VIII'})
          </div>
          <h1 style="color: white; font-size: 2.2rem; font-weight: 800; line-height: 1.2; margin-bottom: 0.85rem;">
            SPLASH – Sistem Persamaan Linear Asyik dan Seru
          </h1>
          <p style="color: #DCEBFF; font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.75rem;">
            Ayo eksplorasi, manipulasi, dan temukan penyelesaian Sistem Persamaan Linear Dua Variabel melalui simulasi timbangan interaktif!
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
            <a href="#/materi" class="btn btn-warning btn-lg" style="font-weight: 800; box-shadow: 0 4px 15px rgba(255, 200, 61, 0.4);">
              🚀 Mulai Belajar
            </a>
            <a href="#/simulasi" class="btn btn-secondary btn-lg" style="background: rgba(255, 255, 255, 0.2); color: white; border: 1px solid rgba(255, 255, 255, 0.4);">
              ⚖️ Langsung ke Simulasi
            </a>
          </div>
        </div>

        <!-- Ilustrasi Karakter & Timbangan di Sudut Kanan -->
        <div style="position: absolute; right: 2rem; bottom: 0; width: 220px; opacity: 0.95; display: none;" class="hero-character-box">
          <img src="assets/images/student-avatar.svg" alt="Karakter Siswa Ceria" style="width: 100%; transform: translateY(15px);">
        </div>
      </div>

      <!-- Kartu Alur Pembelajaran (8 Menu Interaktif) -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.4rem;">Peta Petualangan Belajar SPLDV</h2>
          <span style="font-size: 0.9rem; color: var(--color-text-muted); font-weight: 600;">
            ${stages.length} dari 8 Tahap Terjelajahi
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          
          <!-- Tahap 1: Materi -->
          <a href="#/materi" class="card card-hover" style="border-top: 4px solid var(--color-primary); display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <span style="font-size: 2rem;">📖</span>
              ${stages.includes('materi') ? '<span class="badge badge-success">✓ Selesai</span>' : '<span class="badge badge-info">Tahap 1</span>'}
            </div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.4rem;">1. Materi SPLDV</h3>
            <p style="font-size: 0.88rem; flex-grow: 1;">Pelajari konsep dasar persamaan, variabel x & y, serta bentuk umum SPLDV dilengkapi tes pemahaman.</p>
            <span style="font-weight: 700; color: var(--color-primary); font-size: 0.85rem; margin-top: 0.5rem;">Buka Materi →</span>
          </a>

          <!-- Tahap 2: Kontekstual -->
          <a href="#/kontekstual" class="card card-hover" style="border-top: 4px solid #FF7A00; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <span style="font-size: 2rem;">🥪</span>
              ${stages.includes('kontekstual') ? '<span class="badge badge-success">✓ Selesai</span>' : '<span class="badge badge-info">Tahap 2</span>'}
            </div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.4rem;">2. Masalah Kontekstual</h3>
            <p style="font-size: 0.88rem; flex-grow: 1;">Pecahkan misteri harga roti dan susu di kantin sekolah dengan merumuskan model aljabar dua variabel.</p>
            <span style="font-weight: 700; color: #FF7A00; font-size: 0.85rem; margin-top: 0.5rem;">Buka Masalah Kantin →</span>
          </a>

          <!-- Tahap 3: Simulasi Timbangan -->
          <a href="#/simulasi" class="card card-hover" style="border-top: 4px solid #00C9FF; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <span style="font-size: 2rem;">⚖️</span>
              ${stages.includes('simulasi') ? '<span class="badge badge-success">✓ Selesai</span>' : '<span class="badge badge-info">Tahap 3</span>'}
            </div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.4rem;">3. Simulasi Dua Timbangan</h3>
            <p style="font-size: 0.88rem; flex-grow: 1;">Manipulasi balok aljabar pada kedua ruas timbangan SVG interaktif untuk memahami prinsip kesetaraan.</p>
            <span style="font-weight: 700; color: var(--color-primary); font-size: 0.85rem; margin-top: 0.5rem;">Coba Timbangan →</span>
          </a>

          <!-- Tahap 4: Eksplorasi -->
          <a href="#/eksplorasi" class="card card-hover" style="border-top: 4px solid #9C27B0; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <span style="font-size: 2rem;">🎛️</span>
              ${stages.includes('eksplorasi') ? '<span class="badge badge-success">✓ Selesai</span>' : '<span class="badge badge-info">Tahap 4</span>'}
            </div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.4rem;">4. Eksplorasi Nilai x & y</h3>
            <p style="font-size: 0.88rem; flex-grow: 1;">Geser slider untuk menemukan pasangan nilai yang memenuhi kedua persamaan sekaligus.</p>
            <span style="font-weight: 700; color: #9C27B0; font-size: 0.85rem; margin-top: 0.5rem;">Mulai Eksplorasi →</span>
          </a>

          <!-- Tahap 5: Laboratorium Eliminasi -->
          <a href="#/eliminasi" class="card card-hover" style="border-top: 4px solid #E5484D; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <span style="font-size: 2rem;">🔬</span>
              ${stages.includes('eliminasi') ? '<span class="badge badge-success">✓ Selesai</span>' : '<span class="badge badge-info">Tahap 5</span>'}
            </div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.4rem;">5. Lab Eliminasi</h3>
            <p style="font-size: 0.88rem; flex-grow: 1;">Pelajari langkah menyamakan koefisien dan melihat animasi suku aljabar saling menghapus secara sistematis.</p>
            <span style="font-weight: 700; color: #E5484D; font-size: 0.85rem; margin-top: 0.5rem;">Masuk Laboratorium →</span>
          </a>

          <!-- Tahap 6: Tantangan / Misi -->
          <a href="#/tantangan" class="card card-hover" style="border-top: 4px solid var(--color-accent-yellow); display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <span style="font-size: 2rem;">⭐</span>
              ${stages.includes('tantangan') ? '<span class="badge badge-success">✓ Selesai</span>' : '<span class="badge badge-warning">Tahap 6</span>'}
            </div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.4rem;">6. Tantangan Misi</h3>
            <p style="font-size: 0.88rem; flex-grow: 1;">Uji kemampuanmu memecahkan 5 misi bertingkat dari mudah hingga sulit dengan petunjuk konsep cerdas.</p>
            <span style="font-weight: 700; color: #854D0E; font-size: 0.85rem; margin-top: 0.5rem;">Mulai Misi →</span>
          </a>

          <!-- Tahap 7: LKPD Digital -->
          <a href="#/lkpd" class="card card-hover" style="border-top: 4px solid #2E9E6B; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <span style="font-size: 2rem;">📝</span>
              ${stages.includes('lkpd') ? '<span class="badge badge-success">✓ Terkirim</span>' : '<span class="badge badge-info">Tahap 7</span>'}
            </div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.4rem;">7. LKPD Digital & Refleksi</h3>
            <p style="font-size: 0.88rem; flex-grow: 1;">Isi lembar kerja siswa terintegrasi data eksplorasi, tulis refleksi, simpan draf, dan kirimkan ke gurumu.</p>
            <span style="font-weight: 700; color: #2E9E6B; font-size: 0.85rem; margin-top: 0.5rem;">Buka LKPD →</span>
          </a>

          <!-- Tahap 8: Tentang -->
          <a href="#/tentang" class="card card-hover" style="border-top: 4px solid #718096; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <span style="font-size: 2rem;">💡</span>
              <span class="badge badge-info">Info</span>
            </div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.4rem;">8. Tentang SPLASH</h3>
            <p style="font-size: 0.88rem; flex-grow: 1;">Informasi pengembang media, capaian pembelajaran fase D kurikulum merdeka, dan petunjuk penggunaan.</p>
            <span style="font-weight: 700; color: #718096; font-size: 0.85rem; margin-top: 0.5rem;">Pelajari Lebih Lanjut →</span>
          </a>

        </div>
      </div>

    </div>
  `;

  // Responsive visual avatar check
  if (window.innerWidth >= 768) {
    const avatarBox = container.querySelector('.hero-character-box');
    if (avatarBox) avatarBox.style.display = 'block';
  }
}
