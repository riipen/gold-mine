import Position from "./position.js";
import { getPathToMaxGold } from "./utils_2.js";

let path;

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
  if (!path) {
    path = getPathToMaxGold(mine).path;
  }

  const newX = (position && position.x + 1) || 0;

  return path[newX];
};

export default move;
