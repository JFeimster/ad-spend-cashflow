# Action Auth Notes

## Fast Launch

Use no authentication for the first public launch.

Why:

- The static site must call `/api/forecast-cash-flow` from browser JavaScript.
- Browser JavaScript cannot safely contain private keys.
- The deterministic calculator exposes no secret data.

## Optional Private Mode Later

Set in Vercel:

```env
ACTION_API_KEY=replace-with-long-random-secret
REQUIRE_ACTION_AUTH=true
```

Then configure GPT Action auth as:

```http
Authorization: Bearer YOUR_ACTION_API_KEY
```

or:

```http
x-api-key: YOUR_ACTION_API_KEY
```

Warning: if `REQUIRE_ACTION_AUTH=true`, browser calls can fail unless you split public frontend endpoints from private Action endpoints.
