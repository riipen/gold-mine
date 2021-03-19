import Position from "./position.js";

let currDirection;

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
const move = (mine, position, minTracking) => {
  // Greedy Algorithm
  let newX = (position && position.x + 1) || 0;
  let moveOps = Array(-1,0,1);

  let newY;

  let currY = position.y;
  let currMax = 0;

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
    return newPos;
  }
  else {
    currDirection = newY - currY;
    var newPos = new Position(newX, newY);
    return newPos;
  }
  


};

export default move;
