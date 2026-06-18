/**
 * Shared constants for the Ad Spend Cash Flow Calculator.
 */
export const GPT_URL = "https://chatgpt.com/g/g-6a3359a8328c8191acc5cba7968a1639-ad-spend-cash-flow-calculator";
export const FUNDING_OPTIONS_URL = "https://tally.so/r/w4R2Ad";

export const TOOL_NAME = "Ad Spend Cash Flow Calculator";
export const TOOL_SLUG = "ad_spend_cash_flow_calculator";
export const SCHEMA_VERSION = "1.0.0";

export const DEFAULT_FORECAST_WINDOW_DAYS = 14;
export const MIN_FORECAST_WINDOW_DAYS = 7;
export const MAX_FORECAST_WINDOW_DAYS = 30;

export const DEFAULT_INPUTS = Object.freeze({
  starting_cash: 25000,
  daily_ad_spend: 2500,
  expected_roas: 2,
  gross_margin_percent: 55,
  payout_lag_days: 5,
  inventory_supplier_payment: 10000,
  inventory_payment_day: 5,
  refund_adjustment_percent: 5,
  forecast_window_days: DEFAULT_FORECAST_WINDOW_DAYS,
  minimum_cash_buffer: 0
});

export const DECISIONS = Object.freeze({
  SCALE: "scale",
  HOLD: "hold",
  FIX: "fix",
  FUNDING_REVIEW: "funding_review"
});

export const RISK_LEVELS = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical"
});

export const EDUCATIONAL_DISCLAIMER =
  "This output is an educational planning estimate, not financial, lending, tax, accounting, legal, or professional advice. It does not guarantee profitability, ad performance, funding approval, or repayment terms.";

export const GUARDRAILS = Object.freeze([
  "Do not guarantee profitability.",
  "Do not guarantee funding approval.",
  "Do not guarantee ad performance.",
  "Do not claim scaling ad spend will increase revenue.",
  "Do not claim to replace a CFO, CPA, accountant, lender, underwriter, attorney, or tax professional.",
  "Do not tell users they should borrow money.",
  "Do not claim funding is risk-free.",
  "Do not invent payout rules, platform policies, rates, repayment terms, or lender requirements.",
  "Do not treat ROAS as the same thing as cash flow.",
  "Do not encourage users to fund broken unit economics.",
  "Do not make decisions automatically without human review."
]);

export const REQUESTED_OUTPUTS = Object.freeze([
  "daily_cash_forecast",
  "lowest_cash_day",
  "lowest_cash_balance",
  "estimated_cash_gap",
  "scale_hold_fix_or_funding_review",
  "assumptions",
  "risk_notes",
  "next_steps"
]);

export const CTA_LABELS = Object.freeze({
  primary: "Run the Ad Spend Cash Flow Calculator",
  secondary: "Compare Ecommerce Funding Options"
});
