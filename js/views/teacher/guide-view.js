/**
 * Guide View: Panduan Fasilitator Guru & Bank Pertanyaan Pemantik Diskusi
 */

export function renderTeacherGuideView(container) {
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 900px; margin: 0 auto;">
      
      <!-- Header -->
      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
          <a href="#/guru/dashboard" style="font-weight: 600; font-size: 0.9rem;">← Dashboard Guru</a>
          <span style="color: var(--color-text-light);">/</span>
          <span style="color: var(--color-primary); font-weight: 700; font-size: 0.9rem;">Panduan Fasilitator</span>
        </div>
        <h1 style="font-size: 2rem;">Panduan Guru & Fasilitasi Pembelajaran SPLASH</h1>
        <p style="font-size: 1.05rem; margin-top: 0.25rem;">
          Strategi penerapan media pembelajaran interaktif di kelas VIII SMP berbasis Kurikulum Merdeka.
        </p>
      </div>

      <!-- Bagian 1: Peran Guru sebagai Fasilitator -->
      <div class="card card-accent-blue" style="border-left: 6px solid var(--color-primary); padding: 1.5rem;">
        <h2 style="font-size: 1.3rem; color: var(--color-primary-dark); margin-bottom: 0.5rem;">
          👨‍🏫 Peran Guru sebagai Fasilitator
        </h2>
        <p style="font-size: 1rem; line-height: 1.6; margin-bottom: 0;">
          Dalam pembelajaran dengan SPLASH, guru tidak berperan sebagai sumber jawaban tunggal, melainkan sebagai <strong>fasilitator penemuan konsep</strong>. Ajak siswa memanipulasi balok, mengamati ketidakseimbangan saat hanya satu ruas yang diubah, dan merumuskan sendiri prinsip kesetaraan aljabar.
        </p>
      </div>

      <!-- Bagian 2: Alur Skenario Pembelajaran di Kelas -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title"><span>⏱️</span> Skenario Alur Pembelajaran (2 x 40 Menit)</h2>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div style="background: #F8FAFC; border-left: 4px solid #1E6FD9; padding: 1rem; border-radius: var(--radius-sm);">
            <strong>1. Apersepsi & Orientasi Masalah (15 Menit):</strong>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.92rem;">
              Buka menu <em>Masalah Kontekstual</em>. Tampilkan skenario kontekstual alat tulis (pensil dan buku tulis). Diskusikan mengapa kita memerlukan dua persamaan untuk mencari dua harga yang belum diketahui.
            </p>
          </div>

          <div style="background: #F8FAFC; border-left: 4px solid #00C9FF; padding: 1rem; border-radius: var(--radius-sm);">
            <strong>2. Eksplorasi Konkret dengan Timbangan (25 Menit):</strong>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.92rem;">
              Siswa membuka menu <em>Simulasi Dua Timbangan</em> secara berpasangan. Amati bagaimana timbangan miring saat balok hanya ditambah pada satu sisi, serta pahami prinsip kesetaraan aljabar kedua ruas.
            </p>
          </div>

          <div style="background: #F8FAFC; border-left: 4px solid #F59E0B; padding: 1rem; border-radius: var(--radius-sm);">
            <strong>3. Tantangan Misi Bertingkat (20 Menit):</strong>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.92rem;">
              Siswa membuka <em>Tantangan Misi</em> untuk memecahkan soal-soal SPLDV bertingkat dari mudah hingga menantang dengan bantuan petunjuk konsep.
            </p>
          </div>

          <div style="background: #F8FAFC; border-left: 4px solid #2E9E6B; padding: 1rem; border-radius: var(--radius-sm);">
            <strong>4. Refleksi, Pengisian LKPD, & Penilaian (20 Menit):</strong>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.92rem;">
              Siswa melengkapi refleksi di menu <em>LKPD Digital</em> dan mengirimkannya. Guru membuka dashboard untuk meninjau LKPD dan memberikan penilaian.
            </p>
          </div>
        </div>
      </div>

      <!-- Bagian 3: Pertanyaan Pemantik Diskusi per Tahap -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title"><span>💬</span> Bank Pertanyaan Pemantik Diskusi Siswa</h2>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <strong style="color: var(--color-primary-dark);">Tahap 1 & 2: Pemodelan Kontekstual</strong>
            <ul style="padding-left: 1.25rem; font-size: 0.92rem; margin-top: 0.25rem;">
              <li>"Jika kita hanya tahu harga pesanan Andi (2 roti + 1 susu = 11.000), mungkinkah harga roti 4.000 dan susu 3.000? Mungkinkah roti 5.000 dan susu 1.000?"</li>
              <li>"Mengapa satu informasi pesanan saja belum cukup untuk menentukan harga pasti masing-masing barang?"</li>
            </ul>
          </div>

          <div>
            <strong style="color: var(--color-primary-dark);">Tahap 3: Simulasi Dua Timbangan</strong>
            <ul style="padding-left: 1.25rem; font-size: 0.92rem; margin-top: 0.25rem;">
              <li>"Apa yang terjadi pada timbangan jika kita hanya menambahkan beban di cawan sebelah kiri?"</li>
              <li>"Bagaimana aturan aljabar agar sebuah timbangan yang sudah seimbang tetap berada dalam keadaan seimbang?"</li>
            </ul>
          </div>

          <div>
            <strong style="color: var(--color-primary-dark);">Tahap 4: Tantangan Misi Bertingkat</strong>
            <ul style="padding-left: 1.25rem; font-size: 0.92rem; margin-top: 0.25rem;">
              <li>"Bagaimana cara menentukan metode yang paling efisien untuk setiap misi (substitusi atau eliminasi)?"</li>
              <li>"Periksa kembali apakah nilai x dan y memenuhi kedua persamaan secara bersamaan!"</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bagian 4: Catatan Teknis Penyimpanan & Migrasi Cloud -->
      <div class="card" style="border: 2px solid var(--color-border); background: #FAFBFD;">
        <div class="card-header">
          <h3 class="card-title"><span>☁️</span> Catatan Arsitektur Data & Peningkatan ke Cloud</h3>
        </div>
        <p style="font-size: 0.92rem; line-height: 1.6; color: var(--color-text-main);">
          Saat ini aplikasi SPLASH menggunakan <strong>Storage Service (js/services/storage.js)</strong> berbasis penyimpanan lokal peramban (<code>localStorage</code>). Dengan arsitektur satu pintu ini, data tersimpan cepat tanpa build-step.
        </p>
        <p style="font-size: 0.92rem; line-height: 1.6; color: var(--color-text-main); margin-bottom: 0;">
          💡 <strong>Panduan Migrasi Multi-Perangkat (Firebase/Supabase):</strong> Cukup ganti implementasi pemanggilan di dalam berkas <code>js/services/storage.js</code> ke Firebase Firestore atau Supabase REST client. Seluruh view siswa dan guru akan otomatis terhubung ke cloud database secara real-time tanpa perlu mengubah kode antarmuka sedikit pun!
        </p>
      </div>

    </div>
  `;
}
