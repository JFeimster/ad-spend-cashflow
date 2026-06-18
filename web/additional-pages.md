Below is the page architecture I’d use for turning this from a single landing page into a real static microsite / GPT product hub.

The key idea: do **not** add everything to the main nav. Keep the primary nav tight and conversion-focused. Put SEO/support/legal pages in the footer.

---

# Recommended primary nav

These are the pages I’d actually put in the top menu:

```text
Home
How It Works
Use Cases
Prompts
Funding Options
API / Actions
```

Optional primary CTA button:

```text
Run Calculator
```

This should always link to the Custom GPT or the on-site calculator section.

---

# Recommended footer nav

Footer should hold lower-intent, trust, docs, legal, and SEO pages:

```text
Docs
API Reference
Privacy
Terms
Disclaimers
GitHub
Contact
```

---

# Best pages to add first

## 1. `how-it-works.html`

**Public:** Yes
**Primary nav:** Yes
**Purpose:** Explain the calculator flow in plain English.

Sections:

```text
1. Enter cash + ad spend assumptions
2. Model payout lag
3. Add inventory / supplier pressure
4. Spot cash gaps
5. Decide: scale, hold, fix, or review funding
```

This is one of the best trust-building pages because it explains the logic without overpromising.

---

## 2. `use-cases.html`

**Public:** Yes
**Primary nav:** Yes
**Purpose:** Show who the tool is for and when to use it.

Use case clusters:

```text
Shopify cash planning
Amazon payout timing
DTC ad scaling
Inventory reorder planning
Refund / chargeback drag
Media buyer client planning
Founder funding prep
```

Good for SEO and conversion.

---

## 3. `prompts.html`

**Public:** Yes
**Primary nav:** Yes
**Purpose:** Give users copy/paste prompts for the Custom GPT.

Example prompt categories:

```text
14-day forecast prompt
Safe ad spend prompt
Inventory cash squeeze prompt
Funding readiness prompt
ROAS vs cash flow prompt
Refund drag prompt
Scale / hold / fix prompt
```

This page directly supports GPT usage.

---

## 4. `funding.html`

**Public:** Yes
**Primary nav:** Yes
**Purpose:** Explain when funding might be worth reviewing, without making lending claims.

CTA:

```text
Compare Ecommerce Funding Options
```

Important positioning:

```text
Funding is not a fix for broken unit economics.
Use the calculator first. Review funding only if timing, inventory, or payout lag is the real bottleneck.
```

This is likely your highest affiliate / lead conversion page.

---

## 5. `api-actions.html`

**Public:** Yes
**Primary nav:** Optional, but I would include it if your audience includes builders/operators.
**Purpose:** Explain the Action endpoints and JSON payloads.

Covers:

```text
POST /api/forecast-cash-flow
POST /api/diagnose-ad-spend-risk
POST /api/calculate-safe-ad-spend
POST /api/recommend-growth-decision
POST /api/generate-analysis-package
POST /api/save-analysis-request
```

Good for credibility and future integrations.

---

## 6. `dashboard.html`

**Public:** Mixed
**Primary nav:** No, unless it works without login
**Secondary/app nav:** Yes
**Purpose:** Future private or semi-private dashboard.

Use this only if you later add login, saved forecasts, history, exports, or API usage.

Suggested path:

```text
app/dashboard.html
```

Rather than root-level `dashboard.html`.

---

# Full list of 35 page ideas

## Core product pages

### 1. `index.html`

**Public:** Yes
**Primary nav:** Home
**Purpose:** Main landing page.

---

### 2. `how-it-works.html`

**Public:** Yes
**Primary nav:** Yes
**Purpose:** Explain the workflow.

---

### 3. `use-cases.html`

**Public:** Yes
**Primary nav:** Yes
**Purpose:** Audience and scenario pages in one.

---

### 4. `prompts.html`

**Public:** Yes
**Primary nav:** Yes
**Purpose:** Prompt library for users.

---

### 5. `examples.html`

**Public:** Yes
**Footer or secondary nav:** Yes
**Purpose:** Show sample inputs and outputs.

Good sections:

```text
Healthy cash flow example
Cash gap example
Inventory squeeze example
ROAS trap example
Funding review example
```

---

### 6. `calculator.html`

**Public:** Yes
**Primary nav or CTA:** CTA only
**Purpose:** Dedicated on-site calculator page.

