# Staging authorization helper inspection — 2026-11-17

Read-only inspection of Supabase staging `qacmlpqtiwwmrypxnnlp`. No SQL changes, real-user queries, production changes or deployment.

| Function | Security definer | authenticated EXECUTE | anon EXECUTE | Verified logic |
|---|---|---|---|---|
| `kkt_private.org_member(target_org)` | yes | yes | no | EXISTS active membership with org_id = target_org and user_id = auth.uid() |
| `kkt_private.project_member(target_org,target_project)` | yes | yes | no | org_member(target_org) AND matching project_members row for auth.uid() |
| `kkt_private.has_role(target_org,target_role)` | yes | yes | no | org_member(target_org) AND matching member_roles row for auth.uid() |

All three definitions set `search_path TO ''` and schema-qualify referenced tables. These are encouraging structural controls but **not** a proof of tenant isolation. SECURITY DEFINER bypass implications, schema USAGE grants, authenticated vs anonymous identity behavior, and all policy paths need real caller-context tests.

## Release blockers
1. Test two synthetic authenticated users in different organizations and projects; verify cross-scope reads return zero rows or 403.
2. Test disabled memberships and role revocation.
3. Test direct invocation permissions and API schema exposure without any privileged browser credentials.
4. Verify parent-document RLS is enforced when retrieving document versions.
5. Define independent private-property grants before enabling Mr Ken's personal rental module.
6. Verify Edge Function authorization and provenance against real source records before returning finance data.

G2 STOP / NO-GO remains. No test users created, no production deployment.
