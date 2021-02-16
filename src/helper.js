/**
 * 
 * @param {*} mine matrix representation of the mine
 * @param {*} y current position on the y-axis / row
 * @param {*} x current position on the x-axis / coloumn
 */
export const directions = (mine, y, x) => {
    const up = y - 1 < 0 ? 0 : mine[y - 1][x];
    const str8 = mine[y][x];
    const down = y + 1 > mine.length - 1 ? 0 : mine[y + 1][x];

    return { up, str8, down };
};

/**
 * The purpose of this function is to get the highest possible
 * gold on the first move
 * 
 * @param {*} mine matrix representation of the mine
 * @param {*} directions the position the miner can move
 */
export const getFirstHighY = (mine, directions) => {
    const maxArr = [];

    for (let row = 0; row < mine.length; row++) {
        const { up, str8, down } = directions(mine, row, 0);
        const max = Math.max(
            mine[row][0] + up,
            mine[row][0] + str8,
            mine[row][0] + down
        );
        maxArr.push(max);
    }
    const max = Math.max(...maxArr);

    return maxArr.indexOf(max);
};
