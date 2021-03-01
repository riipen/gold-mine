import Position from "./position";

/**
 * A helper function that will check if a given position is out of mine
 *
 * @param {array} mine - A n x m multidimensional array representing the mine.
 * @param {number} row - The row of the given position
 * @param {number} col - the column of the given position
 *
 * @return {boolean}
 */
const isOutOfMine = (mine, row, col) => {
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
 * @param {number} row - The row of the given position
 * @param {number} col - the column of the given position
 *
 * @return {number} - The maximum amount of gold
 */
const getGold = (mine, map, direction, row, col) => {
  if (isOutOfMine(mine, row, col)) {
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
 * @param {number} row - The row of the given position
 * @param {number} col - the column of the given position
 *
 * @return {string} - The array of positions stored in string
 */
const getPath = (mine, map, direction, row, col) => {
  if (isOutOfMine(mine, row, col) || !map[row][col]) {
    return `${col},${row}`;
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

      if (gold === 0) {
        // Stop searching if we found 0 gold in this position
        map[row][col] = {
          down: { gold, path: `${col},${row}` },
          right: { gold, path: `${col},${row}` },
          up: { gold, path: `${col},${row}` },
        };
        continue;
      }

      const upGold = getGold(mine, map, "up", row - 1, col + 1);
      const upPath = getPath(mine, map, "up", row - 1, col + 1);
      const rightGold = getGold(mine, map, "right", row, col + 1);
      const rightPath = getPath(mine, map, "right", row, col + 1);
      const downGold = getGold(mine, map, "down", row + 1, col + 1);
      const downPath = getPath(mine, map, "down", row + 1, col + 1);

      // Previously moved down, so miner can move up or right
      obj["down"] =
        upGold > rightGold
          ? { gold: gold + upGold, path: `${col},${row}-${upPath}` }
          : { gold: gold + rightGold, path: `${col},${row}-${rightPath}` };

      // Previously moved right, so miner can move up or down
      obj["right"] =
        upGold > downGold
          ? { gold: gold + upGold, path: `${col},${row}-${upPath}` }
          : { gold: gold + downGold, path: `${col},${row}-${downPath}` };

      // Previously moved up, so miner can move right or down
      obj["up"] =
        rightGold > downGold
          ? { gold: gold + rightGold, path: `${col},${row}-${rightPath}` }
          : { gold: gold + downGold, path: `${col},${row}-${downPath}` };

      map[row][col] = obj;
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

  // Covert the string path into the array of Positions
  theOne.path = theOne.path.split("-").map((position) => {
    const [col, row] = position.split(",");
    return new Position(Number(col), Number(row));
  });

  return theOne;
};
