/**
 * calculate-safe-ad-spend
 * Estimates safer daily ad spend based on cash constraints and selected buffer.
 *
 * Vercel endpoint:
 * POST /api/calculate-safe-ad-spend
 */
import { forecastCashFlow, calculateSafeDailyAdSpend } from "../lib/cashflow-engine.js";
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

    const safeSpend = calculateSafeDailyAdSpend(validation.inputs);
    const forecastAtCurrentSpend = forecastCashFlow(validation.inputs);
    const forecastAtSafeSpend = forecastCashFlow({
      ...validation.inputs,
      daily_ad_spend: safeSpend.estimated_safe_daily_ad_spend
    });

    return res.status(200).json({
      ok: true,
      endpoint: "/api/calculate-safe-ad-spend",
      inputs: validation.inputs,
      result: {
        ...safeSpend,
        current_spend_forecast: {
          lowest_cash_day: forecastAtCurrentSpend.lowest_cash_day,
          lowest_cash_balance: forecastAtCurrentSpend.lowest_cash_balance,
          estimated_cash_gap: forecastAtCurrentSpend.estimated_cash_gap,
          recommendation: forecastAtCurrentSpend.recommendation
        },
        safe_spend_forecast: {
          lowest_cash_day: forecastAtSafeSpend.lowest_cash_day,
          lowest_cash_balance: forecastAtSafeSpend.lowest_cash_balance,
          estimated_cash_gap: forecastAtSafeSpend.estimated_cash_gap,
          recommendation: forecastAtSafeSpend.recommendation
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Unable to calculate safe daily ad spend.",
      details: process.env.NODE_ENV === "development" ? String(error?.message || error) : undefined
    });
  }
}
