# Environment Variables

Use `.env.example` as a public template. Do not commit real secrets.

```txt
OPENAI_API_KEY=
ACTION_API_KEY=
LEAD_WEBHOOK_URL=
SITE_URL=https://ad-spend-cashflow.vercel.app
GPT_URL=https://chatgpt.com/g/g-6a3359a8328c8191acc5cba7968a1639-ad-spend-cash-flow-calculator
FUNDING_OPTIONS_URL=https://tally.so/r/w4R2Ad
```

`OPENAI_API_KEY` is only needed if your backend calls OpenAI directly. `ACTION_API_KEY` is optional for GPT Action auth. `LEAD_WEBHOOK_URL` is optional for saving leads to an external service.
