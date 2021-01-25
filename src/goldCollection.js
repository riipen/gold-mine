import Position from "./position";

export const findLocalMaximumPath = (mine, lastDirection, position) => {
  let maximumGold = 0;
  let maximumDirection;
  const rightDirection = 0;
  const rightUpDirection = 1;
  const rightDownDirection = -1;
  const rightUpPosition = new Position(position.x + 1, position.y - 1);
  const rightDownPosition = new Position(position.x + 1, position.y + 1);
  const rightPosition = new Position(position.x + 1, position.y);
  
  if (
    rightUpDirection !== lastDirection &&
    rightUpPosition.isValid(mine) &&
    mine[position.y][position.x] !== 0
  ) {
    if (maximumGold < mine[rightUpPosition.y][rightUpPosition.x]) {
      maximumGold = mine[rightUpPosition.y][rightUpPosition.x];
      maximumDirection = 1;
    }
  }

  if (
    rightDirection !== lastDirection &&
    rightPosition.isValid(mine) &&
    mine[position.y][position.x] !== 0
  ) {
    if (maximumGold < mine[rightPosition.y][rightPosition.x]) {
      maximumGold = mine[rightPosition.y][rightPosition.x];
      maximumDirection = 1;
    }
  }

  if (
    rightDownDirection !== lastDirection &&
    rightDownPosition.isValid(mine) &&
    mine[position.y][position.x] !== 0
  ) {
    if (maximumGold < mine[rightDownPosition.y][rightDownPosition.x]) {
      maximumGold = mine[rightDownPosition.y][rightDownPosition.x];
      maximumDirection = 1;
    }
  }

  return [maximumGold, maximumDirection];
};
