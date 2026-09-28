import { config } from '../config/environment.js';
import { connectDatabase } from '../config/database.js';

export async function getHealth(request, response) {
  if (!config().memory) await (await connectDatabase()).db.command({ ping: 1 });
  response.json({ ok: true, app: 'ot-safety-gate', persistence: config().memory ? 'ephemeral-demo' : 'mongodb' });
}
