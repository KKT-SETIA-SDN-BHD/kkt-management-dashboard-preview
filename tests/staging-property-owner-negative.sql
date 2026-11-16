-- Read-only staging acceptance probe. Never use a real person's JWT or identity.
-- Run on STAGING qacmlpqtiwwmrypxnnlp, not production.
begin read only;
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000099',true);
select auth.uid() as synthetic_uid,
 (select count(*) from ken_property.properties) as visible_properties,
 (select count(*) from ken_property.rent_periods) as visible_periods,
 (select count(*) from ken_property.rent_receipts) as visible_receipts,
 (select count(*) from public.kkt_ken_property_summary()) as visible_summary;
rollback;
-- Expected all zero in current empty staging. Does not prove cross-owner isolation.
-- Independently test anon denial (expect SQLSTATE 42501):
-- begin read only; set local role anon; select count(*) from ken_property.properties; rollback;
