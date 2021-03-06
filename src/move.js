import Position from "./position.js";

let movedRight;

/**
 * Replace the logic in this function with your own custom movement algorithm.
 *
 * This function should run in a reasonable amount of time and should attempt
 * to collect as much gold as possible.
 *
 * Remember, landing outside the mine's boundary or on a "0" on the mine will
 * result in the run completing.
 *
 * @param  {array} mine - A n x m multidimensional array representing the mine.
 * @param  {object} position - The current position of the miner, will be undefined on the first move
 *
 * @return {Position} The new position of the miner.
 */
const move = (mine, position) => {
  let currentXValue = position && position.x || 0;
  let nextXValue = position && currentXValue + 1 || 0;
  let currentYValue = position && position.y || 0;
  let nextYValue = position && currentYValue + 1 || 0;
  let newX = (position && currentXValue + 1) || 0;
  let newY;

  if (!movedRight) {
    newY = (position && currentYValue) || 0;

    movedRight = true;

    // Move Right up when the current value is bigger than the next to the right
    if (mine[currentYValue][currentXValue] > mine[nextYValue][nextXValue]) {
      newY = newY - 1;
    }

  } else {
    newY = (position && currentYValue + 1) || 0;

    movedRight = false;
  }

  return new Position(newX, newY);
};

export default move;
