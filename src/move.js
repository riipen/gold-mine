import Position from "./position.js";
import { getBestPath } from "./get_best_path.js";

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

let bestPath = {};

const move = async (mine, position) => {
  // Because the bestPath is closed over, a new variable isn't created each time move is called
  // We need to have something uniquely identifying about the mine to use as the key
  // Turning the first row of the mine into the key isn't great, but in this case should be unique enough
  if (!bestPath[mine[0].toString()]) {
    bestPath[mine[0].toString()] = await getBestPath(mine);
  }

  const newX = (position && position.x + 1) || 0;
  const newY = bestPath[mine[0].toString()][newX];

  return new Position(newX, newY);
};

export default move;
