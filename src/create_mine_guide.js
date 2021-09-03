const { Node } =  require("./types/Node.class");
const utils = require("./utils");

const DIRECTIONS = Object.freeze({
  UP: -1,
  RIGHT: 0,
  DOWN: +1
});

/**
 * Given the input mine, create a corresponding object containing path info
 * and potential gold attainable for each node.
 *
 * Since each node (apart from the starting node) has up to four potential
 * options for its two subsequent movements, we want to make sure that we keep
 * track of the two best possible path details.
 *
 * The approach here is as follows: beginning with the last column and moving
 * backwards, iterate through each node and store the following:
 *   * value
 *   * "best path" information
 *   * "alternate path" information
 *
 * With this approach, when we reach the starting row, the value of "best path"
 * will be the best possible path for that node.
 *
 * @param {array} mine A (n x m) multidimensional array respresenting the mine.
 *
 * @returns {Object} An object containing two elements: the best starting row
 *   and an array of moves corresponding to the best path from the
 *   aforementioned row.
 */
 function create_mine_guide(mine) {
  const max_cols = mine[0].length - 1;
  const max_row = mine.length - 1;
  const cache = {};
  let best_start_row = max_row;

  for (let col = max_cols; col >= 0 ; col--) {
    cache[col] = {};

    for (let row = max_row; row >= 0; row--) {
      const value = mine[row][col];

      // The last column will be our base case (i.e. no further paths beyond
      // this point). For 0-value nodes, references to further nodes/paths is
      // meaningless, since the exploration will end here.
      if (col == max_cols || value == 0) {
        cache[col][row] = new Node(
          null,
          [],
          value,
          null,
          [],
          value
        );
      } else {
        const legal_directions = utils.get_legal_moves(row, max_row);
        const next_possible_nodes = legal_directions.map(
          function(direction) {
            return {
              direction: direction,
              node: cache[col + 1][row + DIRECTIONS[direction]]
            };
          }
        );
        const sorted_nodes = utils.sort_nodes_descending(next_possible_nodes);
        const richest_node = sorted_nodes[0];
        const second_richest_node = sorted_nodes[1];

        // The literal "happy path" scenario: we can use the richest possible
        // node as well as that node's own best path.
        const uses_best_path = (
          richest_node.node.best_direction == null
          ? true
          : richest_node.direction != richest_node.node.best_direction
        );
        // Even without the happy path, it is still possible that the our best
        // move is in the direction of the richest node (albeit through the
        // latter's alternate path).
        const uses_richest_node = (
          uses_best_path
          || (
            richest_node.node.alt_potential_value > second_richest_node.node.best_potential_value
            || (
              second_richest_node.direction == second_richest_node.node.best_direction
              && richest_node.node.alt_potential_value > second_richest_node.node.alt_potential_value
            )
          )
        );

        const best_direction = (
          uses_richest_node
          ? richest_node.direction
          : second_richest_node.direction
        );
        const alt_direction = (
          uses_richest_node
          ? second_richest_node.direction
          : richest_node.direction
        );

        /**
         * Get the best possible path, that is, the best _feasible_ option of:
         *   * the richest node's best path
         *   * the richest node's alternate path
         *   * the second richest node's best path
         *   * the second richest node's alternate path
         *
         * By feasible, we mean that taking such a path will not result in
         * moving the same direction twice.
         */
        const best_path = (
          uses_best_path
          ? richest_node.node.best_path.slice()
          : (
            uses_richest_node
            ? richest_node.node.alt_path.slice()
            : (
              second_richest_node.direction != second_richest_node.node.best_direction
              ? second_richest_node.node.best_path.slice()
              : second_richest_node.node.alt_path.slice()
            )

          )
        );
        const alt_path = (
          col == 0
          ? []
          : (
            alt_direction == richest_node.direction
            ? richest_node.node.alt_path.slice()
            : (
              second_richest_node.direction == second_richest_node.node.best_direction
              ? second_richest_node.node.alt_path.slice()
              : second_richest_node.node.best_path.slice()
            )
          )
        );

        best_path.unshift(DIRECTIONS[best_direction]);
        alt_path.unshift(DIRECTIONS[alt_direction]);

        const potential_value = (
          uses_best_path
          ? richest_node.node.best_potential_value + value
          : (
            uses_richest_node
            ? richest_node.node.alt_potential_value + value
            : (
              second_richest_node.direction != second_richest_node.node.best_direction
              ? second_richest_node.node.best_potential_value + value
              : second_richest_node.node.alt_potential_value + value
            )

          )
        );

        const alt_potential_value = (
          alt_direction == richest_node.direction
          ? richest_node.node.alt_potential_value + value
          : (
            second_richest_node.direction == second_richest_node.node.best_direction
            ? second_richest_node.node.alt_potential_value + value
            : second_richest_node.node.best_potential_value + value
          )
        );

        cache[col][row] = new Node(
          best_direction,
          best_path,
          potential_value,
          alt_direction,
          alt_path,
          alt_potential_value
        );

        /**
         * Since each node in a column will be storing two arrays of length
         * (max_col - col), this can quickly cause slowdown and eventually,
         * stack overflow. To prevent this, we will sweep behind us as we go,
         * since, once a given cache position has been filled, we no longer
         * require the node to its immediate down right (as we are moving
         * backwards through the columns and up through the rows).
         */
        if (row < max_row) {
          cache[col + 1][row + 1] = null;
        }
        if (row == 0 && col < max_cols) {
          cache[col + 1] = null;
        }

        // Save best starting position so we don't have to re-iterate through
        if (col == 0) {
          const current_potential = cache[col][row].best_potential_value;
          const best_potential = cache[col][best_start_row].best_potential_value;
          if (current_potential > best_potential) {
            best_start_row = row;
          }
        }
      }
    }
  }

  return {
    best_start_row: best_start_row,
    best_path: cache[0][best_start_row].best_path
  };
}

module.exports = create_mine_guide;