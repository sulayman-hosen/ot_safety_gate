# Application API

Every endpoint is implemented in `server/src/routes/` and `server/src/controllers/` using Express 5. The Next.js client forwards `/api/...` and `/launch` through rewrites; it contains no backend handlers. Mongoose models and repositories provide persistence. Browser requests use the public frontend origin.

All responses and downloads are private and `no-store`. Errors return `{ "error": "safe user-facing message", "code": "ERROR_CODE" }` without EHR response bodies. A browser session cookie is required except for demo creation, launch/callback, health and unauthenticated session status.

| Route | Method | Purpose |
|---|---|---|
| `/api/health` | GET | App / MongoDB readiness |
| `/api/session` | GET | Session mode, CSRF token, reviewer capability and expiry; never bearer tokens |
| `/api/demo` | POST | New synthetic scenario session; exact Origin required |
| `/launch?iss=...&launch=...` | GET | Start registered EHR launch |
| `/api/smart/callback?code=...&state=...` | GET | Verify browser/state, exchange code and set opaque session |
| `/api/case?procedure={id}` | GET | Retrieve/re-evaluate the launched patient's case; no patient selector |
| `/api/records` | POST | Save immutable draft or reviewed checklist |
| `/api/records/{id}?format=fhir` | GET | Download FHIR JSON; owner session only |
| `/api/records/{id}?format=cda` | GET | Download CDA XML; owner session only |
| `/api/records/{id}?format=html` | GET | Open a printable escaped HTML summary |
| `/api/logout` | POST | Delete server session and expire its cookie |

## Demo creation

```json
{ "scenario": "complete" }
```

Supported IDs: `complete`, `allergy`, `consent`, `stale`, `abnormal`. Switching scenario rotates/deletes the previous session and resets its browser review state.

## Record creation

Headers: `Content-Type: application/json`, exact `Origin`, `x-csrf-token` from the current session, and an `idempotency-key` of 16–80 alphanumeric/hyphen characters (a UUID is recommended).

```json
{
  "draft": false,
  "procedureId": "demo-surgery",
  "fingerprint": "use-the-current-case-response-fingerprint",
  "notes": "Team reviewed the available evidence.",
  "attestations": {
    "identity": true,
    "consent": true,
    "allergies": true,
    "labs": true
  }
}
```

`draft=true` permits documenting unresolved evidence but does not make the gate pass. Browser-supplied clinical results are never trusted. A successful first creation returns HTTP 201 with `{ id, draft, createdAt }`. A retry with the same key/body returns the original ID (200). A changed body reusing the key returns 409. There is no update/delete route for immutable records.

Important failures: 401 expired/missing session, 403 invalid origin/CSRF or unauthorized reviewer, 409 changed evidence/unresolved gate/idempotency conflict, 413 oversized request, 502 upstream FHIR failure. Individual required-source errors are also included in case `assessment.issues`; reviewed finalization is then disabled.

The API smoke script exercises these behaviors using synthetic data. It is not a production API load test.
