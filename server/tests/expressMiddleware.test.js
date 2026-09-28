import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { createApp } from '../src/app.js';

test('Express transport enforces JSON, exact origins, request limits and opaque session cookies', async () => {
  Object.assign(process.env, { STORAGE_MODE: 'memory', DEMO_ENABLED: 'true', EMBEDDED_COOKIE: 'false', SESSION_TTL_MINUTES: '30', SESSION_ENCRYPTION_KEY: randomBytes(32).toString('base64') });
  const listener = createApp().listen(0, '127.0.0.1');
  await new Promise(resolve => listener.once('listening', resolve));
  const base = `http://127.0.0.1:${listener.address().port}`;
  process.env.APP_URL = base;
  const send = (body, headers = {}) => fetch(`${base}/api/demo`, { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json', ...headers }, body });
  try {
    const malformed = await send('{');
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).error, 'Invalid JSON body.');
    assert.equal((await send('[]')).status, 400);
    assert.equal((await send('{}', { 'Content-Type': 'text/plain' })).status, 415);
    assert.equal((await send(JSON.stringify({ notes: 'x'.repeat(17000) }))).status, 413);
    assert.equal((await send('{"scenario":"complete"}', { Origin: `${base}/wrong` })).status, 403);
    const response = await send('{"scenario":"complete"}');
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('x-powered-by'), null);
    assert.match(response.headers.get('cache-control'), /no-store/);
    const cookie = response.headers.get('set-cookie');
    assert.match(cookie, /^ot_session=[A-Za-z0-9_-]{43};/);
    assert.match(cookie, /Max-Age=1800;/); // Express must receive milliseconds, not seconds.
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /SameSite=Lax/);
    const session = await (await fetch(`${base}/api/session`, { headers: { Cookie: cookie.split(';')[0] } })).json();
    assert.equal(session.authenticated, true);
    assert.equal(session.accessToken, undefined);
    assert.equal((await fetch(`${base}/api/session`, { headers: { Cookie: 'ot_session=%ZZ' } })).status, 200);
    assert.equal((await fetch(`${base}/api/case`, { headers: { Cookie: 'ot_session=%ZZ' } })).status, 401);
    assert.equal((await fetch(`${base}/missing-endpoint`)).status, 404);
  } finally { await new Promise(resolve => listener.close(resolve)); }
});
