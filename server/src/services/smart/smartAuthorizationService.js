import { createLocalJWKSet, jwtVerify } from 'jose';
import { config } from '../../config/environment.js';
import { assert } from '../../utils/AppError.js';
import { randomToken, challenge, equal } from '../../utils/securityUtils.js';
import { trustedUrl, fetchJson, readFHIR } from '../fhir/fhirClientService.js';
import { saveLaunch, consumeLaunch } from '../../repositories/clinicalDataRepository.js';
import { humanName } from '../clinical/safetyEvaluationService.js';
export function authOrigins(base) {
  return [new URL(base).origin, ...(process.env.SMART_AUTH_ORIGINS || '').split(',').map(x => x.trim()).filter(Boolean)];
}
export async function beginLaunch(issuer, launch, fetcher = fetch) {
  const c = config();
  assert(!c.memory, 'SMART login requires MongoDB persistence; use the MongoDB setup in README.', 503);
  assert(c.fhirBase && c.clientId, 'Configure SMART_FHIR_BASE and SMART_CLIENT_ID first.', 503);
  assert(issuer === c.fhirBase, 'This EHR issuer is not registered for this application.', 403);
  assert(typeof launch === 'string' && launch.length > 0 && launch.length < 8192, 'An EHR launch handle is required.');
  const allowed = authOrigins(issuer); trustedUrl(issuer, allowed);
  const discovery = await fetchJson(`${issuer}/.well-known/smart-configuration`, {}, fetcher);
  assert(discovery.code_challenge_methods_supported?.includes('S256'), 'This EHR must advertise PKCE S256 support.', 502);
  const auth = trustedUrl(discovery.authorization_endpoint, allowed);
  const tokenEndpoint = trustedUrl(discovery.token_endpoint, allowed).href;
  const state = randomToken(), browser = randomToken(), verifier = randomToken(), nonce = randomToken();
  const redirectUri = `${c.appUrl}/api/smart/callback`;
  const scope = ['launch', ...c.scopes.split(/\s+/).filter(s => s && !s.startsWith('launch'))].join(' ');
  await saveLaunch(state, browser, { issuer, tokenEndpoint, verifier, nonce, redirectUri, clientId: c.clientId, createdAt: Date.now() });
  for (const [k, v] of Object.entries({ response_type: 'code', client_id: c.clientId, redirect_uri: redirectUri, scope, state, aud: issuer, launch, code_challenge: challenge(verifier), code_challenge_method: 'S256', nonce })) auth.searchParams.set(k, v);
  return { location: auth.href, browser };
}
export async function finishLaunch(state, browser, code, fetcher = fetch) {
  const pending = await consumeLaunch(state, browser);
  assert(pending, 'Launch verification failed or expired. Start again from the EHR.', 400);
  assert(typeof code === 'string' && code.length > 0 && code.length < 8192, 'The EHR did not return an authorization code.');
  const c = config(); assert(c.fhirBase === pending.issuer && c.clientId === pending.clientId, 'SMART configuration changed during login.', 409);
  const form = new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: pending.redirectUri, code_verifier: pending.verifier });
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' };
  const secret = process.env.SMART_CLIENT_SECRET || '';
  if (c.authMethod === 'client_secret_basic') { assert(secret, 'SMART_CLIENT_SECRET is required.', 503); headers.Authorization = `Basic ${Buffer.from(`${encodeURIComponent(c.clientId)}:${encodeURIComponent(secret)}`).toString('base64')}`; }
  else if (c.authMethod === 'client_secret_post') { assert(secret, 'SMART_CLIENT_SECRET is required.', 503); form.set('client_id', c.clientId); form.set('client_secret', secret); }
  else { assert(c.authMethod === 'none', 'Unsupported SMART_AUTH_METHOD.', 503); form.set('client_id', c.clientId); }
  const token = await fetchJson(trustedUrl(pending.tokenEndpoint, authOrigins(c.fhirBase)), { method: 'POST', headers, body: form.toString() }, fetcher);
  assert(typeof token.access_token === 'string' && token.token_type?.toLowerCase() === 'bearer' && typeof token.scope === 'string', 'Invalid SMART token response.', 502);
  assert(/^[A-Za-z0-9.-]{1,64}$/.test(token.patient || ''), 'This app requires a single launched patient.', 502);
  assert(!token.encounter || /^[A-Za-z0-9.-]{1,64}$/.test(token.encounter), 'Invalid encounter context.', 502);
  const lifetime = Number.isFinite(Number(token.expires_in)) && Number(token.expires_in) > 0 ? Math.min(Number(token.expires_in), c.ttl) : Math.min(300, c.ttl);
  const result = { mode: 'ehr', patientId: token.patient, encounterId: token.encounter || null, fhirBase: pending.issuer, accessToken: token.access_token, grantedScopes: token.scope, tokenExpiresAt: Date.now() + lifetime * 1000, expiresAt: Date.now() + lifetime * 1000, csrf: randomToken(), actor: { name: 'EHR session • view only', canAttest: false, verified: false } };
  // Access authorization is sufficient for read-only mode. Signed identity is mandatory to attest.
  if (token.id_token && c.oidcIssuer && c.jwksUri) {
    const jwks = await fetchJson(trustedUrl(c.jwksUri, authOrigins(c.fhirBase)), {}, fetcher);
    const { payload } = await jwtVerify(token.id_token, createLocalJWKSet(jwks), { issuer: c.oidcIssuer, audience: c.clientId, algorithms: ['RS256', 'ES256'], requiredClaims: ['exp', 'iat', 'sub', 'nonce'], clockTolerance: 5 });
    assert(equal(payload.nonce, pending.nonce), 'OIDC nonce mismatch.', 401);
    assert(!payload.azp || payload.azp === c.clientId, 'OIDC authorized party mismatch.', 401);
    assert(!Array.isArray(payload.aud) || payload.aud.length <= 1 || payload.azp === c.clientId, 'OIDC authorized party is required for multiple audiences.', 401);
    assert(typeof payload.iat === 'number' && payload.iat * 1000 <= Date.now() + 5000 && payload.iat * 1000 >= pending.createdAt - 300000, 'OIDC identity timestamp is invalid.', 401);
    const identityRef = typeof payload.fhirUser === 'string' ? payload.fhirUser : '';
    const user = identityRef.startsWith(`${c.fhirBase}/`) ? identityRef.slice(c.fhirBase.length + 1) : identityRef;
    if (/^Practitioner\/[A-Za-z0-9.-]{1,64}$/.test(user)) {
      const practitioner = await readFHIR(result, user, fetcher);
      assert(practitioner.resourceType === 'Practitioner' && `Practitioner/${practitioner.id}` === user && practitioner.active !== false, 'Practitioner identity mismatch.', 401);
      result.actor = { id: practitioner.id, reference: user, name: humanName(practitioner), verified: true, canAttest: c.reviewerIds.includes(practitioner.id), resource: practitioner };
    }
  }
  return result;
}
