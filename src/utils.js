/**
 * Given multiple nodes, sort them in decreasing order of potential value.
 *
 * @param {array} possible_nodes An array of objects, each with a `node` property
 *   containing an instance of a `Node` object.
 *
 * @returns {array} The input array, sorted in decreasing of the the
 *   `node.best_potential_value` property.
 */
 function sort_nodes_descending(possible_nodes) {
  return possible_nodes.sort(
    function(node_a, node_b) {
      return node_b.node.best_potential_value - node_a.node.best_potential_value;
    }
  );
}

/**
 * Get possible movement based on the miner's current row position.
 *
 * @param {number} row The current row.
 * @param {number} max_row_number The maximum number of rows in the given mine.
 *
 * @returns {array} An array of possible moves, some combination of
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

module.exports = { sort_nodes_descending, get_legal_moves };
