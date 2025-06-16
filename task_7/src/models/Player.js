const Ship = require("./Ship");
const Board = require("./Board");

class Player {
  constructor(name, isComputer = false) {
    this.name = name;
    this.isComputer = isComputer;
    this.board = new Board();
    this.ships = [];
    this.guesses = new Set();
    this.targetQueue = [];
    this.mode = "hunt";
  }

  placeShips(shipLength, numShips) {
    for (let i = 0; i < numShips; i++) {
      const ship = new Ship(shipLength);
      const positions = this.generateShipPositions(shipLength);
      ship.place(positions);
      this.ships.push(ship);
      this.board.placeShip(ship, positions);
    }
  }

  generateShipPositions(length) {
    const positions = [];
    const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
    let startRow, startCol;

    do {
      if (orientation === "horizontal") {
        startRow = Math.floor(Math.random() * this.board.size);
        startCol = Math.floor(Math.random() * (this.board.size - length + 1));
      } else {
        startRow = Math.floor(Math.random() * (this.board.size - length + 1));
        startCol = Math.floor(Math.random() * this.board.size);
      }
    } while (!this.isValidPlacement(startRow, startCol, length, orientation));

    for (let i = 0; i < length; i++) {
      const row = orientation === "horizontal" ? startRow : startRow + i;
      const col = orientation === "horizontal" ? startCol + i : startCol;
      positions.push({ row, col });
    }

    return positions;
  }

  isValidPlacement(startRow, startCol, length, orientation) {
    for (let i = 0; i < length; i++) {
      const row = orientation === "horizontal" ? startRow : startRow + i;
      const col = orientation === "horizontal" ? startCol + i : startCol;

      if (
        !this.board.isValidPosition(row, col) ||
        this.board.getCell(row, col) !== "~"
      ) {
        return false;
      }
    }
    return true;
  }

  makeGuess(row, col) {
    const guessKey = `${row}${col}`;
    if (this.guesses.has(guessKey)) {
      return { valid: false, message: "Already guessed this position" };
    }

    this.guesses.add(guessKey);
    return { valid: true };
  }

  receiveGuess(row, col) {
    const guessKey = `${row}${col}`;
    for (const ship of this.ships) {
      const position = ship.positions.find(
        (p) => ship.getPositionKey(p.row, p.col) === guessKey
      );

      if (position) {
        ship.hit(guessKey);
        this.board.markHit(row, col);
        return { hit: true, sunk: ship.isSunk() };
      }
    }

    this.board.markMiss(row, col);
    return { hit: false };
  }

  getRemainingShips() {
    return this.ships.filter((ship) => !ship.isSunk()).length;
  }

  addToTargetQueue(row, col) {
    const guessKey = `${row}${col}`;
    if (!this.guesses.has(guessKey)) {
      this.targetQueue.push(guessKey);
    }
  }

  getNextTarget() {
    if (this.targetQueue.length > 0) {
      const target = this.targetQueue.shift();
      return {
        row: parseInt(target[0]),
        col: parseInt(target[1]),
      };
    }
    return null;
  }
}

module.exports = Player;
