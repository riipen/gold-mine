import move from "../move.js";
import mine from "../../mines/jupiter.js";

describe("move", () => {
  test("it returns the first position at (0,0)", () => {
    let position = move(mine);

    expect(position.x).toEqual(0);
    expect(position.y).toEqual(0);
  });

  test("it returns a new position after the first move", () => {
    let position = move(mine, move(mine));

    expect(position.x).toEqual(1);
    expect(position.y).toEqual(0);
  });
});
