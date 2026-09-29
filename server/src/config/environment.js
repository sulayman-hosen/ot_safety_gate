import { assert } from '../utils/AppError.js';
export function config() {
  const envAppUrl = (process.env.APP_URL || 'http://localhost:3000').trim();
  const primaryUrl = envAppUrl.split(',')[0].trim();
  const appUrl = new URL(primaryUrl);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(appUrl.hostname);
  assert(appUrl.protocol === 'https:' || (local && appUrl.protocol === 'http:'), 'APP_URL must use HTTPS outside localhost.', 503);
  const memory = process.env.STORAGE_MODE === 'memory';
  const demoEnabled = process.env.DEMO_ENABLED !== 'false';
  assert(!memory || demoEnabled, 'Memory storage is only available in demo mode.', 503);
  assert(!memory || local, 'Memory demo must run on localhost.', 503);
  const embedded = process.env.EMBEDDED_COOKIE === 'true';
  assert(!embedded || appUrl.protocol === 'https:', 'Embedded cookies require HTTPS.', 503);

  const rawOrigins = [
    appUrl.origin,
    'https://ot-safety-gate-two.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...(process.env.ALLOWED_ORIGINS || '').split(','),
    ...envAppUrl.split(',')
  ];
  const allowedOrigins = Array.from(
    new Set(
      rawOrigins
        .map(u => {
          try {
            return u ? new URL(u.trim()).origin : null;
          } catch {
            return null;
          }
        })
        .filter(Boolean)
    )
  );

  return {
    appUrl: appUrl.origin,
    allowedOrigins,
    secure: appUrl.protocol === 'https:',
    embedded, memory, demoEnabled,
    ttl: Math.max(5, Math.min(60, Number(process.env.SESSION_TTL_MINUTES) || 30)) * 60,
    clinicalApproved: process.env.CLINICAL_POLICY_APPROVED === 'true' && Boolean(process.env.CLINICAL_POLICY_APPROVER?.trim()),
    fhirBase: (process.env.SMART_FHIR_BASE || '').replace(/\/$/, ''),
    clientId: process.env.SMART_CLIENT_ID || '',
    scopes: process.env.SMART_SCOPES || 'openid fhirUser patient/Patient.r patient/Encounter.r patient/ServiceRequest.rs patient/Condition.rs patient/Consent.rs patient/DocumentReference.rs patient/Provenance.rs patient/Observation.rs patient/AllergyIntolerance.rs patient/MedicationRequest.rs user/Practitioner.r',
    authMethod: process.env.SMART_AUTH_METHOD || 'none',
    oidcIssuer: process.env.SMART_OIDC_ISSUER || '',
    jwksUri: process.env.SMART_JWKS_URI || '',
    reviewerIds: (process.env.SMART_REVIEWER_IDS || '').split(',').map(x => x.trim()).filter(Boolean)
  };
}
