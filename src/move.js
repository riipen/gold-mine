import Position from "./position.js";

let previousMoveDirection;
const RIGHT_UP = "RIGHT_UP";
const RIGHT = "RIGHT";
const RIGHT_DOWN = "RIGHT_DOWN";

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
 *
 * Considerations:
 *  - Account for rows that have unequal number columns
 */
const move = (mine, position) => {

  // If there's no position then initialize (x=0,y=0) and return position
  if (position == undefined) return new Position(0,0);

  let xPosition;
  let yPosition;

  // Possible starting position 1: Starts at first row first column
  if (position.x == 0 && position.y == 0) {
    xPosition = 1; // Set default
    yPosition = 0;
    previousMoveDirection = RIGHT;

    if (mine[position.y][position.x + 1] == mine[position.y + 1][position.x + 1]) {


    // Check if next value in the same row is greater than the second row second column
    } else if (mine[position.y][position.x + 1] < mine[position.y + 1][position.x + 1]) {
      yPosition = 1;
      previousMoveDirection = RIGHT_DOWN;
    };
    // check here for identical cell values

  // Possible starting position 2: Starts at the last row first column
  } else if ((position.y == mine.length - 1) && position.x == 0) {
    xPosition = 1;
    yPosition = mine.length - 1;
    previousMoveDirection = RIGHT;

    // Check if next value in the same row is greater than the second last row second column
    if (mine[position.y][position.x + 1] < mine[position.y - 1][position.x + 1]) {
      yPosition = mine.length - 2 // Second last row
      previousMoveDirection = RIGHT_UP;
    }
    // check here for identical cell values

  // Possible starting position 3: Starts anywhere in the first column between the top and bottom row
  } else if (position.x == 0 && (position.y != 0 || position.y != mine.length - 1)) {

    let rightUpCellValue = mine[position.y - 1][position.x + 1];
    let rightCellValue = mine[position.y][position.x + 1];
    let rightDownCellValue = mine[position.y + 1][position.x + 1];
    xPosition = 1;

    // check here for identical cell values

    // Get the highest cell value position
    let highestCellValue = Math.max(rightUpCellValue, rightCellValue, rightDownCellValue);
    if (highestCellValue == rightUpCellValue) {
      yPosition = position.y - 1;
      previousMoveDirection = RIGHT_UP;
    } else if (highestCellValue == rightCellValue) {
      yPosition = position.y;
      previousMoveDirection = RIGHT;
    } else {
      yPosition = position.y + 1;
      previousMoveDirection = RIGHT_DOWN;
    };

    // Miner already started: Is positioned somewhere else in the mine
  } else {

    // At the bottom of the mine. Miner's previous move could be right or right down
    if (position.y == mine.length - 1) {
      xPosition = position.x + 1;

      if (previousMoveDirection == RIGHT) {
        yPosition = position.y - 1;
        previousMoveDirection = RIGHT_UP;

      // We can either go right or right up
      } else {
        yPosition = position.y; // default
        previousMoveDirection = RIGHT; // default
        if (mine[position.x][position.y + 1] < mine[position.x - 1][position.y + 1]) {
          yPosition = position.y - 1;
          previousMoveDirection = RIGHT_UP;
        };
        // check here for identical cell values
      };

    // At the top of the mine. Miner's previous move could be right or right up
    } else if (position.y == 0) {
      xPosition = position.x + 1;

      if (previousMoveDirection == RIGHT) {
        yPosition = position.y + 1;
        previousMoveDirection = RIGHT_DOWN;

      // We can either go right or right down
      } else {
        yPosition = position.y; // default
        previousMoveDirection = RIGHT; // default

        if (mine[position.y][position.x + 1] < mine[position.y + 1][position.x + 1]) {
          yPosition = position.y + 1;
          previousMoveDirection = RIGHT_DOWN;
        };
        // check here for identical cell values
      };

    // Depending on what the previous value is we need to select the other two
    // options and compare their cell values and set the previousMoveDirection
    // as well as set the xPosition
    } else {

      xPosition = position.x + 1;

      if (previousMoveDirection == RIGHT) {

        // setting the defaults
        yPosition = position.y - 1;
        previousMoveDirection = RIGHT_UP;

        // right up vs. right down
        if (mine[position.y - 1][position.x + 1] < mine[position.y + 1][position.x + 1]) {
          yPosition = position.y + 1;
          previousMoveDirection = RIGHT_DOWN;
        };
        // check here for identical cell values

      } else if (previousMoveDirection == RIGHT_UP) {

        // setting the defaults
        yPosition = position.y;
        previousMoveDirection = RIGHT;

        // right vs. right down
        if (mine[position.y][position.x + 1] < mine[position.y + 1][position.x + 1]) {
          yPosition = position.y + 1;
          previousMoveDirection = RIGHT_DOWN;
        };
        // check here for identical cell values

      } else {

        // setting the defaults
        yPosition = position.y;
        previousMoveDirection = RIGHT;

        // right vs. right up
        if (mine[position.y][position.x + 1] < mine[position.y - 1][position.x + 1]) {
          yPosition = position.y - 1;
          previousMoveDirection = RIGHT_UP;
        };
        // check here for identical cell values
      }
    };
  };

  return new Position(xPosition, yPosition);
};

export default move;
