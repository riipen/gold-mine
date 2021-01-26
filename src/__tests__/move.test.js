import move from "../move";
import Position from "../position";

const smallTestMine = [
  [1, 7, 5],
  [2, 3, 9],
  [1, 4, 1],
];

const smallTestTrackingMine = [
  [new Position(1,0), new Position(2,1), null],
  [new Position(1,0), new Position(2,1), null],
  [new Position(1,2), new Position(2,1), null],
]

describe("move function mine tests", () => {
  it("returns undefined if no starting point is given", () => {
    const currentPosition = move();

    expect(currentPosition.y).toEqual(undefined);
  });

  it("returns the proper start position given the right starting column and no position", () => {
    const startColumn = 1;
    const currentPosition = move(startColumn);

    expect(currentPosition.x).toEqual(0);
    expect(currentPosition.y).toEqual(1);
  });

  it("returns the proper position if given one and ignores the start value", () => {
    const startColumn = 1;
    const position = new Position(0,1)
    const currentPosition = move(startColumn, position, smallTestTrackingMine);

    expect(currentPosition.x).toEqual(1);
    expect(currentPosition.y).toEqual(0);
  });
});
