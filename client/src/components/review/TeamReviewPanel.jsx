'use client';
import { TEAM_CONFIRMATIONS } from '@/constants/checklistConstants.js';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import ActionButton from '@/components/ui/ActionButton.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function TeamReviewPanel({ workflow }) {
  const { t } = useApp();
  const { session, canReview, busy, expiredEvidence, confirmedCount, attestations, allChecked, notes, setNotes, setAttestations, saveRecord } = workflow;
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

      {!canReview && (
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-amber-700 dark:text-amber-400 font-medium">
          <ClinicalIcon name="lock" size={14} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>{session.actor.canAttest ? 'Resolve all flagged evidence to enable team review.' : 'A verified, authorized reviewer must attest this checklist.'}</span>
        </p>
      )}

      {expiredEvidence && (
        <p className="mt-4 flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium">
          <ClinicalIcon name="clock" size={14} className="shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Refresh evidence before completing the review.</span>
        </p>
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

      {/* Reviewer identity badge */}
      <div className="my-4 flex items-center gap-2.5 border-y border-line py-3">
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-xs font-bold shadow-2xs">
          <ClinicalIcon name="user" size={14} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">{session.actor.name}</p>
          <p className="mt-0.5 truncate font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
            {session.mode === 'demo' ? 'Synthetic reviewer identity' : session.actor.verified ? 'Identity verified by EHR' : 'View-only EHR session'}
          </p>
        </div>
      </div>

      <ActionButton
        icon="clipboard"
        className="w-full text-xs"
        disabled={busy || !canReview || !allChecked || expiredEvidence}
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

      <p className="mt-3.5 text-center font-mono text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-500">
        {t('timeoutReminder')}
      </p>
    </section>
  );
}
