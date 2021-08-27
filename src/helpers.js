
class Node {
  /**
   * Initializes a new node.
   *
   * @param  {Number} gold - The x dimensional position.
   * @param  {Object} rightUp - The next node positioned right up
   * @param  {Object} right - The next node positioned right 
   * @param  {Object} rightDown - The next node positioned right down
   *
   * @return {Object} The newly initialized Position.
   */
  constructor(gold, rightUp, right, rightDown){
    this.gold = gold;
    this.rightUp = rightUp;
    this.right = right;
    this.rightDown = rightDown;
  }
}

/**
 * @function findBestInitialY 
 * Returns the best starting value of the y dimension in a given dpMine. The best position is
 * the higher total gold value found in the first column. 
 * 
 * @param {array} dpMine - The intermediate n x m multidimensional array of objects
 * 
 * @return {Number} The best y coordinate starting position that has the highest total gold value
 */
const findBestInitialY = (dpMine) => {
    let y = 0
    dpMine.forEach((row, i) => {
        if(row[0].gold >= dpMine[y][0].gold){
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
 * @return {array} The intermediate n x m multidimensional array of objects
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


        
        if(atLastColumn || atZeroGoldArea){
          dpMine[y][x] = new Node(currentGold, -1, -1, -1)
        } else {
          let nextNodes = getNodesForNextMoves(dpMine, x, y)
            
          dpMine[y][x] = new Node(currentGold + nextNodes.bestNextGold, nextNodes.rightUpNode, nextNodes.rightNode, nextNodes.rightDownNode)
        } 
      }
    }
    return dpMine
}

/**
 * @function getValidNodesForMoves 
 * Returns the best next gold possible and the nodes for each next possible movement while setting invalid nodes to 0 gold 
 * 
 * @param {array} dpMine - The intermediate n x m multidimensional array of objects
 * @param {number} x - The x coordinate in the dpMine
 * @param {number} y - The y coordinate in the dpMine
 * 
 * @return {Object} An object containing the best next gold and the next nodes for every move
 */
const getNodesForNextMoves = (dpMine, x , y) => {
  let rightAndRightDownNotValid = y === 0 || dpMine[y-1][x+1].right.gold === 0 && dpMine[y-1][x+1].rightDown.gold === 0
  let rightUpAndRightDownNotValid = dpMine[y][x+1].rightUp.gold === 0 && dpMine[y][x+1].rightDown.gold === 0
  let rightUpAndRightNotValid = y === dpMine.length-1 || dpMine[y+1][x+1].rightUp.gold === 0 && dpMine[y+1][x+1].right.gold === 0

  let rightUpNode = rightAndRightDownNotValid ? new Node(0, -1, -1, -1) : dpMine[y-1][x+1]
  let rightNode =  rightUpAndRightDownNotValid ? new Node(0, -1, -1, -1) : dpMine[y][x+1]
  let rightDownNode =  rightUpAndRightNotValid ? new Node(0, -1, -1, -1) : dpMine[y+1][x+1]
  
  let possibleGolds = [rightUpNode.gold, rightNode.gold, rightDownNode.gold]
  let bestPossibleGold = Math.max(...possibleGolds)

  return {
    bestNextGold: bestPossibleGold,
    rightUpNode,
    rightNode,
    rightDownNode 
  }
}

/**
 * @function findBestNextMove 
 * Returns the best next y coordinate movement that will provide most gold while following movement restrictions
 * 
 * @param {array} dpMine - The intermediate n x m multidimensional array of objects
 * @param {object} currentPosition - An object containing the current position (x,y) coordinates
 * @param {number} lastmove - An number indicating the last movement made
 * 
 * @return {Number} The best next y coordinate movement that will provide most gold
 */
const findBestNextMove = (dpMine, currentPosition, lastMove) => {
  let currentNode = dpMine[currentPosition.y][currentPosition.x]
  let bestMove;
  let validMoves = [currentNode.rightUp.gold, currentNode.right.gold, currentNode.rightDown.gold]

  if(lastMove === -1){
    validMoves = [-1, currentNode.right.gold, currentNode.rightDown.gold]
  } else if(lastMove === 0){
    validMoves = [currentNode.rightUp.gold, -1, currentNode.rightDown.gold]
  } else if(lastMove === 1){
    validMoves = [currentNode.rightUp.gold, currentNode.right.gold, -1]
  }
  
  bestMove = validMoves.indexOf(Math.max(...validMoves)) - 1
  return bestMove
}

module.exports = { createDpMine, findBestInitialY, findBestNextMove, getNodesForNextMoves }
