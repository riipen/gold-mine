/**
 * It will use the mine and the previous direction of the positions
 * to calculate the next column's potential cell value and return the greater
 * value.
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {array} position - The current position of the miner as well as availableMoves
 *
 * @return {object} - previousMoveDirection, yPosition, xPosition
 */
const lookAhead = (mine, currentX = null, currentY = null, positions) => {

  // Handling input errors
  if (currentX == null || currentY == null) {
    throw new Error("Missing parameter - currentX and/or currentY");
  }

  if (positions[0].availableMoves.length == 0 || positions[1].availableMoves.length == 0) {
    throw new Error("Missing prop - availableMoves. Must provide at least one move");
  };

  if (!positions[0].previousMoveDirection || !positions[1].previousMoveDirection) {
    throw new Error("Missing prop - previousMoveDirection. Must provide one direction");
  } else if (positions[0].previousMoveDirection.length > 1 || positions[1].previousMoveDirection > 1) {
    throw new Error("Too many parameters - previousMoveDirection. Must provide only one previousMoveDirection");
  };

  if (!positions[0].x || !positions[1].x) {
    throw new Error("Missing prop - x. Must provide one coordinate");
  };

  if (!position[0].y || !positions[1].y) {
    throw new Error("Missing prop - y. Must provide one coordinate");
  };


  /*
    i.e positions = [
      {x: 1, y: 2, availableMoves: [RIGHT, RIGHT_UP], previousMoveDirection: RIGHT_DOWN},
      {x: 3, y: 2, availableMoves: [RIGHT_UP, RIGHT_DOWN], previousMoveDirection: RIGHT}
    ]
  */


  /*
    Implementation:
    lookAhead(mine, position.x, position.y,
      [
        {x: position.x + 1, y: position.y, availableMoves: [RIGHT_UP, RIGHT_DOWN], previousMoveDirection: RIGHT}, // RIGHT
        {x: position.x + 1, y: position.y - 1, availableMoves: [RIGHT, RIGHT_UP], previousMoveDirection: RIGHT_UP} // RIGHT_UP
      ]
    );
  */


  /*
  {
    position1_A: {
      value: 6,
      coordinates: [0,3],
      x: 0, y: 0
    }
  }
  */
  let positionCoordinates = {};

  // For each position get the two possible next moves and their cell value
  positionCoordinates["position1_A"] = { // set default RIGHT
    value: mine[positions[0].y][positions[0].x + 1],
    coordinates: [positions[0].x, positions[0].y],
    previousMoveDirection: positions[0].previousMoveDirection
  };

  if (positions[0].availableMoves[0] == RIGHT_DOWN) {
    positionCoordinates["position1_A"] = {
      value: mine[positions[0].y + 1][positions[0].x + 1],
      coordinates: [positions[0].x, positions[0].y],
      previousMoveDirection: positions[0].previousMoveDirection
    };
  } else if (positions[0].availableMoves[0] == RIGHT_UP) {
    positionCoordinates["position1_A"] = {
      value: mine[positions[0].y - 1][positions[0].x + 1],
      coordinates: [positions[0].x, positions[0].y],
      previousMoveDirection: positions[0].previousMoveDirection
    };
  };

  if (positions[0].availableMoves.length > 1) {
    positionCoordinates["position1_B"] = { // set default RIGHT
      value: mine[positions[0].y][positions[0].x + 1],
      coordinates: [positions[0].x, positions[0].y],
      previousMoveDirection: positions[0].previousMoveDirection
    };

    if (positions[0].availableMoves[1] == RIGHT) {
      positionCoordinates["position1_B"] = [positions[0].x + 1, positions[0].y];
    } else if (positions[0].availableMoves[1] == RIGHT_DOWN) {
      positionCoordinates["position1_B"] = [positions[0].x + 1, positions[0].y + 1];
    } else if (positions[0].availableMoves[1] == RIGHT_UP) {
      positionCoordinates["position1_B"] = [positions[0].x + 1, positions[0].y - 1];
    };
  };

  if (positions[1].availableMoves[0] == RIGHT) {
    positionCoordinates["position2_A"] = [positions[1].x + 1, positions[1].y];
  } else if (positions[1].availableMoves[0] == RIGHT_DOWN) {
    positionCoordinates["position2_A"] = [positions[1].x + 1, positions[1].y + 1];
  } else {
    positionCoordinates["position2_A"] = [positions[1].x + 1, positions[1].y - 1];
  };

  if (positions[1].availableMoves.length > 1) {
    if (positions[1].availableMoves[1] == RIGHT) {
      positionCoordinates["position2_B"] = [positions[1].x + 1, positions[1].y];
    } else if (positions[1].availableMoves[1] == RIGHT_DOWN) {
      positionCoordinates["position2_B"] = [positions[1].x + 1, positions[1].y + 1];
    } else {
      positionCoordinates["position2_B"] = [positions[1].x + 1, positions[1].y - 1];
    };
  };

  let previousMoveDirection;
  let highestCellValue;
  let finalPositionCoordinates;

  // iterate over the key/value pairs and set the highest cell value
  // ...

  // previousMoveDirection, y and x coordinates 
  return {previousMoveDirection, finalPositionCoordinates[1], finalPositionCoordinates[0]};
};

export default lookAhead;
