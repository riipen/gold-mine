import MinerPath from "./MinerPath.js";
import Position from "./position.js";

// maximum mining depth multiple in x axis precognition of an optimum path through a given segment of the mine
let precogDepthX = 10;

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
 * 
 * @param {array} mine  - A n x m multidimensional array respresenting the mine.
 * @param {object} position - The current position of the miner
 * @param {object} previousMove - The previous move of the miner to reach the current position
 */
export const findOptimumPath = async (mine, position, previousMove = null) => {
  if (mine.length > 100) {
    precogDepthX = 5;
  }
  let maxKnownGold = 0;
  let chosenMinerPath = new MinerPath();
  const availableMoves = Object.values(Moves).filter(aMove => previousMove === null || aMove.y !== previousMove.y);
  // explore path options available to the given position based on available moves
  const pathOptionsPromises = availableMoves.map(
    async (aMove) => {
      const nextPosition = new Position(position.x + aMove.x, position.y + aMove.y);
      const foundGold = (nextPosition.isValid(mine) && mine[nextPosition.y][nextPosition.x]) || 0;
      if (((position.x % (exploredMineSegments * precogDepthX)) === 0 && position.x !== 0) || nextPosition.x >= mine[0].length || nextPosition.y >= mine.length) {
        return new MinerPath([], foundGold);
      }
      if (foundGold === 0) { // base case: next position is the end of a valid path through the mine
        return new MinerPath(
          [nextPosition],
          foundGold
        );
      } else { // recursive case: explore branching of new moves at the new position following the current move aMove
        return await findOptimumPath(mine, nextPosition, aMove);
      }
    }
  );
  // wait for all paths to be computed in parallel
  const possibleMinerPaths = await Promise.all(pathOptionsPromises);
  // choose the path that yields the maximum known gold
  possibleMinerPaths.forEach(path => {
    if (path.goldFromPath >= maxKnownGold) {
      maxKnownGold = path.goldFromPath;
      chosenMinerPath = path;
    }
  });
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
 *
 * @return {Position} The new position of the miner.
 */
const move = async (mine, position) => {
  const isAtFirstPosition = typeof(position) === 'undefined';
  const pathComputationIsRequired = optimumPathPositionsStack.length === 1;
  const atEdgeOfMineSegment = !isAtFirstPosition && pathComputationIsRequired;
  if (isAtFirstPosition) {
    const randomY = Math.random() * (mine.length);
    position = new Position(0, Math.floor(randomY));
    exploredMineSegments = 1;
  }
  if (atEdgeOfMineSegment) { // case where the miner has completed traversal of a mine segment
    exploredMineSegments += 1;
  }
  if (pathComputationIsRequired || isAtFirstPosition) {
    let prevMove = null;
    if (!isAtFirstPosition) {
      const nextPosition = optimumPathPositionsStack.pop();
      prevMove = new Position(nextPosition.x - position.x, nextPosition.y - position.y);
      position = nextPosition;
    }
    optimumPathPositionsStack = (await findOptimumPath(mine, position, prevMove)).pathPositions;
    optimumPathPositionsStack.pop(); // exclude the initial position in the path
  } else {
    position = optimumPathPositionsStack.pop();
  }
  return position;
};

export default move;
