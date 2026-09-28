'use client';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import StatusBadge from '@/components/ui/StatusBadge.jsx';
import { useApp } from '@/context/AppContext.jsx';

export function EvidenceDetail({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-xs">
      <span className="shrink-0 font-medium text-neutral-600 dark:text-neutral-400">{label}</span>
      <span className="max-w-[65%] text-right font-bold text-black dark:text-white break-words">{children}</span>
    </div>
  );
}

export default function EvidenceCard({ check, number, icon, onInspect, children }) {
  const { t, language } = useApp();

  const titleEnMap = {
    procedure: 'Procedure & diagnosis',
    consent: 'Signed consent evidence',
    allergy: 'Antibiotics & allergies',
    labs: 'Coagulation & platelets'
  };

  const titleBnMap = {
    procedure: 'অস্ত্রোপচার ও রোগ নির্ণয়',
    consent: 'স্বাক্ষরিত সম্মতির প্রমাণ',
    allergy: 'অ্যান্টিবায়োটিক ও অ্যালার্জি',
    labs: 'রক্ত জমাট ও প্লেটলেট'
  };

  const title = (language === 'bn' ? titleBnMap[check.id] : titleEnMap[check.id]) || check.title;

  return (
    <article className="flex flex-col rounded-xl border border-line bg-card p-5 sm:p-6 shadow-sm transition-colors">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white shadow-inner">
            <ClinicalIcon name={icon} size={20} />
          </span>
          <div>
            <p className="text-[10px] font-bold tracking-[.15em] text-neutral-600 dark:text-neutral-400">
              {language === 'bn' ? `যাচাই ${number}` : `CHECK ${number}`}
            </p>
            <h3 className="mt-1 text-base font-bold text-black dark:text-white sm:text-lg">
              {title}
            </h3>
          </div>
        </div>
        <StatusBadge status={check.status} />
      </div>

      <div>{children}</div>

      <p
        className="mt-4 flex items-start gap-2 rounded-lg p-3 text-xs leading-5 border border-neutral-300 bg-neutral-100/90 text-black dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white"
      >
        <ClinicalIcon
          name={check.status === 'pass' ? 'check' : 'warning'}
          size={15}
          className="mt-0.5 shrink-0 text-black dark:text-white"
        />
        <span>{check.message}</span>
      </p>

      <button
        onClick={onInspect}
        className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-bold text-black dark:text-white hover:underline"
      >
        <span>{t('inspectEvidence')}</span>
        <ClinicalIcon name="external" size={13} className="text-black dark:text-white" />
      </button>
    </article>
  );
}
