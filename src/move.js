import Position from "./position.js";
import { sortBy } from "lodash";

/**
 * It'd be better to implement this as a generator rather than relying on a closure, but that would require modifying the runner to handle it.
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @return {Position} The new position of the miner.
 */
let bestMove = null;
const move = (mine) => {
  if (!bestMove) {
    bestMove = getBestMove(mine);
  }

  const pos = bestMove.pos;
  bestMove = bestMove.nextMove;

  return pos;
};

class Move {
  constructor(mine, pos, score, nextMove = null) {
    this.mine = mine;
    this.pos = pos;
    this.score = score;
    this.nextMove = nextMove;
  }

  getPredecessors() {
    if (this.pos.x === 0) { // x is 0 when we've reached the leftmost part of the mine, i.e. the start
      return null;
    }
    let exclude = -2; // dummy value so all moves are considered to start.
    if (this.nextMove) {
      exclude = this.nextMove.pos.y - this.pos.y;
    }

    // Figure out the y direction of where this goes to, e.g. if our next position is increasing y, we can't have
    // come from a position that also increased y.
    const predecessors = [
      exclude ===  1 ? null : new Position(this.pos.x-1, this.pos.y-1),
      exclude ===  0 ? null : new Position(this.pos.x-1, this.pos.y  ),
      exclude === -1 ? null : new Position(this.pos.x-1, this.pos.y+1),
    ].filter(position => position !== null && position.isValid(this.mine));
    
    return predecessors.map(moveFrom => new Move(this.mine, moveFrom, getCell(this.mine, moveFrom) + this.score, this));
  }
}

function getCell(mine, position) {
  return mine[position.y][position.x];
}

/**
 * Given a list of moves, groups them by position, then for every duplicate move within a position, returns the highest scoring one.
 * @param {Move[]} moves A list of moves
 * 
 * @return {Move[]} A list of best possible moves for some column of the mine.
 */
function filterBest(moves) {
  const map = {};
  moves.forEach(m => {
    const key = `${m.pos.toString()} - ${m.nextMove.pos.toString()}`;
    map[key] = map[key] || [];
    map[key].push(m);
  });

  return Object.values(map).map(moveList => {
    if (moveList.length === 0) return null;

    return sortBy(moveList, 'score')[moveList.length - 1];
  });
}

/**
 * @param {array} mine - A n x m multidimensional array respresenting the mine.
 * 
 * @return {Move} A linked list of moves with a valid start position, having the highest possible score of any other path through the mine
 */
function getBestMove(mine) {
  let moves = [];
  for (let y = 0; y < mine.length; y++) {
    const pos = new Position(mine[0].length-1, y);
    const move = new Move(mine, pos, getCell(mine, pos));
    moves.push(move);
  }

  let currentColumn = mine[0].length - 2; 
  while (currentColumn-- >= 0) {
    let predecessors = [];
    moves.forEach(move => {
      predecessors.push(...move.getPredecessors())
    });

    moves = filterBest(predecessors);
  }

  moves = sortBy(moves, "score");

  if (moves.length > 0) {
    return moves[moves.length - 1]; // In ascending order, so get the last element.
  }

  throw "There are no valid paths through the mine";
}

export default move;
export { Move, getBestMove, filterBest }; // Exports for tests
