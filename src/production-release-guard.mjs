'use strict';
// KKT production-readiness guard. No credentials, network calls or production data.
// Import from the future authenticated dashboard entrypoint before enabling live data.
export const RELEASE_MODE = Object.freeze({ preview: 'synthetic', live: 'disabled' });
export function validateReadOnlyRelease(config) {
  const errors = [];
  if (!config || config.mode !== 'live') errors.push('LIVE_MODE_NOT_APPROVED');
  if (!config?.authenticatedUserId) errors.push('AUTH_REQUIRED');
  if (!config?.serverVerifiedAuthorization) errors.push('SERVER_AUTHORIZATION_REQUIRED');
  if (!config?.rlsEvidencePassed) errors.push('RLS_TEST_REQUIRED');
  if (!config?.documentAccessEvidencePassed) errors.push('DOCUMENT_ACCESS_TEST_REQUIRED');
  if (!config?.dataReconciliationPassed) errors.push('DATA_RECONCILIATION_REQUIRED');
  if (!config?.productionGateApproved) errors.push('G2_PRODUCTION_APPROVAL_REQUIRED');
  return Object.freeze({allowed: errors.length === 0, errors});
}
export function assertNoPrivilegedClientConfig(config) {
  const keys = Object.keys(config || {});
  if (keys.some(key => /service.?role|secret|password|private.?key/i.test(key))) {
    throw new Error('PRIVILEGED_CONFIGURATION_FORBIDDEN');
  }
  return true;
}
