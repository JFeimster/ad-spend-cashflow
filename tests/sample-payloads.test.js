import test from "node:test";
import assert from "node:assert/strict";

import fs from "node:fs";
import path from "node:path";

const examplesDir = path.resolve("actions/examples");

test("example JSON files are valid", () => {
  const files = fs.readdirSync(examplesDir).filter((file) => file.endsWith(".json"));
  assert.ok(files.length >= 10);
  for (const file of files) {
    const content = fs.readFileSync(path.join(examplesDir, file), "utf8");
    assert.doesNotThrow(() => JSON.parse(content), `${file} should be valid JSON`);
  }
});
