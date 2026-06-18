# GPT Action Setup

Start with `POST /api/forecast-cash-flow`. That gives the Custom GPT a structured calculator backend before adding lead capture.

## Steps

1. Deploy the repo to Vercel.
2. Confirm `/api/forecast-cash-flow` returns JSON.
3. Open the Custom GPT builder.
4. Go to **Actions**.
5. Add the OpenAPI schema from `actions/openapi.yaml`.
6. Add API key auth if you require it.
7. Test with examples from `actions/examples/`.

## GPT behavior

The GPT should ask for missing inputs, call the endpoint when enough data exists, summarize the forecast, avoid treating ROAS as cash flow, and avoid guaranteeing profitability, ad performance, or funding approval.
