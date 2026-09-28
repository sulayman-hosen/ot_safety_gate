import { randomBytes } from 'node:crypto';
import { createApp } from '../src/app.js';

Object.assign(process.env, {
  STORAGE_MODE: 'memory', DEMO_ENABLED: 'true', EMBEDDED_COOKIE: 'false',
  SESSION_ENCRYPTION_KEY: randomBytes(32).toString('base64')
});
const listener = createApp().listen(0, '127.0.0.1');
await new Promise(resolve => listener.once('listening', resolve));
const base = `http://127.0.0.1:${listener.address().port}`;
process.env.APP_URL = base;
process.env.TEST_BASE_URL = base;
try { await import('./verifyApiWorkflow.js'); }
finally { await new Promise(resolve => listener.close(resolve)); }
