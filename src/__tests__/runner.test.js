import runner from "../runner.js";
import mine from "../../mines/jupiter.js";
import path from "path";
import fs from "fs";

describe("run", () => {
  test("it runs the mine and returns the score", async () => {
    const logFile = path.join(__dirname, "logs", `runner_test.txt`);
    let score = await runner.run(mine, logFile);

    expect(score).toEqual(168);

    fs.writeFileSync(logFile, "");
  });
});
