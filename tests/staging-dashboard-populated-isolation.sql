-- Staging only. Synthetic fixtures are scoped to this transaction.
begin;
insert into auth.users(id,instance_id,aud,role,email,created_at,updated_at) values
('00000000-23a1-4acf-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dashboard-rls-fixture-0@example.invalid', now(), now()),
('00000000-23a1-4acf-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dashboard-rls-fixture-1@example.invalid', now(), now());
insert into kkt_core.organizations(id,code,display_name) values
('00000000-23a1-4acf-8000-000000000011', 'SYN-RLS-0', 'Synthetic organization 0'),
('00000000-23a1-4acf-8000-000000000012', 'SYN-RLS-1', 'Synthetic organization 1');
insert into kkt_core.memberships(org_id,user_id,active) values
('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000001', true),
('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000002', true),
('00000000-23a1-4acf-8000-000000000012', '00000000-23a1-4acf-8000-000000000002', true);
insert into kkt_core.member_roles(org_id,user_id,role_code) values
('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000001', 'finance_reader'),
('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000002', 'finance_reader'),
('00000000-23a1-4acf-8000-000000000012', '00000000-23a1-4acf-8000-000000000002', 'finance_reader');
insert into kkt_projects.projects(org_id,id,project_code,title,state) values
('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000021', 'SYN-PROJ-0', 'Synthetic project 0', 'active'),
('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000022', 'SYN-PROJ-1', 'Synthetic project 1', 'active'),
('00000000-23a1-4acf-8000-000000000012', '00000000-23a1-4acf-8000-000000000023', 'SYN-PROJ-2', 'Synthetic project 2', 'active');
insert into kkt_projects.project_members(org_id,project_id,user_id) values
('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000021', '00000000-23a1-4acf-8000-000000000001'),
('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000022', '00000000-23a1-4acf-8000-000000000002'),
('00000000-23a1-4acf-8000-000000000012', '00000000-23a1-4acf-8000-000000000023', '00000000-23a1-4acf-8000-000000000002');
insert into kkt_finance.items(org_id,id,project_id,kind,source_key,amount,review_state) values
('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000031', '00000000-23a1-4acf-8000-000000000021', 'progress_claim', 'SYN-CLAIM-0', 100, 'verified'),
('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000032', '00000000-23a1-4acf-8000-000000000022', 'progress_claim', 'SYN-CLAIM-1', 100, 'verified'),
('00000000-23a1-4acf-8000-000000000012', '00000000-23a1-4acf-8000-000000000033', '00000000-23a1-4acf-8000-000000000023', 'progress_claim', 'SYN-CLAIM-2', 100, 'verified');
insert into kkt_documents.documents(org_id,id,project_id,classification,title,source_system,source_drive_id,source_item_id) values
('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000041', '00000000-23a1-4acf-8000-000000000021', 'finance', 'Synthetic document 0', 'synthetic', 'SYNTHETIC', 'SYN-DOC-0'),
('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000042', '00000000-23a1-4acf-8000-000000000022', 'finance', 'Synthetic document 1', 'synthetic', 'SYNTHETIC', 'SYN-DOC-1'),
('00000000-23a1-4acf-8000-000000000012', '00000000-23a1-4acf-8000-000000000043', '00000000-23a1-4acf-8000-000000000023', 'finance', 'Synthetic document 2', 'synthetic', 'SYNTHETIC', 'SYN-DOC-2');
insert into kkt_documents.document_versions(org_id,document_id,version_key) values
('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000041', 'synthetic-v1'),
('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000042', 'synthetic-v1'),
('00000000-23a1-4acf-8000-000000000012', '00000000-23a1-4acf-8000-000000000043', 'synthetic-v1');
insert into ken_property.properties(id,owner_user_id,property_label,property_kind) values
('00000000-23a1-4acf-8000-000000000051', '00000000-23a1-4acf-8000-000000000001', 'Synthetic property 0', 'shoplot'),
('00000000-23a1-4acf-8000-000000000052', '00000000-23a1-4acf-8000-000000000002', 'Synthetic property 1', 'shoplot');
insert into ken_property.rent_periods(id,owner_user_id,property_id,rental_month,amount_due) values
('00000000-23a1-4acf-8000-000000000061', '00000000-23a1-4acf-8000-000000000001', '00000000-23a1-4acf-8000-000000000051', '2026-11-01', 100),
('00000000-23a1-4acf-8000-000000000062', '00000000-23a1-4acf-8000-000000000002', '00000000-23a1-4acf-8000-000000000052', '2026-11-01', 100);
insert into ken_property.rent_receipts(id,owner_user_id,rent_period_id,amount_received,received_on,review_state) values
('00000000-23a1-4acf-8000-000000000071', '00000000-23a1-4acf-8000-000000000001', '00000000-23a1-4acf-8000-000000000061', 100, '2026-11-05', 'verified'),
('00000000-23a1-4acf-8000-000000000072', '00000000-23a1-4acf-8000-000000000002', '00000000-23a1-4acf-8000-000000000062', 100, '2026-11-05', 'verified');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-23a1-4acf-8000-000000000001', true);
do $$
begin
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from kkt_projects.projects where id in ('00000000-23a1-4acf-8000-000000000021', '00000000-23a1-4acf-8000-000000000022', '00000000-23a1-4acf-8000-000000000023')) is distinct from array['00000000-23a1-4acf-8000-000000000021']::uuid[] then raise exception 'owner A assigned reads and cross-project/cross-org/cross-owner denial: kkt_projects.projects'; end if;
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from kkt_finance.items where id in ('00000000-23a1-4acf-8000-000000000031', '00000000-23a1-4acf-8000-000000000032', '00000000-23a1-4acf-8000-000000000033')) is distinct from array['00000000-23a1-4acf-8000-000000000031']::uuid[] then raise exception 'owner A assigned reads and cross-project/cross-org/cross-owner denial: kkt_finance.items'; end if;
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from kkt_documents.documents where id in ('00000000-23a1-4acf-8000-000000000041', '00000000-23a1-4acf-8000-000000000042', '00000000-23a1-4acf-8000-000000000043')) is distinct from array['00000000-23a1-4acf-8000-000000000041']::uuid[] then raise exception 'owner A assigned reads and cross-project/cross-org/cross-owner denial: kkt_documents.documents'; end if;
  if (select coalesce(array_agg(document_id order by document_id), '{}'::uuid[]) from kkt_documents.document_versions where document_id in ('00000000-23a1-4acf-8000-000000000041', '00000000-23a1-4acf-8000-000000000042', '00000000-23a1-4acf-8000-000000000043')) is distinct from array['00000000-23a1-4acf-8000-000000000041']::uuid[] then raise exception 'owner A assigned reads and cross-project/cross-org/cross-owner denial: kkt_documents.document_versions'; end if;
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from ken_property.properties where id in ('00000000-23a1-4acf-8000-000000000051', '00000000-23a1-4acf-8000-000000000052')) is distinct from array['00000000-23a1-4acf-8000-000000000051']::uuid[] then raise exception 'owner A assigned reads and cross-project/cross-org/cross-owner denial: ken_property.properties'; end if;
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from ken_property.rent_periods where id in ('00000000-23a1-4acf-8000-000000000061', '00000000-23a1-4acf-8000-000000000062')) is distinct from array['00000000-23a1-4acf-8000-000000000061']::uuid[] then raise exception 'owner A assigned reads and cross-project/cross-org/cross-owner denial: ken_property.rent_periods'; end if;
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from ken_property.rent_receipts where id in ('00000000-23a1-4acf-8000-000000000071', '00000000-23a1-4acf-8000-000000000072')) is distinct from array['00000000-23a1-4acf-8000-000000000071']::uuid[] then raise exception 'owner A assigned reads and cross-project/cross-org/cross-owner denial: ken_property.rent_receipts'; end if;
  if (select coalesce(array_agg(property_id order by property_id), '{}'::uuid[]) from public.kkt_ken_property_summary() where property_id in ('00000000-23a1-4acf-8000-000000000051', '00000000-23a1-4acf-8000-000000000052')) is distinct from array['00000000-23a1-4acf-8000-000000000051']::uuid[] then raise exception 'owner A assigned reads and cross-project/cross-org/cross-owner denial: public.kkt_ken_property_summary()'; end if;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-23a1-4acf-8000-000000000002', true);
