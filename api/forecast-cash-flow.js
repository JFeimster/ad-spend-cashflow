/**
 * forecast-cash-flow
 * Main 14-day ecommerce cash-flow forecast endpoint.
 *
 * Vercel endpoint:
 * POST /api/forecast-cash-flow
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  return res.status(200).json({
    ok: true,
    endpoint: "/api/forecast-cash-flow",
    message: "Scaffold only. Implement logic in a future step."
  });
}
