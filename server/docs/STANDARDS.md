# Standards and document scope

The implementation targets **FHIR R4 (4.0.1)** because the demo resources and field paths are defined against that release. Do not mix R5 Consent or resource shapes without an adapter.

## USCDI content mapping

USCDI describes standardized data classes/elements rather than specifying a JSON/XML document layout. Its Clinical Notes content is exchange-format agnostic. Applicable USCDI versions and implementation/certification obligations depend on the target use case; no regulatory compliance is asserted by this project.

| Relevant content | Source / export |
|---|---|
| Patient demographics | Patient / document subject / CDA recordTarget |
| Problems | SNOMED-coded Condition / procedure-and-diagnosis section |
| Planned procedure | CPT-coded ServiceRequest / procedure section |
| Allergies/intolerances | AllergyIntolerance / allergies section |
| Medication plan | MedicationRequest / planned medication narrative |
| Laboratory results | LOINC-coded Observation, UCUM quantity, specimen timestamp |
| Clinical note | Composition with evidence assessment and team review |
| Authorship / time | Verified practitioner or explicitly labeled draft generator and document date |
| Consent evidence | Procedure-specific narrative with matching source evidence assessment |

The pre-op note is not an operative report and cannot satisfy documentation of an operation that has not happened.

## Export formats

**FHIR:** a `Bundle` of type `document`, with identifier/timestamp and Composition first. The Composition has subject, author, type, date and sections. Referenced mapped Patient, Encounter, Practitioner/Device, Organization, Condition, Observation, ServiceRequest, AllergyIntolerance and MedicationRequest resources use resolving `urn:uuid` references. Clinical source records are mapped to the subset needed for this summary. Original legal consent files, provider reference graphs, unrelated data and complete source chart fidelity are not claimed. No US Core `meta.profile` URLs are attached without profile validation.

**CDA:** a Core CDA R2 structured narrative with header, patient, author, custodian and section text. It does not assert C-CDA, US Realm, discharge summary, operative-note or electronic-signature template conformance. Drafts are clearly labeled. Even a reviewed XML export is not automatically a legal authenticated EHR document.

**HTML:** an escaped standalone printable summary. The reviewer can print or Save as PDF from their browser. This avoids implying that a generated PDF is a cryptographically signed record.

All exports are created from the server-retrieved, re-evaluated snapshot. Reviewed records require a verified allowlisted clinician identity (a labeled synthetic identity in demo). The FHIR attester is a recorded personal attestation, not a digital signature. The app does not POST the document into the EHR. Target-system import, acceptance and further authentication are deployment-specific.

## Official references checked for this project

- [SMART App Launch — authorization](https://build.fhir.org/ig/HL7/smart-app-launch/app-launch.html)
- [SMART scopes and launch context](https://build.fhir.org/ig/HL7/smart-app-launch/scopes-and-launch-context.html)
- [SMART App Launcher](https://launch.smarthealthit.org/)
- [SMART client-js](https://github.com/smart-on-fhir/client-js) — optional alternative SDK; this app uses a Node-side OAuth implementation so tokens stay off the browser
- [FHIR R4 ServiceRequest](https://www.hl7.org/fhir/R4/servicerequest.html)
- [FHIR R4 Observation](https://www.hl7.org/fhir/R4/observation.html)
- [FHIR R4 AllergyIntolerance](https://www.hl7.org/fhir/R4/allergyintolerance.html)
- [FHIR R4 Consent](https://www.hl7.org/fhir/R4/consent.html)
- [FHIR R4 Provenance](https://www.hl7.org/fhir/R4/provenance.html)
- [FHIR R4 Composition](https://www.hl7.org/fhir/R4/composition.html)
- [FHIR R4 documents](https://www.hl7.org/fhir/R4/documents.html)
- [FHIR R4 JSON Schema](https://www.hl7.org/fhir/R4/fhir.schema.json.zip)
- [HL7 CDA Core repository](https://github.com/HL7/CDA-core-2.0)
- [USCDI](https://isp.healthit.gov/united-states-core-data-interoperability-uscdi)
- [USCDI Clinical Notes](https://isp.healthit.gov/uscdi-data-class/clinical-notes)
- [AMA CPT overview](https://www.ama-assn.org/practice-management/cpt)
- [HL7 example referencing CPT 44970](https://hl7.org/fhir/us/hai/QuestionnaireResponse-hai-questionnaireresponse-opc-proc-denom.html)
- [SNOMED browser](https://browser.ihtsdotools.org/)
- [SNOMED glossary example of appendicitis concept 74400008](https://docs.snomed.org/snomed-international-documents/snomed-ct-glossary/d/defined-concept)
- LOINC: [777-3](https://loinc.org/777-3), [6301-6](https://loinc.org/6301-6), [5902-2](https://loinc.org/5902-2), [14979-9](https://loinc.org/14979-9)

Normative schemas and terminology licenses remain owned by their publishers. Referenced standards and local clinical policy must be reviewed for the intended deployment.
