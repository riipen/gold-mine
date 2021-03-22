import Position from "./position.js";

// Cache the current, previous and secondary previous direction
let currDirection;
let prevDirection;
let secondaryPrevDirection;

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
const move = (mine, position, path, invalidFlag) => {
  // Greedy Algorithm

  // Initialize the new position
  let newX = (position && position.x + 1) || 0;
  let moveOps = Array(-1,0,1);

  let newY;

  let currY = position.y;
  let currMax = 0;

  // If we haven't hit an invalid position, just choose the max position from next position
  // Make sure the new move does not duplicate the current cached direction.
  if (!invalidFlag) {
    for (var i = 0; i < moveOps.length; i++) {
      // If the position is in the first column, then we can choose 3 different directions
      // If the position is not in the first column, then we need to avoid the current cached direction
      if (newX === 1) {
        let tmpPosition = new Position(newX, currY + moveOps[i]);
        if (tmpPosition.isValid(mine)) {
          if (mine[currY + moveOps[i]][newX] > currMax) {
            currMax = mine[currY + moveOps[i]][newX];
            newY = currY + moveOps[i];
          }
        }
      }
      else {
        if (moveOps[i] === currDirection) {
          continue;
        }
        else {
          let tmpPosition = new Position(newX, currY + moveOps[i]);
          if (tmpPosition.isValid(mine)) {
            if (mine[currY + moveOps[i]][newX] > currMax) {
              currMax = mine[currY + moveOps[i]][newX];
              newY = currY + moveOps[i];
            }
          }
        }
      }
  
    }

    // If all temporary (next) positions are invalid, then it is invalid.
    if (currMax === 0) {
      invalidFlag = true;
    }

  }
  else {

    // If start position is surrounded by invalid positions, then turn on the invalid flag
    if (newX === 1) {
      invalidFlag = true;
    }
    else if (newX === 2) {
      // If position is in the second column, then we need to undo one step and then
      // choose the remain directions other than the current cached direction.
      let currPosition = path.pop();
      let altMax = 0;
      newX = currPosition.x;
      currY = path[path.length-1].y;
      for (var i = 0; i < moveOps.length; i++) {

        if (moveOps[i] === currDirection) {
          continue;
        }
        else {
          let tmpPosition = new Position(newX, currY + moveOps[i]);
          if (tmpPosition.isValid(mine)) {
            if (mine[currY + moveOps[i]][newX] > altMax) {
              altMax = mine[currY + moveOps[i]][newX];
              newY = currY + moveOps[i];
            }
          }
        }
    
      }

      if (altMax === 0) {
        invalidFlag = true;
      }
      else {
        invalidFlag = false;
      }

    }
    else if (newX === 3) {

      // If position is in the third column, then we need to undo two steps and then
      // choose the remain directions other than the current cached direction and previous cached direction.
      let currPosition = path.pop();
      prevDirection = path[path.length-1].y - path[path.length - 2].y;
      let altMax = 0;
      newX = currPosition.x;
      currY = path[path.length-1].y;

      for (var i = 0; i < moveOps.length; i++) {
        if (moveOps[i] === currDirection || moveOps[i] === prevDirection) {
          continue;
        }
        else {
          let tmpPosition = new Position(newX, currY + moveOps[i]);
          if (tmpPosition.isValid(mine)) {
            if (mine[currY + moveOps[i]][newX] > altMax) {
              altMax = mine[currY + moveOps[i]][newX];
              newY = currY + moveOps[i];
            }
          }
        }
      }

      if (altMax === 0) {
        invalidFlag = true;
      }
      else {
        invalidFlag = false;
      }

    }
    else {

      // If position is in the other columns, then we need to undo three steps and then
      // choose the remain directions other than the previous cached direction and secondary direction.
      let currPosition = path.pop();
      prevDirection = path[path.length-1].y - path[path.length - 2].y;
      let prevPosition = path.pop();
      secondaryPrevDirection = path[path.length-1].y - path[path.length - 2].y;
      let altMax = 0;
      newX = prevPosition.x;
      currY = path[path.length-1].y;

      for (var i = 0; i < moveOps.length; i++) {
        if (moveOps[i] === secondaryPrevDirection || moveOps[i] === prevDirection) {
          continue;
        }
        else {
          let tmpPosition = new Position(newX, currY + moveOps[i]);
          if (tmpPosition.isValid(mine)) {
            if (mine[currY + moveOps[i]][newX] > altMax) {
              altMax = mine[currY + moveOps[i]][newX];
              newY = currY + moveOps[i];
            }
          }
        }
      }

      if (altMax === 0) {
        invalidFlag = true;
      }
      else {
        invalidFlag = false;
      }
    }
  }

  // If we haven't hit any invalid position, but we still didn't get the newY
  // by greedy algorithm, then just choose a none zero next position.
  if (!invalidFlag) {
    if (typeof newY === 'undefined') {
      for (var i = 0; i < moveOps.length; i++) {
        if (moveOps[i] === currDirection) {
          continue;
        }
        if (currY + moveOps[i] >= 0 && currY + moveOps[i] < mine.length) {
          newY = currY + moveOps[i];
        }
      }
      currDirection = newY - currY;
      var newPos = new Position(newX, newY);
      return  {'position': newPos, 'invalidFlag': false};
    }
    else {
      currDirection = newY - currY;
      var newPos = new Position(newX, newY);
      return  {'position': newPos, 'invalidFlag': false};
    }
  }
  else {
    // If we have hit the invalid position columns other than the first column, but we still didn't get the newY
    // by greedy algorithm, then just choose a none zero next position. (Watch for cached directions)
    if (newX === 2) {
      if (typeof newY === 'undefined') {
        for (var i = 0; i < moveOps.length; i++) {
          if (moveOps[i] === currDirection) {
            continue;
          }
          if (currY + moveOps[i] >= 0 && currY + moveOps[i] < mine.length) {
            newY = currY + moveOps[i];
          }
        }
        currDirection = newY - currY;
        var newPos = new Position(newX, newY);
        return  {'position': newPos, 'invalidFlag': true};
      }
      else {
        currDirection = newY - currY;
        var newPos = new Position(newX, newY);
        return  {'position': newPos, 'invalidFlag': true};
      }
    }

    else if (newX === 3) {
      if (typeof newY === 'undefined') {
        for (var i = 0; i < moveOps.length; i++) {
          if (moveOps[i] === currDirection && moveOps[i] === prevDirection) {
            continue;
          }
          if (currY + moveOps[i] >= 0 && currY + moveOps[i] < mine.length) {
            newY = currY + moveOps[i];
          }
        }
        currDirection = newY - currY;
        var newPos = new Position(newX, newY);
        return  {'position': newPos, 'invalidFlag': true};
      }
      else {
        currDirection = newY - currY;
        var newPos = new Position(newX, newY);
        return  {'position': newPos, 'invalidFlag': true};
      }
    }
    else {
      if (typeof newY === 'undefined') {
        for (var i = 0; i < moveOps.length; i++) {
          if (moveOps[i] === prevDirection && moveOps[i] === secondaryPrevDirection) {
            continue;
          }
          if (currY + moveOps[i] >= 0 && currY + moveOps[i] < mine.length) {
            newY = currY + moveOps[i];
          }
        }
        currDirection = newY - currY;
        var newPos = new Position(newX, newY);
        return  {'position': newPos, 'invalidFlag': true};
      }
      else {
        currDirection = newY - currY;
        var newPos = new Position(newX, newY);
        return  {'position': newPos, 'invalidFlag': true};
      }
    }
    
  }
  


};

export default move;