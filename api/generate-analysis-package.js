/**
 * generate-analysis-package
 * Generates a GPT-ready prompt and JSON payload from form values.
 *
 * Vercel endpoint:
 * POST /api/generate-analysis-package
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  return res.status(200).json({
    ok: true,
    endpoint: "/api/generate-analysis-package",
    message: "Scaffold only. Implement logic in a future step."
  });
}
