import fs from "fs";

import move from "./move.js";
import validator from "./validator.js";
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
  
  let maxIndex = 0;
  
  const mineTracking = Array.from(Array(mine.length), _ => Array(mine[0].length).fill(0));

  for (var j = mine[0].length -1; j > -1; j--) {
    for (var i = 0; i < mine.length; i++) {

      let rightValue = 0;
      let rightUpValue = 0;
      let rightDownValue = 0;

      if (mine[i][j] === 0) continue;

      if (j != mine[0].length - 1) rightValue = mineTracking[i][j + 1];

      if (i != 0 && j != mine[0].length-1) rightUpValue = mineTracking[i - 1][j + 1];

      if (i != mine.length-1 && j != mine[0].length-1) rightDownValue = mineTracking[i + 1][j + 1];

      mineTracking[i][j] = mine[i][j] + Math.max(rightValue, rightUpValue, rightDownValue);
      
    }
  }

  let maxScore = 0;
  for (var i =0; i < mine.length; i++) {
    let currMax = maxScore;
    maxScore = Math.max(maxScore, mineTracking[i][0]);
    if (maxScore > currMax) {
      maxIndex = i;
    }
  }

  let position = new Position(0, maxIndex);
  let currentX = 0;
  let score = mine[position.y][position.x];
  log(logFile, position);

  while (position.x < mine[0].length && position.isValid(mine)) {
    if (position.x !== currentX) {
      throw new Error(
        `Current position must be at x === ${currentX}, not ${position}`
      );
    }

    position = await move(mine, position, mineTracking);
    currentX++;
    


    if (!position.isValid(mine) || mine[position.y][position.x] === 0) {
      break;
    }

    log(logFile, position);

    score += mine[position.y][position.x];
  }

  return score;
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
