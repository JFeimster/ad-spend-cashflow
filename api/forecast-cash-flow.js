export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST."
    });
  }

  try {
    const {
      starting_cash = 0,
      daily_ad_spend = 0,
      expected_roas = 0,
      gross_margin_percent = 0,
      payout_lag_days = 0,
      inventory_supplier_payment = 0,
      inventory_payment_day = 5,
      refund_adjustment_percent = 0,
      forecast_window_days = 14
    } = req.body;

    const dailyForecast = [];
    let cash = Number(starting_cash);
    let lowestCash = cash;
    let lowestCashDay = 0;

    for (let day = 1; day <= forecast_window_days; day++) {
      cash -= Number(daily_ad_spend);

      const payoutDay = day - Number(payout_lag_days);
      if (payoutDay > 0) {
        const grossRevenue = Number(daily_ad_spend) * Number(expected_roas);
        const contributionCash =
          grossRevenue *
          (Number(gross_margin_percent) / 100) *
          (1 - Number(refund_adjustment_percent) / 100);

        cash += contributionCash;
      }

      if (day === Number(inventory_payment_day)) {
        cash -= Number(inventory_supplier_payment);
      }

      if (cash < lowestCash) {
        lowestCash = cash;
        lowestCashDay = day;
      }

      dailyForecast.push({
        day,
        cash_balance: Math.round(cash),
        notes:
          day <= payout_lag_days
            ? "Ad spend leaves cash before payouts arrive."
            : "Delayed contribution cash begins to arrive."
      });
    }

    const estimatedCashGap = lowestCash < 0 ? Math.abs(lowestCash) : 0;

    let recommendation = "hold";

    if (estimatedCashGap > 0) {
      recommendation = "funding_review";
    }

    if (expected_roas < 1.5 || gross_margin_percent < 35) {
      recommendation = "fix";
    }

    if (estimatedCashGap === 0 && lowestCash > starting_cash * 0.25) {
      recommendation = "scale";
    }

    return res.status(200).json({
      recommendation,
      summary:
        estimatedCashGap > 0
          ? "Your current assumptions may create a cash gap during the forecast window."
          : "Your current assumptions do not show a cash gap during the forecast window.",
      lowest_cash_day: lowestCashDay,
      lowest_cash_balance: Math.round(lowestCash),
      estimated_cash_gap: Math.round(estimatedCashGap),
      daily_forecast: dailyForecast,
      next_steps: [
        "Review payout timing before increasing ad spend.",
        "Check margin, refund drag, and inventory timing.",
        "Compare funding options only if unit economics are sound."
      ],
      disclaimer:
        "This is an educational planning estimate, not financial, lending, tax, accounting, or legal advice."
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unable to generate forecast."
    });
  }
}
