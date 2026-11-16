/**
 * Storage Service untuk SPLASH
 * -------------------------------------------------------------
 * SATU-SATUNYA modul yang mengakses localStorage.
 * Halaman atau modul lain DILARANG memanggil localStorage langsung!
 * Ini memudahkan migrasi masa depan ke Firebase atau Supabase.
 */

import { hashPassword, verifyPassword } from './crypto.js';
import { INITIAL_CLASS, INITIAL_MISSIONS } from './seed-data.js';

// Kunci penyimpanan dalam localStorage
const KEYS = {
  USERS: 'splash_users',
  CLASSES: 'splash_classes',
  PROGRESS: 'splash_progress',
  LKPD: 'splash_lkpd',
  MISSIONS: 'splash_missions',
  CURRENT_USER: 'splash_current_user',
  INIT_FLAG: 'splash_initialized_v1'
};

/* ==========================================================================
   Helper Internal Storage
   ========================================================================== */
function getLocalItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Gagal membaca ${key} dari localStorage:`, error);
    return defaultValue;
  }
}

function setLocalItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Gagal menyimpan ${key} ke localStorage:`, error);
    return false;
  }
}

/* ==========================================================================
   Inisialisasi & Seed Data Otomatis
   ========================================================================== */
export async function initializeStorage() {
  const isInitialized = getLocalItem(KEYS.INIT_FLAG, false);
  
  if (!isInitialized) {
    console.log('Menginisialisasi data awal SPLASH...');

    // Buat Hash Password Default
    const guruPassHash = await hashPassword('guru123');
    const siswaPassHash = await hashPassword('siswa123');

    // 1. Akun Awal: 1 Guru & 3 Siswa
    const initialUsers = [
      {
        id: 'user-guru-1',
        username: 'guru',
        passwordHash: guruPassHash,
        name: 'Budi Santoso, S.Pd.',
        role: 'guru',
        classCode: 'SPLDV8',
        className: 'VIII-A',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-siswa-1',
        username: 'siswa1',
        passwordHash: siswaPassHash,
        name: 'Andi Pratama',
        role: 'siswa',
        classCode: 'SPLDV8',
        className: 'VIII-A',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-siswa-2',
        username: 'siswa2',
        passwordHash: siswaPassHash,
        name: 'Citra Dewi',
        role: 'siswa',
        classCode: 'SPLDV8',
        className: 'VIII-A',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-siswa-3',
        username: 'siswa3',
        passwordHash: siswaPassHash,
        name: 'Doni Saputra',
        role: 'siswa',
        classCode: 'SPLDV8',
        className: 'VIII-A',
        createdAt: new Date().toISOString()
      }
    ];

    // 2. Kelas Awal
    const initialClasses = [
      {
        code: INITIAL_CLASS.code,
        name: INITIAL_CLASS.name,
        teacherId: 'user-guru-1',
        createdAt: new Date().toISOString()
      }
    ];

    // 3. Progres Awal Siswa Demo
    const initialProgress = {
      'user-siswa-1': {
        userId: 'user-siswa-1',
        completedStages: ['beranda', 'materi', 'kontekstual', 'simulasi', 'eksplorasi', 'eliminasi'],
        currentStage: 'tantangan',
        missionProgress: { 'misi-1': true, 'misi-2': true },
        explorationTrials: [
          { x: 1, y: 5, eq1Val: 7, eq2Val: 11, match1: false, match2: false, isSolution: false, time: '10:00' },
          { x: 3, y: 5, eq1Val: 11, eq2Val: 13, match1: true, match2: true, isSolution: true, time: '10:05' }
        ],
        lastActive: new Date().toISOString()
      },
      'user-siswa-2': {
        userId: 'user-siswa-2',
        completedStages: ['beranda', 'materi', 'kontekstual'],
        currentStage: 'simulasi',
        missionProgress: {},
        explorationTrials: [],
        lastActive: new Date(Date.now() - 3600000).toISOString()
      },
      'user-siswa-3': {
        userId: 'user-siswa-3',
        completedStages: ['beranda'],
        currentStage: 'materi',
        missionProgress: {},
        explorationTrials: [],
        lastActive: new Date(Date.now() - 7200000).toISOString()
      }
    };

    // 4. LKPD Contoh dari siswa1
    const initialLKPD = [
      {
        id: 'lkpd-siswa1',
        studentId: 'user-siswa-1',
        studentName: 'Andi Pratama',
        classCode: 'SPLDV8',
        explorationData: [
          { x: 1, y: 5, eq1Val: 7, eq2Val: 11, match1: false, match2: false, isSolution: false },
          { x: 3, y: 5, eq1Val: 11, eq2Val: 13, match1: true, match2: true, isSolution: true }
        ],
        eliminationSteps: 'Persamaan 1: 2x + y = 11 dikali 2 => 4x + 2y = 22.\nPersamaan 2: x + 2y = 13.\nDikurangkan: 3x = 9 => x = 3.\nSubstitusi x = 3 ke pers 1: 2(3) + y = 11 => y = 5.',
        reflection1: 'Timbangan membantu saya melihat bahwa kedua ruas harus diperlakukan sama agar kesetaraan terjaga.',
        reflection2: 'Satu pasangan nilai harus memenuhi kedua persamaan agar kedua timbangan seimbang secara bersamaan.',
        conclusion: 'Penyelesaian SPLDV adalah nilai x = 3 dan y = 5 yang memenuhi kedua persamaan 2x+y=11 dan x+2y=13.',
        submittedAt: new Date(Date.now() - 1800000).toISOString(),
        status: 'submitted', // 'draft' | 'submitted' | 'reviewed'
        score: null,
        teacherFeedback: ''
      }
    ];

    setLocalItem(KEYS.USERS, initialUsers);
    setLocalItem(KEYS.CLASSES, initialClasses);
    setLocalItem(KEYS.PROGRESS, initialProgress);
    setLocalItem(KEYS.LKPD, initialLKPD);
    setLocalItem(KEYS.MISSIONS, INITIAL_MISSIONS);
    setLocalItem(KEYS.INIT_FLAG, true);
  }
}

