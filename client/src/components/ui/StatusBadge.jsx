'use client';
import { STATUS_LABELS } from '@/constants/checklistConstants.js';
import ClinicalIcon from './ClinicalIcon.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function StatusBadge({ status, short = false }) {
  const { language } = useApp();

  const styles = {
    pass: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500/30',
    reviewable: 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-400 dark:border-sky-500/30',
    review: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400 dark:border-amber-500/30',
    block: 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-400 dark:border-rose-500/30 font-bold',
    blocked: 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-400 dark:border-rose-500/30 font-bold'
  };

  const iconStyles = {
    pass: 'text-emerald-600 dark:text-emerald-400',
    reviewable: 'text-sky-600 dark:text-sky-400',
    review: 'text-amber-600 dark:text-amber-400',
    block: 'text-rose-600 dark:text-rose-400',
    blocked: 'text-rose-600 dark:text-rose-400'
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
    <span className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide ${styles[status] || styles.review}`}>
      <ClinicalIcon name={good ? 'check' : 'warning'} size={12} className={iconStyles[status] || 'text-amber-600 dark:text-amber-400'} />
      <span>{label}</span>
    </span>
  );
}
