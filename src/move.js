import { isFirstMove, getFirstPosition, getNextPosition } from "./helper.js";

let firstMove = true;
let lastMove = "";

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
  if (firstMove) {
    firstMove = false;
    return getFirstPosition(mine);
  }

  const { nextPosition, move } = getNextPosition(mine, lastMove, position);
  lastMove = move;
  firstMove = isFirstMove(mine, nextPosition);
  return nextPosition;
};

export default move;
