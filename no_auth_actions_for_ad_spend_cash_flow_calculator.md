# No-Auth Action Ideas for Ad Spend Cash Flow Calculator

**Purpose:** This file lists public/no-authentication Action ideas that could later extend the **Ad Spend Cash Flow Calculator** GPT without requiring OAuth, API keys, user login, or private credentials.

**Important:** “No auth” does **not** mean “no risk.” Public endpoints can rate-limit, change terms, go down, or log request data. Do not send sensitive bank data, ad account exports, customer PII, tax IDs, or private store data to third-party public APIs. For sensitive calculations, use your own serverless endpoint with no persistent logging and no secrets in the request.

---

## Best-Fit Public / Open No-Auth Actions

These use public APIs or public feeds that are commonly accessible without user authentication. Always confirm current terms before production use.

| # | Action Name | Public Source | What It Adds | Example Inputs | Example Output | Notes |
|---:|---|---|---|---|---|---|
| 1 | `get_fx_rate` | Frankfurter | Converts supplier invoices, foreign COGS, or marketplace payouts into the seller’s base currency. | base currency, target currency, date | exchange rate | Useful for sellers buying inventory abroad or selling internationally. |
| 2 | `convert_supplier_invoice_currency` | Frankfurter | Converts a foreign inventory/supplier obligation into forecast currency. | amount, source currency, target currency, date | converted amount | Helps avoid fake “cash comfort” caused by currency mismatch. |
| 3 | `get_historical_fx_rate` | Frankfurter | Compares historical FX when reconciling prior payouts or supplier bills. | currency pair, historical date | historical rate | Useful for backtesting prior forecast accuracy. |
| 4 | `get_public_holidays` | Nager.Date | Adds country holidays to payout and supplier-payment timing assumptions. | year, country code | public holiday list | Good for “payout may slip because banks are closed” warnings. |
| 5 | `check_long_weekend_risk` | Nager.Date | Flags long weekends that could delay cash deposits. | country code, date range | holiday/long-weekend risk | Great for 14-day forecasts where timing is tight. |
| 6 | `get_uk_bank_holidays` | GOV.UK Bank Holidays | Adds UK-specific bank holiday timing to payout planning. | year/date range, region | bank holiday list | Useful for UK sellers, suppliers, or payout processors. |
| 7 | `get_weather_forecast_for_shipping_node` | Open-Meteo | Flags weather risk around warehouses, ports, or fulfillment nodes. | latitude, longitude, date range | weather forecast | Useful for freight/fulfillment disruption context, not financial certainty. |
| 8 | `get_us_weather_alerts` | National Weather Service API | Adds U.S. weather-alert context for fulfillment and delivery risk. | latitude, longitude or zone | active alerts | U.S.-focused. Use for operational caution, not cash-flow math by itself. |
| 9 | `geocode_supplier_or_warehouse` | OpenStreetMap Nominatim | Converts address/city into latitude/longitude for shipping or weather checks. | address or city | lat/long, display name | Respect Nominatim usage policy. Not for high-volume batch geocoding. |
| 10 | `reverse_geocode_location` | OpenStreetMap Nominatim | Converts coordinates into a readable place for reports. | latitude, longitude | address/city/country | Helps explain supplier/warehouse geography in plain English. |
| 11 | `lookup_postal_code` | Zippopotam.us | Converts postal/ZIP codes into city, state, country, and coordinates. | country code, postal code | place, region, lat/long | Useful for warehouse/supplier location cleanup. |
| 12 | `get_world_bank_indicator` | World Bank Indicators API | Adds macro context such as inflation, GDP, import/export environment, or country risk proxies. | country, indicator, date range | time series data | Good for context, not underwriting. |
| 13 | `get_country_macro_snapshot` | World Bank Indicators API | Pulls a small bundle of indicators for a supplier/customer market. | country code | inflation/GDP/etc. | Useful for international ecommerce planning notes. |
| 14 | `get_bls_series` | U.S. Bureau of Labor Statistics API v1 | Pulls CPI/PPI/labor series for cost trend context. | BLS series ID, date range | time series data | Helpful for “input costs are rising” narratives. |
| 15 | `get_us_treasury_rate_data` | U.S. Treasury Fiscal Data API | Adds interest-rate / Treasury yield context to funding comparisons. | dataset, date range | Treasury data rows | Context only; do not present as lending advice. |
| 16 | `get_public_company_facts` | SEC EDGAR Companyfacts API | Pulls public company financial facts for benchmarking. | CIK, concept | company financial fact data | Good for public retail/ecommerce comp context. |
| 17 | `get_public_company_submissions` | SEC EDGAR Submissions API | Retrieves filing history for public company comps. | CIK | recent filings metadata | Useful for “how bigger operators discuss inventory/cash risk.” |
| 18 | `lookup_company_ticker_cik` | SEC EDGAR Ticker Mapping | Maps ticker to CIK for SEC lookups. | ticker | CIK/company name | Needed before Companyfacts/Submissions calls. |
| 19 | `get_oecd_indicator` | OECD Data API | Adds international economic context for mature markets. | dataset, dimensions, date range | time series | Useful for international sellers; can be more complex to query. |
| 20 | `get_time_zone_current_time` | Public time API or self-hosted time endpoint | Aligns payout cutoffs and supplier deadlines by timezone. | timezone | current date/time | Use a reliable provider or self-host; some public time APIs have uptime issues. |
| 21 | `fetch_public_google_sheet_csv` | Published Google Sheet CSV URL | Reads public calculator templates or benchmark tables. | published CSV URL | rows/columns | Sheet must be intentionally published to the web. No private sheets. |
| 22 | `fetch_public_csv_template` | Public CSV URL | Imports public forecast templates, example assumptions, or benchmark datasets. | URL | parsed CSV rows | Use allowlisted URLs if you deploy this yourself. |
| 23 | `fetch_public_markdown_playbook` | Public markdown/raw file URL | Pulls open playbooks, glossary files, or calculator examples into the GPT. | raw markdown URL | markdown text | Best for your own public GitHub/raw knowledge files. |
| 24 | `test_action_echo` | httpbin or self-hosted echo endpoint | Tests whether GPT Action schemas are passing inputs correctly. | any JSON payload | echoed payload | Development/debugging only. Remove from production if unnecessary. |
| 25 | `test_action_sample_data` | JSONPlaceholder or self-hosted test API | Lets you verify OpenAPI schema behavior with harmless sample data. | sample ID/query | sample JSON | Development/debugging only; not business logic. |

