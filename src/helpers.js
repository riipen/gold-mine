/* 
    This file contains helper functions for the gold miner to implement
*/

import Position from "./position.js";
import Directions from './directions.js';

/**
 * @function findBestStartY 
 * Returns the "best" starting position in a given mine. The best position is
 * the first row to be found with the highest gold value. 
 * 
 * @param {array} mine - An n x m multidimensional array representing the mine.
 * 
 * @return {Number} The "best" Y starting position that has the highest gold value
 */
const findBestStartY = (mine) => {
    let bestRowPos = 0;
    let bestRowValue = 0;

    for(let row in mine){
        let currRowValue = mine[row][0];
        if (currRowValue > bestRowValue) {
            bestRowValue = currRowValue;
            bestRowPos = row;
        }
    }

    return bestRowPos;
};

/**
 * @function getTopRightValue
 * Returns the value of the gold in the top-right position in relation to current position
 * 
 * @param {array} mine - An n x m multidimensional array representing the mine.
 * @param {object} position - The current position of the miner
 * 
 * @return {Number} The value of the gold in the top-right position
 */
const getTopRightValue = (mine, position) => {
    return mine[parseInt(position.y)-1] ? mine[parseInt(position.y)-1][parseInt(position.x)+1] : 0;
};

/**
 * @function getRightValue
 * Returns the value of the gold in the right position in relation to current position
 * 
 * @param {array} mine - An n x m multidimensional array representing the mine.
 * @param {object} position - The current position of the miner
 * 
 * @return {Number} The value of the gold in the right position
 */
const getRightValue = (mine, position) => {
    return mine[parseInt(position.y)][parseInt(position.x)+1] || 0;
};

/**
 * @function getBottomRightValue
 * Returns the value of the gold in the bottom-right position in relation to current position
 * 
 * @param {array} mine - An n x m multidimensional array representing the mine.
 * @param {object} position - The current position of the miner
 * 
 * @return {Number} The value of the gold in the bottom-right position
 */
const getBottomRightValue = (mine, position) => {
    return mine[parseInt(position.y)+1] ? mine[parseInt(position.y)+1][parseInt(position.x)+1] : 0;
};

/**
 * @function getNewPosition
 * Creates a new miner position with a given current position and direction
 * 
 * @param {object} position - The current position of the miner
 * @param {object} dir - An enum that represents direction the miner is moving in
 * 
 * @return {Position} The new position of the miner
 */
const getNewPosition = (position, dir) => {
    switch (dir) {
        case Directions.TOPRIGHT:
            return new Position(parseInt(position.x)+1, parseInt(position.y)-1);
        case Directions.RIGHT:
            return new Position(parseInt(position.x)+1, parseInt(position.y));
        case Directions.BOTRIGHT:
            return new Position(parseInt(position.x)+1, parseInt(position.y)+1);
    }
    console.error(`New direction is invalid: ${dir}`);
}

export { findBestStartY, getTopRightValue, getRightValue, getBottomRightValue, getNewPosition };