
// Dictionary of direction for Y axis:
// keys: indecies of next three moves
// values: -1 -> go right up, 0 -> go right, 1 -> go right down
const directions = {
    0: -1,
    1: 0,
    2: 1
}


/**
 * Given an optimized final mine grid, finds the index of the highest score in the last column
 *
 * @param  {array} mineGrid - A n x m array respresenting the calculated final mine scores.
 *
 * @return {Number} - The index of the highest score in the last column.
 */
const findFinalMaxSocerIndex = (mineGrid) => {
    let row = mineGrid.length
    let col = mineGrid[0].length

    let maxIdx = mineGrid[0][col-1]
    for(let y = 0; y < row; y++){
        if(mineGrid[y][col-1] > maxIdx){
            maxIdx = y
        }
    }

    return maxIdx;
}

/**
 * Given a directions grid, checks if the next direction has played previously.
 *
 * @param  {array} directionsGrid - A n x m multidimensional array respresenting the mine directions.
 * @param  {Number} x - The x dimension.
 * @param  {Number} y - The y dimension.
 * @param  {Number} maxValueIdx - The y dimension where miner wants to go next.
 *
 * @return {Boolean} True if the next move has not played previously.
 */
const isValidDirection = (directionsGrid, x, y, maxValueIdx) => {
    let row = directionsGrid.length;

    return (maxValueIdx == 1 && directions[maxValueIdx] !== directionsGrid[y][x - 1]) ||
            (maxValueIdx == 0 && y !== 0 && directions[maxValueIdx] !== directionsGrid[y - 1][x - 1]) ||
            (maxValueIdx == 2 && y !== row - 1 && directions[maxValueIdx] !== directionsGrid[y + 1][x - 1])
}



/**
 * Given a directions grid, finds the next valid direction for miner to move.
 *
 * @param  {array} directionsGrid - A n x m multidimensional array respresenting the mine directions.
 * @param  {array} moves - An array of next three moves where miner can go.
 * @param  {Number} x - The x dimension.
 * @param  {Number} y - The y dimension.
 *
 * @return {Number} The  gold collected by the miner.
 */
const findNextMove = (directionsGrid, moves, x, y) => {

    let row = directionsGrid.length;

    let isAllZero = moves.every(item => item === 0);
    let maxValueIdx = isAllZero ? -1 : moves.indexOf(Math.max(...moves));

    while(!isAllZero && !isValidDirection(directionsGrid, x, y, maxValueIdx)){
        moves[maxValueIdx] = 0;
        isAllZero = moves.every(item => item === 0);
        maxValueIdx = isAllZero ? -1 : moves.indexOf(Math.max(...moves));
    }

    return maxValueIdx;
}


/**
 * Given a directions grid, runs the miner backward of the directionsGrid to fetch an optimal path.
 *
 * @param  {array} directionsGrid -  A n x m multidimensional array respresenting the mine directions.
 * @param  {array} firstIdx -  An empty array where the starting Y position will be added.
 *
 * @return {array} An array of optimal steps
 */
const backTrackPath = (directionsGrid, firstIdx) => {
    const col = directionsGrid[0].length;

    let steps = []
    let maxIdx = firstIdx[0]
    for (let x = col-1; x > 0; x--){
        steps.push(directionsGrid[maxIdx][x])
        maxIdx += directionsGrid[maxIdx][x]

    }
    
    firstIdx[0] = -1*maxIdx
    return steps.reverse();
}


/**
 * Given a mine, runs the miner through the mine collecting gold along the way.
 *
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {array} firstIdx - An empty array where the starting Y position will be added.
 *
 * @return {array} An array of optimal steps of the mine grid for miner to follow
 */
const findOptimalPath = (mine, firstIdx) => {

    const row = mine.length;
    const col = mine[0].length;

    // create a new mine grid and directions grid
    // each filled with 0 and -2 respectively
    let mineGrid = [...Array(row)].map(x=>Array(col).fill(0))
    let directionsGrid = [...Array(row)].map(x=>Array(col).fill(-2))

    // for each next move find an optimal and valid direction
    for (let x = 0; x < col; x++) {
        for (let y = 0; y < row; y++) {
            mineGrid[y][x] = mine[y][x];
            // skip if it's the first column or move value is zero
            if(x !==0 && mine[y][x] !== 0){
                let arrayOfMoves = []
                 // go right up
                arrayOfMoves.push((y === 0) ? 0 : mineGrid[y - 1][x - 1]);
                // go right
                arrayOfMoves.push( mineGrid[y][x - 1]);
                // go right down
                arrayOfMoves.push((y === row - 1) ? 0 : mineGrid[y + 1][x - 1]);

                let maxIdx = findNextMove(directionsGrid, arrayOfMoves, x, y)
                // if next move is invalid (-1), make move value zero
                // otherwise, add the next move value
                if(maxIdx === -1){
                    mineGrid[y][x] = 0;
                } else {
                    mineGrid[y][x] += arrayOfMoves[maxIdx];
                    directionsGrid[y][x] = directions[maxIdx];
                }
            }
        }
    }

    // find the position of the final highest score and
    // store in an array for backtracking
    let maxScoreIdx = findFinalMaxSocerIndex(mineGrid);
    firstIdx.push(maxScoreIdx)

    // finds the steps for miner to follow and the starting Y position
    const steps = backTrackPath(directionsGrid, firstIdx)

    return steps;
}

export default findOptimalPath;
