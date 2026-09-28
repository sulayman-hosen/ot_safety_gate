export class AppError extends Error {
  constructor(message, status = 400, code = 'REQUEST_INVALID') {
    super(message); this.status = status; this.code = code;
  }
}
export function assert(condition, message, status = 400, code = 'REQUEST_INVALID') {
  if (!condition) throw new AppError(message, status, code);
}
