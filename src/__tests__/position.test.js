import Position from "../position.js";

describe("position", () => {
  test("it initializes an x and y value", () => {
    let position = new Position(2, 3);

    expect(position.x).toEqual(2);
    expect(position.y).toEqual(3);
  });
});
