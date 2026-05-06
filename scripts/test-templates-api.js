/**
 * Test script: hits template-related backend API endpoints and verifies
 * all templates are returned and can be used by the frontend.
 *
 * Usage (from frontend root):
 *   npm run test:templates
 *   # or with custom backend:
 *   BACKEND_URL=https://1nebackend-production.up.railway.app npm run test:templates
 *
 * Expects backend at BACKEND_URL (default: http://127.0.0.1:8000).
 * Exit code: 0 if all checks pass, 1 otherwise.
 */

const BACKEND_URL = (process.env.BACKEND_URL || process.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const API_BASE = `${BACKEND_URL}/api`;

const results = { passed: 0, failed: 0, errors: [] };

function log(msg, type = 'info') {
  const prefix = type === 'err' ? '✗' : type === 'ok' ? '✓' : ' ';
  console.log(`${prefix} ${msg}`);
}

function fail(name, message) {
  results.failed++;
  results.errors.push({ name, message });
  log(`${name}: ${message}`, 'err');
}

function pass(name) {
  results.passed++;
  log(`${name}`, 'ok');
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {
    data = text;
  }
  return { ok: res.ok, status: res.status, data, text };
}

async function main() {
  console.log('\n--- Templates API test (frontend → backend) ---\n');
  console.log(`Backend: ${BACKEND_URL}\n`);

  // 1. Health
  try {
    const health = await fetch(`${BACKEND_URL}/health`);
    if (!health.ok) {
      fail('Health', `GET /health returned ${health.status}`);
    } else {
      pass('Health: GET /health returns 200');
    }
  } catch (e) {
    fail('Health', `Request failed: ${e.message}. Is the backend running?`);
  }

  // 2. List templates
  let templates = [];
  try {
    const listRes = await fetchJson(`${API_BASE}/v1/templates`);
    if (!listRes.ok) {
      fail('List templates', `GET /api/v1/templates returned ${listRes.status}`);
    } else if (!Array.isArray(listRes.data)) {
      fail('List templates', 'Response is not an array');
    } else {
      templates = listRes.data;
      pass(`List templates: GET /api/v1/templates returns ${templates.length} template(s)`);
    }
  } catch (e) {
    fail('List templates', e.message);
  }

  if (templates.length === 0) {
    log('No templates in list; skipping detail and stream checks. Run backend seed: python -m app.seed.cli --templates --force', 'err');
  } else {
    // 3. Detail for each template (and ensure frontend-relevant fields exist)
    const slugs = templates.map((t) => t.slug).filter(Boolean);
    log(`Checking detail for ${slugs.length} template(s)...`, 'info');

    for (const slug of slugs) {
      try {
        const detailRes = await fetchJson(`${API_BASE}/v1/templates/${encodeURIComponent(slug)}`);
        if (!detailRes.ok) {
          fail(`Detail ${slug}`, `GET /api/v1/templates/${slug} returned ${detailRes.status}`);
          continue;
        }
        const d = detailRes.data;
        if (!d || typeof d !== 'object') {
          fail(`Detail ${slug}`, 'Response is not an object');
          continue;
        }
        // Frontend expects: id, slug, name (title), description, latest_version.input_schema
        if (!d.slug) fail(`Detail ${slug}`, 'Missing slug');
        else if (!d.name) fail(`Detail ${slug}`, 'Missing name');
        else if (!d.latest_version || typeof d.latest_version.input_schema !== 'object') {
          fail(`Detail ${slug}`, 'Missing latest_version.input_schema (needed for form)');
        } else {
          pass(`Detail: GET /api/v1/templates/${slug}`);
        }
      } catch (e) {
        fail(`Detail ${slug}`, e.message);
      }
    }

    // 4. Execute-stream (one template) – minimal payload for lesson_planner
    const streamSlug = slugs.includes('lesson_planner') ? 'lesson_planner' : slugs[0];
    const minimalPayload = {
      subject: 'math',
      grade: 5,
      topic: 'Fractions',
      learning_objective: 'Understand equivalent fractions',
      time_duration_minutes: 45,
      bloom_level: 'Understand',
    };

    try {
      const streamRes = await fetch(`${API_BASE}/v1/templates/${encodeURIComponent(streamSlug)}/execute-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({ data: minimalPayload }),
      });
      if (!streamRes.ok) {
        const errText = await streamRes.text();
        fail('Execute-stream', `POST .../execute-stream returned ${streamRes.status}: ${errText.slice(0, 120)}`);
      } else {
        // Consume a bit of the stream to ensure it's readable
        const reader = streamRes.body?.getReader();
        if (reader) {
          const { value } = await reader.read();
          if (value && value.length > 0) pass(`Execute-stream: POST .../execute-stream (${streamSlug}) returns 200 and stream`);
          else pass(`Execute-stream: POST .../execute-stream (${streamSlug}) returns 200`);
        } else {
          pass(`Execute-stream: POST .../execute-stream (${streamSlug}) returns 200`);
        }
      }
    } catch (e) {
      fail('Execute-stream', e.message);
    }
  }

  // Summary
  console.log('\n--- Summary ---');
  console.log(`Passed: ${results.passed}, Failed: ${results.failed}`);
  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(({ name, message }) => console.log(`  - ${name}: ${message}`));
  }
  if (templates.length > 0) {
    console.log('\nTemplates from backend (these will show on frontend /templates):');
    templates.forEach((t, i) => console.log(`  ${i + 1}. ${t.name} (${t.slug})`));
    console.log('\nTotal:', templates.length);
  }
  console.log('');
  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
