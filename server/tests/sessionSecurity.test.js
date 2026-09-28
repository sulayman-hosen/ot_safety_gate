import test from 'node:test';
import assert from 'node:assert/strict';
import { challenge, randomToken, seal, unseal, equal } from '../src/utils/securityUtils.js';
import { fhirUrl, trustedUrl, searchFHIR, loadClinicalData } from '../src/services/fhir/fhirClientService.js';
import { saveLaunch, consumeLaunch, saveSession, readSession, putRecord, readRecord } from '../src/repositories/clinicalDataRepository.js';
process.env.STORAGE_MODE = 'memory'; process.env.APP_URL = 'http://localhost:3000';
const s = { mode: 'ehr', fhirBase: 'https://ehr.test/fhir', accessToken: 'unit-test-token', tokenExpiresAt: Date.now() + 60000, patientId: 'p1' };
const response = data => new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/fhir+json' } });
const bundle = (resources, next) => ({ resourceType: 'Bundle', type: 'searchset', entry: resources.map(resource => ({ resource })), ...(next ? { link: [{ relation: 'next', url: next }] } : {}) });
test('PKCE S256 matches the RFC 7636 vector', () => assert.equal(challenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'), 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM'));
test('AES-GCM round-trip and authentication failure', () => { const encrypted = seal({ secret: 'token' }); assert.deepEqual(unseal(encrypted), { secret: 'token' }); const pieces = encrypted.split('.'); const b = Buffer.from(pieces[1], 'base64'); b[0] ^= 1; pieces[1] = b.toString('base64'); assert.throws(() => unseal(pieces.join('.'))); });
test('constant-time comparisons reject malformed values', () => { assert.equal(equal(undefined, ''), false); assert.equal(equal('a', 'ab'), false); assert.equal(equal('abc', 'abc'), true); });
test('launch state is browser-bound and consumed only once', async () => { const state = randomToken(); await saveLaunch(state, 'browser1', { verifier: 'secret' }); assert.equal(await consumeLaunch(state, 'browser2'), null); assert.equal((await consumeLaunch(state, 'browser1')).verifier, 'secret'); assert.equal(await consumeLaunch(state, 'browser1'), null); });
test('expired sessions are rejected even before database TTL cleanup', async () => { const id = randomToken(); await saveSession(id, { expiresAt: Date.now() - 1 }); assert.equal(await readSession(id), null); });
test('records enforce owner isolation and idempotency conflicts', async () => { const id = randomToken(); await putRecord(id, 'owner1', { document: 'a' }, 'hash-a'); assert.equal(await readRecord(id, 'owner2'), null); await assert.rejects(putRecord(id, 'owner1', { document: 'b' }, 'hash-b')); assert.equal((await readRecord(id, 'owner1')).document, 'a'); });
test('FHIR URL guard rejects another server, tenant, credentials and path traversal', () => { for (const url of ['https://evil.test/fhir/Patient/p1', 'https://ehr.test/other/Patient/p1', '../other', 'http://ehr.test/fhir/', 'https://a:b@ehr.test/fhir/', 'https://ehr.test/fhir/%2fother']) assert.throws(() => fhirUrl(url, s.fhirBase), url); assert.equal(fhirUrl('Patient/p1', s.fhirBase).href, 'https://ehr.test/fhir/Patient/p1'); });
test('OAuth endpoints must match configured HTTPS origins', () => { assert.throws(() => trustedUrl('http://localhost/token', ['http://localhost'])); assert.throws(() => trustedUrl('https://evil.test/token', ['https://ehr.test'])); });
test('FHIR search follows pages and preserves bearer-token boundary', async () => { let calls = 0; const results = await searchFHIR(s, 'Observation', { patient: 'p1' }, async (url, options) => { calls++; assert.equal(options.redirect, 'error'); assert.equal(options.headers.Authorization, 'Bearer unit-test-token'); return response(bundle([{ resourceType: 'Observation', id: `o${calls}` }], calls === 1 ? 'https://ehr.test/fhir/Observation?page=2' : null)); }); assert.equal(results.length, 2); assert.equal(calls, 2); });
test('hostile next links are rejected before forwarding a bearer token', async () => { let calls = 0; await assert.rejects(searchFHIR(s, 'Observation', {}, async () => { calls++; return response(bundle([], 'https://evil.test/fhir/Observation')); })); assert.equal(calls, 1); });
test('warning OperationOutcome makes results incomplete', async () => { await assert.rejects(searchFHIR(s, 'Observation', {}, async () => response(bundle([{ resourceType: 'OperationOutcome', issue: [{ severity: 'warning', code: 'incomplete' }] }])))); });
test('missing pages cannot look like an empty normal list', async () => { await assert.rejects(searchFHIR(s, 'Observation', {}, async () => response({ ...bundle([]), total: 8 }))); });
test('cross-patient resources are discarded and block clinical completeness', async () => {
  const d = await loadClinicalData(s, async url => {
    if (String(url).endsWith('Patient/p1')) return response({ resourceType: 'Patient', id: 'p1' });
    const type = new URL(url).pathname.split('/').pop();
    return response(bundle(type === 'AllergyIntolerance' ? [{ resourceType: type, id: 'wrong', patient: { reference: 'Patient/p2' } }] : []));
  }); assert.deepEqual(d.allergies, []); assert.ok(d.issues.some(i => i.includes('patient mismatch')));
});
