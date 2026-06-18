# Completed API and Schema Files

Drop the `api/` and `schemas/` folders into the root of the `ad-spend-cashflow` repo.

These API files are designed for Vercel Serverless Functions and import the shared files in `lib/`:

- `../lib/cashflow-engine.js`
- `../lib/validators.js`
- `../lib/recommendations.js`
- `../lib/formatters.js`
- `../lib/constants.js`

Optional environment variables:

- `ACTION_API_KEY` — protects API/GPT Action calls when set.
- `ALLOWED_ORIGIN` — controls CORS origin. Defaults to `*`.
- `LEAD_WEBHOOK_URL` — forwards lead/analysis requests.
- `LEAD_WEBHOOK_SECRET` — optional bearer token for webhook forwarding.

Endpoints:

- `POST /api/forecast-cash-flow`
- `POST /api/diagnose-ad-spend-risk`
- `POST /api/calculate-safe-ad-spend`
- `POST /api/recommend-growth-decision`
- `POST /api/generate-analysis-package`
- `POST /api/save-analysis-request`
