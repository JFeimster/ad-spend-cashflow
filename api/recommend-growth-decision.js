/**
 * recommend-growth-decision
 * Returns a scale / hold / fix / funding_review decision based on cash-flow forecast.
 *
 * Vercel endpoint:
 * POST /api/recommend-growth-decision
 */
import { forecastCashFlow } from "../lib/cashflow-engine.js";
import { buildDecisionBlocks, recommendGrowthDecision } from "../lib/recommendations.js";
import { EDUCATIONAL_DISCLAIMER } from "../lib/constants.js";
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
    const decision = recommendGrowthDecision(validation.inputs, forecast);
    const decisionBlocks = buildDecisionBlocks(decision.decision);

    return res.status(200).json({
      ok: true,
      endpoint: "/api/recommend-growth-decision",
      inputs: validation.inputs,
      result: {
        decision: decision.decision,
        decision_reason: decision.decision_reason,
        scale: decisionBlocks.scale,
        hold: decisionBlocks.hold,
        fix: decisionBlocks.fix,
        funding_review: decisionBlocks.funding_review,
        forecast_snapshot: {
          lowest_cash_day: forecast.lowest_cash_day,
          lowest_cash_balance: forecast.lowest_cash_balance,
          estimated_cash_gap: forecast.estimated_cash_gap,
          risk_level: forecast.risk_level,
          risk_score: forecast.risk_score
        },
        next_steps: forecast.next_steps,
        disclaimer: EDUCATIONAL_DISCLAIMER
      }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Unable to recommend growth decision.",
      details: process.env.NODE_ENV === "development" ? String(error?.message || error) : undefined
    });
  }
}