/* ==========================================================================
   Autentikasi & Akun
   ========================================================================== */
export async function login(username, passwordPlain) {
  await initializeStorage();
  const users = getLocalItem(KEYS.USERS, []);
  const cleanUsername = username.trim().toLowerCase();
  
  const user = users.find(u => u.username.toLowerCase() === cleanUsername);
  if (!user) {
    return { success: false, message: 'Nama pengguna tidak ditemukan.' };
  }

  const isValid = await verifyPassword(passwordPlain, user.passwordHash);
  if (!isValid) {
    return { success: false, message: 'Kata sandi tidak sesuai.' };
  }

  // Simpan sesi aktif (tanpa menyimpan hash password di objek sesi)
  const sessionUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    classCode: user.classCode || '',
    className: user.className || ''
  };
  setLocalItem(KEYS.CURRENT_USER, sessionUser);
  return { success: true, user: sessionUser };
}

export function getCurrentUser() {
  return getLocalItem(KEYS.CURRENT_USER, null);
}

export function logout() {
  localStorage.removeItem(KEYS.CURRENT_USER);
  return true;
}

/**
 * Login Siswa Praktis: Cukup Nama dan Kelas (Tanpa Kata Sandi)
 * Jika nama belum terdaftar, otomatis didaftarkan dan langsung masuk.
 */
export async function loginStudentSimple({ name, className, classCode = 'SPLDV8' }) {
  await initializeStorage();
  const users = getLocalItem(KEYS.USERS, []);
  const cleanName = name.trim();
  const cleanClass = (className || 'VIII-A').trim();

  if (!cleanName) {
    return { success: false, message: 'Silakan masukkan nama lengkapmu.' };
  }

  // Cari apakah siswa dengan nama ini sudah ada di kelas tersebut
  let user = users.find(u => 
    u.role === 'siswa' && 
    (u.name.toLowerCase() === cleanName.toLowerCase() || u.username.toLowerCase() === cleanName.toLowerCase().replace(/\s+/g, ''))
  );

  if (!user) {
    // Daftarkan siswa baru secara otomatis
    const autoUsername = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || ('siswa' + Date.now().toString().slice(-4));
    user = {
      id: 'user-siswa-' + Date.now(),
      username: autoUsername,
      passwordHash: '',
      name: cleanName,
      role: 'siswa',
      classCode: classCode.toUpperCase(),
      className: cleanClass,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    setLocalItem(KEYS.USERS, users);
  } else {
    // Perbarui nama kelas jika siswa mengganti pilihan kelas
    if (cleanClass && user.className !== cleanClass) {
      user.className = cleanClass;
      setLocalItem(KEYS.USERS, users);
    }
  }

  const sessionUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: 'siswa',
    classCode: user.classCode || 'SPLDV8',
    className: user.className || cleanClass
  };

  setLocalItem(KEYS.CURRENT_USER, sessionUser);
  return { success: true, user: sessionUser };
}

