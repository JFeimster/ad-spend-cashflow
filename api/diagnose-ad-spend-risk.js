/**
 * diagnose-ad-spend-risk
 * Lightweight risk diagnosis endpoint for ecommerce ad spend cash timing.
 *
 * Vercel endpoint:
 * POST /api/diagnose-ad-spend-risk
 */
import { forecastCashFlow } from "../lib/cashflow-engine.js";
import { parseJsonBody, validateCashFlowInputs } from "../lib/validators.js";
import { buildRiskNotes, calculateRiskScore, getRiskLevel } from "../lib/recommendations.js";
import { EDUCATIONAL_DISCLAIMER } from "../lib/constants.js";

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

function buildPrimaryRisks(inputs, forecast) {
  const risks = buildRiskNotes(inputs, forecast);
  if (forecast.estimated_cash_gap > 0) {
    risks.unshift(`Estimated cash gap of $${Number(forecast.estimated_cash_gap).toLocaleString()} within the forecast window.`);
  }
  return [...new Set(risks)].slice(0, 6);
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
    const riskScore = calculateRiskScore(validation.inputs, forecast);
    const riskLevel = getRiskLevel(riskScore);

    return res.status(200).json({
      ok: true,
      endpoint: "/api/diagnose-ad-spend-risk",
      inputs: validation.inputs,
      result: {
        risk_level: riskLevel,
        risk_score: riskScore,
        primary_risks: buildPrimaryRisks(validation.inputs, forecast),
        recommendation: forecast.recommendation,
        recommendation_summary: forecast.decision_reason,
        lowest_cash_day: forecast.lowest_cash_day,
        lowest_cash_balance: forecast.lowest_cash_balance,
        estimated_cash_gap: forecast.estimated_cash_gap,
        disclaimer: EDUCATIONAL_DISCLAIMER
      }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Unable to diagnose ad spend risk.",
      details: process.env.NODE_ENV === "development" ? String(error?.message || error) : undefined
    });
  }
}
