import Position from "./position";
import { NONE,UP,DOWN,MID } from "./oracleMoves";
// the main idea here is that we don't rely on just the info the miner might have
// we have access to the full mine data, we should use it

class MineOracle {
    constructor(mine){
        this.mine = mine;
        this.optimalPath = [];
        this.crunchedMine = [];
        this.lastMove = NONE;
        this.crunchMine(mine);
    }

    /**
     * Let's me check the mine without worrying about if the location is valid or not, basically. 0 if out of bounds
     * or 0, and then the value if it's got a value.
     * 
     * This is reasonable, since we act the same way on 0 as we do as out of bounds. If that changes, so should this.
     */
    safeMine(y,x){
        return new Position(x,y).isValid(this.mine) ? this.mine[y][x] : 0;
    }

    /**
     * Processes the mine into a crunchedMine. This is sort of the meat of the solution.
     * Basically, don't know what the best we can get from the mine is going forward; something that looks really
     * good, like a zig zag of 9s, might lock us into a bad spot down the line. But that same zig zag of 9s at the
     * _end_ can't do that. 
     * So we go through it backwards, keeping track of the highest potential endpoints instead of the highest potential start
     * points. With that info, we can basically signpost where the highest value is earlier in the mine, all the way to the 'entrance.'
     * @param {array} mine 
     */
    crunchMine(mine) {
        for(let y = mine.length-1; y>=0;y--){
            this.crunchedMine[y] = [];
        }

        for(let x = mine[0].length-1; x >= 0; x--){
            for(let y = mine.length-1; y >= 0; y--){
                this.crunchedMine[y][x] = this.getExpectedValuesForPosition(y,x)
            }
        }
    }

    /**
     * The object has three keys corresponding to the moves you can make, the contents of which
     * tell you the best value you can get from this position if you take that move.
     * Honestly, they should probably be the enums defined in the oracleMoves file.
     * 
     * @param {*} y 
     * @param {*} x 
     * @returns 
     */
    getExpectedValuesForPosition(y,x){
        const expectedValues = {};
        if (this.safeMine(y,x)){
            expectedValues.down = this.getDown(y,x);
            expectedValues.mid = this.getMid(y,x);
            expectedValues.up = this.getUp(y,x);
        } else {
            expectedValues.down = 0;
            expectedValues.mid = 0;
            expectedValues.up = 0;
        }
        return expectedValues;
    }

    /**
     * getUp, getMid and getDown get the best results from the position assuming you make the move in the name
     * because we process the mine from back to front any position that is valid, we have crunched already
     * and any position that is invalid we can't crunch; it's outside the boundary of the mine
     */
    getUp(y,x){
        const up = new Position(x+1,y-1);

        return (up.isValid(this.mine) ? Math.max(this.crunchedMine[up.y][up.x].mid, this.crunchedMine[up.y][up.x].down ) : 0)
            + this.safeMine(y,x)
    }

    getMid(y,x){
        const mid = new Position(x+1,y);

        return (mid.isValid(this.mine) ? Math.max(this.crunchedMine[mid.y][mid.x].up, this.crunchedMine[mid.y][mid.x].down ) : 0)
            + this.safeMine(y,x)
    }

    getDown(y,x){
        const down = new Position(x+1,y+1);

        return (down.isValid(this.mine) ? Math.max(this.crunchedMine[down.y][down.x].mid, this.crunchedMine[down.y][down.x].up ) : 0)
            + this.safeMine(y,x)
    }

    /**
     * Returns the best starting position for the mine
     * 
     * @returns Position
     */
    getStartingStep(){
        let curMax = -1;
        let curY = 0;
        for( let i = 0;i < this.crunchedMine.length; i++){
            
            let pos = this.crunchedMine[i][0];
            let maxAtPos = Math.max(pos.up,pos.mid,pos.down)
            if( curMax < maxAtPos){
                curY = i;
                curMax = maxAtPos;
            }
        }

        return new Position(0,curY)
    }

    /**
     * Based on the crunching, returns the best move for the given position
     * Prefers arbitrarily to go to a lower y in the cases of ties.
     * Also keeps track of the last step to ensure it isn't returning an invalid
     * step
     * 
     * Will return the best starting position for the mine if given no position
     * 
     * @param Position position 
     * @returns Position
     */
    getNextStep(position) {
        if( typeof position === 'undefined' ){
            return this.getStartingStep();
        } else {
            let crunchedPosition = this.crunchedMine[position.y][position.x];
            let newX = position.x + 1;
            let newY;
            let thisMove = NONE;

            switch (this.lastMove){
                case NONE:
                    // assume up is the best
                    thisMove = UP;
                    if( crunchedPosition.up < crunchedPosition.mid ){
                        if ( crunchedPosition.mid < crunchedPosition.down ){
                            thisMove = DOWN;
                        } else {
                            thisMove = MID;
                        }
                    } else if ( crunchedPosition.up < crunchedPosition.down ){
                        thisMove = DOWN;
                    }

                    break;
                case UP:
                    if( crunchedPosition.down < crunchedPosition.mid ){
                        thisMove = MID;
                    } else {
                        thisMove = DOWN;
                    }
                    break;
                case MID:
                    if( crunchedPosition.down < crunchedPosition.up ){
                        thisMove = UP;
                    } else {
                        thisMove = DOWN;
                    }
                    break;
                case DOWN:
                    if( crunchedPosition.mid < crunchedPosition.up ){
                        thisMove = UP;
                    } else {
                        thisMove = MID;
                    }
                    break;
            }
            
            switch(thisMove){
                case UP:
                    newY = position.y - 1;
                    break;
                case MID:
                    newY = position.y;
                    break;
                case DOWN:
                    newY = position.y + 1;
                    break;
            }

            this.lastMove = thisMove;
            return new Position( newX, newY )
        }
    }
}

export default MineOracle;
