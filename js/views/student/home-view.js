/**
 * Home View: Beranda Siswa SPLASH (Responsif HP, Tablet, Laptop)
 */

import { appState } from '../../state.js';
import { getProgress } from '../../services/storage.js';

export function renderHomeView(container) {
  const user = appState.getUser();
  const progress = user ? getProgress(user.id) : { completedStages: [] };
  const stages = progress.completedStages || [];

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.75rem;">
      
      <!-- Hero Banner Ceria & Menarik (Responsif) -->
      <div class="card hero-banner-card" style="background: linear-gradient(135deg, #072B6B 0%, #1557B0 50%, #1E6FD9 100%); color: white; padding: 2rem; position: relative; overflow: hidden; border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); border: 2px solid rgba(255, 255, 255, 0.15);">
        
        <!-- Hiasan Percikan Air SVG Melayang di Background -->
        <svg viewBox="0 0 500 200" style="position: absolute; right: -50px; top: -30px; width: 350px; height: 250px; opacity: 0.12; pointer-events: none;">
          <circle cx="200" cy="80" r="120" fill="white" />
          <circle cx="360" cy="40" r="60" fill="white" />
          <circle cx="100" cy="140" r="40" fill="white" />
        </svg>

        <div style="max-width: 650px; position: relative; z-index: 2;">
          
          <!-- Badge Sapaan Siswa -->
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255, 255, 255, 0.18); backdrop-filter: blur(4px); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 700; margin-bottom: 1rem; border: 1px solid rgba(255, 255, 255, 0.3);">
            <span>👋</span> Halo, ${user ? user.name : 'Siswa Hebat'}! <span style="color: var(--color-accent-yellow); font-weight: 800;">(Kelas ${user ? user.className : 'VIII-A'})</span>
          </div>

          <!-- Judul SPLASH dengan Aksen Emas -->
          <h1 style="color: white; font-size: clamp(1.5rem, 4vw, 2.3rem); font-weight: 800; line-height: 1.2; margin-bottom: 0.75rem;">
            <span style="color: var(--color-accent-yellow); text-shadow: 0 2px 10px rgba(255, 200, 61, 0.4);">SPLASH</span> – Sistem Persamaan Linear Asyik dan Seru
          </h1>

          <p style="color: #DCEBFF; font-size: clamp(0.9rem, 2vw, 1.05rem); line-height: 1.6; margin-bottom: 1.5rem; max-width: 580px;">
            Ayo eksplorasi, manipulasi balok, dan temukan penyelesaian Sistem Persamaan Linear Dua Variabel melalui simulasi timbangan interaktif!
          </p>

          <!-- Tombol Aksi Hero (Responsif) -->
          <div class="hero-actions-group" style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center;">
            <a href="#/materi" class="btn btn-warning btn-lg hero-btn-main" style="font-weight: 800; box-shadow: 0 4px 15px rgba(255, 200, 61, 0.45); border-radius: var(--radius-lg);">
              🚀 Mulai Belajar Materi
            </a>
            <a href="#/simulasi" class="btn btn-secondary btn-lg hero-btn-sub" style="background: rgba(255, 255, 255, 0.2); color: white; border: 1.5px solid rgba(255, 255, 255, 0.4); border-radius: var(--radius-lg); backdrop-filter: blur(2px);">
              ⚖️ Langsung ke Simulasi
            </a>
          </div>

        </div>

        <!-- Avatar Karakter Siswa -->
        <div class="hero-character-box" style="position: absolute; right: 1.5rem; bottom: -15px; width: clamp(110px, 18vw, 180px); z-index: 1;">
          <img src="assets/images/student-avatar.svg" alt="Karakter Siswa Ceria" style="width: 100%; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.25));">
        </div>

      </div>

      <!-- Kartu Alur Pembelajaran (8 Menu Interaktif Grid Responsif) -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
          <h2 style="font-size: clamp(1.15rem, 3vw, 1.35rem);">Peta Petualangan Belajar SPLDV</h2>
          <span class="badge badge-info" style="font-size: 0.8rem;">
            ${stages.length} dari 8 Tahap Terjelajahi
          </span>
        </div>

        <!-- Grid Responsif: 1 Kolom di HP, 2 Kolom di Tablet, 3-4 Kolom di Laptop -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); gap: 1rem;">
          
          <!-- Tahap 1: Materi -->
          <a href="#/materi" class="card card-hover" style="border-top: 4px solid var(--color-primary); display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 1.8rem;">📖</span>
              ${stages.includes('materi') ? '<span class="badge badge-success">✓ Selesai</span>' : '<span class="badge badge-info">Tahap 1</span>'}
            </div>
            <h3 style="font-size: 1.1rem; margin-bottom: 0.35rem;">1. Bahan Ajar SPLDV</h3>
            <p style="font-size: 0.85rem; flex-grow: 1; margin-bottom: 0.5rem;">Pelajari konsep dasar, unsur aljabar, dan 4 metode penyelesaian (grafik, substitusi, eliminasi, campuran).</p>
            <span style="font-weight: 700; color: var(--color-primary); font-size: 0.82rem;">Buka Materi →</span>
          </a>

          <!-- Tahap 2: Kontekstual -->
          <a href="#/kontekstual" class="card card-hover" style="border-top: 4px solid #FF7A00; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 1.8rem;">🥪</span>
              ${stages.includes('kontekstual') ? '<span class="badge badge-success">✓ Selesai</span>' : '<span class="badge badge-info">Tahap 2</span>'}
            </div>
            <h3 style="font-size: 1.1rem; margin-bottom: 0.35rem;">2. Masalah Kontekstual</h3>
            <p style="font-size: 0.85rem; flex-grow: 1; margin-bottom: 0.5rem;">Pecahkan misteri harga roti dan susu di kantin sekolah dengan merumuskan model aljabar dua variabel.</p>
            <span style="font-weight: 700; color: #FF7A00; font-size: 0.82rem;">Buka Masalah Kantin →</span>
          </a>

          <!-- Tahap 3: Simulasi Timbangan -->
          <a href="#/simulasi" class="card card-hover" style="border-top: 4px solid #00C9FF; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 1.8rem;">⚖️</span>
              ${stages.includes('simulasi') ? '<span class="badge badge-success">✓ Selesai</span>' : '<span class="badge badge-info">Tahap 3</span>'}
            </div>
            <h3 style="font-size: 1.1rem; margin-bottom: 0.35rem;">3. Simulasi Timbangan</h3>
            <p style="font-size: 0.85rem; flex-grow: 1; margin-bottom: 0.5rem;">Manipulasi balok aljabar pada kedua ruas timbangan SVG interaktif untuk memahami prinsip kesetaraan.</p>
            <span style="font-weight: 700; color: var(--color-primary); font-size: 0.82rem;">Coba Timbangan →</span>
          </a>

          <!-- Tahap 4: Eksplorasi -->
          <a href="#/eksplorasi" class="card card-hover" style="border-top: 4px solid #9C27B0; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 1.8rem;">🎛️</span>
              ${stages.includes('eksplorasi') ? '<span class="badge badge-success">✓ Selesai</span>' : '<span class="badge badge-info">Tahap 4</span>'}
            </div>
            <h3 style="font-size: 1.1rem; margin-bottom: 0.35rem;">4. Eksplorasi Nilai x & y</h3>
            <p style="font-size: 0.85rem; flex-grow: 1; margin-bottom: 0.5rem;">Geser slider untuk menemukan pasangan nilai yang memenuhi kedua persamaan sekaligus.</p>
            <span style="font-weight: 700; color: #9C27B0; font-size: 0.82rem;">Mulai Eksplorasi →</span>
          </a>

          <!-- Tahap 5: Laboratorium Eliminasi -->
          <a href="#/eliminasi" class="card card-hover" style="border-top: 4px solid #E5484D; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 1.8rem;">🔬</span>
              ${stages.includes('eliminasi') ? '<span class="badge badge-success">✓ Selesai</span>' : '<span class="badge badge-info">Tahap 5</span>'}
            </div>
            <h3 style="font-size: 1.1rem; margin-bottom: 0.35rem;">5. Lab Eliminasi</h3>
            <p style="font-size: 0.85rem; flex-grow: 1; margin-bottom: 0.5rem;">Pelajari langkah menyamakan koefisien dan melihat animasi suku aljabar saling menghapus secara sistematis.</p>
            <span style="font-weight: 700; color: #E5484D; font-size: 0.82rem;">Masuk Laboratorium →</span>
          </a>

          <!-- Tahap 6: Tantangan / Misi -->
          <a href="#/tantangan" class="card card-hover" style="border-top: 4px solid var(--color-accent-yellow); display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 1.8rem;">⭐</span>
              ${stages.includes('tantangan') ? '<span class="badge badge-success">✓ Selesai</span>' : '<span class="badge badge-warning">Tahap 6</span>'}
            </div>
            <h3 style="font-size: 1.1rem; margin-bottom: 0.35rem;">6. Tantangan Misi</h3>
            <p style="font-size: 0.85rem; flex-grow: 1; margin-bottom: 0.5rem;">Uji kemampuanmu memecahkan 5 misi bertingkat dari mudah hingga sulit dengan petunjuk konsep cerdas.</p>
            <span style="font-weight: 700; color: #854D0E; font-size: 0.82rem;">Mulai Misi →</span>
          </a>

          <!-- Tahap 7: LKPD Digital -->
          <a href="#/lkpd" class="card card-hover" style="border-top: 4px solid #2E9E6B; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 1.8rem;">📝</span>
              ${stages.includes('lkpd') ? '<span class="badge badge-success">✓ Terkirim</span>' : '<span class="badge badge-info">Tahap 7</span>'}
            </div>
            <h3 style="font-size: 1.1rem; margin-bottom: 0.35rem;">7. LKPD Digital</h3>
            <p style="font-size: 0.85rem; flex-grow: 1; margin-bottom: 0.5rem;">Isi lembar kerja siswa terintegrasi data eksplorasi, tulis refleksi, simpan draf, dan kirimkan ke gurumu.</p>
            <span style="font-weight: 700; color: #2E9E6B; font-size: 0.82rem;">Buka LKPD →</span>
          </a>

          <!-- Tahap 8: Tentang -->
          <a href="#/tentang" class="card card-hover" style="border-top: 4px solid #718096; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 1.8rem;">💡</span>
              <span class="badge badge-info">Info</span>
            </div>
            <h3 style="font-size: 1.1rem; margin-bottom: 0.35rem;">8. Tentang SPLASH</h3>
            <p style="font-size: 0.85rem; flex-grow: 1; margin-bottom: 0.5rem;">Informasi pengembang media, capaian pembelajaran fase D kurikulum merdeka, dan petunjuk penggunaan.</p>
            <span style="font-weight: 700; color: #718096; font-size: 0.82rem;">Pelajari Lebih Lanjut →</span>
          </a>

        </div>
      </div>

    </div>
  `;
}
