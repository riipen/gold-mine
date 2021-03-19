import Position from "./position.js";

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
  let newX = (position && position.x + 1) || 0;
  let moveOps = Array(-1,0,1);

  let newY;

  let currY = position.y;
  let currMax = 0;
  if (!invalidFlag) {
    for (var i = 0; i < moveOps.length; i++) {
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

    if (currMax === 0) {
      invalidFlag = true;
    }

  }
  else {
    if (newX === 1) {
      invalidFlag = true;
    }
    else if (newX === 2) {
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