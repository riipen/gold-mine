function findBestPathConstructor() {
  // iterating over the length of a row to pull out the best moves found at each coordinate
  // starting at [0, bestStartingY]
  return function findBestPath(mineRowLength, paths) {
    const bestPath = [];
    let y = 0;

    for (let x = 0; x < mineRowLength; x++) {
      if (x === 0 && paths.bestStartingY) {
        y = paths.bestStartingY;
      }

      bestPath[x] = y;

      if (paths[`${x},${y}`] && paths[`${x},${y}`].bestMove) {
        y += paths[`${x},${y}`].bestMove;
      }
    }

    return bestPath;
  }
}

const findBestPath = findBestPathConstructor();

export {
  findBestPath,
  findBestPathConstructor,
}