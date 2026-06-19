# Quick Launch — Serverless API, GPT Action, Lead Capture

## Local Setup

```bash
npm install
npm test
npm run dev
```

## Environment Variables

```env
ALLOWED_ORIGIN=https://ad-spend-cashflow.vercel.app
ACTION_API_KEY=
REQUIRE_ACTION_AUTH=false
LEAD_WEBHOOK_URL=
LEAD_WEBHOOK_SECRET=
NODE_ENV=development
```

## Test Locally

```bash
curl -i -X POST http://localhost:3000/api/forecast-cash-flow \
  -H "Content-Type: application/json" \
  -d @actions/examples/forecast-cash-flow.request.json
```

```bash
curl -i -X POST http://localhost:3000/api/generate-analysis-package \
  -H "Content-Type: application/json" \
  -d @actions/examples/generate-analysis-package.request.json
```

```bash
curl -i -X POST http://localhost:3000/api/save-analysis-request \
  -H "Content-Type: application/json" \
  -d @actions/examples/save-analysis-request.request.json
```

## Production Tests

Replace the domain if your Vercel URL changes.

```bash
curl -i -X POST https://ad-spend-cashflow.vercel.app/api/forecast-cash-flow \
  -H "Content-Type: application/json" \
  -d @actions/examples/forecast-cash-flow.request.json
```

```bash
curl -i -X POST https://ad-spend-cashflow.vercel.app/api/save-analysis-request \
  -H "Content-Type: application/json" \
  -d @actions/examples/save-analysis-request.request.json
```

## GPT Action Builder Inputs

Name:

```txt
Ad Spend Cash Flow Calculator API
```

Description:

```txt
Calls the Ad Spend Cash Flow Calculator API to forecast ecommerce ad spend cash flow, payout lag, cash gaps, risk, and planning guidance.
```

Server URL:

```txt
https://ad-spend-cashflow.vercel.app
```

Authentication for fast launch:

```txt
None
```

Test operation first:

```txt
forecastCashFlow
```

Then test:

```txt
generateAnalysisPackage
saveAnalysisRequest
```

Only use `saveAnalysisRequest` when the user gives email and explicit consent.
