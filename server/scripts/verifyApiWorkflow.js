import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
let cookie = '', csrf = '', snapshot, count = 0;
async function request(path, { method = 'GET', data, token = csrf, origin = base, key, auth = true } = {}) {
  const headers = { Origin: origin, ...(auth && cookie ? { Cookie: cookie } : {}), ...(token ? { 'x-csrf-token': token } : {}), ...(data ? { 'Content-Type': 'application/json' } : {}), ...(key ? { 'idempotency-key': key } : {}) };
  const res = await fetch(`${base}${path}`, { method, headers, ...(data ? { body: JSON.stringify(data) } : {}) });
  const setCookie = res.headers.get('set-cookie'); if (setCookie && res.ok) cookie = setCookie.split(';')[0];
  return res;
}
function pass(text) { count++; console.log(`PASS ${text}`); }
async function expect(response, status, text) { assert.equal(response.status, status, `${text}: ${await response.clone().text()}`); pass(text); return response; }
await expect(await request('/api/case', { auth: false }), 401, 'anonymous case access rejected');
await expect(await request('/api/demo', { method: 'POST', data: { scenario: 'complete' }, origin: 'https://other.example' }), 403, 'cross-origin demo creation rejected');
await expect(await request('/api/demo', { method: 'POST', data: { scenario: 'complete' } }), 200, 'demo session created');
const session = await (await request('/api/session')).json(); csrf = session.csrf;
assert.equal(session.persistence, process.env.EXPECT_STORAGE || 'ephemeral');
snapshot = await (await expect(await request('/api/case'), 200, 'clinical evidence retrieved')).json();
assert.equal(snapshot.assessment.status, 'reviewable');
const payload = { draft: false, notes: 'Integration smoke test', procedureId: snapshot.assessment.selected.id, fingerprint: snapshot.fingerprint, attestations: { identity: true, consent: true, allergies: true, labs: true } };
await expect(await request('/api/records', { method: 'POST', token: 'forged', key: randomUUID(), data: payload }), 403, 'forged CSRF rejected');
await expect(await request('/api/records', { method: 'POST', key: randomUUID(), data: { ...payload, attestations: {} } }), 400, 'missing team attestations rejected');
await expect(await request('/api/records', { method: 'POST', key: randomUUID(), data: { ...payload, fingerprint: '0'.repeat(64) } }), 409, 'stale or forged evidence fingerprint rejected');
const key = randomUUID();
const saved = await (await expect(await request('/api/records', { method: 'POST', data: payload, key }), 201, 'reviewed checklist saved')).json();
const repeated = await (await expect(await request('/api/records', { method: 'POST', data: payload, key }), 200, 'retry returns the original record')).json(); assert.equal(saved.id, repeated.id);
await expect(await request('/api/records', { method: 'POST', data: { ...payload, notes: 'changed' }, key }), 409, 'idempotency conflict rejected');
const bundle = await (await expect(await request(`/api/records/${saved.id}?format=fhir`), 200, 'FHIR document exported')).json(); assert.equal(bundle.type, 'document'); assert.equal(bundle.entry[0].resource.status, 'final');
assert.ok((await (await expect(await request(`/api/records/${saved.id}?format=cda`), 200, 'CDA XML exported')).text()).includes('<ClinicalDocument'));
assert.ok((await (await expect(await request(`/api/records/${saved.id}?format=html`), 200, 'printable summary exported')).text()).includes('Integration smoke test'));
const oldCookie = cookie;
await expect(await request('/api/demo', { method: 'POST', data: { scenario: 'allergy' } }), 200, 'allergy scenario selected');
const s2 = await (await request('/api/session')).json(); csrf = s2.csrf;
await expect(await request(`/api/records/${saved.id}`), 404, 'different session cannot download another record');
const allergic = await (await request('/api/case')).json(); assert.equal(allergic.assessment.status, 'blocked');
await expect(await request('/api/records', { method: 'POST', key: randomUUID(), data: { ...payload, fingerprint: allergic.fingerprint } }), 409, 'allergy blocker prevents reviewed record');
await expect(await request('/api/records', { method: 'POST', key: randomUUID(), data: { ...payload, fingerprint: allergic.fingerprint, draft: true } }), 201, 'blocked case can produce a clearly labeled draft');
await expect(await request('/api/logout', { method: 'POST' }), 200, 'logout closes session');
await expect(await fetch(`${base}/api/session`, { headers: { Cookie: oldCookie } }), 401, 'replaced old session is invalidated');
console.log(`\n${count} API smoke checks passed.`);
