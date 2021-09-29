import Position from "../../src/position.js";

class EvaluateArrayStrategy {
    constructor() {
        // this.mineScore;
        this.bestScore = { score: 0, coordenadas: [] };
        this.evaluatedMine;
    }
    move(mine, position) {

        //Setup the mines
        if (position == undefined) {
            this.bestScore = { score: 0, coordenadas: [] };
            this.evaluateMine(mine);
            this.mineScore = this.getMinescore(mine);
        }
        const newX = (position && position.x + 1) || 0;
        let newY;
        if (position) {
            newY = this.getPositionY(position);
        } else {
            let bestScore = 0;
            let casa = 0;
            for (let i = 0; i < this.evaluatedMine.length; i++) {
                this.evaluatedMine[i][0];
                let value = 0;
                let mid = this.evaluatedMine[i][1].mid;
                let top = this.evaluatedMine[i - 1] ? this.evaluatedMine[i - 1][1].up : 0;
                let bot = this.evaluatedMine[i + 1] ? this.evaluatedMine[i + 1][1].down : 0;
                if (mid >= top && mid >= bot) {
                    value = mine[i][0] + mid;
                } else if (top >= mid && top >= bot) {
                    value = mine[i][0] + top;
                } else {
                    value = mine[i][0] + bot;
                }

                if (value > bestScore) {
                    bestScore = value;
                    casa = i;
                }
            }
            newY = casa;
            if (casa == 0) {
                this.lastMovement = 'up';
            } else if (casa == mine.length) {
                this.lastMovement = 'down';
            } else {
                this.lastMovement = 'none';
            }
        }
        return new Position(newX, newY);
    }
    evaluateMine(mine) {
        this.evaluatedMine = [];
        for (var i = 0; i < mine.length; i++) {
            this.evaluatedMine[i] = [];
            for (var j = 0; j < mine[0].length; j++) {
                this.evaluatedMine[i][j] = { up: 0, mid: 0, down: 0 };
            }
        }
    }
    getMinescore(mine) {
        let mineScore = this.avoidPitFalls(mine);
        mineScore = this.evaluateCells(mine);
        return mineScore;
    }

