import { loadCase } from '../services/fhir/fhirClientService.js';
import { audit, audits } from '../repositories/auditEventRepository.js';
import { assert } from '../utils/AppError.js';

export async function getClinicalCase(request, response) {
  const procedureId = request.query.procedure;
  assert(!procedureId || (typeof procedureId === 'string' && /^[A-Za-z0-9.-]{1,64}$/.test(procedureId)), 'Invalid procedure ID.');
  const snapshot = await loadCase(request.auth, procedureId);
  await audit(request.auth.id, 'Clinical evidence retrieved');
  response.json({ ...snapshot, audit: await audits(request.auth.id) });
}
