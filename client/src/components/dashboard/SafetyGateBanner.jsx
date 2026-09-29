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
      className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-line bg-card p-5 shadow-xs transition-colors"
      aria-label="Safety gate status"
    >
      <div
        className={`grid size-11 shrink-0 place-items-center rounded-xl border ${
          good
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
        }`}
      >
        <ClinicalIcon name={good ? 'shield' : 'warning'} size={22} />
      </div>

      <div className="min-w-48 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold sm:text-xl text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
          <span
            className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
              good
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
            }`}
          >
            {good ? 'READY' : 'ACTION'}
          </span>
        </div>
        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {good ? t('bannerGoodLead') : t('bannerReviewLead')}
        </p>
      </div>

      <div className="flex gap-6 text-right">
        <div>
          <span className="font-heading text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {assessment.passed}
            <span className="font-mono text-base font-normal text-zinc-400 dark:text-zinc-500"> / 4</span>
          </span>
          <p className="mt-1 font-mono text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            {t('checksMatched')}
          </p>
        </div>

        <div className="border-l border-line pl-5">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            <ClinicalIcon name="clock" size={13} className="text-zinc-400 dark:text-zinc-500" />
            {ageMinutes < 1 ? t('justNow') : `${ageMinutes}${t('mAgo')}`}
          </span>
          <p className="mt-1 font-mono text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            {t('lastRetrieved')}
          </p>
        </div>
      </div>
    </section>
  );
}
