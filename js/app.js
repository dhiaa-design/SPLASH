/**
 * Entry Point Utama Aplikasi SPLASH
 * Inisialisasi Storage, Shell UI, Router, dan Event Listener Global
 */

import { initializeStorage, logout, getProgress } from './services/storage.js';
import { appState } from './state.js';
import { Router } from './router.js';
import { openHelpModal, showToast } from './utils/dom-helpers.js';

class App {
  constructor() {
    this.router = null;
    this.sidebarEl = null;
    this.backdropEl = null;
    this.helpContentMap = {
      '#/beranda': {
        title: 'Beranda Pembelajaran',
        html: `
          <p>Selamat datang di <strong>SPLASH</strong>!</p>
          <ul>
            <li>Gunakan kartu tahapan belajar untuk memulai petualangan aljabarmu dari Tahap 1 hingga Tahap 8.</li>
            <li>Progres belajarmu akan tersimpan otomatis dan terpantau pada bar progres di sidebar kiri.</li>
          </ul>
        `
      },
      '#/materi': {
        title: 'Materi SPLDV & Unsur Aljabar',
        html: `
          <p>Pada halaman ini kamu mempelajari konsep dasar SPLDV:</p>
          <ul>
            <li>Klik kartu istilah (Variabel, Koefisien, Konstanta, Suku) untuk membuka penjelasannya.</li>
            <li>Kerjakan kuis cek pemahaman mandiri di bagian bawah untuk menguji pemahaman konsepmu!</li>
          </ul>
        `
      },
      '#/kontekstual': {
        title: 'Masalah Kontekstual',
        html: `
          <p>Pelajari 5 langkah pemecahan masalah kontekstual:</p>
          <ul>
            <li>Tentukan arti variabel x (harga 1 pensil) dan y (harga 1 buku tulis).</li>
            <li>Ketik dua persamaan aljabar dari paket belanja alat tulis.</li>
            <li>Sistem menerima urutan suku berbeda (contoh: <code>y + 2x = 8</code> dianggap sama dengan <code>2x + y = 8</code>).</li>
          </ul>
        `
      },
      '#/simulasi': {
        title: 'Simulasi Dua Timbangan SVG',
        html: `
          <p>Eksplorasi kesetaraan dengan dua timbangan:</p>
          <ul>
            <li><strong>Tarik (drag)</strong> balok x, y, atau angka ke cawan kiri/kanan menggunakan mouse atau sentuhan jari.</li>
            <li>Gunakan tombol operasi kedua ruas (+1, -1, ×2, :2, -y) agar timbangan tetap seimbang.</li>
            <li>Tombol <strong>Undo</strong> membatalkan langkah terakhir, dan <strong>Reset</strong> mengembalikan kondisi awal timbangan.</li>
          </ul>
        `
      },
      '#/tantangan': {
        title: 'Tantangan Misi Bertingkat',
        html: `
          <p>Uji kemampuanmu pada 5 misi nyata:</p>
          <ul>
            <li>Pilih tab Misi 1 sampai Misi 5 dari tingkat mudah hingga sulit.</li>
            <li>Ketik nilai x dan y, lalu periksa jawabanmu.</li>
            <li>Jika kesulitan, klik tombol <em>"Buka Petunjuk"</em> untuk membaca konsep bantuan.</li>
          </ul>
        `
      },
      '#/lkpd': {
        title: 'LKPD Digital & Refleksi',
        html: `
          <p>Dokumentasi hasil pembelajaran:</p>
          <ul>
            <li>Data tabel pengamatan dari menu Eksplorasi telah terisi otomatis.</li>
            <li>Lengkapi uraian langkah eliminasi, jawab 2 pertanyaan refleksi, dan tuliskan kesimpulanmu.</li>
            <li>Kamu bisa menyimpan draf atau langsung mengklik <em>"Kirim LKPD ke Guru"</em>.</li>
            <li>Gunakan tombol <em>"Cetak / Simpan PDF"</em> untuk mencetak berkas LKPD format rapi.</li>
          </ul>
        `
      },
      '#/guru/dashboard': {
        title: 'Dashboard Fasilitator Guru',
        html: `
          <p>Pusat kendali guru:</p>
          <ul>
            <li>Pantau jumlah siswa terdaftar dan rata-rata persentase progres kelas.</li>
            <li>Salin kode kelas untuk dibagikan kepada peserta didik saat mendaftar.</li>
            <li>Gunakan tombol <em>"Pratinjau sebagai Siswa"</em> untuk mencoba materi dari sudut pandang siswa.</li>
          </ul>
        `
      }
    };
  }

  async init() {
    // 1. Inisialisasi Storage Data Awal
    await initializeStorage();

    // 2. Cache Elemen Shell
    this.sidebarEl = document.getElementById('app-sidebar');
    this.backdropEl = document.getElementById('sidebar-backdrop');

    // 3. Setup Shell Event Listeners
    this.bindShellEvents();

    // 4. Inisialisasi Router
    this.router = new Router('main-content');
    this.router.init();

    // 5. Update Shell sesuai State Pengguna
    this.updateShellUI();

    // Sinkronisasi saat state berubah atau rute berganti
    appState.subscribe(() => this.updateShellUI());
    window.addEventListener('app:route-changed', (e) => this.onRouteChanged(e.detail));
  }

