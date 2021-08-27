let { createDpMine, findBestInitialY, findBestNextMove, getNodesForNextMoves } = require('../../src/helpers.js')
let {Position} = require("../utils/position");

const mouse = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
const dpMouse = createDpMine(mouse)

describe('Create DpMine', () => {
    it('Should return the expected result for the mine mouse', () => {
        const expectedResult = [
            [{gold: 15, 
              right: {gold: 8,right: {gold: 3, right: -1, rightDown: -1, rightUp: -1}, rightDown: {gold: 6, right: -1, rightDown: -1, rightUp: -1}, rightUp: {gold: 0, right: -1, rightDown: -1, rightUp: -1}},
              rightDown: {gold: 14, right: {gold: 6, right: -1, rightDown: -1, rightUp: -1},rightDown: {gold: 9, right: -1, rightDown: -1, rightUp: -1}, rightUp: {gold: 3, right: -1, rightDown: -1, rightUp: -1}}, 
              rightUp: {gold: 0, right: -1, rightDown: -1, rightUp: -1}}, 
             {gold: 8, 
              right: {gold: 3, right: -1, rightDown: -1, rightUp: -1}, 
              rightDown: {gold: 6, right: -1, rightDown: -1, rightUp: -1}, 
              rightUp: {gold: 0, right: -1, rightDown: -1, rightUp: -1}}, 
             {gold: 3, right: -1, rightDown: -1, rightUp: -1}], 
            [{gold: 21, 
              right: {gold: 14, right: {gold: 6, right: -1, rightDown: -1, rightUp: -1}, rightDown: {gold: 9, right: -1, rightDown: -1, rightUp: -1}, rightUp: {gold: 3, right: -1, rightDown: -1, rightUp: -1}}, 
              rightDown: {gold: 17, right: {gold: 9, right: -1, rightDown: -1, rightUp: -1}, rightDown: {gold: 0, right: -1, rightDown: -1, rightUp: -1}, rightUp: {gold: 6, right: -1, rightDown: -1, rightUp: -1}}, 
              rightUp: {gold: 8, right: {gold: 3, right: -1, rightDown: -1, rightUp: -1}, rightDown: {gold: 6, right: -1, rightDown: -1, rightUp: -1}, rightUp: {gold: 0, right: -1, rightDown: -1, rightUp: -1}}}, 
             {gold: 14, 
              right: {gold: 6, right: -1, rightDown: -1, rightUp: -1},
              rightDown: {gold: 9, right: -1, rightDown: -1, rightUp: -1}, 
              rightUp: {gold: 3, right: -1, rightDown: -1, rightUp: -1}},
             {gold: 6, right: -1, rightDown: -1, rightUp: -1}], 
            [{gold: 24, 
              right: {gold: 17, right: {gold: 9, right: -1, rightDown: -1, rightUp: -1}, rightDown: {gold: 0, right: -1, rightDown: -1, rightUp: -1}, rightUp: {gold: 6, right: -1, rightDown: -1, rightUp: -1}}, 
              rightDown: {gold: 0, right: -1, rightDown: -1, rightUp: -1}, 
              rightUp: {gold: 14, right: {gold: 6, right: -1, rightDown: -1, rightUp: -1}, rightDown: {gold: 9, right: -1, rightDown: -1, rightUp: -1}, rightUp: {gold: 3, right: -1, rightDown: -1, rightUp: -1}}}, 
             {gold: 17, 
              right: {gold: 9, right: -1, rightDown: -1, rightUp: -1}, 
              rightDown: {gold: 0, right: -1, rightDown: -1, rightUp: -1}, 
              rightUp: {gold: 6, right: -1, rightDown: -1, rightUp: -1}}, 
             {gold: 9, right: -1, rightDown: -1, rightUp: -1}
            ]]
        
        expect(dpMouse).toEqual(expectedResult)
    })
});

describe('Find the Best Initial Y', () => {
    it('Should return the y coordinate from dpMine with most gold', () => {
        expect(findBestInitialY(dpMouse)).toEqual(2)
    })
})

describe('Find Best Next Move', () => {
    it('Should return the y coordinate difference representing the next best move', () => {
        expect(findBestNextMove(dpMouse, new Position(0,1), null)).toEqual(1)
        expect(findBestNextMove(dpMouse, new Position(1,2), 1)).toEqual(0)
    })
})

describe('Get Nodes For Next Moves', () => {
    it('Should return the node with total gold for next best move and nodes for each move', () => {
        const expectedResult = {
            bestNextGold: 9,
            rightUpNode: {gold: 6, right: -1, rightDown: -1, rightUp: -1} ,
            rightNode: {gold: 9, right: -1, rightDown: -1, rightUp: -1},
            rightDownNode: {gold: 0, right: -1, rightDown: -1, rightUp: -1}
        }

        expect(getNodesForNextMoves(dpMouse, 1 , 2)).toEqual(expectedResult)
    })
})
