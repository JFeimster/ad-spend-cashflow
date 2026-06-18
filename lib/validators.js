/**
 * Request validation for calculator endpoints.
 */
import { DEFAULT_INPUTS, MIN_FORECAST_WINDOW_DAYS, MAX_FORECAST_WINDOW_DAYS } from "./constants.js";

const FIELD_RULES = {
  starting_cash: { min: 0, max: 100000000, required: true },
  daily_ad_spend: { min: 0, max: 10000000, required: true },
  expected_roas: { min: 0, max: 100, required: true },
  gross_margin_percent: { min: 0, max: 100, required: true },
  payout_lag_days: { min: 0, max: 30, required: true, integer: true },
  inventory_supplier_payment: { min: 0, max: 100000000, required: false },
  inventory_payment_day: { min: 1, max: 30, required: false, integer: true },
  refund_adjustment_percent: { min: 0, max: 100, required: false },
  forecast_window_days: { min: MIN_FORECAST_WINDOW_DAYS, max: MAX_FORECAST_WINDOW_DAYS, required: false, integer: true },
  minimum_cash_buffer: { min: 0, max: 100000000, required: false }
};

export function parseJsonBody(req) {
  if (!req?.body) return {};
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { throw new Error("Invalid JSON body."); }
  }
  return req.body;
}

export function validateCashFlowInputs(rawPayload = {}) {
  const payload = { ...DEFAULT_INPUTS, ...rawPayload };
  const errors = [];
  const inputs = {};

  for (const [field, rules] of Object.entries(FIELD_RULES)) {
    const rawValue = payload[field];
    if (rules.required && (rawValue === undefined || rawValue === null || rawValue === "")) {
      errors.push(`${field} is required.`);
      continue;
    }
    const number = Number(rawValue);
    if (!Number.isFinite(number)) {
      errors.push(`${field} must be a valid number.`);
      continue;
    }
    if (number < rules.min) errors.push(`${field} must be at least ${rules.min}.`);
    if (number > rules.max) errors.push(`${field} must be no more than ${rules.max}.`);
    inputs[field] = rules.integer ? Math.round(number) : number;
  }

  if (inputs.inventory_payment_day > inputs.forecast_window_days) {
    errors.push("inventory_payment_day should be within the forecast window.");
  }

  return { ok: errors.length === 0, errors, inputs };
}

export function requirePost(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return false;
  }
  return true;
}

export function validateEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}
