'use client';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function WorkspaceHeader({ session, onToggleNavigation }) {
  const { theme, toggleTheme, language, toggleLanguage, t, openKeyTerms } = useApp();
  const initials = session?.actor.name.split(' ').slice(0, 2).map(part => part[0]).join('') || 'OT';

  return (
    <header className="flex h-[72px] items-center justify-between gap-3 border-b border-line bg-card px-4 sm:px-8">
      {/* Left section: mobile hamburger & breadcrumbs */}
      <div className="flex min-w-0 items-center gap-2 text-xs sm:gap-3">
        <button
          onClick={onToggleNavigation}
          className="rounded-lg p-2 text-black dark:text-white hover:bg-surface lg:hidden"
          aria-label="Toggle navigation"
        >
          <ClinicalIcon name="menu" />
        </button>
        <span className="hidden font-medium text-neutral-600 dark:text-neutral-400 sm:inline">{t('operatingTheater')}</span>
        <ClinicalIcon name="chevron" size={12} className="hidden text-neutral-500 sm:block" />
        <span className="truncate font-bold text-black dark:text-white">{t('preSurgicalChecklist')}</span>
      </div>

      {/* Right section: Key Terms, Lang switch, Theme toggle, Status & User initials */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Key Terms Guide quick button */}
        <button
          onClick={() => openKeyTerms()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface px-2.5 py-1.5 text-xs font-bold text-black dark:text-white transition-colors hover:border-black dark:hover:border-white"
          title={t('keyTermsGuide')}
        >
          <ClinicalIcon name="book" size={15} className="text-black dark:text-white" />
          <span className="hidden sm:inline">{t('keyTermsGuide')}</span>
          <span className="rounded bg-black text-white dark:bg-white dark:text-black px-1.5 py-0.2 font-mono text-[10px] font-bold">11</span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface px-2.5 py-1.5 text-xs font-bold text-black dark:text-white transition-colors hover:border-black dark:hover:border-white"
          title={t('languageToggle')}
          aria-label={t('languageToggle')}
        >
          <ClinicalIcon name="globe" size={14} className="text-black dark:text-white" />
          <span className="font-bold">{language === 'en' ? 'বাংলা' : 'EN'}</span>
        </button>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="grid size-9 place-items-center rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface text-black dark:text-white transition-colors hover:border-black dark:hover:border-white"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={t('themeToggle')}
        >
          <ClinicalIcon name={theme === 'dark' ? 'sun' : 'moon'} size={17} className="text-black dark:text-white" />
        </button>

        {/* Session Status indicator */}
        <div className="hidden items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-surface px-2.5 py-1 text-[11px] text-black dark:text-white min-[540px]:inline-flex">
          <span className={`size-2 rounded-full ${session ? 'bg-black dark:bg-white' : 'bg-neutral-400 animate-pulse'}`} />
          <span className="font-bold">
            {session ? (session.mode === 'demo' ? t('syntheticDemo') : t('ehrConnected')) : t('awaitingLaunch')}
          </span>
        </div>

        {/* Reviewer Avatar */}
        <span
          className="grid size-9 shrink-0 place-items-center rounded-full border border-neutral-300 dark:border-neutral-700 bg-surface text-xs font-black text-black dark:text-white shadow-sm"
          title={session?.actor?.name || 'Reviewer'}
        >
          {initials}
        </span>
      </div>
    </header>
  );
}
