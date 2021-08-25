/*
 * This function will run in a reasonable amount of time and attempt to collect as much gold as possible.
 *
 * Landing outside the mine's boundary on any side or on a "0" results in the run completing.
 */

import Position from "./position.js";
import { sortBy } from "lodash"; // use the sortBy function to to filter our duplicate results from various choices

let movedRight;

const move = (mine, position) => {
  //Given logic was to go accross the row moving right constantly. Replaced with an algorithm similar to an assingment from school no changes were made to the other files.

  if (!movedRight) {
    movedRight = optimalPath(mine); // instead of using newX and newY we have to determine optimal paths through the matrix
  }

  position = movedRight.position; // put the current position of the optimal moves in the x/y plane into position
  movedRight = movedRight.nextCell; // obtain the next optimal move and place that in movedRight

  return position; // return the new position of the miner
};

function optimalPath(mine) {
  // we find the optimal path by traversing through the array and ultimatly building a linked list of moves that produce the highest possible score
  let moves = [];

  for (let y = 0; y < mine.length; y++) {
    //without changing x we traverse through
    const position = new Position(mine[0].length - 1, y);
    const move = new Choice(mine, position, mine[position.y][position.x]);
    moves.push(move);
  }

  let currentColumn = mine[0].length - 2; // declare starting column to traverse

  while (currentColumn-- >= 0) {
    //travers backwards taken note of the previous direction
    let previousDirection = [];

    moves.forEach((move) => {
      previousDirection.push(...move.getpreviousDirection()); // for every possiblity get previous direction
    });

    moves = filterPaths(previousDirection); // return the best path based on the previous dirction and filtering duplicates and selecting the highest scoring path
  }

  moves = sortBy(moves, "value"); // sort all possible moves by highest gold collected

  if (moves.length >= 1) {
    //Decrement each time this function is called
    return moves[moves.length - 1];
  }

  throw "This mine have not possible path"; // account for the empty mine input error or a mine that has all of it's first column as zero
}

function filterPaths(moves) {
  //take the list of move choices and sort/filter them out
  const map = {};

  moves.forEach((i) => {
    const key = `${i.position.toString()} - ${i.nextCell.position.toString()}`;
    map[key] = map[key] || [];
    map[key].push(i);
  });

  return Object.values(map).map((options) => {
    if (options.length === 0) return null; // trivial solution for the empty list

    return sortBy(options, "value")[options.length - 1]; // remove all duplicates and only keep the one with the highest value
  });
}

class Choice {
  //Define the object Choice that will contain our mine, current position, the value of gold at that position and the optimum next move for us
  constructor(mine, position, value, nextCell) {
    this.mine = mine;
    this.position = position;
    this.value = value;
    this.nextCell = nextCell;
  }

  getpreviousDirection() {
    let exclude;

    if (this.position.x === 0) {
      // at the start of our search
      return null;
    }

    if (this.nextCell) {
      exclude = this.nextCell.position.y - this.position.y;
    }

    const previousDirection = [
      // ensure that the y direction we are picking is not the same one we chose previously.
      exclude === 1
        ? null
        : new Position(this.position.x - 1, this.position.y - 1), // a move diagonally downwards and to the right

      exclude === 0 ? null : new Position(this.position.x - 1, this.position.y), // a move to the right

      exclude === -1
        ? null
        : new Position(this.position.x - 1, this.position.y + 1), // a move diagonally downwards and to the right
    ].filter((position) => position !== null && position.isValid(this.mine)); //returns only the elements that meet this condition

    return previousDirection.map(
      (lastLocation) =>
        new Choice(
          this.mine,
          lastLocation,
          this.mine[lastLocation.y][lastLocation.x] + this.value,
          this
        )
    ); // iterate this process for each choice
  }
}

export default move;
