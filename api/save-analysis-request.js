/**
 * save-analysis-request
 * Optional lead or analysis request capture endpoint.
 *
 * Vercel endpoint:
 * POST /api/save-analysis-request
 *
 * Notes:
 * - This endpoint does not store data by itself.
 * - Add LEAD_WEBHOOK_URL in Vercel to forward submissions to a webhook.
 * - Keep consent language clear on the frontend before collecting contact info.
 */
import { EDUCATIONAL_DISCLAIMER, FUNDING_OPTIONS_URL, GPT_URL } from "../lib/constants.js";
import { parseJsonBody, validateCashFlowInputs, validateEmail } from "../lib/validators.js";

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

function createRequestId() {
  return `ascf_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function forwardToWebhook(record) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) {
    return { forwarded: false, reason: "LEAD_WEBHOOK_URL not configured." };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.LEAD_WEBHOOK_SECRET
        ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_SECRET}` }
        : {})
    },
    body: JSON.stringify(record)
  });

  if (!response.ok) {
    throw new Error(`Webhook returned ${response.status}.`);
  }

  return { forwarded: true };
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
    const errors = [];

    if (!validateEmail(payload.email)) {
      errors.push("email must be a valid email address.");
    }

    if (payload.consent !== true) {
      errors.push("consent must be true before saving an analysis request.");
    }

    const calculatorInputs = payload.calculator_inputs || payload.inputs || {};
    const validation = validateCashFlowInputs(calculatorInputs);

    if (!validation.ok) {
      errors.push(...validation.errors.map((error) => `calculator_inputs.${error}`));
    }

    if (errors.length) {
      return res.status(400).json({
        ok: false,
        error: "Invalid analysis request.",
        details: errors
      });
    }

    const record = {
      request_id: createRequestId(),
      created_at: new Date().toISOString(),
      email: String(payload.email).trim().toLowerCase(),
      name: payload.name ? String(payload.name).trim() : "",
      store_url: payload.store_url ? String(payload.store_url).trim() : "",
      store_type: payload.store_type ? String(payload.store_type).trim() : "",
      monthly_revenue_range: payload.monthly_revenue_range ? String(payload.monthly_revenue_range).trim() : "",
      notes: payload.notes ? String(payload.notes).slice(0, 2000) : "",
      consent: true,
      calculator_inputs: validation.inputs,
      source: payload.source || "ad-spend-cashflow-site"
    };

    let webhook = { forwarded: false, reason: "Webhook not attempted." };
    try {
      webhook = await forwardToWebhook(record);
    } catch (error) {
      webhook = {
        forwarded: false,
        error: process.env.NODE_ENV === "development" ? String(error?.message || error) : "Webhook forwarding failed."
      };
    }

    return res.status(200).json({
      ok: true,
      endpoint: "/api/save-analysis-request",
      result: {
        saved: webhook.forwarded,
        request_id: record.request_id,
        message: webhook.forwarded
          ? "Analysis request received and forwarded."
          : "Analysis request validated. Configure LEAD_WEBHOOK_URL to forward or store submissions.",
        webhook,
        next_steps: [
          {
            label: "Run the Ad Spend Cash Flow Calculator",
            url: GPT_URL
          },
          {
            label: "Compare Ecommerce Funding Options",
            url: FUNDING_OPTIONS_URL
          }
        ],
        disclaimer: EDUCATIONAL_DISCLAIMER
      }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Unable to save analysis request.",
      details: process.env.NODE_ENV === "development" ? String(error?.message || error) : undefined
    });
  }
}
