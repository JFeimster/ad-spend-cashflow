/**
 * save-analysis-request
 * Consent-based lead capture endpoint.
 * POST /api/save-analysis-request
 */
import { EDUCATIONAL_DISCLAIMER, FUNDING_OPTIONS_URL, GPT_URL } from "../lib/constants.js";
import { parseJsonBody, validateCashFlowInputs, validateEmail } from "../lib/validators.js";

function setResponseHeaders(res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
}

function shouldRequireAuth() {
  return String(process.env.REQUIRE_ACTION_AUTH || "").toLowerCase() === "true";
}

function isAuthorized(req) {
  if (!shouldRequireAuth()) return true;
  const expectedKey = process.env.ACTION_API_KEY;
  if (!expectedKey) return false;
  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const apiKey = req.headers["x-api-key"];
  return bearerToken === expectedKey || apiKey === expectedKey;
}

function createRequestId() {
  return `ascf_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function cleanString(value, maxLength = 500) {
  if (value === undefined || value === null) return "";
  return String(value).trim().slice(0, maxLength);
}

function normalizeUrl(value) {
  const raw = cleanString(value, 300);
  if (!raw) return "";
  try {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return new URL(withProtocol).toString();
  } catch {
    return raw;
  }
}

function looksLikeBot(payload) {
  return Boolean(payload.website || payload.company_website || payload.honeypot);
}

async function forwardToWebhook(record) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return { forwarded: false, reason: "LEAD_WEBHOOK_URL not configured." };

  const headers = { "Content-Type": "application/json" };
  if (process.env.LEAD_WEBHOOK_SECRET) headers.Authorization = `Bearer ${process.env.LEAD_WEBHOOK_SECRET}`;

  const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(record) });
  if (!response.ok) throw new Error(`Webhook returned ${response.status}.`);
  return { forwarded: true };
}

export default async function handler(req, res) {
  setResponseHeaders(res);

  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, endpoint: "/api/save-analysis-request", error: "Method not allowed. Use POST." });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ ok: false, endpoint: "/api/save-analysis-request", error: "Unauthorized. Provide a valid API key." });
  }

  try {
    const payload = parseJsonBody(req);
    const errors = [];

    if (looksLikeBot(payload)) {
      return res.status(200).json({ ok: true, endpoint: "/api/save-analysis-request", result: { saved: false, message: "Request received." } });
    }

    if (!validateEmail(payload.email)) errors.push("email must be a valid email address.");
    if (payload.consent !== true) errors.push("consent must be true before saving an analysis request.");

    const calculatorInputs = payload.calculator_inputs || payload.inputs || {};
    const validation = validateCashFlowInputs(calculatorInputs);
    if (!validation.ok) errors.push(...validation.errors.map((error) => `calculator_inputs.${error}`));

    if (errors.length) {
      return res.status(400).json({ ok: false, endpoint: "/api/save-analysis-request", error: "Invalid analysis request.", details: errors });
    }

    const record = {
      request_id: createRequestId(),
      created_at: new Date().toISOString(),
      source: cleanString(payload.source, 120) || "ad-spend-cashflow-site",
      page_url: cleanString(payload.page_url, 500),
      referrer: cleanString(payload.referrer, 500),
      user_agent: cleanString(req.headers["user-agent"], 500),
      email: cleanString(payload.email, 254).toLowerCase(),
      name: cleanString(payload.name, 120),
      store_url: normalizeUrl(payload.store_url),
      store_type: cleanString(payload.store_type, 120),
      monthly_revenue_range: cleanString(payload.monthly_revenue_range, 120),
      notes: cleanString(payload.notes, 2000),
      consent: true,
      calculator_inputs: validation.inputs
    };

    let webhook = { forwarded: false, reason: "Webhook not attempted." };
    try { webhook = await forwardToWebhook(record); }
    catch (error) { webhook = { forwarded: false, error: process.env.NODE_ENV === "development" ? String(error?.message || error) : "Webhook forwarding failed." }; }

    return res.status(200).json({
      ok: true,
      endpoint: "/api/save-analysis-request",
      result: {
        saved: webhook.forwarded,
        request_id: record.request_id,
        message: webhook.forwarded ? "Analysis request received and forwarded." : "Analysis request validated. Configure LEAD_WEBHOOK_URL to forward or store submissions.",
        webhook,
        next_steps: [
          { label: "Run the Ad Spend Cash Flow Calculator", url: GPT_URL },
          { label: "Compare Ecommerce Funding Options", url: FUNDING_OPTIONS_URL }
        ],
        disclaimer: EDUCATIONAL_DISCLAIMER
      }
    });
  } catch (error) {
    return res.status(500).json({ ok: false, endpoint: "/api/save-analysis-request", error: "Unable to save analysis request.", details: process.env.NODE_ENV === "development" ? String(error?.message || error) : undefined });
  }
}
