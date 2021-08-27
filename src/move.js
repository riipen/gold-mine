import Position from "./position.js";


let index = 0;
let result = [];
function coordinates(matrix, grid, maxCell) {
  // get last x and y coordinates and push to result
  const result = [[maxCell.curX, maxCell.curY]];

  // get the last x and y coordinates
  let { x } = maxCell;
  let y = maxCell.curY - 1;
  // calculate the total minus the current value and match that in last column coordinates
  let currentTotal = maxCell.total - grid[maxCell.curX][maxCell.curY];
  let curZ = 0;
  while (y >= 0) {
    // push the coordinates and find z for next last column x and y
    result.push([x, y]);
    for (let z = 0; z < 3; z++) {
      if (currentTotal === matrix[x][y][z].total && z != curZ) {
        curZ = z;
        break;
      }
    }

    currentTotal -= grid[x][y];
    x = matrix[x][y][curZ].x;
    y -= 1;
  }
  // reverse the results as we have to start it from 0
  return result.reverse();
}

export const getMaximumGold = function (grid) {
  // get rows and columns
  const row_count = grid.length;
  const column_count = grid[0].length;

  // create a matrix as same grid size
  const matrix = new Array(row_count)
    .fill(new Array(column_count).fill([0, 0, 0]))
    .map((a) => a.map((b) => b.slice()));

  // fill the first column of the matrix
  for (let x = 0; x < row_count; x++) {
    for (let z = 0; z < 3; z++) {
      matrix[x][0][z] = { total: grid[x][0], x, y: -1 };
    }
  }

  // 0 - previous move right
  // 1 - previous move diagonal up
  // 2 - previous move diagonal down
  let zeroMax = { total: 0 };

  // fill the rest of the matrix
  for (let y = 1; y < column_count; y++) {
    for (let x = 0; x < row_count; x++) {
      // for 0 - take max of previous move diagonal down and previous move diagonal up
      matrix[x][y][0] = {
        total:
          grid[x][y] +
          Math.max(matrix[x][y - 1][1].total, matrix[x][y - 1][2].total),
        x: x
      };

      // for 1 - take max of previous move diagonal down and previous move right
      matrix[x][y][1] = {
        total:
          grid[x][y] +
          Math.max(
            x + 1 < row_count ? matrix[x + 1][y - 1][0].total : 0,
            x + 1 < row_count ? matrix[x + 1][y - 1][2].total : 0
          ),
        x: x + 1 < row_count ? x + 1 : row_count - 1,
      };

      
      matrix[x][y][2] = {
        total:
          grid[x][y] +
          Math.max(
            x - 1 >= 0 ? matrix[x - 1][y - 1][0].total : 0,
            x - 1 >= 0 ? matrix[x - 1][y - 1][1].total : 0
          ),
        x: x - 1 >= 0 ? x - 1 : 0
      };

      // handle zero case
      if (grid[x][y] === 0) {
        let maxItem = { total: -Infinity };
        // find the max item on 0 value
        for (let item of [matrix[x][y][0], matrix[x][y][1], matrix[x][y][2]]) {
          if (item.total > maxItem.total) {
            maxItem = item;
          }
        }

        // set current x and y that helps in finding the path from last column
        maxItem.curX = x;
        maxItem.curY = y;

        // set current value to -1 so that it is not used again in calculation
        matrix[x][y] = [{ total: -1 }, { total: -1 }, { total: -1 }];

        // if maxItem is greater than old zeroMax, then update zeroMax
        if (zeroMax.total < maxItem.total) {
          zeroMax = maxItem;
        }
      }
    }
  }

  // find the max entry in last column
  let max = { total: 0 };
  for (let x = 0; x < row_count; x++) {
    for (let z = 0; z < 3; z++) {
      if (matrix[x][column_count - 1][z].total > max.total) {
        max = matrix[x][column_count - 1][z];
        max.curX = x;
        max.curY = column_count - 1;
      }
    }
  }

  // compare zeroMax and max
  if (max.total < zeroMax.total) {
    max = zeroMax;
  }

  result = coordinates(matrix, grid, max);
  return [max.total, result];
};

/**
 * Replace the logic in this function with your own custom movement algorithm.
 *
 * This function should run in a reasonable amount of time and should attempt
 * to collect as much gold as possible.
 *
 * Remember, landing outside the mine's boundary or on a "0" on the mine will
 * result in the run completing.
 *
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {object} position - The current position of the miner, will be undefined on the first move
 *
 * @return {Position} The new position of the miner.
 */
const move = (mine, position) => {
  if (!position) {
    index = 0;
    getMaximumGold(mine);
    return new Position(result[index][1], result[index][0]);
  }
  ++index;
  return new Position(result[index][1], result[index][0]);
};

export default move;