export async function registerUser({ username, passwordPlain, name, role, classCode, className }) {
  await initializeStorage();
  const users = getLocalItem(KEYS.USERS, []);
  const cleanUsername = username.trim().toLowerCase();

  // Validasi unik
  if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
    return { success: false, message: 'Nama pengguna sudah terdaftar, silakan pilih nama lain.' };
  }

  // Jika siswa, pastikan kode kelas valid
  if (role === 'siswa') {
    const classes = getLocalItem(KEYS.CLASSES, []);
    const targetClass = classes.find(c => c.code.toUpperCase() === classCode.trim().toUpperCase());
    if (!targetClass) {
      return { success: false, message: 'Kode kelas tidak ditemukan. Minta kode kelas dari gurumu!' };
    }
    className = targetClass.name;
    classCode = targetClass.code;
  }

  // Hash kata sandi
  const passwordHash = await hashPassword(passwordPlain);
  const newUser = {
    id: 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    username: cleanUsername,
    passwordHash,
    name: name.trim(),
    role,
    classCode: classCode ? classCode.trim().toUpperCase() : '',
    className: className || '',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  setLocalItem(KEYS.USERS, users);

  // Jika guru mendaftar dengan membuat kelas baru
  if (role === 'guru' && classCode) {
    const classes = getLocalItem(KEYS.CLASSES, []);
    classes.push({
      code: classCode.trim().toUpperCase(),
      name: className || 'Kelas Matematika',
      teacherId: newUser.id,
      createdAt: new Date().toISOString()
    });
    setLocalItem(KEYS.CLASSES, classes);
  }

  return { success: true, user: newUser };
}

/* ==========================================================================
   Manajemen Kelas & Siswa (Guru)
   ========================================================================== */
export function getStudentsByClass(classCode) {
  const users = getLocalItem(KEYS.USERS, []);
  return users
    .filter(u => u.role === 'siswa' && u.classCode?.toUpperCase() === classCode?.toUpperCase())
    .map(({ passwordHash, ...safeUser }) => safeUser);
}

export async function resetStudentPassword(studentId, newPasswordPlain) {
  const users = getLocalItem(KEYS.USERS, []);
  const user = users.find(u => u.id === studentId);
  if (!user) return { success: false, message: 'Siswa tidak ditemukan.' };

  user.passwordHash = await hashPassword(newPasswordPlain);
  setLocalItem(KEYS.USERS, users);
  return { success: true, message: 'Kata sandi berhasil direset.' };
}

export function deleteStudent(studentId) {
  let users = getLocalItem(KEYS.USERS, []);
  users = users.filter(u => u.id !== studentId);
  setLocalItem(KEYS.USERS, users);

  // Bersihkan data progres & LKPD siswa terkait
  const progressMap = getLocalItem(KEYS.PROGRESS, {});
  delete progressMap[studentId];
  setLocalItem(KEYS.PROGRESS, progressMap);

  let lkpdList = getLocalItem(KEYS.LKPD, []);
  lkpdList = lkpdList.filter(l => l.studentId !== studentId);
  setLocalItem(KEYS.LKPD, lkpdList);

  return { success: true, message: 'Siswa dan datanya berhasil dihapus.' };
}

export function getClasses() {
  return getLocalItem(KEYS.CLASSES, []);
}

/* ==========================================================================
   Progres Belajar Siswa
   ========================================================================== */
export function getProgress(studentId) {
  const progressMap = getLocalItem(KEYS.PROGRESS, {});
  return progressMap[studentId] || {
    userId: studentId,
    completedStages: [],
    currentStage: 'beranda',
    missionProgress: {},
    explorationTrials: [],
    lastActive: new Date().toISOString()
  };
}

export function saveProgress(studentId, patch) {
  const progressMap = getLocalItem(KEYS.PROGRESS, {});
  const current = progressMap[studentId] || {
    userId: studentId,
    completedStages: [],
    currentStage: 'beranda',
    missionProgress: {},
    explorationTrials: [],
    lastActive: new Date().toISOString()
  };

  const updated = {
    ...current,
    ...patch,
    completedStages: Array.from(new Set([...(current.completedStages || []), ...(patch.completedStages || [])])),
    missionProgress: { ...(current.missionProgress || {}), ...(patch.missionProgress || {}) },
    explorationTrials: patch.explorationTrials ? patch.explorationTrials : (current.explorationTrials || []),
    lastActive: new Date().toISOString()
  };

  progressMap[studentId] = updated;
  setLocalItem(KEYS.PROGRESS, progressMap);
  return updated;
}

