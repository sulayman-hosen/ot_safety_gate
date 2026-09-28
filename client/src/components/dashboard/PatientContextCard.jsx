'use client';
import { formatDate, formatPatientName } from '@/utils/clinicalFormatters.js';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function PatientContextCard({ data }) {
  const { t } = useApp();
  const patient = data.patient;

  const fields = [
    [t('dob'), formatDate(patient.birthDate, false)],
    [t('recordedSex'), patient.gender || t('unknown')],
    [t('patientId'), patient.identifier?.[0]?.value || patient.id],
    [t('encounter'), data.encounter?.id || t('notSupplied')]
  ];

  return (
    <section aria-label="Patient context" className="my-5 flex flex-wrap items-center gap-x-8 gap-y-5 rounded-xl border border-line bg-card p-5 sm:p-6 shadow-sm">
      <div className="flex min-w-56 items-center gap-3">
        <span className="grid size-12 place-items-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white">
          <ClinicalIcon name="user" size={26} />
        </span>
        <div>
          <p className="mb-1 text-[10px] font-bold tracking-[.14em] text-neutral-600 dark:text-neutral-400">
            {t('currentPatient')}
          </p>
          <h2 className="text-xl font-bold text-black dark:text-white">
            {formatPatientName(patient)}
          </h2>
        </div>
      </div>

      <dl className="grid w-full flex-none grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 md:w-auto md:min-w-[360px] md:flex-1">
        {fields.map(([title, value]) => (
          <div key={title} className="min-w-0">
            <dt className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">{title}</dt>
            <dd className="mt-1 break-words text-xs font-bold text-black dark:text-white">{value}</dd>
          </div>
        ))}
      </dl>

      <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-surface px-3 py-1 text-[11px] font-bold text-black dark:text-white">
        <ClinicalIcon name="lock" size={13} className="text-black dark:text-white" />
        {t('ehrBound')}
      </span>
    </section>
  );
}
