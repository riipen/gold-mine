// Keep track of the gold that are two spaces ahead so that we can do our best
// to avoid the roadblock. We return our new move if we are going to hit zeroes
// otherwise we use the original move.
function checkFutureZeroes(gold, mine, curY, newX) {
  let goldAhead = [];
  let nextMove = gold.indexOf(Math.max(...gold));
  let direction = getDirection(nextMove);

  // Check if we can move up, if so, add it
  if (curY - 1 + direction >= 0) {
    goldAhead.push(mine[curY - 1 + direction][newX + 1]);
  }

  // Check if we can move right, if so, add it
  if (curY + direction < mine[0].length) {
    goldAhead.push(mine[curY + direction][newX + 1]);
  }

  // Check if we can move down, if so, add it
  if (curY + 1 + direction < mine.length) {
    goldAhead.push(mine[curY + 1 + direction][newX + 1]);
  }

  // Ensure that we can't move in the same direction
  if (nextMove === 0) {
    goldAhead.splice(0, 1);
  } else if (nextMove === 1) {
    goldAhead.splice(1, 1);
  } else if (nextMove === 2) {
    goldAhead.splice(2, 1);
  }

  if (Math.max(...goldAhead) === 0) {
    return secondHighestGoldIndex(gold);
  } else {
    return nextMove;
  }
}

function getDirection(nextMove) {
  switch (nextMove) {
    case 0:
      return -1;
    case 1:
      return 0;
    case 2:
      return 1;
  }
}

// https://stackoverflow.com/a/17040125/10665666
// solution for finding the second highest number in an array without erasing
// a number
function secondHighestGoldIndex(gold) {
  let max = -Infinity;
  let result = -Infinity;

  for (const value of gold) {
    if (value >= max) {
      [result, max] = [max, value]; // save previous max
    } else if (value < max && value > result) {
      result = value; // new second biggest
    }
  }

  return gold.indexOf(result);
}

export default checkFutureZeroes;
export { secondHighestGoldIndex };
