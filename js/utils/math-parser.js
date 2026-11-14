/**
 * Parser Matematika untuk Sistem Persamaan Linear Dua Variabel (SPLDV)
 * Format standar: ax + by = c
 * Toleransi: spasi bebas, urutan suku berbeda (misal: y + 2x = 11 atau 2x + y = 11),
 * penulisan koefisien implisit (misal: x berarti 1x, -y berarti -1y).
 */

export function parseLinearEquation(input) {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Input persamaan kosong.' };
  }

  // Normalisasi: hilangkan spasi, ubah huruf kecil, seragamkan simbol
  const clean = input.replace(/\s+/g, '').toLowerCase().replace('−', '-');

  // Pisahkan ruas kiri dan ruas kanan dengan tanda '='
  const parts = clean.split('=');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Persamaan harus memiliki satu tanda sama dengan (=).' };
  }

  const [leftSide, rightSide] = parts;
  if (!leftSide || !rightSide) {
    return { isValid: false, error: 'Ruas kiri atau ruas kanan tidak boleh kosong.' };
  }

  // Ruas kanan harus berupa bilangan konstanta (bisa negatif atau pecahan/desimal)
  const c = Number(rightSide);
  if (isNaN(c)) {
    return { isValid: false, error: 'Ruas kanan harus berupa bilangan angka.' };
  }

  // Regex tokenisasi suku-suku di ruas kiri: ([+-]?[0-9]*\.?[0-9]*[a-z]|[+-]?[0-9]+\.?[0-9]*)
  // Contoh: "+2x", "-y", "11", "3.5x"
  const regex = /([+-]?[0-9]*\.?[0-9]*[a-z]|[+-]?[0-9]+\.?[0-9]*)/g;
  const matches = leftSide.match(regex);

  if (!matches || matches.join('') !== leftSide) {
    return { isValid: false, error: 'Format penulisan persamaan tidak valid.' };
  }

  let coeffX = 0;
  let coeffY = 0;
  let constantLeft = 0;

  for (const token of matches) {
    if (token.includes('x')) {
      const numPart = token.replace('x', '');
      let val = 1;
      if (numPart === '' || numPart === '+') val = 1;
      else if (numPart === '-') val = -1;
      else val = Number(numPart);

      if (isNaN(val)) return { isValid: false, error: `Koefisien x tidak valid: ${token}` };
      coeffX += val;
    } else if (token.includes('y')) {
      const numPart = token.replace('y', '');
      let val = 1;
      if (numPart === '' || numPart === '+') val = 1;
      else if (numPart === '-') val = -1;
      else val = Number(numPart);

      if (isNaN(val)) return { isValid: false, error: `Koefisien y tidak valid: ${token}` };
      coeffY += val;
    } else {
      // Konstanta di ruas kiri dipindahkan ke kanan: c - constantLeft
      const num = Number(token);
      if (isNaN(num)) return { isValid: false, error: `Konstanta tidak valid: ${token}` };
      constantLeft += num;
    }
  }

  const finalC = c - constantLeft;

  return {
    isValid: true,
    a: coeffX,
    b: coeffY,
    c: finalC,
    formatted: `${coeffX}x ${coeffY >= 0 ? '+ ' + coeffY : '- ' + Math.abs(coeffY)}y = ${finalC}`
  };
}

/**
 * Memeriksa apakah input persamaan siswa cocok dengan target pemodelan matematika.
 * Mengabaikan spasi dan toleran terhadap urutan suku (y + 2x = 11 dianggap sama dengan 2x + y = 11).
 */
export function isEquationMatching(inputEquation, targetA, targetB, targetC) {
  const parsed = parseLinearEquation(inputEquation);
  if (!parsed.isValid) {
    return { matches: false, reason: parsed.error };
  }

  // Cek apakah koefisien a, b, dan konstanta c sesuai
  const isMatch = (parsed.a === targetA && parsed.b === targetB && parsed.c === targetC);
  if (isMatch) {
    return { matches: true };
  }

  // Cek apakah ekuivalen (dikalikan faktor pengali yang sama)
  if (targetA !== 0 && parsed.a !== 0) {
    const factor = parsed.a / targetA;
    if (parsed.b === targetB * factor && parsed.c === targetC * factor) {
      return {
        matches: true,
        note: `Persamaan kamu setara dengan ${targetA}x + ${targetB}y = ${targetC} (faktor ${factor}).`
      };
    }
  }

  return {
    matches: false,
    reason: `Persamaan yang dibentuk (${parsed.formatted}) belum sesuai dengan informasi soal.`
  };
}

/**
 * Menghitung substitusi pasangan (x, y) ke dalam persamaan ax + by = c
 */
export function evaluateEquation(a, b, c, x, y) {
  const leftResult = (a * x) + (b * y);
  const isSatisfied = Math.abs(leftResult - c) < 0.0001;
  const difference = leftResult - c;

  return {
    leftResult,
    targetC: c,
    isSatisfied,
    difference
  };
}

/**
 * Menyelesaikan sistem persamaan dua variabel ax + by = c dan px + qy = r
 * Menggunakan aturan Cramer
 */
export function solveSystem2x2(a, b, c, p, q, r) {
  const det = (a * q) - (b * p);
  if (Math.abs(det) < 0.00001) {
    return { hasUniqueSolution: false, error: 'Sistem tidak memiliki penyelesaian unik (garis sejajar atau berhimpit).' };
  }

  const detX = (c * q) - (b * r);
  const detY = (a * r) - (c * p);

  const x = detX / det;
  const y = detY / det;

  return {
    hasUniqueSolution: true,
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
    determinant: det
  };
}
