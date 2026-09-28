# ORBIT · Operating Theater Pre-Surgical Safety Gate

A runnable surgical checklist reference project with **Next.js, JavaScript, Tailwind CSS, Node.js, Express.js, MongoDB and Mongoose**. Frontend code lives in `client/`; backend code lives in `server/`.

Headings (`h1`–`h6`) use **Roboto**. Paragraphs (`p`) and body text use **Inter**. Both fonts are bundled locally. All application logic is JavaScript/JSX; there is no TypeScript or Python source. Tailwind supplies the styling. JSON, CDA XML and printable HTML are clinical document output formats, not additional application languages.

This is a candidate reference implementation with synthetic example policies. It is not a clinically validated or certified product. Automated matches require human review and never independently authorize surgery.

## Run the demo

Install **Node.js 22 or newer** and npm. Open a terminal in the extracted `ot-surgical-safety-platform` folder:

```bash
npm ci
npm run demo
```

Open **http://localhost:3000** and select **Open interactive demo**. Use that exact URL because origin checks are exact. The launcher starts both the Express API on port 5000 and the Next.js frontend on port 3000.

Try complete evidence, antibiotic allergy, consent mismatch, outdated INR and abnormal platelets. Complete all four team confirmations to record a reviewed checklist. Cases with unresolved evidence can still produce a clearly marked draft. Exports include FHIR JSON, a CDA narrative and a printable summary.

The demo needs no database or EHR credentials. It uses synthetic data, an ephemeral encryption key and memory storage. Data resets when the Express process restarts. The memory demo cannot connect to a live EHR. Internet is required for `npm ci`; demo operation and font loading work without external services.

## Main folders

| Location | Responsibility |
|---|---|
| `client/src/app/` | Next.js page/layout and the Tailwind theme |
| `client/src/components/layout/` | Sidebar and workspace header |
| `client/src/components/dashboard/` | Patient overview, gate status, scenarios and session activity |
| `client/src/components/evidence/` | Procedure, consent, allergy, laboratory and source evidence components |
| `client/src/components/review/` | Team confirmations and document download UI |
| `client/src/components/ui/` | Reusable buttons, status badges and icons |
| `client/src/hooks/` | Frontend session and checklist interaction state |
| `client/src/services/` | Browser API request helper |
| `client/src/utils/` | Display formatting |
| `client/src/constants/` | Scenario labels and team confirmation text |
| `client/src/assets/fonts/` | Local Roboto and Inter WOFF2 files |
| `client/public/` | Public icon |
| `client/docs/` | Frontend guide and font licenses |
| `server/src/routes/` | Express endpoint registration |
| `server/src/controllers/` | Request validation and workflow coordination |
| `server/src/middleware/` | Session authentication, CSRF/origin checks and safe errors |
| `server/src/services/clinical/` | Synthetic fixtures and clinical evidence evaluation |
| `server/src/services/fhir/` | Patient-bound EHR requests and pagination |
| `server/src/services/smart/` | SMART authorization, PKCE and verified reviewer identity |
| `server/src/services/documents/` | FHIR, CDA and printable summary builders |
| `server/src/models/` | Mongoose schemas for sessions, launches, records and audits |
| `server/src/repositories/` | Encrypted MongoDB persistence and explicit demo memory adapter |
| `server/src/config/` | Environment, Mongoose connection and example clinical policy |
| `server/src/utils/` | Encryption, cookies and application errors |
| `server/tests/` | Clinical, security, model and Express regression checks |
| `server/scripts/` | Project launcher, fixture generation and API checks |
| `server/samples/` | Generated synthetic clinical documents and FHIR collections |
| `server/docs/` | API, standards, policy, SMART setup and validation guides |

The root contains only the two application folders, workspace package files and project guides. `page.jsx`, `layout.jsx`, `not-found.jsx` and Next/PostCSS configuration names follow framework conventions. Feature files use descriptive names such as `ProcedureEvidenceCard.jsx`, `smartAuthorizationService.js` and `ChecklistRecord.js`.

## MongoDB and Mongoose setup