    isPitfall(mine, x, y) {
        return mine[x][y] == 0
    }
    evaluateSuperiorPitfalls(currentPosition, evaluatedPosition, { moveBottom, moveMiddle, moveTop }) {
        if (moveMiddle == 0 && moveBottom == 0) {

            currentPosition = 0;
            evaluatedPosition.up = 0;
            evaluatedPosition.mid = 0;
        }
        else {
            if (moveBottom == 0) {
                evaluatedPosition.mid = 0;
            } else {
                evaluatedPosition.mid = currentPosition;
            }
            evaluatedPosition.up = currentPosition;
        }
    }
    evaluateInferiorPitfalls(currentPosition, evaluatedPosition, { moveBottom, moveMiddle, moveTop }) {
        if (moveMiddle == 0 && moveTop == 0) {
            currentPosition = 0;
            evaluatedPosition.up = 0;
            evaluatedPosition.mid = 0;
        }
        else {

            if (moveTop == 0) {
                evaluatedPosition.mid = 0;
            } else {
                evaluatedPosition.mid = currentPosition;
            }
            evaluatedPosition.up = currentPosition;
        }
    }
    evaluatePitfalls(currentPosition, evaluatedPosition, { moveBottom, moveMiddle, moveTop }) {
        if ((moveBottom === 0 && moveTop == 0 && moveMiddle == 0)) {
            currentPosition = 0;
            evaluatedPosition.up = 0;
            evaluatedPosition.mid = 0;
            evaluatedPosition.down = 0;
        } else {
            evaluatedPosition.up = currentPosition;
            evaluatedPosition.mid = currentPosition;
            evaluatedPosition.down = currentPosition;
            //mid
            if (moveBottom == 0 && moveTop == 0)
                evaluatedPosition.mid = 0;
            if (moveTop == 0 && moveMiddle == 0)
                evaluatedPosition.up = 0;
            if (moveBottom == 0 && moveMiddle == 0)
                evaluatedPosition.down = 0;
        }
    }
    avoidPitFalls(mine) {

        let evaluatedPosition;
        for (let i = 0; i < mine.length; i++) {
            for (let j = 0; j < mine[i].length; j++) {
                let movements = {
                    moveTop: mine[i - 1] ? mine[i - 1][j + 1] : 0,
                    moveMiddle: mine[i][j + 1],
                    moveBottom: mine[i + 1] ? mine[i + 1][j + 1] : 0
                }
                evaluatedPosition = this.evaluatedMine[i][j];
                let currentPosition = mine[i][j];
                if (!this.isPitfall(mine, i, j)) {
                    if (i == 0) {
                        this.evaluateSuperiorPitfalls(currentPosition, evaluatedPosition, movements);
                    }
                    else if (i == mine.length - 1) {
                        this.evaluateInferiorPitfalls(currentPosition, evaluatedPosition, movements);
                    } else {
                        this.evaluatePitfalls(currentPosition, evaluatedPosition, movements);
                    }
                } else {
                    this.itsPitfall(evaluatedPosition);
                }
            }
        }
        return this.evaluatedMine;
    }
    itsPitfall(evaluatedPosition) {
        evaluatedPosition.up = 0;
        evaluatedPosition.mid = 0;
        evaluatedPosition.bottom = 0;
    }
    evaluateCells(mine) {
        const lineSize = mine[0].length;
        for (let j = lineSize - 2; j >= 0; j--) {
            for (let i = mine.length - 1; i >= 0; i--) {
                let mid = this.evaluatedMine[i][j + 1].mid;
                let up = this.evaluatedMine[i - 1] ? this.evaluatedMine[i - 1][j + 1].up : 0;
                let down = this.evaluatedMine[i + 1] ? this.evaluatedMine[i + 1][j + 1].down : 0;
                if (i == 0) {
                    if (this.evaluatedMine[i][j].up > 0) {
                        this.evaluatedMine[i][j].up += mid > down ? mid : down;
                    }
                    if (this.evaluatedMine[i][j].mid > 0) {
                        this.evaluatedMine[i][j].mid += down;
                    }
                } else if (i == mine.length - 1) {
                    if (this.evaluatedMine[i][j].down > 0) {
                        this.evaluatedMine[i][j].down += mid > up ? mid : up;
                    }
                    if (this.evaluatedMine[i][j].mid > 0) {
                        this.evaluatedMine[i][j].mid += up;
                    }
                } else {
                    if (mine[i][j] >= 1) {

                        if (this.evaluatedMine[i][j].up > 0) {
                            this.evaluatedMine[i][j].up += mid > down ? mid : down;

                        }
                        if (this.evaluatedMine[i][j].down > 0) {
                            this.evaluatedMine[i][j].down += mid > up ? mid : up;
                        }
                        if (this.evaluatedMine[i][j].mid > 0) {
                            this.evaluatedMine[i][j].mid += up > down ? up : down;
                        }

                    } else {
                        this.evaluatedMine[i][j].up = 0;
                        this.evaluatedMine[i][j].mid = 0;
                        this.evaluatedMine[i][j].down = 0;
                    }                    
                }
            }
        }
        return mine;
    }
    getPositionY(position) {
        let x = position.x;
        let y = position.y;
        let mid = this.evaluatedMine[y][x + 1].mid;
        let down = this.evaluatedMine[y + 1] ? this.evaluatedMine[y + 1][x + 1].down : 0;
        let up = this.evaluatedMine[y - 1] ? this.evaluatedMine[y - 1][x + 1].up : 0;
        switch (this.lastMovement) {
            case 'up':
                // futureMove()
                if (mid > down) {
                    this.lastMovement = "mid";
                    return y + 0;
                } else {
                    this.lastMovement = "down";
                    return y + 1;
                }
            case 'down':
                if (mid > up) {
                    this.lastMovement = "mid";
                    return y + 0;
                } else {
                    this.lastMovement = "up";
                    return y - 1;
                }
            case 'mid':
                if (down > up || y == 0) {
                    this.lastMovement = "down";
                    return y + 1;
                } else {
                    this.lastMovement = "up";
                    return y - 1;
                }
            default:
                if (down >= up && down >= mid) {
                    this.lastMovement = "down";
                    return y + 1;
                } else if (down <= up && up >= mid) {
                    this.lastMovement = "up";
                    return y - 1;
                } else {
                    this.lastMovement = "mid";
                    return y + 0;
                }
        }
    }
}


export default EvaluateArrayStrategy;