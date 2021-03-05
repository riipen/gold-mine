import assert from 'assert';

import { findBestPathConstructor } from '../src/move/find_best_path';

describe('nominal findBestPath call', async () => {
  const subject = findBestPathConstructor();

  const paths = { 
    '0,0': {
      bestMove: null,
    },
    '0,2': {
      bestMove: -1,
    },
    '1,1': {
      bestMove: 0,
    },
    bestStartingY: 2,
  };

  const bestPath = subject(3, paths);

  it('should return expected best path', () => {
    assert.deepStrictEqual(bestPath, [2, 1, 1]);
  })
});