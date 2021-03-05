import Position from "./position.js";
const LOG_DIR = "logs";
import store from 'store';

const getValidDirections = (position, mine, lastDirection) => {
  let right = new Position(position.x, position.y);
  let diagUp = new Position(position.x, position.y - 1);
  let diagDown = new Position(position.x, position.y + 1);

  let validDirections = [];
  if (right.isValid(mine) && lastDirection !== 'right'){
    validDirections.push('right');
  }
  if (diagUp.isValid(mine) && lastDirection !== 'diagUp'){
    validDirections.push('diagUp');
  }
  if (diagDown.isValid(mine) && lastDirection !== 'diagDown'){
    validDirections.push('diagDown');
  }
  return validDirections;
}
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

  let bestGems, direction, lastDirection, lastPosition, validDirections;

  //initialize bestGems and direction which store best direction to move to
  [bestGems, direction] = [0, null];

  let newX;
  let newY;

  //if position is undefined its the very first move.
  if (position === undefined) {
    newY = 0;
    newX = 0;
    store.set('lastDirection', 'initial');
    let pos = new Position(newX, newY)
    console.log('**** Initial Position is %d,%d Gems: [%d] ', newX, newY, mine[newY][newX]);
    console.log('**** Collecting gems at (%d,%d) [%d] gems', newX, newY, mine[newX][newY]);
    console.log();
    store.set('lastPosition', pos);
    return pos;
  }

  lastDirection = store.get('lastDirection');
  lastPosition = store.get('lastPosition');
  console.log('lastDirection: %o', lastDirection);
  console.log('lastPosition: %o', lastPosition);

  //this is not the first move so it is safe to explore different mining opportunities

  newX = position.x + 1;
  newY = position.y;

  let pos = new Position(newX, newY)

  let right = new Position(pos.x, pos.y);
  let diagUp = new Position(pos.x, pos.y - 1);
  let diagDown = new Position(pos.x, pos.y + 1);

  validDirections = getValidDirections(position,mine,lastDirection);
  console.log('valid directions are %o',validDirections);

  //check if diagDown is valid, and if so check mining opportunity
  if (diagDown.isValid(mine) && lastDirection !== 'diagDown') {
    let possibleGems = mine[diagDown.y][diagDown.x];
    bestGems = possibleGems;
    direction = 'diagDown';
    newX = diagDown.x;
    newY = diagDown.y;
  }

  //check if diagUp is valid and if so check mining opportunity
  if (diagUp.isValid(mine) && lastDirection !== 'diagUp') {
    let possibleGems = mine[diagUp.y][diagUp.x];
    if (possibleGems > bestGems) {
      bestGems = possibleGems;
      direction = 'diagUp';
      newX = diagUp.x;
      newY = diagUp.y;
    }
  }

  //check if right  is valid and if so check mining opportunity
  if (right.isValid(mine) && lastDirection !== 'right') {
    let possibleGems = mine[right.y][right.x];
    if (possibleGems > bestGems) {
      bestGems = possibleGems;
      direction = 'right';
      newX = right.x;
      newY = right.y;
    }
  }
  // Store direction chosen
  store.set('lastDirection', direction);
  console.log('Best Gems are %s at (%d,%d) %d gems', direction, newX,newY, bestGems);
  console.log('**** Collecting gems at (%d,%d) [%d] gems', newX, newY, mine[newY][newX]);
  console.log('');
  pos.x = newX;
  pos.y = newY;
  store.set('lastPosition', pos);

  return pos;
};

export default move;
