# Production readiness — verified blockers (2026-11-17)

Status: **NO-GO**. This report is based on live, read-only Supabase inspection. Do not merge the public Pages release candidate as a live production dashboard.

## Verified inventory
- Staging `qacmlpqtiwwmrypxnnlp`: one active Edge Function, `kkt-hr-staging-gateway` (version 2), with platform `verify_jwt=false`.
- Production `pejlmgmpgihbhoqxmdrp`: no Edge Functions returned.
- Staging `ken_property`: no tables returned.
- Dashboard Edge Function exists only as GitHub candidate source; not deployed.

## HR gateway review
- Platform JWT verification disabled, apparently to support an allowlisted login proxy endpoint.
- Source enforces a fixed Origin, POST, allowlisted upstream routes, limited request size and forwards bearer tokens for non-login paths.
- Origin checking is **not authentication**. Authorization for HR RPCs depends on upstream Supabase Auth/RLS/RPC implementation, not on the gateway alone.
- HR OneDrive route returns a folder link after a manager-status RPC; the OneDrive link's own sharing permissions must be independently verified. Do not treat a link as a per-document access grant.
- Do not change the HR gateway or enable production until end-to-end negative tests and sharing-permission review are complete.

## Mandatory gates before production
1. Staging deployment and real end-to-end JWT authentication, role revocation, org/project cross-access denial.
2. Verify all exposed RPCs and SECURITY DEFINER functions with least-privilege grants.
3. Independently secured private-property schema and Mr Ken access tests.
4. Document-link broker with OneDrive permissions, short-lived access, audit trail; never leak raw unrestricted folder links.
5. Actual source reconciliation for finance/claims and read-only data provenance.
6. Production environment secrets, rollback plan, monitoring, verified release approval.

No credentials, real personal data, or production changes were made by this audit.
