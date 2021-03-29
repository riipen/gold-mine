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
  

  for (var j = mine[0].length -1; j > -1; j--) {
    for (var i = 0; i < mine.length; i++) {

      let rightValue = 0;
      let rightUpValue = 0;
      let rightDownValue = 0;

      if (j != mine[0].length - 1) rightValue = mineTracking[i][j + 1];

      if (i != 0 && j != mine[0].length-1) rightUpValue = mineTracking[i - 1][j + 1];

      if (i != mine.length-1 && j != mine[0].length-1) rightDownValue = mineTracking[i + 1][j + 1];

      mineTracking[i][j] = mine[i][j] + Math.max(rightValue, rightUpValue, rightDownValue);
    }
  }

  for (var i = 0; i < mine.length; i++) {
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
    let whileCount = 0;

    //console.log("START");
    //console.log(position);
    while (position.x < mine[0].length - 1 && position.isValid(mine)) {

      if (position.x !== currentX) {
        throw new Error(
          `Current position must be at x === ${currentX}, not ${position}`
        );
      }

      let currentPos = position;
      
      position = await move(mine, position, traceMoves, path, mineTracking);

      if (typeof position === 'undefined') break;

      if (whileCount > mine[0].length + 1000) {
        break;
      }
      
      if (!position.isValid(mine) || mine[position.y][position.x] === 0) {
        break;
      }

      if (path.length > 0) {
        currentPos = path[path.length-1];
      }

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

      let stepOps = {rightFlag: movingOps.rightFlag, rightUpFlag: movingOps.rightUpFlag, rightDownFlag: movingOps.rightDownFlag};
      path.push(position);
      traceMoves.push(stepOps);
      currentX = path.length - 1;
      whileCount++;
    }
    

    for (var j = 0; j < path.length; j++) {
      score += mine[path[j].y][path[j].x];
    }
    //console.log(path[path.length-1]);
    //console.log(score);
    //console.log("END");

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