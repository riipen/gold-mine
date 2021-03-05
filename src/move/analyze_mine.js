// Memoizing the previously analyzed paths is essential here to save time when iterating over the mine
// Instead of calculating every path again, we can grab a memoized value
const memoizedPaths = {};
const moves = [-1, 0, 1];
let previousMove;

function getPathsConstructor(analyzeMine) {
  return async function getPaths(mine) {

    // We start by iterating over each row, keeping track of the best 
    mine.forEach(async (row, y) => {
      const result = await analyzeMine(0, y, mine);

      if (result > bestScore) {
        memoizedPaths.bestStartingY = y;
      }
    });

    return memoizedPaths;
  }
}

function analyzeMineConstructor(getIsPositionValid) {
  return async function analyzeMine(x, y, mine) {
    const isPositionValid = getIsPositionValid(x, y, mine);

    // if position is not valid, then return 0 and try another path
    if (!isPositionValid) {
      return 0;
    }

    // initialize memoized value
    if (!memoizedPaths[`${x},${y}`]) {
      memoizedPaths[`${x},${y}`] = {
        bestScore: 0,
        bestMove: null,
      };
    } else if (memoizedPaths[`${x},${y}`] && memoizedPaths[`${x},${y}`].bestScore) {
      return memoizedPaths[`${x},${y}`].bestScore + mine[y][x];
    }

    // Since this is a brute force attempt at finding the best path, we need to try all possible moves
    moves.forEach(async move => {
      // but not the previous one
      if (move != previousMove) {
        // on the next step, we can't reuse this move/direction
        previousMove = move;

        const result = await analyzeMine(x + 1, y + move, mine);

        // if a better result has been found, update the best move for this cell
        if (result > bestScore) {
          memoizedPaths[`${x},${y}`] = {
            bestScore,
            bestMove,
          };
        }
      }
    });
  
    return bestScore + mine[y][x];
  }
}

function getIsPositionValid(x, y, mine) {
  return !(x < 0 || x >= mine.length || y >= mine[0].length || mine[y][x] === 0);
}

const analyzeMine = analyzeMineConstructor(getIsPositionValid);
const getPaths = getPathsConstructor(analyzeMine);

export {
  analyzeMine,
  analyzeMineConstructor,
  getPaths,
  getPathsConstructor,
}