---

## High-Utility No-Auth Self-Hosted Calculator Actions

These are not “public data APIs.” They are simple public endpoints you could deploy yourself on Cloudflare Workers, Vercel, Render, Railway, Fly.io, AWS Lambda Function URLs, or similar. They require no user login, but should still avoid sensitive data retention. These would massively improve utility because the GPT can call deterministic calculators instead of doing every computation conversationally.

| # | Action Name | What It Does | Example Inputs | Example Output | Why It Helps |
|---:|---|---|---|---|---|
| 26 | `normalize_forecast_inputs` | Cleans messy user-provided forecast data into canonical fields. | raw values, currency symbols, notes | normalized JSON | Prevents garbage-in-garbage-out when founders paste chaos. |
| 27 | `build_14_day_cash_forecast` | Produces the full daily cash forecast table. | starting cash, spend, ROAS, margins, payout delay, obligations | daily forecast rows | Makes the core GPT calculator more reliable and repeatable. |
| 28 | `build_30_day_cash_forecast` | Extends the forecast to 30 days. | same as above | 30-day forecast rows | Better for inventory cycles and repayment stress testing. |
| 29 | `compare_cash_scenarios` | Compares hold, reduce, scale, and funded scenarios side by side. | base case plus scenario assumptions | scenario summary table | Helps users see tradeoffs without spreadsheet goblin warfare. |
| 30 | `solve_safe_daily_ad_spend` | Solves estimated safe daily ad spend based on buffer and known obligations. | cash, receipts, obligations, forecast days, buffer | safe daily spend | Turns “Can I scale?” into a concrete estimate. |
| 31 | `solve_break_even_roas` | Calculates ROAS needed to break even at given margins and costs. | gross margin, contribution margin, fees, refunds | break-even ROAS | Detects when the ad dashboard is lying with a straight face. |
| 32 | `estimate_contribution_margin` | Estimates contribution margin from cost components. | COGS, shipping, processing, refunds, discounts, variable costs | estimated contribution margin | Helps users who do not know their true contribution margin. |
| 33 | `simulate_payout_lag` | Maps sales days to actual cash receipt days. | sales by day, payout delay, payout schedule | cash receipt calendar | Makes payout timing visible instead of mystical. |
| 34 | `build_payout_calendar` | Creates date-aware expected payout dates. | sale dates, delay days, holidays, weekends | payout calendar | Useful when bank holidays and weekends matter. |
| 35 | `detect_inventory_cash_collision` | Flags days when inventory/supplier obligations collide with low cash. | forecast rows, payment schedule, buffer | collision warnings | Great for “profitable but cash-starved” diagnoses. |
| 36 | `stress_test_refund_reserve` | Tests cash impact at multiple refund reserve levels. | base forecast, refund rates | scenario table | Shows whether returns/chargebacks can crack the cash plan. |
| 37 | `stress_test_roas_drop` | Tests cash impact if ROAS declines. | base forecast, ROAS shocks | scenario table | Keeps founders from assuming best-case ads forever. |
| 38 | `stress_test_repayment` | Tests funding repayment impact across daily/weekly/monthly repayment schedules. | funding amount, repayment amount, frequency | cash impact table | Prevents capital from becoming a fancy shovel. |
| 39 | `estimate_funding_gap` | Calculates a timing-related funding gap with cushion. | cash gap, obligations, cushion % | estimated funding gap | Keeps “maybe review working capital” grounded and non-hypey. |
| 40 | `classify_decision_tag` | Assigns Scale, Hold, Fix, or Fund based on rule thresholds. | forecast metrics, margins, gap causes | decision tag + reasons | Improves consistency across conversations. |
| 41 | `generate_owner_summary` | Returns a structured plain-English operator summary. | forecast outputs, tag, risks | summary sections | Keeps reports crisp and founder-readable. |
| 42 | `generate_next_actions` | Produces tactical next steps from forecast risks. | tag, cash gap, payout lag, margin status | action list | Turns forecast into movement, not spreadsheet cosplay. |
| 43 | `validate_uploaded_csv_schema` | Checks whether uploaded/exported CSV columns match expected fields. | column headers, sample rows | mapping and missing fields | Useful for Shopify, Meta Ads, Amazon, or payout exports. |
| 44 | `map_columns_to_calculator_fields` | Maps messy export column names to forecast fields. | headers, sample values | field mapping JSON | Reduces manual cleanup before analysis. |
| 45 | `generate_forecast_markdown_report` | Converts forecast JSON into a clean markdown report. | forecast outputs | markdown report | Makes the GPT’s output reusable as a client deliverable. |
| 46 | `generate_csv_forecast_export` | Converts forecast rows to downloadable CSV text. | forecast rows | CSV string | Lets users paste into Sheets without rebuilding formulas. |
| 47 | `generate_google_sheets_formula_template` | Builds a formula-ready Sheets template. | forecast settings | CSV/formula table | Good lead magnet: “cash-flow calculator in a sheet.” |
| 48 | `score_data_quality` | Scores whether the input set is forecast-ready. | assumptions, known/unknown fields | quality score + warnings | Helps the GPT say when the forecast is shaky. |
| 49 | `build_funding_readiness_snapshot` | Checks whether the situation looks timing-related or economics-related. | margins, cash gap, payout lag, obligations | readiness notes | Not an approval screen; just a planning signal. |
| 50 | `red_flag_detector` | Flags reckless scaling, bad margin math, missing payout data, or repayment risk. | full forecast payload | red flags | Protects the cash and the founder’s sanity. |

