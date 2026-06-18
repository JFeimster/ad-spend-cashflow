/**
 * forecast-cash-flow
 * Main ecommerce ad spend cash-flow forecast endpoint.
 *
 * Vercel endpoint:
 * POST /api/forecast-cash-flow
 */
import { forecastCashFlow } from "../lib/cashflow-engine.js";
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

    const result = forecastCashFlow(validation.inputs);

    return res.status(200).json({
      ok: true,
      endpoint: "/api/forecast-cash-flow",
      inputs: validation.inputs,
      result
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Unable to generate cash-flow forecast.",
      details: process.env.NODE_ENV === "development" ? String(error?.message || error) : undefined
    });
  }
}
