const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".primary-nav a");
const year = document.querySelector("#year");
const form = document.querySelector("#cashflow-form");
const leadForm = document.querySelector("#lead-capture-form");

let lastCalculatorPayload = null;
let lastForecastResult = null;
let forecastTimer = null;

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function setHeaderState() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }
function closeMobileNav() { document.body.classList.remove("nav-open"); if (navToggle) navToggle.setAttribute("aria-expanded", "false"); }
function getNumber(id, fallback = 0) { const field = document.getElementById(id); if (!field) return fallback; const value = Number(field.value); return Number.isFinite(value) ? value : fallback; }
function getText(id, fallback = "") { const field = document.getElementById(id); if (!field) return fallback; return String(field.value || "").trim(); }
function getChecked(id) { const field = document.getElementById(id); return Boolean(field && field.checked); }
function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }

function buildCalculatorPayload() {
  return {
    starting_cash: getNumber("startingCash", 0),
    daily_ad_spend: getNumber("dailyAdSpend", 0),
    expected_roas: getNumber("roas", 0),
    gross_margin_percent: clamp(getNumber("grossMargin", 0), 0, 100),
    payout_lag_days: Math.round(clamp(getNumber("payoutLag", 0), 0, 30)),
    inventory_supplier_payment: getNumber("inventoryPayment", 0),
    inventory_payment_day: Math.round(clamp(getNumber("inventoryDay", 1), 1, 30)),
    refund_adjustment_percent: clamp(getNumber("refundRate", 0), 0, 100),
    forecast_window_days: 14
  };
}

async function postJson(url, payload) {
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = await response.json().catch(() => null);
  if (!response.ok) { const error = new Error(data?.error || `Request failed with status ${response.status}`); error.response = data; throw error; }
  return data;
}

function localForecastResult(inputs) {
  const startingCash = Number(inputs.starting_cash) || 0;
  const dailyAdSpend = Number(inputs.daily_ad_spend) || 0;
  const roas = Number(inputs.expected_roas) || 0;
  const grossMarginRate = clamp(Number(inputs.gross_margin_percent) || 0, 0, 100) / 100;
  const payoutLag = Math.round(clamp(Number(inputs.payout_lag_days) || 0, 0, 30));
  const inventoryPayment = Number(inputs.inventory_supplier_payment) || 0;
  const inventoryDay = Math.round(clamp(Number(inputs.inventory_payment_day) || 1, 1, 30));
  const refundRate = clamp(Number(inputs.refund_adjustment_percent) || 0, 0, 100) / 100;
  const forecastWindow = Math.round(clamp(Number(inputs.forecast_window_days) || 14, 7, 30));

  let cash = startingCash;
  let lowestCashBalance = startingCash;
  let lowestCashDay = 0;
  const dailyForecast = [];

  for (let day = 1; day <= forecastWindow; day += 1) {
    const beginningCash = cash;
    cash -= dailyAdSpend;
    let payoutInflow = 0;
    if (day - payoutLag > 0) {
      payoutInflow = dailyAdSpend * roas * grossMarginRate * (1 - refundRate);
      cash += payoutInflow;
    }
    let inventoryOutflow = 0;
    if (day === inventoryDay) { inventoryOutflow = inventoryPayment; cash -= inventoryOutflow; }
    if (cash < lowestCashBalance) { lowestCashBalance = cash; lowestCashDay = day; }
    dailyForecast.push({ day, beginning_cash: Math.round(beginningCash), ad_spend_outflow: Math.round(dailyAdSpend), payout_inflow: Math.round(payoutInflow), inventory_supplier_outflow: Math.round(inventoryOutflow), ending_cash_balance: Math.round(cash), notes: [] });
  }

  const endingCash = dailyForecast[dailyForecast.length - 1]?.ending_cash_balance || cash;
  const estimatedCashGap = lowestCashBalance < 0 ? Math.abs(lowestCashBalance) : 0;
  let recommendation = "hold";
  if (estimatedCashGap > 0) recommendation = "funding_review";
  if (roas < 1.5 || grossMarginRate < 0.35) recommendation = "fix";
  if (estimatedCashGap === 0 && lowestCashBalance > startingCash * 0.25 && endingCash > startingCash) recommendation = "scale";

  return {
    forecast_window_days: forecastWindow,
    starting_cash: Math.round(startingCash),
    lowest_cash_day: lowestCashDay,
    lowest_cash_balance: Math.round(lowestCashBalance),
    estimated_cash_gap: Math.round(estimatedCashGap),
    daily_forecast: dailyForecast,
    recommendation,
    summary: estimatedCashGap > 0 ? `Cash gap detected around day ${lowestCashDay}. ROAS is not the same thing as cash in the bank.` : "No negative cash gap appears in this preview, but payout timing and margin assumptions still matter.",
    disclaimer: "Educational planning estimate only. Not financial, lending, tax, accounting, legal, or professional advice."
  };
}

