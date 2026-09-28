'use client';
import EvidenceCard, { EvidenceDetail } from './EvidenceCard.jsx';
import { formatConcept, getPlannedMedications } from '@/utils/clinicalFormatters.js';
import { useApp } from '@/context/AppContext.jsx';

export default function AllergyEvidenceCard({ data, assessment, onInspect }) {
  const { t, openKeyTerms } = useApp();
  const check = assessment.checks.find(check => check.id === 'allergy');
  const medications = getPlannedMedications(data, assessment.selected);

  return (
    <EvidenceCard check={check} number="03" icon="shield" onInspect={onInspect}>
      <EvidenceDetail label={t('plannedMedication')}>
        <div className="flex flex-col items-end">
          <span className="text-black dark:text-white">{medications.map(medication => formatConcept(medication.medicationCodeableConcept)).join(', ') || t('unknown')}</span>
          <button
            type="button"
            onClick={() => openKeyTerms('rxnorm')}
            className="mt-0.5 text-[10px] font-bold text-black dark:text-white underline"
            title="Click to learn about RxNorm standardized drug codes"
          >
            RxNorm catalog check
          </button>
        </div>
      </EvidenceDetail>

      <div className="mt-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-3">
        <p className="text-[10px] font-bold tracking-[.1em] text-neutral-600 dark:text-neutral-400">
          {t('recordedAllergyStatus')}
        </p>
        <p className="mt-1.5 text-xs font-bold text-black dark:text-white">
          {data.allergies.map(allergy => formatConcept(allergy.code)).join(', ') || t('noRecordsReturned')}
        </p>
      </div>
    </EvidenceCard>
  );
}
