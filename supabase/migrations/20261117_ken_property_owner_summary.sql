-- STAGING migration: owner-scoped read-only property summary.
-- Apply only after ken_property_staging_private_foundation.
grant usage on schema ken_property to authenticated;
grant select on ken_property.properties,ken_property.rent_periods,ken_property.rent_receipts to authenticated;
create or replace function public.kkt_ken_property_summary()
returns table(property_id uuid,property_label text,property_kind text,periods_count bigint,received_total numeric)
language sql stable security invoker set search_path = ''
as $$
 select p.id,p.property_label,p.property_kind,
 (select count(*) from ken_property.rent_periods rp where rp.owner_user_id=p.owner_user_id and rp.property_id=p.id),
 (select coalesce(sum(rr.amount_received),0) from ken_property.rent_periods rp join ken_property.rent_receipts rr on rr.owner_user_id=rp.owner_user_id and rr.rent_period_id=rp.id where rp.owner_user_id=p.owner_user_id and rp.property_id=p.id and rr.review_state='verified')
 from ken_property.properties p
 where p.owner_user_id=(select auth.uid())
 order by p.property_label,p.id limit 100
$$;
revoke all on function public.kkt_ken_property_summary() from public,anon;
grant execute on function public.kkt_ken_property_summary() to authenticated;
