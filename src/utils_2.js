import Position from "./position";

/**
 * A helper function that will check if a given position is out of mine
 *
 * @param {array} mine - A n x m multidimensional array representing the mine.
 * @param {Position} position - the position that we want to verify if it's out of the mine's boundary
 *
 * @return {boolean}
 */
const isOutOfMine = (mine, position) => {
  const row = position.y;
  const col = position.x;

  if (typeof mine[row] === "undefined" || typeof mine[row][col] === "undefined") {
    return true;
  }

  return false;
};

/**
 * A helper function that gives us the maximum amount of gold
 * that a miner can get at a given position & coming direction
 *
 * @param {array} mine - A n x m multidimensional array representing the mine.
 * @param {object} map - A n x m multidimensional array representing the gold map
 * @param {string} direction - The coming direction
 * @param {Position} position - The given position
 *
 * @return {number} - The maximum amount of gold
 */
const getGold = (mine, map, direction, position) => {
  const row = position.y;
  const col = position.x;

  if (isOutOfMine(mine, position)) {
    return 0;
  }

  if (map[row][col]) {
    return map[row][col][direction].gold;
  }

  return mine[row][col];
};

/**
 * A helper function that gives us a path that allows a miner
 * to collect maximum amount of gold at a given position & coming direction
 *
 * @param {array} mine - A n x m multidimensional array representing the mine.
 * @param {object} map - A n x m multidimensional array representing the gold map
 * @param {string} direction - The coming direction
 * @param {Position} position - The given position
 *
 * @return {array} - The array of positions
 */
const getPath = (mine, map, direction, position) => {
  const row = position.y;
  const col = position.x;

  if (isOutOfMine(mine, position) || !map[row][col]) {
    return [position];
  }

  return map[row][col][direction].path;
};

/**
 * A function that takes iterative approach to find a path that will gives the maximum amount of gold
 *
 * how it works:
 *   1. Create a map that is the same size(n x m) of the mine
 *   2. Start iterating the mine from the last to the first column
 *   3. Store a piece of information in every position in the map as we iterate towards the first column
 *      - the information contains a path with the maximum amount of gold for every incoming direction (down, right, up)
 *      - once the iteration is done, in the first column of the map
 *        every element has optimal paths to the maximum amount of gold based on the first movement
 *   4. Loop through the first column of the map to find a path that gives the maximum amount of gold of all possible paths.
 *
 * @param {array} mine - A n x m multidimensional array representing the mine.
 *
 * @return {object} - the path with the possible maximum total gold
 */
export const getPathToMaxGold = (mine) => {
  const rowLength = mine.length;
  const colLength = mine[0].length;

  // Create a empty map that will be filled as we iterate from the last to the first column
  const map = mine.map((row) => Array(row.length).fill(null));

  for (let col = colLength - 1; col >= 0; col--) {
    for (let row = 0; row <= rowLength - 1; row++) {
      const obj = {};
      const gold = mine[row][col];
      const currPosition = new Position(col, row);

      if (gold === 0) {
        // Stop searching if we found 0 gold in this position
        map[row][col] = {
          down: { gold, path: [currPosition] },
          right: { gold, path: [currPosition] },
          up: { gold, path: [currPosition] },
        };
        continue;
      }

      const upPos = new Position(col + 1, row - 1);
      const upGold = getGold(mine, map, "up", upPos);
      const upPath = getPath(mine, map, "up", upPos);
      const rightPos = new Position(col + 1, row);
      const rightGold = getGold(mine, map, "right", rightPos);
      const rightPath = getPath(mine, map, "right", rightPos);
      const downPos = new Position(col + 1, row + 1);
      const downGold = getGold(mine, map, "down", downPos);
      const downPath = getPath(mine, map, "down", downPos);

      // Previously moved down, so miner can move up or right
      obj["down"] =
        upGold > rightGold
          ? { gold: gold + upGold, path: [currPosition, ...upPath] }
          : { gold: gold + rightGold, path: [currPosition, ...rightPath] };

      // Previously moved right, so miner can move up or down
      obj["right"] =
        upGold > downGold
          ? { gold: gold + upGold, path: [currPosition, ...upPath] }
          : { gold: gold + downGold, path: [currPosition, ...downPath] };

      // Previously moved up, so miner can move right or down
      obj["up"] =
        rightGold > downGold
          ? { gold: gold + rightGold, path: [currPosition, ...rightPath] }
          : { gold: gold + downGold, path: [currPosition, ...downPath] };

      map[row][col] = obj;

      // Clean up the part of the map that no longer needed
      if (col + 2 <= colLength - 1) {
        map[row][col + 2] = null;
      }
    }
  }

  // The map is finally completed, let's find the direction(up, right, down)
  // that will give us the maximum amount of gold
  let theOne = { gold: 0, path: [new Position(0, 0)] };
  for (let row = 0; row < rowLength; row++) {
    const candidate = map[row][0];
    ["up", "right", "down"].forEach((dir) => {
      if (candidate[dir].gold >= theOne.gold) {
        theOne = candidate[dir];
      }
    });
  }

  return theOne;
};
