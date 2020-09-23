import { getUpRightValue, getRightValue, getDownRightValue, goUpRight, goRight, goDownRight } from "../helper.js";
import Position from "../position.js";

const mine = [[1, 1, 1], [2, 3, 0], [0, 4, 5]];

describe('goUpRight', () => {
  it('returns up right position of current position', () => {
  	let curPosition = new Position(0, 1);
  	let newPostion = goUpRight(mine,curPosition);
    expect(newPostion).toEqual(new Position(1,0));
  });
});

describe('goRight', () => {
  it('returns right position of current position', () => {
  	let curPosition = new Position(0, 1);
  	let newPostion = goRight(mine,curPosition);
    expect(newPostion).toEqual(new Position(1,1));
  });
});

describe('goDownRight', () => {
  it('returns down right position of current position', () => {
  	let curPosition = new Position(0, 1);
  	let newPostion = goDownRight(mine,curPosition);
    expect(newPostion).toEqual(new Position(1,2));
  });
});


describe('getUpRightValue', () => {
  it('returns up right value of current position', () => {
  	let curPosition = new Position(0, 1);
  	let goldvalue = getUpRightValue(mine,curPosition);
    expect(goldvalue).toBe(1);
  });
});

describe('getRightValue', () => {
  it('returns right value of current position', () => {
  	let curPosition = new Position(0, 1);
  	let goldvalue = getRightValue(mine,curPosition);
    expect(goldvalue).toBe(3);
  });
});

describe('getdownRightValue', () => {
  it('returns down right value of current position', () => {
  	let curPosition = new Position(0, 1);
  	let goldvalue = getDownRightValue(mine,curPosition);
    expect(goldvalue).toBe(4);
  });
});
