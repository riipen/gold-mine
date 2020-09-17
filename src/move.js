import Position from "./position.js";

let movedRight;
let pathToTake = {};

const MOVES = {
  UP: "up",
  RIGHT: "right",
  DOWN: "down",
};

/**
 * Replace the logic in this function with your own custom movement algorithm.
 *
 * This function should run in a reasonable amount of time and should attempt
 * to collect as much gold as possible.
 *
 * Remember, landing outside the mine's boundary or on a "0" on the mine will
 * result in the run completing.
 *
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {object} position - The current position of the miner, will be undefined on the first move
 *
 * @return {Position} The new position of the miner.
 */
const move = (mine, position) => {
  // if we are entering move for the first time with no position, get the best
  // path.
  if (!position) {
    pathToTake = getBestPath(mine);

    let startPosition = pathToTake[0];

    return startPosition;
  }

  // // every time we make a move we will return the Position of the best move
  // // from our pathToTake
  let nextPosition = pathToTake[position.x + 1];
  return nextPosition;
};

function getBestPath(mine) {
  let mineLength = mine[0].length;
  let mineHeight = mine.length;
  let path = {};
  let lastMove = MOVES.UP;

  path[0] = new Position(0, 0);

  for (let i = 0; i < mineLength; i++) {
    const newX = path[i].x + 1;
    let newY;
    // mine[row][col]

    let up;
    let right;
    let down;

    if (path[i].y - 1 > 0) {
      up = mine[path[i].y - 1][newX];
    }

    if (newX < mineLength) {
      right = mine[path[i].y][newX];
    }

    if (path[i].y + 1 < mineHeight) {
      down = mine[path[i].y + 1][newX];
    }

    if (lastMove === MOVES.UP) {
      // go right or down
      if (right > down) {
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
      if (up > down) {
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
      if (up > right) {
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

export default move;
