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

  // Keep track of all possible new positions and new values
  let rightVal;
  let rightUpVal;
  let rightDownVal;
  let rightPos = new Position(newX, position.y);
  let rightUpPos = new Position(newX, position.y - 1);
  let rightDownPos = new Position(newX, position.y + 1);
  let stepOps = traceMoves[traceMoves.length-1];

  // Get the maximum move based on DP table not the original mine
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

  // If we can get the maximum from current move, then return
  // the new(max) position immediately
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
    // If we can't get the maximum from the current move then we need to undo certain number of moves
    // If we are just on the first column
    // Just choose one of the valid move.
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
      // If we are not on the first column, then we can undo more moves.
      let alternativePos = undoSteps(mine, path, traceMoves, mineTracking);
      return alternativePos;
    }

  }



};


// Any mining path that can get through the last column
// can be the candidate of the maximum path.
// So if we hit the invalid position before
// the last column we can try to undo the current move, 
// and try the alternative direction.
const undoSteps = (mine, path, traceMoves, mineTracking) => {
  let currPos;
  let currOps;
  let traceBackPos;
  let traceBackOps;
  let undoCount = 0;

  // We always trace back until the original starting point
  // But actually we need to make undoCount to a minimal number
  // Because what we have already been through are mostly greedy
  // moves.
  while (path.length > 1) {
    if (undoCount === 1) {
      break;
    }
    currPos = path.pop();
    currOps = traceMoves.pop();
    traceBackPos = path[path.length - 1];
    traceBackOps = traceMoves[traceMoves.length - 1];
    undoCount++;
  }  
  
  // We know the current position will and moves will
  // lead us to the dead end (invalid position on all direcitons)
  // So we can't go to these position again.
  if ((currPos.y - traceBackPos.y) === 0) {
    traceBackOps.rightFlag = false;
  }
  if ((currPos.y - traceBackPos.y) === 1) {
    traceBackOps.rightDownFlag = false;
  }
  if ((currPos.y - traceBackPos.y) === -1) {
    traceBackOps.rightUpFlag = false;
  }

  // Start the alternative move.
  let alternateRightVal;
  let alternateRightUpVal;
  let alternateRightDownVal;
  let alternateRightPos = new Position(currPos.x, traceBackPos.y);
  let alternateRightUpPos = new Position(currPos.x, traceBackPos.y - 1);
  let alternateRightDownPos = new Position(currPos.x, traceBackPos.y + 1);

  // Choose the one of the valid move.
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