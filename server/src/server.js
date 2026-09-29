import { createApp } from './app.js';
import { config } from './config/environment.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { seal } from './utils/securityUtils.js';
import UserSession from './models/UserSession.js';
import SmartLaunchState from './models/SmartLaunchState.js';
import ChecklistRecord from './models/ChecklistRecord.js';
import AuditEvent from './models/AuditEvent.js';

try {
  const settings = config();
  seal({ startupCheck: true }); // Reject a missing or invalid key before accepting requests.
  if (!settings.memory) {
    await connectDatabase();
    // Mongoose 9 + Atlas SRV: Model.init() may fire before the driver db handle
    // is available. Use syncIndexes which is more resilient and creates collections on demand.
    for (const Model of [UserSession, SmartLaunchState, ChecklistRecord, AuditEvent]) {
      try { await Model.syncIndexes(); } catch { /* collection will be auto-created on first write */ }
    }
  }
  const port = Number(process.env.PORT || 5000);
  const host = '0.0.0.0';
  const server = createApp().listen(port, host, () => console.log(`Express API listening at http://${host}:${port} (${settings.memory ? 'synthetic memory demo' : 'MongoDB / Mongoose'})`));
  server.on('error', (err) => { console.error('API listener failed:', err); process.exitCode = 1; });
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => server.close(async () => { await disconnectDatabase(); process.exit(0); }));
  }
} catch (error) {
  console.error(`API startup failed: ${error.name || 'Error'}. Check server/.env and MongoDB connectivity.`);
  process.exitCode = 1;
}
