import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPair, exportJWK, SignJWT } from 'jose';
import { saveLaunch } from '../src/repositories/clinicalDataRepository.js';
import { randomToken } from '../src/utils/securityUtils.js';
import { finishLaunch } from '../src/services/smart/smartAuthorizationService.js';
process.env.STORAGE_MODE = 'memory'; process.env.APP_URL = 'http://localhost:3000';
process.env.SMART_FHIR_BASE = 'https://ehr.test/fhir'; process.env.SMART_CLIENT_ID = 'test-client';
process.env.SMART_OIDC_ISSUER = 'https://ehr.test/auth'; process.env.SMART_JWKS_URI = 'https://ehr.test/jwks'; process.env.SMART_REVIEWER_IDS = 'doctor1';
const pair = await generateKeyPair('RS256'), jwk = { ...await exportJWK(pair.publicKey), kid: 'test-key', alg: 'RS256' };
async function attempt({ nonceMismatch = false, audience = 'test-client', user = 'https://ehr.test/fhir/Practitioner/doctor1', noPatient = false, fakeSignature = false } = {}) {
  const state = randomToken(), browser = randomToken(), nonce = randomToken(), verifier = randomToken();
  await saveLaunch(state, browser, { issuer: process.env.SMART_FHIR_BASE, clientId: 'test-client', nonce, verifier, createdAt: Date.now(), redirectUri: 'http://localhost:3000/api/smart/callback', tokenEndpoint: 'https://ehr.test/token' });
  const token = await new SignJWT({ nonce: nonceMismatch ? 'wrong' : nonce, fhirUser: user }).setProtectedHeader({ alg: 'RS256', kid: 'test-key' }).setIssuer(process.env.SMART_OIDC_ISSUER).setAudience(audience).setSubject('user1').setIssuedAt().setExpirationTime('5m').sign(fakeSignature ? (await generateKeyPair('RS256')).privateKey : pair.privateKey);
  let exchanged = false;
  const result = await finishLaunch(state, browser, 'authorization-code', async (url, options) => {
    const path = new URL(url).pathname;
    let data;
    if (path === '/token') {
      const form = new URLSearchParams(options.body); assert.equal(form.get('code_verifier'), verifier); assert.equal(form.get('redirect_uri'), 'http://localhost:3000/api/smart/callback'); assert.equal(form.get('code'), 'authorization-code'); exchanged = true;
      data = { access_token: 'test-access-token', token_type: 'Bearer', expires_in: 600, scope: 'launch openid fhirUser patient/Patient.r', ...(!noPatient ? { patient: 'patient1', encounter: 'encounter1' } : {}), id_token: token };
    } else if (path === '/jwks') data = { keys: [jwk] };
    else if (path === '/fhir/Practitioner/doctor1') data = { resourceType: 'Practitioner', id: 'doctor1', active: true, name: [{ text: 'Test Clinician' }] };
    else throw new Error('Unexpected endpoint');
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  });
  assert.ok(exchanged); return result;
}
test('SMART code exchange verifies identity and permits only an allowlisted clinician', async () => { const result = await attempt(); assert.equal(result.actor.canAttest, true); assert.equal(result.patientId, 'patient1'); assert.equal(result.encounterId, 'encounter1'); assert.equal(result.actor.name, 'Test Clinician'); });
test('OIDC nonce mismatch is rejected', async () => assert.rejects(attempt({ nonceMismatch: true })));
test('OIDC audience mismatch is rejected', async () => assert.rejects(attempt({ audience: 'another-client' })));
test('OIDC signature forgery is rejected', async () => assert.rejects(attempt({ fakeSignature: true })));
test('missing patient launch context is rejected', async () => assert.rejects(attempt({ noPatient: true })));
test('foreign or malformed practitioner reference never grants attestation', async () => { const result = await attempt({ user: 'Practitioner/https://ehr.test/fhir/doctor1' }); assert.equal(result.actor.canAttest, false); });
