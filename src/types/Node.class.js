export class Node {
  constructor(
    best_direction,
    best_path,
    best_potential_value,
    alt_direction,
    alt_path,
    alt_potential_value
  ) {
    this.best_direction = best_direction,
    this.best_path = best_path,
    this.best_potential_value = best_potential_value,
    this.alt_direction = alt_direction,
    this.alt_path = alt_path,
    this.alt_potential_value = alt_potential_value
  };
};
