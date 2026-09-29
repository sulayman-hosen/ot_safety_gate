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
          <span className="text-zinc-900 dark:text-zinc-100">{medications.map(medication => formatConcept(medication.medicationCodeableConcept)).join(', ') || t('unknown')}</span>
          <button
            type="button"
            onClick={() => openKeyTerms('rxnorm')}
            className="mt-0.5 font-mono text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline transition-colors"
            title="Click to learn about RxNorm standardized drug codes"
          >
            RxNorm catalog check
          </button>
        </div>
      </EvidenceDetail>

      <div className="mt-3 rounded-lg border border-line bg-surface p-3">
        <p className="font-mono text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
          {t('recordedAllergyStatus')}
        </p>
        <p className="mt-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          {data.allergies.map(allergy => formatConcept(allergy.code)).join(', ') || t('noRecordsReturned')}
        </p>
      </div>
    </EvidenceCard>
  );
}
