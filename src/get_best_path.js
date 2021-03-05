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

      if (result > bestScore) {
        bestStartRow = index;
        bestScore = result;
      }
    });

    return generateBestPath(mine);
    let memoizedPaths;


  }
}

const getBestPath = getBestPathConstructor();

export {
  getBestPath,
  getBestPathConstructor,
}