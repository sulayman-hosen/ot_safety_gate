import { POLICY, SYSTEM } from '../../config/clinicalPolicy.js';
import { fingerprint } from '../../utils/securityUtils.js';
export const codes = (value, system) => (value?.coding || []).filter(c => !system || c.system === system).map(c => c.code);
export const display = value => value?.text || value?.coding?.[0]?.display || value?.coding?.[0]?.code || 'Not documented';
export const humanName = patient => patient?.name?.[0]?.text || [...(patient?.name?.[0]?.given || []), patient?.name?.[0]?.family].filter(Boolean).join(' ') || 'Unnamed patient';
export const ref = resource => `${resource.resourceType}/${resource.id}`;
export function matches(reference, target, base = '') {
  if (reference === target) return true;
  return Boolean(base && reference === `${base.replace(/\/$/, '')}/${target}`);
}
export const statusCode = value => value?.coding?.[0]?.code;
export function patientMatches(resource, patientId, base = '') {
  if (resource.resourceType === 'Patient') return resource.id === patientId;
  const target = resource.patient?.reference || resource.subject?.reference;
  return matches(target, `Patient/${patientId}`, base);
}
const check = (id, title, status, message, evidence = []) => ({ id, title, status, message, evidence });
const time = value => typeof value === 'string' && /T/.test(value) ? Date.parse(value) : NaN;
export function scheduledTime(procedure) { return procedure?.occurrenceDateTime || procedure?.occurrencePeriod?.start || null; }
function surgeryCheck(data, selected, now, base) {
  if (!selected) return check('procedure', 'Procedure & diagnosis', 'block', 'Select the scheduled surgical order.');
  if (selected.status !== 'active' || selected.intent !== 'order') return check('procedure', 'Procedure & diagnosis', 'block', 'The surgical order is not an active order.');
  const scheduled = time(scheduledTime(selected));
  if (!Number.isFinite(scheduled) || scheduled < now || scheduled > now + POLICY.maxScheduleHours * 3600000) return check('procedure', 'Procedure & diagnosis', 'review', 'A precise upcoming surgery time within the example scheduling window is required.');
  const cptCodes = codes(selected.code, SYSTEM.cpt);
  if (cptCodes.length !== 1) return check('procedure', 'Procedure & diagnosis', 'review', 'A single supported CPT code is required; free text is not enough.');
  const pair = POLICY.procedurePairs.find(p => p.cpt === cptCodes[0]);
  if (!pair) return check('procedure', 'Procedure & diagnosis', 'review', 'No reviewed local CPT–SNOMED association is configured for this order.');
  const linked = data.conditions.filter(c => (selected.reasonReference || []).some(r => matches(r.reference, ref(c), base)));
  const diagnosis = linked.find(c => statusCode(c.clinicalStatus) === 'active' && statusCode(c.verificationStatus) === 'confirmed' && codes(c.code, SYSTEM.snomed).some(code => pair.snomed.includes(code)));
  if (!diagnosis) return check('procedure', 'Procedure & diagnosis', 'block', 'No active, confirmed, order-linked SNOMED diagnosis matches the local association.');
  return check('procedure', 'Procedure & diagnosis', 'pass', 'Order and linked diagnosis match the configured example association.', [ref(selected), ref(diagnosis)]);
}
function consentCheck(data, selected, now, base) {
  if (!selected) return check('consent', 'Procedure consent', 'block', 'A selected surgery is required.');
  const scheduled = time(scheduledTime(selected));
  const cpt = codes(selected.code, SYSTEM.cpt);
  const associated = data.consents.filter(c => (c.provision?.data || []).some(d => d.meaning === 'instance' && matches(d.reference?.reference, ref(selected), base)));
  // Conflicting/revoked related consent must be reconciled; never pick only a positive entry.
  if (associated.some(c => c.status !== 'active' || c.provision?.type !== 'permit')) return check('consent', 'Procedure consent', 'block', 'Conflicting, inactive or denied consent exists for this order. Reconcile in the EHR.');
  const valid = associated.find(c => {
    const p = c.provision;
    return codes(c.scope, 'http://terminology.hl7.org/CodeSystem/consentscope').includes('treatment') &&
      !(p.provision?.length) &&
      (p.code || []).some(code => codes(code, SYSTEM.cpt).some(x => cpt.includes(x))) &&
      Number.isFinite(time(p.period?.start)) && time(p.period.start) <= now &&
      Number.isFinite(time(p.period?.end)) && time(p.period.end) >= Math.max(now, scheduled) &&
      (c.verification || []).some(v => v.verified === true && matches(v.verifiedWith?.reference, ref(data.patient), base) && time(v.verificationDate) <= now);
  });
  if (!valid) return check('consent', 'Procedure consent', 'block', 'No active, verified, procedure-specific treatment consent covers the selected surgery and time.');
  const doc = data.documents.find(d => matches(valid.sourceReference?.reference, ref(d), base) && d.status === 'current' && d.docStatus === 'final' && d.content?.some(c => c.attachment?.data || c.attachment?.url) && d.context?.related?.some(r => matches(r.reference, ref(selected), base)));
  const signature = doc && data.provenance.find(p => p.target?.some(t => matches(t.reference, ref(doc), base)) && p.signature?.some(s => matches(s.who?.reference, ref(data.patient), base) && s.data && time(s.when) <= now));
  if (!doc || !signature) return check('consent', 'Procedure consent', 'block', 'The matching finalized consent document and patient signature evidence are missing.');
  return check('consent', 'Procedure consent', 'pass', 'Linked consent and patient signature evidence are recorded. The team must inspect the source; cryptographic signature validity is not established.', [ref(valid), ref(doc), ref(signature)]);
}
function normalizeQuantity(quantity, rule) {
  if (!quantity || quantity.comparator || !Number.isFinite(quantity.value) || quantity.system !== SYSTEM.ucum) return null;
  if (quantity.code === rule.unit) return quantity.value;
  if (rule.id === 'platelets' && quantity.code === '10*3/uL') return quantity.value;
  if (rule.id === 'platelets' && quantity.code === '/uL') return quantity.value / 1000;
  if (rule.unit === 's' && quantity.code === 'ms') return quantity.value / 1000;
  return null;
}
export function labChecks(observations, now = Date.now()) {
  // Panel components inherit their parent timestamp/status and remain attributable to the source.
  const flattened = observations.flatMap(o => [o, ...(o.component || []).map(c => ({ ...o, ...c, component: undefined, id: o.id }))]);
  return POLICY.labs.map(rule => {
    const candidates = flattened.filter(o => codes(o.code, SYSTEM.loinc).some(c => rule.codes.includes(c)));
    const ranked = candidates.sort((a, b) => (time(b.effectiveDateTime || b.effectivePeriod?.end) || 0) - (time(a.effectiveDateTime || a.effectivePeriod?.end) || 0));
    const o = ranked[0];
    const out = { id: rule.id, label: rule.label, loinc: rule.codes.join(', '), unit: rule.unit, range: `${rule.min}–${rule.max}`, maxAgeHours: rule.maxAgeHours, value: null, sampledAt: null, source: o ? ref(o) : null };
    if (!o) return { ...out, status: 'review', message: 'Required result is missing.' };
    const sampled = time(o.effectiveDateTime || o.effectivePeriod?.end);
    out.sampledAt = o.effectiveDateTime || o.effectivePeriod?.end || null;
    if (candidates.some(c => !Number.isFinite(time(c.effectiveDateTime || c.effectivePeriod?.end)))) return { ...out, status: 'review', message: 'A matching result has no precise specimen time.' };
    if (!['final', 'amended', 'corrected'].includes(o.status)) return { ...out, status: 'review', message: 'The latest result is not final; an older result cannot override it.' };
    if (o.dataAbsentReason) return { ...out, status: 'review', message: 'The lab reports absent data.' };
    const value = normalizeQuantity(o.valueQuantity, rule); out.value = value;
    if (value === null) return { ...out, status: 'review', message: 'Unsupported/missing UCUM unit, non-numeric value or comparator.' };
    const tied = ranked.filter(c => time(c.effectiveDateTime || c.effectivePeriod?.end) === sampled);
    if (tied.some(c => normalizeQuantity(c.valueQuantity, rule) !== value || !['final', 'amended', 'corrected'].includes(c.status))) return { ...out, status: 'review', message: 'Conflicting results share the latest specimen time.' };
    if (!Number.isFinite(sampled) || sampled > now) return { ...out, status: 'review', message: 'Specimen time is missing or in the future.' };
    if (now - sampled > rule.maxAgeHours * 3600000) return { ...out, status: 'review', message: `Older than the ${rule.maxAgeHours}-hour example policy window.` };
    if (value < rule.min || value > rule.max || tied.some(result => (result.interpretation || []).some(i => codes(i).some(x => ['H', 'L', 'HH', 'LL', 'A', 'AA'].includes(x))))) return { ...out, status: 'block', message: 'Outside the example policy or flagged abnormal by the lab.' };
    return { ...out, status: 'pass', message: 'Within the configured example range.' };
  });
}
function allergyCheck(data, selected, now, base) {
  const meds = data.medications.filter(m => m.status === 'active' && m.intent === 'order' && (m.basedOn || []).some(r => selected && matches(r.reference, ref(selected), base)));
  if (!meds.length) return check('allergy', 'Antibiotics & allergies', 'review', 'No active prophylaxis order explicitly linked to this surgery was found.');
  const drugs = meds.map(m => POLICY.antibiotics.find(d => codes(m.medicationCodeableConcept, d.system).includes(d.code)));
  if (drugs.some(d => !d)) return check('allergy', 'Antibiotics & allergies', 'review', 'A linked medication is outside the example ingredient dictionary. Pharmacy review is required.');
  const allergies = data.allergies.filter(a => !['entered-in-error', 'refuted'].includes(statusCode(a.verificationStatus)));
  if (!allergies.length) return check('allergy', 'Antibiotics & allergies', 'review', 'No allergy evidence was returned. An empty list is not “no known allergies”.');
  if (allergies.some(a => statusCode(a.verificationStatus) !== 'confirmed' || statusCode(a.clinicalStatus) !== 'active')) return check('allergy', 'Antibiotics & allergies', 'review', 'Unconfirmed or historical allergy evidence needs reconciliation.');
  const negative = allergies.filter(a => codes(a.code, SYSTEM.snomed).includes(POLICY.noKnownAllergyCode));
  const positives = allergies.filter(a => !negative.includes(a));
  if (negative.length && positives.length) return check('allergy', 'Antibiotics & allergies', 'block', 'Conflicting positive and no-known-allergy records must be reconciled.');
  if (negative.length) {
    if (negative.some(a => !Number.isFinite(time(a.recordedDate)) || time(a.recordedDate) > now || now - time(a.recordedDate) > POLICY.maxAllergyAgeHours * 3600000)) return check('allergy', 'Antibiotics & allergies', 'review', 'The no-known-allergy assertion is missing a recent, precise record time.');
    return check('allergy', 'Antibiotics & allergies', 'pass', 'Recent explicit no-known-allergy evidence found. Confirm at the bedside.', [...meds, ...negative].map(ref));
  }
  const known = positives.map(a => POLICY.allergens.find(d => codes(a.code, d.system).includes(d.code)));
  if (known.some(a => a && drugs.some(d => a.ingredient && a.ingredient === d.ingredient))) return check('allergy', 'Antibiotics & allergies', 'block', 'A planned antibiotic matches a recorded allergen ingredient.', [...meds, ...positives].map(ref));
  if (known.some(a => a && drugs.some(d => a.classes.some(c => d.classes.includes(c))))) return check('allergy', 'Antibiotics & allergies', 'review', 'A related drug-class allergy needs pharmacy/anesthesia assessment; cross-reactivity is not automatically decided.', [...meds, ...positives].map(ref));
  return check('allergy', 'Antibiotics & allergies', 'review', 'Positive allergy records require pharmacy review. This limited dictionary cannot establish absence of risk.', [...meds, ...positives].map(ref));
}
export function evaluate(data, procedureId, { now = Date.now(), base = '', clinicalApproved = false } = {}) {
  const selected = data.procedures.find(p => p.id === procedureId);
  const checks = [surgeryCheck(data, selected, now, base), consentCheck(data, selected, now, base), allergyCheck(data, selected, now, base)];
  const labs = labChecks(data.observations, now);
  const labStatus = labs.some(l => l.status === 'block') ? 'block' : labs.some(l => l.status === 'review') ? 'review' : 'pass';
  checks.push(check('labs', 'Coagulation & platelets', labStatus, labStatus === 'pass' ? 'All four required results meet the example freshness and range checks.' : 'Resolve the flagged laboratory evidence before completing the checklist.', labs.map(l => l.source).filter(Boolean)));
  const issues = [...data.issues];
  const patientResources = ['procedures', 'conditions', 'consents', 'documents', 'observations', 'allergies', 'medications'].flatMap(k => data[k]);
  if (patientResources.some(r => !patientMatches(r, data.patient.id, base))) issues.push('A source resource does not match the launched patient.');
  if (!data.encounter || !patientMatches(data.encounter, data.patient.id, base) || data.encounter.status !== 'in-progress') issues.push('An in-progress encounter linked to this patient is required.');
  if (selected && !matches(selected.encounter?.reference, data.encounter ? ref(data.encounter) : '', base)) issues.push('The surgery is not linked to the launched encounter.');
  if (data.mode !== 'demo' && !clinicalApproved) issues.push('The example clinical policy has not been approved for live use.');
  const status = issues.length || checks.some(c => c.status === 'block') ? 'blocked' : checks.some(c => c.status === 'review') ? 'review' : 'reviewable';
  return { status, checks, labs, issues, policyVersion: POLICY.version, assessedAt: new Date(now).toISOString(), selected: selected || null, passed: checks.filter(c => c.status === 'pass').length };
}
export function caseFingerprint(data, assessment) {
  const { fetchedAt, ...evidence } = data;
  const { assessedAt, ...result } = assessment;
  return fingerprint({ evidence, result });
}
