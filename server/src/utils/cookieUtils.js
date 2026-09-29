import { config } from '../config/environment.js';

export const SESSION_COOKIE = 'ot_session';
export const LAUNCH_COOKIE = 'ot_launch';

export function readCookie(request, name) {
  const entry = (request.get('cookie') || '').split(';').map(value => value.trim())
    .find(value => value.startsWith(`${name}=`));
  if (!entry) return undefined;
  try { return decodeURIComponent(entry.slice(name.length + 1)); }
  catch { return undefined; }
}

export function cookieOptions(seconds, request) {
  const settings = config();
  const origin = request?.get ? (request.get('origin') || '') : '';
  const isHttps = settings.secure || origin.startsWith('https:') || request?.protocol === 'https:' || request?.get?.('x-forwarded-proto') === 'https';
  // Express accepts milliseconds; the public configuration uses seconds.
  return { httpOnly: true, secure: isHttps, sameSite: settings.embedded ? 'none' : 'lax', path: '/', maxAge: Math.max(0, seconds) * 1000 };
}
