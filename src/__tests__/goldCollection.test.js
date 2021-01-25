import { findLocalMaximumPath } from "../goldCollection";
import Position from "../position";

const smallTestMine = [
  [1, 7, 5],
  [2, 3, 9],
  [1, 4, 1],
];

const zeroTestMine = [
  [1, 7, 5],
  [2, 0, 9],
  [1, 4, 1],
];

describe("goldCollection function tests", () => {
  it("returns the local maximum for a cell", () => {
    const currentPosition = new Position(1, 1);
    const [maximumLocalGold] = findLocalMaximumPath(
      smallTestMine,
      -1,
      currentPosition
    );

    expect(maximumLocalGold).toEqual(9);
  });

  it("returns the next best position to not repeat direction", () => {
    const currentPosition = new Position(1, 1);

    const [maximumLocalGold] = findLocalMaximumPath(
      smallTestMine,
      0,
      currentPosition
    );

    expect(maximumLocalGold).toEqual(5);
  });

  it("returns 0 if there is a zero at the location", () => {
    const currentPosition = new Position(1, 1);

    const [maximumLocalGold] = findLocalMaximumPath(
      zeroTestMine,
      0,
      currentPosition
    );

    expect(maximumLocalGold).toEqual(0);
  });
});
