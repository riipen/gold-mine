import { getUpRightValue, getRightValue, getDownRightValue, goUpRight, goRight, goDownRight } from "../helper.js";
import Position from "../position.js";
import move from "../move.js";

const mine1 = [[1, 1, 1], [2, 3, 0], [0, 4, 5]];

const mine2 = [[1,1,1,0],[1,2,3,1],[1,1,2,0]];

describe('move in mine1', () => {
  it('should go dewnRight and then go up right', () => {
  	let curPosition = new Position(0, 0);
  	let newPostionOne = move(mine1,curPosition);
  	let newPostionTwo = move(mine1,newPostionOne)
    expect(newPostionOne).toEqual(new Position(1,1));
    expect(newPostionTwo).toEqual(new Position(2,0));
  });
});

describe('move in mine2', () => {
  it('should avoid zeros', () => {
  	let curPosition = new Position(0,0);
  	let newPostionOne = move(mine2,curPosition);
    let newPostionTwo = move(mine2,newPostionOne);
    expect(newPostionOne).toEqual(new Position(1,1));
    expect(newPostionTwo).toEqual(new Position(2,0));
  });
});
