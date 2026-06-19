# Quick Launch — Serverless API, GPT Action, Lead Capture

## Launch Order

1. Deploy deterministic calculator API.
2. Connect frontend form to /api/forecast-cash-flow.
3. Add Custom GPT Action schema.
4. Add lead capture webhook.
5. Test production endpoints.

## Local Setup

npm install
npm test
npm run dev

## Environment Variables

ALLOWED_ORIGIN=https://ad-spend-cashflow.vercel.app
ACTION_API_KEY=
REQUIRE_ACTION_AUTH=false
LEAD_WEBHOOK_URL=
LEAD_WEBHOOK_SECRET=
NODE_ENV=development

## Test Forecast API Locally

curl.exe -i -X POST http://localhost:3000/api/forecast-cash-flow -H "Content-Type: application/json" -d "@actions/examples/forecast-cash-flow.request.json"

## Test Lead Capture Locally

curl.exe -i -X POST http://localhost:3000/api/save-analysis-request -H "Content-Type: application/json" -d "@actions/examples/save-analysis-request.request.json"

## Vercel Deployment

git add .
git commit -m "Launch API, GPT Action schema, and lead capture"
git push -u origin integration-launch-api-actions-leads

## Custom GPT Action Setup

1. Open the Custom GPT builder.
2. Go to Actions.
3. Import or paste actions/openapi.yaml.
4. Use server URL: https://ad-spend-cashflow.vercel.app
5. Fast launch authentication: None.
6. Test forecastCashFlow.
7. Test generateAnalysisPackage.
8. Only test saveAnalysisRequest with explicit consent.

## Guardrails

- Do not treat ROAS as cash flow.
- Do not guarantee profitability.
- Do not guarantee funding approval.
- Do not recommend borrowing as professional advice.
- Funding is only an option to review.
- Keep all secrets server-side.
