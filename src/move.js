import mine from "../mines/jupiter.js";
import Position from "./position.js";

let movedRight;
let lastMovement;
let moveAmount = 0;
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
let mineScore;
let bestScore = { score: 0, coordenadas: [] };
let firstIn = true;
let evaluatedMine;
function createEvaluatedMine(mine) {
  evaluatedMine = [];
  for (var i = 0; i < mine.length; i++) {
    evaluatedMine[i] = [];
    for (var j = 0; j < mine[0].length; j++) {
      evaluatedMine[i][j] = { up: 0, mid: 0, down: 0 };
    }

  }

}
const move = (mine, position) => {


  if (firstIn || position == undefined) {
    bestScore = { score: 0, coordenadas: [] };
    createEvaluatedMine(mine);
    mineScore = getMinescore(mine);
    console.log('evaluatedMine[0][0]');
    console.log(evaluatedMine[9][0]);

    firstIn = false;
  }
  if (mineScore == undefined) {

  }

  let newPosition;

  const newX = (position && position.x + 1) || 0;
  let newY;
  if (position) {
    newY = getPositionY(position, mineScore, mine);
  } else {
    let bestScore = 0;
    let casa = 0;
    for (let i = 0; i < evaluatedMine.length; i++) {
      evaluatedMine[i][0];
      let value =0;
      let mid = evaluatedMine[i][1].mid;
      let top = evaluatedMine[i-1]?evaluatedMine[i-1][1].up:0;
      let bot = evaluatedMine[i+1]?evaluatedMine[i+1][1].down:0;
      if(mid>=top&&mid>=bot){
        value =mine[i][0]+mid;        
      }else if(top>=mid&&top>=bot){
        value =mine[i][0]+top;    
      }else{
        value =mine[i][0]+bot;    
      }
     
      if (value > bestScore) {
        bestScore = value;
        casa = i;
      }
    }
    newY = casa;
    if (casa == 0) {
      lastMovement = 'up';
    } else if (casa == mine.length) {
      lastMovement = 'down';
    } else {
      lastMovement = 'none';
    }
  }
  return new Position(newX, newY);
};
function getMinescore(mine) {
  let mineScore = avoidPitFalls(mine);
  mineScore = evaluateCells(mine);
  // mineScore = evaluateCells(mine);
  // console.log(evaluatedMine)
  return mineScore;
  // return mine;
};
// score = 0;

function doMove(position, mine, score = 0, lastMovement = 'up', coordenadas = []) {
  //[0,0]

  score += mine[position.y][position.x];
  if (score > bestScore.score) {
    bestScore.score = score,
      bestScore.coordenadas = coordenadas;
  } else {
    // console.log(bestScore.score,score);
  }
  coordenadas.push([position.x, position.y]);
  // caminhos.push({ score: score, coordenadas: coordenadas })
  if (position.x < mine[0].length && mine[position.y][position.x] > 0 && score > bestScore.score * 0.7) {
    //moveup    
    if (lastMovement != 'up' && position.y > 0)
      doMove({
        x: position.x + 1,
        y: position.y - 1,
      },
        mine,
        score,
        'up',
        JSON.parse(JSON.stringify(coordenadas))
      )
    // movemid
    if (lastMovement != 'mid')
      doMove({
        x: position.x + 1,
        y: position.y,
      },
        mine,
        score,
        'mid'
        ,
        JSON.parse(JSON.stringify(coordenadas))
      )
    //movedown
    if (lastMovement != 'down' && position.y < mine.length - 1)
      doMove({
        x: position.x + 1,
        y: position.y + 1,
      },
        mine,
        score,
        'down'
        ,
        JSON.parse(JSON.stringify(coordenadas))
      )

    //movedown
    //movemid
  }



}

// function avoidPitFalls(mine) {
//   for (let i = 0; i < mine.length - 1; i++) {
//     for (let j = 0; j < mine[i].length; j++) {
//       if (i == 0) {
//         if (mine[i][j + 1] == 0 && mine[i + 1][j + 1] == 0) {
//           mine[i][j]
//         }
//       } else if (i == mine.length) {
//         if (mine[i - 1][j + 1] == 0 && mine[i][j + 1] == 0) {
//           mine[i][j] = -1;
//         }
//       } else {
//         if ((mine[i + 1][j + 1] == 0 && mine[i - 1][j + 1] == 0 && mine[i][j + 1] == 0)
//           || (mine[i + 1][j + 1] == 0 && mine[i - 1][j + 1] == 0)
//           || (mine[i - 1][j + 1] == 0 && mine[i][j + 1] == 0)
//           || (mine[i + 1][j + 1] == 0 && mine[i][j + 1] == 0)) {
//           mine[i][j] = -1;
//         }
//       }
//     }
//   }
//   return mine;
// }

