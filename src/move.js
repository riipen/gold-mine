import Position from "./position.js";

// let movedRight;

let topRightString;
let straightRightString;
let bottomRightString;

let topRightCoordinateArray;
let straightRightCoordinateArray;
let bottomRightCoordinateArray;

let topRightY;
let straightRightY;
let bottomRightY;

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
let currentPosition;
let secondCurrentPosition;
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

  // Important rule
  //    -  the miner cannot repeat the previous move (so you can only optimize for two remaining
  //       move positions for each given move)

  // Very important to reiterate this
  //   -   since the position will be undefined on the first move... there's not a lot you can
  //       therefore do with it

  // NOTE: we can only go straight-right or bottom-right for this [first] position
  //       but how do we decide upon the value to chose if we can't get the value from
  //       the object..? hmm...

  // TODO: optimize route from the first position
  // TODO: we need to check all three of the *future* possibilities for each immediate move option
  //       to account for any sets that have two-or-more zeros and where a repeat move negates the 
  //       possibility of choosing anything except a zero.


  if (position === undefined) {

    newY = (position && position.y + 1) || 0;
  }

  if (position != undefined) {

    topRightY = (position && position.y - 1) || 0;
    topRightString = new Position(newX, topRightY).toString();
    topRightCoordinateArray = topRightString.match(/\d+/g).map(str => parseInt(str));
    console.log();
    console.log(topRightCoordinateArray);

    straightRightY = (position && position.y) || 0;
    straightRightString = new Position(newX, straightRightY).toString();
    straightRightCoordinateArray = straightRightString.match(/\d+/g).map(str => parseInt(str));
    console.log(straightRightCoordinateArray);

    bottomRightY = (position && position.y + 1) || 0;
    bottomRightString = new Position(newX, bottomRightY).toString();
    bottomRightCoordinateArray = bottomRightString.match(/\d+/g).map(str => parseInt(str));
    console.log(bottomRightCoordinateArray);

    // Most of this is accounting for possibilities two steps ahead

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

    console.log("\nTop right: " + topRightValue);
    console.log("Straight right: " + straightRightValue);
    console.log("Bottom right: " + bottomRightValue);
    console.log();

    console.log("Two ahead arrays (topRight, straightRight, bottomRight): ");
    console.log(topRightTwoAheadArray);
    console.log(straightRightTwoAheadArray);
    console.log(bottomRightTwoAheadArray);
    console.log();
    
    console.log(`Top right future zero count: ${topRightFutureZeroCount}`)
    console.log(`Straight right future zero count: ${straightRightFutureZeroCount}`)
    console.log(`Bottom right future zero count: ${bottomRightFutureZeroCount}`)
    console.log();

    // NOTE: Strictly for the undefined case for top-right value
    if (topRightValue === undefined) {

      if (straightRightValue > bottomRightValue) {
        currentPosition = "straightRight";
        bestGoldMove =  (position && position.y) || 0;
      } else {
        currentPosition = "bottomRight";
        bestGoldMove = (position && position.y + 1) || 0;
      }
    }

    if ( (topRightValue > straightRightValue) && (topRightValue > bottomRightValue ) ) {
      currentPosition = "topRight";
      bestGoldMove = (position && position.y - 1) || 0;

      if (straightRightValue > bottomRightValue) {
        secondCurrentPosition = "straightRight";
        secondToBestGoldMove =  (position && position.y) || 0;
      } else {
        secondCurrentPosition = "bottomRight";
        secondToBestGoldMove = (position && position.y + 1) || 0;
      }
    }

    if ( (straightRightValue >= topRightValue ) && (straightRightValue >= bottomRightValue) ) {
      currentPosition = "straightRight";
      bestGoldMove = (position && position.y) || 0;

      if (topRightValue > bottomRightValue) {
        secondCurrentPosition = "topRight";
        secondToBestGoldMove = (position && position.y - 1) || 0;
      } else {
        secondCurrentPosition = "bottomRight"
        secondToBestGoldMove = (position && position.y + 1) || 0;
      }
    }

    // NOTE: Strictly for the undefined case for bottom-right value
    if (bottomRightValue === undefined) {

      if (topRightValue > straightRightValue) {
        currentPosition = "topRight";
        bestGoldMove = (position && position.y - 1) || 0;
      } else {
        currentPosition = "straightRight";
        bestGoldMove = (position && position.y) || 0;
      }
    }

    if ( (bottomRightValue >= topRightValue) && (bottomRightValue >= straightRightValue) ) {
      currentPosition = "bottomRight";
      bestGoldMove = (position && position.y + 1) || 0;

      if (topRightValue > straightRightValue) {
        secondCurrentPosition = "topRight"
        secondToBestGoldMove = (position && position.y - 1) || 0;
      } else {
        secondCurrentPosition = "straightRight"
        secondToBestGoldMove = (position && position.y) || 0;
      }
    }

    // Checking the positions to prevent repeats
    // DONE: checking previous states properly

    if (currentPosition != previousPosition) {
      newY = bestGoldMove;
    } 
    
    if (currentPosition == previousPosition) {
      currentPosition = secondCurrentPosition;
      newY = secondToBestGoldMove;
    }  

    console.log("Current is same as previous: " + (currentPosition == previousPosition));

    // Setting the previous position
    previousPosition = currentPosition;

    // Reset the future possibilities arrays
    topRightTwoAheadArray = [];
    straightRightTwoAheadArray = [];
    bottomRightTwoAheadArray = [];

    console.log("Current position (after move): " + currentPosition);
  }

  console.log("Current coordinates: " + new Position(newX, newY).toString() + "\n");
  return new Position(newX, newY);
};

export default move;
