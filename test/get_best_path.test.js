import assert from 'assert';

import { getBestPathConstructor, generateBestPathConstructor, analyzeMineConstructor } from '../src/get_best_path';

describe('nominal getBestPathConstructor call', async () => {
  const analyzeMine = (x, y, mine) => 0;
  const generateBestPath = () => [4, 3, 2, 1];

  const getBestPath = getBestPathConstructor(analyzeMine, generateBestPath);

  const bestPath = await getBestPath([[0, 0], [0, 0]]);

  it('should return expected best path', () => {
    assert.deepStrictEqual(bestPath, [4, 3, 2, 1]);
  })
});