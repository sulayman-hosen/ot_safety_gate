import { config } from '../config/environment.js';
import { connectDatabase } from '../config/database.js';
import { hash, seal, unseal } from '../utils/securityUtils.js';
import UserSession from '../models/UserSession.js';
import { getDemoMemoryStore } from './demoMemoryRepository.js';

export async function saveSession(id, data) {
  const row = { _id: hash(id), payload: seal(data), expiresAt: new Date(data.expiresAt) };
  if (config().memory) getDemoMemoryStore().sessions.set(row._id, row);
  else {
    await connectDatabase();
    await UserSession.replaceOne({ _id: row._id }, row, { upsert: true, runValidators: true });
  }
}

export async function readSession(id) {
  if (!id) return null;
  let row;
  if (config().memory) row = getDemoMemoryStore().sessions.get(hash(id));
  else { await connectDatabase(); row = await UserSession.findById(hash(id)).lean(); }
  return row && new Date(row.expiresAt).getTime() > Date.now() ? unseal(row.payload) : null;
}

export async function deleteSession(id) {
  if (!id) return;
  if (config().memory) getDemoMemoryStore().sessions.delete(hash(id));
  else { await connectDatabase(); await UserSession.deleteOne({ _id: hash(id) }); }
}
