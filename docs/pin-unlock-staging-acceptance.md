# KKT internal Dashboard: six-digit PIN unlock — staging acceptance plan

## Staging acceptance — 2026-11-18 (MYT)

**PASS for the Android synthetic dashboard. Production remains G2 STOP / NO-GO.**

- [Android Staging](https://kkt-setia-sdn-bhd.github.io/kkt-management-dashboard-preview/android-auth-staging/) runs the PIN release from [commit 60c6188](https://github.com/KKT-SETIA-SDN-BHD/kkt-management-dashboard-preview/commit/60c61887d5f0766281419cf6a9cb063ff930879b), published by [Pages run 44149566069](https://github.com/KKT-SETIA-SDN-BHD/kkt-management-dashboard-preview/actions/runs/44149566069).
- The user reported Android Chrome PASS for PIN enrollment, manual lock and unlock, and automatic lock after switching to the background. Prior Android Chrome acceptance covered real Staging Auth sign-in, synthetic overview and sign-out.
- Automation executed the published PIN page script against real Staging Auth with a one-time synthetic account. It verified successful PIN unlock and session termination after five consecutive wrong PINs. Separate script tests covered expiry and failed session revalidation. The PIN belongs to the current authenticated page session. Reload or close requires password sign-in again.

## Staging read-only gateway negative HTTP retest — 2026-11-18 (MYT)

The initial probe returned HTTP 404 for a supported route. [Commit 9751e6d](https://github.com/KKT-SETIA-SDN-BHD/kkt-management-dashboard-preview/commit/9751e6dfa27787302b2baa638f020ccda04d7cb6) corrects route matching, and Staging `kkt-dashboard-readonly` v5 is active with platform JWT verification enabled. The existing contract tests passed 3/3 after their route assertion was updated.

| HTTP case | Result |
| --- | --- |
| Missing bearer token across projects, claims, property and documents | 4/4 HTTP 401 |
| Invalid bearer token across the same four resources | 4/4 HTTP 401 |
| Real Auth-signed JWT for an unassigned synthetic user across the same resources | 4/4 HTTP 403, `RESOURCE_ACCESS_NOT_YET_APPROVED` |
| Unknown or nested route with a valid test token | 2/2 HTTP 404 |

None of the responses returned business rows. The synthetic user signed out and was disabled, with zero remaining sessions. The deployed Android frontend serves synthetic fixtures and does not call the read-only gateway. Authorized end-to-end reads and populated cross-scope denial, OneDrive entitlements, source reconciliation, production-grade unlock and release controls remain open.

## Security architecture
- First enrollment must use an authenticated Supabase Auth session for the named individual. PIN is a **convenience unlock**, never a stand-alone login credential or a substitute for server authorization.
- Prefer device-bound WebAuthn/passkey / OS-backed authentication for unlock. If a six-digit PIN is provided in the UI, it must only unlock an already authenticated, device-bound session; never store PIN plaintext, expose it to logs, or derive a Supabase JWT from the PIN alone.
- Distinct identities and revocable sessions; deny unknown, anonymous, expired, and revoked sessions.
- Enforce authorization server-side per user, project and document, with RLS and explicit entitlements; never trust frontend role or user_metadata.
- Rate-limit attempts and lock out repeated failures; record security events without PINs/tokens. Secure reset/recovery requires stronger re-authentication.
- Maintain fail-closed API responses until resource grants and OneDrive document permissions are implemented and tested.
- Do not use public OneDrive sharing links for sensitive documents. No UBS database writes or payment actions.

## Acceptance matrix (all required before production)
1. Enrolled authorized user + valid session + correct unlock => permitted read-only resource returns only authorized records.
2. Incorrect PIN and repeated guesses => no data, rate limiting and lockout.
3. No session, expired/revoked session, anonymous user => 401/403, no data.
4. Other user and cross-project/cross-property IDs => no data, including direct URL/API calls.
5. PDF direct-link and expired link access => denied when unauthorized.
6. UBS data source timestamp, ledger reconciliation, and no-write guarantee documented.
7. iPhone Safari: first enrollment, unlock, sign out, session expiry, recovery tested.
8. Audit logs contain no PIN, credentials, access tokens, or confidential ledger values.
9. Production deployment only after documented PASS for all required gates.

No production deploy, secret changes, user provisioning, or real-business-data access in this branch.

