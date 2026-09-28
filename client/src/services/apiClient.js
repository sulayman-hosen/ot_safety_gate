// Calls stay on the public origin. Next rewrites forward them to Express.
export async function apiRequest(path, options) {
  const response = await fetch(path, { cache: 'no-store', credentials: 'same-origin', ...options });
  let data;
  try { data = await response.json(); }
  catch { throw new Error('The API is unavailable. Check that the Express server is running.'); }
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed.');
    error.status = response.status;
    error.code = data.code;
    throw error;
  }
  return data;
}
