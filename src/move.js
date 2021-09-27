import Position from "./position.js";

let movedRight;
let movedRightUp;
let movedRightDown;

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

  let newX = (position && position.x + 1) || 0;
  let newY = (position && position.y) || 0;

    //initializing next moves
    let right = mine[newY][newX]
    let rightUp = (newY === 0) ? 0 : mine[newY-1][newX]
    let rightDown = (newY === mine.length-1) ? 0 : mine[newY+1][newX]

    if (!movedRight && (movedRightUp || movedRightDown) && ((right > rightUp) && (right > rightDown))) {
    
      newY = (position && position.y) || 0;
  
      movedRight = true;
      movedRightUp = false;
      movedRightDown = false; 
      
    } else if (!movedRightUp && (movedRight || movedRightDown) && ( (rightUp > rightDown))){
      //checking rightup if it hasnt been visited and if it is greater.
      newY = (position && position.y - 1) || 0;
  
      movedRight = false;
      movedRightUp = true;
      movedRightDown = false; 
    
    } else {
      //It will look into this case if previous two cases are not successful.
  
      if (!movedRightDown && (movedRight || movedRightUp) && rightDown !== 0) {
       //It will check the value of rightdown to make sure it hasnt been    visited in previous state and also if its value is not zero
        newY = (position && position.y + 1) || 0;
  
        movedRight = false;
        movedRightUp = false;
        movedRightDown = true;
  
      } else if (!movedRightUp && (position && position.y !== 0) && ((rightUp > right) )) {
        //If all previous cases dont meet then we will check the right again if it is greater than any of them but hasnt been visited previously we can perform this step.
        newY = (position && position.y -1) || 0;
  
        movedRightUp = true;
        movedRight = false;
        movedRightDown = false; 
  
      } else {
        //if none of the previous steps meet then we go to this step.
        newY = (position && position.y) || 0;
        
        movedRightUp = false;
        movedRight = true;
        movedRightDown = false; 
      }
    }

  return new Position(newX, newY);
};

export default move;
