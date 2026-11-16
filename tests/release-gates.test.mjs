import test from 'node:test';
import assert from 'node:assert/strict';
import { validateReadOnlyRelease, assertNoPrivilegedClientConfig } from '../src/production-release-guard.mjs';
import { DashboardApi } from '../src/dashboard-api.mjs';

test('production gate defaults to STOP', () => {
  const result = validateReadOnlyRelease({});
  assert.equal(result.allowed, false);
  assert.ok(result.errors.includes('G2_PRODUCTION_APPROVAL_REQUIRED'));
});
test('missing any single production gate blocks', () => {
  const all = {mode:'live',authenticatedUserId:'synthetic-user',serverVerifiedAuthorization:true,rlsEvidencePassed:true,documentAccessEvidencePassed:true,dataReconciliationPassed:true,productionGateApproved:true};
  assert.equal(validateReadOnlyRelease(all).allowed,true);
  for (const key of Object.keys(all)) {
    const value = {...all}; delete value[key];
    assert.equal(validateReadOnlyRelease(value).allowed,false,key);
  }
});
test('privileged client configuration is rejected', () => {
  for (const key of ['service_role','serviceRoleKey','password','privateKey','secret']) {
    assert.throws(() => assertNoPrivilegedClientConfig({[key]:'synthetic'}));
  }
});
test('API requires HTTPS and a token provider', () => {
  assert.throws(() => new DashboardApi({baseUrl:'http://example.test',getAccessToken:async()=> 'x'}));
  assert.throws(() => new DashboardApi({baseUrl:'https://example.test'}));
});
test('API rejects unauthorized resources before network access', async () => {
  const api = new DashboardApi({baseUrl:'https://example.test/functions/v1/kkt-dashboard-readonly',getAccessToken:async()=> 'synthetic-token'});
  await assert.rejects(api.list('admin'),/RESOURCE_NOT_ALLOWED/);
});
test('API blocks unauthenticated requests before network access', async () => {
  const api = new DashboardApi({baseUrl:'https://example.test/functions/v1/kkt-dashboard-readonly',getAccessToken:async()=> ''});
  await assert.rejects(api.list('claims'),/AUTH_REQUIRED/);
});

test('API rejects unverified provenance without showing it as live', async (t) => {
  const previous = globalThis.fetch;
  globalThis.fetch = async () => ({ok:true,status:200,json:async()=>({items:[{amount:999}],asOf:'2026-11-17T00:00:00Z',source:'unverified'})});
  t.after(() => {globalThis.fetch=previous;});
  const api = new DashboardApi({baseUrl:'https://example.test/functions/v1/kkt-dashboard-readonly',getAccessToken:async()=> 'synthetic-token'});
  await assert.rejects(api.list('claims'),/INVALID_RESPONSE/);
});

test('gateway 401 and 403 never return protected rows', async (t) => {
  const original = globalThis.fetch;
  t.after(() => {globalThis.fetch = original;});
  const api = new DashboardApi({baseUrl:'https://example.test/functions/v1/kkt-dashboard-readonly',getAccessToken:async()=> 'synthetic-token'});
  for (const status of [401,403]) {
    globalThis.fetch = async () => ({status,ok:false});
    await assert.rejects(api.list('documents'),/ACCESS_DENIED/);
  }
});
test('gateway requests are GET-only, no-store and credential-free', async (t) => {
  const original = globalThis.fetch;
  t.after(() => {globalThis.fetch = original;});
  let observed;
  globalThis.fetch = async (url,options) => {
    observed = {url,options};
    return {ok:true,status:200,json:async()=>({items:[],asOf:'2026-11-17T00:00:00Z',source:'verified'})};
  };
  const api = new DashboardApi({baseUrl:'https://example.test/functions/v1/kkt-dashboard-readonly',getAccessToken:async()=> 'synthetic-token'});
  await api.list('projects');
  assert.equal(observed.url,'https://example.test/functions/v1/kkt-dashboard-readonly/projects');
  assert.equal(observed.options.method,'GET');
  assert.equal(observed.options.cache,'no-store');
  assert.equal(observed.options.credentials,'omit');
});
