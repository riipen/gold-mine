import fs from 'fs';
import readline from 'readline';

import Position from './position.js';

const DIRECTIONS = {
  DOWN: 'down',
  RIGHT: 'right',
  UP: 'up',
};

/**
 * Given a mine, output log file, and a final score, validates that the steps
 * taken are valid, as well that the final score is correct.
 *
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {string} logFile - A file location where moves of the miner were recorded.
 * @param  {Number} mineScore - The final score to validate against the moves made.
 *
 * @return {Boolean} Whether the moves made and final score are valid.
 */
const validate = async (mine, logFile, mineScore) => {
  if (!mine) throw new Error('a mine is required')
  if (!logFile) throw new Error('a logFile is required')

  const lineReader = readline.createInterface({
    input: fs.createReadStream(logFile)
  });

  let position;

  let valid = true;
  let score = 0;

  let previousDirection;
  let currentDirection;

  for await (const line of lineReader) {
    const step = line.split(',').map((v) => +v);

    if (!position) {
      position = new Position(step[0], step[1]);
    } else {
      // You must always move forward
      if (step[0] !== position.x + 1) valid = false;

      const validY = [
        position.y + 1,
        position.y,
        position.y - 1,
      ];

      // You must only move +1, 0 or -1 vertically in any given move
      if (!validY.includes(step[1])) valid = false

      // You can't go out of bounds
      if (step[0] > mine[0].length -1) valid = false;
      if (step[1] > mine.length -1) valid = false;

      if (step[1] === position.y + 1) {
        currentDirection = DIRECTIONS.UP;
      } else if (step[1] === position.y - 1) {
        currentDirection = DIRECTIONS.DOWN;
      } else {
        currentDirection = DIRECTIONS.RIGHT;
      }
    }

    // You cannot repeat the same movement direction twice in a row
    if (previousDirection && currentDirection && previousDirection === currentDirection) valid = false;

    // Breaks out of file reading
    if (!valid) lineReader.close();

    score += mine[step[1]][step[0]]

    // Move up to the valid position
    position.x = step[0];
    position.y = step[1];

    previousDirection = currentDirection;
  }

  return valid && mineScore === score;
};

export default {
  validate,
};
