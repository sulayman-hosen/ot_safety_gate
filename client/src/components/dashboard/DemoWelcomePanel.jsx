'use client';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import ActionButton from '@/components/ui/ActionButton.jsx';
import { useApp } from '@/context/AppContext.jsx';
import { SCENARIO_METADATA } from '@/constants/checklistConstants.js';

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
      <p className="mb-4 font-mono text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase">
        {t('workflowSubtitle')}
      </p>

      {/* Hero Section */}
      <section className="grid gap-8 rounded-2xl border border-line bg-card p-6 sm:p-8 xl:grid-cols-[1.15fr_1fr] xl:gap-12 xl:p-10 shadow-xs">
        <div className="flex flex-col justify-center py-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-mono font-medium text-ink shadow-2xs">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <ClinicalIcon name="shield" size={13} className="text-muted" />
              {t('gateBadge')}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl xl:text-[52px] text-ink leading-[1.12]">
            {t('welcomeHeroTitle')}{' '}
            <span className="block text-muted font-bold">
              {t('welcomeHeroHighlight')}
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
            {t('welcomeHeroLead')}
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
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

          <p className="mt-7 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
            <ClinicalIcon name="lock" size={13} className="text-muted" />
            <span>{t('securityFooter')}</span>
          </p>
        </div>

        {/* Right Hero Surgical Badge Panel (Terminal / Engine Inspector aesthetic) */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-7 text-white shadow-xl">
          {/* Subtle background glow effect */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-emerald-500/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-sky-500/5 blur-3xl" />

          <div>
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-500/70" />
                <span className="size-2.5 rounded-full bg-amber-500/70" />
                <span className="size-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-2 font-mono text-[10px] text-zinc-400 uppercase">GATE://CHECKLIST-ENGINE</span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t('timeoutBadge')}
              </span>
            </div>

            <div className="mt-5">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {t('beforeIncision')}
              </h2>
              <p className="mt-1 whitespace-pre-line text-xs leading-5 text-zinc-400">
                {t('fourChecksSummary')}
              </p>
            </div>

            {/* Checklist Steps */}
            <div className="mt-5 space-y-2">
              {fourChecks.map((label, index) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/60 px-3.5 py-2.5 transition-colors hover:border-zinc-700/80"
                >
                  <span className="font-mono text-xs font-bold text-zinc-500">0{index + 1}</span>
                  <span className="text-xs font-medium text-zinc-200 flex-1">{label}</span>
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 text-[10px] font-mono font-semibold">
                    <ClinicalIcon name="check" size={11} className="text-emerald-400" />
                    READY
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4 font-mono text-[10px] text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              {t('workflowNote')}
            </span>
            <span className="text-zinc-500">FHIR R4 · WHO-SST</span>
          </div>
        </div>
      </section>

      {/* 1-Click Interactive Clinical Scenarios Bar */}
      <section className="mt-6 rounded-2xl border border-line bg-card p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="font-heading text-base font-bold text-ink sm:text-lg">
                Simulate Real-World OT Scenarios (1-Click Launch)
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted">
              Select any synthetic clinical condition below to test safety-gate detection, missing evidence warnings, and emergency protocols:
            </p>
          </div>
          <span className="font-mono text-[10px] font-semibold text-muted rounded-full border border-line px-2.5 py-1">
            5 CLINICAL PRESETS
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Object.values(SCENARIO_METADATA).map(sc => {
            const isRed = sc.badgeColor === 'rose';
            const isAmber = sc.badgeColor === 'amber';
            const isGreen = sc.badgeColor === 'emerald';
            return (
              <button
                key={sc.id}
                type="button"
                disabled={busy}
                onClick={() => onDemo(sc.id)}
                className="group relative flex flex-col justify-between rounded-xl border border-line bg-surface p-3.5 text-left transition-all hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xs disabled:opacity-50"
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-mono text-[9px] font-bold text-muted uppercase">CASE {sc.id}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-tight ${
                        isGreen
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : isRed
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {sc.badge}
                    </span>
                  </div>
                  <h3 className="mt-2 text-xs font-bold text-ink group-hover:underline line-clamp-1">
                    {sc.title}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] text-muted line-clamp-2">
                    {sc.procedure}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-line/60 flex items-center justify-between font-mono text-[10px] text-muted">
                  <span className="group-hover:text-ink font-semibold">Launch case →</span>
                  <ClinicalIcon name="arrow" size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3 Features Grid */}
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {features.map(([icon, title, description]) => (
          <article
            key={title}
            className="rounded-xl border border-line bg-card p-5 shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="grid size-9 place-items-center rounded-lg bg-surface border border-line text-ink">
              <ClinicalIcon name={icon} size={18} />
            </div>
            <h3 className="mt-3.5 text-sm font-bold text-ink tracking-tight">{title}</h3>
            <p className="mt-1.5 text-xs leading-5 text-muted">{description}</p>
          </article>
        ))}
      </section>

      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted">
        <ClinicalIcon name="info" size={14} className="mt-0.5 shrink-0 text-muted" />
        <span>{t('demoDisclaimer')}</span>
      </p>
    </>
  );
}
