/**
 * Router Berbasis Hash (#/...) untuk SPLASH
 * Mengatur rute terlindungi, navigasi peran siswa/guru, dan pembaruan antarmuka.
 */

import { appState } from './state.js';
import { showToast } from './utils/dom-helpers.js';

// Import Views Siswa & Auth
import { renderAuthView } from './views/auth-view.js';
import { renderHomeView } from './views/student/home-view.js';
import { renderMateriView } from './views/student/materi-view.js';
import { renderKontekstualView } from './views/student/kontekstual-view.js';
import { renderSimulasiView } from './views/student/simulasi-view.js';
import { renderEksplorasiView } from './views/student/eksplorasi-view.js';
import { renderEliminasiView } from './views/student/eliminasi-view.js';
import { renderTantanganView } from './views/student/tantangan-view.js';
import { renderLKPDView } from './views/student/lkpd-view.js';
import { renderTentangView } from './views/student/tentang-view.js';

// Import Views Guru
import { renderTeacherDashboardView } from './views/teacher/dashboard-view.js';
import { renderClassView } from './views/teacher/class-view.js';
import { renderTeacherProgressView } from './views/teacher/progress-view.js';
import { renderTeacherLKPDView } from './views/teacher/lkpd-review-view.js';
import { renderTeacherMissionsView } from './views/teacher/missions-admin-view.js';
import { renderTeacherGuideView } from './views/teacher/guide-view.js';

// Pemetaan Rute ke Komponen
const routes = {
  // Autentikasi
  '#/login': { view: renderAuthView, authRequired: false, title: 'Masuk / Daftar Akun' },
  
  // Rute Pembelajaran Siswa
  '#/beranda': { view: renderHomeView, authRequired: true, studentOnly: false, title: 'Beranda Pembelajaran' },
  '#/materi': { view: renderMateriView, authRequired: true, studentOnly: false, title: 'Materi SPLDV' },
  '#/kontekstual': { view: renderKontekstualView, authRequired: true, studentOnly: false, title: 'Masalah Kontekstual' },
  '#/simulasi': { view: renderSimulasiView, authRequired: true, studentOnly: false, title: 'Simulasi Dua Timbangan' },
  '#/tantangan': { view: renderTantanganView, authRequired: true, studentOnly: false, title: 'Tantangan Misi' },
  '#/lkpd': { view: renderLKPDView, authRequired: true, studentOnly: false, title: 'LKPD Digital & Refleksi' },
  '#/tentang': { view: renderTentangView, authRequired: false, studentOnly: false, title: 'Tentang SPLASH' },

  // Rute Dashboard Guru
  '#/guru/dashboard': { view: renderTeacherDashboardView, authRequired: true, teacherOnly: true, title: 'Dashboard Fasilitator Guru' },
  '#/guru/kelas': { view: renderClassView, authRequired: true, teacherOnly: true, title: 'Manajemen Kelas & Siswa' },
  '#/guru/progres': { view: renderTeacherProgressView, authRequired: true, teacherOnly: true, title: 'Pemantauan Progres Siswa' },
  '#/guru/lkpd': { view: renderTeacherLKPDView, authRequired: true, teacherOnly: true, title: 'Pemeriksaan & Nilai LKPD' },
  '#/guru/misi': { view: renderTeacherMissionsView, authRequired: true, teacherOnly: true, title: 'Bank Soal Misi SPLDV' },
  '#/guru/panduan': { view: renderTeacherGuideView, authRequired: true, teacherOnly: true, title: 'Panduan Fasilitator Guru' }
};

export class Router {
  constructor(contentContainerId) {
    this.container = document.getElementById(contentContainerId);
    this.currentHash = '';
    window.addEventListener('hashchange', () => this.handleRouting());
  }

  init() {
    this.handleRouting();
  }

  handleRouting() {
    let hash = window.location.hash || '#/login';
    const user = appState.getUser();

    // Default redirect jika user baru buka root URL tanpa hash
    if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
      hash = user ? (user.role === 'guru' ? '#/guru/dashboard' : '#/beranda') : '#/login';
      window.location.hash = hash;
      return;
    }

    // Redirect rute yang dihapus ke simulasi
    if (hash === '#/eksplorasi' || hash === '#/eliminasi') {
      window.location.hash = '#/simulasi';
      return;
    }

    const route = routes[hash] || routes['#/beranda'];

    // Route Guard 1: Cek Autentikasi
    if (route.authRequired && !user) {
      window.location.hash = '#/login';
      return;
    }

    // Jika sudah login dan mencoba ke halaman login, arahkan ke beranda atau dashboard guru
    if (hash === '#/login' && user) {
      window.location.hash = user.role === 'guru' ? '#/guru/dashboard' : '#/beranda';
      return;
    }

    // Route Guard 2: Cek Hak Akses Guru
    if (route.teacherOnly && user?.role !== 'guru') {
      showToast('Halaman ini khusus untuk Fasilitator Guru.', 'error');
      window.location.hash = '#/beranda';
      return;
    }

    this.currentHash = hash;

    // Perbarui judul halaman di browser
    document.title = `${route.title || 'Belajar SPLDV'} – SPLASH`;

    // Render View ke container
    if (this.container && route.view) {
      this.container.innerHTML = '';
      window.scrollTo(0, 0);
      route.view(this.container);
    }

    // Notifikasi aplikasi bahwa rute berubah
    window.dispatchEvent(new CustomEvent('app:route-changed', { detail: { hash, route, user } }));
  }

  getCurrentHash() {
    return this.currentHash;
  }
}
