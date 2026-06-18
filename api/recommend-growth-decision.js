/**
 * recommend-growth-decision
 * Recommends scale, hold, fix, or funding review.
 *
 * Vercel endpoint:
 * POST /api/recommend-growth-decision
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  return res.status(200).json({
    ok: true,
    endpoint: "/api/recommend-growth-decision",
    message: "Scaffold only. Implement logic in a future step."
  });
}
