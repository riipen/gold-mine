import move from "./move";
import Position from "./position";

const testMine = [
  [1, 2, 2, 4, 8],
  [6, 9, 8, 7, 6],
  [6, 1, 0, 1, 1],
];

test('The runner should move to a new position', () => {
    expect(move(testMine, new Position(0,0))).toEqual({"x": 1, "y": 1});
});

// test the runner only moves right 
// test the runner doesn't choose path that is the same as last move 
// test the runner doesn't go out of bounds (top and bottom) when position top r + move =-1 for example 
// test the runner is heading for the maximum gold when choosing paths 
