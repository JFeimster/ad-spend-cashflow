# data/

This folder contains structured, machine-readable data used by the **Ad Spend Cash Flow Calculator** repo.

The files in this directory are designed for:

- Static site logic
- Future API / GPT Actions routing
- Funding option lookup
- Schema validation
- Test coverage
- Public-safe product/category references

## Current Files

```txt
data/
└── ecommerce-funding-options.public.json
```

## File: ecommerce-funding-options.public.json

### Purpose

`ecommerce-funding-options.public.json` is the public-safe structured funding router for ecommerce sellers.

It supports routing users from an ad spend cash-flow forecast into the most logical funding category based on:

- Payout lag
- Inventory timing
- Ad spend pressure
- Marketplace/seller revenue
- ROAS and margin strength
- Urgency
- Business maturity
- Platform health
- Repayment risk

This file is not a lender database and should not be treated as underwriting logic.

It is a routing and education layer.

## What This Data Should Do

Use this data to help determine which funding category may be worth comparing after a user runs the calculator.

Examples:

- Profitable ads + payout delay → payout acceleration or seller growth capital
- Profitable ads + inventory shortage → seller growth capital or line of credit
- Recurring small gaps → revolving access / business line of credit
- Severe urgent gap → fast working capital, with repayment warnings
- Weak ROAS or thin margins → no funding recommendation until economics improve
- Early-stage store with little revenue → startup / credit-leverage path

## What This Data Should Not Do

Do **not** use this data to:

- Promise approval
- Claim a user qualifies
- Quote final rates or terms
- Replace underwriting
- Collect sensitive documents
- Recommend borrowing for broken unit economics
- Present funding as guaranteed
- Present Moonshine Capital as a direct lender unless explicitly true elsewhere

Funding recommendations should always be framed as:

> “This may be worth comparing, subject to underwriting.”

## Public-Safe Design

The data in this folder should avoid exposing:

- Backend lender relationships not meant for public display
- Internal-only underwriting notes
- Private commission details
- Sensitive partner routing logic
- Non-public provider instructions
- User financial information

Keep this folder clean enough to ship in a public GitHub repo.

## Related Files

Recommended companion files:

```txt
knowledge/ecommerce-funding-options.md
schemas/ecommerce-funding-options.schema.json
docs/funding-routing-notes.md
tests/funding-routing-rules.test.js
```

## Validation

The JSON data should conform to:

```txt
schemas/ecommerce-funding-options.schema.json
```

The routing behavior should be covered by:

```txt
tests/funding-routing-rules.test.js
```

Run tests from the repo root:

```bash
npm test
```

Or run the routing test directly:

```bash
node --test tests/funding-routing-rules.test.js
```

## Maintenance Rules

When editing files in `data/`:

1. Keep the data public-safe.
2. Keep category names stable unless tests and docs are updated too.
3. Do not add private lender notes.
4. Do not add sensitive user data.
5. Update the schema if the data shape changes.
6. Update tests if routing rules change.
7. Keep CTA URLs consistent with the current offer map.

## Primary CTA

For ecommerce sellers who appear to have a real funding need after running the calculator:

**Compare Ecommerce Funding Options**  
https://tally.so/r/w4R2Ad

## Repo Context

This data supports the **Ad Spend Cash Flow Calculator** GPT and landing page.

The calculator’s job is to help ecommerce sellers determine whether their ad spend is creating:

- A profitable scale opportunity
- A payout-lag cash squeeze
- An inventory timing gap
- A dangerous margin problem
- A funding need worth comparing

The data should serve that mission.

No fluff. No fake certainty. No funding fairy dust.
