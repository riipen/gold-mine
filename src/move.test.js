import * as helper from "./helper.js";
import move from "./move.js";
import Position from "./position.js";

describe('move suite case', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when call move and the miner is not in the mine yet', () => {
    it('calls the getFirstPostion, updates the firstMove to false and returns the new position', () => {
      const getFirstPositionSpy = jest.spyOn(helper, 'getFirstPosition');
      const multArr = [
        [6, 3, 0, 2],
        [8, 8, 9, 3],
        [9, 0, 9, 9],
        [1, 0, 8, 5],
      ];

      const newPosition = move(multArr, undefined);

      expect(newPosition.y).toEqual(2);
      expect(newPosition.x).toEqual(0);
      expect(getFirstPositionSpy).toHaveBeenCalled();
      expect(global.firstMove).toEqual(false);
    });
  });

  describe('when call move and is the first move of the miner', () => {
    it('calls the getNextPosition, add the move that was did and returns the new position', () => {
      const getNextPositionSpy = jest.spyOn(helper, 'getNextPosition');
      global.firstMove = false;
      const multArr = [
        [6, 3, 0, 2],
        [8, 8, 9, 3],
        [9, 0, 9, 9],
        [1, 0, 8, 5],
      ];

      const newPosition = move(multArr, new Position(0,2));

      expect(newPosition.y).toEqual(1);
      expect(newPosition.x).toEqual(1);
      expect(getNextPositionSpy).toHaveBeenCalled();
    });
  });

  describe('when call move and the miner is in some position in mine', () => {
    it('calls the getNextPosition, add the move that was did and returns the new position', () => {
      const getNextPositionSpy = jest.spyOn(helper, 'getNextPosition');
      global.firstMove = false;
      global.lastMove = helper.RIGHT_UP;
      const multArr = [
        [6, 3, 9, 2],
        [8, 8, 8, 3],
        [9, 0, 7, 9],
        [1, 0, 8, 5],
      ];

      const newPosition = move(multArr, new Position(1,1));

      expect(newPosition.y).toEqual(1);
      expect(newPosition.x).toEqual(2);
      expect(getNextPositionSpy).toHaveBeenCalled();
    });
  });
});