import test from "node:test";
import assert from "node:assert/strict";

import { forecastCashFlow } from "../lib/cashflow-engine.js";
import { calculateRiskScore, getRiskLevel } from "../lib/recommendations.js";
import { DEFAULT_INPUTS } from "../lib/constants.js";

test("risk score is between 0 and 100", () => {
  const forecast = forecastCashFlow(DEFAULT_INPUTS);
  const score = calculateRiskScore(DEFAULT_INPUTS, forecast);
  assert.ok(score >= 0);
  assert.ok(score <= 100);
});

test("risk level is valid", () => {
  assert.ok(["low", "medium", "high", "critical"].includes(getRiskLevel(72)));
});
