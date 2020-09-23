import {
  dp_tracking,
  mining,
  generateTrackingOnFirstRun,
  getNextMove,
} from "../src/solution.js";
import Position from "../src/position.js";

const mine_stub = [
  [0, 1, 9],
  [3, 5, 2],
  [4, 1, 6],
  [3, 3, 0],
];

describe("solution", () => {
  describe("mining", () => {
    beforeEach(() => {
      dp_tracking.currentMine = mine_stub;
      dp_tracking.tracking = [];
    });

    test("return 0 when column index is negative", () => {
      let result = mining(-1, 0, 1);

      expect(result).toBe(0);
    });

    test("return 0 when column index is out of range", () => {
      let result = mining(dp_tracking.currentMine[0].length, 0, 1);

      expect(result).toBe(0);
    });

    test("return 0 when row index is negative", () => {
      let result = mining(0, -1, 1);

      expect(result).toBe(0);
    });

    test("return 0 when row index is out of range", () => {
      let result = mining(0, dp_tracking.currentMine.length, 1);

      expect(result).toBe(0);
    });

    test("return 0 when the gold located at the current position is 0", () => {
      let result1 = mining(0, 0, 1);
      let result2 = mining(2, 3, 1);

      expect(result1).toBe(0);
      expect(result2).toBe(0);
    });

    test("return the gold amount of the position when it is in the last column", () => {
      const last_column = dp_tracking.currentMine[0].length - 1;
      const row = 0;
      let result = mining(last_column, row, 1);

      expect(result).toBe(dp_tracking.currentMine[row][last_column]);
    });

    test("return the best gold amount and update tracking with 2 valid moves", () => {
      const row = 1;
      const col = 1;
      const previousMove = 1;
      let result = mining(col, row, previousMove);

      expect(result).toBe(14);
      expect(dp_tracking.tracking[row][col][previousMove]).toEqual(
        expect.objectContaining({
          bestMove: 0,
          bestMine: 9,
          moves: [9, undefined, 6],
        })
      );
    });

    test("return the best gold amount and update tracking with 3 valid moves(first column)", () => {
      const row = 1;
      const col = 0;
      const previousMove = 4;
      let result = mining(col, row, previousMove);

      expect(result).toBe(17);
      expect(dp_tracking.tracking[row][col][previousMove]).toEqual(
        expect.objectContaining({
          bestMove: 1,
          bestMine: 14,
          moves: [10, 14, 7],
        })
      );
    });
  });

  describe("generateTrackingOnFirstRun", () => {
    test("do not generate a new tracking when the mine is the same", () => {
      const mine_string = JSON.stringify(mine_stub);
      const tracking = [1, 2, 3];
      dp_tracking.currentMine = mine_string;
      dp_tracking.tracking = tracking;

      generateTrackingOnFirstRun(mine_stub);

      expect(dp_tracking.tracking).toEqual(tracking);
      expect(dp_tracking.currentMine).toEqual(mine_string);
    });

    test("generate a new tracking when the mine is different from currentMine", () => {
      const mine_string = JSON.stringify(mine_stub);
      dp_tracking.currentMine = "";
      dp_tracking.tracking = [1, 2, 3];

      generateTrackingOnFirstRun(mine_stub);

      expect(dp_tracking.currentMine).toEqual(mine_string);
      expect(dp_tracking.bestStartRow).toEqual(1);
      expect(dp_tracking.tracking).toEqual([
        [
          undefined,
          [
            {
              bestMine: 9,
              bestMove: 1,
              moves: [undefined, 9, 2],
            },
          ],
          [
            {
              bestMine: 0,
              bestMove: 1,
              moves: [0, 0, 0],
            },
            {
              bestMine: 0,
              bestMove: 0,
              moves: [0, undefined, 0],
            },
          ],
        ],
        [
          [
            undefined,
            undefined,
            undefined,
            {
              bestMine: 14,
              bestMove: 1,
              moves: [10, 14, 7],
            },
          ],
          [
            {
              bestMine: 6,
              bestMove: 2,
              moves: [9, 2, 6],
            },
            {
              bestMine: 9,
              bestMove: 0,
              moves: [9, undefined, 6],
            },
          ],
          [
            {
              bestMine: 0,
              bestMove: 1,
              moves: [0, 0, 0],
            },
            {
              bestMine: 0,
              bestMove: 0,
              moves: [0, 0, 0],
            },
            {
              bestMine: 0,
              bestMove: 0,
              moves: [0, 0],
            },
          ],
        ],
        [
          [
            undefined,
            undefined,
            undefined,
            {
              bestMine: 11,
              bestMove: 0,
              moves: [11, 3, 9],
            },
          ],
          [
            {
              bestMine: 6,
              bestMove: 1,
              moves: [2, 6, 0],
            },
            {
              bestMine: 2,
              bestMove: 0,
              moves: [2, 6, 0],
            },
            {
              bestMine: 6,
              bestMove: 1,
              moves: [2, 6],
            },
          ],
          [
            {
              bestMine: 0,
              bestMove: 1,
              moves: [0, 0, 0],
            },
            {
              bestMine: 0,
              bestMove: 0,
              moves: [0, 0, 0],
            },
            {
              bestMine: 0,
              bestMove: 0,
              moves: [0, 0],
            },
          ],
        ],
        [
          [
            undefined,
            undefined,
            undefined,
            {
              bestMine: 9,
              bestMove: 1,
              moves: [7, 9, 0],
            },
          ],
          [
            undefined,
            {
              bestMine: 6,
              bestMove: 0,
              moves: [6, 0, 0],
            },
            {
              bestMine: 6,
              bestMove: 0,
              moves: [6, 0],
            },
          ],
        ],
      ]);
    });
  });

  describe("getNextMove", () => {
    test("return a new position at `bestStartRow` in the first column when the current position is undefined", () => {
      dp_tracking.bestStartRow = 3;

      let position = getNextMove(undefined);

      expect(position.x).toEqual(0);
      expect(position.y).toEqual(dp_tracking.bestStartRow);
    });

    test("return a new position according to the bestMove", () => {
      dp_tracking.tracking = [
        [[{ bestMove: 2 }]],
        [
          [
            {
              bestMove: 1,
            },
          ],
          [{ bestMove: 0 }],
        ],
        [],
      ];

      dp_tracking.previousMove = 0;
      let position1 = getNextMove(new Position(0, 1));
      // Go right
      expect(position1.x).toEqual(1);
      expect(position1.y).toEqual(1);
      expect(dp_tracking.previousMove).toEqual(1);

      dp_tracking.previousMove = 0;
      let position2 = getNextMove(new Position(0, 0));
      // Go diagonally right and down
      expect(position2.x).toEqual(1);
      expect(position2.y).toEqual(1);
      expect(dp_tracking.previousMove).toEqual(2);

      dp_tracking.previousMove = 0;
      let position3 = getNextMove(new Position(1, 1));
      // Go diagonally right and up
      expect(position3.x).toEqual(2);
      expect(position3.y).toEqual(0);
      expect(dp_tracking.previousMove).toEqual(0);
    });
  });
});
