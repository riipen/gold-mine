/**
 * For the explaination of the solution, please check the README.md in
 * the same directory of this file.
 */
import Position from "./position.js";

// Possible ways to move
const possibleMoves = [
  -1, // Go diagonally right and up
  0, // Go right
  1, // Go diagonally right and down
];

export const dp_tracking = {
  // A property to store the current mine which helps avoid duplicate seachs
  currentMine: undefined,

  // A property to track when perform dynamic programming
  tracking: [],

  // A property to track the best row to start
  bestStartRow: undefined,

  // A property to track previous move to satisfy the condition that the miner
  // cannot repeat it's previous move
  previousMove: undefined,
};

/**
 * This function performs the dynamic programming that find the best ways
 * to move at each position and track the result in the `tracking` property of `dp_tracking`
 *
 *
 * @param  {Number} x - The column index of the mine
 * @param  {Number} y - The row index of the mine
 * @param  {Number} previous - The index of the `possibleMoves` that represents the previous move
 *
 * @return {Number} The best amount of gold can collect in the position (`x`, `y`) according to the `previous` move.
 */
export const mining = (x, y, previous) => {
  // Validate the position
  if (
    y < 0 ||
    x < 0 ||
    y >= dp_tracking.currentMine.length ||
    x >= dp_tracking.currentMine[0].length ||
    dp_tracking.currentMine[y][x] == 0
  ) {
    // The miner leaves the mine, or the miner lands on a section of the mine that has zero gold.
    // As a result, the gold collection will cease
    return 0;
  }

  // Initialize the tracking for row `y` if needed
  if (dp_tracking.tracking[y] === undefined) dp_tracking.tracking[y] = [];

  // Initialize the tracking for column `x` of row `y` if needed
  if (dp_tracking.tracking[y][x] === undefined) dp_tracking.tracking[y][x] = [];

  // If there is tracking at the position (x, y) according to the previous move `previous`,
  // so jusr return the bestMine founded and the gold mined as the current position.
  if (dp_tracking.tracking[y][x][previous]) {
    return (
      dp_tracking.tracking[y][x][previous].bestMine +
      dp_tracking.currentMine[y][x]
    );
  }

  // Create variables to track best move, best mining result, and the result according
  // to each outgoing move.
  let bestMove;
  let bestMine = -999;
  let moves = [];

  // Go through all trackings according to the position (x, y) to reuse the
  // result, which avoids computing duplicate search for outgoing moves.
  for (let i = 0; i < possibleMoves.length; i++) {
    // Check whether the tracking at position (x, y) according to previous
    // move `i` is defined, since there is nothing to reuse in case of undefined
    if (dp_tracking.tracking[y][x][i]) {
      for (let j = 0; j < possibleMoves.length; j++) {
        moves[j] = dp_tracking.tracking[y][x][i].moves[j];
      }
    }
  }

  // Perform searching for the best results among the moves
  for (let i = 0; i < possibleMoves.length; i++) {
    // Only care about the case of outgoing move is different from previous move,
    // because the miner cannot repeat it's previous move
    if (i != previous) {
      if (moves[i] === undefined) {
        // Perform recursive call of dynamic programming when cannot reuse the result.
        // Move to the next column with the direction `possibleMoves[i]` and
        // `i` as the previous move
        moves[i] = mining(x + 1, y + possibleMoves[i], i);
      }

      // Update the best mining result and its corresponding move
      if (moves[i] > bestMine) {
        bestMine = moves[i];
        bestMove = i;
      }
    }
  }

  // Store the tracking at position (x, y) according to the previous move `previous`
  dp_tracking.tracking[y][x][previous] = {
    bestMine, // best mining result
    bestMove, // the index of `possibleMoves` representing the best direction to achieve `bestMine`
    moves, // the result of moves that can reuse
  };

  return bestMine + dp_tracking.currentMine[y][x];
};

/**
 * This function will compare the mine and `currentMine`, and perform searching for the best starting position and its
 * path to achieve the best amount of gold collected for the new mine.
 * It uses the global variable `currentMine` to track the already searched mine, which avoids duplicate searching
 *
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 *
 * @return {undefined}
 */
export const generateTrackingOnFirstRun = (mine) => {
  // Convert the array `mine` to string to perform array comparision
  mine = JSON.stringify(mine);

  // Check whether it is a new mine
  if (mine != dp_tracking.currentMine) {
    // Convert back to array to start searching
    dp_tracking.currentMine = JSON.parse(mine);

    // Initialize `tracking` as a new array when searching for a new mine
    dp_tracking.tracking = [];

    // Set the `previousMove` to the length of `possibleMoves`, so all the
    // moves are valid at the beginning (when on the first column)
    dp_tracking.previousMove = possibleMoves.length;

    // A variable the best mining result among the rows of the first column
    let bestMine = -1;

    // Checking all the rows of the first column to find the best starting position
    for (let i = 0; i < dp_tracking.currentMine.length; i++) {
      // Seaching for the result when starting at row `i`
      let mineResult = mining(0, i, dp_tracking.previousMove);

      // Update the best mining result and the correspoding starting row to achieve that
      if (mineResult > bestMine) {
        bestMine = mineResult;
        dp_tracking.bestStartRow = i;
      }
    }

    // Set the `currentMine` to string form of `mine`, which helps compare in the next calls
    dp_tracking.currentMine = mine;
  }
};

/**
 * This function will calculate the new position for the miner based on the `tracking`
 * and `bestStartRow`
 *
 * @param  {object} position - The current position of the miner, will be undefined on the first move
 *
 * @return {Position} The new position of the miner.
 */
export const getNextMove = (position) => {
  // On the first move, it needs to start at column 0 and row `bestStartRow`
  if (position === undefined) {
    return new Position(0, dp_tracking.bestStartRow);
  }

  // For the following moves, it will perform the best move at position (x, y)
  // according to the previous move `previousMove`.
  dp_tracking.previousMove =
    dp_tracking.tracking[position.y][position.x][
      dp_tracking.previousMove
    ].bestMove;

  return new Position(
    position.x + 1,
    position.y + possibleMoves[dp_tracking.previousMove]
  );
};
