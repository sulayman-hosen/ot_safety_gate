'use client';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function WorkspaceHeader({ session, onToggleNavigation }) {
  const { theme, toggleTheme, language, toggleLanguage, t, openKeyTerms, activeRole, setActiveRole, clinicalRoles } = useApp();

  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-line bg-card/80 px-4 backdrop-blur-xs sm:px-8">
      {/* Left section: mobile hamburger & breadcrumbs */}
      <div className="flex min-w-0 items-center gap-2 text-xs sm:gap-2.5">
        <button
          onClick={onToggleNavigation}
          className="rounded-lg p-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-surface hover:text-zinc-900 dark:hover:text-zinc-100 lg:hidden"
          aria-label="Toggle navigation"
        >
          <ClinicalIcon name="menu" size={18} />
        </button>
        <span className="hidden font-medium text-zinc-500 dark:text-zinc-400 sm:inline">{t('operatingTheater')}</span>
        <ClinicalIcon name="chevron" size={11} className="hidden text-zinc-400 dark:text-zinc-600 sm:block" />
        <span className="truncate font-semibold text-zinc-900 dark:text-zinc-100">{t('preSurgicalChecklist')}</span>
      </div>

      {/* Right section: Role Switcher, Key Terms, Lang switch, Theme toggle, Status & User */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Clinical Role Switcher (Surgeon / Anesthesia / Nurse) */}
        <div className="inline-flex items-center">
          <label htmlFor="header-role-select" className="sr-only">Clinical Role</label>
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-surface px-2.5 py-1 text-xs shadow-2xs">
            <ClinicalIcon name={activeRole.icon} size={13} className="text-zinc-500 dark:text-zinc-400" />
            <select
              id="header-role-select"
              value={activeRole.id}
              onChange={e => setActiveRole(e.target.value)}
              className="bg-transparent font-mono text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
              title="Switch clinical practitioner perspective"
            >
              {clinicalRoles.map(r => (
                <option key={r.id} value={r.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                  {r.badge} · {r.name.split(',')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Terms Guide quick button */}
        <button
          onClick={() => openKeyTerms()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-surface px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-2xs cursor-pointer"
          title={t('keyTermsGuide')}
        >
          <ClinicalIcon name="book" size={14} className="text-zinc-500 dark:text-zinc-400" />
          <span className="hidden sm:inline">{t('keyTermsGuide')}</span>
          <span className="rounded bg-zinc-200/80 dark:bg-zinc-800 border border-zinc-300/60 dark:border-zinc-700 px-1.5 py-0.2 font-mono text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
            11
          </span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-surface px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-2xs cursor-pointer"
          title={t('languageToggle')}
          aria-label={t('languageToggle')}
        >
          <ClinicalIcon name="globe" size={13} className="text-zinc-500 dark:text-zinc-400" />
          <span className="font-semibold">{language === 'en' ? 'বাংলা' : 'EN'}</span>
        </button>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="grid size-8 place-items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-surface text-zinc-600 dark:text-zinc-300 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-2xs cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={t('themeToggle')}
        >
          <ClinicalIcon name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
        </button>

        {/* Session Status indicator */}
        <div className="hidden items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-surface px-2.5 py-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 min-[900px]:inline-flex shadow-2xs">
          <span className={`size-1.5 rounded-full ${session ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
          <span className="font-mono text-[11px]">
            {session ? (session.mode === 'demo' ? t('syntheticDemo') : t('ehrConnected')) : t('awaitingLaunch')}
          </span>
        </div>

        {/* Reviewer Avatar */}
        <span
          className="grid size-8 shrink-0 place-items-center rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-2xs"
          title={`${activeRole.name} (${activeRole.role})`}
        >
          {activeRole.initials}
        </span>
      </div>
    </header>
  );
}
