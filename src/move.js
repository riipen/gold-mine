import Position from "./position.js";
import findOptimumPath from "./findOptimumPath.js";

// maximum depth in the x-component of a segment of the overall mine,
// to impose limits on recursion depth when performing backtracking to find optimal path
export let mineSegmentDepthX = 10;

// number of explored mine segments for the run of the algorithm
export let exploredMineSegments = 1;

// list to contain the positions of the miner along the optimum path (global for all calls to move())
let optimumPathPositionsStack = [];

/**
 * This function should run in a reasonable amount of time and should attempt
 * to collect as much gold as possible.
 *
 * Remember, landing outside the mine's boundary or on a "0" on the mine will
 * result in the run completing.
 *
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {object} position - The current position of the miner, will be undefined on the first move
 * @param  {number} yStart - The y-component of the miner's start position in column x = 0
 * @return {Position} The new position of the miner.
 */
const move = async (mine, position = null, yStart = null) => {
  // for mines at least 100 rows in length, decrease the mine segment depth as a trade-off in favour of better performance
  if (mine.length >= 100) {
    mineSegmentDepthX = 5;
  }
  const isAtFirstPosition = position === null;
  // if the miner is at the first position of the mine, decide what position he/she should take to begin their exploration
  if (isAtFirstPosition) {
    // if the y-component of the start position is specified, use it in the start position
    if (yStart !== null) {
      position = new Position(0, yStart)
    } else {
      // if no y-component is spectified for the starting position, assign a random position along y in the first column of the mine
      const randomY = Math.random() * (mine.length);
      position = new Position(0, Math.floor(randomY));
    }
    // the number of explored mine segments starts at 1 when the miner is in the first position of the overall mine
    exploredMineSegments = 1;
  }
  // determine if there is need to compute the optimal path for the mine segment ahead,
  // in the case that the miner is reaching the end of the currently known path.
  const pathComputationIsRequired = optimumPathPositionsStack.length <= 1;
  // increment the number of mine segments that have been explored if the miner is ready to explore the next mine segment
  if (!isAtFirstPosition && pathComputationIsRequired) {
    exploredMineSegments += 1;
  }
  if (pathComputationIsRequired || isAtFirstPosition) {
    let prevMove = null;
    if (!isAtFirstPosition) {
      const nextPosition = optimumPathPositionsStack.pop();
      // dynamically compute the previous move to pass to findOptimumPath, based on the next position and the current position of the path
      prevMove = new Position(nextPosition.x - position.x, nextPosition.y - position.y);
      position = nextPosition;
    }
    optimumPathPositionsStack = (await findOptimumPath(mine, position, prevMove)).pathPositions;
    // the initial position in the path positions stack is disregarded at the root level call of findOptimumPath, since the miner is already at this position
    optimumPathPositionsStack.pop();
  } else {
    // assign the position to the next position dictated by the optimum path positions stack
    position = optimumPathPositionsStack.pop();
  }
  return position;
};

export default move;
