import Position from "./position";

const isOutOfMine = (mine, pos) => {
  const row = pos.y;
  const col = pos.x;

  if (typeof mine[row] === "undefined" || typeof mine[row][col] === "undefined") {
    return true;
  }

  return false;
};

const getGold = (mine, placeholder, dir, pos) => {
  const row = pos.y;
  const col = pos.x;

  if (isOutOfMine(mine, pos) || mine[row][col] === 0) {
    return 0;
  }

  if (placeholder[row][col]) {
    return placeholder[row][col][dir].gold;
  }

  return mine[row][col];
};

const getPath = (mine, placeholder, dir, pos) => {
  const row = pos.y;
  const col = pos.x;

  if (isOutOfMine(mine, pos) || mine[row][col] === 0 || !placeholder[row][col]) {
    return [pos];
  }

  return [...placeholder[row][col][dir].path];
};

export const iterate = (mine) => {
  const rowLength = mine.length;
  const colLength = mine[0].length;

  const placeholder = mine.map((row) => Array(row.length).fill(null));

  for (let col = colLength - 1; col >= 0; col--) {
    for (let row = 0; row <= rowLength - 1; row++) {
      const obj = {};
      const gold = mine[row][col];
      const path = new Position(col, row);

      const upPos = new Position(col + 1, row - 1);
      const upGold = getGold(mine, placeholder, "up", upPos);
      const upPath = getPath(mine, placeholder, "up", upPos);
      const rightPos = new Position(col + 1, row);
      const rightGold = getGold(mine, placeholder, "right", rightPos);
      const rightPath = getPath(mine, placeholder, "right", rightPos);
      const downPos = new Position(col + 1, row + 1);
      const downGold = getGold(mine, placeholder, "down", downPos);
      const downPath = getPath(mine, placeholder, "down", downPos);

      // Previously moved down, so miner can move up or right
      obj["down"] =
        upGold > rightGold
          ? { gold: gold + upGold, path: [path, ...upPath] }
          : { gold: gold + rightGold, path: [path, ...rightPath] };

      // Previously moved right, so miner can move up or down
      obj["right"] =
        upGold > downGold
          ? { gold: gold + upGold, path: [path, ...upPath] }
          : { gold: gold + downGold, path: [path, ...downPath] };

      // Previously moved up, so miner can move right or down
      obj["up"] =
        rightGold > downGold
          ? { gold: gold + rightGold, path: [path, ...rightPath] }
          : { gold: gold + downGold, path: [path, ...downPath] };

      placeholder[row][col] = obj;
    }
  }

  let max = { gold: 0, path: [] };
  for (let row = 0; row < rowLength; row++) {
    const candidate = placeholder[row][0];
    ["up", "right", "down"].forEach((dir) => {
      if (candidate[dir].gold >= max.gold) {
        max = candidate[dir];
      }
    });
  }

  return max;
};
