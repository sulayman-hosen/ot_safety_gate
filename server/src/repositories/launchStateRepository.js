import { config } from '../config/environment.js';
import { connectDatabase } from '../config/database.js';
import { hash, seal, unseal } from '../utils/securityUtils.js';
import SmartLaunchState from '../models/SmartLaunchState.js';
import { getDemoMemoryStore } from './demoMemoryRepository.js';

export async function saveLaunch(state, browser, data) {
  const row = { _id: hash(state), browser: hash(browser), payload: seal(data), expiresAt: new Date(Date.now() + 300000) };
  if (config().memory) getDemoMemoryStore().launches.set(row._id, row);
  else { await connectDatabase(); await SmartLaunchState.create(row); }
}

export async function consumeLaunch(state, browser) {
  if (!state || !browser) return null;
  let row;
  if (config().memory) {
    const store = getDemoMemoryStore();
    row = store.launches.get(hash(state));
    if (row?.browser !== hash(browser) || new Date(row.expiresAt).getTime() <= Date.now()) return null;
    store.launches.delete(hash(state));
  } else {
    await connectDatabase();
    row = await SmartLaunchState.findOneAndDelete({ _id: hash(state), browser: hash(browser), expiresAt: { $gt: new Date() } }).lean();
  }
  return row ? unseal(row.payload) : null;
}
