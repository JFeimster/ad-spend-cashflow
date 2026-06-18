# Funding Routing Notes

## Purpose

This document explains how the repo should use the ecommerce funding files that support the **Ad Spend Cash Flow Calculator**.

These files are designed for two parallel uses:

1. **Custom GPT knowledge**
   - `knowledge/ecommerce-funding-options.md`
   - Gives the GPT plain-English routing logic, response language, CTA rules, and guardrails.

2. **Repo / future Actions / static site logic**
   - `data/ecommerce-funding-options.public.json`
   - `schemas/ecommerce-funding-options.schema.json`
   - `tests/funding-routing-rules.test.js`
   - Gives the repo a structured, public-safe routing data layer that can later power OpenAI Actions, calculators, static pages, or backend endpoints.

The goal is not to turn the calculator into a lender. The goal is to help the user understand whether a cash-flow gap is caused by ad economics, payout timing, inventory timing, or capital structure — then route them to the safest next step.

---

## File Map

```txt
knowledge/
└── ecommerce-funding-options.md

data/
└── ecommerce-funding-options.public.json

schemas/
└── ecommerce-funding-options.schema.json

docs/
└── funding-routing-notes.md

tests/
└── funding-routing-rules.test.js
```

---

## Recommended Upload / Deployment Use

### Add to Custom GPT knowledge

Upload this file to the GPT knowledge base:

```txt
knowledge/ecommerce-funding-options.md
```

Optional but useful if the GPT should reason against structured categories:

```txt
data/ecommerce-funding-options.public.json
```

Do **not** upload raw internal provider matrices unless you intentionally want the GPT to reason over source-provider details. The generated public JSON is safer because it removes internal source labels and turns the data into user-facing funding categories.

---

## Repo Use

Commit all five files to the repo.

Recommended commit message:

```txt
Add ecommerce funding routing knowledge and public data layer
```

Recommended paths:

```txt
knowledge/ecommerce-funding-options.md
data/ecommerce-funding-options.public.json
schemas/ecommerce-funding-options.schema.json
docs/funding-routing-notes.md
tests/funding-routing-rules.test.js
```

---

## Routing Philosophy

The calculator should follow this order:

1. **Diagnose**
   - Is the problem ROAS, margin, payout lag, inventory timing, or capital structure?

2. **Protect the user**
   - If ads are unprofitable or margins are weak, do not recommend funding first.

3. **Match the funding category**
   - Route based on the cash-flow problem, not based on hype.

4. **Warn about repayment**
   - Daily/weekly repayment must be discussed when using fast capital or seller advances.

5. **Use secure CTA**
   - Send the user to the funding comparison application instead of collecting sensitive documents in chat.

---

## Funding Category Map

| Category ID | User-facing category | Best use |
|---|---|---|
| `marketplace_seller_growth_capital` | Marketplace / Seller Growth Capital | Inventory, ad spend, payout smoothing, ecommerce growth |
| `daily_seller_payout` | Daily Seller Payout / Payout Acceleration | Payout lag and already-earned revenue arriving too slowly |
| `seller_instant_advance` | Seller Instant Advance | Fast inventory/ad bridge for active sellers |
| `business_line_of_credit` | Business Line of Credit / Revolving Access | Recurring gaps and flexible draw-based working capital |
| `fast_working_capital` | Fast Working Capital / Revenue Advance | Urgent short-term operating gap with active revenue |
| `startup_credit_leverage` | Startup / Credit-Leverage Funding | Early-stage stores with limited sales history but stronger personal profile |
| `structured_growth_capital` | Structured Business Loan / Longer-Term Growth Capital | More established, slower, planned capital needs |
| `do_not_fund_fix_economics` | Do Not Fund Yet — Fix Economics First | Weak ROAS, thin margin, unvalidated offer |

---

## Scenario Routing Matrix

| Scenario | Primary route | Backups | CTA? | Notes |
|---|---|---|---|---|
| Profitable ads + payout lag | `daily_seller_payout` | `marketplace_seller_growth_capital`, `business_line_of_credit` | Yes | Recommend payout acceleration before heavier debt. |
| Profitable ads + inventory timing gap | `marketplace_seller_growth_capital` | `seller_instant_advance`, `business_line_of_credit` | Yes | Only if margin survives repayment. |
| Weak ROAS or thin gross margin | `do_not_fund_fix_economics` | None | No | Fix ads, margin, or offer first. |
| Small recurring cash gap | `business_line_of_credit` | `daily_seller_payout`, supplier terms | Yes | Flexibility beats repeat advances. |
| Severe short-term emergency | `fast_working_capital` | `seller_instant_advance`, `marketplace_seller_growth_capital` | Yes | Add repayment warning every time. |
| Early-stage store, little sales history | `startup_credit_leverage` | `do_not_fund_fix_economics` | Yes, carefully | Seller capital may not fit yet. |
| Stable business, planned growth | `structured_growth_capital` | `business_line_of_credit`, `marketplace_seller_growth_capital` | Yes | Slower capital may be cleaner. |

---

## CTA Rules

