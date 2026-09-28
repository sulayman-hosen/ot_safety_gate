import { mkdir, writeFile } from 'node:fs/promises';
import { demoData, SCENARIOS } from '../src/services/clinical/demoPatientService.js';
import { evaluate, caseFingerprint } from '../src/services/clinical/safetyEvaluationService.js';
import { makeRecord } from '../src/services/documents/clinicalDocumentService.js';
await mkdir('samples', { recursive: true });
const epoch = new Date().toISOString();
for (const s of SCENARIOS) {
  const data = demoData(s.id, epoch);
  const bundle = { resourceType: 'Bundle', type: 'collection', entry: [data.patient, data.encounter, ...['procedures', 'conditions', 'consents', 'documents', 'provenance', 'observations', 'allergies', 'medications'].flatMap(k => data[k])].map(resource => ({ resource })) };
  await writeFile(`samples/${s.id}-resources.json`, JSON.stringify(bundle, null, 2));
}
const data = demoData('complete', epoch), assessment = evaluate(data, 'demo-surgery');
const snapshot = { data, assessment, fingerprint: caseFingerprint(data, assessment) };
const review = { draft: true, at: epoch, notes: 'Generated synthetic sample for candidate evaluation.', actor: { name: 'Demo generator' } };
const record = makeRecord(snapshot, review);
await writeFile('samples/draft-checklist.fhir.json', JSON.stringify(record.fhir, null, 2));
await writeFile('samples/draft-checklist.cda.xml', record.cda);
await writeFile('samples/draft-checklist.html', record.html);
console.log('Generated five synthetic FHIR collections and draft document examples.');
