import { randomUUID } from 'node:crypto';
import { display, humanName, ref, scheduledTime, matches } from '../clinical/safetyEvaluationService.js';
const esc = value => String(value ?? '').replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));
const uuid = () => randomUUID();
const pick = (r, fields) => Object.fromEntries(['resourceType', 'id', ...fields].filter(k => r[k] !== undefined).map(k => [k, structuredClone(r[k])]));
const plannedMeds = (data, selected) => data.medications.filter(m => m.status === 'active' && m.intent === 'order' && selected && m.basedOn?.some(r => matches(r.reference, ref(selected), data.sourceBase)));
export function narrativeSections(snapshot, review) {
  const { data, assessment } = snapshot;
  return [
    { title: 'Procedure and diagnosis', code: '47519-4', text: `Scheduled order: ${display(assessment.selected?.code)}. Scheduled time: ${scheduledTime(assessment.selected) || 'Not available'}. Diagnoses: ${data.conditions.map(c => display(c.code)).join('; ') || 'Not documented'}. ${assessment.checks[0].message}` },
    { title: 'Consent evidence', code: null, text: assessment.checks.find(c => c.id === 'consent').message },
    { title: 'Allergies and planned medication', code: '48765-2', text: `Allergy evidence: ${data.allergies.map(a => display(a.code)).join('; ') || 'Unknown'}. Surgery-linked active medication orders: ${plannedMeds(data, assessment.selected).map(m => display(m.medicationCodeableConcept)).join('; ') || 'Unknown'}. ${assessment.checks.find(c => c.id === 'allergy').message}` },
    { title: 'Laboratory results', code: '30954-2', text: assessment.labs.map(l => `${l.label} (LOINC ${l.loinc}): ${l.value ?? 'Unknown'} ${l.unit}; collected ${l.sampledAt || 'Unknown'}; ${l.status.toUpperCase()}: ${l.message}`).join('\n') },
    { title: 'Assessment and team review', code: '51848-0', text: `Evidence state: ${assessment.status}. Policy: ${assessment.policyVersion}. ${assessment.issues.join(' ')}\n${assessment.checks.map(c => `${c.title}: ${c.status.toUpperCase()}`).join('; ')}.\n${review.draft ? 'DRAFT — not attested.' : `Checklist reviewed by ${review.actor.name} at ${review.at}. Identity/procedure/site, consent source, allergy/prophylaxis and laboratory evidence were manually reviewed.`}\nTeam note: ${review.notes || 'No additional note.'}\nThis is a pre-operative evidence checklist, not an operative report or authorization to proceed. ${data.mode === 'demo' ? 'SYNTHETIC DEMONSTRATION. No real patient or legal signature.' : 'Use the institution’s surgical timeout and consent workflows.'}` }
  ];
}
export function buildFhirDocument(snapshot, review, documentId = uuid()) {
  const { data, assessment } = snapshot;
  const resources = [];
  const patient = pick(data.patient, ['identifier', 'name', 'gender', 'birthDate']); resources.push(patient);
  const patientRef = { reference: ref(patient) };
  const author = review.draft || !review.actor.resource
    ? { resourceType: 'Device', id: 'ot-safety-gate', deviceName: [{ name: 'OT safety gate checklist generator', type: 'user-friendly-name' }] }
    : pick(review.actor.resource, ['identifier', 'name', 'active']);
  resources.push(author);
  const custodian = { resourceType: 'Organization', id: 'note-custodian', name: data.mode === 'demo' ? 'ORBIT synthetic demonstration' : (process.env.CUSTODIAN_NAME || 'Application checklist custodian (configure institution name)') };
  resources.push(custodian);
  let encounter;
  if (data.encounter) { encounter = { ...pick(data.encounter, ['status', 'class', 'period']), subject: patientRef }; resources.push(encounter); }
  const conditions = data.conditions.map(c => ({ ...pick(c, ['clinicalStatus', 'verificationStatus', 'category', 'code', 'onsetDateTime']), subject: patientRef })); resources.push(...conditions);
  const allergies = data.allergies.map(a => ({ ...pick(a, ['clinicalStatus', 'verificationStatus', 'type', 'category', 'criticality', 'code', 'recordedDate', 'lastOccurrence', 'reaction']), patient: patientRef })); resources.push(...allergies);
  const observations = data.observations.map(o => ({ ...pick(o, ['status', 'category', 'code', 'effectiveDateTime', 'effectivePeriod', 'issued', 'valueQuantity', 'dataAbsentReason', 'interpretation', 'referenceRange', 'component']), subject: patientRef })); resources.push(...observations);
  let order;
  if (assessment.selected) { order = { ...pick(assessment.selected, ['status', 'intent', 'category', 'code', 'occurrenceDateTime', 'occurrencePeriod', 'bodySite', 'authoredOn']), subject: patientRef }; resources.push(order); }
  const medications = plannedMeds(data, assessment.selected).filter(m => m.medicationCodeableConcept).map(m => ({ ...pick(m, ['status', 'intent', 'medicationCodeableConcept', 'authoredOn']), subject: patientRef })); resources.push(...medications);
  const sections = narrativeSections(snapshot, review).map((section, i) => {
    const entries = [order ? [order, ...conditions] : conditions, [], [...allergies, ...medications], observations, []][i];
    return { title: section.title, ...(section.code ? { code: { coding: [{ system: 'http://loinc.org', code: section.code }] } } : {}), text: { status: 'generated', div: `<div xmlns="http://www.w3.org/1999/xhtml"><p>${esc(section.text).replace(/\n/g, '</p><p>')}</p></div>` }, ...(entries.length ? { entry: entries.map(r => ({ reference: ref(r) })) } : {}) };
  });
  const composition = {
    resourceType: 'Composition', id: documentId, identifier: { system: 'urn:ot-safety-gate:document', value: documentId },
    status: review.draft ? 'preliminary' : 'final', type: { coding: [{ system: 'http://loinc.org', code: '34109-9', display: 'Note' }], text: 'Pre-operative safety checklist' },
    subject: patientRef, ...(encounter ? { encounter: { reference: ref(encounter) } } : {}), date: review.at,
    author: [{ reference: ref(author) }], title: `${data.mode === 'demo' ? '[SYNTHETIC] ' : ''}${review.draft ? 'Draft ' : ''}Pre-operative safety checklist`,
    confidentiality: 'R', custodian: { reference: ref(custodian) },
    ...(!review.draft ? { attester: [{ mode: 'personal', time: review.at, party: { reference: ref(author) } }] } : {}),
    section: sections
  };
  resources.unshift(composition);
  const locations = new Map(resources.map(r => [ref(r), `urn:uuid:${uuid()}`]));
  const rewrite = value => {
    if (Array.isArray(value)) return value.map(rewrite);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === 'reference' ? locations.get(v) || v : rewrite(v)]));
    return value;
  };
  return {
    resourceType: 'Bundle', id: uuid(), type: 'document',
    identifier: { system: 'urn:ot-safety-gate:document', value: documentId }, timestamp: review.at,
    meta: { tag: [{ system: 'urn:ot-safety-gate:mode', code: data.mode }, { system: 'urn:ot-safety-gate:policy', code: assessment.policyVersion }] },
    entry: resources.map(r => ({ fullUrl: locations.get(ref(r)), resource: rewrite(r) }))
  };
}
function cdaTime(iso) { return new Date(iso).toISOString().replace(/[-:T]/g, '').replace(/\.\d{3}Z$/, '+0000'); }
export function buildCda(snapshot, review, documentId) {
  const { data } = snapshot;
  const sections = narrativeSections(snapshot, review);
  const name = humanName(data.patient), author = review.draft ? 'OT safety gate draft generator' : review.actor.name;
  const gender = { male: 'M', female: 'F', other: 'UN', unknown: 'UN' }[data.patient.gender] || 'UN';
  // Core CDA R2 narrative document; no C-CDA/US Realm template conformance is claimed.
  return `<?xml version="1.0" encoding="UTF-8"?>
<ClinicalDocument xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <typeId root="2.16.840.1.113883.1.3" extension="POCD_HD000040"/>
  <id root="${esc(documentId)}"/>
  <code code="34109-9" codeSystem="2.16.840.1.113883.6.1" displayName="Note"/>
  <title>${data.mode === 'demo' ? 'SYNTHETIC — ' : ''}${review.draft ? 'DRAFT — ' : 'Reviewed — '}Pre-operative safety checklist</title>
  <effectiveTime value="${cdaTime(review.at)}"/>
  <confidentialityCode code="R" codeSystem="2.16.840.1.113883.5.25"/>
  <languageCode code="en-US"/>
  <recordTarget><patientRole><id nullFlavor="NI"/><patient><name>${esc(name)}</name><administrativeGenderCode code="${gender}" codeSystem="2.16.840.1.113883.5.1"/>${data.patient.birthDate ? `<birthTime value="${esc(data.patient.birthDate.replaceAll('-', ''))}"/>` : '<birthTime nullFlavor="UNK"/>'}</patient></patientRole></recordTarget>
  <author><time value="${cdaTime(review.at)}"/><assignedAuthor><id nullFlavor="NI"/><assignedPerson><name>${esc(author)}</name></assignedPerson></assignedAuthor></author>
  <custodian><assignedCustodian><representedCustodianOrganization><id nullFlavor="NI"/><name>${esc(data.mode === 'demo' ? 'ORBIT synthetic demonstration' : process.env.CUSTODIAN_NAME || 'Application checklist custodian')}</name></representedCustodianOrganization></assignedCustodian></custodian>
  <component><structuredBody>${sections.map(s => `
    <component><section>${s.code ? `<code code="${s.code}" codeSystem="2.16.840.1.113883.6.1"/>` : '<code nullFlavor="OTH"/>'}<title>${esc(s.title)}</title><text>${s.text.split('\n').map(t => `<paragraph>${esc(t)}</paragraph>`).join('')}</text></section></component>`).join('')}
  </structuredBody></component>
</ClinicalDocument>`;
}
export function buildHtml(snapshot, review, documentId) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Pre-operative checklist</title><style>body{font:15px/1.65 system-ui,sans-serif;color:#172c40;max-width:850px;margin:40px auto;padding:24px}h1{font-size:28px}h2{font-size:18px;border-bottom:1px solid #cdd7df;padding-bottom:6px}header{border-bottom:4px solid #087f82}.meta{color:#526676}p{white-space:pre-wrap}.flag{background:#fff1d6;padding:12px}footer{margin-top:32px;font-size:12px}@media print{body{margin:0}section{break-inside:avoid}}</style></head><body><header><p>ORBIT / OPERATING THEATER</p><h1>${review.draft ? 'Draft' : 'Reviewed'} pre-operative safety checklist</h1><p class="meta">${esc(humanName(snapshot.data.patient))} · ${esc(review.at)}</p></header><p class="flag">${snapshot.data.mode === 'demo' ? 'SYNTHETIC DEMO. ' : ''}Checklist evidence state: ${esc(snapshot.assessment.status)}. This record does not authorize surgery.</p>${narrativeSections(snapshot, review).map(s => `<section><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p></section>`).join('')}<footer>Document ${esc(documentId)} · Policy ${esc(snapshot.assessment.policyVersion)} · No digital signature certification is asserted.</footer></body></html>`;
}
export function makeRecord(snapshot, review) {
  const id = uuid();
  return { id, createdAt: review.at, draft: review.draft, mode: snapshot.data.mode, actor: review.actor.name, fingerprint: snapshot.fingerprint, fhir: buildFhirDocument(snapshot, review, id), cda: buildCda(snapshot, review, id), html: buildHtml(snapshot, review, id) };
}
