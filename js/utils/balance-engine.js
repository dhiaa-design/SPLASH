/**
 * Balance Engine untuk Simulasi Timbangan SPLASH
 * Menangani bobot ruas kiri & kanan, sudut rotasi timbangan, dan operasi aljabar kedua ruas.
 */

export class BalanceScale {
  constructor(config = {}) {
    // Nilai riil tersembunyi variabel untuk simulasi fisika kesetaraan
    this.solutionX = config.solutionX !== undefined ? config.solutionX : 3;
    this.solutionY = config.solutionY !== undefined ? config.solutionY : 5;

    // Komposisi balok awal
    this.initialState = {
      leftX: config.initialLeftX || 0,
      leftY: config.initialLeftY || 0,
      leftNum: config.initialLeftNum || 0,
      rightX: config.initialRightX || 0,
      rightY: config.initialRightY || 0,
      rightNum: config.initialRightNum || 0
    };

    this.state = { ...this.initialState };
    this.history = []; // Untuk fitur Undo (Batal)
    this.warningMessage = '';
  }

  // Simpan snapshot untuk Undo
  _pushHistory() {
    this.history.push({ ...this.state });
    if (this.history.length > 20) {
      this.history.shift();
    }
  }

  // Hitung total berat masing-masing ruas
  getWeights() {
    const leftWeight = (this.state.leftX * this.solutionX) + 
                       (this.state.leftY * this.solutionY) + 
                       this.state.leftNum;

    const rightWeight = (this.state.rightX * this.solutionX) + 
                        (this.state.rightY * this.solutionY) + 
                        this.state.rightNum;

    const diff = leftWeight - rightWeight;
    const isBalanced = Math.abs(diff) < 0.001;

    // Hitung sudut rotasi maksimal ±12 derajat agar visual tetap elegan
    let rotationDeg = 0;
    if (!isBalanced) {
      // Jika ruas kiri lebih berat, lengan kiri turun -> rotasi berlawanan arah jarum jam (negatif)
      // Jika ruas kanan lebih berat, lengan kanan turun -> rotasi searah jarum jam (positif)
      const clampedDiff = Math.max(-10, Math.min(10, diff));
      rotationDeg = (clampedDiff / 10) * -12;
    }

    return {
      leftWeight,
      rightWeight,
      diff,
      isBalanced,
      rotationDeg: Number(rotationDeg.toFixed(2))
    };
  }

  // Tambah balok ke salah satu cawan (bisa dari drag-and-drop)
  addBlock(side, blockType, count = 1) {
    this._pushHistory();
    this.warningMessage = 'Perhatian: Balok ditambahkan ke satu ruas saja. Kesetaraan timbangan berubah!';

    if (side === 'left') {
      if (blockType === 'x') this.state.leftX += count;
      if (blockType === 'y') this.state.leftY += count;
      if (blockType === 'num') this.state.leftNum += count;
    } else {
      if (blockType === 'x') this.state.rightX += count;
      if (blockType === 'y') this.state.rightY += count;
      if (blockType === 'num') this.state.rightNum += count;
    }

    return this.getWeights();
  }

  // Kurangi balok dari salah satu cawan
  removeBlock(side, blockType, count = 1) {
    this._pushHistory();
    this.warningMessage = 'Perhatian: Balok dikurangi dari satu ruas saja. Kesetaraan timbangan berubah!';

    if (side === 'left') {
      if (blockType === 'x') this.state.leftX = Math.max(0, this.state.leftX - count);
      if (blockType === 'y') this.state.leftY = Math.max(0, this.state.leftY - count);
      if (blockType === 'num') this.state.leftNum = Math.max(0, this.state.leftNum - count);
    } else {
      if (blockType === 'x') this.state.rightX = Math.max(0, this.state.rightX - count);
      if (blockType === 'y') this.state.rightY = Math.max(0, this.state.rightY - count);
      if (blockType === 'num') this.state.rightNum = Math.max(0, this.state.rightNum - count);
    }

    return this.getWeights();
  }

  // Operasi aljabar PADA KEDUA RUAS (Prinsip Kesetaraan)
  applyBothSidesOperation(operation, value, blockType = 'num') {
    this._pushHistory();
    this.warningMessage = ''; // Bersih dari peringatan karena adil pada kedua ruas

    if (operation === 'add') {
      if (blockType === 'x') {
        this.state.leftX += value;
        this.state.rightX += value;
      } else if (blockType === 'y') {
        this.state.leftY += value;
        this.state.rightY += value;
      } else {
        this.state.leftNum += value;
        this.state.rightNum += value;
      }
    } else if (operation === 'subtract') {
      if (blockType === 'x') {
        this.state.leftX = Math.max(0, this.state.leftX - value);
        this.state.rightX = Math.max(0, this.state.rightX - value);
      } else if (blockType === 'y') {
        this.state.leftY = Math.max(0, this.state.leftY - value);
        this.state.rightY = Math.max(0, this.state.rightY - value);
      } else {
        this.state.leftNum = Math.max(0, this.state.leftNum - value);
        this.state.rightNum = Math.max(0, this.state.rightNum - value);
      }
    } else if (operation === 'multiply') {
      if (value > 0) {
        this.state.leftX *= value;
        this.state.leftY *= value;
        this.state.leftNum *= value;
        this.state.rightX *= value;
        this.state.rightY *= value;
        this.state.rightNum *= value;
      }
    } else if (operation === 'divide') {
      if (value > 0) {
        // Hanya membagi jika habis dibagi atau bulatkan
        this.state.leftX = Number((this.state.leftX / value).toFixed(2));
        this.state.leftY = Number((this.state.leftY / value).toFixed(2));
        this.state.leftNum = Number((this.state.leftNum / value).toFixed(2));
        this.state.rightX = Number((this.state.rightX / value).toFixed(2));
        this.state.rightY = Number((this.state.rightY / value).toFixed(2));
        this.state.rightNum = Number((this.state.rightNum / value).toFixed(2));
      }
    }

    return this.getWeights();
  }

  // Batalkan langkah terakhir (Undo)
  undo() {
    if (this.history.length > 0) {
      this.state = this.history.pop();
      this.warningMessage = '';
      return true;
    }
    return false;
  }

  // Reset ke kondisi awal
  reset() {
    this._pushHistory();
    this.state = { ...this.initialState };
    this.warningMessage = '';
  }

  // Representasi teks persamaan saat ini
  getEquationString() {
    const formatSide = (x, y, num) => {
      const parts = [];
      if (x > 0) parts.push(x === 1 ? 'x' : `${x}x`);
      if (y > 0) parts.push(y === 1 ? 'y' : `${y}y`);
      if (num > 0 || parts.length === 0) parts.push(`${num}`);
      return parts.join(' + ');
    };

    const left = formatSide(this.state.leftX, this.state.leftY, this.state.leftNum);
    const right = formatSide(this.state.rightX, this.state.rightY, this.state.rightNum);
    return `${left} = ${right}`;
  }
}
