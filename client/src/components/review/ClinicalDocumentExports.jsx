'use client';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function ClinicalDocumentExports({ record }) {
  const { t } = useApp();

  const formats = [
    { format: 'fhir', label: t('fhirDoc'), detail: t('fhirDetail') },
    { format: 'cda', label: t('cdaNarrative'), detail: t('cdaDetail') },
    { format: 'html', label: t('printableSummary'), detail: t('printDetail') }
  ];

  return (
    <section className="rounded-xl border border-line bg-card p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow" aria-label="Clinical summary exports">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{t('clinicalSummary')}</h2>
        <ClinicalIcon name="document" size={16} className="text-zinc-400 dark:text-zinc-500" />
      </div>

      <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {record
          ? `${record.draft ? 'Draft' : 'Reviewed'} ${t('exportReady')}`
          : t('exportPrompt')}
      </p>

      {record ? (
        <div className="mt-4 space-y-2">
          {formats.map(({ format, label, detail }) => (
            <a
              key={format}
              href={`/api/records/${record.id}?format=${format}`}
              target={format === 'html' ? '_blank' : undefined}
              rel={format === 'html' ? 'noreferrer' : undefined}
              className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60"
            >
              <span>
                <span className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100">{label}</span>
                <span className="mt-0.5 block font-mono text-[11px] text-zinc-500 dark:text-zinc-400">{detail}</span>
              </span>
              <ClinicalIcon
                name={format === 'html' ? 'external' : 'download'}
                size={14}
                className="text-zinc-500 dark:text-zinc-400"
              />
            </a>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-lg border border-dashed border-line bg-surface/50 py-7 text-zinc-500 dark:text-zinc-400">
          <ClinicalIcon name="document" size={22} className="text-zinc-400 dark:text-zinc-500" />
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{t('noRecordYet')}</span>
        </div>
      )}

      <p className="mt-3.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        {t('exportNotice')}
      </p>
    </section>
  );
}
