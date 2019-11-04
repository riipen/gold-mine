import Position from "./position.js";

let movedRight;
let movedUp;
let movedDown;
let moveNumber;
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

const checkMove = (lastDriection, xpos, ypos, mine,) => {
  let next = {
    right: 0,
    up: 0,
    down: 0,
    biggest: ypos
  };
  if (lastDriection === 'RIGHT') {
    next.biggest = ypos + 1 
  }
  if (lastDriection !== 'UP' && ypos >= 1) {
    next.up = mine[ypos - 1][xpos + 1]
  }
  if (lastDriection !== 'RIGHT') {
    next.right = mine[ypos][xpos + 1]
  }
  if (lastDriection !== 'DOWN' && ypos <= mine.length - 2) {
    next.down = mine[ypos + 1][xpos + 1]
  }
  movedUp = false;
  movedRight = false;
  movedDown = false;
  if (next.up > next.down) {
    if (next.up > next.right) {
      next.biggest = ypos - 1
      movedUp = true;
    } else {
      movedRight = true;
    }
  } else {
    if (next.down > next.right) {
      next.biggest = ypos + 1

      movedDown = true;
    } else {
      movedRight = true;
    }
  }
  return next.biggest
}

const move = (mine, position) => {


  const newX = (position && position.x + 1) || 0;
  if (newX === mine.length) {
    if (!movedRight) {
      return new Position(newX, position.y)
    } else {
      return new Position(newX, position.y + 1)
    }
  }
  let newY;
  if (!position) {
    newY = Math.round(mine.length /2) ; // TODO logic to chose starting location 
    movedRight = true;
    moveNumber = 0;
  } else if (movedRight) {
    newY = checkMove('RIGHT', position.x, position.y, mine)
  } else if (movedUp) {
    newY = checkMove('UP', position.x, position.y, mine)
  } else if (movedDown) {
    newY = checkMove('DOWN', position.x, position.y, mine)
  }
  moveNumber++;
  // console.log('MOVE:', moveNumber, '\nCurrent Position { x:', newX, 'y:', newY, '}')
  return new Position(newX, newY);
};

export default move;
