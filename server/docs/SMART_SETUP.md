# SMART EHR integration

## Registration

Use [SMART App Launcher](https://launch.smarthealthit.org/) or a private FHIR R4 EHR sandbox. Configure an **EHR launch with a practitioner, patient and encounter**. This app implements the EHR launch flow; it does not implement arbitrary user-entered standalone issuers.

For local testing register:

| Setting | Value |
|---|---|
| Launch URI | `http://localhost:3000/launch` |
| Redirect URI | `http://localhost:3000/api/smart/callback` |
| Authorization response | `code` |
| PKCE method | `S256` |
| Client authentication | Match `SMART_AUTH_METHOD`: `none`, `client_secret_basic` or `client_secret_post` |
| FHIR version | R4 / 4.0.1 |

Use HTTPS and exact registered URIs for a real hosted installation. Confidential deployments should use the authentication method required by the institution. Private-key JWT client authentication is not implemented.

## Configure the app

Backend settings belong in `server/.env`. The public frontend origin is `APP_URL`; the client forwards launch and API requests to Express. Set `BACKEND_URL` in `client/.env.local` if the API uses a different internal address.

1. Use the MongoDB setup in README and set a persistent 32-byte encryption key. The memory demo deliberately rejects SMART launches.
2. Set `SMART_FHIR_BASE` to the exact sandbox FHIR base that the launcher will provide as `iss` (without a trailing slash). Some launcher modes generate an encoded `/sim/.../fhir` path: copy that **complete exact base**, restart the app, and launch using the corresponding simulator URL. A guessed base or only the hostname will not match.
3. Set `SMART_CLIENT_ID` from registration. Set the secret only server-side if the registration requires it.
4. Set comma-separated `SMART_AUTH_ORIGINS` for any trusted authorization/JWKS origin different from the FHIR origin. HTTPS is required; redirects are not followed. Never use wildcard hosts.
5. The app discovers `authorization_endpoint`, `token_endpoint` and S256 support at `{FHIR_BASE}/.well-known/smart-configuration`.
6. For verified clinician identity, pin the exact expected `SMART_OIDC_ISSUER` and `SMART_JWKS_URI` from the trusted EHR's documentation/registration. Do not derive trust from an unverified token. Set `SMART_REVIEWER_IDS` to the FHIR Practitioner IDs authorized by your institution to attest. Patient/RelatedPerson identities and unsupported PractitionerRole identities remain view-only.

The browser is redirected to the EHR authorization endpoint with `launch`, `aud`, `state`, `nonce`, requested scopes and PKCE. EHR SSO is reused only when the EHR permits it. The callback consumes the server-side state once, checks its browser cookie, exchanges the code and rotates the session.

## Requested scopes

Default scopes are the per-resource read/search scopes in `server/.env.example`. The app adds `launch` automatically for an EHR launch. It requests `openid fhirUser` for an authenticated reviewer.

The EHR must provide patient and encounter context. Some vendors require explicit registration of encounter launch context. `launch/encounter` is a standalone-context request, so this app does not add it to its EHR-launch request.

If a sandbox only supports SMART v1 syntax, configure equivalent `.read` scopes in `SMART_SCOPES`. Do not claim broad compatibility until testing that server. Some servers do not support `patient/Provenance.rs` or Consent/DocumentReference access. Negotiate the supported least-privilege scope and target searches with the vendor. Missing scopes/data leave the gate unresolved; the app never pretends they succeeded.

Refresh tokens and `offline_access` are not requested or retained. Sessions expire no later than access-token expiry and the configured maximum (default 30 minutes). If expiry is omitted, the session uses a conservative five-minute limit. Relaunch after expiry. The application stores only the access token it needs, encrypted on the server.

## EHR data expectations

| Source | Search / expected linkage |
|---|---|
| Patient | Read token-response patient ID |
| Encounter | Read token-response encounter ID, patient match, `in-progress` |
| ServiceRequest | `patient={id}`, optionally launched `encounter`; surgical category or CPT code; explicit schedule |
| Condition | `patient={id}`; referenced by `ServiceRequest.reasonReference` |
| Consent | `patient={id}`; exact surgery reference in `provision.data` |
| DocumentReference | `patient={id}`; consent source and `context.related` surgery reference |
| Provenance | `target=Consent/... ,DocumentReference/...`; no nonstandard patient search |
| Observation | `patient={id}&combo-code=http://loinc.org\|777-3,...` to cover root codes and panel components |
| AllergyIntolerance | All patient allergy records; no silently assumed negative status |
| MedicationRequest | Patient orders with `basedOn` explicitly referencing the surgery; ingredient-coded `medicationCodeableConcept` |

Searches request `_count=100`, traverse same-base next links and stop with an unresolved error for truncation, loops, conflicting versions or warning/error OperationOutcomes. Unsupported `combo-code` is surfaced as unavailable evidence; a vendor adapter must explicitly implement equivalent root/component queries before claiming support. `Medication` reference expansion, `reasonCode`, additional lab code variants, Appointment-based scheduling and custom consent profiles require a reviewed adapter.

## Embedding

For HTTPS iframe use, configure `EHR_FRAME_ORIGINS` in `client/.env.local` with exact trusted HTTPS parent origins and rebuild (Next headers are generated at build time). Set `EMBEDDED_COOKIE=true` in `server/.env` to use `SameSite=None; Secure` cookies. CSP restricts framing to those parents and self.

Some browsers still block third-party cookies. Use the EHR's approved top-level/new-window launch in that case; do not weaken state validation. The app does not implement a cookie-less workaround or FHIRcast. When the chart changes, the host must close/relaunch the app. The screen continues to show the patient bound to its original SMART launch.

## Local sandbox fixtures

`server/samples/*-resources.json` contain synthetic FHIR **collection** Bundles, not transaction Bundles. Use your private sandbox's fixture import tooling or convert them to transactions intentionally. Never bulk-import them into an operational EHR. Imported timestamps age; regenerate with `npm run fixtures` and refresh the case if needed.

Public SMART launch tests may succeed at authorization but remain blocked at clinical checks because these surgical resources are absent. That is correct behavior. The bundled demo provides a complete reproducible clinical workflow without depending on public sandbox data quality.
