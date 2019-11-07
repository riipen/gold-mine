import Position from './position.js';
import findOptimalSolution from './moveHelper.js';
let movedRight;
let bestPath = {};
let index = 0;

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
  if (index === 0) {
    // This is the first move of the mine
    // Calculate the optimum path to maximize gold
    bestPath = findOptimalSolution(mine);
  }
  if (bestPath.nodes[index]) {
    // Find the coordinates for this move
    const coordinates = bestPath.nodes[index].split(',');
    const newX = parseInt(coordinates[0]);
    const newY = parseInt(coordinates[1]);
    index++;
    if (!bestPath.nodes[index]) {
      // reset the index and bestPath after a mine is finished
      index = 0;
      bestPath = {};
    }
    return new Position(newX, newY);
  }
};

export default move;
