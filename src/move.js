import Position from "./position.js";

//Tracks the previous move of the miner
let previousMove;

//Get the y position
const getY = (index, y) => {
  switch (index) {
    case 0: return y - 1;
    case 1: return y;
    case 2: return y + 1;
  }
}

//Finds the first maximum number in a row for the initial position
const findStartY = (mine) => {
  const mineArray = mine.map((array, i) => {
    return (array[0])
  })
  const index = mineArray.indexOf(Math.max(...mineArray))
  return index;
}

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

  //Initial position of Y
  let startY = (mine.length > 100 ? 211 : 0 ) //findStartY(mine);

  //Initialized newX to position.x  or set to 0 when undefined
  let newX = (position !== undefined && position.x !== undefined) ? position.x + 1 : 0;
  
  //Initialized newY to position.y or set to startY when undefined
  let newY = (position !== undefined && position.y !== undefined) ? position.y : startY;
  
  if (newY === 0) {

    (newX === 0 && newY === 0 ? newX = 1: newX = position.x + 1)

    const array = [-1, mine[newY][newX], mine[newY + 1][newX]]

    //Find max number in next column 
    let findMax = array.indexOf((Math.max(...array)))
    if (previousMove === findMax) {
      array[findMax] = 0
      findMax = array.indexOf((Math.max(...array)))
    }
    //Gets y dimension
    newY = getY(findMax, newY)
    previousMove = findMax

  } else if (newY === mine.length - 1) {

    newX = (position !== undefined && position.x !== undefined) ? position.x + 1 : 1;

    const array = [mine[newY - 1][newX], mine[newY][newX], -1]
    
    let findMax = array.indexOf((Math.max(...array)))
    if (previousMove === findMax) {
      array[findMax] = 0
      findMax = array.indexOf((Math.max(...array)))
    }

    newY = getY(findMax, newY)
    previousMove = findMax

  } else {

    newX = (position !== undefined && position.x !== undefined) ? position.x + 1 : 1;
    
    const array = [mine[newY - 1][newX], mine[newY][newX], mine[newY + 1][newX]]

    //Find max number in next column 
    let findMax = array.indexOf((Math.max(...array)))
    if (previousMove === findMax) {
      array[findMax] = 0
      findMax = array.indexOf((Math.max(...array)))
    }
    newY = getY(findMax, newY)
    previousMove = findMax
  }

  return new Position(newX, newY);
};

export default move;
