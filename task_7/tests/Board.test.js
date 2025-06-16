const Board = require("../src/models/Board");

describe("Board", () => {
  let board;

  beforeEach(() => {
    board = new Board(10);
  });

  test("should create a board with correct size", () => {
    expect(board.size).toBe(10);
    expect(board.grid.length).toBe(10);
    expect(board.grid[0].length).toBe(10);
  });

  test("should initialize with empty cells", () => {
    for (let i = 0; i < board.size; i++) {
      for (let j = 0; j < board.size; j++) {
        expect(board.getCell(i, j)).toBe("~");
      }
    }
  });

  test("should place ship correctly", () => {
    const positions = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ];
    board.placeShip(null, positions);

    positions.forEach(({ row, col }) => {
      expect(board.getCell(row, col)).toBe("S");
    });
  });

  test("should mark hit correctly", () => {
    board.markHit(0, 0);
    expect(board.getCell(0, 0)).toBe("X");
  });

  test("should mark miss correctly", () => {
    board.markMiss(0, 0);
    expect(board.getCell(0, 0)).toBe("O");
  });

  test("should validate positions correctly", () => {
    expect(board.isValidPosition(0, 0)).toBe(true);
    expect(board.isValidPosition(9, 9)).toBe(true);
    expect(board.isValidPosition(-1, 0)).toBe(false);
    expect(board.isValidPosition(0, -1)).toBe(false);
    expect(board.isValidPosition(10, 0)).toBe(false);
    expect(board.isValidPosition(0, 10)).toBe(false);
  });
});
