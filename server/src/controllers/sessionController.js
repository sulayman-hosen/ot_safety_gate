import { config } from '../config/environment.js';
import { assert } from '../utils/AppError.js';
import { randomToken } from '../utils/securityUtils.js';
import { readCookie, cookieOptions, SESSION_COOKIE } from '../utils/cookieUtils.js';
import { saveSession, deleteSession, readSession } from '../repositories/sessionRepository.js';
import { audit } from '../repositories/auditEventRepository.js';
import { SCENARIOS } from '../services/clinical/demoPatientService.js';

export async function openDemoSession(request, response) {
  assert(config().demoEnabled, 'Demo access is disabled.', 403);
  assert(SCENARIOS.some(scenario => scenario.id === request.body.scenario), 'Unknown demo scenario.');
  const id = randomToken();
  const ttl = config().ttl;
  const actor = {
    id: 'demo-reviewer', name: 'Jordan Lee · demo reviewer', verified: true, canAttest: true,
    resource: { resourceType: 'Practitioner', id: 'demo-reviewer', active: true, name: [{ given: ['Jordan'], family: 'Lee' }] }
  };
  await saveSession(id, { mode: 'demo', scenario: request.body.scenario, epoch: new Date().toISOString(), expiresAt: Date.now() + ttl * 1000, csrf: randomToken(), actor });
  await audit(id, 'Synthetic session opened');
  await deleteSession(readCookie(request, SESSION_COOKIE));
  response.cookie(SESSION_COOKIE, id, cookieOptions(ttl)).json({ ok: true });
}

export async function getSessionStatus(request, response) {
  const id = readCookie(request, SESSION_COOKIE);
  if (!id) return response.json({ authenticated: false, demoEnabled: config().demoEnabled, smartConfigured: Boolean(config().fhirBase && config().clientId) });
  assert(/^[A-Za-z0-9_-]{43}$/.test(id), 'Please launch a new session.', 401, 'SESSION_EXPIRED');
  const session = await readSession(id);
  assert(session, 'Your session expired. Please launch again.', 401, 'SESSION_EXPIRED');
  response.json({
    authenticated: true, mode: session.mode, csrf: session.csrf,
    actor: { name: session.actor.name, verified: session.actor.verified, canAttest: session.actor.canAttest },
    expiresAt: session.expiresAt, scenario: session.scenario || null,
    persistence: config().memory ? 'ephemeral' : 'mongodb'
  });
}

export async function closeSession(request, response) {
  await audit(request.auth.id, 'Session closed');
  await deleteSession(request.auth.id);
  response.cookie(SESSION_COOKIE, '', cookieOptions(0)).json({ ok: true });
}
