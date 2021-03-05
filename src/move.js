import Position from "./position.js";

let movedRight, movedRightUp, movedRightDown;
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
   //helper function that determines the mined value if the miner moves to the right
   const getRightMoveValue = () => {  
    let newX = position.x + 1;
    let newY = position.y;
    let newPosition = new Position(newX, newY);
  
    if(newPosition.isValid(mine)){
      return mine[newX][newY];
    }

    if(mine[newX][newY] === 0) return 0
    else return null;
  }
  //helper function that determines the mined value if the miner moves to the right up 
  const getRightUpMoveValue = () => {  
    let newX = position.x + 1;
    let newY = position.y - 1;
    let newPosition = new Position(newX, newY);
  
    if(newPosition.isValid(mine)){
      return mine[newX][newY];
    }
    
    if(mine[newX][newY] === 0) return 0
    else return null;
  }
  //helper function that determines the mined value if the miner moves to the right down
  const getRightDownMoveValue = () => {  
    let newX = position.x + 1;
    let newY = position.y + 1;
    let newPosition = new Position(newX, newY);
  
    if(newPosition.isValid(mine)){
      return mine[newX][newY];
    }
    
    if(mine[newX][newY] === 0) return 0
    else return null;
  }

  if(!position) return new Position(0, 0);

  if(movedRight){
    let rightUpMoveValue = getRightUpMoveValue();
    let rightDownMoveValue = getRightDownMoveValue();

    let maxValue = Math.max(rightUpMoveValue, rightDownMoveValue);

    if(maxValue === rightUpMoveValue){
      movedRightUp = true;
      movedRight = false;
      movedRightDown = false;
      return new Position(position.x + 1, position.y - 1);
    } 
    if(maxValue === rightDownMoveValue){
      movedRightDown = true;
      movedRight = false;
      movedRightUp = false;
      return new Position(position.x + 1, position.y + 1);
    }

  } else if (movedRightUp){
    let rightMoveValue = getRightMoveValue();
    let rightDownMoveValue = getRightDownMoveValue();

    let maxValue = Math.max(rightMoveValue, rightDownMoveValue);

    if(maxValue === rightMoveValue){
      movedRight = true;
      movedRightUp = false;
      movedRightDown = false;
      return new Position(position.x + 1, position.y);
    } 
    if(maxValue === rightDownMoveValue){
      movedRightDown = true;
      movedRight = false;
      movedRightUp = false;
      return new Position(position.x + 1, position.y + 1);
    }

  } else if (movedRightDown){
    let rightMoveValue = getRightMoveValue();
    let rightUpMoveValue = getRightUpMoveValue();

    let maxValue = Math.max(rightMoveValue, rightUpMoveValue);

    if(maxValue === rightMoveValue){
      movedRight = true;
      movedRightUp = false;
      movedRightDown = false;
      return new Position(position.x + 1, position.y);
    } 
    if(maxValue === rightUpMoveValue){
      movedRightUp = true;
      movedRight = false;
      movedRightDown = false;
      return new Position(position.x + 1, position.y - 1);
    } 

  } else {
    let rightMoveValue = getRightMoveValue();
    let rightUpMoveValue = getRightUpMoveValue();
    let rightDownMoveValue = getRightDownMoveValue();

    let maxValue = Math.max(rightMoveValue, rightUpMoveValue, rightDownMoveValue);

    if(maxValue === rightMoveValue){
      movedRight = true;
      movedRightUp = false;
      movedRightDown = false;
      return new Position(position.x + 1, position.y);
    } 
    if(maxValue === rightUpMoveValue){
      movedRightUp = true;
      movedRight = false;
      movedRightDown = false;
      return new Position(position.x + 1, position.y - 1);
    } 
    if(maxValue === rightDownMoveValue){
      movedRightDown = true;
      movedRight = false;
      movedRightUp = false;
      return new Position(position.x + 1, position.y + 1);
    }
  }
};

export default move;
