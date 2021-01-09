import Position from "./position.js";
const RIGHT_UP = "RightUp";
const RIGHT = "Right";
const RIGHT_DOWN = "RightDown";
let lastMove;
let helperObject = {};
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
const move = (mine, position) => {
  if (!position) {
    //Starting position
    let newY;
    let maxScore = -1;
    for (let y = 0; y < mine.length; y++) {
      const score = bestTotalScore(new Position(0, y), mine);
      if (score > maxScore) {
        maxScore = score;
        newY = y;
      }
    }
    return new Position(0, newY);
    // return new Position(0, 0);
  } else {
    const newX = (position && position.x + 1) || 0;
    const currentY = (position && position.y) || 0;
    const rightUpBestScore =
      lastMove === RIGHT_UP
        ? -1
        : helperObject[currentY - 1] && helperObject[currentY - 1][newX]
        ? helperObject[currentY - 1][newX]
        : bestTotalScore(new Position(newX, currentY - 1), mine);
    const rightBestScore =
      lastMove === RIGHT
        ? -1
        : helperObject[currentY] && helperObject[currentY][newX]
        ? helperObject[currentY][newX]
        : bestTotalScore(new Position(newX, currentY), mine);
    const rightDownBestScore =
      lastMove === RIGHT_DOWN
        ? -1
        : helperObject[currentY + 1] && helperObject[currentY + 1][newX]
        ? helperObject[currentY + 1][newX]
        : bestTotalScore(new Position(newX, currentY + 1), mine);

    const maxNextStepScore = Math.max(
      rightUpBestScore,
      rightBestScore,
      rightDownBestScore
    );
    let newY;

    if (maxNextStepScore == rightUpBestScore) {
      lastMove = RIGHT_UP;
      newY = (position && currentY - 1) || 0;
    } else if (maxNextStepScore == rightBestScore) {
      lastMove = RIGHT;
      newY = (position && currentY) || 0;
    } else if (maxNextStepScore == rightDownBestScore) {
      lastMove = RIGHT_DOWN;
      newY = (position && currentY + 1) || 0;
    }

    return new Position(newX, newY);
  }
};

const bestTotalScore = (position, mine) => {
  // console.log("checking position", position);
  if (position.y >= 0 && position.isValid(mine)) {
    if (
      helperObject[position.y] &&
      helperObject[position.y][position.x] !== undefined
    ) {
      return helperObject[position.y][position.x];
    }
    const currentScore = getPositionScore(position, mine);
    if (currentScore === null) {
      return -1;
    }
    const nextStepBestScore = Math.max(
      bestTotalScore(new Position(position.x + 1, position.y - 1), mine),
      bestTotalScore(new Position(position.x + 1, position.y), mine),
      bestTotalScore(new Position(position.x + 1, position.y + 1), mine)
    );

    if (!helperObject[position.y]) {
      helperObject[position.y] = {};
    }
    helperObject[position.y][position.x] = currentScore + nextStepBestScore;

    return currentScore + nextStepBestScore;
  } else {
    return 0;
  }
};

const getPositionScore = (position, mine) => {
  if (position.isValid(mine)) {
    return mine[position.y][position.x] == 0
      ? null
      : mine[position.y][position.x];
  } else {
    return 0;
  }
};

export default move;
