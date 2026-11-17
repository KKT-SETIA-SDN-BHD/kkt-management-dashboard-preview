# KKT Management Dashboard — Production Read-only Release Gate

Status: RELEASE CANDIDATE ONLY — NO PRODUCTION DEPLOYMENT

## Production preflight — 2026-11-18 (MYT)

Decision: **G2 STOP / NO-GO**. Read-only Production inventory returned no Edge Functions. Of the five Dashboard schemas checked, only `ken_property` was present. Schema presence alone does not establish readiness. No Production data or settings were changed.

| Gate | Evidence and remaining work |
| --- | --- |
| Android Staging sign-in and PIN | PASS for the synthetic page. Session-local PIN and Android Chrome outcomes are recorded in [Staging acceptance](pin-unlock-staging-acceptance.md). |
| Populated database authorization | PASS in Staging SQL under `authenticated` role and synthetic JWT subjects. The [rollback-only test](https://github.com/KKT-SETIA-SDN-BHD/kkt-management-dashboard-preview/blob/ac5def70218be22701953e2758e5be960bb96d63/tests/staging-dashboard-populated-isolation.sql) passed 24 exact row-set assertions. Two synthetic users covered own-scope reads, same-organization cross-project denial, cross-organization denial, private-owner isolation, parent-document version scope, finance-role revocation and disabled membership. Zero test users and organizations remained after rollback. |
| Anonymous database grants | Staging catalog showed RLS on all 12 tables checked across the five Dashboard schemas. The `anon` role had no SELECT grants on those tables and no EXECUTE grant on `public.kkt_ken_property_summary()`. |
| HTTP authorization with populated data | OPEN. The v5 gateway denial path passed its prior HTTP matrix. The gateway deliberate deny response still needs to be replaced by a caller-scoped Staging read path with verified provenance and direct HTTP tests using two actual Auth-signed test identities. SQL role tests do not exercise PostgREST or Edge Function routing. |
| Documents and finance | OPEN. Verify authorized and denied OneDrive file access and link expiry with synthetic files, and reconcile claims and amounts against the approved source of record. |
| Production release and rollback | OPEN. Prepare reviewed schema/gateway deployment for the approved scopes, establish rollback and monitoring, then run the gated release. |

Staging Security Advisor still reports [leaked-password protection disabled](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). It also flags three WhatsApp/PO definer RPCs outside this Dashboard release. The Dashboard's RLS-without-policy observations for the roles and project-assignment tables coincide with denied SELECT grants for `authenticated` and `anon`.

## Existing preview
- GitHub Pages public repository currently serves synthetic fixtures and fictional role selection.
- Demo sign-in is not authentication; it must never authorize real financial, employee, supplier or property data.
- Preserve the existing preview until secure backend and identity checks pass.

## Required production architecture
1. GitHub Pages may host only static public client code. Never commit customer data, private PDFs, service_role keys, tokens, passwords or internal OneDrive URLs.
2. Implement real Supabase Auth; enforce authorization server-side through tenant/project-scoped RLS or an authenticated Edge Function. No user_metadata authorization.
3. Finance/claims and private rental portfolios require distinct explicit access grants; verify Mr Ken's identity and roles before granting any data access.
4. Backend provides read-only, minimal, paginated claims/projects/property summaries, with source timestamps and verification states. No synthetic values may be presented as live financials.
5. OneDrive documents must be opened only through a backend that checks each user's document entitlement and returns short-lived access; never use permanently public sharing links.
6. Validate zero cross-organization, cross-project and private-property disclosure using two distinct synthetic user accounts.
7. Ensure errors fail closed, audit access, and avoid sensitive client-side caching; set appropriate CSP/CORS and referrer controls.
8. Production data connection, identity setup and public Pages release require separate approval after documented PASS evidence.

## Acceptance checklist
- [ ] Identify exact GitHub Pages publish source and deployment workflow
- [ ] Identify staging vs production Supabase endpoints and schemas
- [ ] Implement real login and session expiry
- [ ] Confirm RLS and data API exposure boundaries
- [ ] Validate real claim/payment provenance and read-only scope
- [ ] Validate PDF permission and link expiry
- [ ] Test mobile UX and error/empty states
- [ ] Run Supabase security advisors and regression tests
- [ ] Confirm rollback to synthetic preview
- [ ] Obtain production release approval

Production remains G2 STOP / NO-GO. WhatsApp outbound and PO approvals are outside this read-only release.
