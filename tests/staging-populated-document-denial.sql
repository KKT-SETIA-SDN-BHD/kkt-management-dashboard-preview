-- STAGING ONLY; no changes to business records.
-- A document exists in staging; an unassigned synthetic authenticated user must see none.
-- Run the baseline count separately with administrator read-only SQL:
-- SELECT count(*) FROM kkt_documents.documents; -- observed 1 on 2026-11-17
begin read only;
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000099',true);
select
  (select count(*) from kkt_documents.documents) as unauthorized_visible_documents,
  (select count(*) from kkt_core.organizations) as unauthorized_visible_orgs,
  (select count(*) from kkt_core.memberships) as unauthorized_visible_memberships;
rollback;
