import Position from "./position.js";

/**
 * Moves the 'miner' along the array for scoring. It follows the path of the passed
 * in trackingMine which contains the next position in the current cell.
 *
 * @param  {int} startingColumn - The spot to start on the "best score" path
 * @param  {object} position - The current position of the miner, will be undefined on the first move
 * @param  {array} trackingMine - A copy n x m of the gold array to track next position
 *
 * @return {Position} The new position of the miner.
 */
const move = (startingColumn, position, trackingMine) => {
  // Case for starting position else, move happens normally otherwise
  if (!position) {
    position = new Position(0, startingColumn);

    return new Position(position.x, position.y);
  } else {
    const nextPosition = trackingMine[position.y][position.x];

    return nextPosition;
  }
};

export default move;
