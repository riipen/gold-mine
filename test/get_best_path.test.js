import assert from 'assert';

import { getBestPathConstructor } from '../src/move/get_best_path';

describe('nominal getBestPath call', async () => {
  const analyzeMine = (x, y, mine) => 0;
  const generateBestPath = () => [4, 3, 2, 1];

  const subject = getBestPathConstructor(analyzeMine, generateBestPath);

  const bestPath = await subject([[0, 0], [0, 0]]);

  it('should return expected best path', () => {
    assert.deepStrictEqual(bestPath, [4, 3, 2, 1]);
  })
});