import Position from "./position.js";
import { getUpRightValue, getRightValue, getDownRightValue, goUpRight, goRight, goDownRight } from "./helper.js";

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
const Directions = {
  UpRight: "upRight",
  Right:"right",
  DownRight:"downRight"
};

let lastMove;

const move = (mine, position) => {

  // Kick off first move
  // TODO how to decide the start point
  if (position === undefined) {
    return new Position(0, 0);
  }

  let currentMove;
  let currentMoveOptions = {};
  let nextMoveOptions= {};
  let maxMineValue = 0;

  // Add all options in current option list

  if ((lastMove === undefined || lastMove !== Directions.UpRight) && getUpRightValue(mine, position) !== 0)
    currentMoveOptions[Directions.UpRight] = getUpRightValue(mine, position);

  if ((lastMove  === undefined || lastMove !== Directions.Right) && getRightValue(mine, position) !== 0)
    currentMoveOptions[Directions.Right] = getRightValue(mine, position);

  if ((lastMove  === undefined || lastMove !== Directions.DownRight) && getDownRightValue(mine, position) !== 0)
    currentMoveOptions[Directions.DownRight] = getDownRightValue(mine, position);

  // Find best option
  for (let direction in currentMoveOptions) { 
    if (currentMoveOptions[direction]> maxMineValue) {
      maxMineValue = currentMoveOptions[direction];;
      currentMove = direction;
    }
  }
 // check Current Move's next move, if next move has two zeros in option list, change current move
  if (Object.keys(currentMoveOptions) && Object.keys(currentMoveOptions).length > 1 ) {
      let currentPosition = takeNextmove(currentMove,mine,position);
      
    if ((currentMove === undefined || currentMove !== Directions.UpRight) && getUpRightValue(mine, currentPosition) !== 0)
      nextMoveOptions[Directions.UpRight] = getUpRightValue(mine, currentPosition);

    if ((currentMove  === undefined || currentMove !== Directions.Right) && getRightValue(mine, currentPosition) !== 0)
      nextMoveOptions[Directions.Right] = getRightValue(mine, currentPosition);

    if ((currentMove  === undefined || currentMove !== Directions.DownRight) && getDownRightValue(mine, currentPosition) !== 0)
      nextMoveOptions[Directions.DownRight] = getDownRightValue(mine, currentPosition);

    // switch current move since it will ends up zeores
    if (Object.keys(nextMoveOptions) && Object.keys(nextMoveOptions).length === 0) {
      currentMove = Object.keys(currentMoveOptions).filter(opt => opt !== currentMove)[0];
    }
  }

  if (currentMove === undefined) {
    return terminationMove(lastMove,mine,position);
  }

  lastMove = currentMove;  

  // Find next position
  return takeNextmove(currentMove,mine,position);
};

const takeNextmove = (direction, mine, position) => {
  switch(direction) {
    case Directions.UpRight:
      return goUpRight(mine,position);
    case Directions.Right:
      return goRight(mine,position);
    case Directions.DownRight:
      return goDownRight(mine,position);
  }
};

const terminationMove = (direction,mine,position) => {
  // TODO Better way to terminate the move
  switch(direction) {
    case Directions.UpRight:
      return goRight(mine,position);
    case Directions.Right:
      return goDownRight(mine,position);
    case Directions.DownRight:
      return goRight(mine,position);
  }
}

export default move;
