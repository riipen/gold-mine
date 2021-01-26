import { calculateGoldTally, calculateLocalMaxValidMove } from "../goldCollection";
import { generateTrackingPositionArray } from "../generation";
import Position from "../position";

const smallTestMine = [
  [1, 7, 5],
  [2, 3, 9],
  [1, 4, 1],
];

const zeroMine = [
  [1, 1000, 0, 9],
  [1, 1, 0, 8],
  [1, 1, 3, 4],
];

describe("goldCollection (dynamic) algorithm calculation functions", () => {
  it("creates an array with the gold collected", () => {
    const directionMine = generateTrackingPositionArray(smallTestMine);
    const trackingPostionMine = generateTrackingPositionArray(smallTestMine);
    const goldMine = smallTestMine.map(function (arr) {
      return arr.slice();
    });

    calculateGoldTally(goldMine, trackingPostionMine, directionMine)

    expect(goldMine[0][0]).toEqual(17);
    expect(goldMine[1][0]).toEqual(18);
    expect(goldMine[2][0]).toEqual(14);
  });

  it("creates an tracking array with next position", () => {
    const directionMine = generateTrackingPositionArray(smallTestMine);
    const trackingPostionMine = generateTrackingPositionArray(smallTestMine);
    const goldMine = smallTestMine.map(function (arr) {
      return arr.slice();
    });
    calculateGoldTally(goldMine, trackingPostionMine, directionMine)

    expect(trackingPostionMine[0][0].x).toEqual(1);
    expect(trackingPostionMine[0][0].y).toEqual(0);
    expect(trackingPostionMine[1][0].x).toEqual(1);
    expect(trackingPostionMine[1][0].y).toEqual(0);
    expect(trackingPostionMine[2][0].x).toEqual(1);
    expect(trackingPostionMine[2][0].y).toEqual(2);
  });

  it("creates an array with next direction", () => {
    const directionMine = generateTrackingPositionArray(smallTestMine);
    const trackingPostionMine = generateTrackingPositionArray(smallTestMine);
    const goldMine = smallTestMine.map(function (arr) {
      return arr.slice();
    });
    calculateGoldTally(goldMine, trackingPostionMine, directionMine);

    expect(directionMine[0][0]).toEqual(0);
    expect(directionMine[1][0]).toEqual(1);
    expect(directionMine[2][0]).toEqual(0);
  });

  it("calculates the best route from cell options and updates gold array", () => {
    const directionMine = generateTrackingPositionArray(smallTestMine);
    const trackingPostionMine = generateTrackingPositionArray(smallTestMine);
    const currentPosition = new Position(1,0)
    const goldMine = smallTestMine.map(function (arr) {
      return arr.slice();
    });
    calculateLocalMaxValidMove(goldMine, trackingPostionMine, directionMine, currentPosition);

    expect(goldMine[0][1]).toEqual(16);
  });

  it("handles zero in mine properly and not tally gold", () => {
    const directionMine = generateTrackingPositionArray(zeroMine);
    const trackingPostionMine = generateTrackingPositionArray(zeroMine);
    const currentPosition = new Position(1, 0);
    const goldMine = zeroMine.map(function (arr) {
      return arr.slice();
    });
    calculateLocalMaxValidMove(
      goldMine,
      trackingPostionMine,
      directionMine,
      currentPosition
    );

    expect(goldMine[0][2]).toEqual(0);
  });

  it("handles zero in mine properly update trackingMine properly", () => {
    const directionMine = generateTrackingPositionArray(zeroMine);
    const trackingPostionMine = generateTrackingPositionArray(zeroMine);
    const currentPosition = new Position(1, 0);
    const goldMine = zeroMine.map(function (arr) {
      return arr.slice();
    });
    calculateLocalMaxValidMove(
      goldMine,
      trackingPostionMine,
      directionMine,
      currentPosition
    );

    expect(trackingPostionMine[0][2]).toEqual(null);
  });

  it("handles zero in mine properly update directionMine properly", () => {
    const directionMine = generateTrackingPositionArray(zeroMine);
    const trackingPostionMine = generateTrackingPositionArray(zeroMine);
    const currentPosition = new Position(1, 0);
    const goldMine = zeroMine.map(function (arr) {
      return arr.slice();
    });
    calculateLocalMaxValidMove(
      goldMine,
      trackingPostionMine,
      directionMine,
      currentPosition
    );

    expect(directionMine[0][2]).toEqual(null);
  });
});