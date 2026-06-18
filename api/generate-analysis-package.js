/**
 * generate-analysis-package
 * Turns calculator inputs into a Custom GPT-ready prompt and machine-readable JSON payload.
 *
 * Vercel endpoint:
 * POST /api/generate-analysis-package
 */
import {
  CTA_LABELS,
  EDUCATIONAL_DISCLAIMER,
  FUNDING_OPTIONS_URL,
  GPT_URL,
  GUARDRAILS,
  REQUESTED_OUTPUTS,
  SCHEMA_VERSION,
  TOOL_SLUG
} from "../lib/constants.js";
import { forecastCashFlow } from "../lib/cashflow-engine.js";
import { formatInputSummary } from "../lib/formatters.js";
import { parseJsonBody, validateCashFlowInputs } from "../lib/validators.js";

function setResponseHeaders(res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
}

function isAuthorized(req) {
  const expectedKey = process.env.ACTION_API_KEY;
  if (!expectedKey) return true;

  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const apiKey = req.headers["x-api-key"];

  return bearerToken === expectedKey || apiKey === expectedKey;
}

function buildGptPrompt(inputs, forecast) {
  return [
    "Run a 14-day ecommerce ad spend cash-flow forecast using the data below.",
    "",
    formatInputSummary(inputs),
    "",
    "Return:",
    "1. Day-by-day cash forecast",
    "2. Lowest cash day and lowest projected balance",
    "3. Estimated cash gap, if any",
    "4. Recommendation: scale, hold, fix economics, or review funding options",
    "5. Key assumptions, risks, and next steps",
    "",
    "Important guardrails:",
    "- Do not treat ROAS as cash flow.",
    "- Do not guarantee profitability, ad performance, funding approval, or repayment terms.",
    "- Do not recommend borrowing as advice.",
    "- Funding may only be framed as an option to review when unit economics appear sound.",
    "",
    `Initial model snapshot: ${forecast.summary}`
  ].join("\n");
}

export default async function handler(req, res) {
  setResponseHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed. Use POST."
    });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({
      ok: false,
      error: "Unauthorized. Provide a valid API key."
    });
  }

  try {
    const payload = parseJsonBody(req);
    const validation = validateCashFlowInputs(payload);

    if (!validation.ok) {
      return res.status(400).json({
        ok: false,
        error: "Invalid cash-flow inputs.",
        details: validation.errors
      });
    }

    const forecast = forecastCashFlow(validation.inputs);
    const jsonPayload = {
      schema_version: SCHEMA_VERSION,
      tool: TOOL_SLUG,
      generated_at: new Date().toISOString(),
      forecast_window_days: validation.inputs.forecast_window_days,
      inputs: validation.inputs,
      requested_outputs: REQUESTED_OUTPUTS,
      guardrails: GUARDRAILS,
      model_snapshot: {
        recommendation: forecast.recommendation,
        summary: forecast.summary,
        lowest_cash_day: forecast.lowest_cash_day,
        lowest_cash_balance: forecast.lowest_cash_balance,
        estimated_cash_gap: forecast.estimated_cash_gap,
        risk_level: forecast.risk_level,
        risk_score: forecast.risk_score
      }
    };

    return res.status(200).json({
      ok: true,
      endpoint: "/api/generate-analysis-package",
      inputs: validation.inputs,
      result: {
        gpt_prompt: buildGptPrompt(validation.inputs, forecast),
        json_payload: jsonPayload,
        forecast_snapshot: jsonPayload.model_snapshot,
        next_cta: {
          primary: {
            label: CTA_LABELS.primary,
            url: GPT_URL
          },
          secondary: {
            label: CTA_LABELS.secondary,
            url: FUNDING_OPTIONS_URL
          }
        },
        disclaimer: EDUCATIONAL_DISCLAIMER
      }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Unable to generate analysis package.",
      details: process.env.NODE_ENV === "development" ? String(error?.message || error) : undefined
    });
  }
}
