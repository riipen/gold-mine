import validator from "../validator.js";
import runner from "../runner.js";
import mine from "../../mines/jupiter.js";
import path from "path";
import fs from "fs";

describe("validate", () => {
  it("runs the mine and validates that the steps and score are valid", async () => {
    const logFile = path.join(__dirname, "logs", `validator_test.txt`);

    const mineScore = await runner.run(mine, logFile);
    const valid = await validator.validate(mine, logFile, mineScore);

    expect(valid).toBe(true);

    fs.writeFileSync(logFile, "");
  });
});
