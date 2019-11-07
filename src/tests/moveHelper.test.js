import findOptimalSolution from '../moveHelper';
import {
  initializeNode,
  getPathsForNode,
  reducePaths,
  createPath,
  getBestAcceptablePath,
  getNextNode,
  getNextPosition,
  isNextPositionValid,
  getColStepFromDirection,
  DIRECTIONS
} from '../moveHelper';

const mine = [[2, 0, 2], [1, 2, 0], [0, 1, 1]];

const nodes = {
  '0': {
    '0': {
      id: '0,0',
      value: 2,
      paths: {
        best: {
          direction: 'up',
          value: 4,
          nodes: ['1,1', '2,0']
        },
        second: {
          direction: 'right',
          nodes: [],
          value: 0
        }
      }
    },
    '1': {
      id: '0,1',
      value: 1,
      paths: {
        best: {
          direction: 'right',
          value: 4,
          nodes: ['1,1', '2,0']
        },
        second: {
          direction: 'up',
          nodes: ['1,2', '2,2'],
          value: 2
        }
      }
    },
    '2': {
      id: '0,2',
      value: 0,
      paths: null
    }
  },
  '1': {
    '0': {
      id: '1,0',
      value: 0,
      paths: null
    },
    '1': {
      id: '1,1',
      value: 2,
      paths: {
        best: {
          direction: 'down',
          value: 2,
          nodes: ['2,0']
        },
        second: {
          direction: 'up',
          value: 1,
          nodes: ['2,2']
        }
      }
    },
    '2': {
      id: '1,2',
      value: 1,
      paths: {
        best: {
          direction: 'right',
          value: 1,
          nodes: ['2,2']
        },
        second: {
          direction: 'down',
          value: 0,
          nodes: ['2,1']
        }
      }
    }
  }
};
describe('findOptimalSolution', () => {
  it('returns optimal path properly', () => {
    expect(findOptimalSolution(mine)).toMatchObject({
      value: nodes[0][0].value + nodes[0][0].paths.best.value,
      nodes: ['0,0', ...nodes[0][0].paths.best.nodes]
    });
  });
});
describe('initializeNode', () => {
  it('returns value from mine properly', () => {
    expect(initializeNode(mine, { col: 0, row: 1 }).value).toEqual(mine[1][0]);
  });
  it('returns id properly', () => {
    expect(initializeNode(mine, { col: 0, row: 1 }).id).toEqual('0,1');
  });
});

describe('getPathsForNode', () => {
  it('returns null if the node has value of 0', () => {
    expect(getPathsForNode(nodes, { value: 0 }, { col: 0, row: 2 })).toBeNull();
  });
  it('returns best and second paths properly', () => {
    expect(
      getPathsForNode(nodes, nodes[0][0], { col: 0, row: 0 })
    ).toMatchObject({
      ...nodes[0][0].paths
    });
  });
});