Primary funding CTA:

```txt
Compare Ecommerce Funding Options
https://tally.so/r/w4R2Ad
```

Use when:

- The user has a confirmed projected cash gap.
- The user asks how to fund inventory or ad spend safely.
- Ads appear profitable but cash timing is broken.
- The user needs secure funding comparison or application intake.
- The result shows payout lag, inventory timing, or a recurring working-capital gap.

Do not use when:

- The user has not run numbers yet.
- ROAS is clearly weak.
- Gross margin is too thin.
- The user wants guaranteed approval.
- The business model is not validated.
- The user should reduce ad spend or fix unit economics first.

---

## Language Rules

### Safe language

Use:

- “Based on the numbers provided…”
- “This may fit…”
- “This may be worth comparing…”
- “Funding is subject to underwriting.”
- “Repayment structure matters as much as approval amount.”
- “Funding should support profitable growth, not hide broken economics.”

### Banned / avoid language

Avoid:

- “You qualify.”
- “You are approved.”
- “Guaranteed funding.”
- “Guaranteed rate.”
- “Lowest rate.”
- “No risk.”
- “This will fix your cash flow.”
- “You should borrow this amount.”
- “Upload your bank statements here.”

---

## Data File Notes

The file `data/ecommerce-funding-options.public.json` is intentionally public-safe.

It includes:

- category definitions
- routing rules
- public product examples
- intake fields
- guardrails
- CTA rules
- fast decline / reroute signals

It does not include:

- backend provider identity
- internal product names
- internal notes
- source files
- private commission structure
- private partner portals
- any sensitive borrower data

This is important because future site pages or GPT Actions may read the JSON. The public file should stay clean enough to ship.

---

## Schema Notes

The schema at:

```txt
schemas/ecommerce-funding-options.schema.json
```

validates the rough structure of the public JSON file.

The schema checks for:

- required top-level keys
- primary CTA
- guardrails
- required intake fields
- category objects
- routing rule objects
- product objects
- fast decline / reroute signals

The current test file uses Node built-in assertions rather than a dependency like Ajv. That keeps the repo lightweight. If the repo later adds a build step, Ajv can be added for full JSON Schema validation.

---

## Test Notes

Run tests with:

```bash
node --test
```

or directly:

```bash
node --test tests/funding-routing-rules.test.js
```

The test file validates:

- the public JSON loads successfully
- required top-level fields exist
- the CTA URL is present
- direct ecommerce products exist
- categories are unique
- products reference valid categories
- route rules reference valid categories
- weak ROAS routes do not allow CTA usage
- sensitive/private provider fields are not present
- guardrails include approval/guarantee restrictions

---

## Future API Endpoint Ideas

These files can support future endpoints such as:

```txt
/api/recommend-funding-category
/api/funding-routing-options
/api/funding-intake-checklist
/api/funding-risk-flags
```

Suggested endpoint behavior:

### `/api/recommend-funding-category`

Input:

```json
{
  "monthly_revenue": 50000,
  "daily_ad_spend": 1000,
  "roas": 3.0,
  "gross_margin": 0.42,
  "payout_lag_days": 7,
  "cash_gap": 12000,
  "business_stage": "established",
  "platform": "Shopify",
  "use_of_funds": "inventory and ad spend"
}
```

Output:

```json
{
  "diagnosis": "Profitable ads with payout and inventory timing gap.",
  "primary_category_id": "marketplace_seller_growth_capital",
  "backup_category_ids": ["daily_seller_payout", "business_line_of_credit"],
  "cta_allowed": true,
  "cta": {
    "label": "Compare Ecommerce Funding Options",
    "url": "https://tally.so/r/w4R2Ad"
  },
  "warnings": [
    "Funding is subject to underwriting.",
    "Repayment structure must be tested against future cash flow."
  ]
}
```

### `/api/funding-risk-flags`

Input:

```json
{
  "roas": 1.2,
  "gross_margin": 0.18,
  "refund_rate": 0.12,
  "negative_days": 7,
  "current_advances": 2
}
```

Output:

```json
{
  "risk_level": "high",
  "funding_first_move": false,
  "reason": "Weak ROAS, thin margin, negative days, and existing advances suggest funding may worsen the problem.",
  "recommended_next_step": "Reduce spend and fix unit economics before comparing capital."
}
```

---

## Maintenance Checklist

Update the files when:

- a funding category is added or removed
- the CTA changes
- qualification language changes
- product ranges change
- new ecommerce funding options are introduced
- the GPT starts using Actions
- the site exposes funding routing publicly

When updating:

1. Update `data/ecommerce-funding-options.public.json`.
2. Update `knowledge/ecommerce-funding-options.md` to match.
3. Run `node --test`.
4. Update this notes file if paths or logic change.
5. Commit with a clear message.

---

## Strategic Principle

A cash-flow calculator should not become a debt cannon.

The model should tell the user:

- when to scale,
- when to slow down,
- when to fix unit economics,
- when to compare funding,
- and when funding would only make the hole deeper.

The north star is **safer scale**, not bigger chaos with a repayment schedule.
