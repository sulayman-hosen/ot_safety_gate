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
    <section className="rounded-xl border border-line bg-card p-5 sm:p-6 shadow-sm transition-colors" aria-label="Clinical summary exports">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-black dark:text-white">{t('clinicalSummary')}</h2>
        <ClinicalIcon name="document" size={18} className="text-black dark:text-white" />
      </div>

      <p className="mt-2 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
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
              className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3 transition-colors hover:border-black dark:hover:border-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              <span>
                <span className="block text-xs font-bold text-black dark:text-white">{label}</span>
                <span className="mt-0.5 block text-xs text-neutral-600 dark:text-neutral-400">{detail}</span>
              </span>
              <ClinicalIcon
                name={format === 'html' ? 'external' : 'download'}
                size={16}
                className="text-black dark:text-white"
              />
            </a>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-2.5 rounded-lg border border-dashed border-line bg-surface/50 py-8 text-neutral-600 dark:text-neutral-400">
          <ClinicalIcon name="document" size={26} className="text-black dark:text-white opacity-60" />
          <span className="text-xs font-bold text-black dark:text-white">{t('noRecordYet')}</span>
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
        {t('exportNotice')}
      </p>
    </section>
  );
}
