import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Contract checks for deployed candidate source, not a substitute for HTTP integration tests.
const source = readFileSync(new URL('../supabase/functions/kkt-dashboard-readonly/index.ts', import.meta.url),'utf8');

test('staging gateway retains platform JWT gate in documented deployment', () => {
  assert.match(source,/auth\.getUser\(/);
  assert.match(source,/AUTH_INVALID/);
  assert.match(source,/AUTH_REQUIRED/);
});
test('staging gateway never returns business rows before entitlement checks', () => {
  assert.match(source,/RESOURCE_ACCESS_NOT_YET_APPROVED/);
  assert.doesNotMatch(source,/\.from\s*\(/);
  assert.doesNotMatch(source,/service_role|SUPABASE_SERVICE_ROLE_KEY/i);
});
test('staging gateway limits origin, methods, resources and paths', () => {
  assert.match(source,/https:\/\/kkt-setia-sdn-bhd\.github\.io/);
  assert.match(source,/origin !== allowedOrigin/);
  assert.match(source,/request\.method !== "GET"/);
  assert.ok(source.includes('const route = `/kkt-dashboard-readonly/${resource}`'));
  assert.ok(source.includes('![route, `/functions/v1${route}`, `/${resource}`].includes(url.pathname)'));
  assert.match(source,/!resources\.has\(resource\)/);
  assert.match(source,/Cache-Control": "no-store"/);
});
