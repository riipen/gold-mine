import Position from "./position.js";

let movedRight = false;
let movedUp = false;
let movedDown = false;

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
  let startingPosition;
  let newX;
  let newY;

  // If position is undefined, find the optimal starting position
  if (!position) {
    let maxValue = 0;
    let maxPositionY = [];

    // Find all starting positions with the maximum value
    for (let i = 0; i < mine.length; i++) {
      if (mine[i][0] > maxValue) {
        maxValue = mine[i][0];
        maxPositionY = [i];
      } else if (mine[i][0] === maxValue) {
        maxPositionY.push(i);
      }
    }

    // Choose the starting position closest to the middle (for more potential options)
    let middlePosition = Math.floor(mine.length/2);
    let distanceFromMiddle;

    for (let i = 0; i < maxPositionY.length; i++) {
      if (!distanceFromMiddle) {
        startingPosition = maxPositionY[i];
        distanceFromMiddle = Math.abs(maxPositionY[i] - middlePosition);
      } else {
        if (Math.abs(maxPositionY[i] - middlePosition) < distanceFromMiddle) {
          startingPosition = maxPositionY[i];
          distanceFromMiddle = Math.abs(maxPositionY[i] - middlePosition);
        }
      }
    }

    newX = 0;
    newY = startingPosition;

    // console.log('possible starting positions: ', maxPositionY);
    // console.log('starting position: ', newY);
    // console.log('starting value: ', maxValue);
  } else { // if position is defined, check to see what the next best move is and move.
    newX = position.x + 1;

    let nextValues = [];
    let nextDirections = [];

    // Record values for up, right, and down. If it moves off the grid, ignore that value.
    if (position.y - 1 >= 0) {
      nextValues.push(mine[position.y - 1][newX]);
      nextDirections.push('up');
    }
    nextValues.push(mine[position.y][newX]);
    nextDirections.push('right');
    if (position.y + 1 < mine[0].length) {
      nextValues.push(mine[position.y + 1][newX]);
      nextDirections.push('down');
    }

    // Find the maximum value and direction
    let maxValue = Math.max(...nextValues);
    let maxIndex = nextValues.indexOf(maxValue);
    let maxDirection = nextDirections[maxIndex];

    // If the maximum value is a repeat of the last direction, remove that option.
    if ((movedUp && maxDirection === 'up') || (movedRight && maxDirection === 'right') || (movedDown && maxDirection === 'down')) {
      nextValues.splice(maxIndex, 1);
      nextDirections.splice(maxIndex, 1);

      maxValue = Math.max(...nextValues);
      maxIndex = nextValues.indexOf(maxValue);
      maxDirection = nextDirections[maxIndex];
    }

    // Reset moved values
    movedUp = false;
    movedRight = false;
    movedDown = false;

    // Make the move
    if (maxDirection === 'up') {
      newY = position.y - 1;
      movedUp = true;
    } else if (maxDirection === 'right') {
      newY = position.y;
      movedRight = true;
    } else if (maxDirection === 'down') {
      newY = position.y + 1;
      movedDown = true;
    }

    // console.log(position);
    // console.log('current value: ', mine[newY][newX]);
    // console.log('next values: ', nextValues);
    // console.log('next directions: ', nextDirections, '- go', maxDirection);
  }

  return new Position(newX, newY);
};

export default move;
