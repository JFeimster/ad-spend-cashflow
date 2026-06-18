import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_INPUTS, GPT_URL, TOOL_SLUG, SCHEMA_VERSION } from "../lib/constants.js";
import { formatInputSummary } from "../lib/formatters.js";

function generateAnalysisPackage(inputs) {
  return {
    gpt_prompt: `Run a 14-day ecommerce ad spend cash-flow forecast using these inputs:\n\n${formatInputSummary(inputs)}`,
    json_payload: { schema_version: SCHEMA_VERSION, tool: TOOL_SLUG, forecast_window_days: inputs.forecast_window_days, inputs },
    next_cta: { label: "Run the Ad Spend Cash Flow Calculator", url: GPT_URL }
  };
}

test("analysis package includes prompt, JSON payload, and CTA", () => {
  const result = generateAnalysisPackage(DEFAULT_INPUTS);
  assert.ok(result.gpt_prompt.includes("Starting cash"));
  assert.equal(result.json_payload.tool, TOOL_SLUG);
  assert.equal(result.next_cta.url, GPT_URL);
});
