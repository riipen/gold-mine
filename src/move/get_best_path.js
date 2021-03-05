import { getPaths } from './analyze_mine';
import { findBestPath } from './find_best_path';

// Constructor pattern is helpful for unit testing - if the returned function has dependencies
// they can be explicitly passed into the constructor.
// The constructor method can be imported into your test file allowing for those dependencies
// to be easily stubbed.
function getBestPathConstructor(getPaths, findBestPath) {
  return async function getBestPath(mine) {
    const paths = await getPaths(mine);
    return await findBestPath(mine[0].length, paths);
  }
}

const getBestPath = getBestPathConstructor(
  getPaths,
  findBestPath,
);

export {
  getBestPath,
  getBestPathConstructor,
}