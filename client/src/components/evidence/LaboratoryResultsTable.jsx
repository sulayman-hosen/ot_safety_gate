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
    <article className="overflow-hidden rounded-xl border border-line bg-card shadow-sm transition-colors">
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white shadow-inner">
              <ClinicalIcon name="flask" size={20} />
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-[.15em] text-neutral-600 dark:text-neutral-400">
                {language === 'bn' ? 'যাচাই ০৪' : 'CHECK 04'}
              </p>
              <h3 className="mt-1 text-base font-bold text-black dark:text-white sm:text-lg">
                {t('check4Title')}
              </h3>
            </div>
          </div>
          <StatusBadge status={assessment.checks.find(check => check.id === 'labs').status} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <p>{t('loincDesc')}</p>
          <button
            type="button"
            onClick={() => openKeyTerms('loinc')}
            className="inline-flex items-center gap-1 font-bold text-black dark:text-white hover:underline"
            title="Click to learn about LOINC codes"
          >
            <span>What is LOINC?</span>
            <ClinicalIcon name="external" size={12} className="text-black dark:text-white" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-xs">
          <caption className="sr-only">Laboratory results and example policy ranges</caption>
          <thead className="border-y border-line bg-neutral-100 dark:bg-neutral-800 text-[10px] tracking-wider text-black dark:text-white font-bold">
            <tr>
              {tableHeaders.map(title => (
                <th key={title} scope="col" className="px-5 py-3 uppercase">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {assessment.labs.map(lab => {
              const label = labLabelMap[lab.label] || lab.label;
              return (
                <tr key={lab.id} className="hover:bg-surface/50 transition-colors">
                  <th scope="row" className="px-5 py-4 font-bold text-black dark:text-white">
                    <span>{label}</span>
                    <button
                      type="button"
                      onClick={() => openKeyTerms('loinc')}
                      className="mt-1 block text-left font-mono text-[10px] font-bold text-black dark:text-white underline"
                    >
                      LOINC {lab.loinc}
                    </button>
                  </th>
                  <td className="px-5 py-4">
                    <span className="font-extrabold text-black dark:text-white">
                      {lab.value ?? '—'}
                    </span>
                    <span className="ml-1 text-xs text-neutral-600 dark:text-neutral-400 font-normal">{lab.unit}</span>
                  </td>
                  <td className="px-5 py-4 font-bold text-black dark:text-white">
                    {lab.range}
                    <span className="ml-1 text-xs text-neutral-600 dark:text-neutral-400 font-normal">{lab.unit}</span>
                  </td>
                  <td className="max-w-52 px-5 py-4">
                    <StatusBadge status={lab.status} short />
                    <span className="mt-1.5 block text-xs leading-4 text-neutral-600 dark:text-neutral-400">
                      {lab.status === 'pass' ? formatDate(lab.sampledAt) : lab.message}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-start gap-2 border-t border-line bg-neutral-100/70 dark:bg-neutral-800/70 px-5 py-4 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
        <ClinicalIcon name="info" size={15} className="mt-0.5 text-black dark:text-white" />
        <p className="min-w-40 flex-1">{t('policyNotice')}</p>
        <button
          onClick={onInspect}
          className="inline-flex items-center gap-1 font-bold text-black dark:text-white hover:underline"
        >
          <span>{t('viewEvidence')}</span>
          <ClinicalIcon name="external" size={13} className="text-black dark:text-white" />
        </button>
      </div>
    </article>
  );
}
