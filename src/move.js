import Position from "./position.js";

let movedRight;
let movedUp;
let movedDown;
let possibilities;
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


const checkMove = (lastDirection, xpos, ypos, mine, ) => {
  let next = {
    up: 0,
    right: 0,
    down: 0,
    biggest: ypos,
    upOptions: 0,
    rightOptions: 0,
    downOptions: 0
  };
  if (lastDirection === 'RIGHT') {
    next.biggest = ypos + 1
  }
  if (lastDirection !== 'UP' && ypos >= 1) {
    next.up = mine[ypos - 1][xpos + 1]
    next.upOptions = checkAhead('UP', xpos + 1, ypos - 1, mine, 0)
  }
  if (lastDirection !== 'RIGHT') {
    next.right = mine[ypos][xpos + 1]
    next.rightOptions = checkAhead('RIGHT', xpos + 1, ypos, mine, 0)
  }
  if (lastDirection !== 'DOWN' && ypos <= mine.length - 2) {
    next.down = mine[ypos + 1][xpos + 1]
    next.downOptions = checkAhead('DOWN', xpos + 1, ypos + 1, mine, 0)
  }
  movedUp = false;
  movedRight = false;
  movedDown = false;

  // Decide which position has the most possibilities, then check which has the highest score
  switch (lastDirection) {
    case 'UP':
      if (next.rightOptions === next.downOptions && next.right > 0 && next.down > 0) {
        if (next.right > next.down) {
          next.biggest = ypos;
          movedRight = true;
        } else {
          next.biggest = ypos + 1;
          movedDown = true
        }
      } else {
        if (next.rightOptions >= next.downOptions && next.right > 0) {
          next.biggest = ypos;
          movedRight = true;
        } else {
          next.biggest = ypos + 1;
          movedDown = true;
        }
      }
      break;
    case 'RIGHT':
      if (next.upOptions === next.downOptions && next.up > 0 && next.down > 0) {
        if (next.up > next.down) {
          next.biggest = ypos - 1;
          movedUp = true;
        } else {
          next.biggest = ypos + 1;
          movedDown = true
        }
      } else {
        if (next.upOptions >= next.downOptions && next.up > 0) {
          next.biggest = ypos - 1;
          movedUp = true;
        } else {
          next.biggest = ypos + 1;
          movedDown = true;
        }
      }
      break;
    case 'DOWN':
      if (next.upOptions === next.rightOptions && next.up > 0 && next.right > 0) {
        if (next.up > next.right) {
          next.biggest = ypos - 1;
          movedUp = true;
        } else {
          next.biggest = ypos;
          movedRight = true
        }
      } else {
        if (next.upOptions >= next.rightOptions && next.up > 0) {
          next.biggest = ypos - 1;
          movedUp = true;
        } else {
          next.biggest = ypos;
          movedRight = true;
        }
      }
      break;
  }
  return next.biggest
}

const checkAhead = (lastDirection, xpos, ypos, mine) => {
  possibilities = 0;
  if (lastDirection !== 'UP' && ypos >= 1) {
    if (mine[ypos - 1][xpos + 1] > 0) {
      possibilities++;
    }
  }
  if (lastDirection !== 'RIGHT') {
    if (mine[ypos][xpos + 1] > 0) {
      possibilities++;
    }
  }
  if (lastDirection !== 'DOWN' && ypos <= mine.length - 2) {
    if (mine[ypos + 1][xpos + 1] > 0) {
      possibilities++;
    }
  }
  return possibilities
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

  if (!position) { // Set first move - start in middle of the map
    newY = Math.floor(mine.length / 2);
    movedRight = true;
  } else if (movedRight) {
    newY = checkMove('RIGHT', position.x, position.y, mine)
  } else if (movedUp) {
    newY = checkMove('UP', position.x, position.y, mine)
  } else if (movedDown) {
    newY = checkMove('DOWN', position.x, position.y, mine)
  }
  
  return new Position(newX, newY);
};

export default move;
