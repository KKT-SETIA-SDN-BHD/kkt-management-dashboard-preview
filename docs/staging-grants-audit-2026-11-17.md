# Staging grants audit — 2026-11-17

Read-only PostgreSQL catalog checks against Supabase staging `qacmlpqtiwwmrypxnnlp`. No policy, role, data, or production change.

- All 9 inspected tables in `kkt_core`, `kkt_projects`, `kkt_finance`, `kkt_documents` have RLS enabled.
- All 9 deny direct table SELECT to `anon`.
- `authenticated` has table SELECT on 7/9: memberships, organizations, documents, document_versions, finance.items, projects, tasks. Access still depends on schema USAGE, applicable RLS and API exposure.
- `authenticated` lacks direct SELECT on `kkt_core.member_roles` and `kkt_projects.project_members`.
- `anon` has no schema USAGE on any of the five inspected schemas (`kkt_core`, `kkt_projects`, `kkt_finance`, `kkt_documents`, `kkt_private`).
- All 9 inspected tables have `FORCE ROW LEVEL SECURITY = false`; verify behavior under actual caller identities and privileged function execution before deployment.

**Not proven:** RLS effectiveness for actual JWTs, cross-org and cross-project isolation, private property authorization, document version inheritance, OneDrive link issuance, or public API exposure settings.

## Acceptance criteria
1. Verify authenticated user A sees only assigned project A; user B cannot see it.
2. Verify finance reader with and without assigned project; inactive membership loses access.
3. Verify guessed document ID and document version ID cannot bypass document_scope.
4. Verify anonymous and expired-session requests fail on the deployed staging gateway.
5. Verify real data provenance and financial reconciliation before any verified live response.

Production remains G2 STOP. No deployment authorized by this audit.
