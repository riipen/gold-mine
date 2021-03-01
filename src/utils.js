import Position from "./position.js";

/**
 * Given a mine, find a path that will collect the maximum amount of gold
 *
 * @param {array} mine - A n x m multidimensional array representing the mine.
 *
 * @return {object} An object that contains the max gold total with the corresponding path
 */
export const getPathToMaxGold = (mine) => {
  let max = { path: [], totalGold: 0 };
  const map = {};

  const rowLength = mine.length;
  for (let row = 0; row < rowLength; row++) {
    const candidate = findPaths(mine, null, row, 0, map);
    if (max.totalGold < candidate.totalGold) {
      max = candidate;
    }
  }

  return max;
};

const getSomething = (candidates, currGold, currPos, map, prevDir) => {
  let max = candidates[0];

  candidates.forEach((candidate) => {
    if (max.totalGold < candidate.totalGold) {
      max = candidate;
    }
  });

  const foo = { path: [currPos, ...max.path], totalGold: currGold + max.totalGold };
  if (prevDir) {
    const key = `${prevDir}-${currPos}`;
    map[key] = foo;
  }

  return foo;
};

/**
 * A recursive function that find/save any possible paths in a given mine
 *
 * @param {array} mine - A n x m multidimensional array representing the mine.
 * @param {string} prevDir - The previous direction, "up", "right", and "down"
 * @param {number} row - The y dimensional in the current position
 * @param {number} col - The x dimensional in the current position
 * @param {object} map -
 */
const findPaths = (mine, prevDir, row, col, map) => {
  const currPos = new Position(col, row);

  const isOutOfMine = typeof mine[row] === "undefined" || typeof mine[row][col] === "undefined";
  if (isOutOfMine) {
    return { path: [currPos], totalGold: 0 };
  }

  const gold = mine[row][col];

  if (gold === 0) {
    return { path: [currPos], totalGold: 0 };
  }

  const isFirstColumn = !prevDir;
  if (isFirstColumn) {
    // In the first column we have 3 options to move
    const up = findPaths(mine, "up", row - 1, col + 1, map); // Move up
    const right = findPaths(mine, "right", row, col + 1, map); // Move right
    const down = findPaths(mine, "down", row + 1, col + 1, map); // Move down

    return getSomething([up, right, down], gold, currPos, map, prevDir);
  } else if (prevDir === "up") {
    if (map[`${prevDir}-${currPos}`]) {
      return map[`${prevDir}-${currPos}`];
    }

    // Previous move was diagonally up, so we have two options, move to the right or diagonally down
    const right = findPaths(mine, "right", row, col + 1, map);
    const down = findPaths(mine, "down", row + 1, col + 1, map);

    return getSomething([right, down], gold, currPos, map, prevDir);
  } else if (prevDir === "right") {
    if (map[`${prevDir}-${currPos}`]) {
      return map[`${prevDir}-${currPos}`];
    }

    // Previous move was right, so we have two options, move to diagonally up or diagonally down
    const up = findPaths(mine, "up", row - 1, col + 1, map);
    const down = findPaths(mine, "down", row + 1, col + 1, map);

    return getSomething([up, down], gold, currPos, map, prevDir);
  } else if (prevDir === "down") {
    if (map[`${prevDir}-${currPos}`]) {
      return map[`${prevDir}-${currPos}`];
    }

    // Previous move was diagonally down, so we have two options, move to diagonally up or right
    const up = findPaths(mine, "up", row - 1, col + 1, map);
    const right = findPaths(mine, "right", row, col + 1, map);

    return getSomething([up, right], gold, currPos, map, prevDir);
  }
};
