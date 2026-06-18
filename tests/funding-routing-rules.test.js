/**
 * Funding routing data integrity tests
 *
 * Run:
 *   node --test tests/funding-routing-rules.test.js
 *
 * These tests intentionally avoid external dependencies so the repo can remain
 * a static-first project. They validate the public funding routing data layer
 * used by the Ad Spend Cash Flow Calculator.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const dataPath = path.join(repoRoot, "data", "ecommerce-funding-options.public.json");
const schemaPath = path.join(repoRoot, "schemas", "ecommerce-funding-options.schema.json");

function readJson(filePath) {
  assert.ok(fs.existsSync(filePath), `Missing expected file: ${filePath}`);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const data = readJson(dataPath);
const schema = readJson(schemaPath);

function unique(values) {
  return Array.from(new Set(values));
}

function assertNonEmptyString(value, label) {
  assert.equal(typeof value, "string", `${label} must be a string`);
  assert.ok(value.trim().length > 0, `${label} must not be empty`);
}

function assertArray(value, label, minLength = 0) {
  assert.ok(Array.isArray(value), `${label} must be an array`);
  assert.ok(value.length >= minLength, `${label} must contain at least ${minLength} item(s)`);
}

function assertNoPrivateFields(object, label) {
  const bannedKeys = new Set([
    "internal_product_name",
    "provider_name",
    "backend_provider",
    "commission_structure",
    "partner_portal_url",
    "internal_notes",
    "source_files",
    "submission_method",
    "key_contact"
  ]);

  function walk(node, trail) {
    if (!node || typeof node !== "object") return;
    for (const key of Object.keys(node)) {
      assert.ok(!bannedKeys.has(key), `${label} contains private/internal key: ${trail}.${key}`);
      walk(node[key], `${trail}.${key}`);
    }
  }

  walk(object, label);
}

test("public data and schema files load", () => {
  assert.equal(data.schema_version, "1.0.0");
  assert.equal(schema.title, "Ecommerce Funding Options Public Routing Schema");
});

test("required top-level sections exist", () => {
  const required = [
    "primary_cta",
    "calculator_positioning",
    "guardrails",
    "required_intake_fields",
    "categories",
    "route_rules",
    "products",
    "response_templates",
    "fast_decline_or_reroute_signals",
    "source_basis_summary"
  ];

  for (const key of required) {
    assert.ok(Object.prototype.hasOwnProperty.call(data, key), `Missing top-level key: ${key}`);
  }
});

test("primary funding CTA is correct and safely constrained", () => {
  assert.equal(data.primary_cta.label, "Compare Ecommerce Funding Options");
  assert.equal(data.primary_cta.url, "https://tally.so/r/w4R2Ad");

  assertArray(data.primary_cta.use_when, "primary_cta.use_when", 2);
  assertArray(data.primary_cta.do_not_use_when, "primary_cta.do_not_use_when", 2);

  const doNotUseText = data.primary_cta.do_not_use_when.join(" ").toLowerCase();
  assert.match(doNotUseText, /roas|gross margin|unit economics|guarantee/);
});

test("guardrails block approval and guarantee claims", () => {
  assertArray(data.guardrails.never_claim, "guardrails.never_claim", 5);

  const neverClaimText = data.guardrails.never_claim.join(" ").toLowerCase();
  assert.match(neverClaimText, /approval/);
  assert.match(neverClaimText, /guaranteed/);

  const sensitivePolicy = data.guardrails.sensitive_data_policy.join(" ").toLowerCase();
  assert.match(sensitivePolicy, /social security/);
  assert.match(sensitivePolicy, /bank statements/);
  assert.match(sensitivePolicy, /secure application/);
});

test("categories have unique ids and required guidance", () => {
  assertArray(data.categories, "categories", 5);

  const ids = data.categories.map((category) => category.id);
  assert.deepEqual(ids, unique(ids), "Category ids must be unique");

  for (const category of data.categories) {
    assertNonEmptyString(category.id, "category.id");
    assertNonEmptyString(category.name, `category(${category.id}).name`);
    assertArray(category.best_for, `category(${category.id}).best_for`, 1);
    assertArray(category.fit_indicators, `category(${category.id}).fit_indicators`, 1);
    assertArray(category.caution_flags, `category(${category.id}).caution_flags`, 1);
    assertNonEmptyString(category.chat_template, `category(${category.id}).chat_template`);
  }
});

test("core ecommerce categories exist", () => {
  const categoryIds = new Set(data.categories.map((category) => category.id));

  for (const expected of [
    "marketplace_seller_growth_capital",
    "daily_seller_payout",
    "seller_instant_advance",
    "business_line_of_credit",
    "fast_working_capital",
    "startup_credit_leverage",
    "structured_growth_capital",
    "do_not_fund_fix_economics"
  ]) {
    assert.ok(categoryIds.has(expected), `Missing expected category: ${expected}`);
  }
});

test("products are public-safe and point to valid categories", () => {
  assertArray(data.products, "products", 4);

  const categoryIds = new Set(data.categories.map((category) => category.id));

  for (const product of data.products) {
    assertNonEmptyString(product.name, "product.name");
    assertNonEmptyString(product.slug, `product(${product.name}).slug`);
    assert.ok(categoryIds.has(product.category_id), `Product ${product.name} references unknown category ${product.category_id}`);

    assert.ok(product.amount_range && typeof product.amount_range === "object", `Product ${product.name} missing amount_range`);
    assert.ok(product.minimums && typeof product.minimums === "object", `Product ${product.name} missing minimums`);
    assertArray(product.documents_required, `product(${product.name}).documents_required`);
    assertArray(product.common_disqualifiers, `product(${product.name}).common_disqualifiers`);

    assert.ok(["primary", "secondary", "fallback"].includes(product.routing_priority), `Invalid routing priority for ${product.name}`);
    assert.equal(product.user_facing, true, `Product ${product.name} should be user_facing true in public data`);
  }

  assertNoPrivateFields(data.products, "products");
});

test("direct ecommerce products are present", () => {
  const directEcommerceProducts = data.products.filter((product) => product.routing_priority === "primary");
  assert.ok(directEcommerceProducts.length >= 4, "Expected at least 4 primary ecommerce product examples");

  const directCategoryIds = new Set(directEcommerceProducts.map((product) => product.category_id));
  assert.ok(directCategoryIds.has("marketplace_seller_growth_capital"));
  assert.ok(directCategoryIds.has("daily_seller_payout"));
  assert.ok(directCategoryIds.has("seller_instant_advance"));
});

test("route rules reference valid categories", () => {
  assertArray(data.route_rules, "route_rules", 4);

  const categoryIds = new Set(data.categories.map((category) => category.id));

  for (const rule of data.route_rules) {
    assertNonEmptyString(rule.id, "route_rule.id");
    assertNonEmptyString(rule.scenario, `route_rule(${rule.id}).scenario`);
    assert.ok(categoryIds.has(rule.primary_category_id), `Rule ${rule.id} references unknown primary category ${rule.primary_category_id}`);

    for (const backupCategoryId of rule.backup_category_ids) {
      assert.ok(categoryIds.has(backupCategoryId), `Rule ${rule.id} references unknown backup category ${backupCategoryId}`);
    }

    assert.equal(typeof rule.cta_allowed, "boolean", `Rule ${rule.id}.cta_allowed must be boolean`);
    assertNonEmptyString(rule.response_guidance, `route_rule(${rule.id}).response_guidance`);
  }
});

test("weak ROAS or thin-margin scenario blocks funding CTA", () => {
  const weakRule = data.route_rules.find((rule) => rule.id === "weak_roas_or_margin");

  assert.ok(weakRule, "Missing route rule: weak_roas_or_margin");
  assert.equal(weakRule.primary_category_id, "do_not_fund_fix_economics");
  assert.equal(weakRule.cta_allowed, false);
  assert.deepEqual(weakRule.backup_category_ids, []);
});

test("profitable payout-lag scenario routes to payout acceleration", () => {
  const payoutRule = data.route_rules.find((rule) => rule.id === "profitable_ads_payout_lag");

  assert.ok(payoutRule, "Missing route rule: profitable_ads_payout_lag");
  assert.equal(payoutRule.primary_category_id, "daily_seller_payout");
  assert.equal(payoutRule.cta_allowed, true);
  assert.ok(payoutRule.backup_category_ids.includes("marketplace_seller_growth_capital"));
});

test("inventory cash-conversion scenario routes to marketplace seller capital", () => {
  const inventoryRule = data.route_rules.find((rule) => rule.id === "inventory_cash_conversion_gap");

  assert.ok(inventoryRule, "Missing route rule: inventory_cash_conversion_gap");
  assert.equal(inventoryRule.primary_category_id, "marketplace_seller_growth_capital");
  assert.equal(inventoryRule.cta_allowed, true);
  assert.ok(inventoryRule.backup_category_ids.includes("seller_instant_advance"));
});

test("response templates contain both funding and no-funding paths", () => {
  assertArray(data.response_templates.cash_gap_with_funding_fit, "response_templates.cash_gap_with_funding_fit", 3);
  assertArray(data.response_templates.do_not_fund_yet, "response_templates.do_not_fund_yet", 3);

  const doNotFundTemplate = data.response_templates.do_not_fund_yet.join(" ").toLowerCase();
  assert.match(doNotFundTemplate, /unit-economics|unit economics/);
});

test("fast reroute signals cover seller account and bank activity risks", () => {
  assertArray(data.fast_decline_or_reroute_signals, "fast_decline_or_reroute_signals", 5);

  const signals = data.fast_decline_or_reroute_signals.join(" ").toLowerCase();
  assert.match(signals, /suspended seller account/);
  assert.match(signals, /nsfs|negative bank days/);
  assert.match(signals, /gross margin/);
});
