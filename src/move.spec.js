import move from "./move.js";
import Position from "./position.js";

const mine = [
  [1, 2, 2, 4, ],
  [6, 9, 8, 7, ],
  [6, 1, 0, 1, ],
  [1, 5, 4, 7, ],
];

describe("first x position", () => {
  it("should return 0 for the first x position", () => {
    let position = move(mine);
    expect(position.x).toEqual(0);
  });
});

describe("first y position", () => {
  it("should return the best position of y to get highest gold mine", () => {
    let position = move(mine);
    expect(position.y).toEqual(2);
  });
});

describe("random position", () => {
  it("should throw error if not in best position", () => {
    expect(() => {
      move(mine, new Position(0,0));
    }).toThrow();
  });
});