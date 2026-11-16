# HR RPC security review — 2026-11-17

Read-only inspection of staging Supabase project `qacmlpqtiwwmrypxnnlp`. No records or grants modified.

Five public HR RPCs were inspected: `kkt_hr_manager_status`, `kkt_hr_list_employees`, `kkt_hr_document_register`, `kkt_hr_save_employee`, `kkt_hr_save_document`.

- All five are SECURITY INVOKER (`prosecdef=false`), have authenticated EXECUTE, and deny anonymous EXECUTE.
- `kkt_hr_manager_status` and `kkt_hr_document_register` require both `hr_reader` and `hr_manager` roles.
- `kkt_hr_list_employees` and `kkt_hr_save_employee` require `hr_manager`.
- `kkt_hr_save_document` requires both `hr_reader` and `hr_manager`, validates allowed document kinds/states and checks HR document classification.
- Each reviewed function uses `SET search_path TO ''` and explicitly qualified table/function references.
- Negative test executed as `authenticated` with a synthetic, unassigned JWT subject inside a READ ONLY transaction: `public.kkt_hr_manager_status(synthetic_org)` returned `{\"authorized\":false}`.

**Not yet proven:** positive authorized-user access, cross-organization isolation with populated fixtures, all write RPC authorization under real JWTs, Edge gateway end-to-end behavior, OneDrive folder sharing permissions, and actual production readiness.

The staging HR gateway has `verify_jwt=false`; do not infer platform-level JWT protection from the function's upstream forwarding logic. Do not deploy it to production without reviewing the login exception and complete RPC access boundaries.

Production remains STOP / NO-GO.
