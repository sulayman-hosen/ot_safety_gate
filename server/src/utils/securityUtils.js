import { createHash, createCipheriv, createDecipheriv, randomBytes, timingSafeEqual } from 'node:crypto';
import { assert } from './AppError.js';
export const randomToken = () => randomBytes(32).toString('base64url');
export const hash = value => createHash('sha256').update(String(value)).digest('hex');
export const challenge = verifier => createHash('sha256').update(verifier).digest('base64url');
export function equal(a, b) {
  return typeof a === 'string' && typeof b === 'string' && a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
function key() {
  let value = process.env.SESSION_ENCRYPTION_KEY;
  if (!value && process.env.STORAGE_MODE === 'memory') {
    globalThis.__otDemoKey ||= randomBytes(32).toString('base64');
    value = globalThis.__otDemoKey;
  }
  const k = Buffer.from(value || '', 'base64');
  assert(k.length === 32, 'Set SESSION_ENCRYPTION_KEY to a 32-byte base64 key (npm run key).', 503);
  return k;
}
export function seal(value) {
  const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map(x => x.toString('base64')).join('.');
}
export function unseal(value) {
  const [iv, tag, data] = value.split('.').map(x => Buffer.from(x, 'base64'));
  const cipher = createDecipheriv('aes-256-gcm', key(), iv); cipher.setAuthTag(tag);
  return JSON.parse(Buffer.concat([cipher.update(data), cipher.final()]).toString('utf8'));
}
export function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]));
  return value;
}
export const fingerprint = value => hash(JSON.stringify(canonical(value)));
