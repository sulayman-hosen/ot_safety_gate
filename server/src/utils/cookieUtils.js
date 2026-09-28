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

export function cookieOptions(seconds) {
  const settings = config();
  // Express accepts milliseconds; the public configuration uses seconds.
  return { httpOnly: true, secure: settings.secure, sameSite: settings.embedded ? 'none' : 'lax', path: '/', maxAge: Math.max(0, seconds) * 1000 };
}
