import mine from "../mines/jupiter.js";
import Position from "./position.js";
import StrategyManager from "../minestrategy/strategyManager";
import EvaluateArrayStrategy from "../minestrategy/evaluateArray/evaluateArrayStrategy";



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

 const strategyManager = new StrategyManager();
 const evaluateArrayStrategy = new EvaluateArrayStrategy();
 strategyManager.strategy = evaluateArrayStrategy;


const move = (mine, position) => {

  return strategyManager.move(mine, position);
//Before do a movement 
// Definir uma estratégia 
// Criar uma interface para tratar 
// essa interface tem que tratar a mina
// e ssa interface tem que fazer movimento..  todos os outros métodos não dizem respeito ao projeto.. B
}
export default move;
