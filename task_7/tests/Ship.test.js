const Ship = require("../src/models/Ship");

describe("Ship", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  test("should create a ship with correct length", () => {
    expect(ship.length).toBe(3);
    expect(ship.positions).toEqual([]);
    expect(ship.hits.size).toBe(0);
  });

  test("should place ship correctly", () => {
    const positions = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ];
    ship.place(positions);
    expect(ship.positions).toEqual(positions);
  });

  test("should record hits correctly", () => {
    const position = "00";
    ship.hit(position);
    expect(ship.isHit(position)).toBe(true);
    expect(ship.isHit("11")).toBe(false);
  });

  test("should detect sunk ship", () => {
    const positions = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ];
    ship.place(positions);

    positions.forEach((pos) => {
      ship.hit(ship.getPositionKey(pos.row, pos.col));
    });

    expect(ship.isSunk()).toBe(true);
  });

  test("should not be sunk with partial hits", () => {
    const positions = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ];
    ship.place(positions);

    ship.hit(ship.getPositionKey(positions[0].row, positions[0].col));
    ship.hit(ship.getPositionKey(positions[1].row, positions[1].col));

    expect(ship.isSunk()).toBe(false);
  });

  test("should generate correct position key", () => {
    expect(ship.getPositionKey(0, 0)).toBe("00");
    expect(ship.getPositionKey(1, 2)).toBe("12");
  });
});
