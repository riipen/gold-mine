import Position from "./position.js";

let StepsMap; //best route

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

const findBestMoves = (mine) => {
  const rowLength = mine.length;
  const colLength = mine[0].length;

  // Make new matrix to store the collected gold values
  let GoldMine = [];
  for (let i = 0; i < colLength; i++) {
    GoldMine[i] = new Array(rowLength);
  }

  for (let col = colLength - 1; col >= 0; col--) {
    for (let row = rowLength - 1; row >= 0; row--) {
      if (mine[row][col] == 0 || col == colLength - 1)
        //if last column OR value=0
        GoldMine[row][col] = mine[row][col];
      else {
        let right = col == colLength - 1 ? 0 : GoldMine[row][col + 1];

        let right_up =
          row == 0 || col == colLength - 1 ? 0 : GoldMine[row - 1][col + 1];

        let right_down =
          row == rowLength - 1 || col == colLength - 1
            ? 0
            : GoldMine[row + 1][col + 1];

        //our conditions to prevent the repeatition
        if (col < colLength - 2) {
          if (right == mine[row][col + 1] + GoldMine[row][col + 2]) right = 0;

          if (
            right_up &&
            row > 1 &&
            right_up == mine[row - 1][col + 1] + GoldMine[row - 2][col + 2]
          )
            right_up = 0;

          if (
            right_down &&
            row < rowLength - 2 &&
            right_down == mine[row + 1][col + 1] + GoldMine[row + 2][col + 2]
          )
            right_down = 0;
        }

        // Max gold collected from taking either of the above 3 paths
        GoldMine[row][col] =
          !right && !right_up && !right_down
            ? 0
            : mine[row][col] + Math.max(right, Math.max(right_up, right_down));
      }
    }
  }

  //console.log(colLength);
  //console.log(GoldMine);
  return GoldMine;
};

const move = (mine, position) => {
  const rowLength = mine.length;
  const colLength = mine[0].length;

  if (!position) {
    // the new map to determine the initial step
    StepsMap = findBestMoves(mine);
    // initial step
    let maxGoldMine = StepsMap[0][0];
    let maxIndex = 0;
    for (let i = 1; i < rowLength; i++) {
      if (StepsMap[i][0] > maxGoldMine) {
        maxGoldMine = StepsMap[i][0];
        maxIndex = i;
      }
    }
    //console.log("Position", { x: 0, y: maxIndex });
    return new Position(0, maxIndex);
  }
  // Forward steps
  else {
    let newX, newY;
    let row = position.y;
    let col = position.x;

    // this value tells where to move next
    let v = StepsMap[row][col] - mine[row][col];

    let newYdown, newYup, newYright;
    newYup = row !== 0 && v == StepsMap[row - 1][col + 1] ? row - 1 : 0;
    newYright = v == StepsMap[row][col + 1] ? row : 0;
    newYdown =
      row !== rowLength - 1 && v == StepsMap[row + 1][col + 1] ? row + 1 : 0;

    // conditions if the miner faced two equal values and have to choose from them
    if (
      newYup &&
      row > 1 &&
      StepsMap[newYup][col + 1] ==
        mine[row - 1][col + 1] + StepsMap[row - 2][col + 2]
    )
      newYup = 0;
    if (
      newYright &&
      col < colLength - 2 &&
      StepsMap[newYright][col + 1] ==
        mine[row][col + 1] + StepsMap[row][col + 2]
    )
      newYright = 0;
    if (
      newYdown &&
      row < rowLength - 2 &&
      StepsMap[newYdown][col + 1] ==
        mine[row + 1][col + 1] + StepsMap[row + 2][col + 2]
    )
      newYdown = 0;

    newY = Math.max(newYup, Math.max(newYright, newYdown));

    if (col != colLength - 1) newX = col + 1;

    //console.log(new Position(newX, newY));
    return new Position(newX, newY);
  }
};

export default move;
