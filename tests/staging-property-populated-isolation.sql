-- Staging only. Synthetic users and property records, rolled back after assertions.
-- No real credentials, tenants, payments or persistent fixtures.
begin;
insert into auth.users(id,instance_id,aud,role,email,created_at,updated_at)
values
('00000000-0000-4000-8000-0000000000a1','00000000-0000-0000-0000-000000000000','authenticated','authenticated','synthetic-owner-a@invalid.example',now(),now()),
('00000000-0000-4000-8000-0000000000b2','00000000-0000-0000-0000-000000000000','authenticated','authenticated','synthetic-owner-b@invalid.example',now(),now());
insert into ken_property.properties(id,owner_user_id,property_label,property_kind)
values ('00000000-0000-4000-8000-0000000000c1','00000000-0000-4000-8000-0000000000a1','SYNTHETIC TEST ONLY','shoplot');
insert into ken_property.rent_periods(id,owner_user_id,property_id,rental_month,amount_due)
values ('00000000-0000-4000-8000-0000000000d1','00000000-0000-4000-8000-0000000000a1','00000000-0000-4000-8000-0000000000c1','2026-11-01',100);
insert into ken_property.rent_receipts(owner_user_id,rent_period_id,amount_received,received_on,review_state)
values ('00000000-0000-4000-8000-0000000000a1','00000000-0000-4000-8000-0000000000d1',100,'2026-11-05','verified');
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-0000000000b2',true);
do $$ begin
 if (select count(*) from ken_property.properties)<>0 or (select count(*) from ken_property.rent_periods)<>0 or (select count(*) from ken_property.rent_receipts)<>0 or (select count(*) from public.kkt_ken_property_summary())<>0 then raise exception 'CROSS_OWNER_DENIAL_FAILED'; end if;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-0000000000a1',true);
do $$ begin
 if (select count(*) from ken_property.properties)<>1 or (select count(*) from ken_property.rent_periods)<>1 or (select count(*) from ken_property.rent_receipts)<>1 or (select count(*) from public.kkt_ken_property_summary())<>1 then raise exception 'OWNER_READ_FAILED'; end if;
end $$;
rollback;
