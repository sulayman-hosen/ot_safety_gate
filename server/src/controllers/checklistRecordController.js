import { loadCase } from '../services/fhir/fhirClientService.js';
import { makeRecord } from '../services/documents/clinicalDocumentService.js';
import { fingerprint, hash } from '../utils/securityUtils.js';
import { putRecord, readRecord } from '../repositories/checklistRecordRepository.js';
import { audit } from '../repositories/auditEventRepository.js';
import { assert } from '../utils/AppError.js';

export async function createChecklistRecord(request, response) {
  const session = request.auth;
  const input = request.body;
  assert(typeof input.draft === 'boolean', 'Choose draft or reviewed record.');
  assert(typeof input.notes === 'string' && input.notes.length <= 4000, 'Notes must be at most 4,000 characters.');
  assert(!input.procedureId || (typeof input.procedureId === 'string' && /^[A-Za-z0-9.-]{1,64}$/.test(input.procedureId)), 'Invalid procedure ID.');
  assert(typeof input.fingerprint === 'string' && /^[a-f0-9]{64}$/.test(input.fingerprint), 'Refresh the case evidence before saving.');
  const key = request.get('idempotency-key');
  assert(key && /^[A-Za-z0-9-]{16,80}$/.test(key), 'An idempotency key is required.');
  const id = hash(`${session.id}:${key}`);
  const requestHash = fingerprint(input);
  const existing = await readRecord(id, session.id);
  if (existing) {
    assert(existing.requestHash === requestHash, 'Idempotency key conflicts with a previous request.', 409);
    return response.json({ id, draft: existing.draft, createdAt: existing.createdAt });
  }
  // Re-fetch EHR evidence. Browser results are never trusted for attestation.
  const snapshot = await loadCase(session, input.procedureId);
  assert(snapshot.fingerprint === input.fingerprint, 'Clinical evidence changed. Refresh and review the latest evidence.', 409, 'EVIDENCE_CHANGED');
  if (!input.draft) {
    assert(session.actor.verified && session.actor.canAttest, 'This session has no authorized reviewer identity.', 403);
    assert(snapshot.assessment.status === 'reviewable', 'Unresolved clinical evidence prevents a reviewed checklist.', 409, 'GATE_NOT_REVIEWABLE');
    assert(['identity', 'consent', 'allergies', 'labs'].every(key => input.attestations?.[key] === true), 'Complete all four team review confirmations.');
  }
  const review = { draft: input.draft, actor: session.actor, at: new Date().toISOString(), notes: input.notes.trim(), attestations: input.attestations || {} };
  const record = {
    ...makeRecord(snapshot, review), requestHash, review,
    auditEvent: { action: input.draft ? 'Draft checklist saved' : 'Reviewed checklist recorded', at: review.at }
  };
  const saved = await putRecord(id, session.id, record, requestHash);
  await audit(session.id, saved.auditEvent.action);
  response.status(201).json({ id, draft: saved.draft, createdAt: saved.createdAt });
}

export async function downloadChecklistRecord(request, response) {
  const id = request.params.id;
  assert(/^[a-f0-9]{64}$/.test(id), 'Record not found.', 404);
  const record = await readRecord(id, request.auth.id);
  assert(record, 'Record not found.', 404);
  const format = request.query.format || 'fhir';
  assert(['fhir', 'cda', 'html'].includes(format), 'Unsupported export format.');
  const outputs = {
    fhir: { body: JSON.stringify(record.fhir, null, 2), type: 'application/fhir+json', extension: 'json' },
    cda: { body: record.cda, type: 'application/xml', extension: 'xml' },
    html: { body: record.html, type: 'text/html; charset=utf-8', extension: 'html' }
  };
  const output = outputs[format];
  await audit(request.auth.id, `Checklist exported (${format.toUpperCase()})`);
  response.set({
    'Content-Type': output.type,
    'Content-Disposition': `${format === 'html' ? 'inline' : 'attachment'}; filename="${record.draft ? 'DRAFT-' : ''}OT-checklist-${record.id}.${output.extension}"`,
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"
  }).send(output.body);
}
