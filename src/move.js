import Position from "./position.js";
const create_mine_guide = require("./create_mine_guide");

// Variable used to store a path matrix (in object format)
let mine_cache = {};
// Variable to store the "best path"
let movement_array = [];

/**
 * Movement function which generates the "optimal route" mine object and uses
 * that to determine the next move in the best path each time this function is
 * called.
 *
 * @param {array} mine - A n x m multidimensional array respresenting the mine.
 * @param {object} position - The current position of the miner, will be undefined on the first move
 *
 * @return {Position} The new position of the miner.
 */
 const move = (mine, position) => {
   if (position == undefined) {
     mine_cache = create_mine_guide(mine);
     const best_start_row = mine_cache.best_start_row;
     movement_array = mine_cache.best_path;

     return new Position(0, best_start_row)
   }

  const newX = (position && position.x + 1) || 0;
  const newY = position.y + movement_array.shift();

  return new Position(newX, newY);
};

export default move;
