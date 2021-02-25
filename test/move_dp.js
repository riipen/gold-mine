var assert = require('assert');
import Position from "../src/position.js";
let { getNextMove, solveMine, getBestScore } = require("../src/move_dp.js");

describe('Move DP', function () {

    const mineOne = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];
    const mineTwo = [
        [1, 5, 8, 3],
        [1, 6, 3, 8],
        [2, 8, 9, 4],
        [2, 6, 4, 4]
    ];
    const mineThree = [
        [1, 5, 0, 3],
        [1, 6, 0, 8],
        [2, 8, 0, 4],
        [2, 6, 0, 4]
    ];

    describe('Get next move', function () {

        it('Calling a series of getNextMove starting at the beginning should return the best next move all the time. (mineOne)', function () {
            assert.deepStrictEqual(getNextMove(mineOne, undefined), new Position(0, 1));
            assert.deepStrictEqual(getNextMove(mineOne, new Position(0, 1)), new Position(1, 2));
            assert.deepStrictEqual(getNextMove(mineOne, new Position(1, 2)), new Position(2, 2));
        });

        it('Calling a series of getNextMove starting at the beginning should return the best next move all the time. (mineTwo)', function () {
            assert.deepStrictEqual(getNextMove(mineTwo, undefined), new Position(0, 3));
            assert.deepStrictEqual(getNextMove(mineTwo, new Position(0, 3)), new Position(1, 2));
            assert.deepStrictEqual(getNextMove(mineTwo, new Position(1, 2)), new Position(2, 2));
            assert.deepStrictEqual(getNextMove(mineTwo, new Position(2, 2)), new Position(3, 1));
        });

        it('Calling a series of getNextMove starting at the beginning should return the best next move all the time. (mineThree)', function () {
            assert.deepStrictEqual(getNextMove(mineThree, undefined), new Position(0, 2));
            assert.deepStrictEqual(getNextMove(mineThree, new Position(0, 2)), new Position(1, 2));
            assert.deepStrictEqual(getNextMove(mineThree, new Position(1, 2)), new Position(2, 1));
        });

    });

    describe('Solve mine', function () {

        it('Solving mineOne should return the expected score grid', function () {
            const expectedScore = [
                [12, 8, 3],
                [21, 14, 6],
                [21, 17, 9]
            ]

            let dp = solveMine(mineOne);
            let dpScoreGrid = dp.map((row) => {
                return row.map((cell) => {
                    return cell.currentScore;
                });
            });

            assert.deepStrictEqual(dpScoreGrid, expectedScore);
        });

        it('Solving mineTwo should return the expected score grid', function () {
            const expectedScore = [
                [23, 21, 16, 3],
                [26, 23, 11, 8],
                [25, 25, 17, 4],
                [27, 19, 8, 4]
            ]

            let dp = solveMine(mineTwo);
            let dpScoreGrid = dp.map((row) => {
                return row.map((cell) => {
                    return cell.currentScore;
                });
            });

            assert.deepStrictEqual(dpScoreGrid, expectedScore);
        });

        it('Solving mineThree should return the expected score grid', function () {
            const expectedScore = [
                [7, 5, 0, 3],
                [9, 6, 0, 8],
                [10, 8, 0, 4],
                [10, 6, 0, 4]
            ]

            let dp = solveMine(mineThree);
            let dpScoreGrid = dp.map((row) => {
                return row.map((cell) => {
                    return cell.currentScore;
                });
            });

            assert.deepStrictEqual(dpScoreGrid, expectedScore);
        });

    });

    describe('Get best score', function () {

        it('Best score should correctly be calculated using the previous move. (mineOne)', function () {
            let dp = solveMine(mineOne);
            assert.strictEqual(getBestScore(mineOne, dp, 0, 0, null), 12);
            assert.strictEqual(getBestScore(mineOne, dp, 0, 1, null), 21);
            assert.strictEqual(getBestScore(mineOne, dp, 0, 2, null), 21);

            assert.strictEqual(getBestScore(mineOne, dp, 0, 0, 0), 12);
            assert.strictEqual(getBestScore(mineOne, dp, 0, 1, 0), 21);
            assert.strictEqual(getBestScore(mineOne, dp, 0, 2, 0), 21);

            assert.strictEqual(getBestScore(mineOne, dp, 0, 0, 1), 12);
            assert.strictEqual(getBestScore(mineOne, dp, 0, 1, 1), 21);
            assert.strictEqual(getBestScore(mineOne, dp, 0, 2, 1), 21);

            assert.strictEqual(getBestScore(mineOne, dp, 0, 0, 2), 9);
            assert.strictEqual(getBestScore(mineOne, dp, 0, 1, 2), 18);
            assert.strictEqual(getBestScore(mineOne, dp, 0, 2, 2), 21);
        });

        it('Best score should correctly be calculated using the previous move. (mineTwo)', function () {
            let dp = solveMine(mineTwo);
            assert.strictEqual(getBestScore(mineTwo, dp, 0, 0, null), 23);
            assert.strictEqual(getBestScore(mineTwo, dp, 0, 1, null), 26);
            assert.strictEqual(getBestScore(mineTwo, dp, 0, 2, null), 25);
            assert.strictEqual(getBestScore(mineTwo, dp, 0, 3, null), 27);

            assert.strictEqual(getBestScore(mineTwo, dp, 0, 0, 0), 23);
            assert.strictEqual(getBestScore(mineTwo, dp, 0, 1, 0), 26);
            assert.strictEqual(getBestScore(mineTwo, dp, 0, 2, 0), 21);
            assert.strictEqual(getBestScore(mineTwo, dp, 0, 3, 0), 21);

            assert.strictEqual(getBestScore(mineTwo, dp, 0, 0, 1), 23);
            assert.strictEqual(getBestScore(mineTwo, dp, 0, 1, 1), 26);
            assert.strictEqual(getBestScore(mineTwo, dp, 0, 2, 1), 25);
            assert.strictEqual(getBestScore(mineTwo, dp, 0, 3, 1), 27);

            assert.strictEqual(getBestScore(mineTwo, dp, 0, 0, 2), 17);
            assert.strictEqual(getBestScore(mineTwo, dp, 0, 1, 2), 24);
            assert.strictEqual(getBestScore(mineTwo, dp, 0, 2, 2), 25);
            assert.strictEqual(getBestScore(mineTwo, dp, 0, 3, 2), 27);
        });

        it('Best score should correctly be calculated using the previous move. (mineThree)', function () {
            let dp = solveMine(mineThree);
            assert.strictEqual(getBestScore(mineThree, dp, 0, 0, null), 7);
            assert.strictEqual(getBestScore(mineThree, dp, 0, 1, null), 9);
            assert.strictEqual(getBestScore(mineThree, dp, 0, 2, null), 10);
            assert.strictEqual(getBestScore(mineThree, dp, 0, 3, null), 10);

            assert.strictEqual(getBestScore(mineThree, dp, 0, 0, 0), 7);
            assert.strictEqual(getBestScore(mineThree, dp, 0, 1, 0), 9);
            assert.strictEqual(getBestScore(mineThree, dp, 0, 2, 0), 10);
            assert.strictEqual(getBestScore(mineThree, dp, 0, 3, 0), 8);

            assert.strictEqual(getBestScore(mineThree, dp, 0, 0, 1), 7);
            assert.strictEqual(getBestScore(mineThree, dp, 0, 1, 1), 9);
            assert.strictEqual(getBestScore(mineThree, dp, 0, 2, 1), 8);
            assert.strictEqual(getBestScore(mineThree, dp, 0, 3, 1), 10);

            assert.strictEqual(getBestScore(mineThree, dp, 0, 0, 2), 6);
            assert.strictEqual(getBestScore(mineThree, dp, 0, 1, 2), 7);
            assert.strictEqual(getBestScore(mineThree, dp, 0, 2, 2), 10);
            assert.strictEqual(getBestScore(mineThree, dp, 0, 3, 2), 10);
        });

    });

});