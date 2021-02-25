import Position from "./position.js";
let { getNextMove } = require("./move_dp.js");

/**
 *
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {object} position - The current position of the miner, will be undefined on the first move
 *
 * @return {Position} The new position of the miner.
 */
const move = (mine, position) => {
  return getNextMove(mine, position);
};

export default move;
