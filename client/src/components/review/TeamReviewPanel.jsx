'use client';
import { TEAM_CONFIRMATIONS } from '@/constants/checklistConstants.js';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import ActionButton from '@/components/ui/ActionButton.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function TeamReviewPanel({ workflow }) {
  const { t, activeRole, openClearanceModal } = useApp();
  const {
    session,
    canReview,
    busy,
    expiredEvidence,
    confirmedCount,
    attestations,
    allChecked,
    notes,
    setNotes,
    setAttestations,
    saveRecord,
    emergencyOverride
  } = workflow;
  const progressWidths = ['w-0', 'w-1/4', 'w-1/2', 'w-3/4', 'w-full'];

  const translatedConfirmations = {
    identity: {
      title: t('confirmIdentityTitle'),
      desc: t('confirmIdentityDesc')
    },
    consent: {
      title: t('confirmConsentTitle'),
      desc: t('confirmConsentDesc')
    },
    allergies: {
      title: t('confirmAllergiesTitle'),
      desc: t('confirmAllergiesDesc')
    },
    labs: {
      title: t('confirmLabsTitle'),
      desc: t('confirmLabsDesc')
    }
  };

  const isRoleAuthorized = activeRole.canAttest;

  return (
    <section className="rounded-xl border border-line bg-card p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow" id="team-review">
      <div className="flex items-center gap-2.5">
        <div className="grid size-8 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs">
          <ClinicalIcon name="clipboard" size={16} />
        </div>
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{t('teamReview')}</h2>
        <span className="ml-auto rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
          {confirmedCount}/4
        </span>
      </div>

      <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {t('teamReviewDesc')}
      </p>

      {/* Progress Bar */}
      <div className="my-4 h-1.5 overflow-hidden rounded-full bg-surface border border-line" aria-hidden="true">
        <div className={`h-full rounded-full bg-emerald-500 transition-all duration-300 ${progressWidths[confirmedCount]}`} />
      </div>

      {/* Confirmations Fieldset */}
      <fieldset disabled={!canReview || busy || expiredEvidence} className="space-y-2 disabled:opacity-50">
        <legend className="sr-only">Team review confirmations</legend>
        {TEAM_CONFIRMATIONS.map(([id, title, description]) => {
          const item = translatedConfirmations[id] || { title, desc: description };
          return (
            <label
              key={id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                attestations[id]
                  ? 'border-emerald-500/40 bg-emerald-500/5 shadow-2xs'
                  : 'border-line hover:border-zinc-300 dark:hover:border-zinc-700 bg-card'
              }`}
            >
              <input
                type="checkbox"
                checked={attestations[id]}
                className="mt-0.5 size-4 shrink-0 accent-emerald-600 cursor-pointer"
                onChange={event => setAttestations(previous => ({ ...previous, [id]: event.target.checked }))}
              />
              <span className="flex-1">
                <span className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{item.desc}</span>
              </span>
            </label>
          );
        })}
      </fieldset>

      {!canReview && !emergencyOverride && (
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-amber-700 dark:text-amber-400 font-medium">
          <ClinicalIcon name="lock" size={14} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Resolve all flagged evidence or apply an Emergency Clinical Override to enable attestation.</span>
        </p>
      )}

      {expiredEvidence && (
        <p className="mt-4 flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium">
          <ClinicalIcon name="clock" size={14} className="shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Refresh evidence before completing the review.</span>
        </p>
      )}

      {/* Emergency Override Active Notice */}
      {emergencyOverride && (
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 font-mono text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-1.5 font-bold">
            <ClinicalIcon name="warning" size={13} className="text-amber-600" />
            <span>EMERGENCY OVERRIDE ACTIVE</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-zinc-700 dark:text-zinc-300">
            {emergencyOverride.reason}
          </p>
        </div>
      )}

      {/* Team notes input */}
      <label htmlFor="team-notes" className="mt-5 mb-1.5 flex justify-between text-xs font-semibold text-zinc-800 dark:text-zinc-200">
        <span>{t('teamNote')}</span>
        <span className="font-normal text-zinc-400 dark:text-zinc-500">{t('optional')}</span>
      </label>
      <textarea
        id="team-notes"
        maxLength={4000}
        rows={3}
        disabled={busy}
        value={notes}
        onChange={event => setNotes(event.target.value)}
        placeholder={t('notePlaceholder')}
        className="w-full resize-y rounded-lg border border-line bg-surface p-2.5 text-xs text-zinc-900 dark:text-zinc-100 leading-relaxed placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none"
      />

      {/* Active Clinical Practitioner identity badge */}
      <div className="my-4 flex items-center gap-2.5 border-y border-line py-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-xs font-bold shadow-2xs">
          <ClinicalIcon name={activeRole.icon} size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">{activeRole.name}</p>
            <span className="rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.2 font-mono text-[9px] font-bold text-zinc-600 dark:text-zinc-400">
              {activeRole.badge}
            </span>
          </div>
          <p className="mt-0.5 truncate font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
            {activeRole.role} · {activeRole.specialty}
          </p>
        </div>
      </div>

      {!isRoleAuthorized && (
        <p className="mb-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 font-mono text-[10px] text-amber-800 dark:text-amber-300">
          ℹ️ {activeRole.role} may confirm check steps. Final time-out legal record requires Lead Surgeon or Anesthesiologist.
        </p>
      )}

      <ActionButton
        icon="clipboard"
        className="w-full text-xs"
        disabled={busy || !canReview || !allChecked || expiredEvidence || !isRoleAuthorized}
        onClick={() => saveRecord(false)}
      >
        {t('recordChecklist')}
      </ActionButton>

      <ActionButton
        variant="secondary"
        icon="document"
        className="mt-2 w-full text-xs"
        disabled={busy}
        onClick={() => saveRecord(true)}
      >
        {t('saveDraft')}
      </ActionButton>

      <button
        type="button"
        onClick={openClearanceModal}
        className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-surface hover:bg-zinc-100 dark:hover:bg-zinc-800 py-2 font-mono text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors shadow-2xs cursor-pointer"
      >
        <ClinicalIcon name="document" size={13} />
        <span>Preview Pre-Op Clearance Certificate</span>
      </button>

      <p className="mt-3.5 text-center font-mono text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-500">
        {t('timeoutReminder')}
      </p>
    </section>
  );
}
