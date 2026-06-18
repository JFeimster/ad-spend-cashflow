/**
 * save-analysis-request
 * Optional lead or analysis request capture endpoint.
 *
 * Vercel endpoint:
 * POST /api/save-analysis-request
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  return res.status(200).json({
    ok: true,
    endpoint: "/api/save-analysis-request",
    message: "Scaffold only. Implement logic in a future step."
  });
}
