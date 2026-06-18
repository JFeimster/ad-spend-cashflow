import test from "node:test";
import assert from "node:assert/strict";

import { forecastCashFlow } from "../lib/cashflow-engine.js";
import { recommendGrowthDecision, buildDecisionBlocks } from "../lib/recommendations.js";
import { DEFAULT_INPUTS } from "../lib/constants.js";

test("recommendGrowthDecision returns a valid decision", () => {
  const forecast = forecastCashFlow(DEFAULT_INPUTS);
  const result = recommendGrowthDecision(DEFAULT_INPUTS, forecast);
  assert.ok(["scale", "hold", "fix", "funding_review"].includes(result.decision));
  assert.equal(typeof result.decision_reason, "string");
});

test("buildDecisionBlocks returns all decision blocks", () => {
  const blocks = buildDecisionBlocks("hold");
  assert.ok(blocks.scale);
  assert.ok(blocks.hold);
  assert.ok(blocks.fix);
  assert.ok(blocks.funding_review);
});
