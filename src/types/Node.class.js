export class Node {
  constructor(
    value,
    richest_subsequent_node,
    second_richest_subsequent_node,
    potential_value,
    next_direction
  ) {
    this.value = value,
    this.richest_subsequent_node = richest_subsequent_node,
    this.second_richest_subsequent_node = second_richest_subsequent_node,
    this.potential_value = potential_value,
    this.next_direction = next_direction
  };
};
