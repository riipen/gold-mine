import Position from "./position.js";

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
const move = (mine, position, traceMoves, path, mineTracking) => {
  // Greedy Algorithm
  let newX = (position && position.x + 1) || 0;
  let currMax = 0;

  let rightVal;
  let rightUpVal;
  let rightDownVal;
  let rightPos = new Position(newX, position.y);
  let rightUpPos = new Position(newX, position.y - 1);
  let rightDownPos = new Position(newX, position.y + 1);
  let stepOps = traceMoves[traceMoves.length-1];

  if (rightPos.isValid(mine) && stepOps.rightFlag) {
    rightVal = mineTracking[rightPos.y][rightPos.x];
    currMax = Math.max(rightVal, currMax);
  }
  if (rightUpPos.isValid(mine) && stepOps.rightUpFlag) {
    rightUpVal = mineTracking[rightUpPos.y][rightUpPos.x];
    currMax = Math.max(rightUpVal, currMax);
  }
  if (rightDownPos.isValid(mine) && stepOps.rightDownFlag) {
    rightDownVal = mineTracking[rightDownPos.y][rightDownPos.x];
    currMax = Math.max(rightDownVal, currMax);
  }

  if (currMax === rightVal) {
    return rightPos;
  }
  if (currMax === rightDownVal) {
    return rightDownPos
  }
  if (currMax === rightUpVal) {
    return rightUpPos;
  }
  else {
    if (path.length === 1) {
      if (stepOps.rightDownFlag && newX < mine[0].length && rightDownPos.y < mine.length && rightDownPos.y >= 0) {
        return rightDownPos;
      }
      if (stepOps.rightUpFlag && newX < mine[0].length && rightUpPos.y < mine.length && rightUpPos.y >= 0) {
        return rightUpPos;
      }
      if (stepOps.rightFlag && newX < mine[0].length && rightPos.y < mine.length && rightPos.y >= 0) {
        return rightPos;
      }
    }
    else if (path.length >= 2) {
      let alternativePos = undoSteps(mine, path, traceMoves, mineTracking);
      return alternativePos;
    }

  }



};

const undoSteps = (mine, path, traceMoves, mineTracking) => {
  let currPos;
  let currOps;
  let traceBackPos;
  let traceBackOps;
  let undoCount = 0;

  while (path.length > 1) {
    if (undoCount === 2) {
      break;
    }
    currPos = path.pop();
    currOps = traceMoves.pop();
    traceBackPos = path[path.length - 1];
    traceBackOps = traceMoves[traceMoves.length - 1];
    undoCount++;
  }  
  
  if ((currPos.y - traceBackPos.y) === 0) {
    traceBackOps.rightFlag = false;
  }
  if ((currPos.y - traceBackPos.y) === 1) {
    traceBackOps.rightDownFlag = false;
  }
  if ((currPos.y - traceBackPos.y) === -1) {
    traceBackOps.rightUpFlag = false;
  }

  let alternateRightVal;
  let alternateRightUpVal;
  let alternateRightDownVal;
  let alternateRightPos = new Position(currPos.x, traceBackPos.y);
  let alternateRightUpPos = new Position(currPos.x, traceBackPos.y - 1);
  let alternateRightDownPos = new Position(currPos.x, traceBackPos.y + 1);

  if (alternateRightPos.isValid(mine) && traceBackOps.rightFlag) {
    alternateRightVal = mineTracking[alternateRightPos.y][alternateRightPos.x];
  }
  if (alternateRightUpPos.isValid(mine) && traceBackOps.rightUpFlag) {
    alternateRightUpVal = mineTracking[alternateRightUpPos.y][alternateRightUpPos.x];
  }
  if (alternateRightDownPos.isValid(mine) && traceBackOps.rightDownFlag) {
    alternateRightDownVal = mineTracking[alternateRightDownPos.y][alternateRightDownPos.x];
  }


  if (alternateRightDownVal) {
    return alternateRightDownPos;
  }
  if (alternateRightUpVal) {
    return alternateRightUpPos;
  }
  if (alternateRightVal) {
    return alternateRightPos;
  }
}


export default move;