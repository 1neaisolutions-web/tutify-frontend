import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const BASE = "http://localhost:5173";
const EMAIL = "test1@gmail.com";
const PASSWORD = "123456789aA!";

const outDir = path.resolve("runtime-qa-learning-hub");
await fs.mkdir(outDir, { recursive: true });

const report = {
  authentication: { success: false, detail: "" },
  tests: [],
  artifacts: {},
  debug: {},
};

function addTest(name, pass, observation) {
  report.tests.push({ name, pass, observation });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 2200 } });
const page = await context.newPage();

const consoleErrors = [];
const consoleWarnings = [];
let homeApiPayload = null;

page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
  if (msg.type() === "warning") consoleWarnings.push(msg.text());
});
page.on("response", async (resp) => {
  if (resp.url().includes("/api/v1/learning-hub/home")) {
    try {
      homeApiPayload = await resp.json();
    } catch {
      // ignore parse failures
    }
  }
});

try {
  // Authenticate via API first, then hydrate browser session storage.
  const loginResp = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!loginResp.ok) {
    throw new Error(`login_api_failed_${loginResp.status}`);
  }
  const loginData = await loginResp.json();
  if (!loginData?.access_token || !loginData?.user) {
    throw new Error("login_api_missing_token_or_user");
  }

  const user = loginData.user;
  const roles = Array.isArray(user.roles) ? user.roles : [];
  const rolePriority = { super_admin: 1, org_admin: 2, institution_admin: 3, school_admin: 3, teacher: 4, student: 5, parent: 6 };
  const roleName = roles
    .map((r) => (typeof r?.name === "string" ? r.name : String(r?.name?.value || r?.name || "")))
    .filter(Boolean)
    .sort((a, b) => (rolePriority[a] || 999) - (rolePriority[b] || 999))[0] || "teacher";

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
      roles,
      role: roleName,
      token: loginData.access_token,
      refresh_token: loginData.refresh_token,
    },
    profileDetails: null,
    loading: false,
    updatePasswordLoading: false,
    error: null,
    isAuthenticated: true,
    loginChallenge: null,
    memberships: [],
    activeMembership: null,
  };
  const persistedRoot = JSON.stringify({
    auth: JSON.stringify(authState),
    _persist: JSON.stringify({ version: -1, rehydrated: true }),
  });

  await context.addInitScript(({ token, refresh, persistRoot }) => {
    window.localStorage.setItem("access_token", token);
    window.localStorage.setItem("refresh_token", refresh);
    window.localStorage.setItem("persist:root", persistRoot);
  }, { token: loginData.access_token, refresh: loginData.refresh_token, persistRoot: persistedRoot });

  await page.goto(`${BASE}/learning-hub`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
  report.debug.currentUrl = page.url();
  report.debug.headings = await page.evaluate(() =>
    Array.from(document.querySelectorAll("h1,h2,h3")).map((h) => (h.textContent || "").trim()).filter(Boolean).slice(0, 40)
  );
  report.debug.bodySnippet = (await page.textContent("body"))?.slice(0, 500) || "";
  report.authentication.success = true;
  report.authentication.detail = "Authenticated browser session established.";

  // Test 1: hard refresh
  await page.screenshot({ path: path.join(outDir, "01-full-page-initial.png"), fullPage: true });
  await page.keyboard.down("Control");
  await page.keyboard.down("Shift");
  await page.keyboard.press("KeyR");
  await page.keyboard.up("Shift");
  await page.keyboard.up("Control");
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, "02-after-hard-refresh.png"), fullPage: true });

  const domCounts1 = await page.evaluate(() => {
    const headers = Array.from(document.querySelectorAll("h2,h3")).map((h) => (h.textContent || "").trim().toLowerCase());
    const micro = headers.filter((t) => t.includes("personalized micro-courses")).length;
    const growth = headers.filter((t) => t.includes("ai growth recommendations")).length;
    return { micro, growth };
  });
  addTest(
    "Test 1 — Hard Refresh",
    domCounts1.micro === 1 && domCounts1.growth === 1,
    `Header counts after hard refresh: micro=${domCounts1.micro}, growth=${domCounts1.growth}`
  );

  // Test 2: normal refresh
  await page.reload({ waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outDir, "03-after-normal-refresh.png"), fullPage: true });
  const domCounts2 = await page.evaluate(() => {
    const headers = Array.from(document.querySelectorAll("h2,h3")).map((h) => (h.textContent || "").trim().toLowerCase());
    return {
      micro: headers.filter((t) => t.includes("personalized micro-courses")).length,
      growth: headers.filter((t) => t.includes("ai growth recommendations")).length,
    };
  });
  addTest(
    "Test 2 — Normal Refresh",
    domCounts2.micro === 1 && domCounts2.growth === 1,
    `Header counts after normal refresh: micro=${domCounts2.micro}, growth=${domCounts2.growth}`
  );

  // Test 3: View all -> back
  const viewAll = page.locator('button:has-text("View all"), button:has-text("View All")').first();
  let viewAllWorked = false;
  if (await viewAll.count()) {
    await viewAll.click();
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await page.screenshot({ path: path.join(outDir, "04-view-all-page.png"), fullPage: true });
    await page.goBack({ waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "05-after-view-all-back.png"), fullPage: true });
    viewAllWorked = true;
  }
  const domCounts3 = await page.evaluate(() => {
    const headers = Array.from(document.querySelectorAll("h2,h3")).map((h) => (h.textContent || "").trim().toLowerCase());
    return {
      micro: headers.filter((t) => t.includes("personalized micro-courses")).length,
      growth: headers.filter((t) => t.includes("ai growth recommendations")).length,
    };
  });
  addTest(
    "Test 3 — View All → Back",
    viewAllWorked && domCounts3.micro === 1 && domCounts3.growth === 1,
    `ViewAllClicked=${viewAllWorked}, header counts after back: micro=${domCounts3.micro}, growth=${domCounts3.growth}`
  );

  // Test 4: DOM screenshot and proof
  await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll("h2,h3"));
    for (const n of nodes) {
      const t = (n.textContent || "").trim();
      if (t === "Personalized micro-courses" || t === "AI growth recommendations") {
        n.setAttribute("data-qa-highlight", "true");
      }
    }
  });
  await page.screenshot({ path: path.join(outDir, "06-dom-single-instance-proof.png"), fullPage: true });
  addTest(
    "Test 4 — DOM Single Instance",
    domCounts3.micro === 1 && domCounts3.growth === 1,
    `DOM instances: micro=${domCounts3.micro}, growth=${domCounts3.growth}`
  );

  // Test 5: console
  await page.screenshot({ path: path.join(outDir, "07-console-proof-page.png"), fullPage: true });
  const keyWarnings = consoleWarnings.filter((w) => w.toLowerCase().includes("key") && w.toLowerCase().includes("unique"));
  addTest(
    "Test 5 — Console",
    consoleErrors.length === 0 && keyWarnings.length === 0,
    `consoleErrors=${consoleErrors.length}, keyWarnings=${keyWarnings.length}`
  );

  // Test 6: network and source consistency
  const sourceCheck = await page.evaluate(() => {
    const ls = window.localStorage.getItem("persist:root");
    let parsed = null;
    try {
      parsed = ls ? JSON.parse(ls) : null;
    } catch {
      parsed = null;
    }
    return {
      hasPersistRoot: !!parsed,
    };
  });
  await fs.writeFile(path.join(outDir, "08-learning-hub-home-response.json"), JSON.stringify(homeApiPayload, null, 2));
  addTest(
    "Test 6 — Network + State Consistency",
    !!homeApiPayload && !!homeApiPayload.sections,
    `home.mode=${homeApiPayload?.mode || "n/a"}, sections=${Object.keys(homeApiPayload?.sections || {}).join(",")}, persistRoot=${sourceCheck.hasPersistRoot}`
  );

  // Test 7: authenticated user runtime state
  const runtimeState = {
    mode: homeApiPayload?.mode || null,
    sectionKeys: Object.keys(homeApiPayload?.sections || {}),
  };
  addTest(
    "Test 7 — Authenticated Runtime Behavior",
    !!runtimeState.mode,
    `mode=${runtimeState.mode}, sections=${runtimeState.sectionKeys.join(",")}`
  );

  report.artifacts = {
    screenshots: [
      "01-full-page-initial.png",
      "02-after-hard-refresh.png",
      "03-after-normal-refresh.png",
      "04-view-all-page.png",
      "05-after-view-all-back.png",
      "06-dom-single-instance-proof.png",
      "07-console-proof-page.png",
    ],
    networkResponse: "08-learning-hub-home-response.json",
  };
} catch (e) {
  report.authentication.success = false;
  report.authentication.detail = `Runtime verification failed: ${String(e)}`;
} finally {
  await browser.close();
}

await fs.writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ outDir, authentication: report.authentication, tests: report.tests }, null, 2));
