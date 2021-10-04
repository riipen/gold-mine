import Position from "./position.js";

let _MovedRight, _MovedDiagonalUp, _MovedDiagonalDown
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

  if(!position) {
    return new Position(0, 0);
  }

  let RightScore = -1;
  let DiagonalUpScore = -1;
  let DiagonalDownScore = -1;

  // move right
  let moveRightPosition = new Position(position.x + 1, position.y);
  if(!_MovedRight){
    RightScore = recursive(mine, moveRightPosition, true, false, false, 0);
  }
  
  // move diagonal up
  let moveDiagonalUpPosition = new Position(position.x + 1, position.y + 1);
  if(!_MovedDiagonalUp){
    DiagonalUpScore = recursive(mine, moveDiagonalUpPosition, false, true, false, 0);
  }

  // move diagonal down
  let moveDiagonalDownPosition = new Position(position.x + 1, position.y - 1);
  if(!_MovedDiagonalDown){
    DiagonalDownScore = recursive(mine, moveDiagonalDownPosition, false, false, true, 0);
  }

  // console.log({RightScore, DiagonalUpScore, DiagonalDownScore})

  if(RightScore>= DiagonalUpScore && RightScore>= DiagonalDownScore){
    _MovedRight = true;
    _MovedDiagonalUp = false;
    _MovedDiagonalDown = false;
    return moveRightPosition
  }
  if(DiagonalUpScore>= RightScore && DiagonalUpScore>= DiagonalDownScore){
    _MovedRight = false;
    _MovedDiagonalUp = true;
    _MovedDiagonalDown = false;
    return moveDiagonalUpPosition
  }
  if(DiagonalDownScore>= RightScore && DiagonalDownScore>= DiagonalUpScore){
    _MovedRight = false;
    _MovedDiagonalUp = false;
    _MovedDiagonalDown = true;
    return moveDiagonalDownPosition
  }

  // return Math.max(RightScore, DiagonalUpScore, DiagonalDownScore);

};


/**
 *
 * This recursive function should runs until it collects the max number of gold
 *
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {object} givenposition - The current position of the miner, will be undefined on the first move.
 *
 * @return {Position} The new position of the miner.
 */
const recursive = (mine, givenposition, movedRight, movedDiagonalUp, movedDiagonalDown, score) => {
  let position = new Position(givenposition.x, givenposition.y);

  if(!position.isValid(mine)){
    return score;
  } 

  // console.log(position)
  score += mine[position.y][position.x];

  let RightScore = score;
  let DiagonalUpScore = score;
  let DiagonalDownScore = score;

  if(!movedRight) {
    let moveRightPosition = new Position(position.x + 1, position.y);
    if(moveRightPosition.isValid(mine)){
      RightScore = recursive(mine, moveRightPosition, true, false, false, score);
    }
  }
  if(!movedDiagonalUp) {
    let moveDiagonalUpPosition = new Position(position.x + 1, position.y + 1);
    if(moveDiagonalUpPosition.isValid(mine)){
      DiagonalUpScore = recursive(mine, moveDiagonalUpPosition, false, true, false, score);
    }
  }
  if(!movedDiagonalDown) {
    let moveDiagonalDownPosition = new Position(position.x + 1, position.y - 1);
    if(moveDiagonalDownPosition.isValid(mine)){
      DiagonalDownScore = recursive(mine, moveDiagonalDownPosition, false, false, true, score);
    } 
  }
  return Math.max(RightScore, DiagonalUpScore, DiagonalDownScore);
}

export default move;
