import Position from "./position.js";
import buildPath from "./build_path.js";

let pathToTake = {};

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
    pathToTake = buildPath(mine);

    let startPosition = pathToTake[0];

    return startPosition;
  }

  // every time we make a move we will return the Position of the best move
  // from our pathToTake
  let nextPosition = pathToTake[position.x + 1];
  return nextPosition;
};

export default move;
