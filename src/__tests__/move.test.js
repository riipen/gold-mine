import move from "../move";

const smallTestMine = [
  [1, 7, 5],
  [2, 3, 9],
  [1, 4, 1],
];

describe("move function mine tests", () => {
  it("returns (0,0) if no starting point is given", () => {
    const currentPosition = move(smallTestMine);

    expect(currentPosition.x).toEqual(0);
    expect(currentPosition.y).toEqual(0);
  });

  it("returns the next best position", () => {
    const currentPosition = move(smallTestMine, move(smallTestMine));
    expect(currentPosition.x).toEqual(1);
    expect(currentPosition.y).toEqual(0);
  });
});
