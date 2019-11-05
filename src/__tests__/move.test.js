import move from '../move';
import Position from '../position';

const MINES = [[1, 0, 2],
        [6, 9, 8],
        [5, 6, 4]];
describe('move tests', () => {
    it('moves to correct mine', () => {
        expect(move(MINES, new Position(1,1))).toEqual(new Position(2,1));
    });

    it('moves to correct mine - undefined position', () => {
        expect(move(MINES, undefined)).toEqual(new Position(0,1));
    });

    it('moves to correct mine - (0,0)', () => {
        expect(move(MINES, new Position(0,0))).toEqual(new Position(1,1));
    });
});