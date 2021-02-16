import Position from "./position.js";
import { directions, getFirstHighY } from "./helper";

let init;
let currentDir;

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
  // TODO: write logic for miner. The current approach naive approach is to simply:
  //   1. Start at (0,0)
  //   2. Always moves right

  const newX = (position && position.x + 1) || 0;

  let newY;

  if (!init) {
    newY = (position && position.y) || getFirstHighY(mine, directions);
    init = true;
  } else {
    newY = position.y;

    const { up, str8, down } = directions(mine, newY, newX);

    if (!currentDir) {
      if (up >= str8 && up >= down) {
        newY = newY - 1;
        currentDir = "up";
      } else if (down >= str8 && down >= up) {
        newY = newY + 1;
        currentDir = "down";
      } else {
        newY = newY;
        currentDir = "str8";
      }
    } else {
      if (currentDir === "up") {
        if (down >= str8) {
          newY = newY + 1;
          currentDir = "down";
        } else {
          newY = newY;
          currentDir = "str8";
        }
      } else if (currentDir === "down") {
        if (up >= str8) {
          newY = newY - 1;
          currentDir = "up";
        } else {
          newY = newY;
          currentDir = "str8";
        }
      } else {
        if (up >= down) {
          newY = newY - 1;
          currentDir = "up";
        } else {
          newY = newY + 1;
          currentDir = "down";
        }
      }
    }

    if (mine[newY][newX] === 0) {
      init = false;
      currentDir = false;
    }
  }

  return new Position(newX, newY);
};

export default move;
