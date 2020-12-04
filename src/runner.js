import fs from "fs";
import Position from "./position.js";
import move from "./move.js";
import { ppid } from "process";

/**
 * Given a mine, runs the miner through the mine collecting gold along the way.
 *
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {string} logFile - A file location where moves of the miner should be logged to.
 * @param  {Number} yStart - The y dimension starting position for the miner.
 *
 * @return {Number} The total gold collected by the miner.
 */

function optimize(a, modeA, b, modeB, val) {
  if (a > b) return [a + val, modeA];
  return [b + val, modeB];
}
function update(ans, val, x, y) {
  if (ans.val > val) return;
  ans.val = val;
  ans.x = x;
  ans.y = y;
}

const run = async (mine, logFile, yStart = 0) => {
  if (!mine) throw new Error("a mine is required");
  if (!logFile) throw new Error("a logFile is required");
  //---------------
  /* print out a[] for debug
  let p = [];
  for (let i = 0; i < mine[0].length; ++i) {
      p.push([]);
      for (let j = 0; j < mine.length; ++j)
          p[i].push(0);
  }
  */
  //---------------
  let a = [ [ [], [], [] ] ]; //our BFS value board
  let t = [ [ [], [], [] ] ]; //previous MOVE to backtrack from final position
  for (let i = 0; i < mine.length; ++i) { //initial move
      a[0][0].push(mine[i][0]); //filling array
      a[0][1].push(mine[i][0]);
      a[0][2].push(mine[i][0]);
      t[0][0].push(-1); //filling backtrack
      t[0][1].push(-1);
      t[0][2].push(-1);
  }
  //-----------
  let ans = {val: 0, m: -1 ,  x: -1, y: -1}; // result: score + final position

  for (let col = 0; col < mine[0].length; ++col) {
      a.push([ [], [], [] ]); // filling array
      t.push([ [], [], [] ]);
      for (let i = 0; i < mine.length; ++i) {
          a[col + 1][0].push(-1e9); t[col + 1][0].push(-1); //filling array
          a[col + 1][1].push(-1e9); t[col + 1][1].push(-1);
          a[col + 1][2].push(-1e9); t[col + 1][2].push(-1);
      }
      for (let i = 0; i < mine.length; ++i) {
          //p[i][col] = Math.max(a[col][0][i], a[col][1][i], a[col][2][i]); 
          //print out a[] for debug
          if (mine[i][col] == 0 || col + 1 == mine[0].length) {
              update(ans, a[col][0][i], col, i);
              update(ans, a[col][1][i], col, i);
              update(ans, a[col][2][i], col, i);
              continue;
          }
          let temp;
          if (i > 0) {
              temp = optimize(a[col][1][i], 1, a[col][2][i], 2, mine[i - 1][col + 1]);
              a[col + 1][0][i - 1] = temp[0];     t[col + 1][0][i - 1] = temp[1];
          } else {
              update(ans, a[col][0][i], col, i);
              update(ans, a[col][1][i], col, i);
          }
          //---
          temp = optimize(a[col][0][i], 0, a[col][2][i], 2, mine[i][col + 1]);
          a[col + 1][1][i] = temp[0];     t[col + 1][1][i] = temp[1];
          //---
          if (i < mine.length - 1) {
              temp = optimize(a[col][0][i], 0, a[col][1][i], 1, mine[i + 1][col + 1]);
              a[col + 1][2][i + 1] = temp[0];     t[col + 1][2][i + 1] = temp[1];
          } else {
              update(ans, a[col][1][i], col, i);
              update(ans, a[col][2][i], col, i);
          }
      }
  }
  //-------------------
  let trace = [];
  if (!(ans.y >=0 && ans.y < mine.length && !mine[ans.y][ans.x])){
      if (ans.y == 0) 
          trace.push(`${ans.x + 1},${ans.y - 1}`);
      else
          trace.push(`${ans.x + 1},${ans.y + 1}`);
  }
  while (ans.x >= 0) {
      //console.log(ans.x, ans.y, ans.m);
      trace.push(`${ans.x},${ans.y}`);
      let temp = ans.y;
      ans.y -= (ans.m - 1); // 0 -> + 1, 1 -> 0, 2 -> -1
      ans.m = t[ans.x][ans.m][temp];
      -- ans.x;
  }
  for (let i = trace.length - 1; i >= 0; --i)
      log(logFile, trace[i]);
  return ans.val;
}

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
  fs.appendFileSync(logFile, `${position}\n`);
};

export default {
  run
};
