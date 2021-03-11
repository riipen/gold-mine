import Position from "./position.js";

let movedRight;

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

let previousMove, newX, newY, direction;;

const NextMove = {
  Right_up: "right_up",
  Right: "right",
  Right_down: "right_down"
};

const move = (mine, position) => {
  let minerPosition, goldMinerPath = {}, temp = {}, gold = 0;

  if (!position) {
    return new Position(0, 0);
  }

  switchMove(mine, position, previousMove, goldMinerPath);

  for (let direction in goldMinerPath) {
    if (goldMinerPath[direction] > gold) {
      gold = goldMinerPath[direction];;
      minerPosition = direction;
    }
  }

  if (Object.keys(goldMinerPath).length > 1) {
    let currentPosition = takeNextmove(minerPosition, mine, position);

    if (minerPosition !== NextMove.Right_up) {
      if (mine[position.y - 1]) {
        newX = currentPosition.y - 1;
        newY = currentPosition.x + 1;
        direction = NextMove.Right_up;
      }
    } else if (minerPosition !== NextMove.Right) {
      if (mine[currentPosition.y]) {
        newX = currentPosition.y;
        newY = currentPosition.x + 1;
        direction = NextMove.Right;
      }
    } else if (minerPosition !== NextMove.Right_down) {
      if (mine[currentPosition.y + 1]) {
        newX = currentPosition.y + 1;
        newY = currentPosition.x + 1;
        direction = NextMove.Right_down;
      }
      newX = 0;
      newY = 0;
    }

    temp[direction] = mine[newX][newY];

    if (Object.keys(temp).length === 0) {
      minerPosition = Object.keys(goldMinerPath).filter(opt => opt !== minerPosition)[0];
    }

  }

  if (!minerPosition) {
    let flagOut = true;
    return takeNextmove(previousMove, mine, position, flagOut);
  } else {
    previousMove = minerPosition;
    return takeNextmove(minerPosition, mine, position);
  }
};

let takeNextmove = (direction, mine, position, flagOut) => {
  if (!flagOut) {
    switch (direction) {
      case NextMove.Right_up:
        newX = (position && position.x + 1);
        newY = (position && position.y - 1);
        return new Position(newX, newY);

      case NextMove.Right:
        newX = (position && position.x + 1);
        newY = (position && position.y);
        return new Position(newX, newY);

      case NextMove.Right_down:
        newX = (position && position.x + 1);
        newY = (position && position.y + 1);
        return new Position(newX, newY);
    }
  } else {
    switch (direction) {
      case NextMove.Right_up:
        newX = (position && position.x + 1);
        newY = (position && position.y);
        return new Position(newX, newY);

      case NextMove.Right:
        newX = (position && position.x + 1);
        newY = (position && position.y + 1);
        return new Position(newX, newY);

      case NextMove.Right_down:
        newX = (position && position.x + 1);
        newY = (position && position.y);
        return new Position(newX, newY);
    }
  }
};

let switchMove = (mine, position, previousMove, goldMinerPath) => {
  if ((!previousMove || previousMove !== NextMove.Right_up) && mine[position.y - 1]) {
    goldMinerPath[NextMove.Right_up] = mine[position.y - 1][position.x + 1] || 0;
  }
  if ((!previousMove || previousMove !== NextMove.Right) && mine[position.y]) {
    goldMinerPath[NextMove.Right] = mine[position.y][position.x + 1] || 0;
  }
  if ((!previousMove || previousMove !== NextMove.Right_down) && mine[position.y + 1]) {
    goldMinerPath[NextMove.Right_down] = mine[position.y + 1][position.x + 1] || 0;
  }
};

export default move;
