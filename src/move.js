import Position from "./position.js";

// some unchanging strings, just to reduce typing
const TR = "topRight";
const SR = "straightRight";
const BR = "bottomRight";

// let movedRight;
let counter = 1;

let topRightString;
let straightRightString;
let bottomRightString;

let topRightCoordinateArray;
let straightRightCoordinateArray;
let bottomRightCoordinateArray;

let topRightValue;
let straightRightValue;
let bottomRightValue;

let topRightTwoAheadArray = [];
let straightRightTwoAheadArray = [];
let bottomRightTwoAheadArray = [];

let topRightFutureZeroCount;
let straightRightFutureZeroCount;
let bottomRightFutureZeroCount;

let bestGoldMove;
let secondToBestGoldMove;
let thirdToBestGoldMove;

let bestGoldMoveValue;
let secondToBestGoldMoveValue;
let thirdToBestGoldMoveValue;

let currentPosition;
let secondCurrentPosition;
let thirdCurrentPosition;
let previousPosition;

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

  // X-coordinate will always be incremented by one, for each step
  const newX = (position && position.x + 1) || 0;

  let newY;

  if (position === undefined) {

    newY = (position && position.y + 1) || 0;
  }

  if (position != undefined) {

    // These movement positions will not change for each call
    const topRightY = (position && position.y - 1) || 0;
    const straightRightY = (position && position.y) || 0;
    const bottomRightY = (position && position.y + 1) || 0;

    console.log("\n*** MOVE #" + counter + " ***");
    counter++;

    // Getting the coordinate arrays for each position
    topRightString = new Position(newX, topRightY).toString();
    topRightCoordinateArray = topRightString.match(/\d+/g).map(str => parseInt(str));
    console.log();
    console.log("Top right position:      [" + topRightCoordinateArray + "]");

    straightRightString = new Position(newX, straightRightY).toString();
    straightRightCoordinateArray = straightRightString.match(/\d+/g).map(str => parseInt(str));
    console.log("Straight right position: [" + straightRightCoordinateArray + "]");

    bottomRightString = new Position(newX, bottomRightY).toString();
    bottomRightCoordinateArray = bottomRightString.match(/\d+/g).map(str => parseInt(str));
    console.log("Bottom right position:   [" + bottomRightCoordinateArray + "]");

    // topRight value, one step ahead / topRight array, two steps ahead
    if (position.y == 0) {
      topRightValue = undefined;
      
      topRightTwoAheadArray[0] = undefined;
      topRightTwoAheadArray[1] = undefined;
      topRightTwoAheadArray[2] = mine[topRightCoordinateArray[1]][topRightCoordinateArray[0] + 1];

    }   
    else if (position.y == 1) {
      topRightValue = mine[topRightCoordinateArray[1]][topRightCoordinateArray[0]];

      topRightTwoAheadArray[0] = undefined;
      topRightTwoAheadArray[1] = mine[topRightCoordinateArray[1]][topRightCoordinateArray[0] + 1];
      topRightTwoAheadArray[2] = mine[topRightCoordinateArray[1] + 1][topRightCoordinateArray[0] + 1];
    }
    else {
      topRightValue = mine[topRightCoordinateArray[1]][topRightCoordinateArray[0]];

      topRightTwoAheadArray[0] = mine[topRightCoordinateArray[1] - 1][topRightCoordinateArray[0] + 1];
      topRightTwoAheadArray[1] = mine[topRightCoordinateArray[1]][topRightCoordinateArray[0] + 1];
      topRightTwoAheadArray[2] = mine[topRightCoordinateArray[1] + 1][topRightCoordinateArray[0] + 1];
    }

    // straightRight value, one step ahead / straightRight array, two steps ahead
    if (position.y == 0) {
      straightRightValue = mine[straightRightCoordinateArray[1]][straightRightCoordinateArray[0]];

      straightRightTwoAheadArray[0] = undefined;
      straightRightTwoAheadArray[1] = mine[straightRightCoordinateArray[1]][straightRightCoordinateArray[0] + 1];
      straightRightTwoAheadArray[2] = mine[straightRightCoordinateArray[1] + 1][straightRightCoordinateArray[0] + 1];
    }
    else { 
      straightRightValue = mine[straightRightCoordinateArray[1]][straightRightCoordinateArray[0]];

      straightRightTwoAheadArray[0] = mine[straightRightCoordinateArray[1] - 1][straightRightCoordinateArray[0] + 1];
      straightRightTwoAheadArray[1] = mine[straightRightCoordinateArray[1]][straightRightCoordinateArray[0] + 1];
      straightRightTwoAheadArray[2] = mine[straightRightCoordinateArray[1] + 1][straightRightCoordinateArray[0] + 1];
    } 

    // bottomRight value, one step ahead / bottomRight array, two steps ahead
    if (position.y == mine.length - 1) {
      bottomRightValue = undefined;

      bottomRightTwoAheadArray[0] = mine[bottomRightCoordinateArray[1] - 1][bottomRightCoordinateArray[0] + 1];
      bottomRightTwoAheadArray[1] = undefined;
      bottomRightTwoAheadArray[2] = undefined;

    }
    else if (position.y == mine.length - 2) {
      bottomRightValue = mine[bottomRightCoordinateArray[1]][bottomRightCoordinateArray[0]];

      bottomRightTwoAheadArray[0] = mine[bottomRightCoordinateArray[1] - 1][bottomRightCoordinateArray[0] + 1];
      bottomRightTwoAheadArray[1] = mine[bottomRightCoordinateArray[1]][bottomRightCoordinateArray[0] + 1];
      bottomRightTwoAheadArray[2] = undefined;
    } 
    else { 
      bottomRightValue = mine[bottomRightCoordinateArray[1]][bottomRightCoordinateArray[0]];
      
      bottomRightTwoAheadArray[0] = mine[bottomRightCoordinateArray[1] - 1][bottomRightCoordinateArray[0] + 1];
      bottomRightTwoAheadArray[1] = mine[bottomRightCoordinateArray[1]][bottomRightCoordinateArray[0] + 1];
      bottomRightTwoAheadArray[2] = mine[bottomRightCoordinateArray[1] + 1][bottomRightCoordinateArray[0] + 1];
    }

    // Getting the zero counts two steps ahead
    topRightFutureZeroCount = topRightTwoAheadArray.filter(item => item == 0).length;
    straightRightFutureZeroCount = straightRightTwoAheadArray.filter(item => item == 0).length;
    bottomRightFutureZeroCount = bottomRightTwoAheadArray.filter(item => item == 0).length;

    console.log("\nTop right:      " + topRightValue);
    console.log("Straight right: " + straightRightValue);
    console.log("Bottom right:   " + bottomRightValue);
    console.log();

    console.log("Array options, two steps ahead (topRight, straightRight, bottomRight): ");
    console.log(topRightTwoAheadArray);
    console.log(straightRightTwoAheadArray);
    console.log(bottomRightTwoAheadArray);
    console.log();
    
    console.log(`Top right future zero count:       ${topRightFutureZeroCount}`)
    console.log(`Straight right future zero count:  ${straightRightFutureZeroCount}`)
    console.log(`Bottom right future zero count:    ${bottomRightFutureZeroCount}`)
    console.log();

    // NOTE: Strictly for the undefined case for top-right value
    if (topRightValue === undefined) {

      if (straightRightValue > bottomRightValue) {
        currentPosition = SR;
        bestGoldMove =  straightRightY;
      } else {
        currentPosition = BR;
        bestGoldMove = bottomRightY;
      }
    }

    // If topRight is greater than straightRight and bottomRight
    if ( (topRightValue > straightRightValue) && (topRightValue > bottomRightValue ) ) {
      currentPosition = TR;
      bestGoldMove = topRightY;

      if (straightRightValue > bottomRightValue) {
        secondCurrentPosition = SR;
        thirdCurrentPosition = BR;
        secondToBestGoldMove = straightRightY;
        thirdToBestGoldMove = bottomRightY;
      } else {
        secondCurrentPosition = BR;
        thirdCurrentPosition = SR;
        secondToBestGoldMove = bottomRightY;
        thirdToBestGoldMove = straightRightY;
      }
    }

    // if straightRight is greater than topRight and bottomRight
    if ( (straightRightValue > topRightValue) && (straightRightValue > bottomRightValue) ) {
      currentPosition = SR;
      bestGoldMove = straightRightY;

      if (topRightValue > bottomRightValue) {
        secondCurrentPosition = TR;
        thirdCurrentPosition = BR;
        secondToBestGoldMove = topRightY;
        thirdToBestGoldMove = bottomRightY;
      } else {
        secondCurrentPosition = BR;
        thirdCurrentPosition = TR;
        secondToBestGoldMove = bottomRightY;
        thirdToBestGoldMove = topRightY;
      }
    }

    // If bottomRight is greater than topRight and straightRight
    if ( (bottomRightValue > topRightValue) && (bottomRightValue > straightRightValue) ) {
      currentPosition = BR;
      bestGoldMove = bottomRightY;

      if (topRightValue > straightRightValue) {
        secondCurrentPosition = TR;
        thirdCurrentPosition = SR;
        secondToBestGoldMove = topRightY;
        thirdToBestGoldMove = straightRightY;
      } else {
        secondCurrentPosition = SR;
        thirdCurrentPosition = TR;
        secondToBestGoldMove = straightRightY;
        thirdToBestGoldMove = topRightY;
      }
    }

    // Checking where topRight is equal to straightRight and both are highest
    if ( (topRightValue == straightRightValue) && (topRightValue > bottomRightValue) ) {

      if (previousPosition == TR) {
        currentPosition = SR;
        secondCurrentPosition = TR;
        bestGoldMove = straightRightY;
        secondToBestGoldMove = topRightY;
      } else {
        currentPosition = TR;
        secondCurrentPosition = SR;
        bestGoldMove = topRightY;
        secondToBestGoldMove = straightRightY;
      }

      thirdCurrentPosition = BR;
      thirdToBestGoldMove = bottomRightY;
    }

    // Checking where bottomRight is equal to straightRight and both are highest
    if ( (bottomRightValue == straightRightValue) && (bottomRightValue > topRightValue) ) {

      if (previousPosition == BR) {
        currentPosition = SR;
        secondCurrentPosition = BR;
        bestGoldMove = straightRightY;
        secondToBestGoldMove = bottomRightY;
      } else {
        currentPosition = BR;
        secondCurrentPosition = SR;
        bestGoldMove = bottomRightY;
        secondToBestGoldMove = straightRightY;
      }

      thirdToBestGoldMove = topRightY;
      thirdCurrentPosition = TR;
    }

    // Checking where topRight is equal to bottomRight and both are highest
    if ( (topRightValue == bottomRightValue) && (topRightValue > straightRightValue) ) {
      
      if (previousPosition == TR) {
        currentPosition = BR;
        secondCurrentPosition = TR;
        bestGoldMove = bottomRightY;
        secondToBestGoldMove = topRightY;
      } else {
        currentPosition = TR;
        secondCurrentPosition = BR;
        bestGoldMove = topRightY;
        secondToBestGoldMove = bottomRightY;
      }

      thirdToBestGoldMove = straightRightY;
      thirdCurrentPosition = SR;
    }

    // NOTE: Strictly for the undefined case for bottom-right value
    if (bottomRightValue === undefined) {

      if (topRightValue > straightRightValue) {
        currentPosition = TR;
        bestGoldMove = topRightY;
      } else {
        currentPosition = SR;
        bestGoldMove = straightRightY;
      }
    }

    // Getting the best gold move arrays
    let bestPosition = new Position(newX, bestGoldMove).toString();
    let bestArray = bestPosition.match(/\d+/g).map(str => parseInt(str));

    let secondBestPosition = new Position(newX, secondToBestGoldMove).toString();
    let secondBestArray = secondBestPosition.match(/\d+/g).map(str => parseInt(str));

    let thirdBestPosition = new Position(newX, thirdToBestGoldMove).toString();
    let thirdBestArray = thirdBestPosition.match(/\d+/g).map(str => parseInt(str));

    // Assigning the ordered gold values
    if (bestArray[1] == undefined) {
      bestGoldMoveValue = undefined;
    } else {
      bestGoldMoveValue = mine[bestArray[1]][bestArray[0]];
    }

    if (secondBestArray[1] == undefined) {
      secondToBestGoldMoveValue = undefined;
    } else {
      secondToBestGoldMoveValue = mine[secondBestArray[1]][secondBestArray[0]];
    }
 
    if (thirdBestArray[1] == undefined) {
      thirdToBestGoldMoveValue = undefined;
    } else {
      thirdToBestGoldMoveValue = mine[thirdBestArray[1]][thirdBestArray[0]];
    }

    console.log("Current is same as previous:      " + (currentPosition == previousPosition));
    console.log("\nPREVIOUS POSITION:                " + previousPosition);
    console.log("CURRENT POSITION (before):        " + currentPosition);
    console.log("SECOND CURRENT POSITION (before): " + secondCurrentPosition);
    console.log("THIRD CURRENT POSITION (before):  " + thirdCurrentPosition);
    console.log();
    console.log(`Current best gold move:        ${new Position(newX, bestGoldMove)}`);
    console.log(`Current second-best gold move: ${new Position(newX, secondToBestGoldMove)}`);
    console.log(`Current third-best gold move:  ${new Position(newX, thirdToBestGoldMove)}`);
    console.log()
    console.log(`Current best gold value:        ${bestGoldMoveValue}`);
    console.log(`Current second-best gold value: ${secondToBestGoldMoveValue}`);
    console.log(`Current third-best gold value:  ${thirdToBestGoldMoveValue}\n`);

    // NOTE: Sorting the previous positions based on both validity and ordinality, such that in any case the third position will always be invalid.
    if (currentPosition == previousPosition) {

      // positions
      let temp = thirdCurrentPosition;
      thirdCurrentPosition = currentPosition
      currentPosition = secondCurrentPosition;
      secondCurrentPosition = temp;

      // y-coordinates
      let temp2 = thirdToBestGoldMove;
      thirdToBestGoldMove = bestGoldMove;
      bestGoldMove = secondToBestGoldMove;
      secondToBestGoldMove = temp2;
    
      // best values
      let temp3 = thirdToBestGoldMoveValue;
      thirdToBestGoldMoveValue = bestGoldMoveValue;
      bestGoldMoveValue = secondToBestGoldMoveValue;
      secondToBestGoldMoveValue = temp3;
    }
    else if (secondCurrentPosition == previousPosition) {

      // positions
      let temp = thirdCurrentPosition;
      thirdCurrentPosition = secondCurrentPosition;
      secondCurrentPosition = temp;

      // y-coordinates
      let temp2 = thirdToBestGoldMove;
      thirdToBestGoldMove = secondToBestGoldMove;
      secondToBestGoldMove = temp2;

      // best values
      let temp3 = thirdToBestGoldMoveValue;
      thirdToBestGoldMoveValue = secondToBestGoldMoveValue;
      secondToBestGoldMoveValue = temp3;
    }
    else if (thirdCurrentPosition == previousPosition ) {

      // do nothing, third is already in last place
    }

    // NOTE: Logic for zero-checking (2 steps ahead)
    if (topRightFutureZeroCount >= 2 && bestPosition == TR) {

      if (secondToBestGoldMove != 0) {
        currentPosition = secondBestPosition;
        bestGoldMove = secondToBestGoldMove;
      }
    }
    else if (straightRightFutureZeroCount >= 2 && bestPosition == SR) {
      
      if (secondToBestGoldMove != 0) {
        currentPosition = secondBestPosition;
        bestGoldMove = secondToBestGoldMove;
      }
    }
    else if (bottomRightFutureZeroCount >= 2 && bestPosition == BR) {

      if (secondToBestGoldMove != 0) {
        currentPosition = secondBestPosition;
        bestGoldMove = secondToBestGoldMove;
      }
    } 

    if (currentPosition == previousPosition) {
      currentPosition = secondBestPosition;
      bestGoldMove = secondToBestGoldMove;
    }

    console.log("Current is same as previous:     " + (currentPosition == previousPosition));
    console.log("\nPREVIOUS POSITION:               " + previousPosition);
    console.log("CURRENT POSITION (after):        " + currentPosition);
    console.log("SECOND CURRENT POSITION (after): " + secondCurrentPosition);
    console.log("THIRD CURRENT POSITION (after):  " + thirdCurrentPosition + "\n");

    newY = bestGoldMove;

    // Setting the previous position
    previousPosition = currentPosition;

    // Reset the future possibilities arrays
    topRightTwoAheadArray = [];
    straightRightTwoAheadArray = [];
    bottomRightTwoAheadArray = [];
  }

  if (newX < mine[0].length) {
    console.log("Moving to coordinates: [" + new Position(newX, newY).toString() + "]\n");
    return new Position(newX, newY);
  }
};

export default move;
