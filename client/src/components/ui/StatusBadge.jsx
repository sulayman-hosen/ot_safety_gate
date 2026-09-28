'use client';
import { STATUS_LABELS } from '@/constants/checklistConstants.js';
import ClinicalIcon from './ClinicalIcon.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function StatusBadge({ status, short = false }) {
  const { language } = useApp();

  const styles = {
    pass: 'border-neutral-300 bg-neutral-100 text-black dark:border-neutral-700 dark:bg-neutral-800 dark:text-white',
    reviewable: 'border-neutral-300 bg-neutral-100 text-black dark:border-neutral-700 dark:bg-neutral-800 dark:text-white',
    review: 'border-neutral-400 bg-neutral-100 text-black dark:border-neutral-600 dark:bg-neutral-800 dark:text-white',
    block: 'border-black bg-neutral-200 text-black font-extrabold dark:border-white dark:bg-neutral-800 dark:text-white',
    blocked: 'border-black bg-neutral-200 text-black font-extrabold dark:border-white dark:bg-neutral-800 dark:text-white'
  };

  const labelsEn = {
    pass: short ? 'Matched' : 'Evidence matched',
    reviewable: short ? 'Ready' : 'Ready for team review',
    review: short ? 'Review' : 'Needs review',
    block: short ? 'Action' : 'Action required',
    blocked: short ? 'Action' : 'Action required'
  };

  const labelsBn = {
    pass: short ? 'মিলেছে' : 'প্রমাণ মিলেছে',
    reviewable: short ? 'প্রস্তুত' : 'টিম পর্যালোচনার জন্য প্রস্তুত',
    review: short ? 'পর্যালোচনা' : 'পর্যালোচনা প্রয়োজন',
    block: short ? 'পদক্ষেপ' : 'জরুরী পদক্ষেপ প্রয়োজন',
    blocked: short ? 'পদক্ষেপ' : 'জরুরী পদক্ষেপ প্রয়োজন'
  };

  const good = ['pass', 'reviewable'].includes(status);
  const labelMap = language === 'bn' ? labelsBn : labelsEn;
  const label = labelMap[status] || STATUS_LABELS[status] || (language === 'bn' ? 'পর্যালোচনা প্রয়োজন' : 'Needs review');

  return (
    <span className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-xs font-semibold ${styles[status] || styles.review}`}>
      <ClinicalIcon name={good ? 'check' : 'warning'} size={13} className="text-black dark:text-white" />
      <span>{label}</span>
    </span>
  );
}
