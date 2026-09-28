import { config } from '../config/environment.js';
import { connectDatabase } from '../config/database.js';
import { hash, seal, unseal } from '../utils/securityUtils.js';
import { assert } from '../utils/AppError.js';
import ChecklistRecord from '../models/ChecklistRecord.js';
import { getDemoMemoryStore } from './demoMemoryRepository.js';

export async function putRecord(id, sessionId, payload, requestHash) {
  const row = { _id: id, owner: hash(sessionId), requestHash, payload: seal(payload), createdAt: new Date() };
  let existing;
  if (config().memory) {
    const store = getDemoMemoryStore();
    existing = store.records.get(id);
    if (!existing) store.records.set(id, row);
  } else {
    await connectDatabase();
    try { await ChecklistRecord.create(row); }
    catch (error) {
      if (error.code !== 11000) throw error;
      existing = await ChecklistRecord.findById(id).lean();
    }
  }
  assert(!existing || (existing.owner === row.owner && existing.requestHash === requestHash), 'Idempotency key was already used for a different request.', 409);
  return existing ? unseal(existing.payload) : payload;
}

export async function readRecord(id, sessionId) {
  let row;
  if (config().memory) row = getDemoMemoryStore().records.get(id);
  else { await connectDatabase(); row = await ChecklistRecord.findOne({ _id: id, owner: hash(sessionId) }).lean(); }
  return row?.owner === hash(sessionId) ? unseal(row.payload) : null;
}
