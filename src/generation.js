/**
 * Takes the gold mine and creates empty arrays of the same size to be used
 * for either tracking positions or direction for path navigation.
 *
 * @param  {array} mine - A n x m of the gold array.
 *
 * @return {array} positionTrackingMine - A blank copy of the n x m gold array.
 */
export const generateTrackingPositionArray = (mine) => {
  const positionTrackingMine = new Array(mine.length)
    .fill(null)
    .map(() => new Array(mine[0].length).fill(null));

  return positionTrackingMine;
};

/**
 * Takes collected gold array and sees which starting point is best for the
 * scoring run. Returns the index for use
 *
 * @param  {array} mine - A n x m of the gold array collected in the mine[0][columns].
 *
 * @return {int} maxIndex - The column position for the best path found.
 */
export const highestStartPoint = (mine) => {
    let maxIndex = null;
    let max = 0;
    for (let j = 0; j < mine.length; j++) {
      if (mine[j][0] > max) {
        maxIndex = j;
        max = mine[j][0];
      }
    }
    return maxIndex;
}
