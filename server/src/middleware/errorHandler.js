import { AppError } from '../utils/AppError.js';

// Never log EHR bodies, access tokens, patient identifiers or requested URLs.
export function errorHandler(error, request, response, next) {
  if (response.headersSent) return next(error);
  if (error.type === 'entity.too.large') return response.status(413).json({ error: 'Request is too large.', code: 'REQUEST_INVALID' });
  if (error.type === 'entity.parse.failed') return response.status(400).json({ error: 'Invalid JSON body.', code: 'REQUEST_INVALID' });
  const expected = error instanceof AppError;
  if (!expected) console.error('Request failed:', error.name || 'Error');
  response.status(expected ? error.status : 500).json({
    error: expected ? error.message : 'The operation could not be completed. Check server configuration or retry.',
    code: expected ? error.code : 'INTERNAL_ERROR'
  });
}