function avoidPitFalls(mine) {
  for (let i = 0; i < mine.length; i++) {
    for (let j = 0; j < mine[i].length; j++) {

      // limite superior  
      if (mine[i][j] != 0) {

        if (i == 0) {
          if (mine[i][j + 1] == 0 && mine[i + 1][j + 1] == 0) {

            mine[i][j] = 0;
            evaluatedMine[i][j].up = 0;
            evaluatedMine[i][j].mid = 0;
          }
          else {
            if (mine[i+1][j + 1] == 0) {
              evaluatedMine[i][j].mid = 0;              
            } else {
              evaluatedMine[i][j].mid = mine[i][j];
            }
            evaluatedMine[i][j].up = mine[i][j];
          }
        }    //limite inferior
        else if (i == mine.length-1) {           
          if (mine[i][j + 1] == 0 && mine[i - 1][j + 1] == 0) {
            mine[i][j] = 0;
            evaluatedMine[i][j].up = 0;
            evaluatedMine[i][j].mid = 0;
          }
          else {
            
            if (mine[i-1][j + 1] == 0) {
              evaluatedMine[i][j].mid = 0;
            } else {
              evaluatedMine[i][j].mid = mine[i][j];
            }
            evaluatedMine[i][j].up = mine[i][j];          
          }       
        } else {
          if ((mine[i + 1][j + 1] == 0 && mine[i - 1][j + 1] == 0 && mine[i][j + 1] == 0)) {
            mine[i][j] = 0;
            evaluatedMine[i][j].up = 0;
            evaluatedMine[i][j].mid = 0;
            evaluatedMine[i][j].down = 0;
          } else {
            evaluatedMine[i][j].up = mine[i][j];
            evaluatedMine[i][j].mid = mine[i][j];
            evaluatedMine[i][j].down = mine[i][j];
            //mid
            if (mine[i + 1][j + 1] == 0 && mine[i - 1][j + 1] == 0)
              evaluatedMine[i][j].mid = 0;
            if (mine[i - 1][j + 1] == 0 && mine[i][j + 1] == 0)
              evaluatedMine[i][j].up = 0;
            if (mine[i + 1][j + 1] == 0 && mine[i][j + 1] == 0)
              evaluatedMine[i][j].down = 0;
          }
        }
      } else {
        evaluatedMine[i][j].up = 0;
        evaluatedMine[i][j].mid = 0;
        evaluatedMine[i][j].down = 0;
      }
    
      
    }
    

  }
  return evaluatedMine;
}
// function evaluateCells(mine) {
//   for (let i = mine.length - 1; i >= 0; i--) {
//     for (let j = mine[i].length - 2; j > 0; j--) {
//       if (i == 0) {
//         if (evaluatedMine[i][j].up > 0) {
//           evaluatedMine[i][j].up += evaluatedMine[i][j + 1].mid;
//           evaluatedMine[i][j].up += evaluatedMine[i + 1][j + 1].down;
//         }
//         if (evaluatedMine[i][j].mid > 0) {
//           evaluatedMine[i][j].mid += evaluatedMine[i + 1][j + 1].up;
//         }
//       } else if (i == mine.length - 1) {
//         if (evaluatedMine[i][j].down > 0) {
//           evaluatedMine[i][j].down += evaluatedMine[i][j + 1].mid;
//           evaluatedMine[i][j].down += evaluatedMine[i - 1][j + 1].up;
//         }
//         if (evaluatedMine[i][j].mid > 0) {
//           evaluatedMine[i][j].mid += evaluatedMine[i - 1][j + 1].up;
//         }
//       } else {
//         if (mine[i][j] >= 1) {
//           if (evaluatedMine[i][j].up > 0) {
//             // console.log(j+1);
//             evaluatedMine[i][j].up += evaluatedMine[i][j + 1].mid;
//             evaluatedMine[i][j].up += evaluatedMine[i + 1][j + 1].down;
//           }
//           if (evaluatedMine[i][j].down > 0) {
//             evaluatedMine[i][j].down += evaluatedMine[i][j + 1].mid;
//             evaluatedMine[i][j].down += evaluatedMine[i - 1][j + 1].up;
//           }
//           if (evaluatedMine[i][j].mid > 0) {
//             evaluatedMine[i][j].mid += evaluatedMine[i - 1][j + 1].up;
//             evaluatedMine[i][j].mid += evaluatedMine[i + 1][j + 1].down;
//           }
//         } else {

//         }
//         // console.log(i == 0 && mine[i][j + 1] == 0 && mine[i + 1][j+1] == 0);
//       }

//     }
//   }
//   return mine;

// }

