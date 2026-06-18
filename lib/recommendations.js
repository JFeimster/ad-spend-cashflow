/**
 * Decision and risk logic for the Ad Spend Cash Flow Calculator.
 */
import { DECISIONS, RISK_LEVELS } from "./constants.js";

export function calculateRiskScore(inputs, forecastResult = {}) {
  const startingCash = Number(inputs.starting_cash) || 0;
  const dailySpend = Number(inputs.daily_ad_spend) || 0;
  const roas = Number(inputs.expected_roas) || 0;
  const margin = Number(inputs.gross_margin_percent) || 0;
  const payoutLag = Number(inputs.payout_lag_days) || 0;
  const refundDrag = Number(inputs.refund_adjustment_percent) || 0;
  const inventoryPayment = Number(inputs.inventory_supplier_payment) || 0;
  const estimatedCashGap = Number(forecastResult.estimated_cash_gap) || 0;
  const lowestCashBalance = Number(forecastResult.lowest_cash_balance ?? startingCash);

  let score = 0;
  if (startingCash > 0) {
    score += Math.min(30, (dailySpend / startingCash) * 100);
    score += Math.min(20, (inventoryPayment / startingCash) * 30);
  }
  score += Math.min(20, payoutLag * 2.5);
  score += Math.min(15, refundDrag * 1.2);
  if (roas < 1.2) score += 25;
  else if (roas < 1.8) score += 15;
  else if (roas < 2.2) score += 8;
  if (margin < 25) score += 25;
  else if (margin < 40) score += 15;
  else if (margin < 55) score += 6;
  if (estimatedCashGap > 0) score += 30;
  else if (startingCash > 0 && lowestCashBalance < startingCash * 0.15) score += 12;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getRiskLevel(score) {
  if (score >= 85) return RISK_LEVELS.CRITICAL;
  if (score >= 65) return RISK_LEVELS.HIGH;
  if (score >= 35) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.LOW;
}

export function buildRiskNotes(inputs, forecastResult = {}) {
  const notes = [];
  if (Number(forecastResult.estimated_cash_gap) > 0) notes.push("The forecast shows a cash gap before the end of the planning window.");
  if (Number(inputs.payout_lag_days) > 3) notes.push("Payout lag delays cash recovery after ad spend leaves the bank account.");
  if (Number(inputs.inventory_supplier_payment) > 0) notes.push("The inventory or supplier payment creates additional working-capital pressure.");
  if (Number(inputs.refund_adjustment_percent) > 5) notes.push("Refund and adjustment drag reduces the cash that actually lands.");
  if (Number(inputs.expected_roas) < 1.5) notes.push("Expected ROAS may be too weak to absorb timing and margin pressure.");
  if (Number(inputs.gross_margin_percent) < 40) notes.push("Gross margin may not leave enough contribution cash after COGS.");
  if (!notes.length) notes.push("No major cash-flow red flags appear under the current assumptions.");
  return notes;
}

export function recommendGrowthDecision(inputs, forecastResult = {}) {
  const estimatedCashGap = Number(forecastResult.estimated_cash_gap) || 0;
  const startingCash = Number(inputs.starting_cash) || 0;
  const lowestCashBalance = Number(forecastResult.lowest_cash_balance ?? startingCash);
  const roas = Number(inputs.expected_roas) || 0;
  const margin = Number(inputs.gross_margin_percent) || 0;
  const refundDrag = Number(inputs.refund_adjustment_percent) || 0;
  const payoutLag = Number(inputs.payout_lag_days) || 0;

  if (roas < 1.4 || margin < 30 || refundDrag > 20) {
    return { decision: DECISIONS.FIX, decision_reason: "The submitted economics look too fragile. Fix unit economics before using spend or funding to push growth." };
  }
  if (estimatedCashGap > 0) {
    return { decision: DECISIONS.FUNDING_REVIEW, decision_reason: "The model shows a cash gap. Review timing, margin, and funding options before increasing spend." };
  }
  if (startingCash > 0 && lowestCashBalance < startingCash * 0.2) {
    return { decision: DECISIONS.HOLD, decision_reason: "The forecast does not break below zero, but the cash buffer gets thin. Hold spend until timing improves." };
  }
  if (roas >= 2 && margin >= 45 && payoutLag <= 5) {
    return { decision: DECISIONS.SCALE, decision_reason: "Under these assumptions, the cash buffer remains intact and the economics look strong enough to consider controlled scaling." };
  }
  return { decision: DECISIONS.HOLD, decision_reason: "The forecast is not clearly broken, but it is not strong enough for aggressive scaling. Hold and monitor." };
}

export function buildDecisionBlocks(decision) {
  return {
    scale: { status: decision === DECISIONS.SCALE ? "recommended" : "not_primary", reason: decision === DECISIONS.SCALE ? "Cash buffer and submitted economics appear strong enough for controlled testing." : "Scaling should wait until cash timing and economics are clearly safe." },
    hold: { status: decision === DECISIONS.HOLD ? "recommended" : "available", reason: "Holding spend can give payout timing, refunds, and inventory pressure time to catch up." },
    fix: { status: decision === DECISIONS.FIX ? "recommended" : "review", reason: "Margin, refund drag, ROAS, and inventory timing should be checked before pushing spend." },
    funding_review: { status: decision === DECISIONS.FUNDING_REVIEW ? "recommended_review" : "optional_review", reason: "Funding should only be reviewed when the underlying unit economics are sound and repayment risk is understood." }
  };
}
