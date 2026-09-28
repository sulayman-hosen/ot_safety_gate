import { spawn } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';
import { randomBytes } from 'node:crypto';
import { createRequire } from 'node:module';

const root = fileURLToPath(new URL('../../', import.meta.url));
const mode = process.argv[2] || 'development';
if (!['demo', 'development', 'production'].includes(mode)) throw new Error('Use demo, development, or production.');
const readEnvironment = path => existsSync(path) ? parseEnv(readFileSync(path, 'utf8')) : {};
const serverEnvironment = { ...readEnvironment(resolve(root, 'server/.env')), ...process.env };
const clientEnvironment = { ...readEnvironment(resolve(root, 'client/.env.local')), ...process.env };
const clientPort = clientEnvironment.CLIENT_PORT || '3000';
const serverPort = serverEnvironment.PORT || '5000';
serverEnvironment.PORT = serverPort;
serverEnvironment.APP_URL ||= `http://localhost:${clientPort}`;
clientEnvironment.BACKEND_URL ||= `http://127.0.0.1:${serverPort}`;
if (mode === 'demo') Object.assign(serverEnvironment, {
  STORAGE_MODE: 'memory', DEMO_ENABLED: 'true', EMBEDDED_COOKIE: 'false',
  APP_URL: `http://localhost:${clientPort}`, SESSION_ENCRYPTION_KEY: randomBytes(32).toString('base64')
});
const require = createRequire(import.meta.url);
const nextExecutable = require.resolve('next/dist/bin/next');
const children = [];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (child.exitCode === null) child.kill('SIGTERM');
  process.exitCode = code;
  const timeout = setTimeout(() => {
    for (const child of children) if (child.exitCode === null) child.kill('SIGKILL');
  }, 5000);
  timeout.unref();
}
function start(args, cwd, env) {
  const child = spawn(process.execPath, args, { cwd, env, stdio: 'inherit' });
  children.push(child);
  child.on('error', () => { console.error('Unable to start a project process.'); stop(1); });
  child.on('exit', code => { if (!stopping) stop(code || 0); });
  return child;
}
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => stop());

start([...(mode === 'production' ? [] : ['--watch']), 'src/server.js'], resolve(root, 'server'), serverEnvironment);
let apiReady = false;
for (let attempt = 0; attempt < 60 && !stopping; attempt++) {
  try { apiReady = (await fetch(`${clientEnvironment.BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(1000) })).ok; }
  catch { /* The API may still be connecting to MongoDB. */ }
  if (apiReady) break;
  await new Promise(resolve => setTimeout(resolve, 500));
}
if (!apiReady) {
  console.error('API did not become ready. Check server/.env and MongoDB.');
  stop(1);
} else {
  start([nextExecutable, mode === 'production' ? 'start' : 'dev', ...(mode === 'production' ? [] : ['--webpack']), '--hostname', '127.0.0.1', '--port', clientPort], resolve(root, 'client'), clientEnvironment);
  console.log(`\nOpen http://localhost:${clientPort} in your browser.\n${mode === 'demo' ? 'Synthetic demo: data resets when the API restarts.' : 'Client and Express API started.'}\n`);
}
