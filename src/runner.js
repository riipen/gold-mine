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

  // Initialize position and final results
  let finalScore = 0;
  let position = new Position(0, 0);
  let maxIndex = 0;
  let paths = Array();

  // Start from the first column and run the greedy algorithm
  // on each starting point
  for (var i = 0; i < mine.length; i++) {

    // Initialize the starting position and local path
    let currentX = 0;
    position = new Position(0, i);
    let score = 0;
    let path = Array();
    path.push(position);
    let invalidFlag = false;
    let whileLoopCounter = 0;
    

    // From each starting point on the first column, run the greedy step
    while (position.x < mine[0].length - 1 && position.isValid(mine)) {

      if (position.x !== currentX) {
        throw new Error(
          `Current position must be at x === ${currentX}, not ${position}`
        );
      }

      // If number of the steps is more than the size of mine, then there is a dead end.
      if (whileLoopCounter > mine[0].length) {
        break;
      }
      
      // Greedy Step heuristic and verify if the step is valid.
      var moveObject = await move(mine, position, path, invalidFlag);
      position = moveObject.position;
      invalidFlag = moveObject.invalidFlag;
      path.push(position);
      
      currentX = path.length - 1;
      
      // If heuristic met a dead end, undo the step to choose another direction until
      // we found a nother valid position.
      if (!position.isValid(mine) || mine[position.y][position.x] === 0) {

        var moveObject = await move(mine, position, path, invalidFlag);
        position = moveObject.position;
        invalidFlag = moveObject.invalidFlag;

        // If still not valid, we just stop.
        if (invalidFlag) {
          break;
        }
        else {
          path.push(position);
          currentX = path.length - 1;
        }
        
      }
      whileLoopCounter++;
  
    }

    // Calculate the score after we get one full path from one starting point
    for (var j = 0; j < path.length; j++) {
      score += mine[path[j].y][path[j].x];
    }

    // Update the max score and max path
    if (score > finalScore) {
      maxIndex = i;
    }
    finalScore = Math.max(score, finalScore);
    paths.push(path);
  }


  // Log the max path for validation
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