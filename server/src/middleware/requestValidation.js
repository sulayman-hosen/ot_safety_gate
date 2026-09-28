import { config } from '../config/environment.js';
import { assert } from '../utils/AppError.js';

export function requireSameOrigin(request, response, next) {
  assert(request.get('origin') === config().appUrl, 'Cross-origin request rejected.', 403);
  next();
}

export function requireJsonObject(request, response, next) {
  assert(request.is('application/json'), 'Send application/json.', 415);
  assert(request.body && typeof request.body === 'object' && !Array.isArray(request.body), 'Invalid JSON body.');
  next();
}
