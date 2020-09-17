import checkFutureZeroes from "../findZeroes.js";
import { secondHighestGoldIndex } from "../findZeroes.js";

const mine = [
  [2, 3, 8],
  [9, 5, 9],
  [1, 2, 1],
];

const mine2 = [
  [6, 8, 4, 1, 7, 6, 2, 1, 6, 1],
  [5, 6, 1, 9, 7, 2, 2, 1, 0, 6],
  [0, 4, 9, 5, 4, 8, 8, 7, 2, 4],
  [9, 9, 0, 1, 8, 9, 5, 2, 0, 9],
];

describe("checkFutureZeroes", () => {
  it("doesn't detect any zeroes in a zeroless mine", () => {
    let gold = [3, 5, 2];
    let curY = 1;
    let newX = 1;

    let index = checkFutureZeroes(gold, mine, curY, newX);

    expect(index).toEqual(1);
  });

  it("detects zeroes in mine2 and avoids them", () => {
    let gold = [-1, 7, 2];
    let curY = 2;
    let newX = 7;

    let index = checkFutureZeroes(gold, mine2, curY, newX);

    expect(index).toEqual(2);
  });
});

describe("secondHighestGoldIndex", () => {
  it("returns the second highest gold index given some gold", () => {
    let gold = [3, 5, 2];

    let index = secondHighestGoldIndex(gold);

    expect(index).toEqual(0);
  });

  it("returns the second highest gold index given some gold with duplicates", () => {
    let gold = [5, 5, 2];

    let index = secondHighestGoldIndex(gold);

    expect(index).toEqual(0);
  });
});
