import test from "node:test";
import assert from "node:assert/strict";

import { calculateSafeDailyAdSpend } from "../lib/cashflow-engine.js";
import { DEFAULT_INPUTS } from "../lib/constants.js";

test("safe ad spend calculation returns expected fields", () => {
  const result = calculateSafeDailyAdSpend({ ...DEFAULT_INPUTS, minimum_cash_buffer: 5000 });
  assert.equal(typeof result.estimated_safe_daily_ad_spend, "number");
  assert.equal(typeof result.difference, "number");
  assert.equal(result.minimum_cash_buffer, 5000);
});
