import { Move, getBestMove, filterBest  } from "./move";
import Position from "./position";

describe('Move', () => {
	describe('getPredecessors()', () => {
		test('should get predecessors with their score, and not go out of bounds', () => {
			const matrix = [
				[3, 6],
				[4, 7],
				[5, 8],
			];

			const move1 = new Move(matrix, new Position(1, 0), 6);
			const move2 = new Move(matrix, new Position(1, 1), 7);
			const move3 = new Move(matrix, new Position(1, 2), 8);

			let predecessorsTop = move1.getPredecessors();
			let predecessorsMid = move2.getPredecessors();
			let predecessorsBottom = move3.getPredecessors();

			expect(predecessorsTop).toHaveLength(2);
			expect(predecessorsMid).toHaveLength(3);
			expect(predecessorsBottom).toHaveLength(2);
		});
	
		test('should exclude predecessors that land on 0', () => {
			const matrix = [
				[3, 6],
				[0, 7],
				[0, 8],
			];

			const move1 = new Move(matrix, new Position(1, 0), 6);
			const move2 = new Move(matrix, new Position(1, 1), 7);
			const move3 = new Move(matrix, new Position(1, 2), 8);

			let predecessorsTop = move1.getPredecessors();
			let predecessorsMid = move2.getPredecessors();
			let predecessorsBottom = move3.getPredecessors();
			expect(predecessorsTop).toHaveLength(1);
			expect(predecessorsMid).toHaveLength(1);
			expect(predecessorsBottom).toHaveLength(0);
		});
	
		test('should calculate the sum of the predecessors', () => {
			const matrix = [
				[3, 6],
				[4, 7],
				[5, 8],
			];

			const move1 = new Move(matrix, new Position(1, 0), 6);
			const move2 = new Move(matrix, new Position(1, 1), 7);
			const move3 = new Move(matrix, new Position(1, 2), 8);

			let predecessorsTop = move1.getPredecessors();
			let predecessorsMid = move2.getPredecessors();
			let predecessorsBottom = move3.getPredecessors();

			expect(predecessorsTop[0].score).toBe(9);
			expect(predecessorsTop[1].score).toBe(10);

			expect(predecessorsMid[0].score).toBe(10);
			expect(predecessorsMid[1].score).toBe(11);
			expect(predecessorsMid[2].score).toBe(12);

			expect(predecessorsBottom[0].score).toBe(12);
			expect(predecessorsBottom[1].score).toBe(13);
		});

		test('should not repeat a single move in the same direction', () => {
			// There are three possible ways into the center position of this matrix,
			// but since we can't repeat a move, we should only be able to find two predecessors
			// for any starting point in the rightmost column.
			const matrix = [
				[1, 0, 1],
				[1, 1, 1],
				[1, 0, 1],
			];

			let moves = [new Move(matrix, new Position(2, 0), 1), new Move(matrix, new Position(2, 1), 1), new Move(matrix, new Position(2, 2), 1)];

			for (const move of moves) {
				let predecessors = move.getPredecessors();
				expect(predecessors.length).toBe(1);
				predecessors = predecessors[0].getPredecessors();
				expect(predecessors.length).toBe(2);
			}
		});

		test('should return null when we have reached the leftmost point', () => {
			let matrix = [
				[1]
			];

			let predecessors = new Move(matrix, new Position(0, 0), 1).getPredecessors();
			expect(predecessors).toBe(null);
		});
	}) 
});

describe("filterBest()", () => {
	describe("Should return only the highest scoring moves for any given position", () => {
		// No need to set an explicit mine in this case.
		let moves = [
			new Move(null, new Position(2, 0), 3), 
			new Move(null, new Position(2, 0), 1), 
			new Move(null, new Position(2, 2), 2),
			new Move(null, new Position(2, 2), 5),
		];

		moves[0].nextMove = new Move(null, new Position(3, 0), 1);
		moves[1].nextMove = new Move(null, new Position(3, 0), 1);
		moves[2].nextMove = new Move(null, new Position(3, 2), 1);
		moves[3].nextMove = new Move(null, new Position(3, 2), 1);

		const best = filterBest(moves);
		expect(best.length).toBe(2);
		expect(best[0].pos).toBe(moves[0].pos);
		expect(best[1].pos).toBe(moves[3].pos);
	});
});

describe('getBestMove', () => {
	test('it should get a sequence of moves from the beginning to the end of the mine', () => {
		const mine = [
			[1, 4, 7],
			[2, 5, 8],
			[3, 6, 9],
		];

		let best = getBestMove(mine);
		let currentX = 0;
		expect(best.pos.x).toBe(0);
		while (best !== null) {
			expect(best.pos.x).toBe(currentX++);
			best = best.nextMove;
		}
	});

	test('it should get the best scoring sequence of moves', () => {
		const mine = [
			[1, 0, 7],
			[2, 5, 8],
			[8, 8, 19],
		];

		let best = getBestMove(mine);

		expect(best.pos.toString()).toBe("0,2");
		expect(best.score).toBe(32);
		
		best = best.nextMove;
		expect(best.pos.toString()).toBe("1,1");
		expect(best.score).toBe(24);
		best = best.nextMove;
		expect(best.pos.toString()).toBe("2,2");
		expect(best.score).toBe(19);

		expect(best.nextMove).toBe(null);
	});

	test('it should throw if there is no way through the mine', () => {
		const mine = [
			[1, 0, 7],
			[2, 0, 8],
			[3, 0, 9],
		]

		expect(() => getBestMove(mine)).toThrowError('There are no valid paths through the mine')
	})
});