Useful if the homepage gets crowded.

---

### 7. `forecast-template.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** A static template users can copy.

Could include a spreadsheet-style layout and GPT prompt block.

---

## Funding and monetization pages

### 8. `funding.html`

**Public:** Yes
**Primary nav:** Yes
**Purpose:** Funding education + funding comparison CTA.

---

### 9. `funding-readiness.html`

**Public:** Yes
**Footer or secondary nav:** Yes
**Purpose:** Help users check whether funding is even worth reviewing.

Important message:

```text
Do not fund bad unit economics.
```

---

### 10. `working-capital.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** Explain ecommerce working capital timing.

---

### 11. `inventory-financing.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** SEO page for inventory cash pressure.

---

### 12. `payout-lag.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** Explain how payout delays affect scaling.

---

### 13. `roas-vs-cash-flow.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** High-value SEO/trust page.

Strong hook:

```text
ROAS can look great while your bank account gets wrecked.
```

---

## Audience-specific pages

### 14. `shopify-cash-flow.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** Shopify-specific landing page.

---

### 15. `amazon-seller-cash-flow.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** Amazon payout and inventory timing page.

---

### 16. `dtc-ad-spend-calculator.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** DTC founder-focused SEO page.

---

### 17. `media-buyers.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** Position tool for agencies/media buyers.

Angle:

```text
Help clients understand cash timing before they blame the ads.
```

---

### 18. `ecommerce-founders.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** Founder/operator page.

---

### 19. `finance-operators.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** More analytical audience.

---

## Comparison / SEO pages

### 20. `best-gpt-for-ecommerce-cash-flow.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** “Best GPT for X” SEO page.

---

### 21. `ad-spend-calculator-vs-spreadsheet.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** Compare GPT workflow vs spreadsheet planning.

---

### 22. `cash-flow-calculator-for-shopify.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** Exact-match SEO page.

---

### 23. `ad-spend-forecasting.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** Educational SEO page.

---

### 24. `paid-ads-cash-gap.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** SEO page around the pain point.

---

### 25. `ecommerce-cash-gap-calculator.html`

**Public:** Yes
**Footer / SEO nav:** Yes
**Purpose:** Strong search-intent page.

---

## API / developer / GPT Action pages

### 26. `api-actions.html`

**Public:** Yes
**Primary nav or footer:** Primary if builders matter, otherwise footer
**Purpose:** Explain API and Custom GPT Actions.

---

### 27. `api-reference.html`

**Public:** Yes
**Footer:** Yes
**Purpose:** HTML version of your API docs.

---

### 28. `json-schema.html`

**Public:** Yes
**Footer:** Optional
**Purpose:** Explain payload structure.

---

### 29. `gpt-action-setup.html`

**Public:** Maybe
**Footer:** Optional
**Purpose:** Walkthrough for connecting the Custom GPT Action.

If this is more internal, keep it in `/docs/` instead.

---

### 30. `integrations.html`

**Public:** Yes
**Footer or secondary nav:** Yes
**Purpose:** Future page for Vercel, GitHub, ChatGPT, Tally, Zapier, Make, Shopify, etc.

---

## Lead magnet / conversion pages

### 31. `cash-gap-checklist.html`

**Public:** Yes
**Footer / CTA blocks:** Yes
**Purpose:** Lead magnet page.

Offer:

```text
Download the Ecommerce Cash Gap Checklist
```

---

### 32. `scale-readiness-score.html`

**Public:** Yes
**Secondary nav / CTA:** Yes
**Purpose:** Lightweight quiz-style page.

Could later become:

```text
/api/diagnose-ad-spend-risk
```

---

### 33. `funding-prep-checklist.html`

**Public:** Yes
**Footer / Funding page CTA:** Yes
**Purpose:** Soft lead magnet before Tally form.

---

### 34. `cash-flow-audit.html`

**Public:** Yes
**Secondary nav:** Optional
**Purpose:** Service/consulting offer page if you ever want to sell reviews.

---

### 35. `book-demo.html`

**Public:** Yes
**CTA only / footer:** Yes
**Purpose:** Optional booking page.

Use only if there is a real booking flow.

---

## App / logged-in pages

These should not be in the public primary nav until they work.

### 36. `app/dashboard.html`

**Public:** No, login recommended
**App nav:** Yes
**Purpose:** Saved forecasts, history, results.

---

