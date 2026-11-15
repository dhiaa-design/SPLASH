/**
 * Tentang View: Informasi Media Pembelajaran SPLASH & Capaian Kurikulum Merdeka
 */

export function renderTentangView(container) {
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 900px; margin: 0 auto;">
      
      <!-- Header -->
      <div style="display: flex; align-items: center; gap: 1rem;">
        <img src="assets/images/logo.svg" alt="Logo SPLASH" style="width: 64px; height: 64px;">
        <div>
          <h1 style="font-size: 2.2rem; color: var(--color-primary-dark); line-height: 1.1;">
            SPLASH
          </h1>
          <p style="font-size: 1rem; color: var(--color-primary); font-weight: 700; margin: 0;">
            Sistem Persamaan Linear Asyik dan Seru
          </p>
        </div>
      </div>

      <!-- Deskripsi Media -->
      <div class="card card-accent-blue" style="border: 2px solid var(--color-primary-border); padding: 1.75rem;">
        <h2 style="font-size: 1.3rem; color: var(--color-primary-dark); margin-bottom: 0.5rem;">Tentang Media SPLASH</h2>
        <p style="font-size: 1rem; line-height: 1.6; margin-bottom: 0;">
          <strong>SPLASH</strong> adalah media pembelajaran interaktif berbasis web yang dirancang khusus untuk memfasilitasi pemahaman konsep <strong>Sistem Persamaan Linear Dua Variabel (SPLDV)</strong> bagi peserta didik kelas VIII dan IX SMP. Dengan mengombinasikan representasi visual konkret (timbangan dua lengan dan balok aljabar), pemodelan masalah kontekstual kehidupan nyata, serta eksplorasi simultan, SPLASH menjembatani pemikiran konkret menuju abstraksi aljabar secara menyenangkan dan bermakna.
        </p>
      </div>

      <!-- Capaian Pembelajaran (Fase D Kurikulum Merdeka) -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><span>🎯</span> Capaian Pembelajaran Matematika (Fase D)</h3>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.95rem;">
          <div>
            <strong>Elemen Aljabar:</strong>
            <p style="margin-top: 0.25rem;">
              Peserta didik dapat menyelesaikan sistem persamaan linear dua variabel melalui beberapa cara untuk menyelesaikan masalah nyata di lingkungan sekitar.
            </p>
          </div>

          <div>
            <strong>Tujuan Pembelajaran:</strong>
            <ul style="padding-left: 1.25rem; line-height: 1.6;">
              <li>Mengidentifikasi persamaan linear dua variabel dan sistem persamaan linear dua variabel (SPLDV).</li>
              <li>Membuat model matematika dari permasalahan kontekstual sehari-hari ke dalam bentuk SPLDV.</li>
              <li>Menemukan penyelesaian SPLDV menggunakan metode grafik/timbangan konkret, eliminasi, dan substitusi.</li>
              <li>Mengembangkan kemampuan bernalar kritis dan reflektif dalam menentukan nilai variabel simultan.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Panduan Peran Pengguna -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
        
        <div class="card" style="border-top: 4px solid var(--color-primary);">
          <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🎒</span> Peran Siswa
          </h3>
          <p style="font-size: 0.9rem; line-height: 1.6;">
            Siswa mengeksplorasi materi secara mandiri atau berkelompok, memanipulasi balok timbangan, menguji nilai x dan y, menyelesaikan misi bertingkat, serta mengisi dan mengirimkan LKPD Digital.
          </p>
        </div>

        <div class="card" style="border-top: 4px solid var(--color-accent-yellow);">
          <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>👨‍🏫</span> Peran Guru
          </h3>
          <p style="font-size: 0.9rem; line-height: 1.6;">
            Guru bertindak sebagai fasilitator pembelajaran: membagikan kode kelas, memantau kemajuan belajar siswa lewat dashboard, memeriksa dan menilai LKPD, mengelola bank soal misi, serta memberikan umpan balik bermakna.
          </p>
        </div>

      </div>

      <!-- Referensi Buku Ajar -->
      <div class="card" style="background: #F8FAFC; border: 1px solid var(--color-border); font-size: 0.9rem; color: var(--color-text-muted);">
        <strong style="color: var(--color-primary-dark); font-size: 0.95rem;">📚 Sumber Referensi Bahan Ajar:</strong>
        <p style="margin: 0.35rem 0 0 0; line-height: 1.6;">
          Kristanto, Y. D., Taqiyuddin, M., Yulfiana, E., & Rukmana, I. (2022). <em>Matematika untuk SMP/MTs Kelas IX</em>. Jakarta: Pusat Perbukuan, Badan Standar, Kurikulum, dan Asesmen Pendidikan, Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. Bab I: Sistem Persamaan Linear Dua Variabel (hlm. 2–32).
        </p>
      </div>

    </div>
  `;
}
