# Ad Spend Cash Flow Calculator Landing Page

Static landing page files for the **Ad Spend Cash Flow Calculator** GPT.

## Files Included

- `index.html` — Complete landing page markup
- `styles.css` — Mobile-first responsive styling
- `script.js` — Lightweight JavaScript for navigation, reveal animations, sticky header state, and CTA tracking hooks
- `README.md` — Implementation and customization notes

## Primary CTA

**Button text:** Run the Ad Spend Cash Flow Calculator  
**Destination:**  
`https://chatgpt.com/g/g-6a3359a8328c8191acc5cba7968a1639-ad-spend-cash-flow-calculator`

## Secondary CTA

**Button text:** Compare Ecommerce Funding Options  
**Destination:**  
`https://tally.so/r/w4R2Ad`

## Brand Direction

Premium fintech utility with a sharp ecommerce operator edge:

- Clean enough to trust
- Blunt enough to be useful
- Playful enough to avoid sounding like a spreadsheet wearing khakis
- Compliance-safe around funding, profitability, and financial decisions

## Before Publishing

Replace all placeholder content with verified assets:

1. Customer logos
2. Testimonials
3. User counts
4. Case study metrics
5. Founder or brand photo
6. Open Graph image URL
7. Canonical URL
8. Privacy, terms, and legal links
9. Any approved compliance disclaimers required by your business

## Image Placeholder Requirements

### Hero Visual

Recommended size: `1920x1080`

Show a premium fintech-style dashboard with:

- 14-day ecommerce cash-flow forecast
- Ad spend outflows
- Platform payouts
- Supplier payments
- Inventory reorder windows
- Cash-gap warning state

Suggested alt text:

> Ad spend cash flow forecast showing payout lag and ecommerce cash gap risk.

### Logo Row

Recommended size: `200x100` transparent PNGs.

Use real customer, partner, marketplace, or ecosystem logos only with permission.

### Founder / Brand Visual

Recommended size: `800x800`.

Use a real founder/operator photo or branded product visual. Avoid generic stock imagery.

### Testimonial Avatars

Recommended size: `80x80`.

Use real customer photos only with permission.

## SEO Customization

Update these values in `index.html`:

- `<title>`
- `<meta name="description">`
- Canonical URL
- Open Graph URL
- Open Graph image
- Twitter image

## Analytics

The `script.js` file includes a CTA tracking hook.

If Google Analytics is installed, CTA clicks will fire as:

```js
gtag("event", "cta_click", {
  event_category: "landing_page",
  event_label: label
});
```

If Google Analytics is not installed, CTA labels will log to the browser console.

## Compliance Notes

Do **not** publish claims that imply:

- Guaranteed funding approval
- Guaranteed profitability
- Guaranteed ad performance
- Guaranteed revenue increases from scaling ad spend
- Funding is risk-free
- Users should borrow money
- The calculator replaces a CFO, CPA, accountant, lender, underwriter, attorney, or tax professional

The page is intentionally written to position the calculator as a planning and forecasting tool, not as financial advice or an automated decision-maker.

## Deployment

You can deploy these files on any static host, including:

- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages
- Your existing website hosting

Keep all four files in the same directory so `index.html` can load `styles.css` and `script.js`.