function getResultTone(result) {
  if (!result) return "warning";
  if (result.lowest_cash_balance < 0 || result.estimated_cash_gap > 0) return "danger";
  if (result.recommendation === "fix" || result.recommendation === "funding_review") return "danger";
  if (result.recommendation === "hold") return "warning";
  return "safe";
}

function getResultTitle(result) {
  if (!result) return "Forecast unavailable.";
  if (result.estimated_cash_gap > 0 || result.lowest_cash_balance < 0) return "Cash gap detected. Do not let ROAS seduce you.";
  const titles = { scale: "Scale looks cash-safe, but keep watching the trough.", hold: "Thin cash buffer. Hold scale until timing improves.", fix: "Fix the economics before pushing spend.", funding_review: "Timing squeeze detected. Review funding only after the economics make sense." };
  return titles[result.recommendation] || "Forecast generated.";
}

function normalizeForecastForDisplay(result) {
  const daily = Array.isArray(result?.daily_forecast) ? result.daily_forecast : [];
  const lowestCashDay = result?.lowest_cash_day ?? 0;
  const lowestCashBalance = Number(result?.lowest_cash_balance || 0);
  const endingBalance = Number(daily[daily.length - 1]?.ending_cash_balance || lowestCashBalance);
  const payoutTotal = daily.reduce((sum, item) => sum + Number(item.payout_inflow || 0), 0);
  return { lowest: { day: lowestCashDay, cash: lowestCashBalance }, ending: { day: daily[daily.length - 1]?.day || 0, cash: endingBalance }, paidRevenueTotal: payoutTotal, cashByDay: daily.map((item) => ({ day: item.day, cash: Number(item.ending_cash_balance || 0) })), title: getResultTitle(result), copy: result?.summary || "Forecast generated.", tone: getResultTone(result) };
}

function updateResults(display) {
  if (!display) return;
  const titleEl = document.querySelector("#resultTitle");
  const lowestCashEl = document.querySelector("#lowestCash");
  const lowestDayEl = document.querySelector("#lowestDay");
  const paidRevenueEl = document.querySelector("#paidRevenue");
  const endingCashEl = document.querySelector("#endingCash");
  const copyEl = document.querySelector("#resultCopy");
  const barsEl = document.querySelector("#forecastBars");
  const { lowest, ending, paidRevenueTotal, cashByDay, title, copy, tone } = display;
  if (titleEl) titleEl.textContent = title;
  if (lowestCashEl) lowestCashEl.textContent = currency.format(lowest.cash);
  if (lowestDayEl) lowestDayEl.textContent = `Day ${lowest.day}`;
  if (paidRevenueEl) paidRevenueEl.textContent = currency.format(paidRevenueTotal);
  if (endingCashEl) endingCashEl.textContent = currency.format(ending.cash);
  if (copyEl) copyEl.textContent = copy;
  if (!barsEl) return;
  const maxAbsCash = Math.max(...cashByDay.map((item) => Math.abs(item.cash)), 1);
  barsEl.innerHTML = "";
  cashByDay.forEach((item) => {
    const bar = document.createElement("button");
    const height = 12 + (Math.abs(item.cash) / maxAbsCash) * 88;
    bar.type = "button";
    bar.className = "forecast-bar";
    bar.style.setProperty("--bar-height", `${height}%`);
    bar.dataset.label = `Day ${item.day}: ${currency.format(item.cash)}`;
    bar.setAttribute("aria-label", `Day ${item.day} projected cash ${currency.format(item.cash)}`);
    if (item.cash < 0 || tone === "danger") bar.classList.add("is-danger");
    else if (tone === "warning") bar.classList.add("is-warning");
    barsEl.appendChild(bar);
  });
}

