import test from 'node:test';
import assert from 'node:assert/strict';
import { demoData } from '../src/services/clinical/demoPatientService.js';
import { evaluate, caseFingerprint } from '../src/services/clinical/safetyEvaluationService.js';
import { makeRecord } from '../src/services/documents/clinicalDocumentService.js';
function record(draft = true, notes = '') { const data = demoData(), assessment = evaluate(data, 'demo-surgery'); return makeRecord({ data, assessment, fingerprint: caseFingerprint(data, assessment) }, { draft, notes, at: new Date().toISOString(), actor: { name: 'Demo Reviewer', resource: { resourceType: 'Practitioner', id: 'demo-reviewer', name: [{ text: 'Demo Reviewer' }] } } }); }
test('FHIR document has an identifier, timestamp and leading Composition', () => { const { fhir } = record(); assert.equal(fhir.type, 'document'); assert.ok(fhir.identifier.value); assert.ok(fhir.timestamp); assert.equal(fhir.entry[0].resource.resourceType, 'Composition'); assert.equal(fhir.entry[0].resource.status, 'preliminary'); });
test('all FHIR references resolve within the immutable document', () => {
  const { fhir } = record(false); const urls = new Set(fhir.entry.map(e => e.fullUrl));
  function visit(obj) { if (!obj || typeof obj !== 'object') return; for (const [key, value] of Object.entries(obj)) { if (key === 'reference') assert.ok(urls.has(value), `Unresolved ${value}`); else visit(value); } } visit(fhir);
  assert.equal(fhir.entry[0].resource.attester[0].mode, 'personal');
});
test('drafts have no attester and never claim a legal or digital signature', () => { const r = record(); assert.equal(r.fhir.entry[0].resource.attester, undefined); assert.ok(r.cda.includes('DRAFT')); assert.ok(!r.cda.includes('<legalAuthenticator')); assert.ok(!r.cda.includes('<templateId')); });
test('CDA timestamps follow the HL7 TS lexical form', () => { const r = record(); const timestamps = [...r.cda.matchAll(/<(?:effectiveTime|time) value="([^"]+)"/g)].map(m => m[1]); assert.ok(timestamps.length >= 2); for (const t of timestamps) assert.match(t, /^\d{14}[+-]\d{4}$/); });
test('untrusted note text is escaped in CDA, XHTML and HTML', () => { const r = record(true, '<script>alert("x")</script> &'); assert.ok(!r.cda.includes('<script>')); assert.ok(!r.html.includes('<script>')); assert.ok(!r.fhir.entry[0].resource.section.at(-1).text.div.includes('<script>')); assert.ok(r.cda.includes('&lt;script&gt;')); });
test('notes and each safety domain appear in both document formats', () => { const r = record(true, 'Review sample'); for (const text of ['Consent', 'Laboratory', 'Allergies', 'Review sample']) { assert.ok(r.cda.includes(text)); assert.ok(JSON.stringify(r.fhir).includes(text)); } });
test('unrelated and stopped medication orders are not described as planned surgery drugs', () => {
  const data = demoData(); const old = structuredClone(data.medications[0]); old.id = 'stopped-drug'; old.status = 'stopped'; old.medicationCodeableConcept.text = 'Obsolete antibiotic'; data.medications.push(old);
  const assessment = evaluate(data, 'demo-surgery');
  const r = makeRecord({ data, assessment, fingerprint: caseFingerprint(data, assessment) }, { draft: true, notes: '', at: new Date().toISOString(), actor: { name: 'Demo' } });
  assert.ok(!r.cda.includes('Obsolete antibiotic')); assert.ok(!JSON.stringify(r.fhir).includes('Obsolete antibiotic'));
});
