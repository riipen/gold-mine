import Position from "./position.js";
import checkFutureZeroes from "./findZeroes.js";

const MOVES = {
  UP: "up",
  RIGHT: "right",
  DOWN: "down",
};

// We piece together the entire path we want to take and return it.
function buildPath(mine) {
  let mineLength = mine[0].length;
  let path = [];
  let lastMove;

  path[0] = findOptimalStart(mine);

  for (let i = 0; i < mineLength; i++) {
    const newX = path[i].x + 1;
    let newY;

    let gold = getGold(path[i], mine, newX);

    // Denote which gold we can't move to due to having made that move previously.
    if (lastMove === MOVES.UP) {
      gold[0] = -1;
    } else if (lastMove === MOVES.RIGHT) {
      gold[1] = -1;
    } else if (lastMove === MOVES.DOWN) {
      gold[2] = -1;
    }

    // Change our move if we find that we are going to hit a roadblock of two
    // zeroes.
    let index = checkFutureZeroes(gold, mine, path[i].y, newX);

    // Set the newY value to represent where we want to move. We also keep track
    // of our last move.
    if (index === 0) {
      // move up
      newY = path[i].y - 1;
      lastMove = MOVES.UP;
    } else if (index === 1) {
      // move right
      newY = path[i].y;
      lastMove = MOVES.RIGHT;
    } else {
      // move down
      newY = path[i].y + 1;
      lastMove = MOVES.DOWN;
    }

    path[i + 1] = new Position(newX, newY);
  }

  return path;
}

// We opt to find all of the best starting positions and then pick something in
// the middle.
function findOptimalStart(mine) {
  let max = 0;
  let locationsOfMax = [];

  for (let i = 0; i < mine.length; i++) {
    if (mine[i][0] > max) {
      max = mine[i][0];
      locationsOfMax = [i];
    } else if (mine[i][0] === max) {
      locationsOfMax.push(i);
    }
  }

  let startingY = locationsOfMax[Math.round((locationsOfMax.length - 1) / 2)];

  return new Position(0, startingY);
}

// Given the current position we find the 3 gold options we have for moving.
function getGold(curPosition, mine, newX) {
  let gold = [];

  if (curPosition.y - 1 >= 0) {
    gold[0] = mine[curPosition.y - 1][newX];
  }

  if (newX < mine[0].length) {
    gold[1] = mine[curPosition.y][newX];
  }

  if (curPosition.y + 1 < mine.length) {
    gold[2] = mine[curPosition.y + 1][newX];
  }

  return gold;
}

export default buildPath;
export { findOptimalStart };
export { getGold };
