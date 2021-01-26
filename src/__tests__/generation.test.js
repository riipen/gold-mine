import {
  generateTrackingPositionArray, highestStartPoint,
} from "../generation";

const smallTestMine = [
  [1, 7, 5],
  [2, 3, 9],
  [1, 4, 1],
];

// others left null for testing clarity
const highestStartMine = [
    [2, null, null],
    [9, null, null],
    [8,null, null],
]

describe("generation helper functions", () => {
  it("returns an array of same size m x n as passed mine", () => {
    const trackingPostionMine = generateTrackingPositionArray(smallTestMine);

    expect(trackingPostionMine.length).toEqual(3);
    expect(trackingPostionMine[0].length).toEqual(3);
  });

  it("returns the index of the highest value of collected gold", () => {
    const startPoint = highestStartPoint(highestStartMine);

    expect(startPoint).toEqual(1);   
  });
});
