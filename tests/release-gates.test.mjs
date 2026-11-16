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
  const api = new DashboardApi({baseUrl:'https://example.test',getAccessToken:async()=> 'synthetic-token'});
  await assert.rejects(api.list('admin'),/RESOURCE_NOT_ALLOWED/);
});
test('API blocks unauthenticated requests before network access', async () => {
  const api = new DashboardApi({baseUrl:'https://example.test',getAccessToken:async()=> ''});
  await assert.rejects(api.list('claims'),/AUTH_REQUIRED/);
});