  bindShellEvents() {
    // Hamburger Menu Mobile
    const btnHamburger = document.getElementById('btn-hamburger');
    if (btnHamburger) {
      btnHamburger.addEventListener('click', () => {
        this.sidebarEl?.classList.toggle('open');
        this.backdropEl?.classList.toggle('active');
      });
    }

    if (this.backdropEl) {
      this.backdropEl.addEventListener('click', () => {
        this.sidebarEl?.classList.remove('open');
        this.backdropEl?.classList.remove('active');
      });
    }

    // Tombol Logout di Header
    const btnLogout = document.getElementById('btn-header-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        logout();
        appState.setUser(null);
        appState.setPreviewMode(false);
        showToast('Anda telah berhasil keluar dari akun.', 'info');
        window.location.hash = '#/login';
      });
    }

    // Tombol Bantuan Cepat di Header
    const btnHelp = document.getElementById('btn-header-help');
    if (btnHelp) {
      btnHelp.addEventListener('click', () => {
        const hash = window.location.hash || '#/beranda';
        const helpData = this.helpContentMap[hash] || {
          title: 'Media Pembelajaran SPLASH',
          html: '<p>Gunakan menu navigasi di sebelah kiri untuk berpindah tahapan belajar SPLDV. Jika ada kendala, hubungi gurumu!</p>'
        };
        openHelpModal(helpData.title, helpData.html);
      });
    }
  }

  onRouteChanged({ hash, user }) {
    // Tutup mobile drawer saat rute berpindah
    this.sidebarEl?.classList.remove('open');
    this.backdropEl?.classList.remove('active');

    // Tandai menu sidebar aktif
    document.querySelectorAll('.nav-item-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    this.updateShellUI();
  }

  updateShellUI() {
    const user = appState.getUser();
    const currentHash = window.location.hash || '#/login';
    const isLoginPage = currentHash === '#/login';

    const headerEl = document.querySelector('.app-header');
    const sidebarEl = document.querySelector('.app-sidebar');
    const userProfileBox = document.getElementById('header-user-profile');
    const userNameEl = document.getElementById('header-user-name');
    const userRoleEl = document.getElementById('header-user-role');
    const btnLogout = document.getElementById('btn-header-logout');
    const btnHelp = document.getElementById('btn-header-help');

    // Sembunyikan sidebar dan navigasi tertentu di halaman login
    if (isLoginPage || !user) {
      if (sidebarEl) sidebarEl.style.display = 'none';
      if (userProfileBox) userProfileBox.classList.add('hidden');
      if (btnLogout) btnLogout.classList.add('hidden');
      if (btnHelp) btnHelp.classList.add('hidden');
    } else {
      if (sidebarEl) sidebarEl.style.display = 'flex';
      if (userProfileBox) userProfileBox.classList.remove('hidden');
      if (btnLogout) btnLogout.classList.remove('hidden');
      if (btnHelp) btnHelp.classList.remove('hidden');

      if (userNameEl) userNameEl.textContent = user.name;
      if (userRoleEl) {
        userRoleEl.textContent = user.role === 'guru' ? '👨‍🏫 Guru' : '🎒 Siswa';
        userRoleEl.className = `badge ${user.role === 'guru' ? 'badge-role-guru' : 'badge-role-siswa'}`;
      }

      this.renderSidebarMenu(user);
      this.updateStudentProgressBar(user);
    }
  }

  renderSidebarMenu(user) {
    const menuContainer = document.getElementById('sidebar-menu-list');
    if (!menuContainer) return;

    const isTeacher = user.role === 'guru';
    const currentHash = window.location.hash;

    if (isTeacher && !appState.previewAsStudent) {
      // Menu Guru
      menuContainer.innerHTML = `
        <li>
          <a href="#/guru/dashboard" class="nav-item-link ${currentHash === '#/guru/dashboard' ? 'active' : ''}">
            <span class="nav-icon">📊</span>
            <span>Ringkasan Dashboard</span>
          </a>
        </li>
        <li>
          <a href="#/guru/kelas" class="nav-item-link ${currentHash === '#/guru/kelas' ? 'active' : ''}">
            <span class="nav-icon">👥</span>
            <span>Kelas & Siswa</span>
          </a>
        </li>
        <li>
          <a href="#/guru/progres" class="nav-item-link ${currentHash === '#/guru/progres' ? 'active' : ''}">
            <span class="nav-icon">📈</span>
            <span>Progres Belajar</span>
          </a>
        </li>
        <li>
          <a href="#/guru/lkpd" class="nav-item-link ${currentHash === '#/guru/lkpd' ? 'active' : ''}">
            <span class="nav-icon">📝</span>
            <span>Review LKPD</span>
          </a>
        </li>
        <li>
          <a href="#/guru/misi" class="nav-item-link ${currentHash === '#/guru/misi' ? 'active' : ''}">
            <span class="nav-icon">🗂️</span>
            <span>Bank Soal Misi</span>
          </a>
        </li>
        <li>
          <a href="#/guru/panduan" class="nav-item-link ${currentHash === '#/guru/panduan' ? 'active' : ''}">
            <span class="nav-icon">📖</span>
            <span>Panduan Fasilitator</span>
          </a>
        </li>
        <li style="margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 0.75rem;">
          <a href="#/beranda" class="nav-item-link" id="link-preview-mode" style="color: var(--color-accent-yellow);">
            <span class="nav-icon">👀</span>
            <span>Pratinjau Siswa</span>
          </a>
        </li>
      `;
    } else {
      // Menu Siswa (Atau Guru dalam Mode Pratinjau Siswa)
      const prog = getProgress(user.id);
      const completed = prog.completedStages || [];

      menuContainer.innerHTML = `
        ${appState.previewAsStudent ? `
          <li style="margin-bottom: 0.5rem;">
            <button class="btn btn-sm btn-warning" id="btn-exit-preview" style="width: 100%; font-size: 0.8rem;">
              ✕ Keluar Mode Pratinjau
            </button>
          </li>
        ` : ''}
        <li>
          <a href="#/beranda" class="nav-item-link ${currentHash === '#/beranda' ? 'active' : ''}">
            <span class="nav-icon">🏠</span>
            <span>Beranda</span>
          </a>
        </li>
        <li>
          <a href="#/materi" class="nav-item-link ${currentHash === '#/materi' ? 'active' : ''}">
            <span class="nav-icon">📖</span>
            <span>1. Materi SPLDV</span>
            ${completed.includes('materi') ? '<span class="nav-badge-done">✓</span>' : ''}
          </a>
        </li>
        <li>
          <a href="#/kontekstual" class="nav-item-link ${currentHash === '#/kontekstual' ? 'active' : ''}">
            <span class="nav-icon">✏️</span>
            <span>2. Masalah Kontekstual</span>
            ${completed.includes('kontekstual') ? '<span class="nav-badge-done">✓</span>' : ''}
          </a>
        </li>
        <li>
          <a href="#/simulasi" class="nav-item-link ${currentHash === '#/simulasi' ? 'active' : ''}">
            <span class="nav-icon">⚖️</span>
            <span>3. Simulasi Timbangan</span>
            ${completed.includes('simulasi') ? '<span class="nav-badge-done">✓</span>' : ''}
          </a>
        </li>
        <li>
          <a href="#/tantangan" class="nav-item-link ${currentHash === '#/tantangan' ? 'active' : ''}">
            <span class="nav-icon">⭐</span>
            <span>4. Tantangan Misi</span>
            ${completed.includes('tantangan') ? '<span class="nav-badge-done">✓</span>' : ''}
          </a>
        </li>
        <li>
          <a href="#/lkpd" class="nav-item-link ${currentHash === '#/lkpd' ? 'active' : ''}">
            <span class="nav-icon">📝</span>
            <span>5. LKPD & Refleksi</span>
            ${completed.includes('lkpd') ? '<span class="nav-badge-done">✓</span>' : ''}
          </a>
        </li>
        <li>
          <a href="#/tentang" class="nav-item-link ${currentHash === '#/tentang' ? 'active' : ''}">
            <span class="nav-icon">💡</span>
            <span>6. Tentang SPLASH</span>
          </a>
        </li>
      `;

      // Event keluar mode pratinjau
      const btnExit = menuContainer.querySelector('#btn-exit-preview');
      if (btnExit) {
        btnExit.addEventListener('click', () => {
          appState.setPreviewMode(false);
          window.location.hash = '#/guru/dashboard';
        });
      }
    }
  }

  updateStudentProgressBar(user) {
    const cardEl = document.getElementById('sidebar-progress-card');
    const fillEl = document.getElementById('sidebar-progress-fill');
    const textEl = document.getElementById('sidebar-progress-text');
    const subtextEl = document.getElementById('sidebar-progress-subtext');

    if (!cardEl || !fillEl) return;

    if (user.role === 'guru' && !appState.previewAsStudent) {
      cardEl.style.display = 'none';
      return;
    }

    cardEl.style.display = 'block';
    const prog = getProgress(user.id);
    const validStages = ['materi', 'kontekstual', 'simulasi', 'tantangan', 'lkpd'];
    const completedStages = (prog.completedStages || []).filter(s => validStages.includes(s));
    const totalStages = validStages.length;
    const percent = Math.min(100, Math.round((completedStages.length / totalStages) * 100));

    fillEl.style.width = `${percent}%`;
    if (textEl) textEl.textContent = `${percent}%`;
    if (subtextEl) subtextEl.textContent = `${completedStages.length} dari ${totalStages} Tahap Selesai`;
  }
}

// Jalankan aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
