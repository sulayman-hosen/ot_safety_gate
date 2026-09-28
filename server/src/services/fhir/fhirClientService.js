import { AppError, assert } from '../../utils/AppError.js';
import { POLICY, SYSTEM } from '../../config/clinicalPolicy.js';
import { patientMatches, matches, ref, evaluate, caseFingerprint } from '../clinical/safetyEvaluationService.js';
import { demoData } from '../clinical/demoPatientService.js';
import { config } from '../../config/environment.js';

export function trustedUrl(value, origins) {
  let u; try { u = new URL(value); } catch { throw new AppError('An endpoint is not a valid URL.', 502); }
  assert(u.protocol === 'https:' && !u.username && !u.password && !u.hash && origins.includes(u.origin), 'Endpoint is outside the configured HTTPS origins.', 502);
  return u;
}
export function fhirUrl(value, base) {
  const b = new URL(`${base.replace(/\/$/, '')}/`), u = new URL(value, b);
  // Never follow pagination or references to a different tenant/base with this token.
  assert(u.protocol === 'https:' && u.origin === b.origin && u.pathname.startsWith(b.pathname) && !u.username && !u.password && !u.hash && !/%2f|%5c|%2e/i.test(u.pathname), 'FHIR URL is outside the launched FHIR base.', 502);
  return u;
}
export async function fetchJson(url, options = {}, fetcher = fetch) {
  let response;
  try { response = await fetcher(url, { ...options, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(12000) }); }
  catch { throw new AppError('The EHR request failed or timed out.', 502, 'EHR_UNAVAILABLE'); }
  assert(response.ok, response.status === 401 ? 'The EHR session has expired. Launch again.' : 'The EHR could not provide required data.', response.status === 401 ? 401 : 502, 'EHR_UNAVAILABLE');
  assert(/json/i.test(response.headers.get('content-type') || ''), 'The EHR did not return JSON.', 502);
  const chunks = []; let size = 0;
  for await (const chunk of response.body) { size += chunk.length; assert(size <= 5 * 1024 * 1024, 'EHR response exceeds the configured limit.', 502); chunks.push(Buffer.from(chunk)); }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new AppError('The EHR returned invalid JSON.', 502); }
}
export async function readFHIR(session, path, fetcher = fetch) {
  assert(session.tokenExpiresAt > Date.now(), 'The EHR session has expired. Launch again.', 401);
  return fetchJson(fhirUrl(path, session.fhirBase), { headers: { Accept: 'application/fhir+json', Authorization: `Bearer ${session.accessToken}` } }, fetcher);
}
export async function searchFHIR(session, type, params, fetcher = fetch) {
  let next = `${type}?${new URLSearchParams({ ...params, _count: '100' })}`;
  const resources = [], visited = new Set();
  for (let page = 0; next; page++) {
    assert(page < 20, 'FHIR search is incomplete: page limit exceeded.', 502);
    const url = fhirUrl(next, session.fhirBase).href;
    assert(!visited.has(url), 'FHIR search is incomplete: repeated next link.', 502); visited.add(url);
    const bundle = await readFHIR(session, url, fetcher);
    assert(bundle.resourceType === 'Bundle' && bundle.type === 'searchset', 'Expected a FHIR searchset Bundle.', 502);
    for (const entry of bundle.entry || []) {
      const r = entry.resource;
      if (r?.resourceType === 'OperationOutcome') {
        assert(!(r.issue || []).some(i => ['fatal', 'error', 'warning'].includes(i.severity)), 'FHIR search contains an incomplete-result warning or error.', 502);
      } else {
        assert(r?.resourceType === type && /^[A-Za-z0-9.-]{1,64}$/.test(r.id || ''), 'Unexpected resource in FHIR search results.', 502);
        resources.push(r);
      }
    }
    const links = (bundle.link || []).filter(l => l.relation === 'next');
    assert(links.length <= 1, 'FHIR search returned ambiguous pagination.', 502);
    next = links[0]?.url;
    if (next) next = new URL(next, url).href;
    assert(resources.length <= 2000, 'FHIR search exceeds the configured resource limit.', 502);
    if (!next && Number.isFinite(bundle.total)) assert(resources.length >= bundle.total, 'FHIR search ended before all results were returned.', 502);
  }
  const versions = new Map();
  for (const r of resources) {
    const k = ref(r), old = versions.get(k);
    assert(!old || JSON.stringify(old) === JSON.stringify(r), 'FHIR search returned conflicting resource versions.', 502);
    versions.set(k, r);
  }
  return [...versions.values()];
}
export async function loadClinicalData(session, fetcher = fetch) {
  if (session.mode === 'demo') return demoData(session.scenario, session.epoch);
  const patient = await readFHIR(session, `Patient/${session.patientId}`, fetcher);
  assert(patient.resourceType === 'Patient' && patient.id === session.patientId, 'Patient context mismatch.', 502);
  const data = { patient, encounter: null, issues: [], mode: 'ehr', sourceBase: session.fhirBase, fetchedAt: new Date().toISOString() };
  const p = session.patientId;
  const labTokens = POLICY.labs.flatMap(l => l.codes.map(c => `${SYSTEM.loinc}|${c}`)).join(',');
  const queries = [
    ['procedures', 'ServiceRequest', { patient: p, ...(session.encounterId ? { encounter: session.encounterId } : {}) }],
    ['conditions', 'Condition', { patient: p }],
    ['consents', 'Consent', { patient: p }],
    ['documents', 'DocumentReference', { patient: p }],
    ['observations', 'Observation', { patient: p, 'combo-code': labTokens }],
    ['allergies', 'AllergyIntolerance', { patient: p }],
    ['medications', 'MedicationRequest', { patient: p }]
  ];
  const results = await Promise.allSettled(queries.map(([, type, params]) => searchFHIR(session, type, params, fetcher)));
  results.forEach((result, i) => {
    const [key, type] = queries[i]; data[key] = [];
    if (result.status === 'rejected') data.issues.push(`${type}: data unavailable, unsupported search, denied scope or incomplete results.`);
    else if (result.value.some(r => !patientMatches(r, p, session.fhirBase))) data.issues.push(`${type}: patient mismatch; results discarded.`);
    else data[key] = result.value;
  });
  data.procedures = data.procedures.filter(r => (r.category || []).some(c => (c.coding || []).some(x => x.system === SYSTEM.snomed && x.code === '387713003')) || (r.code?.coding || []).some(c => c.system === SYSTEM.cpt));
  if (session.encounterId) {
    try {
      const e = await readFHIR(session, `Encounter/${session.encounterId}`, fetcher);
      assert(e.resourceType === 'Encounter' && e.id === session.encounterId && patientMatches(e, p, session.fhirBase), 'Encounter mismatch.', 502);
      data.encounter = e;
    } catch { data.issues.push('The launched encounter could not be verified.'); }
  }
  // Provenance has no standard patient search in R4. Search explicit targets instead.
  const targets = [...data.consents, ...data.documents].map(ref);
  data.provenance = [];
  if (targets.length > 100) data.issues.push('Too many consent/document provenance targets; evidence is incomplete.');
  else for (let i = 0; i < targets.length; i += 20) {
    try {
      const rows = await searchFHIR(session, 'Provenance', { target: targets.slice(i, i + 20).join(',') }, fetcher);
      assert(rows.every(r => r.target?.some(t => targets.some(target => matches(t.reference, target, session.fhirBase)))), 'Unrelated provenance.', 502);
      data.provenance.push(...rows);
    } catch { data.issues.push('Consent signature provenance could not be fully retrieved.'); }
  }
  data.provenance = [...new Map(data.provenance.map(p => [p.id, p])).values()];
  return data;
}
export async function loadCase(session, procedureId, fetcher = fetch) {
  const data = await loadClinicalData(session, fetcher);
  const active = data.procedures.filter(p => p.status === 'active' && p.intent === 'order');
  const selectedId = procedureId || (active.length === 1 ? active[0].id : null);
  const assessment = evaluate(data, selectedId, { base: session.fhirBase, clinicalApproved: config().clinicalApproved });
  return { data, assessment, fingerprint: caseFingerprint(data, assessment) };
}
