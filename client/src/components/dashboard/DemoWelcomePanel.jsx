'use client';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import ActionButton from '@/components/ui/ActionButton.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function DemoWelcomePanel({ demoEnabled, busy, onDemo, onHelp }) {
  const { t, openKeyTerms } = useApp();

  const features = [
    ['fingerprint', t('feat1Title'), t('feat1Desc')],
    ['pulse', t('feat2Title'), t('feat2Desc')],
    ['document', t('feat3Title'), t('feat3Desc')]
  ];

  const fourChecks = [
    t('check1Title'),
    t('check2Title'),
    t('check3Title'),
    t('check4Title')
  ];

  return (
    <>
      <p className="mb-6 text-[10px] font-bold tracking-[.18em] text-neutral-600 dark:text-neutral-400">
        {t('workflowSubtitle')}
      </p>

      {/* Hero Section */}
      <section className="grid gap-8 rounded-2xl border border-line bg-card p-6 sm:p-10 xl:grid-cols-[1.15fr_1fr] xl:gap-14 xl:p-12 shadow-sm">
        <div className="py-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 text-[10px] font-bold tracking-wider text-black dark:text-white">
            <ClinicalIcon name="shield" size={14} className="text-black dark:text-white" />
            {t('gateBadge')}
          </span>

          <h1 className="mt-6 text-4xl leading-[1.15] font-extrabold tracking-tight sm:text-5xl xl:text-[54px] text-black dark:text-white">
            {t('welcomeHeroTitle')}<br />
            <span className="text-black dark:text-white underline decoration-2 underline-offset-8">{t('welcomeHeroHighlight')}</span>
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            {t('welcomeHeroLead')}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {demoEnabled && (
              <ActionButton icon="arrow" busy={busy} disabled={busy} onClick={onDemo}>
                {t('openDemo')}
              </ActionButton>
            )}
            <ActionButton variant="secondary" icon="external" onClick={onHelp}>
              {t('connectEhr')}
            </ActionButton>
            <ActionButton variant="secondary" icon="book" onClick={() => openKeyTerms()}>
              {t('learnStandards')}
            </ActionButton>
          </div>

          <p className="mt-7 flex items-center gap-2 text-[11px] leading-5 text-neutral-600 dark:text-neutral-400">
            <ClinicalIcon name="lock" size={14} className="text-black dark:text-white" />
            {t('securityFooter')}
          </p>
        </div>

        {/* Right Hero Surgical Badge Panel */}
        <div className="relative overflow-hidden rounded-2xl bg-black dark:bg-neutral-900 border border-neutral-800 p-7 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -right-28 -top-28 size-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full border border-white/10" />

          <div className="relative flex items-center justify-between">
            <span className="grid size-13 place-items-center rounded-xl border border-white/20 bg-white/10 text-white">
              <ClinicalIcon name="shield" size={30} />
            </span>
            <span className="rounded-full border border-white/20 px-2.5 py-1 text-[9px] font-bold tracking-[.16em] text-white">
              {t('timeoutBadge')}
            </span>
          </div>

          <h2 className="relative mt-6 text-2xl font-bold text-white">
            {t('beforeIncision')}
          </h2>

          <p className="mt-2 whitespace-pre-line text-xs leading-6 text-neutral-300">
            {t('fourChecksSummary')}
          </p>

          <div className="mt-6 divide-y divide-white/15 border-y border-white/15">
            {fourChecks.map((label, index) => (
              <div key={label} className="flex items-center gap-3 py-3">
                <span className="font-mono text-[11px] text-neutral-400">0{index + 1}</span>
                <span className="text-xs font-semibold text-white">{label}</span>
                <ClinicalIcon name="check" size={16} className="ml-auto text-white" />
              </div>
            ))}
          </div>

          <p className="mt-5 flex items-center gap-2 text-[10px] text-neutral-300">
            <span className="size-2 rounded-full bg-white animate-pulse" />
            {t('workflowNote')}
          </p>
        </div>
      </section>

      {/* 3 Features Grid */}
      <section className="mt-7 grid gap-5 md:grid-cols-3">
        {features.map(([icon, title, description]) => (
          <article key={title} className="rounded-xl border border-line bg-card p-6 shadow-sm">
            <ClinicalIcon name={icon} size={22} className="text-black dark:text-white" />
            <h3 className="mt-4 text-base font-bold text-black dark:text-white">{title}</h3>
            <p className="mt-2 text-xs leading-6 text-neutral-600 dark:text-neutral-400">{description}</p>
          </article>
        ))}
      </section>

      <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
        <ClinicalIcon name="info" size={16} className="mt-0.5 text-black dark:text-white" />
        {t('demoDisclaimer')}
      </p>
    </>
  );
}
