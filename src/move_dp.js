import Position from "./position.js";

let dpHolder = null;                  // intermediate calculation result
let mineReference = null;       // a reference to the mine that is being solved

// store the current and last positions to
// calculate which movement is not allowed
let lastPosition = null;
let currentPosition = null;

// 0-based, continuous enum representing the possible moves at a location
const PossibleMovesEnum = {
    DIAGONALLY_UP: 0,
    HORIZONTALLY: 1,
    DIAGONALLY_DOWN: 2
};

/**
 * Return the next position that a miner should take, given the current position,
 * to maximize the amount of gold collected. This function will remember the
 * position to calculate the allowed moves.
 * @param {array} mine the mine to move in
 * @param {Position} position the current position
 * 
 * @return {Position} The new position of the miner.
 */
const getNextMove = (mine, position) => {
    // ensure the mine is valid
    if (!Array.isArray(mine) || mine.length === 0 || mine[0].length === 0) {
        // mine needs to be at least 1x1
        throw new Error('Invalid mine dimension');
    }

    // no solved data available. Solve the mine first
    if (mineReference === null || mineReference != mine) {
        // store the mine reference to prevent recomputation
        mineReference = mine;

        // solve the given mine
        dpHolder = solveMine(mine);

        // reset the temporary position storage
        lastPosition = null;
        currentPosition = null;
    }

    if (position === undefined) {
        // no position given, return the best starting position
        let bestStartingY = 0;

        // find the starting point with the highest potential score
        for (let i = 1; i < mine.length; i++) {
            if (dpHolder[i][0].currentScore > dpHolder[bestStartingY][0].currentScore) {
                bestStartingY = i;
            }
        }

        // update position tracking
        lastPosition = null;
        currentPosition = new Position(0, bestStartingY);
    } else {
        // find the next best move when given a position.
        // This will also use the previous stored position to
        // find the disallowed move if it's a valid previous position
        let scoreIfMoveDiagonallyUp = getBestScore(mine, dpHolder, position.x + 1, position.y - 1, PossibleMovesEnum.DIAGONALLY_UP);
        let scoreIfMoveHorizontally = getBestScore(mine, dpHolder, position.x + 1, position.y, PossibleMovesEnum.HORIZONTALLY);
        let scoreIfMoveDiagonallyDown = getBestScore(mine, dpHolder, position.x + 1, position.y + 1, PossibleMovesEnum.DIAGONALLY_DOWN);
        let possibleScores = [scoreIfMoveDiagonallyUp, scoreIfMoveHorizontally, scoreIfMoveDiagonallyDown];

        // if there is a valid lastPosition, prevent making the same movement again
        if (
            lastPosition && currentPosition &&
            currentPosition.x - lastPosition.x === 1 &&
            Math.abs(currentPosition.y - lastPosition.y) <= 1
        ) {
            let yChange = currentPosition.y - lastPosition.y;   // get movement direction
            let disallowedMoveIndex = yChange + 1;              // map {-1,1} to {0,2}

            possibleScores[disallowedMoveIndex] = -Infinity;    // disallow making the same move
        }

        // get the index of the best allowed move
        let indexOfMaxScore = possibleScores.indexOf(Math.max(...possibleScores));

        // update position tracking
        lastPosition = currentPosition;
        currentPosition = new Position(position.x + 1, position.y + (indexOfMaxScore - 1));
    }

    // return the new position
    return currentPosition;
};

/**
 * Solve the given mine. Store solved result in 'dp'.
 * dp[y][x] contains 'currentScore' and 'nextMovePotential'.
 * 'currentScore' is the best score possible if starting at (x,y)
 * 'nextMovePotential' is an array of size 3 containing the potential
 *      scores gain if going:
 *          - diagonally up (index 0)
 *          - horizontally (index 1)
 *          - diagonally down (index 2)
 * @param {array} mine the mine to solve
 * 
 * @return {object} intermediate dp object
 */
const solveMine = (mine) => {
    // get the size of the mine
    let rows = mine.length;
    let columns = mine[0].length;

    // initialize dp to an array of empty array with size of 'rows' (i.e. 'rows' x 0 matrix)
    let dp = Array.from(Array(rows), () => []);

    // starting at the last column, going towards the first
    for (let c = columns - 1; c > -1; c--) {
        // iterate through each row, finding the best score for each possible path
        for (let r = rows - 1; r > -1; r--) {
            if (mine[r][c] == 0 || c == columns - 1) {
                // no next move available for field with 0 gold or field in the last column
                dp[r][c] = {
                    currentScore: mine[r][c],       // maximum score possible if starting here is equal to the cell value
                    nextMovePotential: [0, 0, 0]    // no next move available, so 0 potential
                }
            } else {
                // array of 3 integers: they store the additional score from moving to top-right, right, and bottom-right
                let nextMovePotential = [
                    getBestScore(mine, dp, c + 1, r - 1, PossibleMovesEnum.DIAGONALLY_UP),
                    getBestScore(mine, dp, c + 1, r, PossibleMovesEnum.HORIZONTALLY),
                    getBestScore(mine, dp, c + 1, r + 1, PossibleMovesEnum.DIAGONALLY_DOWN)
                ];

                // dp object for position (x,y)=(c,r)
                dp[r][c] = {
                    currentScore: mine[r][c] + Math.max(...nextMovePotential),          // best score possible if starting at this position
                    nextMovePotential                                                   // potential score gain when moving in one of the 3 directions
                };
            }
        }
    }

    return dp;
}

/**
 * Return the best end score possible when starting at (x,y) in the
 * mine while disallowing movement in the direction specified by 'ignoreMove'
 * @param {array} mine array representing the mine
 * @param {object} dp intermediate dp object
 * @param {number} x x coordinate within the mine
 * @param {number} y y coordinate within the mine
 * @param {PossibleMovesEnum} ignoreMove the move to disallow when finding the best score
 * 
 * @return {number} the best possible score when starting at (x,y) in the given mine
 * while disallowing moving in the 'ignoreMove' direction
 */
const getBestScore = (mine, dp, x, y, ignoreMove) => {
    // get the size of the mine
    let rows = mine.length;
    let columns = mine[0].length;

    if (x < 0 || x > columns - 1 || y < 0 || y > rows - 1) {
        // out of bound
        return 0;
    }

    if (x === columns - 1) {
        // if starting at last column, final score will
        // always be whatever value is at that cell
        return mine[y][x];
    }

    if (mine[y][x] === 0) {
        // this section has no gold
        return 0;
    }

    // set the potential score from the 'ignoreMove' direction
    // to -Infinity to discourage moving in that direction
    let potentialMoveScores = [...dp[y][x].nextMovePotential];
    if (ignoreMove !== null) {
        potentialMoveScores[ignoreMove] = -Infinity;
    }

    // return the best score (disallowing the 'ignoreMove' path)
    return mine[y][x] + Math.max(...potentialMoveScores);
};

module.exports = {
    getNextMove,
    solveMine,
    getBestScore
};