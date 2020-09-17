import buildPath from "../buildPath.js";
import { getGold, findOptimalStart } from "../buildPath.js";
import Position from "../position.js";

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

const mine3 = [
  [8, 1, 6, 1],
  [2, 1, 0, 6],
  [2, 7, 2, 4],
  [8, 2, 0, 9],
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

  test("it returns the optimal path with zeroes", () => {
    let path = buildPath(mine2);

    expect(path[0].x).toEqual(0);
    expect(path[0].y).toEqual(2);

    expect(path[1].x).toEqual(1);
    expect(path[1].y).toEqual(3);

    expect(path[2].x).toEqual(2);
    expect(path[2].y).toEqual(2);
  });
});

describe("getGold", () => {
  test("it returns the gold for the next 3 move options at (0,0)", () => {
    let curPosition = new Position(0, 0);

    let gold = getGold(curPosition, mine, 1);

    expect(gold[0]).toBeFalsy();
    expect(gold[1]).toEqual(3);
    expect(gold[2]).toEqual(5);
  });

  test("it returns the gold for the next 3 move options at (0,1)", () => {
    let curPosition = new Position(0, 1);

    let gold = getGold(curPosition, mine, 1);

    expect(gold[0]).toEqual(3);
    expect(gold[1]).toEqual(5);
    expect(gold[2]).toEqual(2);
  });

  test("it returns the gold for the next 3 move options at (0,2)", () => {
    let curPosition = new Position(0, 2);

    let gold = getGold(curPosition, mine, 1);

    expect(gold[0]).toEqual(5);
    expect(gold[1]).toEqual(2);
    expect(gold[2]).toBeFalsy();
  });

  test("it returns falsy if you are at the end of the mine", () => {
    let curPosition = new Position(2, 1);

    let gold = getGold(curPosition, mine, 3);

    expect(gold[0]).toBeFalsy();
    expect(gold[1]).toBeFalsy();
    expect(gold[2]).toBeFalsy();
  });
});

describe("findOptimalStart", () => {
  it("finds the optimal starting row for an odd mine", () => {
    let pos = findOptimalStart(mine);

    expect(pos.x).toEqual(0);
    expect(pos.y).toEqual(1);
  });

  it("finds the optimal starting row for an even mine", () => {
    let pos = findOptimalStart(mine2);

    expect(pos.x).toEqual(0);
    expect(pos.y).toEqual(2);
  });

  it("finds the optimal starting row for repeated gold", () => {
    let pos = findOptimalStart(mine3);

    expect(pos.x).toEqual(0);
    expect(pos.y).toEqual(3);
  });
});
