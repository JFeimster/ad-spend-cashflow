# API Reference

Base URL: `https://ad-spend-cashflow.vercel.app`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/forecast-cash-flow` | Returns a 14-day cash-flow forecast. |
| POST | `/api/diagnose-ad-spend-risk` | Returns a risk score and primary cash-flow risks. |
| POST | `/api/calculate-safe-ad-spend` | Estimates safe daily ad spend based on cash buffer. |
| POST | `/api/recommend-growth-decision` | Returns scale, hold, fix, or funding review decision. |
| POST | `/api/generate-analysis-package` | Generates GPT-ready prompt and JSON payload. |
| POST | `/api/save-analysis-request` | Saves a lead or analysis request if storage is connected. |

## Shared request body

```json
{
  "starting_cash": 25000,
  "daily_ad_spend": 2500,
  "expected_roas": 2,
  "gross_margin_percent": 55,
  "payout_lag_days": 5,
  "inventory_supplier_payment": 10000,
  "inventory_payment_day": 5,
  "refund_adjustment_percent": 5,
  "forecast_window_days": 14
}
```

## Modeling notes

Ad spend is modeled as immediate cash outflow. ROAS is modeled as revenue multiple, not cash in bank. Payout lag delays contribution cash. Inventory payments are modeled as a selected-day outflow. Outputs are educational planning estimates only.
