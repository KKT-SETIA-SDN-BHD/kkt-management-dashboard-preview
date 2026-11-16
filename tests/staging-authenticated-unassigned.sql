-- Staging only. Read-only, synthetic identity. No real user or record changes.
-- Important: zero rows in empty tables is NOT proof of RLS isolation.
begin read only;
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000099',true);
select auth.uid() as simulated_user,
       (select count(*) from kkt_projects.projects) as visible_projects,
       (select count(*) from kkt_finance.items) as visible_finance,
       (select count(*) from kkt_documents.documents) as visible_documents,
       (select count(*) from kkt_documents.document_versions) as visible_versions;
rollback;
