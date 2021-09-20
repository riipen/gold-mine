import Position from "./position";

const DIRECTIONS = {
  DOWN: 'down',
  RIGHT: 'right',
  UP: 'up',
};

let lastDirectionMoved;

export class BestRouteCalculator {
  constructor(mine) {
    // factor: reduces harvest potential if move is near mine boundaries
    this.boundaryRiskConstant = .5;
    // factor: reduces harvest potential by a third when simulated harvest are 0
    this.simulationConstant = .33;

    this.mine = mine;
    this.mineVerticalSize = mine[0].length;
    this.mineHorizontalSize = mine.length;
  }

  /**
   * uses current position to build an "optimal" move
   * @param currentPosition
   * @returns {Position}
   */
  getNextBestPosition(
    currentPosition
  ) {
    const {x: currentX, y: currentY} = currentPosition;
    const potentialPositions = this.getPotentialPositions(currentX, currentY);
    const finalNextPosition = this.findBestNextMove(potentialPositions)[0];
    lastDirectionMoved = finalNextPosition.direction;

    return new Position(finalNextPosition.x, finalNextPosition.y);
  };

  /**
   * returns a list with valid next positions
   * @param currentHorizontalPosition
   * @param currentVerticalPosition
   * @returns {*[]}
   */
  getPotentialPositions(
    currentHorizontalPosition = 0,
    currentVerticalPosition = 0,
  ) {
    const positions = [];
    const canMoveRight = currentHorizontalPosition < this.mineHorizontalSize - 1;
    const canMoveUp = currentVerticalPosition > 1;
    const canMoveDown = currentVerticalPosition < this.mineHorizontalSize - 2;

    if (canMoveRight && lastDirectionMoved !== DIRECTIONS.RIGHT) {
      positions.push(this.buildNextMove(currentHorizontalPosition, currentVerticalPosition, DIRECTIONS.RIGHT));
    }

    if (canMoveUp && lastDirectionMoved !== DIRECTIONS.UP) {
      positions.push(this.buildNextMove(currentHorizontalPosition, currentVerticalPosition, DIRECTIONS.UP));
    }

    if (canMoveDown && lastDirectionMoved !== DIRECTIONS.DOWN) {
      positions.push(this.buildNextMove(currentHorizontalPosition, currentVerticalPosition, DIRECTIONS.DOWN));
    }

    return positions;
  };

  /**
   * builds a move object
   * @param currentX
   * @param currentY
   * @param direction
   * @returns {{potentialHarvest, x: number, y: number, riskFactor: (number), direction: string}}
   */
  buildNextMove(
    currentX = 0,
    currentY = 0,
    direction = DIRECTIONS.RIGHT,
  ) {
    let move;

    if (direction === DIRECTIONS.RIGHT) {
      move = this.buildNextRightMove(currentX, currentY);
    } else if (direction === DIRECTIONS.UP) {
      move = this.buildNextUpMove(currentX, currentY);
    } else {
      move = this.buildNextDownMove(currentX, currentY);
    }

    try {
      move.simulations = this.simulateFutureMove(move.x, move.y, move.direction);
    } catch (e) {
      // no simulations, avoid breaking
      console.log(`could not simulate moves for (${move.x}, ${move.y})`);
    }

    return move;
  };

  /**
   * builds both future moves for current position + direction
   * @param currentMoveX
   * @param currentMoveY
   * @param currentMoveDirection
   * @returns {*[]}
   */
  simulateFutureMove(
    currentMoveX = 0,
    currentMoveY = 0,
    currentMoveDirection = DIRECTIONS.RIGHT
  ) {
    const moves = [];

    if (currentMoveDirection === DIRECTIONS.RIGHT) {
      moves.push(
        this.buildNextDownMove(currentMoveX, currentMoveY),
        this.buildNextUpMove(currentMoveX, currentMoveY)
      );
    } else if (currentMoveDirection === DIRECTIONS.UP) {
      moves.push(
        this.buildNextDownMove(currentMoveX, currentMoveY),
        this.buildNextRightMove(currentMoveX, currentMoveY)
      );
    } else {
      moves.push(
        this.buildNextUpMove(currentMoveX, currentMoveY),
        this.buildNextRightMove(currentMoveX, currentMoveY)
      );
    }

    return moves;
  };

  /**
   * uses simulation factors and risk constants to return the "best" next move
   * @param positions
   * @returns {*[]}
   */
  findBestNextMove(positions = []) {
    /**
     * simulation reducer fn
     * each time a simulated move has a 0 harvest, we reduce the move potential by a *simulationConstant (.33)
     * @param simulationValue
     * @param currentSimulation
     * @returns {number}
     */
    const simulationReducer = (simulationValue, currentSimulation) => {
      return simulationValue * (currentSimulation.potentialHarvest > 0 ? 1 : this.simulationConstant);
    };

    return positions.sort((a, b) => {
      const simulatedFactorA = a.simulations ? a.simulations.reduce(simulationReducer, 1) : 0.1;
      const simulatedFactorB = b.simulations ? b.simulations.reduce(simulationReducer, 1) : 0.1;

      return b.potentialHarvest * b.riskFactor * simulatedFactorB - a.potentialHarvest * a.riskFactor * simulatedFactorA;
    });
  };

  /**
   * builds a valid next right move
   * @param currentX
   * @param currentY
   * @returns {{potentialHarvest, x: number, y: number, riskFactor: (number), direction: string}}
   */
  buildNextRightMove(
    currentX = 0,
    currentY = 0
  ) {
    const x = currentX + 1;
    const y = currentY;
    const potentialHarvest = this.mine[y][x];
    const riskFactor = y < 2 || y > this.mineVerticalSize - 3 ? this.boundaryRiskConstant : 1

    return {
      x,
      y,
      riskFactor,
      direction: DIRECTIONS.RIGHT,
      potentialHarvest,
    };
  };

  /**
   * builds a valid next up move
   * @param currentX
   * @param currentY
   * @returns {{potentialHarvest, x: number, y: number, riskFactor: (number), direction: string}}
   */
  buildNextUpMove(
    currentX = 0,
    currentY = 0
  ) {
    const x = currentX + 1;
    const y = currentY - 1;
    const potentialHarvest = this.mine[y][x];
    const riskFactor = y < 2 ? this.boundaryRiskConstant : 1

    return {
      x,
      y,
      riskFactor,
      direction: DIRECTIONS.UP,
      potentialHarvest,
    };
  };

  /**
   * builds a valid next down move
   * @param currentX
   * @param currentY
   * @returns {{potentialHarvest, x: number, y: number, riskFactor: (number), direction: string}}
   */
  buildNextDownMove(
    currentX = 0,
    currentY = 0,
  ) {
    const x = currentX + 1;
    const y = currentY + 1;
    const potentialHarvest = this.mine[y][x];
    const riskFactor = y > this.mineVerticalSize - 3 ? this.boundaryRiskConstant : 1;

    return {
      x,
      y,
      riskFactor,
      direction: DIRECTIONS.DOWN,
      potentialHarvest,
    };
  };
}