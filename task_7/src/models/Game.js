const Player = require("./Player");

class Game {
  constructor(config = {}) {
    this.boardSize = config.boardSize || 10;
    this.numShips = config.numShips || 3;
    this.shipLength = config.shipLength || 3;

    this.player = new Player("Player");
    this.computer = new Player("Computer", true);
    this.currentTurn = "player";
    this.gameOver = false;
    this.winner = null;
  }

  initialize() {
    this.player.placeShips(this.shipLength, this.numShips);
    this.computer.placeShips(this.shipLength, this.numShips);
  }

  processPlayerGuess(row, col) {
    if (this.gameOver) return { valid: false, message: "Game is over" };
    if (this.currentTurn !== "player")
      return { valid: false, message: "Not your turn" };

    const guessResult = this.player.makeGuess(row, col);
    if (!guessResult.valid) return guessResult;

    const result = this.computer.receiveGuess(row, col);
    this.checkGameOver();

    if (!this.gameOver) {
      this.currentTurn = "computer";
      this.processComputerGuess();
    }

    return {
      valid: true,
      hit: result.hit,
      sunk: result.sunk,
      gameOver: this.gameOver,
      winner: this.winner,
    };
  }

  processComputerGuess() {
    if (this.gameOver) return;

    let row, col;
    if (this.computer.mode === "target") {
      const target = this.computer.getNextTarget();
      if (target) {
        row = target.row;
        col = target.col;
      } else {
        this.computer.mode = "hunt";
      }
    }

    if (this.computer.mode === "hunt") {
      do {
        row = Math.floor(Math.random() * this.boardSize);
        col = Math.floor(Math.random() * this.boardSize);
      } while (!this.computer.makeGuess(row, col).valid);
    }

    const result = this.player.receiveGuess(row, col);

    if (result.hit) {
      this.computer.mode = "target";
      // Add adjacent cells to target queue
      const adjacent = [
        { r: row - 1, c: col },
        { r: row + 1, c: col },
        { r: row, c: col - 1 },
        { r: row, c: col + 1 },
      ];

      adjacent.forEach(({ r, c }) => {
        if (this.computer.board.isValidPosition(r, c)) {
          this.computer.addToTargetQueue(r, c);
        }
      });
    }

    this.checkGameOver();
    if (!this.gameOver) {
      this.currentTurn = "player";
    }

    return {
      row,
      col,
      hit: result.hit,
      sunk: result.sunk,
      gameOver: this.gameOver,
      winner: this.winner,
    };
  }

  checkGameOver() {
    if (this.player.getRemainingShips() === 0) {
      this.gameOver = true;
      this.winner = "computer";
    } else if (this.computer.getRemainingShips() === 0) {
      this.gameOver = true;
      this.winner = "player";
    }
  }

  getGameState() {
    return {
      playerBoard: this.player.board,
      computerBoard: this.computer.board,
      currentTurn: this.currentTurn,
      gameOver: this.gameOver,
      winner: this.winner,
      playerShipsRemaining: this.player.getRemainingShips(),
      computerShipsRemaining: this.computer.getRemainingShips(),
    };
  }
}

module.exports = Game;
