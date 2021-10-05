import Position from "./position.js";

let _route;
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
    let max = 0;
    let posY = 0;
    let rut = {};
    // Get best starting position by looping thru all possible Y cases.
    for(let i = 0; i < mine.length; i++){
      let testY = new Position(0, i);
      let rec = recursive(mine, testY, false, false, false, 0, {});
      let calc = rec.score;
      if(calc >= max){
        rut = rec;
        max = calc;
        posY = i;
      }
    }
    // Store the optimal route passed so subsequent calls would just make use of the route and not try recurssion again.
    _route = rut.route;
    return new Position(0, posY);
  } else {
    // Make use of the best route which has been stored from first round.
    let positionString = _route[position.toString()].split(',');
    return new Position(parseInt(positionString[0]), parseInt(positionString[1]));
  }

};


/**
 *
 * This recursive function should runs until it collects the max number of gold
 *
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {object} givenposition - The current position of the miner, will be undefined on the first move.
 *
 * @return {object} An Object containing the max gold and route passed.
 */
const recursive = (mine, givenposition, movedRight, movedDiagonalUp, movedDiagonalDown, score, route) => {
  let position = new Position(givenposition.x, givenposition.y);

  if(!position.isValid(mine)){
    return {score, route};
  } 

  score += mine[position.y][position.x];

  let RightScore = {score, route};
  let DiagonalUpScore = {score, route};
  let DiagonalDownScore = {score, route};

  // If previous route was not right, try going right.
  if(!movedRight) {
    let moveRightPosition = new Position(position.x + 1, position.y);
    if(moveRightPosition.isValid(mine)){
      let nex = {...route};
      nex[position.toString()] = moveRightPosition.toString();
      RightScore = recursive(mine, moveRightPosition, true, false, false, score, nex);
    }
  }
  // If previous route was not diagonal up, try going diagonal up.
  if(!movedDiagonalUp) {
    let moveDiagonalUpPosition = new Position(position.x + 1, position.y + 1);
    if(moveDiagonalUpPosition.isValid(mine)){
      let nex = {...route};
      nex[position.toString()] = moveDiagonalUpPosition.toString();
      DiagonalUpScore = recursive(mine, moveDiagonalUpPosition, false, true, false, score, nex);
    }
  }
  // If previous route was not diagonal down, try going diagonal down.
  if(!movedDiagonalDown) {
    let moveDiagonalDownPosition = new Position(position.x + 1, position.y - 1);
    if(moveDiagonalDownPosition.isValid(mine)){
      let nex = {...route};
      nex[position.toString()] = moveDiagonalDownPosition.toString();
      DiagonalDownScore = recursive(mine, moveDiagonalDownPosition, false, false, true, score, nex);
    } 
  }
  
  // Return the maximum score together with the route it took. So we don't need to come here again
  let max = Math.max(RightScore.score, DiagonalUpScore.score, DiagonalDownScore.score);
  if(RightScore.score === max) return RightScore;
  if(DiagonalUpScore.score === max) return DiagonalUpScore;
  if(DiagonalDownScore.score === max) return DiagonalDownScore;
}

export default move;
