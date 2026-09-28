import { config } from '../config/environment.js';
import { connectDatabase } from '../config/database.js';
import { hash } from '../utils/securityUtils.js';
import AuditEvent from '../models/AuditEvent.js';
import { getDemoMemoryStore } from './demoMemoryRepository.js';

export async function audit(sessionId, action) {
  const row = { owner: hash(sessionId), action, at: new Date() };
  if (config().memory) {
    const store = getDemoMemoryStore();
    store.audits.push(row);
    if (store.audits.length > 5000) store.audits.shift();
  } else { await connectDatabase(); await AuditEvent.create(row); }
}

export async function audits(sessionId) {
  const owner = hash(sessionId);
  let rows;
  if (config().memory) rows = getDemoMemoryStore().audits.filter(row => row.owner === owner).slice(-30).reverse();
  else { await connectDatabase(); rows = await AuditEvent.find({ owner }).sort({ at: -1 }).limit(30).lean(); }
  return rows.map(({ action, at }) => ({ action, at: new Date(at).toISOString() }));
}
