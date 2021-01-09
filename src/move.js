import Position from "./position.js";
const RIGHT_UP = "RightUp";
const RIGHT = "Right";
const RIGHT_DOWN = "RightDown";
let lastMove;
let helperObject = {};
let mineSize = 0;
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
  if (mineSize != mine.length) {
    //clean cache if working on a different mine
    helperObject = {};
    mineSize = mine.length;
  }
  if (!position) {
    //Starting position
    let newY;
    let maxScore = -1;
    for (let y = 0; y < mine.length; y++) {
      bestTotalScore(new Position(0, y), mine, null);
    }
    Object.keys(helperObject).map((y) => {
      if (helperObject[y][0] && helperObject[y][0]["final"] > maxScore) {
        maxScore = helperObject[y][0].final;
        newY = y;
      }
    });
    return new Position(0, newY);
  } else {
    const newX = (position && position.x + 1) || 0;
    const currentY = (position && position.y) || 0;
    const rightUpBestScore =
      lastMove === RIGHT_UP
        ? -1
        : helperObject[currentY - 1] &&
          helperObject[currentY - 1][newX] &&
          helperObject[currentY - 1][newX][RIGHT_UP]
        ? helperObject[currentY - 1][newX][RIGHT_UP]
        : bestTotalScore(new Position(newX, currentY - 1), mine, RIGHT_UP);
    const rightBestScore =
      lastMove === RIGHT
        ? -1
        : helperObject[currentY] &&
          helperObject[currentY][newX] &&
          helperObject[currentY][newX][RIGHT]
        ? helperObject[currentY][newX][RIGHT]
        : bestTotalScore(new Position(newX, currentY), mine, RIGHT);
    const rightDownBestScore =
      lastMove === RIGHT_DOWN
        ? -1
        : helperObject[currentY + 1] &&
          helperObject[currentY + 1][newX] &&
          helperObject[currentY + 1][newX][RIGHT_DOWN]
        ? helperObject[currentY + 1][newX][RIGHT_DOWN]
        : bestTotalScore(new Position(newX, currentY + 1), mine, RIGHT_DOWN);

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

const bestTotalScore = (position, mine, lastDirection) => {
  if (position.y >= 0 && position.isValid(mine)) {
    if (
      lastDirection &&
      helperObject[position.y] &&
      helperObject[position.y][position.x] &&
      helperObject[position.y][position.x][lastDirection]
    ) {
      return helperObject[position.y][position.x][lastDirection];
    }
    const currentScore = getPositionScore(position, mine);
    const nextStepBestScore = Math.max(
      lastDirection == RIGHT_UP
        ? -1
        : bestTotalScore(
            new Position(position.x + 1, position.y - 1),
            mine,
            RIGHT_UP
          ),
      lastDirection == RIGHT
        ? -1
        : bestTotalScore(new Position(position.x + 1, position.y), mine, RIGHT),
      lastDirection == RIGHT_DOWN
        ? -1
        : bestTotalScore(
            new Position(position.x + 1, position.y + 1),
            mine,
            RIGHT_DOWN
          )
    );
    const positionBestScore = currentScore + nextStepBestScore;
    if (!helperObject[position.y]) {
      helperObject[position.y] = {};
    }
    if (!helperObject[position.y][position.x]) {
      helperObject[position.y][position.x] = {};
    }
    if (lastDirection) {
      helperObject[position.y][position.x][lastDirection] = positionBestScore;
    } else {
      helperObject[position.y][position.x]["final"] = positionBestScore;
    }
    // console.log("helperObject[position.y]", helperObject[position.y]);
    return positionBestScore;
  } else {
    if (!helperObject[position.y]) {
      helperObject[position.y] = {};
    }
    if (!helperObject[position.y][position.x]) {
      helperObject[position.y][position.x] = {};
    }
    if (lastDirection) {
      helperObject[position.y][position.x][lastDirection] = 0;
    } else {
      helperObject[position.y][position.x]["final"] = 0;
    }
    return 0;
  }
};

const getPositionScore = (position, mine) => {
  if (position.isValid(mine)) {
    return mine[position.y][position.x];
  } else {
    return 0;
  }
};

export default move;
