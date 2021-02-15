import MinerPath from "./MinerPath";
import Position from "./position";
import {exploredMineSegments, mineSegmentDepthX} from './move';

// describe move types as position deltas relative to the current position of the miner
export const Moves = Object.freeze({
    RIGHT_DIAGONAL_UP: new Position(1, 1),
    RIGHT: new Position(1, 0),
    RIGHT_DIAGONAL_DOWN: new Position(1, -1)
});

/**
 * This function uses a recursive backtracking algorithm to determine the optimal
 * path through a mine segment with x-component depth precogDepthX,
 * to retrieve as much gold as possible from the mine segment.
 * @param {array} mine  - A n x m multidimensional array respresenting the mine.
 * @param {object} position - The current position of the miner
 * @param {object} previousMove - The previous move of the miner to reach the current position
 */
const findOptimumPath = (mine, position, previousMove = null) => {
    let maxKnownGold = 0;
    let chosenMinerPath = new MinerPath();
    // select available moves by filtering out the previous move,
    // or simply accepting them all if no previous move was performed (ie. if this is the first position)
    const availableMoves = Object.values(Moves).filter(aMove => previousMove === null || aMove.y !== previousMove.y);
    // explore path options available to the given position based on available moves.
    const possibleMinerPaths = availableMoves.map(
       (aMove) => {
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
          return findOptimumPath(mine, nextPosition, aMove);
        }
      }
    );
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

export default findOptimumPath;