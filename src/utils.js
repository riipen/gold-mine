
/**
 * @function getBestGoldForNextMove 
 * Returns the best gold value from the starting coordinates (x,y)
 * 
 * @param {array} mine - An n x m multidimensional array representing the mine.
 * @param {array} dpTable - The intermediate array of objects
 * @param {number} x - The x coordinate
 * @param {number} y - The y coordinate
 * @param {string} lastMove - The last move performed by the miner
 * 
 * @return {number} The best gold value from starting at (x,y) coordinates
 */
const getBestGoldForNextMove = (mine, dpTable, x, y, lastMove) => {
    let columns = mine[0].length
    let rows = mine.length
    
    let invalidMinePosition = y < 0 || y > rows-1 || x > columns-1 || x < 0
    if(invalidMinePosition) return 0
  
    let atLastColumn = (x === columns-1)
    if(atLastColumn) return mine[y][x]
  
    let goldPotential = [...dpTable[y][x].nextMoveGold]
  
    if(lastMove){
        reduceGoldPotentialForRepeatedMove(goldPotential, lastMove)
    }
    let bestGoldForNextMove = mine[y][x] + Math.max(...goldPotential)

    return bestGoldForNextMove
}

/**
 * @function reduceGoldPotentialForRepeatedMove 
 * Reduce the potencial gold for the next move to -1 if it is equal to the last move
 * 
 * @param {array} goldPotential - An array with the gold value from all three moves.
 * @param {string} lastMove - The last move performed by the miner
 * 
 * @return {number} -1 for the gold value of the move equal to the last move
 */
const reduceGoldPotentialForRepeatedMove = (goldPotential, lastMove) => {
    let lastMoveIndex;

    if(lastMove === "rightUp") lastMoveIndex = 0
    if(lastMove === "right") lastMoveIndex = 1
    if(lastMove === "rightDown") lastMoveIndex = 2

    return goldPotential[lastMoveIndex] = -1
}

/**
 * @function findBestInitialY 
 * Returns the best starting value of the y dimension in a given dpMine. The best position is
 * the higher total gold value found in the first column. 
 * 
 * @param {array} mine - An n x m multidimensional array representing the mine.
 * 
 * @return {Number} The best y coordinate starting position that has the highest total gold value
 */
const findBestInitialY = (dpMine) => {
    let y = 0
    dpMine.forEach((row, i) => {
        if(row[0].currentGold >= dpMine[y][0].currentGold){
        y = i
        }
    })
    return y
}

/**
 * @function createDpMine 
 * Create a table, called dpMine, for storing intermediate gold values and starts all cells to 0. The first column of 
 * dpMine gives the highest gold values that the miner can collect when starting from that position
 * 
 * @param {array} mine - An n x m multidimensional array representing the mine.
 * 
 * @return {array} The intermediate array of objects
 */
const createDpMine = (mine) => {
    let columns = mine[0].length
    let rows = mine.length
  
    // create the intermediate table with the same size as mine, filled arrays of zeros
    let dpMine = Array.from(Array(rows), i => Array(columns).fill(0))
  
    //starting from the right column
    for(let x = columns-1; x >= 0; x--){
      //going from first to last row
      for(let y = 0; y < rows; y++){
        let currentGold = mine[y][x]
        
        let atZeroGoldArea = (mine[y][x] === 0)
        let atLastColumn = (x === columns - 1)
        
        // no next move available for area with zero gold or in last column
        if(atZeroGoldArea || atLastColumn){
          dpMine[y][x] = {currentGold, nextMoveGold: [0, 0, 0]}
        } else {
            //get the best gold for every next possible move
          let nextMoveGold = [
            getBestGoldForNextMove(mine, dpMine, x+1, y-1, "rightUp"),
            getBestGoldForNextMove(mine, dpMine, x+1, y, "right"),
            getBestGoldForNextMove(mine, dpMine, x+1, y+1, "rightDown")]
          
          let bestNextGold = Math.max(...nextMoveGold)
  
          // create the object within every cell representing the current total gold to that position
          // and the possible gold for next moves
          dpMine[y][x] = {currentGold: currentGold + bestNextGold, nextMoveGold}
        }
      }
    }
    return dpMine
}

export { getBestGoldForNextMove, createDpMine, findBestInitialY }
