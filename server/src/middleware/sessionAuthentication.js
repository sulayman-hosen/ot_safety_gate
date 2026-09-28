import { readSession } from '../repositories/sessionRepository.js';
import { readCookie, SESSION_COOKIE } from '../utils/cookieUtils.js';
import { equal } from '../utils/securityUtils.js';
import { assert } from '../utils/AppError.js';

export async function requireSession(request, response, next) {
  const id = readCookie(request, SESSION_COOKIE);
  assert(id && /^[A-Za-z0-9_-]{43}$/.test(id), 'Please launch a new session.', 401, 'SESSION_EXPIRED');
  const data = await readSession(id);
  assert(data, 'Your session expired. Please launch again.', 401, 'SESSION_EXPIRED');
  request.auth = { id, ...data };
  next();
}

export function requireCsrfToken(request, response, next) {
  assert(equal(request.get('x-csrf-token'), request.auth.csrf), 'Session verification failed. Refresh the page.', 403);
  next();
}
