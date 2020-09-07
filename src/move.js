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

    // Don't repeat the same direction
    if (movedUp) {
      nextValues.splice(0, 1);
      nextDirections.splice(0, 1);
    } else if (movedRight) {
      nextValues.splice(1, 1);
      nextDirections.splice(1, 1);
    } else if (movedDown) {
      nextValues.splice(2, 1);
      nextDirections.splice(2, 1);
    }

    // Find the maximum value and direction
    let maxValue = Math.max(...nextValues);
    let maxIndex = nextValues.indexOf(maxValue);
    let maxDirection = nextDirections[maxIndex];

    // Check if you run into any zeros two steps ahead
    let twoStepsAhead = [];
    let yAdjustment;
    if (maxDirection === 'up') {
      yAdjustment = -1;
    } else if (maxDirection === 'right') {
      yAdjustment = 0;
    } else if (maxDirection === 'down') {
      yAdjustment = 1;
    }

    if (position.y - 1 + yAdjustment >= 0) {
      twoStepsAhead.push(mine[position.y - 1 + yAdjustment][newX + 1]);
    }
    twoStepsAhead.push(mine[position.y + yAdjustment][newX + 1]);
    if (position.y + 1 + yAdjustment < mine[0].length) {
      twoStepsAhead.push(mine[position.y + 1 + yAdjustment][newX + 1]);
    }

    // Don't repeat the same direction two steps ahead
    if (maxDirection === 'up') {
      twoStepsAhead.splice(0, 1);
    } else if (maxDirection === 'right') {
      twoStepsAhead.splice(1, 1);
    } else if (maxDirection === 'down') {
      twoStepsAhead.splice(2, 1);
    }

    // If there are only zeros two steps ahead, change directions
    // (There are always going to be two options two steps ahead.)
    if (twoStepsAhead[0] === 0 && twoStepsAhead[1] === 0) {
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
  }

  return new Position(newX, newY);
};

export default move;
