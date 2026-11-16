# KKT AI PROJECTS — Staging acceptance evidence (2026-11-17)

## Decision
**NO-GO for production**. Partial staging acceptance only. Do not merge or deploy production based on this document.

## Verified
- Staging project qacmlpqtiwwmrypxnnlp: `kkt-dashboard-readonly` ACTIVE v4, `verify_jwt=true`.
- GitHub RC security workflow Run 43906501494: SUCCESS (static tests; not end-to-end).
- Staging `public.kkt_ken_property_summary`: SECURITY INVOKER; anon EXECUTE denied; authenticated EXECUTE allowed subject to owner-scoped RLS.
- SQL read-only transaction with synthetic unassigned authenticated claim sub `00000000-0000-4000-8000-000000000099`: 0 visible properties, rent periods, rent receipts, summary rows.
- Staging property table is empty; this test does **not** demonstrate populated cross-owner isolation.
- Earlier staging edge logs contain two GET 401 responses for `/functions/v1/kkt-dashboard-readonly/projects`. Their request header provenance cannot be determined from logs.

## Not verified — blocking production
1. Real staging Auth JWT valid-user positive and invalid-user negative HTTP end-to-end checks on v4.
2. Populated synthetic cross-owner/cross-project isolation and entitlement tests.
3. OneDrive document access and sharing permission tests with actual allowed and denied identities.
4. Reconciled source-of-truth financial/claim data and real dashboard read path.
5. Production security and release approval.

## Safe next actions
- Provision dedicated **synthetic staging-only** Auth users via approved secure process; do not put credentials or JWTs in GitHub.
- Use rollback-only fixtures for isolation tests; verify FK and grants before inserting.
- Keep production STOP and leave frontend in synthetic mode until all gates PASS.
