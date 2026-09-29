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
      <label htmlFor="procedure" className="mb-1.5 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
        {t('scheduledOrder')}
      </label>
      <select
        id="procedure"
        className="mb-3 w-full rounded-lg border border-line bg-surface p-2 font-mono text-xs text-zinc-900 dark:text-zinc-100 font-medium shadow-2xs transition-colors focus:border-zinc-500 focus:outline-none"
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

      <div className="divide-y divide-line/40">
        <EvidenceDetail label={t('procedureCode')}>
          <button
            type="button"
            onClick={() => openKeyTerms('snomed-cpt')}
            className="inline-flex items-center gap-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
            title="Click to learn about CPT codes"
          >
            <span>CPT {procedureCode || '—'}</span>
          </button>
        </EvidenceDetail>

        <EvidenceDetail label={t('scheduledFor')}>
          <span className="font-mono text-xs text-zinc-800 dark:text-zinc-200">{formatDate(assessment.selected?.occurrenceDateTime || assessment.selected?.occurrencePeriod?.start)}</span>
        </EvidenceDetail>

        <EvidenceDetail label={t('diagnosedCondition')}>
          <span className="text-zinc-800 dark:text-zinc-200">{data.conditions.map(condition => formatConcept(condition.code)).join(', ') || t('notDocumented')}</span>
        </EvidenceDetail>

        <EvidenceDetail label={t('diagnosisTerminology')}>
          <button
            type="button"
            onClick={() => openKeyTerms('snomed-cpt')}
            className="text-right font-mono text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
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
