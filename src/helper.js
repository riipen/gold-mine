// helper functions to implement the move
import Position from "./position.js";

const getUpRightValue = (mine,position) => {
	return mine[position.y-1] ? mine[position.y-1][position.x+1] : 0;
}

const getRightValue = (mine,position) => {
	return mine[position.y] ? mine[position.y][position.x+1] : 0;
}

const getDownRightValue = (mine,position) => {
	return mine[position.y+1] ? mine[position.y+1][position.x+1] : 0;
}

const goUpRight = (mine,position) => {
	const newX = (position && position.x + 1);
	const newY = (position && position.y - 1);
	return new Position(newX, newY);
}

const goRight = (mine,position) => {
	const newX = (position && position.x + 1);
	const newY = (position && position.y);
	return new Position(newX, newY);
}

const goDownRight = (mine,position) => {
	const newX = (position && position.x + 1);
	const newY = (position && position.y +1 );
	return new Position(newX, newY);
}

export { getUpRightValue, getRightValue, getDownRightValue, goUpRight, goRight, goDownRight };