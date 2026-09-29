'use client';
import { formatDate, formatPatientName } from '@/utils/clinicalFormatters.js';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function PatientContextCard({ data }) {
  const { t } = useApp();
  const patient = data?.patient || {};

  const fields = [
    [t('dob'), formatDate(patient.birthDate, false)],
    [t('recordedSex'), patient.gender || t('unknown')],
    [t('patientId'), patient.identifier?.[0]?.value || patient.id],
    [t('encounter'), data?.encounter?.id || t('notSupplied')]
  ];

  return (
    <section aria-label="Patient context" className="my-5 flex flex-wrap items-center gap-x-8 gap-y-5 rounded-xl border border-line bg-card p-5 sm:p-6 shadow-xs">
      <div className="flex min-w-56 items-center gap-3">
        <div className="grid size-11 place-items-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs">
          <ClinicalIcon name="user" size={22} />
        </div>
        <div>
          <p className="mb-0.5 font-mono text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase">
            {t('currentPatient')}
          </p>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatPatientName(patient)}
          </h2>
        </div>
      </div>

      <dl className="grid w-full flex-none grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 md:w-auto md:min-w-[360px] md:flex-1">
        {fields.map(([title, value]) => (
          <div key={title} className="min-w-0">
            <dt className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{title}</dt>
            <dd className="mt-0.5 break-words font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200">{value}</dd>
          </div>
        ))}
      </dl>

      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-surface px-3 py-1 font-mono text-[11px] font-medium text-zinc-600 dark:text-zinc-400 shadow-2xs">
        <ClinicalIcon name="lock" size={12} className="text-zinc-400 dark:text-zinc-500" />
        {t('ehrBound')}
      </span>
    </section>
  );
}
