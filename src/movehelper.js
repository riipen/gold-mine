

const POSSIBLE_MOVES = [-1, 0, 1];

/**
 * Validates that position points to a valid mine.
 * Note that a mine of 0 is considered valid - not ideal - in this
 * method.
 * @param {Array.<number[]>} mine - A n x m multidimensional array respresenting the mine.
 * @param {Position} currPosition - current position of the miner
 * @param {number} direction - the possible direction miner could take
 * @param {number} prevDirection - previous direction of miner
 * @returns {boolean}
 */
const isPositionOnBoard = (mine, currPosition, direction, prevDirection) => {
    // valid direction
    if (direction === prevDirection) return false;

    const newY = currPosition.y + direction;

    // keep within bounds
    if (newY >= mine.length || newY < 0) return false;

    // assert mine is defined value
    return mine[newY][currPosition.x + 1] !== undefined;
  };
  
  /**
   * Gets new directino based on current position and previous direction.
   * @param {Array.<number[]>} mine - A n x m multidimensional array respresenting the mine.
   * @param {Position} currPosition - current position of the miner
   * @param {number} prevDirection - previous direction of miner
   * @returns {number} - new direction
   */
  const getNewDirection = (mine, currPosition, prevDirection) => {
    // remove previous move from possible moves
    const possibleMoves = [...POSSIBLE_MOVES];
    var index = possibleMoves.indexOf(prevDirection);
    if (index > -1) {
        possibleMoves.splice(index, 1);
    }

    // initially just set to first potential move
    let direction = possibleMoves[0];

    // Allow for best value to be 0 for this greedy alrogithm.
    // If it is 0, however, this means that the miner is done mining.
    let bestValue = -1;
    const { x, y } = currPosition;

    for ( let i = 0; i < possibleMoves.length; i += 1) {
      const newDirection = possibleMoves[i];
      if (isPositionOnBoard(mine, currPosition, newDirection, prevDirection)) {
        const value = mine[y + newDirection][x + 1];

        //greedy - choose best option of available options
        if (value > bestValue) {
          bestValue = value;
          direction = newDirection;
        }
      }
    }

    return direction;
  };

  /**
   * Finds the highest value in the first column of mines and returns the index of the first instance.
   * @param {Array.<number[]>} mine - A n x m multidimensional array respresenting the mine.
   * @returns {number} - index of first instance of highest value
   */
  const getInitialPosition = (mine) => {
    const x = 0;
  
    let bestValue = 0;
    let index = 0;
    for (let i = 0; i < mine.length; i += 1) {
      const value = mine[i][0];
      if (value > bestValue) {
        bestValue = value;
        index = i;
      }
    }
    return index;
  };
  

  export { isPositionOnBoard, getInitialPosition, getNewDirection };