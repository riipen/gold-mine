import Position from "./position.js";

let movedRight;

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

  const startPos = () =>{
    return Number(Math.floor(((Math.random() * ((mine.length  / 2)) + 1))));
  }

  const newX = (position && position.x + 1) || 0;

  let newY;

  if (!movedRight) {
    newY = (position && position.y) || startPos();
    movedRight = true;
  } else {
    newY = (position && position.y + 1) || startPos();
    movedRight = false;
  }
  
  return new Position(newX, newY);
};

export default move;
