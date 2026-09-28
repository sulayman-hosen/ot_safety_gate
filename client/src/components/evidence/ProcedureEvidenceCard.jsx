'use client';
import EvidenceCard, { EvidenceDetail } from './EvidenceCard.jsx';
import { formatConcept, formatDate } from '@/utils/clinicalFormatters.js';
import { useApp } from '@/context/AppContext.jsx';

export default function ProcedureEvidenceCard({ data, assessment, busy, onSelect, onInspect }) {
  const { t, openKeyTerms } = useApp();
  const check = assessment.checks.find(check => check.id === 'procedure');
  const procedureCode = assessment.selected?.code?.coding?.find(code => code.system === 'http://www.ama-assn.org/go/cpt')?.code;

  return (
    <EvidenceCard check={check} number="01" icon="stethoscope" onInspect={onInspect}>
      <label htmlFor="procedure" className="mb-2 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
        {t('scheduledOrder')}
      </label>
      <select
        id="procedure"
        className="mb-3 w-full rounded-lg border border-line bg-card p-2.5 text-xs text-black dark:text-white font-bold shadow-sm transition-colors focus:border-black dark:focus:border-white focus:outline-none"
        value={assessment.selected?.id || ''}
        disabled={busy}
        onChange={event => onSelect(event.target.value)}
      >
        <option value="">{t('selectOrder')}</option>
        {data.procedures.map(procedure => (
          <option key={procedure.id} value={procedure.id}>
            {formatConcept(procedure.code)} · {procedure.id}
          </option>
        ))}
      </select>

      <div className="divide-y divide-line">
        <EvidenceDetail label={t('procedureCode')}>
          <button
            type="button"
            onClick={() => openKeyTerms('snomed-cpt')}
            className="inline-flex items-center gap-1 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-2 py-0.5 text-xs font-bold text-black dark:text-white hover:underline"
            title="Click to learn about CPT codes"
          >
            <span>CPT {procedureCode || '—'}</span>
          </button>
        </EvidenceDetail>

        <EvidenceDetail label={t('scheduledFor')}>
          <span className="text-black dark:text-white">{formatDate(assessment.selected?.occurrenceDateTime || assessment.selected?.occurrencePeriod?.start)}</span>
        </EvidenceDetail>

        <EvidenceDetail label={t('diagnosedCondition')}>
          <span className="text-black dark:text-white">{data.conditions.map(condition => formatConcept(condition.code)).join(', ') || t('notDocumented')}</span>
        </EvidenceDetail>

        <EvidenceDetail label={t('diagnosisTerminology')}>
          <button
            type="button"
            onClick={() => openKeyTerms('snomed-cpt')}
            className="text-right text-xs font-bold text-black dark:text-white hover:underline"
            title="Click to learn about SNOMED CT"
          >
            <span>
              {data.conditions.map(condition =>
                condition.code?.coding
                  ?.filter(code => code.system === 'http://snomed.info/sct')
                  .map(code => `SNOMED CT ${code.code}`)
                  .join(', ')
              ).filter(Boolean).join('; ') || t('notDocumented')}
            </span>
          </button>
        </EvidenceDetail>
      </div>
    </EvidenceCard>
  );
}
