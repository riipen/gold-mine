import assert from 'assert';
import PathFinder from './pathfinder';
import Position from './position';

describe('PathFinder', () => {
  describe('#getStartPosition', () => {
    it('Should return optimal starting position', () => {
      const mine = [
        [1, 1, 1, 1, 1],
        [9, 1, 1, 9, 9],
        [1, 9, 9, 1, 1],
        [1, 1, 1, 1, 1]
      ];
  
      const pathfinder = new PathFinder(mine);
      const start = pathfinder.getStartPosition();
  
      assert.deepEqual(start, new Position(0, 1));
    });
  
    it('Should return starting position (0, 0) if mine has only one row', () => {
      const mine = [[1, 1, 1, 1, 1]];
      const pathfinder = new PathFinder(mine);
      const start = pathfinder.getStartPosition();
  
      assert.deepEqual(start, new Position(0, 0));
    });
  });

  describe('#moveNextPosition', () => {
    it('Should advance x position by one', () => {
      const mine = [
        [1, 9, 9, 9, 1],
        [9, 1, 1, 1, 9]
      ];
  
      const pathfinder = new PathFinder(mine);
      let position = new Position(1, 0);
      let nextPosition = pathfinder.moveNextPosition(position);
      assert.equal(nextPosition.x, position.x + 1);
    });
  
    it('Should generate correct path (simple)', () => {
      const mine = [
        [1, 1, 1, 1, 1],
        [9, 1, 1, 9, 9],
        [1, 9, 9, 1, 1],
        [1, 1, 1, 1, 1]
      ];
  
      const pathfinder = new PathFinder(mine);
      const start = pathfinder.getStartPosition();
      const step1 = pathfinder.moveNextPosition(start);
      const step2 = pathfinder.moveNextPosition(step1);
      const step3 = pathfinder.moveNextPosition(step2);
      const step4 = pathfinder.moveNextPosition(step3);
      assert.deepEqual(step1, new Position(1, 2));
      assert.deepEqual(step2, new Position(2, 2));
      assert.deepEqual(step3, new Position(3, 1));
      assert.deepEqual(step4, new Position(4, 1));
    });
  
    it('Should generate correct path (complex)', () => {
      const mine = [
        [1, 3, 7, 0, 8, 2],
        [6, 0, 4, 3, 0, 8],
        [2, 7, 1, 0, 9, 4],
        [8, 3, 8, 6, 1, 0],
        [0, 5, 7, 0, 9, 3],
        [7, 1, 3, 0, 2, 6]
      ];
  
      const pathfinder = new PathFinder(mine);
  
      let position = pathfinder.getStartPosition();
      let moves = [position];
  
      while (position.x < mine[0].length - 1) {
        position = pathfinder.moveNextPosition(position);
        moves.push(position);
      }
  
      assert.deepEqual(moves, [
        new Position(0, 3),
        new Position(1, 2),
        new Position(2, 3),
        new Position(3, 3),
        new Position(4, 2),
        new Position(5, 2)
      ]);
    });
  
    it('Should not move in same direction twice', () => {
      const mine = [
        [1, 9, 9, 9, 1],
        [9, 1, 1, 1, 9]
      ];
  
      const pathfinder = new PathFinder(mine);
      let position = new Position(1, 0);
      position = pathfinder.moveNextPosition(position); // move to y = 0, previous y mod = +0
      position = pathfinder.moveNextPosition(position); // move to y = 1 even though best gold is at y = 0
      assert.notEqual(position.y, 0);
    });
  });
});