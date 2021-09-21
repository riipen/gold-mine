import Position from "./position.js";


/**
 * Replace the logic in this function with your own custom movement algorithm.
 *
 * This function should run in a reasonable amount of time and should attempt
 * to collect as much gold as possible.
 *
 * Remember, landing outside the mine's boundary or on a "0" on the mine will
 * result in the run completing.
 *
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {object} position - The current position of the miner, will be undefined on the first move
 *
 * @return {Position} The new position of the miner.
 */
const move = (mine, position) => {
	// TODO: write logic for miner. The current approach naive approach is to simply:
	//   1. Start at (0,0)
	//   2. Always moves right

	let movedRight;

	let newX = (position && position.x + 1) || 0;
 
	let newY = (position && position.y + 1) || 0;

	if (!movedRight) {
		newY = (position && position.y) || 0;
		// console.log("if movedright is false", position)
		movedRight = true;
	} else {
		newY = (position && position.y + 1) || 0;
		// console.log("if movedright is true", position);
		movedRight = false;
	}

	// array[rows][columns]

	//rows.length
	let n = mine[0].length;

	// columns.length
	let m = mine.length;
	
	// create temporary array, fill it with zeroes
	let maxGoldMine = new Array(m);

	maxGoldMine.fill(0);

	for (let i = 0; i < maxGoldMine.length; i++) {
		maxGoldMine[i] = new Array(n).fill(0);
	}

	for (let i = 0; i < m; i++) {
		maxGoldMine[i][0] = mine[i][0];
	}

	for (let j = 1; j < m; j++) {
		
		for (let i = 0; i < n; i++) {

			// map mine coordinates to maxGoldMine - this works with Mars, Luna, and Meteorite, but doesn't work with Jupiter? 

			maxGoldMine[i][j] = mine[i][j];
			
			// set tempGold to to value at position immediate left
			let tempGold = maxGoldMine[i][j - 1];

			// check upper left diagonal
			if (i - 1 >= 0) {
				if (tempGold < maxGoldMine[i - 1][j - 1]) {
					tempGold = maxGoldMine[i - 1][j - 1];
				}
			}

			// check lower left diagonal
			if (i + 1 < m) {
				if (tempGold < maxGoldMine[i + 1][j - 1]) {
					tempGold = maxGoldMine[i + 1][j - 1];
				}
			}

			// add max gold from each cell to dynamically populate 
			maxGoldMine[i][j] += tempGold;
		}
	}

	let totalGoldMined = maxGoldMine[0][m - 1];

	const maximumGoldMined = (total, x, y) => {
		for (let i = 0; i < n - 1; i++) {
			if (maxGoldMine[i][n - 1] > total) {
				total = maxGoldMine[i][n - 1];
				x = (position && position.x + total[i][0]);
			}
			y = (position && position.y + total);
			
		}
		console.log(total);
		return total, x, y;
	}
	
	maximumGoldMined(totalGoldMined, newX, newY);
	
	return new Position(newX, newY);

};

export default move;
