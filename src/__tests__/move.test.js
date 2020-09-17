import move from "../move.js";

const mine = [
  [2, 3, 8],
  [9, 5, 9],
  [1, 2, 1],
];

describe("move", () => {
  test("it returns the first position at (0,1)", () => {
    let position = move(mine);

    expect(position.x).toEqual(0);
    expect(position.y).toEqual(1);
  });

  test("it returns a new position after the first move", () => {
    let position = move(mine, move(mine));

    expect(position.x).toEqual(1);
    expect(position.y).toEqual(1);
  });

  test("it finishes at (1, 3)", () => {
    let position = move(mine, move(mine, move(mine)));

    expect(position.x).toEqual(2);
    expect(position.y).toEqual(0);
  });
});