do $$
begin
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from kkt_projects.projects where id in ('00000000-23a1-4acf-8000-000000000021', '00000000-23a1-4acf-8000-000000000022', '00000000-23a1-4acf-8000-000000000023')) is distinct from array['00000000-23a1-4acf-8000-000000000022', '00000000-23a1-4acf-8000-000000000023']::uuid[] then raise exception 'owner B assigned reads and cross-project/cross-owner denial: kkt_projects.projects'; end if;
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from kkt_finance.items where id in ('00000000-23a1-4acf-8000-000000000031', '00000000-23a1-4acf-8000-000000000032', '00000000-23a1-4acf-8000-000000000033')) is distinct from array['00000000-23a1-4acf-8000-000000000032', '00000000-23a1-4acf-8000-000000000033']::uuid[] then raise exception 'owner B assigned reads and cross-project/cross-owner denial: kkt_finance.items'; end if;
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from kkt_documents.documents where id in ('00000000-23a1-4acf-8000-000000000041', '00000000-23a1-4acf-8000-000000000042', '00000000-23a1-4acf-8000-000000000043')) is distinct from array['00000000-23a1-4acf-8000-000000000042', '00000000-23a1-4acf-8000-000000000043']::uuid[] then raise exception 'owner B assigned reads and cross-project/cross-owner denial: kkt_documents.documents'; end if;
  if (select coalesce(array_agg(document_id order by document_id), '{}'::uuid[]) from kkt_documents.document_versions where document_id in ('00000000-23a1-4acf-8000-000000000041', '00000000-23a1-4acf-8000-000000000042', '00000000-23a1-4acf-8000-000000000043')) is distinct from array['00000000-23a1-4acf-8000-000000000042', '00000000-23a1-4acf-8000-000000000043']::uuid[] then raise exception 'owner B assigned reads and cross-project/cross-owner denial: kkt_documents.document_versions'; end if;
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from ken_property.properties where id in ('00000000-23a1-4acf-8000-000000000051', '00000000-23a1-4acf-8000-000000000052')) is distinct from array['00000000-23a1-4acf-8000-000000000052']::uuid[] then raise exception 'owner B assigned reads and cross-project/cross-owner denial: ken_property.properties'; end if;
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from ken_property.rent_periods where id in ('00000000-23a1-4acf-8000-000000000061', '00000000-23a1-4acf-8000-000000000062')) is distinct from array['00000000-23a1-4acf-8000-000000000062']::uuid[] then raise exception 'owner B assigned reads and cross-project/cross-owner denial: ken_property.rent_periods'; end if;
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from ken_property.rent_receipts where id in ('00000000-23a1-4acf-8000-000000000071', '00000000-23a1-4acf-8000-000000000072')) is distinct from array['00000000-23a1-4acf-8000-000000000072']::uuid[] then raise exception 'owner B assigned reads and cross-project/cross-owner denial: ken_property.rent_receipts'; end if;
  if (select coalesce(array_agg(property_id order by property_id), '{}'::uuid[]) from public.kkt_ken_property_summary() where property_id in ('00000000-23a1-4acf-8000-000000000051', '00000000-23a1-4acf-8000-000000000052')) is distinct from array['00000000-23a1-4acf-8000-000000000052']::uuid[] then raise exception 'owner B assigned reads and cross-project/cross-owner denial: public.kkt_ken_property_summary()'; end if;