function forecastCashFlowLocal() {
  const payload = buildCalculatorPayload();
  const result = localForecastResult(payload);
  lastCalculatorPayload = payload;
  lastForecastResult = result;
  updateResults(normalizeForecastForDisplay(result));
}

async function forecastCashFlowFromApi({ silent = false } = {}) {
  const payload = buildCalculatorPayload();
  lastCalculatorPayload = payload;
  if (!silent) { const copyEl = document.querySelector("#resultCopy"); if (copyEl) copyEl.textContent = "Running server-side forecast..."; }
  try {
    const response = await postJson("/api/forecast-cash-flow", payload);
    const result = response.result || response;
    lastForecastResult = result;
    updateResults(normalizeForecastForDisplay(result));
    return result;
  } catch (error) {
    console.warn("API forecast failed. Falling back to local preview.", error);
    const result = localForecastResult(payload);
    lastForecastResult = result;
    updateResults(normalizeForecastForDisplay(result));
    return result;
  }
}

function scheduleForecast() { clearTimeout(forecastTimer); forecastTimer = setTimeout(() => forecastCashFlowFromApi({ silent: true }), 450); }

function buildLeadPayload() {
  return {
    name: getText("leadName"),
    email: getText("leadEmail"),
    store_url: getText("leadStoreUrl"),
    store_type: getText("leadStoreType"),
    monthly_revenue_range: getText("leadMonthlyRevenueRange"),
    notes: getText("leadNotes"),
    consent: getChecked("leadConsent"),
    calculator_inputs: lastCalculatorPayload || buildCalculatorPayload(),
    source: "ad-spend-cashflow-site",
    page_url: window.location.href,
    referrer: document.referrer || "",
    website: getText("leadWebsite")
  };
}

async function submitLeadCapture(event) {
  event.preventDefault();
  const submitButton = leadForm.querySelector("[type='submit']");
  const statusEl = document.querySelector("#leadStatus");
  if (submitButton) submitButton.disabled = true;
  if (statusEl) statusEl.textContent = "Sending request...";
  try {
    if (!lastForecastResult) await forecastCashFlowFromApi({ silent: true });
    const response = await postJson("/api/save-analysis-request", buildLeadPayload());
    if (statusEl) statusEl.textContent = response?.result?.message || "Request received.";
    leadForm.reset();
  } catch (error) {
    console.warn("Lead capture failed.", error);
    if (statusEl) statusEl.textContent = error?.response?.details?.join(" ") || error.message || "Unable to send request.";
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });
if (year) year.textContent = new Date().getFullYear();
if (navToggle) navToggle.addEventListener("click", () => { const isOpen = document.body.classList.toggle("nav-open"); navToggle.setAttribute("aria-expanded", String(isOpen)); });
navLinks.forEach((link) => link.addEventListener("click", closeMobileNav));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMobileNav(); });

if (form) {
  form.addEventListener("submit", (event) => { event.preventDefault(); forecastCashFlowFromApi(); });
  form.querySelectorAll("input").forEach((input) => input.addEventListener("input", () => { forecastCashFlowLocal(); scheduleForecast(); }));
  forecastCashFlowLocal();
  forecastCashFlowFromApi({ silent: true });
}

if (leadForm) leadForm.addEventListener("submit", submitLeadCapture);
