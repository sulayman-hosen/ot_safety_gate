'use client';
import { STATUS_LABELS } from '@/constants/checklistConstants.js';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function SafetyGateBanner({ assessment, expiredEvidence, ageMinutes }) {
  const { t, language } = useApp();
  const good = assessment.status === 'reviewable' && !expiredEvidence;

  const translatedStatusLabels = {
    pass: language === 'bn' ? 'সমস্ত প্রমাণ মিলেছে' : 'Evidence matched',
    reviewable: language === 'bn' ? 'টিম পর্যালোচনার জন্য প্রস্তুত' : 'Ready for team review',
    review: language === 'bn' ? 'পর্যালোচনা প্রয়োজন' : 'Needs review',
    block: language === 'bn' ? 'জরুরী পদক্ষেপ প্রয়োজন' : 'Action required',
    blocked: language === 'bn' ? 'জরুরী পদক্ষেপ প্রয়োজন' : 'Action required'
  };

  const title = expiredEvidence
    ? t('bannerExpiredLead')
    : translatedStatusLabels[assessment.status] || STATUS_LABELS[assessment.status];

  return (
    <section
      className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-neutral-300 bg-neutral-100/90 text-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white p-5 shadow-sm transition-colors"
      aria-label="Safety gate status"
    >
      <span
        className="grid size-11 shrink-0 place-items-center rounded-full bg-black text-white dark:bg-white dark:text-black"
      >
        <ClinicalIcon name={good ? 'shield' : 'warning'} size={24} />
      </span>

      <div className="min-w-48 flex-1">
        <h2 className="text-lg font-bold sm:text-xl text-black dark:text-white">
          {title}
        </h2>
        <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
          {good ? t('bannerGoodLead') : t('bannerReviewLead')}
        </p>
      </div>

      <div className="flex gap-6 text-right">
        <div>
          <span className="font-heading text-2xl font-black text-black dark:text-white">
            {assessment.passed}
            <span className="text-base font-normal text-neutral-600 dark:text-neutral-400"> / 4</span>
          </span>
          <p className="mt-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
            {t('checksMatched')}
          </p>
        </div>

        <div className="border-l border-neutral-300 dark:border-neutral-700 pl-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white">
            <ClinicalIcon name="clock" size={14} className="text-black dark:text-white" />
            {ageMinutes < 1 ? t('justNow') : `${ageMinutes}${t('mAgo')}`}
          </span>
          <p className="mt-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
            {t('lastRetrieved')}
          </p>
        </div>
      </div>
    </section>
  );
}
