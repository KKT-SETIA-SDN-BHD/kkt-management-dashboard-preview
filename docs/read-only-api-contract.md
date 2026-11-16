# Read-only authenticated Dashboard API contract (RC only)

This contract is a proposal, **not a deployed endpoint**. The public Pages demo stays synthetic.

## Auth and access
- Authenticate with Supabase Auth, validate the JWT and session server-side on every request. Do not trust a user ID, org ID, project ID, role, or document path supplied by the browser.
- Resolve active organization membership from `kkt_core.memberships`, and verify explicit project and private-property entitlements. Membership alone must not grant finance access.
- The gateway must implement strict authorization before any service-role query; prefer caller-scoped RLS. Never expose service-role secrets to GitHub Pages.
- Response headers: `Cache-Control: no-store`, restrictive CORS allowlist, `X-Content-Type-Options: nosniff`.

## GET /v1/dashboard/{claims|projects|property|documents}
- Bearer token required. 401 unauthenticated; 403 unauthorized; no fallback to synthetic or privileged data.
- Response: `{ "items": [], "asOf": "ISO-8601", "source": "verified|unverified", "nextCursor": null }`.
- All money values must be backed by actual source documents and reconciled states; UNKNOWN is not zero.
- No direct OneDrive URLs in list responses. For document viewing, use a separate entitlement-checked, expiring download endpoint, with access logs.
- For project summaries use `kkt_projects.projects`; finance `kkt_finance.items`; documents `kkt_documents.documents`. Verify all relationships, status semantics and RLS policies before mapping into live responses.
- No verified private property access model was found yet; do not return property records until established.

## Security tests required
1. Unauthenticated -> 401.
2. Signed-in user without explicit finance permission -> 403 for claims.
3. Cross-org, cross-project, and private-property access -> 403 or filtered out.
4. Expired/revoked session -> 401.
5. Missing/invalid document entitlement -> 403, no OneDrive link.
6. Invalid backend config -> fail closed; never use demo fixtures as live numbers.
7. All responses no-store; no sensitive details in logs.

## Known staging gaps (2026-11-16)
- kkt_projects.projects and kkt_finance.items have zero rows in staging; cannot claim real finance integration is complete.
- Supabase security advisors: 4 tables with RLS enabled but no policies; leaked-password protection warning.
- G2 Production STOP remains in force. This file and the client module are not approval to deploy.