---

## Recommended Top 10 to Build First

If you want maximum utility without building a monster truck out of duct tape, start here:

1. `build_14_day_cash_forecast`
2. `compare_cash_scenarios`
3. `solve_safe_daily_ad_spend`
4. `simulate_payout_lag`
5. `detect_inventory_cash_collision`
6. `stress_test_roas_drop`
7. `stress_test_repayment`
8. `estimate_contribution_margin`
9. `classify_decision_tag`
10. `generate_forecast_markdown_report`

These would make the GPT feel less like a chat calculator and more like an operator-grade cash-flow command center.

---

## Suggested No-Auth Action Design Rules

1. **Do not send sensitive data to public third-party APIs.**
2. **Use self-hosted endpoints for user-specific financial calculations.**
3. **Do not persist request bodies unless the user explicitly expects storage.**
4. **Add rate limiting even if you do not add authentication.**
5. **Use deterministic JSON outputs for all calculator actions.**
6. **Return assumptions and warnings with every calculated result.**
7. **Version your endpoints:** `/v1/build-forecast`, `/v1/stress-test-roas`, etc.
8. **Keep responses small enough for GPT context.**
9. **Use allowlists for any action that fetches public URLs.**
10. **Never return language implying loan approval, guaranteed performance, or financial advice.**

