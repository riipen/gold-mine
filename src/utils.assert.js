import Position from "./position.js";
import { getPathToMaxGold } from "./utils";
import { iterate } from "./utils_2";

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

describe.only("iterate", () => {
  it("Should find a path that collects the total gold of 15 in mine1", () => {
    expect(iterate(mine1).gold).toBe(7);
    expect(iterate(mine1).path).toEqual([new Position(0, 2), new Position(1, 2)]);
  });

  it("Should find a path that collects the total gold of 6 in mine2", () => {
    expect(iterate(mine2).gold).toBe(7);
    expect(iterate(mine2).path).toEqual([
      new Position(0, 1),
      new Position(1, 1),
      new Position(2, 0),
      new Position(3, 1),
    ]);
  });

  it("Should find a path that collects the total gold of 106 in mine3", () => {
    expect(iterate(mine3).gold).toBe(106);
    expect(iterate(mine3).path).toEqual([
      new Position(0, 2),
      new Position(1, 1),
      new Position(2, 2),
      new Position(3, 1),
      new Position(4, 2),
      new Position(5, 2),
    ]);
  });

  it("Should find a path that collects the total gold of 4 in mine4", () => {
    expect(iterate(mine4).gold).toBe(4);
    expect(iterate(mine4).path).toEqual([new Position(0, 1), new Position(1, 1)]);
  });
});

describe("getPathToMaxGold", () => {
  it("Should find a path that collects the total gold of 15 in mine1", () => {
    expect(getPathToMaxGold(mine1).totalGold).toBe(7);
    expect(getPathToMaxGold(mine1).path).toEqual([new Position(0, 2), new Position(1, 1)]);
  });

  it("Should find a path that collects the total gold of 6 in mine2", () => {
    expect(getPathToMaxGold(mine2).totalGold).toBe(7);
    expect(getPathToMaxGold(mine2).path).toEqual([
      new Position(0, 1),
      new Position(1, 1),
      new Position(2, 0),
      new Position(3, 0),
    ]);
  });

  it("Should find a path that collects the total gold of 106 in mine3", () => {
    expect(getPathToMaxGold(mine3).totalGold).toBe(106);
    expect(getPathToMaxGold(mine3).path).toEqual([
      new Position(0, 2),
      new Position(1, 1),
      new Position(2, 2),
      new Position(3, 1),
      new Position(4, 2),
      new Position(5, 1),
    ]);
  });
});
