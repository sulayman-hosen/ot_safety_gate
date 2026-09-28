# Clinical evidence rules and local adaptation

`server/src/config/clinicalPolicy.js` holds a versioned synthetic policy. It is deterministic and intentionally conservative. **It is not clinical advice or an approved surgical protocol.** Numeric examples exist to demonstrate gating behavior in a candidate evaluation.

## Gate states

| State | Meaning | Allowed output |
|---|---|---|
| `blocked` | Conflict, abnormal example value, failed source completeness, missing consent/context or unapproved live policy | Draft only |
| `review` | Stale, unmapped, incomplete individual clinical evidence or unsupported representation | Draft only |
| `reviewable` | Four example checks matched | Draft; reviewed record only after authorized human confirmations |

The system has no automatic “safe for surgery” result and no bypass/override button. Correct the source record, refresh, and review again. This deliberately does not implement emergency override workflows.

## Procedure / diagnosis

Require an active ServiceRequest with `intent=order`, a precise future `occurrenceDateTime` or `occurrencePeriod.start` within the example 24-hour window, and the launched encounter. One CPT coding is compared with an active, confirmed, order-linked Condition bearing a supported SNOMED code.

The included pair is **CPT 44970 → SNOMED CT 74400008**, an illustrative appendectomy/appendicitis association. This is neither semantic equivalence nor a comprehensive/official crosswalk. The engine does not infer indication from descriptions, code prefixes, free text or AI. Unknown pairs remain unresolved. Local terminology versions, CPT licenses, SNOMED membership/licensing and institution-approved associations must be maintained separately.

## Narrow consent profile

Automatic evidence matching requires all of:

- Patient-bound active Consent with treatment scope and `provision.type=permit`.
- `provision.data` with `meaning=instance` referencing the exact selected ServiceRequest.
- A matching system-qualified CPT code in `provision.code`.
- An explicit validity interval spanning the current time and scheduled surgery.
- Recorded positive `verification`, with `verifiedWith` referencing the patient and a non-future verification date.
- `sourceReference` pointing to a current, final DocumentReference with content and the same surgery in `context.related`.
- Provenance targeting that document with signature data, signature time and `who` referencing the same patient.

Nested restrictions, surrogate signers, multi-procedure orders, ambiguous/withdrawn/denied related consent and other vendor profiles require a reviewed adapter. The app does not interpret arbitrary policy clauses or validate the signature cryptographically. Source attachments are not automatically followed or rendered; clinicians inspect the original document in the EHR. Synthetic fixtures contain obviously fake signature evidence.

## Labs

| Test | LOINC | Canonical UCUM | Synthetic demo range | Freshness |
|---|---|---|---|---|
| Platelets | 777-3 | `10*9/L` | 100–450 | 24 hours |
| INR | 6301-6 | `1` | 0.8–1.5 | 24 hours |
| PT | 5902-2 | `s` | 10–15 | 24 hours |
| aPTT | 14979-9 | `s` | 25–35 | 24 hours |

These example limits must not be interpreted as universal minimums, normal ranges or clearance thresholds. Acceptable values and required tests vary with the patient, procedure, therapy and assay. The source laboratory reference range is retained in the FHIR export but is not silently substituted for institutional policy.

The latest precise specimen time wins, including preliminary/unusable results; an older final cannot conceal a newer unresolved result. Tied conflicting values require review. Root Observation and component results are supported. Unit conversion is explicit: platelet `10*3/uL` is equivalent to `10*9/L`, `/uL` is divided by 1000, and milliseconds are converted to seconds. Comparators, unknown/missing units, absent data, invalid/future dates and non-numeric values remain unresolved. Source abnormal flags also block finalization.

## Antibiotics / allergies

Active order-intent MedicationRequests must be linked by `basedOn` to the selected surgery. The tiny example dictionary covers ingredient-coded cefazolin and vancomycin and one penicillin-class mapping. This is not a complete drug knowledge base. Brand/combination RxNorm products, referenced Medication resources and unlinked antibiotic orders require a pharmacy-approved adapter.

The engine distinguishes an explicit recent “no known allergy” assertion from an empty response. Contradictory positive/negative records block. A same-ingredient conflict blocks; related classes are escalated for human assessment, without asserting a clinical cross-reactivity percentage or universal contraindication. Other positive/unmapped/historical/unconfirmed allergies require reconciliation. No dose, alternative drug or administration recommendation is made.

## Enable a live reviewed record

Review/replace these policies, increment their version, validate the EHR representations with clinical and technical owners, and configure a verified authorized reviewer. Then set `CLINICAL_POLICY_APPROVED=true` and `CLINICAL_POLICY_APPROVER` to the responsible local owner. This environment switch records local configuration intent; it is not certification or proof of clinical validation. A real approval/clinical governance process must exist outside this reference implementation.
