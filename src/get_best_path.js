const allowableMoves = [-1, 0, 1];
let previousMove;
let memoizedPaths;
let bestStartRow;
let currentMineIdentifier;

// Constructor pattern is helpful for unit testing - if the returned function has dependencies
// they can be explicitly passed into the constructor.
// The constructor method can be imported into your test file allowing for those dependencies
// to be easily stubbed.
function getBestPathConstructor(analyzeMine, generateBestPath) {
  return async function getBestPath(mine) {
    // Memoizing the previously analyzed paths is essential here to save time when iterating over the mine
    // Instead of calculating every path again, we can grab a memoized value
    let bestScore = 0;

    // clear memoized paths when starting new mine
    if (currentMineIdentifier !== mine[0].toString()) {
      memoizedPaths = [];
      currentMineIdentifier = mine[0].toString();
    }

    mine.forEach(async (row, index) => {
      let result = await analyzeMine(0, index, mine);

      // if the returned result is greater than the current best score, a better path has been found
      if (result > bestScore) {
        bestStartRow = index;
        bestScore = result;
      }
    });

    return generateBestPath(mine);
  }
}

function getIsPositionValid(x, y, mine) {
  return !(x < 0 || x >= mine.length || y >= mine[0].length || mine[y][x] === 0);
}

function analyzeMineConstructor(getIsPositionValid) {
  return async function analyzeMine(x, y, mine) {
    const isPositionValid = getIsPositionValid(x, y, mine);

    // if position is not valid, then return 0 and try another path
    if (!isPositionValid) {
      return 0;
    }

    // initialize memoized value
    if (!memoizedPaths[x]) {
      memoizedPaths[x] = {};
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
  
    allowableMoves.forEach(async move => {
      if (move != previousMove) {
        result = await analyzeMine(x + 1, y + move, mine);

        if (result > bestScore) {
          bestScore = result;
          bestMove = move;
          previousMove = move;
        }
      }
    });
  
    memoizedPaths[x][y.toString()] = {
      bestScore,
      bestMove,
    };
  
    return bestScore + mine[y][x];
  }
}

function generateBestPathConstructor() {
  return function generateBestPath(mine) {
    const bestPath = [];
    let currentRow = 0;

    mine.forEach(row => {
      row.forEach((column, columnIndex) => {
        if (columnIndex === 0 && bestStartRow) {
          currentRow = bestStartRow;
        }

        bestPath[columnIndex] = memoizedPaths[columnIndex][currentRow.toString()];

        if (memoizedPaths[columnIndex] && memoizedPaths[columnIndex][currentRow.toString()] && memoizedPaths[columnIndex][currentRow.toString()].bestMove) {
          currentRow += memoizedPaths[columnIndex][currentRow.toString()].bestMove;
        }
      });
    })

    return bestPath;
  }
}

const getBestPath = getBestPathConstructor(
  analyzeMineConstructor(getIsPositionValid),
  generateBestPathConstructor(),
);

export {
  getBestPath,
  getBestPathConstructor,
  analyzeMineConstructor,
  generateBestPathConstructor,
}