---

## Example OpenAPI Operation Naming Pattern

Use clean operation IDs that read like tools:

```yaml
operationId: build14DayCashForecast
operationId: solveSafeDailyAdSpend
operationId: simulatePayoutLag
operationId: compareCashScenarios
operationId: classifyDecisionTag
operationId: generateForecastMarkdownReport
```

Keep request and response bodies boring, explicit, and predictable. Boring schemas make powerful agents. Flashy schemas make debugging feel like raccoons in the walls.

---

## Public API Reference Links

Verify current limits, terms, and availability before deploying.

| Source | Use | Documentation |
|---|---|---|
| Frankfurter | FX rates | https://frankfurter.dev/ |
| Nager.Date | Public holidays | https://date.nager.at/api |
| GOV.UK Bank Holidays | UK bank holidays | https://www.api.gov.uk/gds/bank-holidays/ |
| Open-Meteo | Weather forecasts | https://open-meteo.com/ |
| National Weather Service API | U.S. weather alerts/forecasts | https://www.weather.gov/documentation/services-web-api |
| OpenStreetMap Nominatim | Geocoding/reverse geocoding | https://nominatim.org/release-docs/latest/api/Overview/ |
| Zippopotam.us | Postal code lookup | https://docs.zippopotam.us/docs/getting-started/ |
| World Bank Indicators API | Macro indicators | https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation |
| BLS Public Data API | CPI/PPI/labor time series | https://www.bls.gov/bls/api_features.htm |
| U.S. Treasury Fiscal Data API | Treasury/federal financial datasets | https://fiscaldata.treasury.gov/api-documentation/ |
| SEC EDGAR APIs | Public company facts/filings | https://www.sec.gov/search-filings/edgar-application-programming-interfaces |
| OECD Data API | International economic data | https://www.oecd.org/en/data/insights/data-explainers/2024/09/api.html |
| httpbin | Action testing | https://httpbin.org/ |
| JSONPlaceholder | Action testing sample JSON | https://jsonplaceholder.typicode.com/ |

---

## APIs to Treat Carefully or Avoid for “No Auth”

| API / Source | Why |
|---|---|
| U.S. Census API | Current Census developer page says data queries require an API key. |
| Shopify Admin API | Requires authenticated store access. |
| Amazon Selling Partner API | Requires authentication and authorization. |
| Stripe API | Requires secret keys/OAuth for account data. |
| PayPal APIs | Require credentials for account/payment data. |
| Meta Ads API | Requires OAuth/access tokens. |
| TikTok Ads / TikTok Shop APIs | Require authentication. |
| Google Sheets private spreadsheets | Require auth unless explicitly published to the web. |
| TaxJar / Avalara | Generally require API keys. |
| UPS / FedEx / DHL rating APIs | Typically require authenticated accounts. |

---

## Final Recommendation

For this GPT, the biggest leap will come from **self-hosted no-auth calculator endpoints**, not from public datasets. Public APIs are useful seasoning. The meat is deterministic cash-flow math: forecast builder, payout lag simulator, scenario comparison, safe spend solver, inventory collision detector, and repayment stress tester.

Build those first. Then sprinkle in FX, holiday calendars, weather/disruption context, and public macro data where they help the operator make a cleaner decision.

Protect the cash.
