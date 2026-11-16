# KKT Management Dashboard — Production Read-only Release Gate

Status: RELEASE CANDIDATE ONLY — NO PRODUCTION DEPLOYMENT

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
