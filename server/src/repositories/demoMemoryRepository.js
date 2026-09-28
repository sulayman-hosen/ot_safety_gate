// Only synthetic demo mode uses this store. Live SMART sessions require MongoDB.
const memoryStore = { sessions: new Map(), launches: new Map(), records: new Map(), audits: [] };
export function getDemoMemoryStore() { return memoryStore; }
