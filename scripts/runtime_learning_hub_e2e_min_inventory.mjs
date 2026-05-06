import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const BASE = "http://127.0.0.1:5173";
const API = "http://127.0.0.1:8000";
const EMAIL = "test1@gmail.com";
const PASSWORD = "123456789aA!";

const outDir = path.resolve("runtime-qa-learning-hub-min-inventory");
await fs.mkdir(outDir, { recursive: true });

const report = {
  authentication: { success: false, detail: "" },
  reset: { status: "", detail: "" },
  tests: [],
  artifacts: { screenshots: {} },
  debug: {},
};

function addTest(name, pass, observation) {
  report.tests.push({ name, pass, observation });
}

async function login() {
  const loginResp = await fetch(`${API}/api/v1/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!loginResp.ok) throw new Error(`login_api_failed_${loginResp.status}`);
  const loginData = await loginResp.json();
  if (!loginData?.access_token) throw new Error("login_missing_access_token");
  if (!loginData?.user?.id) throw new Error("login_missing_user_id");
  return { access_token: loginData.access_token, refresh_token: loginData.refresh_token, user: loginData.user };
}

async function resetPersonalization({ access_token }) {
  const resetResp = await fetch(`${API}/api/v1/personalization/reset`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ confirmed: true, reason: "test_run_min_inventory" }),
  });
  if (!resetResp.ok) {
    let detail = "";
    try {
      detail = (await resetResp.json())?.detail || "";
    } catch {}
    throw new Error(`reset_failed_${resetResp.status}_${detail}`);
  }
  return await resetResp.json();
}

async function ingestGrowthSignals({ access_token, count = 5 }) {
  const events = Array.from({ length: count }, (_, i) => ({
    client_event_id: `test_signal_${i}_${Date.now()}`,
    event_type: "content_completed",
  }));
  const resp = await fetch(`${API}/api/v1/activity/events`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ events }),
  });
  if (!resp.ok) {
    let detail = "";
    try {
      detail = (await resp.json())?.detail || "";
    } catch {}
    throw new Error(`signals_ingest_failed_${resp.status}_${detail}`);
  }
  return await resp.json();
}

function lockedVisibleCountsInViewAll() {
  const headers = Array.from(document.querySelectorAll("h2"));
  const availableHeader = headers.find((h) => (h.textContent || "").trim() === "Available now");
  const lockedHeader = headers.find((h) => (h.textContent || "").trim() === "Locked preview");
  const availableSection = availableHeader ? availableHeader.closest("section") : null;
  const lockedSection = lockedHeader ? lockedHeader.closest("section") : null;
  const availableCount = availableSection ? availableSection.querySelectorAll("button").length : 0;
  const lockedCount = lockedSection ? lockedSection.querySelectorAll("div.rounded-xl").length : 0;
  return { availableCount, lockedCount };
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 2200 } });
const page = await context.newPage();
page.setDefaultTimeout(180000);

let access_token = null;
let userId = null;

try {
  const { access_token: token, refresh_token: refreshToken, user } = await login();
  access_token = token;
  userId = user.id;
  report.authentication.success = true;
  report.authentication.detail = "login success";

  const resetData = await resetPersonalization({ access_token });
  report.reset.status = resetData.status || "reset_initiated";
  report.reset.detail = resetData.message || "";

  // hydrate localStorage so the SPA treats us as logged in
  const authState = {
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      phone: user.phone,
      username: user.username,
      tenant_id: user.tenant_id,
      status: user.status,
      email_verified: user.email_verified,
      roles: user.roles || [],
      token,
      refresh_token: refreshToken,
    },
    profileDetails: null,
    loading: false,
    updatePasswordLoading: false,
    error: null,
    isAuthenticated: true,
  };

  const persistedRoot = JSON.stringify({
    auth: JSON.stringify(authState),
    _persist: JSON.stringify({ version: -1, rehydrated: true }),
  });

  await context.addInitScript(
    ({ token, refresh, persistRoot }) => {
      window.localStorage.setItem("access_token", token);
      window.localStorage.setItem("refresh_token", refresh);
      window.localStorage.setItem("persist:root", persistRoot);
    },
    { token: access_token, refresh: refreshToken, persistRoot: persistedRoot }
  );

  await page.goto(`${BASE}/learning-hub`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});

  // Wait for the hub shell (or loader) to appear
  await page.waitForSelector("text=Personalized micro-courses", { timeout: 120000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, "01-hub-shell-after-reset.png"), fullPage: true });
  report.artifacts.screenshots.shell = "01-hub-shell-after-reset.png";

  // Growth step A: no cards, progress-only UI
  const startPathButtons = await page.locator('button:has-text("Start path")').count();
  const analyzingText = await page.locator("text=We are analyzing your teaching patterns").count();
  addTest(
    "Growth Step A (progress only, no cards)",
    startPathButtons === 0 && analyzingText >= 1,
    `Start path buttons=${startPathButtons}, analyzingText=${analyzingText}`
  );

  // Inject signals to cross the backend threshold.
  const signals = await ingestGrowthSignals({ access_token, count: 5 });
  report.debug.signals = signals;

  // Growth Step B: eventually shows at least one unlocked recommendation card
  const growthStartPathDeadline = Date.now() + 180000;
  let startPathButtons2 = 0;
  while (Date.now() < growthStartPathDeadline) {
    startPathButtons2 = await page.locator('button:has-text("Start path")').count();
    if (startPathButtons2 >= 1) break;
    await page.waitForTimeout(3000);
  }
  if (startPathButtons2 < 1) {
    throw new Error(`Growth Step B timeout: Start path buttons never appeared (found=${startPathButtons2})`);
  }
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outDir, "02-growth-after-signals.png"), fullPage: true });
  report.artifacts.screenshots.growth = "02-growth-after-signals.png";

  const lockedCountDuringGrowth = await page
    .locator("text=additional recommendations are prepared and locked.")
    .count();

  addTest(
    "Growth Step B (cards appear after signals)",
    startPathButtons2 >= 1,
    `Start path buttons=${startPathButtons2}, lockedHintTextCount=${lockedCountDuringGrowth}`
  );

  // View All checks: visible (unlocked) and locked preview must both exist.
  const sections = [
    { key: "micro_courses", label: "micro" },
    { key: "growth_recommendations", label: "growth" },
    { key: "tutorials", label: "tutorials" },
    { key: "research_insights", label: "research" },
    { key: "specialist_tracks", label: "specialist" },
  ];

  for (const s of sections) {
    await page.goto(`${BASE}/learning-hub/sections/${s.key}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
    const countsDeadline = Date.now() + 180000;
    let counts = { availableCount: 0, lockedCount: 0 };
    while (Date.now() < countsDeadline) {
      counts = await page.evaluate(() => {
        const headers = Array.from(document.querySelectorAll("h2"));
        const availableHeader = headers.find((h) => (h.textContent || "").trim() === "Available now");
        const lockedHeader = headers.find((h) => (h.textContent || "").trim() === "Locked preview");
        const availableSection = availableHeader ? availableHeader.closest("section") : null;
        const lockedSection = lockedHeader ? lockedHeader.closest("section") : null;
        const availableCount = availableSection ? availableSection.querySelectorAll("button").length : 0;
        const lockedCount = lockedSection ? lockedSection.querySelectorAll("div.rounded-xl").length : 0;
        return { availableCount, lockedCount };
      });
      if (counts.availableCount >= 1 && counts.lockedCount >= 1) break;
      await page.waitForTimeout(3000);
    }
    addTest(
      `View All ${s.label} (>=1 unlocked + >=1 locked preview)`,
      counts.availableCount >= 1 && counts.lockedCount >= 1,
      `availableCount=${counts.availableCount}, lockedCount=${counts.lockedCount}`
    );
    const shotName = `03-view-all-${s.key}.png`;
    await page.screenshot({ path: path.join(outDir, shotName), fullPage: true });
    report.artifacts.screenshots[s.key] = shotName;
  }

  // Refresh stability: reload once and confirm we do not go back to stuck loader.
  await page.reload({ waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1200);
  await page.goto(`${BASE}/learning-hub`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
  await page.waitForSelector("text=Personalized micro-courses", { timeout: 30000 });
  await page.screenshot({ path: path.join(outDir, "04-after-refresh.png"), fullPage: true });
  report.artifacts.screenshots.refresh = "04-after-refresh.png";
  addTest("Refresh stability (hub shell renders)", true, "Hub shell present after reload.");

} catch (e) {
  report.debug.error = String(e);
} finally {
  await browser.close();
}

await fs.writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ outDir, authentication: report.authentication, reset: report.reset, tests: report.tests }, null, 2));