end $$;
reset role;

delete from kkt_core.member_roles where org_id='00000000-23a1-4acf-8000-000000000011' and user_id='00000000-23a1-4acf-8000-000000000001' and role_code='finance_reader';
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-23a1-4acf-8000-000000000001', true);
do $$
begin
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from kkt_projects.projects where id in ('00000000-23a1-4acf-8000-000000000021', '00000000-23a1-4acf-8000-000000000022', '00000000-23a1-4acf-8000-000000000023')) is distinct from array['00000000-23a1-4acf-8000-000000000021']::uuid[] then raise exception 'finance revocation denies claims and classified documents: kkt_projects.projects'; end if;
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from kkt_finance.items where id in ('00000000-23a1-4acf-8000-000000000031', '00000000-23a1-4acf-8000-000000000032', '00000000-23a1-4acf-8000-000000000033')) is distinct from '{}'::uuid[] then raise exception 'finance revocation denies claims and classified documents: kkt_finance.items'; end if;
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from kkt_documents.documents where id in ('00000000-23a1-4acf-8000-000000000041', '00000000-23a1-4acf-8000-000000000042', '00000000-23a1-4acf-8000-000000000043')) is distinct from '{}'::uuid[] then raise exception 'finance revocation denies claims and classified documents: kkt_documents.documents'; end if;
  if (select coalesce(array_agg(document_id order by document_id), '{}'::uuid[]) from kkt_documents.document_versions where document_id in ('00000000-23a1-4acf-8000-000000000041', '00000000-23a1-4acf-8000-000000000042', '00000000-23a1-4acf-8000-000000000043')) is distinct from '{}'::uuid[] then raise exception 'finance revocation denies claims and classified documents: kkt_documents.document_versions'; end if;
