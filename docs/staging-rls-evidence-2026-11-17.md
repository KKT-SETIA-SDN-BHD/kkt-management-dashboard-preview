# Staging RLS policy review — 2026-11-17 (read-only evidence)

Source: direct catalog query of staging project `qacmlpqtiwwmrypxnnlp`. No RLS policy or database record changed.

| Resource | Existing policy | Observed access predicate |
|---|---|---|
| kkt_core.memberships | own_active_membership | user_id = auth.uid() AND active |
| kkt_projects.projects | assigned_projects | kkt_private.project_member(org_id, id) |
| kkt_finance.items | finance_scope | kkt_private.has_role(org_id, 'finance_reader') AND project assignment when project_id is present |
| kkt_documents.documents | document_scope | organization membership AND optional project assignment AND hr_reader/finance_reader role for classified records |
| kkt_documents.document_versions | parent_document_scope | existence of a matching parent document row (must verify caller-scoped RLS) |

**Critical:** Policy presence is not evidence that authorization works. Review `kkt_private.has_role`, `kkt_private.project_member`, EXECUTE grants, and the actual RLS behavior under distinct authenticated JWTs. Never use service-role credentials to test row isolation. No tables were returned for `ken_property` in staging, so private property must remain inaccessible in live mode until an explicit schema and independent grants are validated.

## Required negative tests
- Anonymous and unrelated user cannot read projects, finance, documents, or private property.
- Active organization member without `finance_reader` cannot see finance.
- `finance_reader` without project assignment cannot see project-specific finance.
- Document version cannot be fetched by guessing a version ID when parent document is inaccessible.
- Disabled membership and revoked roles must fail immediately (not solely relying on stale JWT metadata).
- No service-role key in public Pages; OneDrive access only via server-side authorization.

Production release remains G2 STOP / NO-GO. No live user access has been validated.
