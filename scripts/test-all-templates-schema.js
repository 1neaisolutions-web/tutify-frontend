/**
 * Test script: runs all templates via execute API and validates each result
 * against the template's output_schema (required keys present, types match).
 *
 * Usage (from frontend root):
 *   npm run test:all-templates
 *   BACKEND_URL=http://127.0.0.1:8000 npm run test:all-templates
 *
 * Uses timeouts so the process never gets stuck. Sequential execution.
 * Exit code: 0 if all pass, 1 if any fail.
 */

const BACKEND_URL = (process.env.BACKEND_URL || process.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const API_BASE = `${BACKEND_URL}/api`;

const EXECUTE_TIMEOUT_MS = 90000;  // 90s per template execute
const FETCH_TIMEOUT_MS = 15000;   // 15s for list/detail

const results = { passed: 0, failed: 0, errors: [], schemaFails: [] };

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

/**
 * Fetch with timeout so the process never gets stuck.
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    clearTimeout(id);
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (_) {
      data = text;
    }
    return { ok: res.ok, status: res.status, data, text };
  } catch (e) {
    clearTimeout(id);
    if (e.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw e;
  }
}

/**
 * Build minimal valid input from input_schema (required fields + defaults).
 */
function buildMinimalInput(inputSchema) {
  if (!inputSchema || typeof inputSchema !== 'object') return {};
  const props = inputSchema.properties || {};
  const required = Array.isArray(inputSchema.required) ? inputSchema.required : [];
  const out = {};
  for (const key of required) {
    const prop = props[key];
    if (!prop) {
      out[key] = '';
      continue;
    }
    const t = Array.isArray(prop.type) ? prop.type.find(x => x !== 'null') : prop.type;
    if (prop.enum && Array.isArray(prop.enum) && prop.enum.length > 0) {
      out[key] = prop.enum[0];
    } else if (t === 'string') {
      out[key] = key === 'topic' ? 'Test topic' : key === 'learning_objective' ? 'Test objective' : 'test';
    } else if (t === 'integer' || t === 'number') {
      const min = prop.minimum != null ? prop.minimum : 0;
      out[key] = key === 'grade' ? 5 : key === 'time_duration_minutes' ? 30 : min;
    } else if (t === 'boolean') {
      out[key] = false;
    } else if (t === 'array') {
      out[key] = prop.items && (prop.items.type === 'string') ? ['test'] : [];
    } else if (t === 'object') {
      out[key] = {};
    } else {
      out[key] = 'test';
    }
  }
  return out;
}

/**
 * Check that output matches output_schema: required keys present and types roughly match.
 */
function validateOutputAgainstSchema(output, outputSchema, slug) {
  if (!outputSchema || typeof outputSchema !== 'object') {
    return { ok: true }; // No schema to validate
  }
  const required = Array.isArray(outputSchema.required) ? outputSchema.required : [];
  const props = outputSchema.properties || {};
  const issues = [];

  for (const key of required) {
    if (!(key in output)) {
      issues.push(`missing required key: ${key}`);
      continue;
    }
    const value = output[key];
    const prop = props[key];
    if (!prop) continue;
    const t = Array.isArray(prop.type) ? prop.type.find(x => x !== 'null') : prop.type;
    const actualType = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
    if (t === 'string' && actualType !== 'string') {
      issues.push(`output.${key}: expected string, got ${actualType}`);
    } else if (t === 'array' && actualType !== 'array') {
      issues.push(`output.${key}: expected array, got ${actualType}`);
    } else if (t === 'object' && (actualType !== 'object' || value === null || Array.isArray(value))) {
      if (actualType !== 'object' || value === null) {
        issues.push(`output.${key}: expected object, got ${actualType}`);
      }
    } else if ((t === 'integer' || t === 'number') && actualType !== 'number') {
      issues.push(`output.${key}: expected number, got ${actualType}`);
    } else if (t === 'boolean' && actualType !== 'boolean') {
      issues.push(`output.${key}: expected boolean, got ${actualType}`);
    }
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }
  return { ok: true };
}

async function main() {
  console.log('\n--- All templates: execute + output schema validation ---\n');
  console.log(`Backend: ${BACKEND_URL}`);
  console.log(`Execute timeout: ${EXECUTE_TIMEOUT_MS / 1000}s per template\n`);

  let templates = [];

  try {
    const listRes = await fetchWithTimeout(`${API_BASE}/v1/templates`);
    if (!listRes.ok) {
      fail('List templates', `GET /api/v1/templates returned ${listRes.status}`);
      printSummary(templates);
      process.exit(1);
    }
    if (!Array.isArray(listRes.data)) {
      fail('List templates', 'Response is not an array');
      printSummary(templates);
      process.exit(1);
    }
    templates = listRes.data;
    log(`Found ${templates.length} template(s)`, 'info');
  } catch (e) {
    fail('List templates', e.message);
    printSummary(templates);
    process.exit(1);
  }

  if (templates.length === 0) {
    log('No templates. Run backend seed: python -m app.seed.cli --templates --force', 'err');
    printSummary(templates);
    process.exit(1);
  }

  for (let i = 0; i < templates.length; i++) {
    const t = templates[i];
    const slug = t.slug;
    const name = t.name || slug;
    const num = `${i + 1}/${templates.length}`;

    try {
      const detailRes = await fetchWithTimeout(`${API_BASE}/v1/templates/${encodeURIComponent(slug)}`);
      if (!detailRes.ok) {
        fail(`${num} ${slug}`, `Detail returned ${detailRes.status}`);
        continue;
      }
      const detail = detailRes.data;
      const inputSchema = detail?.latest_version?.input_schema;
      const outputSchema = detail?.latest_version?.output_schema;

      if (!inputSchema || typeof inputSchema !== 'object') {
        fail(`${num} ${slug}`, 'Missing or invalid latest_version.input_schema');
        continue;
      }

      const payload = buildMinimalInput(inputSchema);
      const executeRes = await fetchWithTimeout(
        `${API_BASE}/v1/templates/${encodeURIComponent(slug)}/execute`,
        {
          method: 'POST',
          body: JSON.stringify({ data: payload }),
        },
        EXECUTE_TIMEOUT_MS
      );

      if (!executeRes.ok) {
        const msg = executeRes.data?.detail?.message || executeRes.text?.slice(0, 200) || executeRes.status;
        fail(`${num} ${slug}`, `Execute returned ${executeRes.status}: ${msg}`);
        continue;
      }

      const output = executeRes.data?.output;
      if (output === undefined) {
        fail(`${num} ${slug}`, 'Response has no output field');
        continue;
      }

      const validation = validateOutputAgainstSchema(output, outputSchema, slug);
      if (!validation.ok) {
        results.schemaFails.push({ slug, name, issues: validation.issues });
        fail(`${num} ${slug} (${name})`, `Schema validation: ${validation.issues.join('; ')}`);
        continue;
      }

      pass(`${num} ${slug}: ${name}`);
    } catch (e) {
      fail(`${num} ${slug}`, e.message);
    }
  }

  printSummary(templates);
  process.exit(results.failed > 0 ? 1 : 0);
}

function printSummary(templates) {
  console.log('\n--- Summary ---');
  console.log(`Passed: ${results.passed}, Failed: ${results.failed}`);
  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(({ name, message }) => console.log(`  - ${name}: ${message}`));
  }
  if (results.schemaFails.length > 0) {
    console.log('\nOutput schema validation failures:');
    results.schemaFails.forEach(({ slug, name, issues }) => {
      console.log(`  - ${slug} (${name}): ${issues.join('; ')}`);
    });
  }
  if (templates.length > 0) {
    console.log('\nTemplates tested:');
    templates.forEach((t, i) => console.log(`  ${i + 1}. ${t.name} (${t.slug})`));
  }
  console.log('');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
