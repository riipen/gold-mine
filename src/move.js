import Position from "./position.js";

// let movedRight;

let topRightValue;
let straightRightValue;
let bottomRightValue;

let topRightString;
let straightRightString;
let bottomRightString;

let topRightCoordinateArray;
let straightRightCoordinateArray;
let bottomRightCoordinateArray;

let topRightY;
let straightRightY;
let bottomRightY;

let bestGoldMove;
let secondToBestGoldMove;
let currentPosition;
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
  // TODO: debug for both luna and mars runs (r.w. to the repeat moves)

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

    // NOTE: Keep this essentially the same! The indices for checking/utilising a mine object
    //       are the inverse of a given Position() object.

    // We can't access properties of an undefined object, so we need to account for that`
    if (position.y == 0) {
      topRightValue = undefined;
    } else {
      topRightValue = mine[topRightCoordinateArray[1]][topRightCoordinateArray[0]];
    }

    straightRightValue = mine[straightRightCoordinateArray[1]][straightRightCoordinateArray[0]];

    if (position.y == mine.length - 1) {
      bottomRightValue = undefined;
    } else { 
      bottomRightValue = mine[bottomRightCoordinateArray[1]][bottomRightCoordinateArray[0]];
    }

    console.log("\nTop right: " + topRightValue);
    console.log("Straight right: " + straightRightValue);
    console.log("Bottom right: " + bottomRightValue);

    console.log();

    // NOTE: Strictly for the undefined case for top-right value
    if (topRightValue === undefined) {

      if (straightRightValue > bottomRightValue) {
        currentPosition = "straightRight"
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
        secondToBestGoldMove =  (position && position.y) || 0;
      } else {
        secondToBestGoldMove = (position && position.y + 1) || 0;
      }
    }

    if ( (straightRightValue > topRightValue ) && (straightRightValue > bottomRightValue) ) {
      currentPosition = "straightRight";
      bestGoldMove = (position && position.y) || 0;

      if (topRightValue > bottomRightValue) {
        secondToBestGoldMove = (position && position.y - 1) || 0;
      } else {
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

    if ( (bottomRightValue > topRightValue) && (bottomRightValue > straightRightValue) ) {
      currentPosition = "bottomRight";
      bestGoldMove = (position && position.y + 1) || 0;

      if (topRightValue > straightRightValue) {
        secondToBestGoldMove = (position && position.y - 1) || 0;
      } else {
        secondToBestGoldMove = (position && position.y) || 0;
      }
    }

    console.log("\nCurrent position (after move): " + currentPosition);

    // Checking the positions to prevent repeats
    // TODO: DEBUG - it isn't correctly checking previous states

    console.log("Current direction is same as previous: " + (currentPosition == previousPosition))

    if ( (topRightValue != undefined) && (bottomRightValue != undefined) ) {

      if (currentPosition != previousPosition) {
        newY = bestGoldMove;
      } else {
        newY = secondToBestGoldMove;
      }  
      
    } else {
        newY = bestGoldMove; 
    }
 
    // console.log("Best gold move?: " + bestGoldMove);
    // console.log("Second-to-best gold move?: " + secondToBestGoldMove);

    // Setting the previous position
    previousPosition = currentPosition;
  }

  console.log("Current coordinates: " + new Position(newX, newY).toString() + "\n");
  return new Position(newX, newY);
};

export default move;
