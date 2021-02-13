import MinerPath from "./MinerPath.js";
import Position from "./position.js";

// describe move types as position deltas relative to the current position of the miner
export const Moves = Object.freeze({
  RIGHT_DIAGONAL_UP: new Position(1, 1),
  RIGHT: new Position(1, 0),
  RIGHT_DIAGONAL_DOWN: new Position(1, -1)
});

// object containing the attributes of the chosen optimum path
let optimumPath;

// index to describe the index of the position in the path positions sequence
let nextPositionIndex = 0;

/**
 * 
 * @param {array} mine  - A n x m multidimensional array respresenting the mine.
 * @param {object} position - The current position of the miner
 * @param {object} previousMove - The previous move of the miner to reach the current position
 */
export const findOptimumPath = async (mine, position, previousMove = null) => {
  let maxKnownGold = 0;
  let chosenMinerPath = new MinerPath();
  const availableMoves = Object.values(Moves).filter(aMove => aMove !== previousMove);
  
  // explore path options available to the given position based on available moves
  const pathOptionsPromises = availableMoves.map(
    async (aMove) => {
      const nextPosition = new Position(position.x + aMove.x, position.y + aMove.y);
      const foundGold = (nextPosition.isValid(mine) && mine[nextPosition.y][nextPosition.x]) || 0;
      if (nextPosition.x >= mine[0].length || nextPosition.y >= mine.length) {
        return new MinerPath([], foundGold);
      }
      if (foundGold === 0) { // base case: next position is the end of a valid path through the mine
        return new MinerPath(
          [nextPosition],
          foundGold
        );
      } else { // recursive case: explore branching of new moves at the new position following the current move aMove
        const deepPath = await findOptimumPath(mine, nextPosition, aMove);
        return new MinerPath(
          deepPath.pathPositions,
          deepPath.goldFromPath
        );
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
  // now that chosen path has been assigned, it is safe to insert the current position as the first visited position in the path
  chosenMinerPath.pathPositions.unshift(position);
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
  if (typeof(position) === 'undefined') {
    const randomY = Math.random() * (mine.length);
    position = new Position(0, Math.floor(randomY));
    optimumPath = await findOptimumPath(mine, position);
  } else {
    position = optimumPath.pathPositions[nextPositionIndex];
  }
  ++nextPositionIndex;
  return position;
};

export default move;
