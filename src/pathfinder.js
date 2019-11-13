import Position from './position';

// Maps movement direction to the y-modification necessary to move in that direction
const Direction = {
  Right: 0,
  RightUp: -1,
  RightDown: 1
};

class PathFinder {
  constructor(mine) {
    if (!mine || !mine.length || !mine[0].length) {
      throw Error('Invalid mine!');
    }

    this.pathMatrix = this._generatePathMatrix(mine);
    this.previousDirection = null;
  }

  getStartPosition() {
    let max = 0;
    let startY = 0;
    for (let y = 0; y < this.pathMatrix.length; y++) {
      const nodeMaxes = this.pathMatrix[y][0];
      const nodeMax = Math.max(nodeMaxes.right, nodeMaxes.rightUp, nodeMaxes.rightDown);
      if (nodeMax > max) {
        max = nodeMax;
        startY = y;
      }
    }

    return new Position(0, startY);
  }

  moveNextPosition(position) {
    const yDirection = this._getNextDirection(position);
    const newX = position.x + 1;
    const newY = position.y + yDirection;
    this.previousDirection = yDirection;

    return new Position(newX, newY);
  }

  _generatePathMatrix(mine) {
    /*
    * To calculate the optimal moves for the mine we build a matrix containing the max gold mineable at each node 
    * when moving in each available direction. When calculating the max at each node we exclude the max obtained 
    * by moving in the same direction at the next node, which satisfies the condition of not being able to make 
    * the same move twice in a row. We also start at the final column so we end up at the start and thus know 
    * which row to start at without having to traverse backwards at the end of the calculation.
    */

    const matrix = [];
    const rows = mine.length;
    const columns = mine[0].length;

    for (let col = columns - 1; col >= 0; col--) {
      for (let row = 0; row < rows; row++) {
        matrix[row] = matrix[row] || [];
        let maxRemaining = (matrix[row][col] = {});

        let nodeRight, nodeRightUp, nodeRightDown;
        if (col < columns - 1) {
          nodeRight = matrix[row][col + 1];
          nodeRightUp = row > 0 && matrix[row - 1][col + 1];
          nodeRightDown = row < rows - 1 && matrix[row + 1][col + 1];
        }
        
        // Find the max gold obtainable when travelling in each available direction by excluding
        // the next node's max for the same direction, thus ensuring we don't violate direction rule
        const maxRight = nodeRight ? Math.max(nodeRight.rightUp, nodeRight.rightDown) : 0; // exclude right
        const maxRightUp = nodeRightUp ? Math.max(nodeRightUp.right, nodeRightUp.rightDown) : 0; // exclude rightUp
        const maxRightDown = nodeRightDown ? Math.max(nodeRightDown.right, nodeRightDown.rightUp) : 0; // exclude rightDown

        let goldAtNode = mine[row][col];
        if (goldAtNode === 0) { // zero gold stops the route, so the max from this node forward is 0
          maxRemaining.right = 0;
          maxRemaining.rightUp = 0;
          maxRemaining.rightDown = 0;
        } else {
          maxRemaining.right = goldAtNode + maxRight;
          maxRemaining.rightUp = goldAtNode + maxRightUp;
          maxRemaining.rightDown = goldAtNode + maxRightDown;
        }
      }
    }

    return matrix;
  }

  _getNextDirection(position) {
    // To find the next move direction we examine all the possible moves from the current position, 
    // looking for the highest gold value and excluding the previous move direction
    const nodeMaxes = this.pathMatrix[position.y][position.x];
    const availableMoves = [{
      direction: Direction.Right,
      gold: nodeMaxes.right
    }, {
      direction: Direction.RightUp,
      gold: nodeMaxes.rightUp
    }, {
      direction: Direction.RightDown,
      gold: nodeMaxes.rightDown
    }];
  
    const moves = availableMoves
      .filter(x => x.direction !== this.previousDirection)
      .sort((a, b) => b.gold - a.gold);
  
    return moves[0].direction;
  }
}

export default PathFinder;