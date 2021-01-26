import Position from "./position";

/**
 * Runs through the array from the back column by column using a dynamic approach
 * to build the position map for the routes.
 *
 * @param  {array} mine - A n x m array where the gold is being collected
 * @param  {array} trackingMine - A copy n x m of the above dimensions that holds the next best route in cell
 * @param  {array} directionMine - A copy n x m of the gold array to track the last direction used
 */
export const calculateGoldTally = (mine, trackingMine, directionMine) => {
  for (let i = mine[0].length - 2; i >= 0; i--) {
    for (let j = 0; j < mine.length; j++) {
      let position = new Position(i, j);
      calculateLocalMaxValidMove(mine, trackingMine, directionMine, position);
    }
  }
};

/**
 * Runs through possible moves from a cell, checks to see if they are valid and
 * which one holds the best value. Afterwards updates tracking, direction, and gold array
 *
 * @param  {array} mine - A n x m array where the gold is being collected
 * @param  {array} trackingMine - A copy n x m of the above dimensions that holds the next best route in cell
 * @param  {array} directionMine - A copy n x m of the gold array to track the last direction used
 * @param  {Position} position - A position value to base the possible options of off
 */
export const calculateLocalMaxValidMove = (
  mine,
  trackingMine,
  directionMine,
  position
) => {
  let maximumGold = 0;
  let maximumDirection;
  let maximumPosition;

  const rightDirection = 0;
  const rightUpDirection = 1;
  const rightDownDirection = -1;

  const rightUpPosition = new Position(position.x + 1, position.y - 1);
  const rightDownPosition = new Position(position.x + 1, position.y + 1);
  const rightPosition = new Position(position.x + 1, position.y);

  // Statements below handle validation and best decision of possible moves
  if (rightUpPosition.isValid(mine)) {
    if (
      rightUpDirection !== directionMine[rightUpPosition.y][rightUpPosition.x]
    ) {
      if (maximumGold < mine[rightUpPosition.y][rightUpPosition.x]) {
        maximumGold = mine[rightUpPosition.y][rightUpPosition.x];
        maximumPosition = new Position(rightUpPosition.x, rightUpPosition.y);
        maximumDirection = 1;
      }
    }
  }

  if (rightPosition.isValid(mine)) {
    if (
      rightDirection !== directionMine[rightPosition.y][rightPosition.x] &&
      rightPosition.isValid(mine)
    ) {
      if (maximumGold < mine[rightPosition.y][rightPosition.x]) {
        maximumGold = mine[rightPosition.y][rightPosition.x];
        maximumPosition = new Position(rightPosition.x, rightPosition.y);
        maximumDirection = 0;
      }
    }
  }

  if (rightDownPosition.isValid(mine)) {
    if (
      rightDownDirection !==
        directionMine[rightDownPosition.y][rightDownPosition.x] &&
      rightDownPosition.isValid(mine)
    ) {
      if (maximumGold < mine[rightDownPosition.y][rightDownPosition.x]) {
        maximumGold = mine[rightDownPosition.y][rightDownPosition.x];
        maximumPosition = new Position(
          rightDownPosition.x,
          rightDownPosition.y
        );
        maximumDirection = -1;
      }
    }
  }

  // if current cell is zero treat it like the runner would. A end piece
  if (mine[position.y][position.x] === 0) {
    trackingMine[position.y][position.x] = null;
    directionMine[position.y][position.x] = null;
  } else {
    mine[position.y][position.x] = maximumGold + mine[position.y][position.x];
    trackingMine[position.y][position.x] = maximumPosition;
    directionMine[position.y][position.x] = maximumDirection;
  }
};
