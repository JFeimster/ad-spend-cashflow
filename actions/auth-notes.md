# Action Auth Notes

Recommended starting approach:

- Use an API key for GPT Action requests.
- Store the real key in Vercel environment variables.
- Do not commit secrets to GitHub.
- Do not expose private API keys in `script.js`.

Suggested header:

```http
Authorization: Bearer YOUR_ACTION_API_KEY
```
