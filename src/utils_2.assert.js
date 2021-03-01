import Position from "./position.js";
import { getPathToMaxGold } from "./utils_2";

const mine1 = [[1], [4], [7]];

const mine2 = [
  [1, 0, 1],
  [2, 4, 0],
];

const mine3 = [
  [1, 0, 5, 0, 2],
  [1, 1, 0, 1, 3],
  [2, 0, 2, 0, 100],
];

const mine4 = [
  [1, 0, 0],
  [4, 0, 0],
];

const mine5 = [
  [0, 0],
  [0, 2],
];

describe("getPathToMaxGold", () => {
  it("Should find a path that collects the total gold of 15 in mine1", () => {
    expect(getPathToMaxGold(mine1).gold).toBe(7);
    expect(getPathToMaxGold(mine1).path).toEqual([new Position(0, 2), new Position(1, 2)]);
  });

  it("Should find a path that collects the total gold of 6 in mine2", () => {
    expect(getPathToMaxGold(mine2).gold).toBe(7);
    expect(getPathToMaxGold(mine2).path).toEqual([
      new Position(0, 1),
      new Position(1, 1),
      new Position(2, 0),
      new Position(3, 1),
    ]);
  });

  it("Should find a path that collects the total gold of 106 in mine3", () => {
    expect(getPathToMaxGold(mine3).gold).toBe(106);
    expect(getPathToMaxGold(mine3).path).toEqual([
      new Position(0, 2),
      new Position(1, 1),
      new Position(2, 2),
      new Position(3, 1),
      new Position(4, 2),
      new Position(5, 2),
    ]);
  });

  it("Should find a path that collects the total gold of 4 in mine4", () => {
    expect(getPathToMaxGold(mine4).gold).toBe(4);
    expect(getPathToMaxGold(mine4).path).toEqual([new Position(0, 1), new Position(1, 1)]);
  });

  it("Should find a path that collects the total gold of 0 in mine5", () => {
    expect(getPathToMaxGold(mine5).gold).toBe(0);
    expect(getPathToMaxGold(mine5).path).toEqual([new Position(0, 1)]);
  });
});
