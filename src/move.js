import Position from "./position.js";

let firstMove = true;
let lastMove = '';
export const RIGHT = "right";
export const RIGHT_UP = "rightUp";
export const RIGHT_DOWN = "rightDown";

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
  const mineLength = {
    y: mine.length,
    x: mine.reduce((x, y) => Math.max(x, y.length), 0)
  };

  console.log('start ------------------------------------');
  console.log('length: ', mineLength);
  console.log('start: ', position);
  console.log('firstMove: ', firstMove);
  console.log('lastmove: ', firstMove);

  if (firstMove) {
    firstMove = false;

    const initialPosition = getFirstPosition(mine);

    console.log('end: ', initialPosition);
    console.log('firstMove end: ', firstMove);
    console.log('lastmove end: ', lastMove);
    console.log('value: ', mine[initialPosition.y][initialPosition.x]);
    console.log('end ------------------------------------');

    return initialPosition;
  }

  const { nextPosition, move } = getNextPosition(mine, lastMove, position);
  lastMove = move;

  if (nextPosition.x >= mineLength.x-1) {
    firstMove = true;
  }

  if (nextPosition.y > mineLength.y) {
    firstMove = true;
  }

  if (mine[nextPosition.y][nextPosition.x] === 0) {
    firstMove = true;
  }

  console.log('end: ', nextPosition);
  console.log('firstMove end: ', firstMove);
  console.log('lastmove end: ', lastMove);
  console.log('value: ', mine[nextPosition.y][nextPosition.x]);
  console.log('end ------------------------------------');

  return nextPosition;
};

export const positionIsSafe = (mine, position, nextMove) => {
  const mineLength = {
    y: mine.length,
    x: mine.reduce((x, y) => Math.max(x, y.length), 0)
  };
  const rightValue = (position.x+1 < mineLength.x) ? mine[position.y][position.x+1] : 0;
  const rightUpValue = (position.y-1 > -1 && position.x+1 < mineLength.x) ? mine[position.y-1][position.x+1] : 0;
  const rightDownValue = (position.y+1 < mineLength.x && position.x+1 < mineLength.x) ? mine[position.y+1][position.x+1] : 0;

  switch (nextMove) {
    case RIGHT_UP:
      if (rightValue !== 0 || rightDownValue !== 0) {
        return true;
      }
      break;

    case RIGHT_DOWN:
      if (rightValue !== 0 ||rightUpValue !== 0) {
        return true;
      }
      break;

    case RIGHT:
      if (rightUpValue !== 0 || rightDownValue !== 0) {
        return true;
      }
      break;

    default:
      if (rightValue !== 0 || rightUpValue !== 0 || rightDownValue !== 0) {
        return true;
      }
      break;
  }

  return false;
};

export const getFirstPosition = (mine) => {
  const highestNumbersRows = mine.map(function(row){ return Math.max.apply(Math, row); });
  const highestNumber = highestNumbersRows.reduce((firstElem, secElem) => Math.max(firstElem, secElem));
  const rowsHighestNumberCount = [];
  let elementCount;

  for (let i = 0; i < mine.length; i++) {
    elementCount = 0;

    for (let j = 0; j < mine[i].length; j++) {
      if (mine[i][j] === highestNumber) {
        elementCount++;
      }
    }

    rowsHighestNumberCount.push([i, elementCount]);
  }

  rowsHighestNumberCount.sort((firstElem, secElem) => firstElem[1] > secElem[1] ? -1 : 1);

  for (let i = 0; i < rowsHighestNumberCount.length; i++) {
    const initialPosition = new Position(0, rowsHighestNumberCount[i][0]);

    if (positionIsSafe(mine, initialPosition, '')) {
      return initialPosition;
    }
  }
};

export const getNextPosition = (mine, lastMove, position) => {
  const rightPosition = new Position(position.x+1, position.y);
  const rightUpPosition = new Position(position.x+1, position.y-1);
  const rightDownPosition = new Position(position.x+1, position.y+1);
  let nextPositions = [];

  switch (lastMove) {
    case RIGHT_UP:
      if (rightPosition.isValid(mine)) {
        nextPositions.push({ nextPosition: rightPosition, value: mine[rightPosition.y][rightPosition.x], move: RIGHT });
      }

      if (rightDownPosition.isValid(mine)) {
        nextPositions.push({ nextPosition: rightDownPosition, value: mine[rightDownPosition.y][rightDownPosition.x], move: RIGHT_DOWN });
      }
      break;

    case RIGHT_DOWN:
      if (rightPosition.isValid(mine)) {
        nextPositions.push({ nextPosition: rightPosition, value: mine[rightPosition.y][rightPosition.x], move: RIGHT });
      }

      if (rightUpPosition.isValid(mine)) {
        nextPositions.push({ nextPosition: rightUpPosition, value: mine[rightUpPosition.y][rightUpPosition.x], move: RIGHT_UP });
      }
      break;

    case RIGHT:
      if (rightDownPosition.isValid(mine)) {
        nextPositions.push({ nextPosition: rightDownPosition, value: mine[rightDownPosition.y][rightDownPosition.x], move: RIGHT_DOWN });
      }

      if (rightUpPosition.isValid(mine)) {
        nextPositions.push({ nextPosition: rightUpPosition, value: mine[rightUpPosition.y][rightUpPosition.x], move: RIGHT_UP });
      }
      break;

    default:
      if (rightPosition.isValid(mine)) {
        nextPositions.push({ nextPosition: rightPosition, value: mine[rightPosition.y][rightPosition.x], move: RIGHT });
      }

      if (rightUpPosition.isValid(mine)) {
        nextPositions.push({ nextPosition: rightUpPosition, value: mine[rightUpPosition.y][rightUpPosition.x], move: RIGHT_UP });
      }

      if (rightDownPosition.isValid(mine)) {
        nextPositions.push({ nextPosition: rightDownPosition, value: mine[rightDownPosition.y][rightDownPosition.x], move: RIGHT_DOWN });
      }
      break;
  }

  if (nextPositions.length > 0) {
    nextPositions.sort((firstElem, secElem) => firstElem.value > secElem.value ? -1 : 1);

    for (let i = 0; i < nextPositions.length; i++) {
      if (positionIsSafe(mine, nextPositions[i].nextPosition, nextPositions[i].move)) {
        return nextPositions[i];
      }
    } 
  }
  return { nextPosition: (lastMove === RIGHT) ? rightDownPosition : rightPosition, move: (lastMove === RIGHT) ? RIGHT_DOWN : RIGHT };
};

export default move;