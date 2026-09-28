export const DEMO_SCENARIOS = [
  ['complete', 'Complete evidence'], ['allergy', 'Antibiotic allergy'],
  ['consent', 'Consent mismatch'], ['stale', 'Outdated labs'], ['abnormal', 'Abnormal platelets']
];

export const STATUS_LABELS = {
  pass: 'Evidence matched', review: 'Needs review', block: 'Action required',
  blocked: 'Action required', reviewable: 'Ready for team review'
};

export const TEAM_CONFIRMATIONS = [
  ['identity', 'Identity, procedure & site', 'I confirmed the patient, planned procedure and operative site with the team.'],
  ['consent', 'Original consent reviewed', 'I inspected the source consent, its signature evidence and procedure match.'],
  ['allergies', 'Antibiotic plan reviewed', 'I reconciled allergies and reviewed the prophylaxis plan with the team.'],
  ['labs', 'Laboratory evidence reviewed', 'I reviewed current results and the applicable institutional thresholds.']
];

export const emptyConfirmations = () => Object.fromEntries(TEAM_CONFIRMATIONS.map(([id]) => [id, false]));
