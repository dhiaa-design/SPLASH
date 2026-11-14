/**
 * Auth View: Login Siswa (Cukup Nama & Kelas) dan Login Guru
 */

import { login, loginStudentSimple, registerUser } from '../services/storage.js';
import { appState } from '../state.js';
import { showToast } from '../utils/dom-helpers.js';

export function renderAuthView(container) {
  let isRegisterMode = false;
  let activeRole = 'siswa'; // 'siswa' atau 'guru'

  function render() {
    container.innerHTML = `
      <div style="min-height: calc(100vh - var(--header-height)); display: flex; align-items: center; justify-content: center; padding: 1.5rem 0.75rem;">
        <div class="card auth-card">
          
          <!-- Panel Kiri: Branding SPLASH & Ilustrasi Edukatif -->
          <div class="auth-panel-left">
            <div>
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
                <img src="assets/images/logo.svg" alt="Logo SPLASH" style="width: 52px; height: 52px; flex-shrink: 0;">
                <div>
                  <h1 style="color: white; font-size: 1.7rem; font-weight: 800; line-height: 1.1;">SPLASH</h1>
                  <span style="color: var(--color-primary-light); font-size: 0.82rem; font-weight: 600;">Media Pembelajaran Matematika SMP</span>
                </div>
              </div>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 1rem; line-height: 1.5; margin-bottom: 1.25rem;">
                <strong>Sistem Persamaan Linear Asyik dan Seru</strong><br>
                Eksplorasi kesetaraan aljabar dua variabel melalui simulasi timbangan interaktif, laboratorium eliminasi, dan petualangan misi kontekstual!
              </p>
              
              <!-- Info Fitur Unggulan -->
              <div style="display: flex; flex-direction: column; gap: 0.65rem; margin-top: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.88rem;">
                  <span style="background: rgba(255,255,255,0.2); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">⚖️</span>
                  <span>Simulasi Timbangan SVG Interaktif</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.88rem;">
                  <span style="background: rgba(255,255,255,0.2); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🔍</span>
                  <span>Eksplorasi Nilai Variabel & LKPD Digital</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.88rem;">
                  <span style="background: rgba(255,255,255,0.2); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">📊</span>
                  <span>Dashboard Fasilitasi & Analitik Guru</span>
                </div>
              </div>
            </div>

            <!-- Petunjuk Masuk -->
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: var(--radius-md); padding: 0.85rem 1rem; margin-top: 1.5rem; font-size: 0.82rem;">
              <div style="font-weight: 700; color: var(--color-accent-yellow); margin-bottom: 0.25rem;">💡 Cara Masuk:</div>
              <div>• <strong>Siswa:</strong> Cukup masukkan Nama dan Kelas (tanpa kata sandi).</div>
              <div>• <strong>Guru:</strong> Masuk dengan <code>guru</code> / <code>guru123</code>.</div>
            </div>
          </div>

          <!-- Panel Kanan: Form Masuk -->
          <div class="auth-panel-right">
            
            <!-- Tab Pilihan Peran: Siswa vs Guru -->
            <div style="display: flex; background: var(--color-primary-lighter); padding: 4px; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
              <button type="button" id="tab-role-siswa" class="btn ${activeRole === 'siswa' ? 'btn-primary' : ''}" style="flex: 1; border-radius: var(--radius-sm); font-size: 0.95rem; font-weight: 700; ${activeRole !== 'siswa' ? 'color: var(--color-text-muted);' : ''}">
                🎒 Sebagai Siswa
              </button>
              <button type="button" id="tab-role-guru" class="btn ${activeRole === 'guru' ? 'btn-primary' : ''}" style="flex: 1; border-radius: var(--radius-sm); font-size: 0.95rem; font-weight: 700; ${activeRole !== 'guru' ? 'color: var(--color-text-muted);' : ''}">
                👨‍🏫 Sebagai Guru
              </button>
            </div>

            ${activeRole === 'siswa' ? `
              <!-- FORM LOGIN KHUSUS SISWA (CUKUP NAMA DAN KELAS) -->
              <div style="margin-bottom: 1.25rem;">
                <h2 style="font-size: 1.5rem; color: var(--color-primary-dark); margin-bottom: 0.25rem;">
                  Selamat Datang, Siswa Hebat! 👋
                </h2>
                <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 0;">
                  Ketik namamu dan pilih kelas untuk langsung mulai belajar.
                </p>
              </div>

              <form id="student-simple-form" autocomplete="off">
                <div class="form-group">
                  <label class="form-label" for="input-student-fullname">Nama Lengkap Kamu:</label>
                  <input type="text" id="input-student-fullname" class="form-control" placeholder="Contoh: Ajeng / Budi Pratama" required autofocus style="font-size: 1.05rem; font-weight: 600;">
                  <small style="color: var(--color-text-light); font-size: 0.8rem;">Ketik namamu untuk melanjutkan atau memulai progres baru.</small>
                </div>

                <div class="form-group" style="margin-top: 1rem;">
                  <label class="form-label" for="select-student-class">Pilih Kelas:</label>
                  <select id="select-student-class" class="form-control" style="font-size: 1rem;">
                    <option value="VIII-A" selected>Kelas VIII-A</option>
                    <option value="VIII-B">Kelas VIII-B</option>
                    <option value="VIII-C">Kelas VIII-C</option>
                    <option value="VIII-D">Kelas VIII-D</option>
                  </select>
                </div>

                <div id="student-error-msg" class="alert alert-danger hidden" style="padding: 0.65rem 1rem; font-size: 0.85rem; margin-top: 0.5rem;"></div>

                <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 1.25rem; font-size: 1.1rem; font-weight: 700;" id="btn-submit-student">
                  🚀 Mulai Belajar Sekarang
                </button>
              </form>
            ` : `
              <!-- FORM LOGIN / DAFTAR KHUSUS GURU -->
              <div style="margin-bottom: 1.25rem;">
                <h2 style="font-size: 1.5rem; color: var(--color-primary-dark); margin-bottom: 0.25rem;">
                  ${isRegisterMode ? 'Daftar Akun Guru' : 'Masuk Fasilitator Guru 👨‍🏫'}
                </h2>
                <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 0;">
                  ${isRegisterMode ? 'Buat kelas baru dan dapatkan kode kelas unik.' : 'Kelola pembelajaran matematika dan tinjau progres siswa.'}
                </p>
              </div>

              <form id="teacher-form" autocomplete="off">
                ${isRegisterMode ? `
                  <div class="form-group">
                    <label class="form-label" for="input-teacher-fullname">Nama Lengkap & Gelar:</label>
                    <input type="text" id="input-teacher-fullname" class="form-control" placeholder="Contoh: Budi Santoso, S.Pd." required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="input-teacher-classname">Nama Kelas yang Diampu:</label>
                    <input type="text" id="input-teacher-classname" class="form-control" placeholder="Contoh: Kelas VIII-B" required>
                  </div>
                ` : ''}

                <div class="form-group">
                  <label class="form-label" for="input-teacher-username">Nama Pengguna (Username):</label>
                  <input type="text" id="input-teacher-username" class="form-control" placeholder="Masukkan username guru (demo: guru)" required>
                </div>

                <div class="form-group">
                  <label class="form-label" for="input-teacher-password">Kata Sandi:</label>
                  <div class="input-password-wrap">
                    <input type="password" id="input-teacher-password" class="form-control" placeholder="Masukkan kata sandi (demo: guru123)" required>
                    <button type="button" class="btn-toggle-password" id="btn-toggle-pwd" aria-label="Tampilkan kata sandi">👁️</button>
                  </div>
                </div>

                <div id="teacher-error-msg" class="alert alert-danger hidden" style="padding: 0.65rem 1rem; font-size: 0.85rem; margin-top: 0.5rem;"></div>

                <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 1rem;" id="btn-submit-teacher">
                  ${isRegisterMode ? 'Daftarkan Akun Guru' : 'Masuk ke Ruang Guru'}
                </button>

                <div style="text-align: center; margin-top: 1.25rem; font-size: 0.88rem;">
                  ${isRegisterMode ? `
                    Sudah memiliki akun guru? <a href="javascript:void(0)" id="toggle-teacher-mode" style="font-weight: 700;">Masuk di sini</a>
                  ` : `
                    Guru baru? <a href="javascript:void(0)" id="toggle-teacher-mode" style="font-weight: 700;">Daftar akun guru baru</a>
                  `}
                </div>
              </form>
            `}

          </div>
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Tab Siswa / Guru
    const btnSiswa = container.querySelector('#tab-role-siswa');
    const btnGuru = container.querySelector('#tab-role-guru');
    if (btnSiswa) {
      btnSiswa.addEventListener('click', () => {
        if (activeRole !== 'siswa') {
          activeRole = 'siswa';
          render();
        }
      });
    }
    if (btnGuru) {
      btnGuru.addEventListener('click', () => {
        if (activeRole !== 'guru') {
          activeRole = 'guru';
          render();
        }
      });
    }

    // Toggle Mode Guru (Login / Register)
    const toggleTeacherLink = container.querySelector('#toggle-teacher-mode');
    if (toggleTeacherLink) {
      toggleTeacherLink.addEventListener('click', () => {
        isRegisterMode = !isRegisterMode;
        render();
      });
    }

    // Submit Form Siswa (Cukup Nama dan Kelas)
    const studentForm = container.querySelector('#student-simple-form');
    const studentErrorBox = container.querySelector('#student-error-msg');

    if (studentForm) {
      studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        studentErrorBox.classList.add('hidden');

        const studentName = container.querySelector('#input-student-fullname')?.value.trim();
        const studentClass = container.querySelector('#select-student-class')?.value || 'VIII-A';

        if (!studentName) {
          studentErrorBox.textContent = 'Silakan ketik nama lengkapmu terlebih dahulu.';
          studentErrorBox.classList.remove('hidden');
          return;
        }

        const loginRes = await loginStudentSimple({
          name: studentName,
          className: studentClass,
          classCode: 'SPLDV8'
        });

        if (!loginRes.success) {
          studentErrorBox.textContent = loginRes.message;
          studentErrorBox.classList.remove('hidden');
          return;
        }

        appState.setUser(loginRes.user);
        showToast(`Selamat datang, ${loginRes.user.name}! Selamat belajar. 🎉`, 'success');
        window.location.hash = '#/beranda';
      });
    }

    // Toggle Password Visibility Guru
    const btnTogglePwd = container.querySelector('#btn-toggle-pwd');
    const inputPwd = container.querySelector('#input-teacher-password');
    if (btnTogglePwd && inputPwd) {
      btnTogglePwd.addEventListener('click', () => {
        const isPassword = inputPwd.type === 'password';
        inputPwd.type = isPassword ? 'text' : 'password';
        btnTogglePwd.textContent = isPassword ? '🙈' : '👁️';
      });
    }

    // Submit Form Guru
    const teacherForm = container.querySelector('#teacher-form');
    const teacherErrorBox = container.querySelector('#teacher-error-msg');

    if (teacherForm) {
      teacherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        teacherErrorBox.classList.add('hidden');

        const username = container.querySelector('#input-teacher-username')?.value.trim();
        const password = inputPwd?.value;

        if (!username || !password) {
          teacherErrorBox.textContent = 'Nama pengguna dan kata sandi wajib diisi.';
          teacherErrorBox.classList.remove('hidden');
          return;
        }

        if (isRegisterMode) {
          const fullname = container.querySelector('#input-teacher-fullname')?.value.trim();
          const classname = container.querySelector('#input-teacher-classname')?.value.trim();
          const classCode = 'SPL' + Math.random().toString(36).substr(2, 3).toUpperCase();

          const regResult = await registerUser({
            username,
            passwordPlain: password,
            name: fullname || username,
            role: 'guru',
            classCode,
            className: classname || 'Kelas VIII'
          });

          if (!regResult.success) {
            teacherErrorBox.textContent = regResult.message;
            teacherErrorBox.classList.remove('hidden');
            return;
          }

          showToast('Akun guru berhasil dibuat! Silakan masuk.', 'success');
          isRegisterMode = false;
          render();
        } else {
          const loginRes = await login(username, password);
          if (!loginRes.success) {
            teacherErrorBox.textContent = loginRes.message;
            teacherErrorBox.classList.remove('hidden');
            return;
          }

          appState.setUser(loginRes.user);
          showToast(`Selamat datang, ${loginRes.user.name}!`, 'success');
          window.location.hash = '#/guru/dashboard';
        }
      });
    }
  }

  render();
}
