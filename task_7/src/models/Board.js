class Board {
  constructor(size = 10) {
    this.size = size;
    this.grid = Array(size)
      .fill()
      .map(() => Array(size).fill("~"));
  }

  placeShip(ship, positions) {
    positions.forEach(({ row, col }) => {
      this.grid[row][col] = "S";
    });
  }

  markHit(row, col) {
    this.grid[row][col] = "X";
  }

  markMiss(row, col) {
    this.grid[row][col] = "O";
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  getCell(row, col) {
    return this.grid[row][col];
  }

  toString() {
    return this.grid.map((row) => row.join(" ")).join("\n");
  }
}

module.exports = Board;
