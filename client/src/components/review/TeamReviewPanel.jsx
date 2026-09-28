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
    <section className="rounded-xl border border-line bg-card p-5 sm:p-6 shadow-sm transition-colors" id="team-review">
      <div className="flex items-center gap-2.5">
        <ClinicalIcon name="clipboard" size={20} className="text-black dark:text-white" />
        <h2 className="text-lg font-bold text-black dark:text-white">{t('teamReview')}</h2>
        <span className="ml-auto rounded-md bg-neutral-200 dark:bg-neutral-800 px-2.5 py-1 text-xs font-bold text-black dark:text-white">
          {confirmedCount}/4
        </span>
      </div>

      <p className="mt-2 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
        {t('teamReviewDesc')}
      </p>

      {/* Progress Bar */}
      <div className="my-4 h-1.5 overflow-hidden rounded-full bg-surface border border-line" aria-hidden="true">
        <div className={`h-full rounded-full bg-black dark:bg-white transition-all duration-300 ${progressWidths[confirmedCount]}`} />
      </div>

      {/* Confirmations Fieldset */}
      <fieldset disabled={!canReview || busy || expiredEvidence} className="space-y-2.5 disabled:opacity-50">
        <legend className="sr-only">Team review confirmations</legend>
        {TEAM_CONFIRMATIONS.map(([id, title, description]) => {
          const item = translatedConfirmations[id] || { title, desc: description };
          return (
            <label
              key={id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                attestations[id]
                  ? 'border-neutral-400 bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800 shadow-sm'
                  : 'border-line hover:border-black dark:hover:border-white bg-card'
              }`}
            >
              <input
                type="checkbox"
                checked={attestations[id]}
                className="mt-0.5 size-4 shrink-0 accent-black dark:accent-white cursor-pointer"
                onChange={event => setAttestations(previous => ({ ...previous, [id]: event.target.checked }))}
              />
              <span className="flex-1">
                <span className="block text-xs font-bold text-black dark:text-white">{item.title}</span>
                <span className="mt-1 block text-xs leading-5 text-neutral-600 dark:text-neutral-400">{item.desc}</span>
              </span>
            </label>
          );
        })}
      </fieldset>

      {!canReview && (
        <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-black dark:text-white font-semibold">
          <ClinicalIcon name="lock" size={15} className="mt-0.5 shrink-0 text-black dark:text-white" />
          <span>{session.actor.canAttest ? 'Resolve all flagged evidence to enable team review.' : 'A verified, authorized reviewer must attest this checklist.'}</span>
        </p>
      )}

      {expiredEvidence && (
        <p className="mt-4 flex items-start gap-2 text-xs text-black dark:text-white font-semibold">
          <ClinicalIcon name="clock" size={15} className="shrink-0 text-black dark:text-white" />
          <span>Refresh evidence before completing the review.</span>
        </p>
      )}

      {/* Team notes input */}
      <label htmlFor="team-notes" className="mt-5 mb-2 flex justify-between text-xs font-semibold text-black dark:text-white">
        <span>{t('teamNote')}</span>
        <span className="font-normal text-neutral-600 dark:text-neutral-400">{t('optional')}</span>
      </label>
      <textarea
        id="team-notes"
        maxLength={4000}
        rows={3}
        disabled={busy}
        value={notes}
        onChange={event => setNotes(event.target.value)}
        placeholder={t('notePlaceholder')}
        className="w-full resize-y rounded-lg border border-line bg-surface p-3 text-xs text-black dark:text-white leading-6 placeholder:text-neutral-400 focus:border-black dark:focus:border-white focus:outline-none"
      />

      {/* Reviewer identity badge */}
      <div className="my-4 flex items-center gap-2.5 border-y border-line py-3.5">
        <span className="grid size-9 place-items-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-bold text-xs shadow-inner">
          <ClinicalIcon name="user" size={16} />
        </span>
        <div>
          <p className="text-xs font-bold text-black dark:text-white">{session.actor.name}</p>
          <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
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

      <p className="mt-4 text-center text-xs leading-5 text-neutral-600 dark:text-neutral-400">
        {t('timeoutReminder')}
      </p>
    </section>
  );
}
