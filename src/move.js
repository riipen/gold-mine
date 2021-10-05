import Position from "./position.js";

let _Route;
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
 * @param  {Position} position - The current position of the miner, will be undefined on the first move
 *
 * @return {Position} The new position of the miner.
 */
const move = (mine, position) => {

  if(!position) {
    let max = 0;
    let posY = 0;
    // Get best starting position by looping thru all possible Y cases.
    for(let i = 0; i < mine.length; i++){
      let testY = new Position(0, i);
      let rec = recursive(mine, testY, false, false, false, 0, {});
      if(rec.score >= max){
        max = rec.score;
        posY = i;
        // Store the optimal route passed so subsequent calls would just make use of the route and not try recurssion again.
        _Route = rec.route;
      }
    }
    return new Position(0, posY);
  } else {
    // Make use of the best route which has been stored from first round.
    let positionString = _Route[position.toString()].next.split(',');
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
 * @return {object} An Object containing the max gold and total route passed.
 */
const recursive = (mine, givenposition, movedRight, movedDiagonalUp, movedDiagonalDown, score, route) => {
  let position = new Position(givenposition.x, givenposition.y);

  if(!position.isValid(mine)){
    return {score, route};
  } 

  let currentGold = mine[position.y][position.x];
  score += currentGold

  let RightScore = {score, route};
  let DiagonalUpScore = {score, route};
  let DiagonalDownScore = {score, route};

  // If previous route was not right, try going right.
  if(!movedRight) {
    let moveRightPosition = new Position(position.x + 1, position.y);
    if(moveRightPosition.isValid(mine)){
      let nex = {...route};
      nex[position.toString()] = {next:moveRightPosition.toString(), currentGold, score}
      // checks if we've passed this route
      if(_Route && _Route[position.toString()] && _Route[position.toString()].next === moveRightPosition.toString()){
        // Since route has once been passed thru, no need for recursion, Just merge the route
        RightScore = passedThru(position.toString(), nex);
      } else {
        RightScore = recursive(mine, moveRightPosition, true, false, false, score, nex);
      }
    }
  }
  // If previous route was not diagonal up, try going diagonal up.
  if(!movedDiagonalUp) {
    let moveDiagonalUpPosition = new Position(position.x + 1, position.y + 1);
    if(moveDiagonalUpPosition.isValid(mine)){
      let nex = {...route};
      nex[position.toString()] = {next:moveDiagonalUpPosition.toString(), currentGold, score}
      // checks if we've passed this route
      if(_Route && _Route[position.toString()] && _Route[position.toString()].next === moveDiagonalUpPosition.toString()){
        // Since route has once been passed thru, no need for recursion, Just merge the route
        DiagonalUpScore = passedThru(position.toString(), nex);
      } else {
        DiagonalUpScore = recursive(mine, moveDiagonalUpPosition, false, true, false, score, nex);
      }
    }
  }
  // If previous route was not diagonal down, try going diagonal down.
  if(!movedDiagonalDown) {
    let moveDiagonalDownPosition = new Position(position.x + 1, position.y - 1);
    if(moveDiagonalDownPosition.isValid(mine)){
      let nex = {...route};
      nex[position.toString()] = {next:moveDiagonalDownPosition.toString(), currentGold, score}
      // checks if we've passed this route
      if(_Route && _Route[position.toString()] && _Route[position.toString()].next === moveDiagonalDownPosition.toString()){
        // Since route has once been passed thru, no need for recursion, Just merge the route
        DiagonalDownScore = passedThru(position.toString(), nex);
      } else {
        DiagonalDownScore = recursive(mine, moveDiagonalDownPosition, false, false, true, score, nex);
      }
    } 
  }
  
  // Return the maximum score together with the route it took. So we don't need to come here again
  let max = Math.max(RightScore.score, DiagonalUpScore.score, DiagonalDownScore.score);
  if(RightScore.score === max) return RightScore;
  if(DiagonalUpScore.score === max) return DiagonalUpScore;
  if(DiagonalDownScore.score === max) return DiagonalDownScore;
}

/**
 *
 * This passedThru function merges the best route that has been passed from a position to the current route.
 * This is done so u won't need to start finding best routes again.
 *
 * @param  {Position} position - The current position of the miner.
 * @param  {object} route - The route passed so far.
 *
 * @return {object} An Object containing the max gold and total route passed.
 */
const passedThru = (position, route) => {
  // A running tally of the score
  let score = route[position.toString()].score + route[position.toString()].currentGold;

  let positionString = route[position.toString()].next.split(',');
  let nextPosition = new Position(parseInt(positionString[0]), parseInt(positionString[1]));

  while (_Route[nextPosition.toString()]) {
    score += _Route[nextPosition.toString()].currentGold;
    route[nextPosition.toString()] = {..._Route[nextPosition.toString()], score};
    positionString = route[nextPosition.toString()].next.split(',');
    nextPosition = new Position(parseInt(positionString[0]), parseInt(positionString[1]));
  }

  return {score, route};
}

export default move;
