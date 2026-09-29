'use client';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import StatusBadge from '@/components/ui/StatusBadge.jsx';
import { useApp } from '@/context/AppContext.jsx';

export function EvidenceDetail({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-xs border-b border-line/60 last:border-0">
      <span className="shrink-0 font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="max-w-[65%] text-right font-semibold text-zinc-900 dark:text-zinc-100 break-words">{children}</span>
    </div>
  );
}

export default function EvidenceCard({ check, number, icon, onInspect, children }) {
  const { t, language, activeRole } = useApp();

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
  const isPass = check.status === 'pass';
  const isAssigned = activeRole?.focusAreas?.includes(check.id);

  return (
    <article
      className={`flex flex-col rounded-xl border bg-card p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all ${
        isAssigned
          ? 'border-zinc-300 dark:border-zinc-700 ring-1 ring-zinc-200 dark:ring-zinc-800'
          : 'border-line'
      }`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs">
            <ClinicalIcon name={icon} size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-mono text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                {language === 'bn' ? `যাচাই ${number}` : `CHECK ${number}`}
              </p>
              {isAssigned && (
                <span className="rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.2 font-mono text-[9px] font-bold text-zinc-600 dark:text-zinc-300">
                  {activeRole.badge} FOCUS
                </span>
              )}
            </div>
            <h3 className="mt-0.5 text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {title}
            </h3>
          </div>
        </div>
        <StatusBadge status={check.status} />
      </div>

      <div className="divide-y divide-line/40">{children}</div>

      <div
        className={`mt-4 flex items-start gap-2.5 rounded-lg p-3 text-xs leading-5 border font-medium ${
          isPass
            ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
            : 'border-amber-500/25 bg-amber-500/10 text-amber-900 dark:text-amber-300'
        }`}
      >
        <ClinicalIcon
          name={isPass ? 'check' : 'warning'}
          size={14}
          className={`mt-0.5 shrink-0 ${isPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}
        />
        <span>{check.message}</span>
      </div>

      <button
        onClick={onInspect}
        className="mt-3.5 inline-flex w-fit items-center gap-1.5 font-mono text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <span>{t('inspectEvidence')}</span>
        <ClinicalIcon name="external" size={12} className="text-zinc-400 dark:text-zinc-500" />
      </button>
    </article>
  );
}
