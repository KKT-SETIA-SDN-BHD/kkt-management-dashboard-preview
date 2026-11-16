# KKT internal Dashboard: six-digit PIN unlock — staging acceptance plan

Status: implementation pending; production STOP. Scope: owner and Mr Ken only; projects, progressive claims, OneDrive PDFs, UBS accounting **read-only**.

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
