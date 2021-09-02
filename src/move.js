import Position from "./position.js";
import { Node } from "./types/Node.class";

const DIRECTIONS = Object.freeze({
  UP: -1,
  RIGHT: 0,
  DOWN: +1
});

// Variable used to store a path matrix (in object format)
let mine_cache;

/**
 * Movement function which generates the "optimal route" mine object and uses
 * that to determine the next move in the best path each time this function is
 * called.
 *
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {object} position - The current position of the miner, will be undefined on the first move
 *
 * @return {Position} The new position of the miner.
 */
 const move = (mine, position) => {
  if (position == undefined) {
    mine_cache = get_optimal_route(mine);
    return new Position(0, mine_cache.best_start_row);
  }

  const newX = (position && position.x + 1) || 0;
  const next_direction = mine_cache[position.x][position.y].next_direction;
  const newY = DIRECTIONS[next_direction] + position.y

  return new Position(newX, newY);
};

function get_optimal_route(mine) {
  const max_cols = mine[0].length - 1;
  const max_row = mine.length - 1;
  const cache = {};
  let best_start_row = max_row;

  for (let col = max_cols; col >= 0 ; col--) {
    cache[col] = {};

    for (let row = max_row; row >= 0; row--) {
      const value = mine[row][col];

      // The last column will be our base case (i.e. no further paths beyond here)
      if (col == max_cols) {
        cache[col][row] = new Node(
          value,
          null,
          null,
          value,
          null
        );
      } else if (value == 0) {
        // For 0-value nodes, references to further nodes/paths is meaningless
        // since the exploration will end here.
        cache[col][row] = new Node(
          0,
          null,
          null,
          0,
          null
        );
      } else {
        const legal_directions = get_legal_moves(row, max_row);
        const next_possible_nodes = legal_directions.map(
          function(direction) {
            return {
              direction: direction,
              node: cache[col + 1][row + DIRECTIONS[direction]]
            };
          }
        );
        const sorted_nodes = sort_nodes(next_possible_nodes);
        const richest_node = sorted_nodes[0];
        const second_richest_node = sorted_nodes[1];

        const uses_best_path = (
          richest_node.node.richest_subsequent_node == null
          ? true
          : richest_node.direction != richest_node.node.next_direction
        );

        const next_direction = (
          uses_best_path
          ? richest_node.direction
          : second_richest_node.direction
        );

        const potential_value = (
          uses_best_path
          ? richest_node.node.potential_value
          : 0
        );

        cache[col][row] = new Node(
          value,
          richest_node,
          second_richest_node,
          value + potential_value,
          next_direction
        );

        if (col == 0) {
          if (cache[col][row].potential_value > cache[col][best_start_row].potential_value) {
            best_start_row = row;
          }
        }
      }
    }
  }

  cache["best_start_row"] = best_start_row;

  return cache;
}

/**
 * Given multiple nodes, sort them in decreasing order of potential value.
 *
 * @param {*} possible_nodes An array of `Node` objects
 *
 * @returns The input array, sorted in decreasing of the the
 *   `node.potential_value` property.
 */
function sort_nodes(possible_nodes) {
  return possible_nodes.sort(
    function(node_a, node_a) {
      return b.node.potential_value - a.node.potential_value
    }
  );
}

/**
 * Get possible x-axis movement based on the miner's current row position.
 *
 * @param row The current row.
 * @param max_row_number The maximum number of rows in the given mine.
 *
 * @returns An array of possible moves, some combination of
 *   * UP
 *   * RIGHT
 *   * DOWN
 */
function get_legal_moves(row, max_row_number) {
  if (row == 0) {
    return ["RIGHT", "DOWN"];
  }
  if (row == max_row_number) {
    return ["RIGHT", "UP"];
  }
  return ["RIGHT", "UP", "DOWN"];
}

export default move;
