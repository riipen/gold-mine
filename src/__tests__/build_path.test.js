import buildPath from "../build_path.js";
import { getGold } from "../build_path.js";
import Position from "../position.js";

const mine = [
  [2, 3, 8],
  [9, 5, 9],
  [1, 2, 1],
];

describe("buildPath", () => {
  test("it returns the optimal path", () => {
    let path = buildPath(mine);

    expect(path[0].x).toEqual(0);
    expect(path[0].y).toEqual(1);

    expect(path[1].x).toEqual(1);
    expect(path[1].y).toEqual(1);

    expect(path[2].x).toEqual(2);
    expect(path[2].y).toEqual(0);
  });
});

describe("getGold", () => {
  test("it returns the gold for the next 3 move options at (0,0)", () => {
    let curPosition = new Position(0, 0);

    let gold = getGold(curPosition, mine, 1);

    expect(gold.up).toBeFalsy();
    expect(gold.right).toEqual(3);
    expect(gold.down).toEqual(5);
  });

  test("it returns the gold for the next 3 move options at (0,1)", () => {
    let curPosition = new Position(0, 1);

    let gold = getGold(curPosition, mine, 1);

    expect(gold.up).toEqual(3);
    expect(gold.right).toEqual(5);
    expect(gold.down).toEqual(2);
  });

  test("it returns the gold for the next 3 move options at (0,2)", () => {
    let curPosition = new Position(0, 2);

    let gold = getGold(curPosition, mine, 1);

    expect(gold.up).toEqual(5);
    expect(gold.right).toEqual(2);
    expect(gold.down).toBeFalsy();
  });

  test("it returns falsy if you are at the end of the mine", () => {
    let curPosition = new Position(2, 1);

    let gold = getGold(curPosition, mine, 3);

    expect(gold.up).toBeFalsy();
    expect(gold.right).toBeFalsy();
    expect(gold.down).toBeFalsy();
  });
});
