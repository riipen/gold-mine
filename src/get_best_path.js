// Constructor pattern is helpful for unit testing - if the returned function has dependencies
// they can be explicitly passed into the constructor.
// The constructor method can be imported into your test file allowing for those dependencies
// to be easily stubbed.
function getBestPathConstructor() {
  return async function getBestPath(mine) {
    // Memoizing the previously analyzed paths is essential here to save time when iterating over the mine
    // Instead of calculating every path again, we can grab a memoized value
    let memoizedPaths;


  }
}

const getBestPath = getBestPathConstructor();

export {
  getBestPath,
  getBestPathConstructor,
}