import fs from "fs";
import { calculateGoldTally } from "./goldCollection.js";
import { highestStartPoint } from "./generation.js";
// import { fullPath } from "./goldCollection.js";

import move from "./move.js";
import Position from "./position.js";
import { generateTrackingPositionArray } from "./generation.js";

/**
 * Given a mine, runs the miner through the mine collecting gold along the way.
 * The optimal path is calculated first and then the miner runs along it.
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

  // tracking holds position values and direction general next direction
  const trackingMine = generateTrackingPositionArray(mine)
  const directionMine = generateTrackingPositionArray(mine)
  const goldMine = mine.map(function (arr) {
    return arr.slice();
  });

  calculateGoldTally(goldMine, trackingMine, directionMine);
  
  // Initial position
  let start = highestStartPoint(goldMine)
  let position = await move(start);
 
  // Track where the current X value should be
  let currentX = 0;

  // A running tally of the score
  let score = mine[position.y][position.x];

  // log the initial position
  log(logFile, position);

  while (position.x < mine[0].length - 1 && position.isValid(mine)) {
    if (position.x !== currentX) {
      throw new Error(
        `Current position must be at x === ${currentX}, not ${position}`
      );
    }

    position = await move(
      start,
      position,
      trackingMine
    );

    currentX++;

    log(logFile, position);

    if (!position.isValid(mine) || mine[position.y][position.x] === 0) break;

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
