'use client';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import StatusBadge from '@/components/ui/StatusBadge.jsx';
import { formatDate } from '@/utils/clinicalFormatters.js';
import { useApp } from '@/context/AppContext.jsx';

export default function LaboratoryResultsTable({ assessment, onInspect }) {
  const { t, language, openKeyTerms } = useApp();

  const labLabelMap = {
    'Platelet count': language === 'bn' ? 'প্লেটলেট কাউন্ট' : 'Platelet count',
    'INR': language === 'bn' ? 'আইএনআর (INR)' : 'INR',
    'Prothrombin time (PT)': language === 'bn' ? 'প্রোথ্রম্বিন টাইম (PT)' : 'Prothrombin time (PT)',
    'Partial thromboplastin time (aPTT)': language === 'bn' ? 'পার্শিয়াল থ্রম্বোপ্লাস্টিন টাইম (aPTT)' : 'Partial thromboplastin time (aPTT)'
  };

  const tableHeaders = [
    t('colLabTest'),
    t('colResult'),
    t('colRange'),
    t('colEvidence')
  ];

  return (
    <article className="overflow-hidden rounded-xl border border-line bg-card shadow-2xs hover:shadow-xs transition-shadow">
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs">
              <ClinicalIcon name="flask" size={18} />
            </div>
            <div>
              <p className="font-mono text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                {language === 'bn' ? 'যাচাই ০৪' : 'CHECK 04'}
              </p>
              <h3 className="mt-0.5 text-base font-bold text-zinc-900 dark:text-zinc-100 sm:text-lg tracking-tight">
                {t('check4Title')}
              </h3>
            </div>
          </div>
          <StatusBadge status={assessment.checks.find(check => check.id === 'labs').status} />
        </div>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <p>{t('loincDesc')}</p>
          <button
            type="button"
            onClick={() => openKeyTerms('loinc')}
            className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Click to learn about LOINC codes"
          >
            <span>What is LOINC?</span>
            <ClinicalIcon name="external" size={11} className="text-zinc-400 dark:text-zinc-500" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-xs">
          <caption className="sr-only">Laboratory results and example policy ranges</caption>
          <thead className="border-y border-line bg-zinc-50/80 dark:bg-zinc-900/60 font-mono text-[10px] tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold uppercase">
            <tr>
              {tableHeaders.map(title => (
                <th key={title} scope="col" className="px-5 py-2.5">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {assessment.labs.map(lab => {
              const label = labLabelMap[lab.label] || lab.label;
              return (
                <tr key={lab.id} className="hover:bg-surface/50 transition-colors">
                  <th scope="row" className="px-5 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                    <div>{label}</div>
                    <button
                      type="button"
                      onClick={() => openKeyTerms('loinc')}
                      className="mt-0.5 inline-block font-mono text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline transition-colors"
                    >
                      LOINC {lab.loinc}
                    </button>
                  </th>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {lab.value ?? '—'}
                    </span>
                    <span className="ml-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">{lab.unit}</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {lab.range}
                    <span className="ml-1 text-zinc-400 dark:text-zinc-500 font-normal">{lab.unit}</span>
                  </td>
                  <td className="max-w-52 px-5 py-3.5">
                    <StatusBadge status={lab.status} short />
                    <span className="mt-1 block font-mono text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
                      {lab.status === 'pass' ? formatDate(lab.sampledAt) : lab.message}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-start gap-2 border-t border-line bg-surface/70 px-5 py-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        <ClinicalIcon name="info" size={14} className="mt-0.5 shrink-0 text-zinc-400 dark:text-zinc-500" />
        <p className="min-w-40 flex-1">{t('policyNotice')}</p>
        <button
          onClick={onInspect}
          className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <span>{t('viewEvidence')}</span>
          <ClinicalIcon name="external" size={11} className="text-zinc-400 dark:text-zinc-500" />
        </button>
      </div>
    </article>
  );
}
