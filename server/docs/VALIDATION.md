# Validation report

Verified on 22 September 2026 using Node.js 24 in the build environment. The project requires Node.js 22 or newer.

## Completed checks

| Check | Result |
|---|---|
| Workspace dependency installation / lockfile | Dependencies installed successfully; root package-lock.json included |
| `npm test` | 68 tests passed, 0 failed |
| Express synthetic integration workflow | 19 API checks passed |
| Next.js production build | Successful; UI routes generated |
| Production Next.js rewrite → Express integration | Same 19 API checks passed through the public frontend origin |
| Root demo launcher | Started both Express and Next.js; API and frontend returned successfully |
| Browser typography | Actual local Roboto and Inter font faces loaded; h1 computed as Roboto and paragraph computed as Inter |
| Browser review | Four team confirmations enabled reviewed record creation; exported Composition was final |
| Browser evidence refresh | Cleared previous review confirmations |
| Browser scenarios | Allergy, consent mismatch, stale INR and abnormal platelets disabled reviewed record creation |
| Browser drafts | Unresolved case produced a draft export |
| Browser source evidence | Dialog opened and closed using Escape |
| Browser mobile | 390px viewport had no document-level horizontal overflow; navigation opened and closed |
| Browser errors | No JavaScript runtime errors during tested flows |

The browser checks used Chromium against actual local Next.js and Express processes. Desktop and mobile screenshots were visually inspected. All patient/reviewer data was synthetic.

## What the automated tests cover

- Exact order/patient/encounter linkage; active confirmed diagnosis; consent status, timing, scope, document and signature evidence.
- Missing, stale, preliminary, conflicting, abnormal and unsupported-unit labs; equivalent platelet unit conversion; LOINC panel components.
- Explicit negative allergy evidence, positive conflicts, direct ingredient matches, unmapped/historical allergies and medication linkage.
- Browser-bound one-use SMART state, PKCE, signed OIDC issuer/audience/nonce verification, missing context and reviewer restrictions using mocked trusted endpoints.
- Encrypted payload round-trip, expired-session rejection, owner isolation and idempotency conflicts.
- FHIR pagination trust boundaries, upstream warning/incomplete results and cross-patient source rejection.
- Document structure, internal reference resolution, draft attester behavior and text escaping.
- Express JSON parsing/size limits, exact Origin checks, safe errors and HttpOnly session cookie expiry units.
- Mongoose strict schema rejection of unexpected plaintext fields, encrypted envelope validation and TTL index declarations.

## Integration boundaries

**A live MongoDB daemon was not successfully run in this environment.** Mongoose schemas and model validation were tested, while HTTP/browser workflows used the explicit in-memory demo adapter. Actual MongoDB writes, duplicate-key concurrency, physical index creation, TTL deletion and restart durability still require testing against your local MongoDB or Atlas service. The implementation is included; this report does not claim those external runtime checks passed.

**No live EHR authorization or clinical deployment was tested.** SMART security tests use deterministic mock endpoints. Register the client and validate vendor scopes, consent/provenance profiles, iframe cookies, reviewer identity and patient/encounter context in the target EHR.

The clinical rules are synthetic examples. This report does not establish clinical safety, legal consent validity, USCDI certification, US Core conformance or C-CDA compliance. The export is Core CDA R2 narrative content; institution-specific import/writeback and legal signing workflows are outside this reference project.

## Reproduce

From the root folder:

```bash
npm ci
npm test
npm run test:integration
npm run build
npm run demo
```

With the demo running, use a second terminal for `npm run test:api` to test the public frontend proxy. For an actual MongoDB check, configure `server/.env`, run `npm run dev`, then set `EXPECT_STORAGE=mongodb` before invoking the API workflow script. Inspect the `sessions`, `launches`, `records` and `audits` collections using your MongoDB administration tool. Restrict this exercise to synthetic test environments.
