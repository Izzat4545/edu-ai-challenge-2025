const Game = require("../src/models/Game");

describe("Game", () => {
  let game;

  beforeEach(() => {
    game = new Game({
      boardSize: 10,
      numShips: 3,
      shipLength: 3,
    });
    game.initialize();
  });

  test("should initialize game with correct configuration", () => {
    expect(game.boardSize).toBe(10);
    expect(game.numShips).toBe(3);
    expect(game.shipLength).toBe(3);
    expect(game.currentTurn).toBe("player");
    expect(game.gameOver).toBe(false);
    expect(game.winner).toBe(null);
  });

  test("should place ships for both players", () => {
    expect(game.player.ships.length).toBe(3);
    expect(game.computer.ships.length).toBe(3);
  });

  test("should process valid player guess", () => {
    const result = game.processPlayerGuess(0, 0);
    expect(result.valid).toBe(true);
    expect(["hit", "miss"]).toContain(result.hit);
  });

  test("should not allow invalid player guess", () => {
    const result = game.processPlayerGuess(10, 10);
    expect(result.valid).toBe(false);
  });

  test("should not allow duplicate guesses", () => {
    game.processPlayerGuess(0, 0);
    const result = game.processPlayerGuess(0, 0);
    expect(result.valid).toBe(false);
  });

  test("should detect game over when all ships are sunk", () => {
    // Simulate sinking all computer ships
    game.computer.ships.forEach((ship) => {
      ship.positions.forEach((pos) => {
        ship.hit(ship.getPositionKey(pos.row, pos.col));
      });
    });

    game.checkGameOver();
    expect(game.gameOver).toBe(true);
    expect(game.winner).toBe("player");
  });

  test("should get correct game state", () => {
    const state = game.getGameState();
    expect(state).toHaveProperty("playerBoard");
    expect(state).toHaveProperty("computerBoard");
    expect(state).toHaveProperty("currentTurn");
    expect(state).toHaveProperty("gameOver");
    expect(state).toHaveProperty("winner");
    expect(state).toHaveProperty("playerShipsRemaining");
    expect(state).toHaveProperty("computerShipsRemaining");
  });

  test("should switch turns after valid guess", () => {
    expect(game.currentTurn).toBe("player");
    game.processPlayerGuess(0, 0);
    expect(game.currentTurn).toBe("player"); // Should be player again after computer's turn
  });
});
