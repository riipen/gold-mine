import Position from "./position.js";

//let movedRight;
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
const move = (mine, position) => {
  // TODO: write logic for miner. The current approach naive approach is to simply:
  //   1. Start at (0,0)
  //   2. Always moves right

  // Greedy Algorithm
  

  const newX = (position && position.x + 1) || 0;
  let moveOps = Array(-1,0,1);

  let newY;


  if (position) {
    let currY = position.y;
    let currMax = 0;
    for (var i = 0; i < moveOps.length; i++) {

      if (moveOps[i] === currDirection) {
        continue;
      }
      else {
        let tmpPosition = new Position(newX, currY + moveOps[i]);
        
        if (currY + moveOps[i] >= 0 && currY + moveOps[i] < mine.length) {
          if (mine[currY + moveOps[i]][newX] >= currMax) {
            currMax = mine[currY + moveOps[i]][newX];
            newY = currY + moveOps[i];
          }
        }
      }

    }

    currDirection = newY - currY;
    return new Position(newX, newY);    
    
  }
  else {
    newY = 0;
    return new Position(newX, newY);
  }


};

export default move;
