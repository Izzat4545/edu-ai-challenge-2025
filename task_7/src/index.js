const readline = require("readline");
const Game = require("./models/Game");

class GameInterface {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.game = new Game();
    this.game.initialize();
  }

  printBoard() {
    console.log("\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---");
    const header =
      "  " +
      Array(this.game.boardSize)
        .fill()
        .map((_, i) => i)
        .join(" ");
    console.log(header + "     " + header);

    for (let i = 0; i < this.game.boardSize; i++) {
      let rowStr = i + " ";

      // Computer's board
      for (let j = 0; j < this.game.boardSize; j++) {
        rowStr += this.game.computer.board.getCell(i, j) + " ";
      }

      rowStr += "    " + i + " ";

      // Player's board
      for (let j = 0; j < this.game.boardSize; j++) {
        rowStr += this.game.player.board.getCell(i, j) + " ";
      }

      console.log(rowStr);
    }
    console.log("\n");
  }

  async play() {
    console.log("\nLet's play Sea Battle!");
    console.log(`Try to sink the ${this.game.numShips} enemy ships.`);

    while (!this.game.gameOver) {
      this.printBoard();

      if (this.game.currentTurn === "player") {
        await this.playerTurn();
      }
    }

    this.printBoard();
    console.log(
      `\n*** ${
        this.game.winner === "player" ? "CONGRATULATIONS" : "GAME OVER"
      }! ${this.game.winner === "player" ? "You" : "The CPU"} won! ***`
    );
    this.rl.close();
  }

  async playerTurn() {
    return new Promise((resolve) => {
      this.rl.question("Enter your guess (e.g., 00): ", (answer) => {
        if (answer.length !== 2) {
          console.log(
            "Oops, input must be exactly two digits (e.g., 00, 34, 98)."
          );
          resolve();
          return;
        }

        const row = parseInt(answer[0]);
        const col = parseInt(answer[1]);

        if (
          isNaN(row) ||
          isNaN(col) ||
          row < 0 ||
          row >= this.game.boardSize ||
          col < 0 ||
          col >= this.game.boardSize
        ) {
          console.log(
            `Oops, please enter valid row and column numbers between 0 and ${
              this.game.boardSize - 1
            }.`
          );
          resolve();
          return;
        }

        const result = this.game.processPlayerGuess(row, col);

        if (!result.valid) {
          console.log(result.message);
          resolve();
          return;
        }

        if (result.hit) {
          console.log("PLAYER HIT!");
          if (result.sunk) {
            console.log("You sunk an enemy battleship!");
          }
        } else {
          console.log("PLAYER MISS.");
        }

        resolve();
      });
    });
  }
}

// Start the game
const gameInterface = new GameInterface();
gameInterface.play();
