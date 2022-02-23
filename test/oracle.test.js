import MineOracle from "../src/oracle";
import Position from "../src/position";
import {NONE,UP,DOWN,MID} from "../src/oracleMoves";
const assert = require('assert');

let mines = {
    "alef":[
        [4,5,6], //
        [1,0,1],
        [9,3,2]
    ],
    "bet":[
        [1,2, 3, 4],
        [5,6, 7, 8],
        [9,10,11,12]
    ]
};

let crunchedMines = {
    "alef":[
        [{"down":4,"mid":10,"up":4},{"down":6,"mid":11,"up":5},{"down":6,"mid":6,"up":6}],
        [{"down":6,"mid":1,"up":12},{"down":0,"mid":0,"up":0},{"down":1,"mid":1,"up":1}],
        [{"down":9,"mid":13,"up":9},{"down":3,"mid":5,"up":4},{"down":2,"mid":2,"up":2}],
    ],
    "bet":[
        [{"down":26,"mid":18,"up":1},{"down":17,"mid":13,"up":2},{"down":11,"mid":7,"up":3},{"down":4,"mid":4,"up":4}],
        [{"down":34,"mid":34,"up":22},{"down":29,"mid":25,"up":17},{"down":19,"mid":15,"up":11},{"down":8,"mid":8,"up":8}],
        [{"down":9,"mid":38,"up":38},{"down":10,"mid":29,"up":29},{"down":11,"mid":23,"up":19},{"down":12,"mid":12,"up":12}],
    ]
}

