import Position from "./position.js";
import { BestRouteCalculator } from "./BestRouteCalculator";

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
const move = (mine, position) => {
  // TODO: write logic for miner. The current approach naive approach is to simply:
  //   1. Start at (0,0)
  //   2. Always moves right

  const newX = (position && position.x + 1) || 0;

  let newY;

  if (!movedRight) {
    newY = (position && position.y) || 0;

    movedRight = true;
  } else {
    newY = (position && position.y + 1) || 0;

    movedRight = false;
  }

  return new Position(newX, newY);
};

const moveBySebaMaldonado = (
  mine = [],
  position
) => {
  const routeCalculator = new BestRouteCalculator(mine);

  if (!position) {
    return new Position(0, 0);
  }

  return routeCalculator.getNextBestPosition(
    position,
  );
};

export default moveBySebaMaldonado;