### 37. `app/forecast.html`

**Public:** No or semi-public
**App nav:** Yes
**Purpose:** Full calculator experience.

---

### 38. `app/history.html`

**Public:** No
**App nav:** Yes
**Purpose:** Saved previous forecasts.

---

### 39. `app/settings.html`

**Public:** No
**App nav:** Yes
**Purpose:** User settings, business assumptions, default payout lag, etc.

---

### 40. `app/export.html`

**Public:** No
**App nav:** Optional
**Purpose:** Export forecast to CSV, JSON, or PDF.

---

## Legal and trust pages

### 41. `legal/terms.html`

**Public:** Yes
**Footer:** Yes
**Purpose:** Terms of Service.

---

### 42. `legal/privacy.html`

**Public:** Yes
**Footer:** Yes
**Purpose:** Privacy Policy.

---

### 43. `legal/disclaimer.html`

**Public:** Yes
**Footer:** Yes
**Purpose:** Financial/tool disclaimer.

This is important for your tool.

---

### 44. `legal/affiliate-disclosure.html`

**Public:** Yes
**Footer:** Yes, especially if funding CTA may create compensation
**Purpose:** Disclose affiliate/referral relationships.

---

### 45. `legal/data-policy.html`

**Public:** Yes
**Footer:** Optional
**Purpose:** Explain what happens to submitted calculator data.

Useful if you add `/api/save-analysis-request`.

---

## Utility pages

### 46. `contact.html`

**Public:** Yes
**Footer:** Yes
**Purpose:** Basic contact/support.

---

### 47. `changelog.html`

**Public:** Yes
**Footer:** Optional
**Purpose:** Show product updates.

Good for trust if you keep improving the GPT.

---

### 48. `roadmap.html`

**Public:** Yes
**Footer:** Optional
**Purpose:** Public roadmap.

---

### 49. `status.html`

**Public:** Yes
**Footer:** Optional
**Purpose:** API/tool availability page.

Only worth it once APIs are real.

---

### 50. `404.html`

**Public:** Yes
**Not in nav**
**Purpose:** Custom error page.

---

# Recommended folder structure for these pages

```text
ad-spend-cashflow/
├── index.html
├── how-it-works.html
├── use-cases.html
├── prompts.html
├── funding.html
├── api-actions.html
├── examples.html
├── calculator.html
├── contact.html
├── 404.html
│
├── legal/
│   ├── terms.html
│   ├── privacy.html
│   ├── disclaimer.html
│   ├── affiliate-disclosure.html
│   └── data-policy.html
│
├── app/
│   ├── dashboard.html
│   ├── forecast.html
│   ├── history.html
│   ├── settings.html
│   └── export.html
│
├── seo/
│   ├── roas-vs-cash-flow.html
│   ├── payout-lag.html
│   ├── working-capital.html
│   ├── inventory-financing.html
│   ├── shopify-cash-flow.html
│   ├── amazon-seller-cash-flow.html
│   ├── dtc-ad-spend-calculator.html
│   ├── best-gpt-for-ecommerce-cash-flow.html
│   └── ecommerce-cash-gap-calculator.html
│
└── lead-magnets/
    ├── cash-gap-checklist.html
    ├── scale-readiness-score.html
    └── funding-prep-checklist.html
```

---

# Best phased rollout

## Phase 1: Add these next

```text
how-it-works.html
use-cases.html
prompts.html
funding.html
api-actions.html
legal/disclaimer.html
legal/privacy.html
legal/terms.html
404.html
```

## Phase 2: Add SEO cluster

```text
roas-vs-cash-flow.html
payout-lag.html
working-capital.html
shopify-cash-flow.html
amazon-seller-cash-flow.html
ecommerce-cash-gap-calculator.html
```

## Phase 3: Add app/dashboard pages

```text
app/dashboard.html
app/forecast.html
app/history.html
app/settings.html
```

Only do Phase 3 when you are ready to support saved data, auth, or account-style features.

---

# My opinionated recommendation

For the main nav, use:

```text
How It Works
Use Cases
Prompts
Funding
API
```

For footer, use:

```text
Examples
Docs
Privacy
Terms
Disclaimer
Affiliate Disclosure
GitHub
Contact
```

Do **not** put `dashboard.html` in the public primary nav until it actually has login or saved forecasts. Otherwise visitors will click into an unfinished app surface and trust drops fast.
