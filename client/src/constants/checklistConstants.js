export const DEMO_SCENARIOS = [
  ['complete', 'Complete evidence'], ['allergy', 'Antibiotic allergy'],
  ['consent', 'Consent mismatch'], ['stale', 'Outdated labs'], ['abnormal', 'Abnormal platelets']
];

export const SCENARIO_METADATA = {
  complete: {
    id: 'complete',
    title: 'Standard Laparoscopic Cholecystectomy',
    badge: 'ALL CHECKS PASSED',
    badgeColor: 'emerald',
    procedure: 'CPT 47562 · Gallbladder removal',
    diagnosis: 'SNOMED 28273000 · Cholelithiasis',
    summary: 'Standard pre-op case with verified consent, normal coagulation (Platelets 280k, INR 1.0), and zero antibiotic allergies.'
  },
  consent: {
    id: 'consent',
    title: 'Consent Signature Missing',
    badge: 'GATE BLOCKED',
    badgeColor: 'rose',
    procedure: 'CPT 44970 · Laparoscopic Appendectomy',
    diagnosis: 'SNOMED 441457006 · Acute appendicitis',
    summary: 'Surgical order exists for appendectomy, but signed consent form is not documented in EHR records.'
  },
  abnormal: {
    id: 'abnormal',
    title: 'Severe Thrombocytopenia Risk',
    badge: 'BLEEDING ALERT',
    badgeColor: 'amber',
    procedure: 'CPT 47562 · Cholecystectomy',
    diagnosis: 'SNOMED 28273000 · Cholelithiasis',
    summary: 'Platelet count is 92,000 /uL (below safe threshold of 150,000) and INR is 1.6, creating intraoperative hemorrhage danger.'
  },
  allergy: {
    id: 'allergy',
    title: 'Anaphylaxis Drug Contraindication',
    badge: 'CRITICAL ALLERGY',
    badgeColor: 'rose',
    procedure: 'CPT 27447 · Total Knee Arthroplasty',
    diagnosis: 'SNOMED 396275006 · Osteoarthritis',
    summary: 'Prophylactic Cefazolin (RxNorm 2180) ordered for joint replacement, but patient has documented life-threatening penicillin anaphylaxis.'
  },
  stale: {
    id: 'stale',
    title: 'Outdated Coagulation Labs (>24h)',
    badge: 'STALE EVIDENCE',
    badgeColor: 'amber',
    procedure: 'CPT 47562 · Cholecystectomy',
    diagnosis: 'SNOMED 28273000 · Cholelithiasis',
    summary: 'Pre-op coagulation blood draw was performed 38 hours ago. Institutional OT policy requires fresh CBC/Coag panel within 24 hours.'
  }
};

export const CLINICAL_ROLES = [
  {
    id: 'surgeon',
    name: 'Dr. Sarah Lin, MD, FACS',
    initials: 'SL',
    role: 'Attending Surgeon',
    specialty: 'General & Minimally Invasive Surgery',
    badge: 'LEAD SURGEON',
    icon: 'stethoscope',
    canAttest: true,
    canOverride: true,
    focusAreas: ['procedure', 'consent'],
    description: 'Procedure verification, CPT/SNOMED alignment, and final time-out attestation.'
  },
  {
    id: 'anesthesiologist',
    name: 'Dr. Marcus Vance, MD, FASA',
    initials: 'MV',
    role: 'Attending Anesthesiologist',
    specialty: 'Cardiothoracic & Surgical Anesthesia',
    badge: 'ANESTHESIOLOGY',
    icon: 'shield',
    canAttest: true,
    canOverride: false,
    focusAreas: ['allergy', 'labs'],
    description: 'Prophylactic antibiotic clearance, drug allergy reconciliation, and coagulation/platelet review.'
  },
  {
    id: 'nurse',
    name: 'Elena Rostova, RN, CNOR',
    initials: 'ER',
    role: 'Circulating Nurse',
    specialty: 'Perioperative Safety Coordinator',
    badge: 'SAFETY NURSE',
    icon: 'clipboard',
    canAttest: false,
    canOverride: false,
    focusAreas: ['consent', 'procedure'],
    description: 'Patient wristband identification, signed consent documentation, and checklist readiness coordinator.'
  }
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
