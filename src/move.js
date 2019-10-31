import Position from "./position.js";

let lastMove; // keeps track of what the last move was
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

  // calculate optimal initial position
  if (typeof position === 'undefined'){
    let startX = 0;
    let startY = 0;    
    let maxFirst = mine[0][0];
    let maxSecond = Math.max(mine[0][1],mine[1][1]);
    let i = 0;
    while (i < mine.length){
      if(mine[i][0] > maxFirst){
        maxFirst = mine[i][0];
        startY = i;

        /* highest first with a highest second; Alternative lookahead method but decided not to use it bc it gives lower scores on mars
        if(mine[i][0] > maxFirst){
          maxFirst = mine[i][0];
          startY = i;
        }else{ //same first value
          if(i > 0 && mine[i-1][1] !== 'undefined' && mine[i-1][1] > maxSecond){
            maxSecond = mine[i-1][1];
            startY = i;
          }
          if(mine[i][1] !== 'undefined' && mine[i][1] > maxSecond){
            maxSecond = mine[i][1];
            startY = i;
          }
          if(mine[i+1][1] !== 'undefined' && mine[i+1][1] > maxSecond){
            maxSecond = mine[i+1][1];
            startY = i;
          }
        }*/
      }
      i += 1;
    }
    console.log(startY);
    return new Position(startX, startY);
  }

  // go to the most optimal next step
  let newY = 0;
  let maxGold = 0;
  
  let newX = position.x+1; //always move forward
  if(lastMove !== 0){ //we didnt move right before
    maxGold = mine[position.y][position.x+1]
    newY = position.y;
  }  
  if(position.y+1 < mine.length && lastMove!== 2 && mine[position.y+1][position.x+1] > maxGold){ //take the lower gold
    newY = position.y+1;
    maxGold = mine[position.y+1][position.x+1];
  }
  if(position.y-1 >= 0 && lastMove!== 1 && mine[position.y-1][position.x+1] > maxGold){ //take the upper gold
    newY = position.y-1;
    maxGold = mine[position.y-1][position.x+1];
  }
  
  //update last move
  if(newY == position.y) lastMove = 0;
  else if(newY == position.y+1) lastMove = 2;
  else if (newY == position.y-1) lastMove = 1;

  return new Position(newX, newY);
};

export default move;
