
import { getNewDirection, isPositionOnBoard, getInitialPosition } from '../movehelper';
import Position from '../position';

const MINES = [[1, 0, 2],
        [6, 9, 8],
        [5, 6, 0]];

describe('movevalidator tests' , () => {
    it('validates position - same direction', () => {
        expect(isPositionOnBoard(MINES, new Position(0,0), 1, 1)).toBeFalsy();
    });

    it('validates position - out of bounds', () => {
        expect(isPositionOnBoard(MINES, new Position(0,2), 1, 0)).toBeFalsy();
    });

    it('validates position - out of bounds negative', () => {
        expect(isPositionOnBoard(MINES, new Position(0,0), -1, 1)).toBeFalsy();
    });

    it('validates position - mine is 0', () => {
        expect(isPositionOnBoard(MINES, new Position(0,0), 0, 1)).toBeTruthy();
    });

    it('validates valid position', () => {
        expect(isPositionOnBoard(MINES, new Position(0,1), 1, -1)).toBeTruthy();
    });

    it('gets new direction', () => {
        expect(getNewDirection(MINES, new Position(0,0), 0)).toBe(1);
    });

    it('gets new direction - undefined previous direction', () => {
        expect(getNewDirection(MINES, new Position(0,0), undefined)).toBe(1);
    });

    it('gets new direction - only option 0 value', () => {
        expect(getNewDirection(MINES, new Position(2,1), -1)).toEqual(0);
    });

    it('gets initial position', () => {
        expect(getInitialPosition(MINES)).toBe(1);
    })

    it('gets initial position - multiple instances', () => {
        expect(getInitialPosition(MINES.concat(MINES))).toBe(1);
    });
    
});