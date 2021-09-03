const { Node } = require("../types/Node.class");
const { sort_nodes_descending, get_legal_moves } = require("../utils");

const first_node = {
  direction: "DOWN",
  node: new Node(
    "RIGHT",
    [0, -1, 0],
    7,
    "DOWN",
    [1, 0, 1]
  )
};
const second_node = {
  direction: "UP",
  node: new Node(
    "UP",
    [-1, 1, 0],
    16,
    "DOWN",
    [-1, 0, 1]
  )
};
const third_node = {
  direction: "RIGHT",
  node: new Node(
    "RIGHT",
    [0, -1, 0],
    13,
    "DOWN",
    [-1, 0, 1]
  )
};

const nodes = [first_node, second_node, third_node];
const sorted_nodes = [second_node, third_node, first_node];

describe("Determine legal next moves", () => {
  test("recognize current position is at upper boundary of mine", () => {
    expect(get_legal_moves(0, 10)).toStrictEqual(["RIGHT", "DOWN"]);
  });

  test("recognize current position is at lower boundary of mine", () => {
    expect(get_legal_moves(10, 10)).toStrictEqual(["RIGHT", "UP"]);
  });

  test("recognize current position is in between upper and lower boundaries", () => {
    expect(get_legal_moves(1, 10)).toStrictEqual(["RIGHT", "UP", "DOWN"]);
  });
});

describe("Sort nodes", () => {
  test("Sort nodes in desending order", () => {
    expect(sort_nodes_descending(nodes)).toStrictEqual(sorted_nodes);
  });
});
