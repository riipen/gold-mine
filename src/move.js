import Position from "./position.js";
import { findBestStartY, getTopRightValue, getRightValue, getBottomRightValue, getNewPosition } from "./helpers.js";
import Directions from "./directions.js";

let lastMove;

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

  // position is undefined means first move, so find best start
  if (position === undefined) {
    return new Position(0, findBestStartY(mine));
  }

  let currentMove;
  let moveOpts = [];
  let bestValue = 0;
  
  // Add any valid moves and their resulting gold values
  if (lastMove === undefined || lastMove !== Directions.TOPRIGHT)
    moveOpts[Directions.TOPRIGHT] = getTopRightValue(mine, position);

  if (lastMove  === undefined || lastMove !== Directions.RIGHT)
    moveOpts[Directions.RIGHT] = getRightValue(mine, position);
  
  if (lastMove  === undefined || lastMove !== Directions.BOTRIGHT)
    moveOpts[Directions.BOTRIGHT] = getBottomRightValue(mine, position);

  // Find best move
  Object.keys(moveOpts).forEach((direction) => {
    if (moveOpts[direction] > bestValue) {
      bestValue = moveOpts[direction];
      currentMove = direction;
    }
  });

  // No more moves left, take first available move and end mining session.
  if (currentMove === undefined) {
    return new Position(position.x+1, position.y+1);
  }

  lastMove = currentMove;
  return getNewPosition(position, currentMove);
};

export default move;
