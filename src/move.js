import Position from "./position.js";
/**
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {object} position - The current position of the miner, will be undefined on the first move
 * @return {Position} The new position of the miner.
 */

 let lastMove; 
const move = (mine, position) => {

  if (!position) {
    // if position is undefined, set last move to sentinel value of -2
   lastMove = -2;
    return new Position(0, 0);
  }
  let r = position.y,
    c = position.x,
    bestCurrentMove = -1;
  let nextPos, nextMove;

  for (let move = -1; move <= 1; move++) {
    // Out of bounds check and last move check
    if (r + move < 0 || r + move >= mine.length || move == lastMove)
      continue;

    let moveValue = mine[r + move][c + 1];

    if (moveValue > bestCurrentMove) {
      nextPos = [r + move, c + 1];
      nextMove = move;
      bestCurrentMove = moveValue;
    }
  }
  lastMove = nextMove;

  return new Position(nextPos[1], nextPos[0]);
};

export default move;
