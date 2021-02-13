import * as assert from "assert";
import Position from '../src/position';
import {findOptimumPath, Moves} from '../src/move'
import MinerPath from '../src/MinerPath';

const positionToString = (p) => `(${p.x}, ${p.y})`;

describe('Optimum path algorithm', () => {
    it('should find expected optimum path through 5x5 mine matrix, given an initial position of (0, 2)', async () => {
        const mine = [
            [4, 7, 1, 5, 4],
            [8, 8, 2, 4, 8],
            [0, 1, 3, 0, 4],
            [9, 1, 7, 2, 3],
            [5, 3, 0, 9, 7]
        ];
        const startPosition = new Position(0, 2);
        const expectedOptimumPath = new MinerPath(
            [
                new Position(0, 2),
                new Position(1, 3),
                new Position(2, 3),
                new Position(3, 4),
                new Position(4, 4)
            ],
            24
        );
        const foundPath = await findOptimumPath(mine, startPosition);
        assert.deepStrictEqual(foundPath.pathPositions, expectedOptimumPath.pathPositions, `expected path positions: ${expectedOptimumPath.pathPositions.map(positionToString)} \n but instead resolved the following path: ${foundPath.pathPositions.map(positionToString)}`);
        assert.strictEqual(foundPath.goldFromPath, expectedOptimumPath.goldFromPath, `expected ${expectedOptimumPath.goldFromPath} amount of gold from path, but got ${foundPath.goldFromPath} amount of gold instead`)
    });
    it('should complete its computation through the luna mine within reasonable time of 5 seconds', async () => {
        const lunaMine = require('../mines/luna').default;
        const randomY = Math.random() * (lunaMine.length);
        const position = new Position(0, Math.floor(randomY));
        const reasonableTimeSeconds = 5;
        const startTimeMs = Date.now();
        await findOptimumPath(lunaMine, position);
        const endTimeMs = Date.now();
        assert.ok((endTimeMs - startTimeMs) < (1000 * reasonableTimeSeconds), `algorithm did not complete processing the Luna Mine within reasonable time of ${reasonableTimeSeconds} seconds`);
    });
    it('should complete its computation through the mars mine within reasonable time of 5 seconds', async () => {
        const marsMine = require('../mines/mars').default;
        const randomY = Math.random() * (marsMine.length);
        const position = new Position(0, Math.floor(randomY));
        const reasonableTimeSeconds = 5;
        const startTimeMs = Date.now();
        await findOptimumPath(marsMine, position);
        const endTimeMs = Date.now();
        assert.ok((endTimeMs - startTimeMs) < (1000 * reasonableTimeSeconds), `algorithm did not complete processing the Mars Mine within reasonable time of ${reasonableTimeSeconds} seconds`);
    });
});