Start your local MongoDB instance or prepare a MongoDB Atlas connection string. From the project root:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
npm run key
```

Windows PowerShell can use `Copy-Item server/.env.example server/.env` and `Copy-Item client/.env.example client/.env.local`.

Paste the generated base64 key into `SESSION_ENCRYPTION_KEY` in **server/.env**. Set `MONGODB_URI` there and retain `STORAGE_MODE=mongo`. Then:

```bash
npm run dev
```

The normal development mode uses **Mongoose-backed MongoDB** for sessions, launch states, checklist records and audit events. Session and clinical record payloads are encrypted with AES-256-GCM. Sessions and SMART states have TTL indexes; session expiry is also checked in code. Record creation is immutable and idempotent; downloads are scoped to the owner session. The application stores no bearer token in browser storage.

Keep server secrets in `server/.env`; do not place them in `client/.env.local` or any `NEXT_PUBLIC_` variable. Client configuration contains only `BACKEND_URL`, `CLIENT_PORT` and trusted framing origins. Mongoose database connectivity needs a running MongoDB service; no database credentials are included.

To run each application in its own terminal:

```bash
npm run dev --workspace server
npm run dev --workspace client
```

Use `npm run dev` at the root if you want both processes managed together. `npm ci` at the root installs both workspaces with one lockfile.

## Build and test

```bash
npm test
npm run test:integration
npm run build
npm start
```

`npm start` starts the built Next.js frontend and the Express API with MongoDB configuration. Build uses `client/.env.local`; rebuild when changing `BACKEND_URL` or `EHR_FRAME_ORIGINS`. The integration command starts a temporary local Express server with synthetic memory data and runs the API workflow checks automatically.

With a demo already running, `npm run test:api` verifies the **public Next.js proxy + Express API** at localhost:3000. For an explicitly configured MongoDB synthetic environment set `EXPECT_STORAGE=mongodb`. API checks create synthetic sessions/records and must not target a patient-care system.

`npm run fixtures` refreshes `server/samples/`. Fixture timestamps age; the interactive demo generates fresh dates for each session.

## How the two applications connect

The browser calls `/api/...` on the same origin as the frontend. `client/next.config.js` forwards those requests and `/launch` to Express using Next.js rewrites. Next.js contains no backend API handlers. All authentication, authorization, EHR requests, clinical evaluation, exports and persistence are implemented in `server/`.

For a hosted installation, expose the Next.js origin publicly and keep the Express service reachable by that frontend server. `APP_URL` in the server must equal the public frontend origin. `BACKEND_URL` in the client points to the internal Express address. This preserves same-origin cookies and CSRF checks. The default Express bind address is loopback; configure `SERVER_HOST` for your private hosting network as needed.

## SMART and clinical requirements

| Requirement | Included implementation |
|---|---|
| EHR launch | SMART discovery, code exchange, S256 PKCE, one-use browser-bound state, nonce and exact endpoint trust |
| Patient and encounter | Bound to the verified token response, with patient/encounter checks on source resources |
| Procedure and diagnosis | Scheduled FHIR R4 ServiceRequest with CPT, linked confirmed SNOMED diagnosis and explicit local association |
| Consent | Matching surgery and CPT, validity period, patient verification, final DocumentReference and patient signature Provenance evidence |
| Labs | LOINC-filtered Observation searches, panel components, final status, UCUM normalization and sample age/range checks |
| Antibiotic/allergy check | Surgery-linked medication order; explicit no-known-allergy evidence; ingredient conflicts and class/unmapped review |
| Team review | Four human confirmations; authorized reviewer; server evidence refetch and fingerprint comparison on save |
| Documents | FHIR R4 document Bundle + Composition, Core CDA R2 narrative XML and printable HTML |
| Persistence | Node.js / Express controllers with Mongoose models and encrypted MongoDB repositories |

Register `http://localhost:3000/launch` and `http://localhost:3000/api/smart/callback` for local SMART testing. Configure the exact FHIR base, client ID, authorization origins, OIDC issuer/JWKS and reviewer allowlist in `server/.env`. See [server/docs/SMART_SETUP.md](server/docs/SMART_SETUP.md). EHR sign-in/consent prompts are controlled by the EHR; the app cannot guarantee prompt-free login. Public sandboxes often lack scheduled surgery and signed consent evidence.

The included CPT–SNOMED association, antibiotic dictionary and laboratory thresholds are **limited educational examples**. Unknown or incomplete evidence remains unresolved. Review and replace `server/src/config/clinicalPolicy.js` with institutional policy before enabling live attestation. See [server/docs/CLINICAL_POLICY.md](server/docs/CLINICAL_POLICY.md).

USCDI describes data elements; it does not define a single document encoding. These exports make no US Core, C-CDA, certification or legal signature conformance claim. The application records signature evidence but does not cryptographically validate patient consent signatures. See [server/docs/STANDARDS.md](server/docs/STANDARDS.md).

Records are downloaded for the clinical record workflow; automatic EHR writeback is not implemented. Download before ending the session. MongoDB retention is operator-managed, and there is no cross-session record history portal.

## Troubleshooting

| Problem | Fix |
|---|---|
| API does not become ready | Check `server/.env`, encryption key and MongoDB service, or use `npm run demo` |
| API unavailable in browser | Ensure both processes run and client `BACKEND_URL` points to Express |
| 403 origin check | Open the exact server `APP_URL`, normally `http://localhost:3000` |
| Encryption key error | Paste the base64 output from `npm run key`; retain the same key for existing records |
| Port already in use | Change server `PORT`, client `CLIENT_PORT` and corresponding URLs together |
| SMART launch fails | Check registration, exact FHIR issuer, S256 metadata, callback, endpoint origins and cookies |
| Review controls disabled | Resolve evidence issues and confirm reviewer/local policy configuration |
| Font not showing | Confirm both WOFF2 files are present, then rebuild the client |

Read [START_HERE_BN.md](START_HERE_BN.md) for Bangla setup instructions and [server/docs/VALIDATION.md](server/docs/VALIDATION.md) for verified behavior and remaining integration boundaries.
