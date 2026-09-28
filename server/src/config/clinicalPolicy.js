// Synthetic teaching policy. These are NOT universal surgical clearance thresholds.
// Review with local surgery, anesthesia, laboratory and pharmacy leads before live use.
export const SYSTEM = {
  cpt: 'http://www.ama-assn.org/go/cpt', snomed: 'http://snomed.info/sct',
  loinc: 'http://loinc.org', ucum: 'http://unitsofmeasure.org', rxnorm: 'http://www.nlm.nih.gov/research/umls/rxnorm'
};
export const POLICY = {
  version: 'demo-policy-1.0',
  maxScheduleHours: 24, maxAllergyAgeHours: 24, snapshotMaxAgeMinutes: 5,
  procedurePairs: [
    // One illustrative association, not an official CPT-to-SNOMED equivalence map.
    { cpt: '44970', snomed: ['74400008'], label: 'Laparoscopic appendectomy', source: 'Local synthetic example; requires clinical validation' }
  ],
  labs: [
    { id: 'platelets', label: 'Platelets', codes: ['777-3'], unit: '10*9/L', min: 100, max: 450, maxAgeHours: 24 },
    { id: 'inr', label: 'INR', codes: ['6301-6'], unit: '1', min: 0.8, max: 1.5, maxAgeHours: 24 },
    { id: 'pt', label: 'Prothrombin time', codes: ['5902-2'], unit: 's', min: 10, max: 15, maxAgeHours: 24 },
    { id: 'aptt', label: 'aPTT', codes: ['14979-9'], unit: 's', min: 25, max: 35, maxAgeHours: 24 }
  ],
  // A tiny ingredient/class dictionary. It never claims complete drug cross-reactivity coverage.
  antibiotics: [
    { system: SYSTEM.rxnorm, code: '2180', name: 'Cefazolin', ingredient: 'cefazolin', classes: ['cephalosporin', 'beta-lactam'] },
    { system: SYSTEM.rxnorm, code: '11124', name: 'Vancomycin', ingredient: 'vancomycin', classes: ['glycopeptide'] }
  ],
  allergens: [
    { system: SYSTEM.rxnorm, code: '2180', name: 'Cefazolin', ingredient: 'cefazolin', classes: ['cephalosporin', 'beta-lactam'] },
    { system: SYSTEM.rxnorm, code: '11124', name: 'Vancomycin', ingredient: 'vancomycin', classes: ['glycopeptide'] },
    { system: SYSTEM.snomed, code: '373270004', name: 'Penicillin class', classes: ['penicillin', 'beta-lactam'] }
  ],
  noKnownAllergyCode: '716186003'
};