describe("MineOracle", () => {
    describe("safeMine", () => {
        let oracle;
        beforeEach( ( cb ) => {
            oracle = new MineOracle(mines.alef);
            return cb(null);
        })

        it("Returns the value on a valid space", () => {
            assert.deepStrictEqual(oracle.safeMine(2,1),mines.alef[2][1])
        })

        it("Returns 0 for an invalid column", () => {
            assert.deepStrictEqual(oracle.safeMine(10,2),0)
            
        })

        it("Returns 0 for an invalid row", () => {
            assert.deepStrictEqual(oracle.safeMine(3,99),0)    
        })

        it("Works for this????", ( ) => {
            assert.deepStrictEqual(oracle.safeMine(2,2),mines.alef[2][2])
        })
    })

    describe("getUp", () => {
        let betOracle;
        before( ( cb ) => {
            betOracle = new MineOracle(mines.bet);
            return cb(null);
        })

        it("Returns the highest possible total from the up move", () => {
            const x = 0;
            const y = 1;
            assert.deepStrictEqual( betOracle.getUp(y,x), crunchedMines.bet[y][x].up );

        })

        it("Deals with being at the edge of the mine", () => {
            const x = 0;
            const y = mines.bet.length-1;
            assert.deepStrictEqual( betOracle.getUp(y,x), crunchedMines.bet[y][x].up );
        })

        it("Deals with being at the top edge of the mine", () => {
            const x = 1;
            const y = 0;
            assert.deepStrictEqual( betOracle.getUp(y,x), crunchedMines.bet[y][x].up );
        })
    })

    describe("getMid", () => {
        let betOracle;
        before( ( cb ) => {
            betOracle = new MineOracle(mines.bet);
            return cb(null);
        })

        it("Returns the highest possible total from the mid move", () => {
            const x = 0;
            const y = 1;
            assert.deepStrictEqual( betOracle.getMid(y,x), crunchedMines.bet[y][x].mid );

        })

        it("Deals with being at the edge of the mine", () => {
            const x = 0;
            const y = mines.bet.length-1;
            assert.deepStrictEqual( betOracle.getMid(y,x), crunchedMines.bet[y][x].mid );
        })

        it("Deals with being at the top edge of the mine", () => {
            const x = 1;
            const y = 0;
            assert.deepStrictEqual( betOracle.getMid(y,x), crunchedMines.bet[y][x].mid );
        })
    })

    describe("getDown", () => {
        let betOracle;
        before( ( cb ) => {
            betOracle = new MineOracle(mines.bet);
            return cb(null);
        })

        it("Returns the highest possible total from the down move", () => {
            const x = 0;
            const y = 1;
            assert.deepStrictEqual( betOracle.getDown(y,x), crunchedMines.bet[y][x].down );

        })

        it("Deals with being at the edge of the mine", () => {
            const x = 0;
            const y = mines.bet.length-1;
            assert.deepStrictEqual( betOracle.getDown(y,x), crunchedMines.bet[y][x].down );
        })

        it("Deals with being at the bottom edge of the mine", () => {
            const x = 1;
            const y = 0;
            assert.deepStrictEqual( betOracle.getDown(y,x), crunchedMines.bet[y][x].down );
        })
    })

    describe("crunchMine", () => {
        let oracle;
        before( ( cb ) => {
            oracle = new MineOracle(mines.alef);
            return cb(null);
        })

        it("Crunches alef the way I expect", () => {
            let oracleAlef = new MineOracle(mines.alef);
            assert.deepStrictEqual(oracleAlef.crunchedMine,crunchedMines.alef)
        })

        it("Crunches bet the way I expect", () => {
            let oracleBet = new MineOracle(mines.bet);
            assert.deepStrictEqual(oracleBet.crunchedMine,crunchedMines.bet)
        })
    })

    describe("getStartingStep", () => {
        it("Gets the right step for alef", () => {
            let oracle = new MineOracle(mines.alef)
            let expectedPosition = new Position(0,2)
            let startingPosition = oracle.getStartingStep();
            assert.deepStrictEqual(startingPosition.x,expectedPosition.x)
            assert.deepStrictEqual(startingPosition.y,expectedPosition.y)
        })

        it("Gets the right step for bet", () => {
            let oracle = new MineOracle(mines.bet)
            let expectedPosition = new Position(0,2)
            let startingPosition = oracle.getStartingStep();
            assert.deepStrictEqual(startingPosition.x,expectedPosition.x)
            assert.deepStrictEqual(startingPosition.y,expectedPosition.y)
        })
    })

    describe.only("getNextStep", () => {
        let oracle = new MineOracle(mines.bet)
        it("Returns the first step when given no position", () => {
            let expectedPosition = new Position(0,2)
            let returnedPosition = oracle.getNextStep();
            assert.deepStrictEqual(returnedPosition.x,expectedPosition.x)
            assert.deepStrictEqual(returnedPosition.y,expectedPosition.y)
        })

        it("Doesn't take into account directionality for the first step", () => {
            oracle.lastMove = NONE;
            let currentPosition = new Position(0,1);
            let expectedPosition = new Position(1,1)
            let returnedPosition = oracle.getNextStep(currentPosition);
            assert.deepStrictEqual(returnedPosition.x,expectedPosition.x)
            assert.deepStrictEqual(returnedPosition.y,expectedPosition.y)
        })

        it("Won't go up if up was the last move", () => {
            oracle.lastMove = UP;
            let currentPosition = new Position(1,2);
            let expectedPosition = new Position(2,2)
            let returnedPosition = oracle.getNextStep(currentPosition);
            assert.deepStrictEqual(returnedPosition.x,expectedPosition.x)
            assert.deepStrictEqual(returnedPosition.y,expectedPosition.y)
        })

        it("Won't go mid if mid was the last move", () => {
            oracle.lastMove = MID;
            let currentPosition = new Position(0,1);
            let expectedPosition = new Position(1,2)
            let returnedPosition = oracle.getNextStep(currentPosition);
            assert.deepStrictEqual(returnedPosition.x,expectedPosition.x)
            assert.deepStrictEqual(returnedPosition.y,expectedPosition.y)
        })

        it("Won't go down if down was the last move", () => {
            oracle.lastMove = DOWN;
            let currentPosition = new Position(1,1);
            let expectedPosition = new Position(2,1)
            let returnedPosition = oracle.getNextStep(currentPosition);
            assert.deepStrictEqual(returnedPosition.x,expectedPosition.x)
            assert.deepStrictEqual(returnedPosition.y,expectedPosition.y)
        })
    })
});
