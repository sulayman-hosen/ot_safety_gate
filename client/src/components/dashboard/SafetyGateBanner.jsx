'use client';
import { STATUS_LABELS } from '@/constants/checklistConstants.js';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function SafetyGateBanner({ assessment, expiredEvidence, ageMinutes, emergencyOverride }) {
  const { t, language, openEmergencyModal, openClearanceModal } = useApp();
  const isOverridden = Boolean(emergencyOverride);
  const good = (assessment.status === 'reviewable' && !expiredEvidence) || isOverridden;

  const translatedStatusLabels = {
    pass: language === 'bn' ? 'সমস্ত প্রমাণ মিলেছে' : 'Evidence matched',
    reviewable: language === 'bn' ? 'টিম পর্যালোচনার জন্য প্রস্তুত' : 'Ready for team review',
    review: language === 'bn' ? 'পর্যালোচনা প্রয়োজন' : 'Needs review',
    block: language === 'bn' ? 'জরুরী পদক্ষেপ প্রয়োজন' : 'Action required',
    blocked: language === 'bn' ? 'জরুরী পদক্ষেপ প্রয়োজন' : 'Action required'
  };

  const title = isOverridden
    ? 'Emergency Clinical Override Active'
    : expiredEvidence
    ? t('bannerExpiredLead')
    : translatedStatusLabels[assessment.status] || STATUS_LABELS[assessment.status];

  return (
    <section
      className={`mb-6 rounded-xl border p-5 shadow-xs transition-colors ${
        isOverridden
          ? 'border-amber-500/40 bg-amber-500/5'
          : 'border-line bg-card'
      }`}
      aria-label="Safety gate status"
    >
      <div className="flex flex-wrap items-center gap-4">
        <div
          className={`grid size-11 shrink-0 place-items-center rounded-xl border ${
            isOverridden
              ? 'border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400'
              : good
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}
        >
          <ClinicalIcon name={isOverridden ? 'warning' : good ? 'shield' : 'warning'} size={22} />
        </div>

        <div className="min-w-48 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold sm:text-xl text-zinc-900 dark:text-zinc-100">
              {title}
            </h2>
            <span
              className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                isOverridden
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                  : good
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}
            >
              {isOverridden ? 'OVERRIDE' : good ? 'READY' : 'ACTION REQUIRED'}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {isOverridden
              ? `Override authorized by ${emergencyOverride.physician} (${emergencyOverride.role}). Gate unlocked under physician emergency privilege.`
              : good
              ? t('bannerGoodLead')
              : t('bannerReviewLead')}
          </p>
        </div>

        {/* Action Buttons for Override & Certificate Preview */}
        <div className="flex flex-wrap items-center gap-2">
          {!good && !isOverridden && (
            <button
              onClick={openEmergencyModal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 px-3 py-1.5 font-mono text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <ClinicalIcon name="warning" size={13} className="text-rose-600" />
              <span>Emergency Override</span>
            </button>
          )}

          {isOverridden && (
            <button
              onClick={openEmergencyModal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-200 px-3 py-1.5 font-mono text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <ClinicalIcon name="warning" size={13} className="text-amber-600" />
              <span>View / Revoke Override</span>
            </button>
          )}

          <button
            onClick={openClearanceModal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-surface hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 font-mono text-xs font-medium transition-colors shadow-2xs cursor-pointer"
          >
            <ClinicalIcon name="document" size={13} />
            <span>Clearance Certificate</span>
          </button>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-5 text-left sm:text-right border-t sm:border-t-0 sm:border-l border-line pt-3 sm:pt-0 sm:pl-4 w-full sm:w-auto justify-between sm:justify-end">
          <div>
            <span className="font-heading text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {assessment.passed}
              <span className="font-mono text-base font-normal text-zinc-400 dark:text-zinc-500"> / 4</span>
            </span>
            <p className="mt-0.5 font-mono text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
              {t('checksMatched')}
            </p>
          </div>

          <div className="border-l border-line pl-4">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              <ClinicalIcon name="clock" size={12} className="text-zinc-400 dark:text-zinc-500" />
              {ageMinutes < 1 ? t('justNow') : `${ageMinutes}${t('mAgo')}`}
            </span>
            <p className="mt-0.5 font-mono text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
              {t('lastRetrieved')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
