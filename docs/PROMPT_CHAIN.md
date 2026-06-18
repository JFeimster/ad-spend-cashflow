# Prompt Chain for Completing the Planned Files

Sequential generation is recommended because later files depend on the shared `lib/` behavior.

## 1. Constants

```txt
Create `lib/constants.js` for the Ad Spend Cash Flow Calculator repo. Include GPT URL, funding URL, tool name, schema version, forecast window defaults, decision labels, risk levels, educational disclaimer, guardrails, requested outputs, and CTA labels. Use ES module exports. Do not include secrets.
```

## 2. Formatters

```txt
Create `lib/formatters.js` with reusable formatting helpers for USD currency, percentages, ROAS multiples, decision labels, and multiline input summaries. Use ES module exports and no dependencies.
```

## 3. Validators

```txt
Create `lib/validators.js` for Vercel serverless API endpoints. Include parseJsonBody, validateCashFlowInputs, requirePost, and validateEmail. Validate starting cash, daily ad spend, expected ROAS, gross margin, payout lag, inventory payment, inventory day, refund drag, forecast window, and minimum cash buffer. Use ES module exports.
```

## 4. Recommendations

```txt
Create `lib/recommendations.js` for the Ad Spend Cash Flow Calculator. Include calculateRiskScore, getRiskLevel, buildRiskNotes, recommendGrowthDecision, and buildDecisionBlocks. The logic must avoid guaranteeing profitability, ad performance, or funding approval. Decisions should be scale, hold, fix, or funding_review.
```

## 5. Cash-flow engine

```txt
Create `lib/cashflow-engine.js`. It should import constants, formatters, and recommendations. Include forecastCashFlow and calculateSafeDailyAdSpend. Model ad spend as immediate outflow, payout as delayed contribution cash, gross margin and refund drag as reductions, and inventory payment as a day-specific outflow. Return daily forecast, lowest cash day, lowest cash balance, cash gap, risk score, risk level, recommendation, assumptions, next steps, and disclaimer.
```

## 6. Action examples

```txt
Create completed sample request and response JSON files for these endpoints: diagnose-ad-spend-risk, calculate-safe-ad-spend, recommend-growth-decision, generate-analysis-package, and save-analysis-request. Place them in `actions/examples/`. Use realistic ecommerce inputs and disclaimer-safe outputs.
```

## 7. Docs

```txt
Create docs for API reference, GPT Action setup, Vercel deployment, environment variables, privacy notes, disclaimer language, and integration roadmap for the Ad Spend Cash Flow Calculator repo. Keep them practical, concise, and repo-ready.
```

## 8. Tests

```txt
Create Node `node:test` files for the shared library behavior and example payloads. Include tests for forecast cash flow, risk diagnosis, safe ad spend, growth decision, analysis package generation, and JSON example validity. Use built-in `node:test` and `node:assert/strict`.
```
