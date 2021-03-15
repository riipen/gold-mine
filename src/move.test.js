import move, { getFirstPosition, getNextPosition, positionIsSafe, RIGHT, RIGHT_UP, RIGHT_DOWN } from "./move.js";
import Position from "./position.js";

describe('move suite case', () => {
  describe('positionIsSafe suite case', () => {
    describe('when calls positionIsSafe with lastMove right up', () => {
      it('returns true if the next move down or next move right is not zero', () => {
        const multArr = [
          [6, 3, 0, 2],
          [8, 8, 9, 3],
          [9, 0, 4, 1],
          [1, 0, 8, 5],
        ];

        const position = new Position(1, 1);

        expect(positionIsSafe(multArr, position, 'rightUp')).toEqual(true);
      });
      it('returns false if the next move down or next move right is zero', () => {
        const multArr = [
          [6, 3, 0, 2],
          [8, 8, 0, 3],
          [9, 0, 0, 1],
          [1, 0, 8, 5],
        ];

        const position = new Position(1, 1);

        expect(positionIsSafe(multArr, position, 'rightUp')).toEqual(false);
      });
    });

    describe('when calls positionIsSafe with lastMove right down', () => {
      it('returns true if the next move up or next move right is not zero', () => {
        const multArr = [
          [6, 3, 0, 2],
          [8, 8, 9, 3],
          [9, 0, 4, 1],
          [1, 0, 8, 5],
        ];

        const position = new Position(1, 1);

        expect(positionIsSafe(multArr, position, 'rightUp')).toEqual(true);
      });
      it('returns false if the next move up or next move right is zero', () => {
        const multArr = [
          [6, 3, 0, 2],
          [8, 8, 0, 3],
          [9, 0, 0, 1],
          [1, 0, 8, 5],
        ];

        const position = new Position(1, 1);

        expect(positionIsSafe(multArr, position, 'rightDown')).toEqual(false);
      });
    });

    describe('when calls positionIsSafe with lastMove right', () => {
      it('returns true if the next move up or next move down is not zero', () => {
        const multArr = [
          [6, 3, 0, 2],
          [8, 8, 9, 3],
          [9, 0, 4, 1],
          [1, 0, 8, 5],
        ];

        const position = new Position(1, 1);

        expect(positionIsSafe(multArr, position, 'right')).toEqual(true);
      });
      it('returns false if the next move up or next move down is zero', () => {
        const multArr = [
          [6, 3, 0, 2],
          [8, 8, 0, 3],
          [9, 0, 0, 1],
          [1, 0, 8, 5],
        ];

        const position = new Position(1, 1);

        expect(positionIsSafe(multArr, position, 'right')).toEqual(false);
      });
    });

    describe('when calls positionIsSafe with lastMove empty', () => {
      it('returns true if the next move up or next move down or next move right is not zero', () => {
        const multArr = [
          [6, 3, 0, 2],
          [8, 8, 9, 3],
          [9, 0, 0, 1],
          [1, 0, 8, 5],
        ];

        const position = new Position(1, 1);

        expect(positionIsSafe(multArr, position, '')).toEqual(true);
      });
      it('returns false if the next move up or next move down or next move right is zero', () => {
        const multArr = [
          [6, 3, 0, 2],
          [8, 8, 0, 3],
          [9, 0, 0, 1],
          [1, 0, 8, 5],
        ];

        const position = new Position(1, 1);

        expect(positionIsSafe(multArr, position, '')).toEqual(false);
      });
    });
  });

  describe('getFirstPosition suite case', () => {
    describe('when calls getFirstPosition function of a multidimensional array', () => {
      it('returns position row that has more duplicate of the highest multidimensional array value', () => {
        const multArr = [
          [6, 3, 0, 2],
          [8, 8, 9, 3],
          [9, 0, 9, 9],
          [1, 0, 8, 5],
        ];

        const initialPosition = getFirstPosition(multArr);

        expect(initialPosition.y).toEqual(2);
      });

      it('returns the next position row that has more duplicate of the highest multidimensional array value while position safe is not found', () => {
        const multArr = [
          [6, 3, 0, 2],
          [8, 0, 9, 3],
          [9, 0, 9, 9],
          [1, 0, 8, 5],
        ];

        const initialPosition = getFirstPosition(multArr);

        expect(initialPosition.y).toEqual(1);
      });
    });
  });

  describe('getNextPosition suite case', () => {
    describe('when calls getNextPosition function with the current position', () => {
      it('returns next position and the move that is safe when is first move', () => {
        const multArr = [
          [6, 3, 0, 2],
          [8, 8, 9, 3],
          [9, 0, 9, 9],
          [1, 0, 8, 5],
        ];

        const { nextPosition, move } = getNextPosition(multArr, '', new Position(0,2));

        expect(nextPosition.y).toEqual(1);
        expect(nextPosition.x).toEqual(1);
        expect(move).toEqual(RIGHT_UP);
      });

      it('returns next position and the move that is safe when the last move is up', () => {
        const multArr = [
          [6, 3, 0, 2],
          [8, 8, 7, 3],
          [9, 0, 9, 9],
          [1, 0, 8, 5],
        ];

        const { nextPosition, move } = getNextPosition(multArr, RIGHT_UP, new Position(1,1));

        expect(nextPosition.y).toEqual(2);
        expect(nextPosition.x).toEqual(2);
        expect(move).toEqual(RIGHT_DOWN);
      });
    });
  });
});