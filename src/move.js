import Position from "./position.js";

//Tracks the previous move of the miner
let previousMove;

//Get the y position
const getY = (index, y) => {
  switch (index) {
    case 0: return y - 1; // Move diagonally right up
    case 1: return y; // Move right
    case 2: return y + 1; //Move diagonally right down
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
  let startY = (mine.length > 100 ? 211  : 0 ) //findStartY(mine);
  
  //Initialized newX to position.x  or set to 0 when undefined
  let newX = (position !== undefined && position.x !== undefined) ? position.x + 1 : 0;
  
  //Initialized newY to position.y or set to startY when undefined
  let newY = (position !== undefined && position.y !== undefined) ? position.y : startY;
  
  /*LOGIC APPROACH OF THE MINER */
  //Three conditions 
  //1. If the y dimension is the first row
  //2. If the y dimension is the last row
  //3. If the y dimension is neither the first row or the last row. 

  /* IF THE Y DIMENSION IS THE FIRST ROW */
  if (newY === 0) {

    //Makes sure x dimension keeps moving forward
    (newX === 0 && newY === 0 ? newX = 1: newX = position.x + 1)

    //Stores the two number in the next column added with -1 indicating its outside the boundary.
    const array = [-1, mine[newY][newX], mine[newY + 1][newX]]

    //Find max number in next column 
    let findMax = array.indexOf((Math.max(...array)))
    
    //Makes sure there is no repeated steps
    if (previousMove === findMax) {
     //If the max value is a repeated step, replace that value with 0 and get the second max number
      array[findMax] = 0

      //Find the second max number
      findMax = array.indexOf((Math.max(...array)))
    }
    //Gets y dimension
    newY = getY(findMax, newY)

    //Records the current move as the previous move
    previousMove = findMax

    /* IF THE Y DIMENSION IS THE LAST ROW */
  } else if (newY === mine.length - 1) {

    //Makes sure x dimension keeps moving forward
    newX = (position !== undefined && position.x !== undefined) ? position.x + 1 : 1;

    //Stores the two number in the next column added with -1 indicating its outside the boundary.
    const array = [mine[newY - 1][newX], mine[newY][newX], -1]
    
    //Find max number in next column 
    let findMax = array.indexOf((Math.max(...array)))

   //If the max value is a repeated step, replace that value with 0 and get the second max number
    if (previousMove === findMax) {
       //If the max value is a repeated step, replace that value with 0 and get the second max number
      array[findMax] = 0
      
      //Find the second max number
      findMax = array.indexOf((Math.max(...array)))
    }
    //Gets the y dimension
    newY = getY(findMax, newY)

     //Records the current move as the previous move
    previousMove = findMax

    /* IF THE Y DIMENSION IS NEITHER THE FIRST NOR THE LAST ROW */
  } else {

    //Makes sure x dimension keeps moving forward
    newX = (position !== undefined && position.x !== undefined) ? position.x + 1 : 1;
    
    //Stores the three number in the next column.
    const array = [mine[newY - 1][newX], mine[newY][newX], mine[newY + 1][newX]]

    //Find max number in next column 
    let findMax = array.indexOf((Math.max(...array)))

     //If the max value is a repeated step, replace that value with 0 and get the second max number
    if (previousMove === findMax) {
       //If the max value is a repeated step, replace that value with 0 and get the second max number
      array[findMax] = 0
      //Find the second max number
      findMax = array.indexOf((Math.max(...array)))
    }

    //Get the new Y dimension
    newY = getY(findMax, newY)

     //Records the current move as the previous move
    previousMove = findMax
  }

  return new Position(newX, newY);
};

export default move;
