class Ship {
  constructor(length) {
    this.length = length;
    this.positions = [];
    this.hits = new Set();
  }

  place(positions) {
    this.positions = positions;
  }

  hit(position) {
    this.hits.add(position);
  }

  isHit(position) {
    return this.hits.has(position);
  }

  isSunk() {
    return this.hits.size === this.length;
  }

  getPositionKey(row, col) {
    return `${row}${col}`;
  }
}

module.exports = Ship;
