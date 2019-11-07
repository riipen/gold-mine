const DIRECTIONS = {
  UP: 'up',
  RIGHT: 'right',
  DOWN: 'down'
};
function findOptimalSolution(mine) {
  const nodes = {};
  const bestPath = { value: 0 };
  for (let col = mine[0].length - 1; col >= 0; col--) {
    // initialize the column in the nodes map
    nodes[col] = {};
    console.log(`working to find optimal path... ${col} column(s) remaining`);
    if (nodes[col + 2]) {
      delete nodes[col + 2];
    }
    for (let row = mine.length - 1; row >= 0; row--) {
      // Initialize id and value of node
      nodes[col][row] = initializeNode(mine, { col, row });
      const node = nodes[col][row];
      node.paths = getPathsForNode(nodes, node, { col, row }, DIRECTIONS);
      // when on the final column to evaluate, store the overall best path while looping through the column
      if (
        col === 0 &&
        node.paths &&
        node.paths.best &&
        node.paths.best.value + node.value > bestPath.value
      ) {
        bestPath.value = node.value + node.paths.best.value;
        bestPath.nodes = [node.id, ...node.paths.best.nodes];
      }
    }
  }
  return bestPath;
}

function initializeNode(mine, position) {
  return {
    value: mine[position.row][position.col],
    id: `${position.col},${position.row}`
  };
}

function getPathsForNode(nodes, node, position) {
  // return empty paths if node's value is 0
  if (node.value === 0) return null;
  // Find best and second best path from this node
  return reducePaths(
    Object.values(DIRECTIONS).map(direction =>
      createPath(nodes, position, direction)
    )
  );
}
function reducePaths(pathArray) {
  /* Return an Object containing two paths:
      {
        best: {...pathWithGreatestValue},
        second: {...pathWithSecondGreatestValue}
      }
      */
  return pathArray.reduce((accumulator, currentPath) => {
    if (accumulator.best) {
      // there is already a best path
      if (currentPath.value > accumulator.best.value) {
        // currentPath is greater than best
        // make best be second
        accumulator.second = { ...accumulator.best };
        // make currentPath be best
        accumulator.best = { ...currentPath };
      } else if (
        accumulator.second &&
        currentPath.value > accumulator.second.value
      ) {
        // currentPath is greater than second
        // replace second with currentPath
        accumulator.second = { ...currentPath };
      } else if (!accumulator.second) {
        // there is not already a second best path
        accumulator.second = { ...currentPath };
      }
    } else {
      // there is not already a best path
      // make currentPath be best
      accumulator.best = { ...currentPath };
    }
    return accumulator;
  }, {});
}
function createPath(nodes, position, direction) {
  /* Return the best path in the given direction */

  // Get node in the passed direction
  const nextNode = getNextNode(nodes, position, direction);
  if (nextNode) {
    // the next node exists
    // find best path from the nextNode, other than that in direction used to get to the nextNode
    const bestAcceptablePath = getBestAcceptablePath(nextNode, direction);

    return {
      direction,
      value: nextNode.value + bestAcceptablePath.value,
      nodes: [nextNode.id, ...bestAcceptablePath.nodes]
    };
  } else {
    // the next node did not exist
    return { direction, nodes: [], value: 0 };
  }
}
function getBestAcceptablePath(node, previousDirection) {
  /* return the path from the passed node with the greatest value
     exclude the path in the same direction as the passed previousDirection */
  if (!node.paths || !node.paths.best || !node.paths.best.direction) {
    throw new Error(
      'node did not have paths, or did not have a best path with a direction'
    );
  }
  if (node.paths.best.direction === previousDirection) {
    return node.paths.second;
  }
  return node.paths.best;
}
function getNextNode(nodes, position, direction) {
  // Get node in the given direction
  const nextPosition = getNextPosition(position, direction);
  if (isNextPositionValid(nodes, nextPosition)) {
    return nodes[nextPosition.col][nextPosition.row];
  } else {
    // return null if the next position is not in the mine
    return null;
  }
}

function getNextPosition(position, direction) {
  const col = position.col + 1;
  const row = position.row + getColStepFromDirection(direction);
  return { col, row };
}
function isNextPositionValid(nodes, nextPosition) {
  // return false if the nextNode is not in nodes
  if (!nodes[nextPosition.col] || !nodes[nextPosition.col][nextPosition.row])
    return false;
  if (nodes[nextPosition.col][nextPosition.row].value === 0) return false;
  return true;
}
function getColStepFromDirection(direction) {
  /* Return value to increment column coordinate by from direction */
  if (direction === DIRECTIONS.UP) return 1;
  if (direction === DIRECTIONS.RIGHT) return 0;
  if (direction === DIRECTIONS.DOWN) return -1;
  throw new Error(`invalid direction: ${direction}`);
}

export default findOptimalSolution;
export { initializeNode };
export { getPathsForNode };
export { reducePaths };
export { createPath };
export { getBestAcceptablePath };
export { getNextNode };
export { getNextPosition };
export { isNextPositionValid };
export { getColStepFromDirection };
export { DIRECTIONS };