function evaluateCells(mine) {
  for (let j = mine[0].length - 2; j >= 0; j--) {    
    for (let i = mine.length-1; i >= 0; i--) {
      
   
      let mid = evaluatedMine[i][j + 1].mid;
      let up = evaluatedMine[i - 1] ? evaluatedMine[i - 1][j + 1].up : 0;
      let down = evaluatedMine[i + 1] ? evaluatedMine[i + 1][j + 1].down : 0;
      // console.log('mid, up, down');
      // console.log(mid, up, down);

      if (i == 0) {
        if (evaluatedMine[i][j].up > 0) {
          evaluatedMine[i][j].up += mid > down? mid : down;
        }
        if (evaluatedMine[i][j].mid > 0) {
          evaluatedMine[i][j].mid += down;
        }
      } else if (i == mine.length - 1) {       
        if (evaluatedMine[i][j].down > 0) {
          evaluatedMine[i][j].down += mid > up ? mid : up;
        }
        if (mine.length == 10 && i==9&&j==1) {        
          console.log('##')
          console.log(i,j)
          console.log(evaluatedMine[8][2]);
          console.log(up);
          console.log('##')
        }  
      
        if (evaluatedMine[i][j].mid > 0) {        
          evaluatedMine[i][j].mid += up;     
        }            
      } else {          
        if (mine[i][j] >= 1) {
              
          if (evaluatedMine[i][j].up > 0) {
            // console.log(j+1);
           

            evaluatedMine[i][j].up += mid > down ? mid : down;
        
          }
          if (evaluatedMine[i][j].down > 0) {
            evaluatedMine[i][j].down += mid > up ? mid : up;
          }
          if (evaluatedMine[i][j].mid > 0) {
            evaluatedMine[i][j].mid += up > down ? up : down;
          }
        
        } else {
          evaluatedMine[i][j].up = 0;
          evaluatedMine[i][j].mid = 0;
          evaluatedMine[i][j].down = 0;

        }
        // console.log(i == 0 && mine[i][j + 1] == 0 && mine[i + 1][j+1] == 0);
      }    
 
    }
    
  }
  return mine;

}

// function evaluateCells(mine) {
//   for (let i = mine.length - 1; i >= 0; i--) {
//     for (let j = mine[i].length - 1; j > 0; j--) {
//       if (i == 0) {      
//         if (evaluatedMine[i][j].up > 0) {      
//           evaluatedMine[i][j].up += mine[i][j + 1]>mine[i + 1][j + 1]?mine[i][j + 1]:mine[i + 1][j + 1];          
//         }
//         if (evaluatedMine[i][j].mid > 0) {     
//           evaluatedMine[i][j].mid += mine[i + 1][j + 1];     
//         }
//       } else if (i == mine.length - 1) {
//         if (evaluatedMine[i][j].down > 0) {
//           evaluatedMine[i][j].down += mine[i][j + 1]>mine[i - 1][j + 1]?mine[i][j + 1]:mine[i - 1][j + 1];          
//         }
//         if (evaluatedMine[i][j].mid > 0) {
//           evaluatedMine[i][j].mid += mine[i - 1][j + 1];
//         }
//       } else {
//         if (mine[i][j] >= 1) {
//           if (evaluatedMine[i][j].up > 0) {
//             evaluatedMine[i][j].up += mine[i][j + 1]>mine[i + 1][j + 1]?mine[i][j + 1]:mine[i + 1][j + 1];            
//           }
//           if (evaluatedMine[i][j].down > 0) {
//             evaluatedMine[i][j].down += mine[i][j + 1]>mine[i - 1][j + 1]?mine[i][j + 1]:mine[i - 1][j + 1];            
//           }
//           if (evatluatedMine[i][j].mid > 0) {
//             evaluatedMine[i][j].mid += mine[i - 1][j + 1]>mine[i + 1][j + 1]?mine[i - 1][j + 1]:mine[i + 1][j + 1];            
//           }

//         }
//         // console.log(i == 0 && mine[i][j + 1] == 0 && mine[i + 1][j+1] == 0);

//       }

//     }
//   }
//   return mine;

// }
let coun = 0
function getPositionY(position, mine, bruteMine) {
  let x = position.x;
  let y = position.y;

  let mid = evaluatedMine[y][x + 1].mid;
  let down = evaluatedMine[y + 1] ? evaluatedMine[y + 1][x + 1].down : 0;
  let up = evaluatedMine[y - 1] ? evaluatedMine[y - 1][x + 1].up : 0;
  if (lastMovement == 'up') {
    // futureMove()
    if (mid > down) {
      lastMovement = "mid";
      return y + 0;
    } else {
      lastMovement = "down";
      return y + 1;
    }
  } else if (lastMovement == 'down') {
    if (mid > up) {
      lastMovement = "mid";
      return y + 0;
    } else {
      lastMovement = "up";
      return y - 1;
    }
  } else if (lastMovement == 'mid') {
    if (down > up || y == 0) {
      lastMovement = "down";
      return y + 1;
    } else {
      lastMovement = "up";
      return y - 1;
    }
  } else {
    if (down >= up && down >= mid) {
      lastMovement = "down";
      return y + 1;
    } else if (down <= up && up >= mid) {
      lastMovement = "up";
      return y - 1;
    } else {
      lastMovement = "mid";
      return y + 0;
    }
  }
}
export default move;
