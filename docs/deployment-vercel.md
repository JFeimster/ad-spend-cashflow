# Deployment to Vercel

1. Push this repo to GitHub.
2. In Vercel, choose **Add New Project**.
3. Import the GitHub repo.
4. Keep default settings for a static site with serverless `/api` functions.
5. Deploy.

Files inside `/api` become Vercel serverless functions. For example, `api/forecast-cash-flow.js` becomes `/api/forecast-cash-flow`.

Never put private API keys in `script.js`, `index.html`, or other browser-visible files. Use Vercel Environment Variables.
