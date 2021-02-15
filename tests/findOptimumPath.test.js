import * as assert from "assert";
import Position from '../src/position';
import findOptimumPath from "../src/findOptimumPath";
import move from '../src/move'
import MinerPath from '../src/MinerPath';

const positionToString = (p) => `(${p.x}, ${p.y})`;

const run = async (mine) => {
    let gold = 0;
    let position = await move(mine);
    while (position.x < mine[0].length - 1 && position.isValid(mine)) {
        position = await move(mine, position);
    
        if (!position.isValid(mine) || mine[position.y][position.x] === 0) break;
    
        gold += mine[position.y][position.x];
      }
    return gold;
};

const buildDeepestMine = () => {
    let deepestMine = [];
    for (let i = 0; i < 1000; ++i) {
        deepestMine.push((new Array(1000)).fill(1));
    }
    return deepestMine;
};

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
                new Position(4, 4),
                new Position(3, 4),
                new Position(2, 3),
                new Position(1, 3),
                new Position(0, 2)
            ],
            24
        );
        const foundPath = await findOptimumPath(mine, startPosition);
        assert.deepStrictEqual(foundPath.pathPositions, expectedOptimumPath.pathPositions, `expected path positions: ${expectedOptimumPath.pathPositions.map(positionToString)} \n but instead resolved the following path: ${foundPath.pathPositions.map(positionToString)}`);
        assert.strictEqual(foundPath.goldFromPath, expectedOptimumPath.goldFromPath, `expected ${expectedOptimumPath.goldFromPath} amount of gold from path, but got ${foundPath.goldFromPath} amount of gold instead`)
    });
    it('should obtain 62 gold from Luna Mine when starting at position (0,0', async () => {
        const lunaMine = require('../mines/luna').default;
        const position = new Position(0, 0);
        const gold =( await findOptimumPath(lunaMine, position)).goldFromPath;
        assert.strictEqual(gold, 62, `expected 62 gold from Luna Mine, but got ${gold}`);    
    });
    it('should complete its computation through the Luna mine within reasonable time of 5 seconds', async () => {
        const lunaMine = require('../mines/luna').default;
        const position = new Position(0, 0);
        const reasonableTimeSeconds = 5;
        const startTimeMs = Date.now();
        await run(lunaMine, position);
        const endTimeMs = Date.now();
        const durationSeconds = (endTimeMs - startTimeMs) / 1000;
        assert.ok(durationSeconds < reasonableTimeSeconds, `algorithm did not complete processing the Luna Mine within reasonable time of ${reasonableTimeSeconds} seconds (took ${durationSeconds} seconds)`);
    });
    it('should complete its computation through the Mars mine within reasonable time of 5 seconds', async () => {
        const marsMine = require('../mines/mars').default;
        const reasonableTimeSeconds = 10;
        const startTimeMs = Date.now();
        await run(marsMine);
        const endTimeMs = Date.now();
        const durationSeconds = (endTimeMs - startTimeMs) / 1000;
        assert.ok(durationSeconds < reasonableTimeSeconds, `algorithm did not complete processing the Mars Mine within reasonable time of ${reasonableTimeSeconds} seconds (took ${durationSeconds} seconds)`);
    });
    it('should complete its computation through the Jupiter mine within reasonable time of 5 seconds', async () => {
        const jupiterMine = require('../mines/jupiter').default;
        const reasonableTimeSeconds = 50;
        const startTimeMs = Date.now();
        await run(jupiterMine);
        const endTimeMs = Date.now();
        const durationSeconds = (endTimeMs - startTimeMs) / 1000;
        assert.ok(durationSeconds < reasonableTimeSeconds, `algorithm did not complete processing the Jupiter Mine within reasonable time of ${reasonableTimeSeconds} seconds (took ${durationSeconds} seconds)`);
    });
    it('should complete computation of stress test mine', async () => {
        const deepestMine = buildDeepestMine();
        const reasonableTimeSeconds = 50;
        const startTimeMs = Date.now();
        await run(deepestMine);
        const endTimeMs = Date.now();
        const durationSeconds = (endTimeMs - startTimeMs) / 1000;
        assert.ok(durationSeconds < reasonableTimeSeconds, `algorithm did not complete processing the Stress Mine within reasonable time of ${reasonableTimeSeconds} seconds (took ${durationSeconds} seconds)`);
    });
});