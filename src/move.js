import Position from "./position.js";
import { createDpMine, findBestInitialY, findBestNextMove } from './helpers.js'

// global variables to store previous position and the intermediate table through iterations
let dpMine = null
let lastMove = null
let currentMine = null
let currentPosition = null

/**
 * Replace the logic in this function with your own custom movement algorithm.
 *
 * This function should run in a reasonable amount of time and should attempt
 * to collect as much gold as possible.
 *
 * Remember, landing outside the mine's boundary or on a "0" on the mine will
 * result in the run completing.
 *
 * @param  {array} mine - A n x m multidimensional array representing the mine.
 * @param  {object} position - The current position of the miner, will be undefined on the first move
 *
 * @return {Position} The new position of the miner.
 */
const move = (mine, position = null) => {
  if(!currentMine || currentMine != mine){
    currentMine = mine
    currentPosition = null
    lastMove = null
    dpMine = null
  }
  let startingPoint = currentPosition === null

  // at start of mine create the intermediate table
  if(dpMine === null) dpMine = createDpMine(mine)
  // choose the best starting Y coordinate
  if(startingPoint){
    let initialY = findBestInitialY(dpMine)

    currentPosition = new Position(0, initialY)
    lastMove = null
  } else {
   
    let bestNextMove = findBestNextMove(dpMine, currentPosition, lastMove)
    lastMove = bestNextMove
    currentPosition = new Position(position.x+1, position.y + bestNextMove)
  } 
  return currentPosition;
};

export default move;