end $$;
reset role;
update kkt_core.memberships set active=false where org_id='00000000-23a1-4acf-8000-000000000011' and user_id='00000000-23a1-4acf-8000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-23a1-4acf-8000-000000000001', true);
do $$
begin
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from kkt_projects.projects where id in ('00000000-23a1-4acf-8000-000000000021', '00000000-23a1-4acf-8000-000000000022', '00000000-23a1-4acf-8000-000000000023')) is distinct from '{}'::uuid[] then raise exception 'disabled membership denies project scope: kkt_projects.projects'; end if;
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from kkt_finance.items where id in ('00000000-23a1-4acf-8000-000000000031', '00000000-23a1-4acf-8000-000000000032', '00000000-23a1-4acf-8000-000000000033')) is distinct from '{}'::uuid[] then raise exception 'disabled membership denies project scope: kkt_finance.items'; end if;
  if (select coalesce(array_agg(id order by id), '{}'::uuid[]) from kkt_documents.documents where id in ('00000000-23a1-4acf-8000-000000000041', '00000000-23a1-4acf-8000-000000000042', '00000000-23a1-4acf-8000-000000000043')) is distinct from '{}'::uuid[] then raise exception 'disabled membership denies project scope: kkt_documents.documents'; end if;
  if (select coalesce(array_agg(document_id order by document_id), '{}'::uuid[]) from kkt_documents.document_versions where document_id in ('00000000-23a1-4acf-8000-000000000041', '00000000-23a1-4acf-8000-000000000042', '00000000-23a1-4acf-8000-000000000043')) is distinct from '{}'::uuid[] then raise exception 'disabled membership denies project scope: kkt_documents.document_versions'; end if;
end $$;
reset role;
rollback;

select 'PASS' as result, 24 as row_set_assertions,
  (select count(*) from auth.users where id in ('00000000-23a1-4acf-8000-000000000001', '00000000-23a1-4acf-8000-000000000002')) as remaining_test_users,
  (select count(*) from kkt_core.organizations where id in ('00000000-23a1-4acf-8000-000000000011', '00000000-23a1-4acf-8000-000000000012')) as remaining_test_organizations;
