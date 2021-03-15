import Position from "./position.js";

export const RIGHT = "right";
export const RIGHT_UP = "rightUp";
export const RIGHT_DOWN = "rightDown";

export const getMultArrLength = (multArr) => {
  return {
    y: multArr.length,
    x: multArr.reduce((x, y) => Math.max(x, y.length), 0),
  };
};

export const positionIsSafe = (multArr, position, move) => {
  const multArrLength = getMultArrLength(multArr);
  const rightValue = position.x + 1 < multArrLength.x ? multArr[position.y][position.x + 1] : 0;
  const rightUpValue =
    position.y - 1 > -1 && position.x + 1 < multArrLength.x ? multArr[position.y - 1][position.x + 1] : 0;
  const rightDownValue =
    position.y + 1 < multArrLength.x && position.x + 1 < multArrLength.x ? multArr[position.y + 1][position.x + 1] : 0;

  switch (move) {
    case RIGHT_UP:
      if (rightValue !== 0 || rightDownValue !== 0) {
        return true;
      }
      break;

    case RIGHT_DOWN:
      if (rightValue !== 0 || rightUpValue !== 0) {
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

export const isFirstMove = (multArr, position) => {
  const multArrLength = getMultArrLength(multArr);

  if (position.x >= multArrLength.x - 1) {
    return true;
  }

  if (position.y > multArrLength.y) {
    return true;
  }

  if (multArr[position.y][position.x] === 0) {
    return true;
  }

  return false;
};

export const getFirstPosition = (multArr) => {
  const highestNumbersRows = multArr.map(function (y) {
    return Math.max.apply(Math, y);
  });
  const highestNumber = highestNumbersRows.reduce((firstElem, secElem) => Math.max(firstElem, secElem));
  let rowsHighestNumberCount = [];
  let elementCount;

  for (let i = 0; i < multArr.length; i++) {
    elementCount = 0;

    for (let j = 0; j < multArr[i].length; j++) {
      if (multArr[i][j] === highestNumber) {
        elementCount++;
      }
    }

    rowsHighestNumberCount.push([i, elementCount]);
  }

  rowsHighestNumberCount.sort((firstElem, secElem) => (firstElem[1] > secElem[1] ? -1 : 1));

  for (let i = 0; i < rowsHighestNumberCount.length; i++) {
    const initialPosition = new Position(0, rowsHighestNumberCount[i][0]);

    if (positionIsSafe(multArr, initialPosition, "")) {
      return initialPosition;
    }
  }
};

export const getNextPosition = (multArr, lastMove, position) => {
  const rightPosition = new Position(position.x + 1, position.y);
  const rightUpPosition = new Position(position.x + 1, position.y - 1);
  const rightDownPosition = new Position(position.x + 1, position.y + 1);
  let nextPositions = [];

  if (lastMove === RIGHT_UP || lastMove === RIGHT_DOWN || lastMove === "") {
    if (rightPosition.isValid(multArr)) {
      nextPositions.push({
        nextPosition: rightPosition,
        value: multArr[rightPosition.y][rightPosition.x],
        move: RIGHT,
      });
    }
  }

  if (lastMove === RIGHT_UP || lastMove === RIGHT || lastMove === "") {
    if (rightDownPosition.isValid(multArr)) {
      nextPositions.push({
        nextPosition: rightDownPosition,
        value: multArr[rightDownPosition.y][rightDownPosition.x],
        move: RIGHT_DOWN,
      });
    }
  }

  if (lastMove === RIGHT_DOWN || lastMove === RIGHT || lastMove === "") {
    if (rightUpPosition.isValid(multArr)) {
      nextPositions.push({
        nextPosition: rightUpPosition,
        value: multArr[rightUpPosition.y][rightUpPosition.x],
        move: RIGHT_UP,
      });
    }
  }

  if (nextPositions.length > 0) {
    nextPositions.sort((firstElem, secElem) => (firstElem.value > secElem.value ? -1 : 1));

    for (let i = 0; i < nextPositions.length; i++) {
      if (positionIsSafe(multArr, nextPositions[i].nextPosition, nextPositions[i].move)) {
        return nextPositions[i];
      }
    }

    return nextPositions[0];
  }

  return {
    nextPosition: lastMove === RIGHT ? rightDownPosition : rightPosition,
    move: lastMove === RIGHT ? RIGHT_DOWN : RIGHT,
  };
};
