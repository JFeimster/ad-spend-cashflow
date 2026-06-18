import test from "node:test";
import assert from "node:assert/strict";

import { forecastCashFlow } from "../lib/cashflow-engine.js";
import { DEFAULT_INPUTS } from "../lib/constants.js";

test("forecastCashFlow returns a daily forecast", () => {
  const result = forecastCashFlow(DEFAULT_INPUTS);
  assert.equal(result.forecast_window_days, 14);
  assert.equal(result.daily_forecast.length, 14);
  assert.equal(typeof result.estimated_cash_gap, "number");
  assert.ok(["scale", "hold", "fix", "funding_review"].includes(result.recommendation));
});

test("forecastCashFlow detects a cash gap under aggressive spend", () => {
  const result = forecastCashFlow({ ...DEFAULT_INPUTS, starting_cash: 5000, daily_ad_spend: 3000 });
  assert.ok(result.estimated_cash_gap > 0);
});
