/**
 * Core cash-flow forecast engine.
 */
import { EDUCATIONAL_DISCLAIMER } from "./constants.js";
import { roundCurrency } from "./formatters.js";
import { buildRiskNotes, calculateRiskScore, getRiskLevel, recommendGrowthDecision } from "./recommendations.js";

export function forecastCashFlow(inputs) {
  const forecastWindow = Number(inputs.forecast_window_days) || 14;
  const startingCash = Number(inputs.starting_cash) || 0;
  const dailyAdSpend = Number(inputs.daily_ad_spend) || 0;
  const expectedRoas = Number(inputs.expected_roas) || 0;
  const grossMarginRate = (Number(inputs.gross_margin_percent) || 0) / 100;
  const payoutLagDays = Number(inputs.payout_lag_days) || 0;
  const inventoryPayment = Number(inputs.inventory_supplier_payment) || 0;
  const inventoryPaymentDay = Number(inputs.inventory_payment_day) || 0;
  const refundDragRate = (Number(inputs.refund_adjustment_percent) || 0) / 100;

  let cash = startingCash;
  let lowestCashBalance = startingCash;
  let lowestCashDay = 0;
  const dailyForecast = [];

  for (let day = 1; day <= forecastWindow; day++) {
    const beginningCash = cash;
    const adSpendOutflow = dailyAdSpend;
    cash -= adSpendOutflow;

    let payoutInflow = 0;
    if (day - payoutLagDays > 0) {
      const grossRevenue = dailyAdSpend * expectedRoas;
      payoutInflow = grossRevenue * grossMarginRate * (1 - refundDragRate);
      cash += payoutInflow;
    }

    let inventoryOutflow = 0;
    if (day === inventoryPaymentDay && inventoryPayment > 0) {
      inventoryOutflow = inventoryPayment;
      cash -= inventoryOutflow;
    }

    if (cash < lowestCashBalance) {
      lowestCashBalance = cash;
      lowestCashDay = day;
    }

    const notes = [];
    if (day <= payoutLagDays) notes.push("Ad spend has left cash before delayed payouts arrive.");
    if (payoutInflow > 0) notes.push("Delayed contribution cash from earlier ad spend is included.");
    if (inventoryOutflow > 0) notes.push("Inventory or supplier payment hits cash today.");
    if (cash < 0) notes.push("Projected cash balance falls below zero.");

    dailyForecast.push({
      day,
      beginning_cash: roundCurrency(beginningCash),
      ad_spend_outflow: roundCurrency(adSpendOutflow),
      payout_inflow: roundCurrency(payoutInflow),
      inventory_supplier_outflow: roundCurrency(inventoryOutflow),
      ending_cash_balance: roundCurrency(cash),
      notes
    });
  }

  const estimatedCashGap = lowestCashBalance < 0 ? Math.abs(lowestCashBalance) : 0;
  const baseResult = {
    forecast_window_days: forecastWindow,
    starting_cash: roundCurrency(startingCash),
    lowest_cash_day: lowestCashDay,
    lowest_cash_balance: roundCurrency(lowestCashBalance),
    estimated_cash_gap: roundCurrency(estimatedCashGap),
    daily_forecast: dailyForecast
  };

  const decision = recommendGrowthDecision(inputs, baseResult);
  const riskScore = calculateRiskScore(inputs, baseResult);

  return {
    ...baseResult,
    recommendation: decision.decision,
    summary: buildForecastSummary(decision.decision, estimatedCashGap, lowestCashDay),
    decision_reason: decision.decision_reason,
    risk_score: riskScore,
    risk_level: getRiskLevel(riskScore),
    risk_notes: buildRiskNotes(inputs, baseResult),
    assumptions: buildAssumptions(),
    next_steps: buildNextSteps(decision.decision),
    disclaimer: EDUCATIONAL_DISCLAIMER
  };
}

export function buildForecastSummary(decision, estimatedCashGap, lowestCashDay) {
  if (estimatedCashGap > 0) {
    return `The forecast shows an estimated cash gap of $${Math.round(estimatedCashGap).toLocaleString()} around day ${lowestCashDay}. Revenue may be coming in, but timing pressure can still break cash flow.`;
  }
  const summaries = {
    scale: "The forecast does not show a cash gap under the submitted assumptions. Controlled scaling may be worth testing with human review.",
    hold: "The forecast avoids a cash gap, but the cash buffer may be too thin for aggressive scaling.",
    fix: "The forecast points to economics or timing issues that should be fixed before pushing more spend.",
    funding_review: "The forecast suggests a timing squeeze. Review cash timing and funding options only if the underlying economics are sound."
  };
  return summaries[decision] || summaries.hold;
}

export function buildAssumptions() {
  return [
    "Ad spend leaves cash immediately.",
    "Revenue contribution is delayed by the submitted payout lag.",
    "ROAS is treated as revenue multiple, not cash in the bank.",
    "Gross margin and refund drag reduce the cash contribution from paid orders.",
    "Inventory or supplier payment is applied on the selected day.",
    "The forecast is a planning model and should be reviewed against real platform payout and accounting data."
  ];
}

export function buildNextSteps(decision) {
  const common = [
    "Compare the estimate with actual ad platform, store, payout, and bank data.",
    "Review gross margin, refund drag, inventory timing, and payout lag before changing spend."
  ];
  const byDecision = {
    scale: ["Consider controlled scaling instead of a large spend jump.", "Keep a cash buffer and monitor daily payout timing."],
    hold: ["Hold spend until payout timing and cash buffer improve.", "Stress-test the model with lower ROAS and higher refund drag."],
    fix: ["Improve contribution margin, reduce refund drag, or lower acquisition cost.", "Do not use funding to mask broken unit economics."],
    funding_review: ["Review funding options only after confirming the core economics are sound.", "Compare total cost, repayment timing, and downside risk before moving forward."]
  };
  return [...common, ...(byDecision[decision] || byDecision.hold)];
}

export function calculateSafeDailyAdSpend(inputs) {
  const minimumCashBuffer = Number(inputs.minimum_cash_buffer) || 0;
  const currentSpend = Number(inputs.daily_ad_spend) || 0;
  let low = 0;
  let high = Math.max(currentSpend * 2, 100);
  let best = 0;
  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2;
    const result = forecastCashFlow({ ...inputs, daily_ad_spend: mid });
    if (result.lowest_cash_balance >= minimumCashBuffer) {
      best = mid;
      low = mid;
    } else {
      high = mid;
    }
  }
  return {
    estimated_safe_daily_ad_spend: roundCurrency(best),
    current_daily_ad_spend: roundCurrency(currentSpend),
    difference: roundCurrency(best - currentSpend),
    minimum_cash_buffer: roundCurrency(minimumCashBuffer),
    summary: best >= currentSpend ? "Current daily ad spend appears to fit within the selected cash buffer under these assumptions." : "Current daily ad spend may exceed the selected cash buffer under these assumptions.",
    disclaimer: EDUCATIONAL_DISCLAIMER
  };
}
