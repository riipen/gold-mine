import fs from "fs";

import move from "./move.js";
import Position from "./position.js";

/**
 * Given a mine, runs the miner through the mine collecting gold along the way.
 *
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {string} logFile - A file location where moves of the miner should be logged to.
 * @param  {Number} yStart - The y dimension starting position for the miner.
 *
 * @return {Number} The total gold collected by the miner.
 */
const run = async (mine, logFile, yStart = 0) => {
  if (!mine) throw new Error("a mine is required");
  if (!logFile) throw new Error("a logFile is required");

  let finalScore = 0;
  let position = new Position(0, 0);
  let maxIndex = 0;
  let paths = new Array();

  const mineTracking = Array.from(Array(mine.length), _ => Array(mine[0].length).fill(0));

  let column_weights = new Array();
  let column_dividen = 1 / mine[0].length;

  // If there is less 0 in one column, then give the
  // particular column more weights for reward.
  for (var j = 0; j < mine[0].length; j++) {
    let zeroCounter = 0;
    for (var i = 0; i < mine.length; i++) {
      if (mine[i][j] != 0) {
        zeroCounter++;
      }
    }
    column_weights.push(zeroCounter/mine[0].length);
  }

  // Run Dynamic Programming to calculate the value
  // for each position from all possible directions
  // with column weights.
  // Inspired by: https://www.geeksforgeeks.org/gold-mine-problem/
  // Time complexity O(row * col), Space Complexity (memory) O(rol * col)
  for (var j = mine[0].length -1; j > -1; j--) {
    for (var i = 0; i < mine.length; i++) {

      let rightValue = 0;
      let rightUpValue = 0;
      let rightDownValue = 0;

      // Back track the right value from the next column
      if (j != mine[0].length - 1) rightValue = mineTracking[i][j + 1] * (column_weights[j]);

      // Back track the right Up value from the next column
      if (i != 0 && j != mine[0].length-1) rightUpValue = mineTracking[i - 1][j + 1] * (column_weights[j]);

      // Back track the right Down value from the next column
      if (i != mine.length-1 && j != mine[0].length-1) rightDownValue = mineTracking[i + 1][j + 1] * (column_weights[j]);

      // Back track value should be the max value among the three direction
      mineTracking[i][j] = mine[i][j] + Math.max(rightValue, rightUpValue, rightDownValue);
    }
  }

  // Since we can't replicate the two consecutive moves,
  // Then we can't follow the maximum path from the DP table completely.
  // Instead we choose the greedy move from each starting point of the first column.
  // And then compare the final score from each greedy path.
  // T: O(n * m), S: O(n * m)
  for (var i = 0; i < mine.length; i++) {

    // Initialize each starting position, path tracking array and move tracking array.
    // Move tracking array is used for preventing the duplicated move;
    let currentX = 0;
    position = new Position(0, i);
    let score = 0;
    let path = new Array();
    let traceMoves = new Array();
    path.push(position);
    let rightFlag = true;
    let rightUpFlag = true;
    let rightDownFlag = true;
    let movingOps = {rightFlag: rightFlag, rightUpFlag: rightUpFlag, rightDownFlag: rightDownFlag};
    traceMoves.push(movingOps);
    let loopCount = 0;

    // Running each gready move until we hit the last column or we hit an invalid position
    while (position.x < mine[0].length - 1 && position.isValid(mine)) {

      // Column validation
      if (position.x !== currentX) {
        throw new Error(
          `Current position must be at x === ${currentX}, not ${position}`
        );
      }

      // Track current position
      let currentPos = position;
      
      // Move position
      position = await move(mine, position, traceMoves, path, mineTracking);

      // Since I implemented an undo move function, sometimes we 
      // still can't get through a wall of Zeros with all possible
      // moving directions even after undo moves. Then we can be
      // sure we hit a dead end and we need to stop the mining.
      if (typeof position === 'undefined') break;

      // Keep heuristic move until we hit a dead end.
      if (loopCount > mine[0].length + 1000) {
        break;
      }
      
      if (!position.isValid(mine) || mine[position.y][position.x] === 0) {
        break;
      }

      // Keep track of current position
      if (path.length > 0) {
        currentPos = path[path.length-1];
      }

      // Prevent the replicated moves
      if ((position.y - currentPos.y) === 0) {
        movingOps.rightFlag = false;
        movingOps.rightUpFlag = true;
        movingOps.rightDownFlag = true;
      }
      if ((position.y - currentPos.y) === 1) {
        movingOps.rightFlag = true;
        movingOps.rightUpFlag = true;
        movingOps.rightDownFlag = false;
      }
      if ((position.y - currentPos.y) === -1) {
        movingOps.rightFlag = true;
        movingOps.rightUpFlag = false;
        movingOps.rightDownFlag = true;
      }

      // Record the position and moves.
      let stepOps = {rightFlag: movingOps.rightFlag, rightUpFlag: movingOps.rightUpFlag, rightDownFlag: movingOps.rightDownFlag};
      path.push(position);
      traceMoves.push(stepOps);
      currentX = path.length - 1;
      loopCount++;
    }
    

    for (var j = 0; j < path.length; j++) {
      score += mine[path[j].y][path[j].x];
    }

    if (score > finalScore) {
      maxIndex = i;
    }
    finalScore = Math.max(score, finalScore);
    paths.push(path);
  }

  for (var i = 0; i < paths[maxIndex].length; i++) {
    log(logFile, paths[maxIndex][i]);
  }

  return finalScore;
};

/**
 * Logs the miner's current position to a log file. This file is used for validation
 * of all moves in the run.
 *
 * @param  {string} logFile - A file location where the given position should be logged to.
 * @param  {Object} position - The current location of the miner.
 *
 * @return {undefined}
 */
const log = (logFile, position) => {
  fs.appendFileSync(logFile, `${position.toString()}\n`);
};

export default {
  run
};