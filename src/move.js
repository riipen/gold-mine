import MinerPath from "./MinerPath.js";
import Position from "./position.js";

// maximum depth in the x-component of a segment of the overall mine,
// to impose limits on recursion depth when performing backtracking to find optimal path
let mineSegmentDepthX = 10;

// number of explored mine segments for the run of the algorithm
let exploredMineSegments = 1;

// describe move types as position deltas relative to the current position of the miner
export const Moves = Object.freeze({
  RIGHT_DIAGONAL_UP: new Position(1, 1),
  RIGHT: new Position(1, 0),
  RIGHT_DIAGONAL_DOWN: new Position(1, -1)
});

// list to contain the positions of the miner along the optimum path (global for all calls to move())
let optimumPathPositionsStack = [];

/**
 * This function uses a recursive backtracking algorithm to determine the optimal
 * path through a mine segment with x-component depth precogDepthX,
 * to retrieve as much gold as possible from the mine segment.
 * @param {array} mine  - A n x m multidimensional array respresenting the mine.
 * @param {object} position - The current position of the miner
 * @param {object} previousMove - The previous move of the miner to reach the current position
 */
export const findOptimumPath = async (mine, position, previousMove = null) => {
  let maxKnownGold = 0;
  let chosenMinerPath = new MinerPath();
  // select available moves by filtering out the previous move,
  // or simply accepting them all if no previous move was performed (ie. if this is the first position)
  const availableMoves = Object.values(Moves).filter(aMove => previousMove === null || aMove.y !== previousMove.y);
  // explore path options available to the given position based on available moves.
  const pathOptionsPromises = availableMoves.map(
    async (aMove) => {
      // use the move object as a position delta to calculate the next position
      const nextPosition = new Position(position.x + aMove.x, position.y + aMove.y);
      // count the gold at the next position if the position is valid
      const foundGold = (nextPosition.isValid(mine) && mine[nextPosition.y][nextPosition.x]) || 0;
      // determine if the current path has reached the end of the mine segment being currently explored
      const isAtLimitsOfMineSegment = (position.x % (exploredMineSegments * mineSegmentDepthX)) === 0;
      // determine if the current position is in the first column of the entire mine
      const isNotFirstPositionInMine = position.x !== 0;
      // determine if the next position being considered is beyond the bounds of the mine
      const nextPositionIsBeyondMineBounds = (nextPosition.x >= mine[0].length) || (nextPosition.y >= mine.length);
      if ((isAtLimitsOfMineSegment && isNotFirstPositionInMine) || nextPositionIsBeyondMineBounds) {
        return new MinerPath([], foundGold);
      }
      // base case: 0 gold for an invalid/end position, therefore consider it the end of the prospective path
      if (foundGold === 0) {
        return new MinerPath(
          [nextPosition],
          foundGold
        );
      } else {
        // recursive case: explore branching of new moves at the new position following the current move
        // (passing the current move as the previous move for the next search tree)
        return await findOptimumPath(mine, nextPosition, aMove);
      }
    }
  );
  // wait for all asynchronously computed paths to be completed
  const possibleMinerPaths = await Promise.all(pathOptionsPromises);
  // choose the path that yields the most gold
  possibleMinerPaths.forEach(path => {
    if (path.goldFromPath >= maxKnownGold) {
      maxKnownGold = path.goldFromPath;
      chosenMinerPath = path;
    }
  });
  // push the current position to the path positions list at the given level of the recursive search path
  chosenMinerPath.pathPositions.push(position);
  return new MinerPath(
    chosenMinerPath.pathPositions, // assign the chosen path positions sequence to the returned path
    mine[position.y][position.x] + maxKnownGold // add gold from current position to the maximum gold determined by the optimum path
  )
}

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
