import assert from 'assert';
import { getMaximumGold } from '../src/move';

describe('test different cases of mines', function() {
  it('validate 3x3 mine moves', function() {
    const mineOne = [
      [5,6,0],
      [5,8,7],
      [8,9,0]
    ];
    const moves = [[ 2, 0 ], [ 2, 1 ], [ 1, 2 ]];
    const [score, results] = getMaximumGold(mineOne);
    moves.forEach((item, index) => {
      assert.strictEqual(results[index][0], item[0]);
      assert.strictEqual(results[index][1], item[1]);
    });

    assert.strictEqual(score, 24);
  });

  it('handles a mine which breaks on zero', function() {
    const mineOne = [
      [1000, 600, 10, 20],
      [50, 80, 0, 30],
      [10, 90, 10, 40]
    ];
    const moves = [[0, 0 ], [ 0, 1 ], [ 1, 2 ]];
    const [score, results] = getMaximumGold(mineOne);
    moves.forEach((item, index) => {
      assert.strictEqual(results[index][0], item[0]);
      assert.strictEqual(results[index][1], item[1]);
    });
    assert.strictEqual(score, 1600);
  });

  it('handles the luna mine', function() {
    const mineOne = [
      [1, 2, 2, 4, 8, 3, 5, 9, 3, 7],
      [6, 9, 8, 7, 6, 3, 1, 5, 7, 8],
      [6, 1, 0, 1, 1, 9, 2, 8, 2, 1],
      [1, 5, 4, 7, 6, 5, 0, 4, 0, 9],
      [6, 5, 3, 5, 7, 1, 7, 7, 6, 5],
      [3, 2, 7, 8, 5, 1, 9, 1, 9, 6],
      [6, 8, 4, 1, 7, 6, 2, 1, 6, 1],
      [5, 6, 1, 9, 7, 2, 2, 1, 0, 6],
      [0, 4, 9, 5, 4, 8, 8, 7, 2, 4],
      [9, 9, 0, 1, 8, 9, 5, 2, 0, 9]
    ];
    const moves = [[9,0], [9,1], [8,2], [8,3], [9,4], [8,5], [9,6], [8,7], [8,8], [9,9]];
    const [score, results] = getMaximumGold(mineOne);
    moves.forEach((item, index) => {
      assert.strictEqual(results[index][0], item[0]);
      assert.strictEqual(results[index][1], item[1]);
    });
    assert.strictEqual(score, 71);
  });
});