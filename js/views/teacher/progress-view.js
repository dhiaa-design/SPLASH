/**
 * Progress View: Pemantauan Progres Siswa & Grafik Batang SVG (Guru)
 * Menampilkan tabel per siswa (tahap selesai, misi selesai, percobaan, terakhir aktif),
 * filter & urut, serta visualisasi grafik batang SVG yang responsif.
 */

import { getStudentsByClass, getProgress } from '../../services/storage.js';
import { appState } from '../../state.js';

export function renderTeacherProgressView(container) {
  const user = appState.getUser();
  const classCode = user?.classCode || 'SPLDV8';

  let searchQuery = '';
  let sortBy = 'progress-desc'; // 'name-asc' | 'progress-desc' | 'progress-asc'

  function render() {
    const students = getStudentsByClass(classCode);
    
    // Gabungkan data siswa dengan progres masing-masing
    const enriched = students.map(s => {
      const prog = getProgress(s.id);
      const completedStages = prog.completedStages || [];
      const missionProgress = prog.missionProgress || {};
      const completedMissionsCount = Object.keys(missionProgress).filter(k => missionProgress[k]).length;
      const percent = Math.min(100, Math.round((completedStages.length / 8) * 100));

      return {
        ...s,
        completedStages,
        stageCount: completedStages.length,
        completedMissionsCount,
        trialsCount: (prog.explorationTrials || []).length,
        lastActive: prog.lastActive || s.createdAt,
        percent
      };
    });

    // Filter
    let filtered = enriched.filter(s => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.username.toLowerCase().includes(q);
    });

    // Sort
    if (sortBy === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'progress-desc') {
      filtered.sort((a, b) => b.percent - a.percent);
    } else if (sortBy === 'progress-asc') {
      filtered.sort((a, b) => a.percent - b.percent);
    }

    // Bangun data SVG Bar Chart
    const barWidth = 45;
    const barGap = 25;
    const chartHeight = 200;
    const svgWidth = Math.max(500, filtered.length * (barWidth + barGap) + 60);

    const barsSVG = filtered.map((s, idx) => {
      const x = 50 + idx * (barWidth + barGap);
      const h = (s.percent / 100) * (chartHeight - 40);
      const y = (chartHeight - 30) - h;

      return `
        <g>
          <!-- Batang -->
          <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="4" fill="url(#barGrad)" />
          <!-- Label Persentase -->
          <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="11" font-weight="bold" fill="var(--color-primary-dark)">
            ${s.percent}%
          </text>
          <!-- Nama Siswa Singkat -->
          <text x="${x + barWidth / 2}" y="${chartHeight - 12}" text-anchor="middle" font-size="10" fill="var(--color-text-muted)">
            ${s.name.split(' ')[0]}
          </text>
        </g>
      `;
    }).join('');

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header -->
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <a href="#/guru/dashboard" style="font-weight: 600; font-size: 0.9rem;">← Dashboard Guru</a>
            <span style="color: var(--color-text-light);">/</span>
            <span style="color: var(--color-primary); font-weight: 700; font-size: 0.9rem;">Progres Pembelajaran</span>
          </div>
          <h1 style="font-size: 2rem;">Analisis Progres Belajar Peserta Didik</h1>
          <p style="font-size: 0.95rem; margin-top: 0.25rem;">
            Pantau ketuntasan 8 tahapan materi dan penyelesaian misi setiap siswa.
          </p>
        </div>

        <!-- Visualisasi Grafik Batang SVG Progres Kelas -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">
              <span>📊</span> Grafik Capaian Progres Siswa (%)
            </h2>
            <span class="badge badge-info">${filtered.length} Siswa Terpantau</span>
          </div>

          <div style="width: 100%; overflow-x: auto; padding: 0.5rem 0;">
            <svg viewBox="0 0 ${svgWidth} ${chartHeight}" style="min-width: ${svgWidth}px; height: ${chartHeight}px;">
              <defs>
                <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#1E6FD9"/>
                  <stop offset="100%" stop-color="#0B3D91"/>
                </linearGradient>
              </defs>
              <!-- Garis Dasar -->
              <line x1="20" y1="${chartHeight - 30}" x2="${svgWidth - 20}" y2="${chartHeight - 30}" stroke="#CBD5E1" stroke-width="1.5" />
              <!-- Batang-batang Progres -->
              ${barsSVG}
            </svg>
          </div>
        </div>

        <!-- Tabel Detail Progres Siswa & Kontrol Filter -->
        <div class="card">
          <div class="card-header" style="flex-wrap: wrap; gap: 1rem;">
            <h2 class="card-title">
              <span>📋</span> Rincian Aktivitas Siswa
            </h2>

            <!-- Kontrol Cari & Sort -->
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <input type="text" id="search-student-input" class="form-control" placeholder="Cari nama siswa..." value="${searchQuery}" style="width: 200px;">
              <select id="sort-student-select" class="form-control" style="width: 180px;">
                <option value="progress-desc" ${sortBy === 'progress-desc' ? 'selected' : ''}>Progres Tertinggi</option>
                <option value="progress-asc" ${sortBy === 'progress-asc' ? 'selected' : ''}>Progres Terendah</option>
                <option value="name-asc" ${sortBy === 'name-asc' ? 'selected' : ''}>Nama (A - Z)</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table-custom">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Lengkap</th>
                  <th>Tahap Selesai</th>
                  <th>Misi Selesai</th>
                  <th>Percobaan Eksplorasi</th>
                  <th>Total Capaian</th>
                  <th>Terakhir Aktif</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.length === 0 ? `
                  <tr>
                    <td colspan="7" style="text-align: center; color: var(--color-text-light); padding: 2rem;">
                      Tidak ditemukan data siswa yang sesuai.
                    </td>
                  </tr>
                ` : filtered.map((s, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>
                      <strong>${s.name}</strong><br>
                      <small style="color: var(--color-text-light);">@${s.username}</small>
                    </td>
                    <td>
                      <span class="badge ${s.stageCount >= 6 ? 'badge-success' : 'badge-info'}">
                        ${s.stageCount} / 8 Tahap
                      </span>
                    </td>
                    <td>
                      <span class="badge ${s.completedMissionsCount >= 4 ? 'badge-success' : 'badge-warning'}">
                        ${s.completedMissionsCount} Misi
                      </span>
                    </td>
                    <td>${s.trialsCount} kali coba</td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="progress-track" style="width: 80px; height: 8px; margin-bottom: 0;">
                          <div class="progress-fill" style="width: ${s.percent}%;"></div>
                        </div>
                        <span style="font-weight: 700; font-size: 0.85rem;">${s.percent}%</span>
                      </div>
                    </td>
                    <td style="font-size: 0.85rem; color: var(--color-text-muted);">
                      ${new Date(s.lastActive).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const searchInput = container.querySelector('#search-student-input');
    const sortSelect = container.querySelector('#sort-student-select');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render();
        // Fokuskan kembali input agar mengetik mulus
        const el = container.querySelector('#search-student-input');
        if (el) {
          el.focus();
          el.selectionStart = el.selectionEnd = el.value.length;
        }
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        render();
      });
    }
  }

  render();
}
