import move from "../move.js";

const mine = [
  [2, 3, 8],
  [9, 5, 9],
  [1, 2, 1],
];

const mine2 = [
  [2, 1, 6, 1],
  [3, 1, 0, 6],
  [8, 7, 2, 4],
  [5, 2, 0, 9],
];

describe("move mine1", () => {
  it("returns the first position at (0,1)", () => {
    let position = move(mine);

    expect(position.x).toEqual(0);
    expect(position.y).toEqual(1);
  });

  it("returns a new position after the first move", () => {
    let position = move(mine, move(mine));

    expect(position.x).toEqual(1);
    expect(position.y).toEqual(1);
  });

  it("finishes at (1, 3)", () => {
    let position = move(mine, move(mine, move(mine)));

    expect(position.x).toEqual(2);
    expect(position.y).toEqual(0);
  });
});

describe("move mine2", () => {
  it("returns the first position at (0,2)", () => {
    let position = move(mine2);

    expect(position.x).toEqual(0);
    expect(position.y).toEqual(2);
  });

  it("avoids the zeroes by moving to (1,3)", () => {
    let position = move(mine2, move(mine2));

    expect(position.x).toEqual(1);
    expect(position.y).toEqual(3);
  });

  it("avoids the zero by moving to (2,2)", () => {
    let position = move(mine2, move(mine2, move(mine2)));

    expect(position.x).toEqual(2);
    expect(position.y).toEqual(2);
  });

  it("finishes at (3,3)", () => {
    let position = move(mine2, move(mine2, move(mine2, move(mine2))));

    expect(position.x).toEqual(3);
    expect(position.y).toEqual(3);
  });
});