/* ==========================================================================
   LKPD Digital (Siswa & Guru)
   ========================================================================== */
export function getLKPD(studentId) {
  const list = getLocalItem(KEYS.LKPD, []);
  return list.find(l => l.studentId === studentId) || null;
}

export function saveLKPD(lkpdData) {
  let list = getLocalItem(KEYS.LKPD, []);
  const index = list.findIndex(l => l.studentId === lkpdData.studentId);
  
  const lkpdRecord = {
    id: lkpdData.id || ('lkpd-' + lkpdData.studentId),
    ...lkpdData,
    updatedAt: new Date().toISOString()
  };

  if (index >= 0) {
    list[index] = { ...list[index], ...lkpdRecord };
  } else {
    list.push(lkpdRecord);
  }

  setLocalItem(KEYS.LKPD, list);
  return lkpdRecord;
}

export function getLKPDByClass(classCode) {
  const list = getLocalItem(KEYS.LKPD, []);
  return list.filter(l => l.classCode?.toUpperCase() === classCode?.toUpperCase());
}

export function gradeLKPD(lkpdId, score, feedback) {
  let list = getLocalItem(KEYS.LKPD, []);
  const target = list.find(l => l.id === lkpdId);
  if (!target) return { success: false, message: 'LKPD tidak ditemukan.' };

  target.score = Number(score);
  target.teacherFeedback = feedback || '';
  target.status = 'reviewed';
  target.reviewedAt = new Date().toISOString();

  setLocalItem(KEYS.LKPD, list);
  return { success: true, lkpd: target };
}

/* ==========================================================================
   Bank Soal Misi (Tantangan)
   ========================================================================== */
export function getMissions() {
  return getLocalItem(KEYS.MISSIONS, INITIAL_MISSIONS);
}

export function saveMission(mission) {
  let missions = getLocalItem(KEYS.MISSIONS, INITIAL_MISSIONS);
  if (mission.id) {
    const idx = missions.findIndex(m => m.id === mission.id);
    if (idx >= 0) {
      missions[idx] = { ...missions[idx], ...mission };
    } else {
      missions.push(mission);
    }
  } else {
    const newMission = {
      ...mission,
      id: 'misi-' + Date.now(),
      order: missions.length + 1
    };
    missions.push(newMission);
  }
  setLocalItem(KEYS.MISSIONS, missions);
  return { success: true, missions };
}

export function deleteMission(missionId) {
  let missions = getLocalItem(KEYS.MISSIONS, INITIAL_MISSIONS);
  missions = missions.filter(m => m.id !== missionId);
  setLocalItem(KEYS.MISSIONS, missions);
  return { success: true, missions };
}

/* ==========================================================================
   Statistik & Analitik Guru
   ========================================================================== */
export function getTeacherAnalytics(classCode) {
  const students = getStudentsByClass(classCode);
  const progressMap = getLocalItem(KEYS.PROGRESS, {});
  const lkpdList = getLKPDByClass(classCode);
  const missions = getMissions();

  const totalStudents = students.length;
  let totalStagePercentage = 0;
  const stagesCount = 5; // Materi, Kontekstual, Simulasi, Tantangan, LKPD
  const validStages = ['materi', 'kontekstual', 'simulasi', 'tantangan', 'lkpd'];

  const missionFailureCount = {};
  missions.forEach(m => { missionFailureCount[m.id] = 0; });

  students.forEach(student => {
    const prog = progressMap[student.id];
    const completedCount = (prog?.completedStages || []).filter(s => validStages.includes(s)).length;
    totalStagePercentage += Math.min(100, Math.round((completedCount / stagesCount) * 100));
  });

  const avgProgress = totalStudents > 0 ? Math.round(totalStagePercentage / totalStudents) : 0;
  const submittedLKPD = lkpdList.filter(l => l.status === 'submitted' || l.status === 'reviewed').length;
  const reviewedLKPD = lkpdList.filter(l => l.status === 'reviewed').length;

  return {
    totalStudents,
    avgProgress,
    submittedLKPD,
    reviewedLKPD,
    totalMissions: missions.length
  };
}
