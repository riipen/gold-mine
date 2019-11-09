import Position from "./position.js";

/**
 * Replace the logic in this function with your own custom movement algorithm.
 *
 * This function should run in a reasonable amount of time and should attempt
 * to collect as much gold as possible.
 *
 * Remember, landing outside the mine's boundary or on a "0" on the mine will
 * result in the run completing.
 *
 * @param  {array} mineSteps - n dimensional array respresenting the steps to reach to high score optimally
 * @param  {object} position - The current position of the miner, will be starting Y position on the first move
 *
 * @return {Position} The new position of the miner.
 */
const move = (mine, position) => {
    // The first position is the starting Y location passed as a negative int
    if(position < 0) {
        return new Position(0, -1*position);
    }

    let newX =  position.x + 1;
    let newY =  position.y - mine[position.x];

    return new Position(newX, newY);
};

export default move;
