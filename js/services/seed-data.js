/**
 * Data Awal (Seed Data) untuk SPLASH
 * Akun demo guru, akun siswa demo, kelas awal, dan bank soal misi bertingkat.
 */

export const INITIAL_CLASS = {
  code: 'SPLDV8',
  name: 'Kelas VIII-A',
  teacherUsername: 'guru'
};

export const INITIAL_MISSIONS = [
  {
    id: 'misi-1',
    title: 'Misi Kontekstual 1: Roti & Susu',
    story: 'Pada paket belanja sarapan, 2 potong roti manis dan 1 kotak susu dihargai Rp11.000. Sementara itu, 1 potong roti manis dan 2 kotak susu dihargai Rp13.000. Tentukan harga 1 roti (x) dan 1 susu (y) dalam ribuan rupiah!',
    difficulty: 'mudah',
    eq1: '2x + y = 11',
    eq2: 'x + 2y = 13',
    solutionX: 3,
    solutionY: 5,
    hint: 'Gunakan metode eliminasi: samakan koefisien y dengan mengalikan persamaan pertama dengan 2, lalu kurangkan!',
    order: 1
  },
  {
    id: 'misi-2',
    title: 'Misi Koperasi: Buku Tulis & Pensil',
    story: 'Koperasi sekolah menjual paket alat tulis: 3 buku tulis dan 2 pensil seharga Rp16.000. Paket lain berisi 1 buku tulis dan 2 pensil seharga Rp8.000. Berapakah harga 1 buku tulis (x) dan 1 pensil (y) dalam ribuan rupiah?',
    difficulty: 'mudah',
    eq1: '3x + 2y = 16',
    eq2: 'x + 2y = 8',
    solutionX: 4,
    solutionY: 2,
    hint: 'Perhatikan bahwa koefisien y pada kedua persamaan sudah sama (2y). Kamu bisa langsung mengurangkan persamaan 1 dengan persamaan 2!',
    order: 2
  },
  {
    id: 'misi-3',
    title: 'Misi Lapangan Futsal: Bola & Rompi',
    story: 'Pengelola lapangan menyiapkan sewa perlengkapan: 2 bola dan 3 paket rompi berharga Rp19.000 (skala ribuan). Paket sewa kedua berupa 3 bola dan 2 paket rompi berharga Rp21.000. Berapakah nilai x (bola) dan y (rompi)?',
    difficulty: 'sedang',
    eq1: '2x + 3y = 19',
    eq2: '3x + 2y = 21',
    solutionX: 5,
    solutionY: 3,
    hint: 'Kalikan persamaan pertama dengan 3 dan persamaan kedua dengan 2 sehingga koefisien x keduanya menjadi 6x, kemudian lakukan eliminasi.',
    order: 3
  },
  {
    id: 'misi-4',
    title: 'Misi Kebun Buah: Mangga & Jeruk',
    story: 'Pak Budi memanen buah di kebun sekolah: berat 4 keranjang mangga ditambah 1 keranjang jeruk adalah 14 kg. Sedangkan 2 keranjang mangga ditambah 3 keranjang jeruk adalah 12 kg. Berapakah berat 1 keranjang mangga (x) dan jeruk (y)?',
    difficulty: 'sedang',
    eq1: '4x + y = 14',
    eq2: '2x + 3y = 12',
    solutionX: 3,
    solutionY: 2,
    hint: 'Kamu bisa mengalikan persamaan kedua dengan 2 agar menjadi 4x + 6y = 24, lalu kurangkan dengan persamaan pertama.',
    order: 4
  },
  {
    id: 'misi-5',
    title: 'Misi Pentas Seni: Tiket Anak & Dewasa',
    story: 'Panitia pensi SMP menjual tiket masuk: 5 tiket anak-anak dan 3 tiket dewasa bernilai Rp34.000. Keluarga lain membeli 2 tiket anak-anak dan 4 tiket dewasa seharga Rp26.000. Tentukan harga 1 tiket anak (x) dan 1 tiket dewasa (y) dalam ribuan rupiah!',
    difficulty: 'sulit',
    eq1: '5x + 3y = 34',
    eq2: '2x + 4y = 26',
    solutionX: 4,
    solutionY: 4.5, // Uji dengan desimal jika ada, atau buat bulat: misal 5x + 3y = 29, 2x + 4y = 26 -> x=2.7. Mari buat bulat:
    solutionY: 5,
    order: 5
  }
];

// Sesuaikan misi 5 agar solusinya bilangan bulat ramah SMP:
// 5x + 3y = 35 dan 2x + 4y = 28 ->
// eq1 * 2: 10x + 6y = 70
// eq2 * 5: 10x + 20y = 140
// 14y = 70 => y = 5, 5x + 15 = 35 => x = 4. Cocok!
INITIAL_MISSIONS[4].eq1 = '5x + 3y = 35';
INITIAL_MISSIONS[4].eq2 = '2x + 4y = 28';
INITIAL_MISSIONS[4].solutionX = 4;
INITIAL_MISSIONS[4].solutionY = 5;
INITIAL_MISSIONS[4].story = 'Panitia pensi SMP menjual tiket: 5 tiket anak-anak dan 3 tiket dewasa seharga Rp35.000. Keluarga lain membeli 2 tiket anak-anak dan 4 tiket dewasa seharga Rp28.000. Berapa harga 1 tiket anak (x) dan 1 tiket dewasa (y) dalam ribuan rupiah?';

export const INITIAL_QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'Dari persamaan 4x + 3y = 18, apakah pasangan berurutan (3, 2) merupakan penyelesaian persamaan tersebut?',
    options: [
      'Ya, karena 4(3) + 3(2) = 12 + 6 = 18 (benar)',
      'Tidak, karena hasilnya bukan 18',
      'Tidak bisa ditentukan',
      'Hanya berlaku jika x = 0'
    ],
    correctAnswer: 0,
    explanation: 'Substitusikan x = 3 dan y = 2: 4(3) + 3(2) = 12 + 6 = 18, sehingga (3, 2) memenuhi persamaan.'
  },
  {
    id: 'q2',
    question: 'Berapakah penyelesaian dari SPLDV: x + y = 11 dan 2x + y = 17?',
    options: [
      '(x, y) = (4, 7)',
      '(x, y) = (6, 5)',
      '(x, y) = (5, 6)',
      '(x, y) = (7, 4)'
    ],
    correctAnswer: 1,
    explanation: 'Kurangkan kedua persamaan: (2x - x) + (y - y) = 17 - 11 ⟹ x = 6. Substitusikan ke x + y = 11 ⟹ y = 5. Jadi, (x, y) = (6, 5).'
  },
  {
    id: 'q3',
    question: 'Harga 2 tiket dewasa dan 1 tiket anak Rp55.000,00, sedangkan 1 tiket dewasa dan 2 tiket anak Rp50.000,00. Berapa harga 1 tiket dewasa (d) dan 1 tiket anak (a)?',
    options: [
      'Dewasa Rp25.000 dan Anak Rp10.000',
      'Dewasa Rp20.000 dan Anak Rp15.000',
      'Dewasa Rp30.000 dan Anak Rp12.500',
      'Dewasa Rp15.000 dan Anak Rp20.000'
    ],
    correctAnswer: 1,
    explanation: 'Model: 2d + a = 55 dan d + 2a = 50. Diperoleh d = 20 (Rp20.000) dan a = 15 (Rp15.000).'
  }
];