describe('reducePaths', () => {
  // TODO pass paths to reduce paths
  it('returns object with properties .best and .second', () => {});
});
describe('createPath', () => {
  it('properly returns best path in given direction', () => {
    expect(createPath(nodes, { col: 0, row: 0 }, DIRECTIONS.UP)).toMatchObject({
      ...nodes[0][0].paths.best
    });
  });
  it('returns empty path if no node in given direction', () => {
    expect(
      createPath(nodes, { col: 0, row: 0 }, DIRECTIONS.DOWN)
    ).toMatchObject({ direction: DIRECTIONS.DOWN, nodes: [], value: 0 });
  });
  it('returns empty path if node in given direction was a 0 node', () => {
    expect(
      createPath(nodes, { col: 0, row: 0 }, DIRECTIONS.RIGHT)
    ).toMatchObject({ direction: DIRECTIONS.RIGHT, nodes: [], value: 0 });
  });
});
describe('getNextNode', () => {
  it('returns next node properly', () => {
    expect(getNextNode(nodes, { col: 0, row: 0 }, DIRECTIONS.UP)).toMatchObject(
      nodes[1][1]
    );
  });
  it('returns null if next node did not exist', () => {
    expect(getNextNode(nodes, { col: 0, row: 0 }, DIRECTIONS.DOWN)).toBeNull();
  });
});
describe('getBestAcceptablePath', () => {
  const node = {
    id: '1,1',
    value: 2,
    paths: {
      best: {
        direction: 'down',
        value: 2,
        nodes: ['2,0']
      },
      second: {
        direction: 'up',
        value: 1,
        nodes: ['2,2']
      }
    }
  };
  it('returns best path if not in same direction as previousDirection', () => {
    expect(getBestAcceptablePath(node, DIRECTIONS.RIGHT)).toMatchObject({
      ...node.paths.best
    });
  });
  it('returns second path if best path is in same direction as previousDirection', () => {
    expect(getBestAcceptablePath(node, DIRECTIONS.DOWN)).toMatchObject({
      ...node.paths.second
    });
  });
  it('throws error if node did not have paths', () => {
    expect(() => {
      getBestAcceptablePath(
        { id: node.id, value: node.value },
        DIRECTIONS.RIGHT
      );
    }).toThrow(
      new Error(
        'node did not have paths, or did not have a best path with a direction'
      )
    );
  });
  it('throws error if node did not have a best path', () => {
    expect(() => {
      getBestAcceptablePath(
        {
          id: node.id,
          value: node.value,
          paths: { second: { ...node.paths.second } }
        },
        DIRECTIONS.RIGHT
      );
    }).toThrow(
      new Error(
        'node did not have paths, or did not have a best path with a direction'
      )
    );
  });
  it('throws error if node did not have a best path with a direction', () => {
    expect(() => {
      getBestAcceptablePath(
        {
          id: node.id,
          value: node.value,
          paths: {
            best: {
              value: 2,
              nodes: ['2,0']
            },
            second: {
              direction: 'up',
              value: 1,
              nodes: ['2,2']
            }
          }
        },
        DIRECTIONS.RIGHT
      );
    }).toThrow(
      new Error(
        'node did not have paths, or did not have a best path with a direction'
      )
    );
  });
});
describe('getNextPosition', () => {
  it('returns object in proper next position', () => {
    expect(getNextPosition({ col: 0, row: 0 }, DIRECTIONS.UP)).toMatchObject({
      col: 1,
      row: 1
    });
  });
});
describe('isNextPositionValid', () => {
  it('returns false if the nextPosition.col is not in nodes', () => {
    expect(isNextPositionValid(nodes, { col: '3', row: '0' })).toBeFalsy();
  });
  it('returns false if the nextPosition is not in nodes', () => {
    expect(isNextPositionValid(nodes, { col: '1', row: '3' })).toBeFalsy();
  });
  it('returns false if the value of the node at nextPosition is 0', () => {
    expect(isNextPositionValid(nodes, { col: '1', row: '0' })).toBeFalsy();
  });
  it('returns true if the nextNode exists and has a non-zero value', () => {
    expect(isNextPositionValid(nodes, { col: '1', row: '1' })).toBeTruthy();
  });
});
describe('getColStepFromDirection', () => {
  it('returns 1 for DIRECTIONS.UP', () => {
    expect(getColStepFromDirection(DIRECTIONS.UP)).toEqual(1);
  });
  it('returns 0 for DIRECTIONS.RIGHT', () => {
    expect(getColStepFromDirection(DIRECTIONS.RIGHT)).toEqual(0);
  });
  it('returns -1 for DIRECTIONS.DOWN', () => {
    expect(getColStepFromDirection(DIRECTIONS.DOWN)).toEqual(-1);
  });
  it('throws error for direction not in .UP, .RIGHT, or .DOWN', () => {
    expect(() => {
      getColStepFromDirection('invalidDirection');
    }).toThrow(new Error('invalid direction: invalidDirection'));
  });
});
