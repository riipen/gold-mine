function analyzeMineConstructor(getIsPositionValid) {
  // Memoizing the previously analyzed paths is essential here to save time when iterating over the mine
  // Instead of calculating every path again, we can grab a memoized value
  let memoizedPaths = {};
  return async function analyzeMine(x, y, mine) {
    const isPositionValid = getIsPositionValid(x, y, mine);

    // if position is not valid, then return 0 and try another path
    if (!isPositionValid) {
      return 0;
    }

    // initialize memoized value
    if (!memoizedPaths[`${x},${y}`]) {
      memoizedPaths[`${x},${y}`] = {};
    }

    if (!memoizedPaths[x][y.toString()]) {
      memoizedPaths[x][y.toString()] = {};
    // if we already have a memoized best score, just return it
    } else if (memoizedPaths[x][y.toString()] && memoizedPaths[x][y.toString()].bestScore) {
      return memoizedPaths[x][y.toString()].bestScore + mine[y][x];
    }
  
    let bestMove;
    let bestScore = 0;
    let result;
  
    // Since this is a brute force attempt at finding the best path, we need to try all possible moves
    allowableMoves.forEach(async move => {
      // but not the previous one
      if (move != previousMove) {
        // on the next step, we can't reuse this move/direction
        previousMove = move;

        result = await analyzeMine(x + 1, y + move, mine);

        // if a better result has been found, update the best move for this cell
        if (result > bestScore) {
          memoizedPaths[x][y.toString()] = {
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

export {
  analyzeMine,
  analyzeMineConstructor,
}