import Position from "./position.js";

const MOVES = {
  UP: "up",
  RIGHT: "right",
  DOWN: "down",
};

function buildPath(mine) {
  let mineLength = mine[0].length;
  let path = {};
  let lastMove = MOVES.UP;

  path[0] = new Position(0, Math.floor(mine.length / 2));

  for (let i = 0; i < mineLength; i++) {
    const newX = path[i].x + 1;
    let newY;
    // mine[row][col]

    let gold = getGold(path[i], mine, newX);

    if (lastMove === MOVES.UP) {
      // go right or down
      if (gold.right > gold.down) {
        // go right
        newY = path[i].y;
        lastMove = MOVES.RIGHT;
      } else {
        // go down
        newY = path[i].y + 1;
        lastMove = MOVES.DOWN;
      }
    } else if (lastMove === MOVES.RIGHT) {
      // go up or down
      if (gold.up > gold.down) {
        // go up
        newY = path[i].y - 1;
        lastMove = MOVES.UP;
      } else {
        // go down
        newY = path[i].y + 1;
        lastMove = MOVES.DOWN;
      }
    } else if (lastMove === MOVES.DOWN) {
      // go up or right
      if (gold.up > gold.right) {
        // go up
        newY = path[i].y - 1;
        lastMove = MOVES.UP;
      } else {
        // go right
        newY = path[i].y;
        lastMove = MOVES.RIGHT;
      }
    }

    path[i + 1] = new Position(newX, newY);
  }

  return path;
}

function getGold(curPosition, mine, newX) {
  let gold = {};

  if (curPosition.y - 1 >= 0) {
    gold.up = mine[curPosition.y - 1][newX];
  }

  if (newX < mine[0].length) {
    gold.right = mine[curPosition.y][newX];
  }

  if (curPosition.y + 1 < mine.length) {
    gold.down = mine[curPosition.y + 1][newX];
  }

  return gold;
}

export default buildPath;
export { getGold };
