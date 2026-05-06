/**
 * Smoke check: authenticated GET /learning-hub/home includes profile_completeness
 * (used after Profile → personalization pipeline changes).
 *
 * Usage: node scripts/profile_personalization_sync_smoke.mjs
 * Requires: API at http://127.0.0.1:8000, credentials via env PROFILE_SMOKE_EMAIL / PROFILE_SMOKE_PASSWORD
 */
const API = process.env.API_BASE || "http://127.0.0.1:8000";
const EMAIL = process.env.PROFILE_SMOKE_EMAIL || "test1@gmail.com";
const PASSWORD = process.env.PROFILE_SMOKE_PASSWORD || "";

async function main() {
  if (!PASSWORD) {
    console.error("Set PROFILE_SMOKE_PASSWORD (or pass default test user password in env).");
    process.exit(1);
  }
  const loginResp = await fetch(`${API}/api/v1/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!loginResp.ok) {
    console.error("login failed", loginResp.status);
    process.exit(1);
  }
  const { access_token: token } = await loginResp.json();
  const homeResp = await fetch(`${API}/api/v1/learning-hub/home`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!homeResp.ok) {
    console.error("home failed", homeResp.status);
    process.exit(1);
  }
  const data = await homeResp.json();
  if (!("profile_completeness" in data)) {
    console.error("FAIL: profile_completeness missing from learning-hub/home");
    process.exit(1);
  }
  console.log("OK: profile_completeness present", JSON.stringify(data.profile_completeness));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
