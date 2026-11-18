-- Staging-only Dashboard API. Caller RLS remains in effect.
create or replace function public.kkt_dashboard_staging_projects()
returns table (id uuid, project_code text, title text, state text)
language sql stable security invoker set search_path to ''
as $$
  select p.id, p.project_code, p.title, p.state
  from kkt_projects.projects p
  join kkt_core.organizations o on o.id = p.org_id
  where (select auth.uid()) is not null
    and o.code like 'SYN-DASH-%' and p.project_code like 'SYN-DASH-%'
  order by p.project_code,p.id
  limit 50
$$;
revoke all on function public.kkt_dashboard_staging_projects() from public, anon;
grant execute on function public.kkt_dashboard_staging_projects() to authenticated;
