# Exact Implementation Prompts

## Jules Prompt

```txt
You are updating the GitHub repo JFeimster/ad-spend-cashflow.

Goal: launch the practical integration path for the Ad Spend Cash Flow Calculator:
1. Static site calls Vercel serverless API.
2. Custom GPT Action calls the same API.
3. Lead capture forwards consent-based requests to LEAD_WEBHOOK_URL.

Constraints:
- Plain HTML/CSS/vanilla JS only.
- No React, Next.js, database, or build tooling.
- Do not put secrets in browser JavaScript.
- Do not require OpenAI API for the basic calculator.
- Reuse existing lib/cashflow-engine.js and lib/validators.js.
- Do not duplicate calculator logic in API handlers.
- Keep all language educational. No profitability guarantees. No funding approval claims. No borrowing advice.

Tasks:
1. Replace api/forecast-cash-flow.js with the provided file.
2. Replace api/save-analysis-request.js with the provided file.
3. Replace script.js with the provided file.
4. Replace actions/openapi.yaml with the provided file.
5. Replace actions/action-instructions.md with the provided file.
6. Replace actions/auth-notes.md with the provided file.
7. Replace .env.example with the provided file.
8. Create lead-capture.html.
9. Create actions/examples/forecast-cash-flow.request.json.
10. Create actions/examples/generate-analysis-package.request.json.
11. Create actions/examples/save-analysis-request.request.json.
12. Create docs/quick-launch.md.
13. Run npm test.
14. Test POST /api/forecast-cash-flow and POST /api/save-analysis-request.
15. Open a PR titled: Launch serverless calculator API, GPT Action schema, and lead capture.

Acceptance criteria:
- npm test passes.
- Calculator form renders API-backed result.
- If API call fails, frontend falls back to local preview.
- OpenAPI operationIds are forecastCashFlow, diagnoseAdSpendRisk, calculateSafeAdSpend, recommendGrowthDecision, generateAnalysisPackage, saveAnalysisRequest.
- Lead capture validates email and consent.
- No secrets are exposed in frontend files.
```

## Codex Prompt

```txt
Create a branch named integration-launch-api-actions-leads in repo JFeimster/ad-spend-cashflow.

Apply the provided launch pack exactly.

Replace:
- api/forecast-cash-flow.js
- api/save-analysis-request.js
- script.js
- actions/openapi.yaml
- actions/action-instructions.md
- actions/auth-notes.md
- .env.example

Create:
- lead-capture.html
- actions/examples/forecast-cash-flow.request.json
- actions/examples/generate-analysis-package.request.json
- actions/examples/save-analysis-request.request.json
- docs/quick-launch.md

Run npm test, test the API endpoints locally, and summarize changed files and test results.
```
