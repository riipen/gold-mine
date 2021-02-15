import move from '../src/move';

const run = async (mine, yStart = null) => {
    let position = await move(mine, null, yStart);
    let gold = mine[position.y][position.x];
    while (position.x < mine[0].length - 1 && position.isValid(mine)) {
        position = await move(mine, position);
        if (!position.isValid(mine) || mine[position.y][position.x] === 0) break;
        gold += mine[position.y][position.x];
      }
    return gold;
};

const computeHighestScore = async (name) => {
    let highestScore = 0;
    const mine = require(`../mines/${name}.js`).default;
    let score = 0;
    for (let y = 0; y < mine.length; ++y) {
        score = await run(mine, y);
        if (score > highestScore) {
            highestScore = score;
        }
    }
    console.log(`Mine '${name}' highest score:`, highestScore);
};

(async () => {
    try {
        if (process.argv.slice(2).length > 0) {
            // Run a single mine
            const name = process.argv.slice(2)[0];
            await computeHighestScore(name);
        } else {
            // Run all mines
            const mines = Object.entries(requireDirectory(module, "./mines"));

            for (const [k, mine] of mines) {
            totalScore += await runMine(mine.default, k);
            }
        }
    } catch (e) {
        console.error(e);
    }
})();