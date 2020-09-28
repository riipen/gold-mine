import move from "../src/move.js";
import mine from "../mines/luna.js";
import Position from "../src/position.js";

describe(("testing move module") => {

  test('gets score starting at top', () => {
    let position = new Position(0,0);
    expect(move(mine, position).toEqual(new Position(9,1));
  });

  test('gets score starting at bottom', () => {
    let position = new Position(0, mine.length - 1);
    expect(move(mine, position)).toEqual(new Position(8,7));
  });

  test('gets score starting (0,3) in the first column', () => {
    let position = new Position(0, 3);
    expect(move(mine, position)).toEqual(new Position(9,5));
  });

  test('gets starting position to be (0,0) when not providing a position', () => {
    expect(move(mine)).toEqual(new Position(0,0));
  });
})
