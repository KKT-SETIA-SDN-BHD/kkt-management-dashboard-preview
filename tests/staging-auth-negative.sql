-- Read-only negative authorization checks for Supabase staging.
-- Execute with no authenticated JWT. This is NOT a substitute for multi-user RLS tests.
-- No writes, roles, grants, or real identifiers.
select
  auth.uid() is null as no_caller_jwt,
  not kkt_private.org_member('00000000-0000-4000-8000-000000000001'::uuid) as unknown_org_denied,
  not kkt_private.has_role('00000000-0000-4000-8000-000000000001'::uuid,'finance_reader') as unknown_finance_denied,
  not kkt_private.project_member('00000000-0000-4000-8000-000000000001'::uuid,'00000000-0000-4000-8000-000000000002'::uuid) as unknown_project_denied;
