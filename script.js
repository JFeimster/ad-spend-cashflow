const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".primary-nav a");
const year = document.querySelector("#year");
const form = document.querySelector("#cashflow-form");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

function closeMobileNav() {
  document.body.classList.remove("nav-open");
  if (navToggle) navToggle.setAttribute("aria-expanded", "false");
}

function getNumber(id, fallback = 0) {
  const field = document.getElementById(id);
  if (!field) return fallback;
  const value = Number(field.value);
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function forecastCashFlow() {
  const startingCash = getNumber("startingCash", 0);
  const dailyAdSpend = getNumber("dailyAdSpend", 0);
  const roas = getNumber("roas", 0);
  const grossMargin = clamp(getNumber("grossMargin", 0), 0, 100) / 100;
  const payoutLag = Math.round(clamp(getNumber("payoutLag", 0), 0, 14));
  const inventoryPayment = getNumber("inventoryPayment", 0);
  const inventoryDay = Math.round(clamp(getNumber("inventoryDay", 1), 1, 14));
  const refundRate = clamp(getNumber("refundRate", 0), 0, 100) / 100;

  let cash = startingCash;
  const cashByDay = [];
  let paidRevenueTotal = 0;

  for (let day = 1; day <= 14; day += 1) {
    const adCostToday = dailyAdSpend;
    const revenueGeneratedOnPayoutDay = day > payoutLag ? dailyAdSpend * roas : 0;
    const revenueAfterRefundDrag = revenueGeneratedOnPayoutDay * (1 - refundRate);
    const contributionCashIn = revenueAfterRefundDrag * grossMargin;
    const supplierPaymentToday = day === inventoryDay ? inventoryPayment : 0;

    cash = cash - adCostToday - supplierPaymentToday + contributionCashIn;
    paidRevenueTotal += revenueAfterRefundDrag;
    cashByDay.push({
      day,
      cash,
      paidRevenue: revenueAfterRefundDrag,
      supplierPayment: supplierPaymentToday
    });
  }

  const lowest = cashByDay.reduce((min, current) => current.cash < min.cash ? current : min, cashByDay[0]);
  const ending = cashByDay[cashByDay.length - 1];

  let title = "Scale looks cash-safe, but keep watching the trough.";
  let copy = "This preview does not show a negative cash point. The next question is whether your assumptions are conservative enough and whether inventory timing holds up.";
  let tone = "safe";

  if (lowest.cash < 0) {
    title = "Cash gap detected. Do not let ROAS seduce you.";
    copy = "Your estimated low point goes negative inside the 14-day window. Hold scale, fix the timing, improve contribution economics, delay spend, or review funding options with human judgment.";
    tone = "danger";
  } else if (lowest.cash < startingCash * 0.2) {
    title = "Thin cash buffer. Hold scale until timing improves.";
    copy = "You may avoid going negative, but the low point is tight. Review payout lag, inventory payments, refund drag, and supplier timing before adding more ad spend.";
    tone = "warning";
  } else if (ending.cash < startingCash) {
    title = "Cash shrinks before it recovers. Scale carefully.";
    copy = "The preview suggests cash pressure even without a negative trough. Run the GPT with fuller assumptions before increasing spend.";
    tone = "warning";
  }

  updateResults({ lowest, ending, paidRevenueTotal, cashByDay, title, copy, tone });
}

function updateResults({ lowest, ending, paidRevenueTotal, cashByDay, title, copy, tone }) {
  const titleEl = document.querySelector("#resultTitle");
  const lowestCashEl = document.querySelector("#lowestCash");
  const lowestDayEl = document.querySelector("#lowestDay");
  const paidRevenueEl = document.querySelector("#paidRevenue");
  const endingCashEl = document.querySelector("#endingCash");
  const copyEl = document.querySelector("#resultCopy");
  const barsEl = document.querySelector("#forecastBars");

  if (titleEl) titleEl.textContent = title;
  if (lowestCashEl) lowestCashEl.textContent = currency.format(lowest.cash);
  if (lowestDayEl) lowestDayEl.textContent = `Day ${lowest.day}`;
  if (paidRevenueEl) paidRevenueEl.textContent = currency.format(paidRevenueTotal);
  if (endingCashEl) endingCashEl.textContent = currency.format(ending.cash);
  if (copyEl) copyEl.textContent = copy;

  if (!barsEl) return;

  const maxAbsCash = Math.max(...cashByDay.map(item => Math.abs(item.cash)), 1);
  barsEl.innerHTML = "";

  cashByDay.forEach(item => {
    const bar = document.createElement("button");
    const height = 12 + (Math.abs(item.cash) / maxAbsCash) * 88;
    bar.type = "button";
    bar.className = "forecast-bar";
    bar.style.setProperty("--bar-height", `${height}%`);
    bar.dataset.label = `Day ${item.day}: ${currency.format(item.cash)}`;
    bar.setAttribute("aria-label", `Day ${item.day} projected cash ${currency.format(item.cash)}`);

    if (item.cash < 0 || tone === "danger") {
      bar.classList.add("is-danger");
    } else if (tone === "warning") {
      bar.classList.add("is-warning");
    }

    barsEl.appendChild(bar);
  });
}

setHeaderState();
forecastCashFlow();

window.addEventListener("scroll", setHeaderState, { passive: true });

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", closeMobileNav);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMobileNav();
});

if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();
    forecastCashFlow();
  });

  form.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", forecastCashFlow);
  });
}
