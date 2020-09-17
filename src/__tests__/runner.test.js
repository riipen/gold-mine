import runner from "../runner.js";
import mine from "../../mines/jupiter.js";
import path from "path";
import fs from "fs";

describe("run", () => {
  it("runs the jupiter mine and returns the score", async () => {
    const logFile = path.join(__dirname, "logs", `runner_test.txt`);
    let score = await runner.run(mine, logFile);

    expect(score).toEqual(3649);

    fs.writeFileSync(logFile, "");
  });
});
