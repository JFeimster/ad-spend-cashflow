/**
 * Formatting helpers for API responses, generated prompts, and UI copy.
 */
export function roundCurrency(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.round(number);
}

export function formatCurrency(value, options = {}) {
  const { includeCents = false } = options;
  const number = Number(value);
  if (!Number.isFinite(number)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: includeCents ? 2 : 0,
    maximumFractionDigits: includeCents ? 2 : 0
  }).format(number);
}

export function formatPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0%";
  return `${number}%`;
}

export function formatMultiple(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0x";
  return `${Number.isInteger(number) ? number : number.toFixed(2)}x`;
}

export function titleCaseDecision(decision) {
  const labels = {
    scale: "Scale",
    hold: "Hold",
    fix: "Fix Economics",
    funding_review: "Review Funding Options"
  };
  return labels[decision] || "Review";
}

export function formatInputSummary(inputs) {
  return [
    `Starting cash: ${formatCurrency(inputs.starting_cash)}`,
    `Daily ad spend: ${formatCurrency(inputs.daily_ad_spend)}`,
    `Expected ROAS / revenue multiple: ${formatMultiple(inputs.expected_roas)}`,
    `Gross margin after COGS: ${formatPercent(inputs.gross_margin_percent)}`,
    `Payout lag: ${inputs.payout_lag_days} day${Number(inputs.payout_lag_days) === 1 ? "" : "s"}`,
    `Upcoming inventory / supplier payment: ${formatCurrency(inputs.inventory_supplier_payment)}`,
    `Inventory payment day: Day ${inputs.inventory_payment_day}`,
    `Refund / adjustment drag: ${formatPercent(inputs.refund_adjustment_percent)}`,
    `Forecast window: ${inputs.forecast_window_days} days`
  ].join("\n");
}
