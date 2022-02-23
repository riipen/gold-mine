import Position from "./position";

// the main idea here is that we don't rely on just the info the miner might have
// we have access to the full mine data, we should use it
const UP = Symbol("up");
const MID = Symbol("MID");
const DOWN = Symbol("DOWN");
const NONE = Symbol("NONE");

class MineOracle {
    constructor(mine){
        this.mine = mine;
        this.optimalPath = [];
        this.crunchedMine = [];
        this.lastMove = NONE;
        this.crunchMine(mine);
    }

    safeMine(y,x){
        return new Position(x,y).isValid(this.mine) ? this.mine[y][x] : 0;
    }

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
     * expected value means if you take x move here, what is the best result you can end up with?
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
                    newY = position.y - 1;
                    if( crunchedPosition.up < crunchedPosition.mid ){
                        if ( crunchedPosition.mid < crunchedPosition.down ){
                            thisMove = DOWN;
                            newY = position.y + 1;
                        } else {
                            thisMove = MID;
                            newY = position.y;
                        }
                    } else if ( crunchedPosition.up < crunchedPosition.down ){
                        thisMove = DOWN;
                        newY = position.y + 1;
                    }

                    break;
                case UP:
                    if( crunchedPosition.down < crunchedPosition.mid ){
                        thisMove = MID;
                        newY = position.y;
                    } else {
                        thisMove = DOWN;
                        newY = position.y + 1;
                    }
                    break;
                case MID:
                    if( crunchedPosition.down < crunchedPosition.up ){
                        thisMove = UP;
                        newY = position.y - 1;
                    } else {
                        thisMove = DOWN;
                        newY = position.y + 1;
                    }
                    break;
                case DOWN:
                    if( crunchedPosition.mid < crunchedPosition.up ){
                        thisMove = UP;
                        newY = position.y - 1;
                    } else {
                        thisMove = MID;
                        newY = position.y;
                    }
                    break;
            }
            
            this.lastMove = thisMove;
            return new Position( newX, newY )
        }
    }
}

export default MineOracle;
