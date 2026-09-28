const backendUrl = (process.env.BACKEND_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
const backend = new URL(backendUrl);
if (!['http:', 'https:'].includes(backend.protocol) || backend.username || backend.password || backend.search || backend.hash) {
  throw new Error('BACKEND_URL must be a trusted HTTP(S) server URL.');
}
const frameOrigins = (process.env.EHR_FRAME_ORIGINS || '').split(',').filter(Boolean).map(value => {
  const origin = value.trim();
  const parsed = new URL(origin);
  if (parsed.protocol !== 'https:' || parsed.origin !== origin) throw new Error('Use exact HTTPS EHR frame origins.');
  return origin;
});

export default {
  poweredByHeader: false,
  async rewrites() {
    // Only routing lives here. Every API, model and clinical rule lives in server/.
    return [
      { source: '/api/:path*', destination: `${backendUrl}/api/:path*` },
      { source: '/launch', destination: `${backendUrl}/launch` }
    ];
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'Cache-Control', value: 'no-store, max-age=0' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'no-referrer' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value: `default-src 'self'; script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' ${frameOrigins.join(' ')}` }
    ] }];
  }
};
