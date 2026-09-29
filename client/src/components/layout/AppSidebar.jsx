'use client';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function AppSidebar({ open, onClose, onNavigate, onHelp }) {
  const { theme, toggleTheme, language, toggleLanguage, t, openKeyTerms } = useApp();

  const navigation = [
    { id: 'overview', labelKey: 'safetyOverview', icon: 'grid', badge: '01' },
    { id: 'evidence', labelKey: 'clinicalEvidence', icon: 'pulse' },
    { id: 'team-review', labelKey: 'teamReview', icon: 'clipboard' },
    { id: 'activity', labelKey: 'sessionActivity', icon: 'clock' }
  ];

  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-card p-4 transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand logo & title */}
        <a href="/" className="mb-6 mt-1 flex items-center gap-3 px-2 py-1" aria-label="ORBIT home">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-800 dark:border-zinc-700 shadow-xs">
            <ClinicalIcon name="shield" size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-lg font-black tracking-wider text-zinc-900 dark:text-zinc-100">ORBIT</span>
              <span className="rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.2 font-mono text-[9px] font-bold text-zinc-600 dark:text-zinc-400">
                v1.0
              </span>
            </div>
            <span className="block truncate font-mono text-[9px] font-semibold tracking-wider text-zinc-500 dark:text-zinc-400">
              {t('orbitSubtitle')}
            </span>
          </div>
        </a>

        {/* Section title */}
        <p className="mb-2 px-2 font-mono text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
          {t('clinicalWorkspace')}
        </p>

        {/* Navigation items */}
        <nav aria-label="Main navigation" className="space-y-1">
          {navigation.map((item, index) => {
            const active = index === 0;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                  active
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800/90 dark:text-zinc-100 font-semibold border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/70 hover:text-zinc-900 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200 border border-transparent font-medium'
                }`}
              >
                <ClinicalIcon
                  name={item.icon}
                  size={16}
                  className={active ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'}
                />
                <span className="flex-1">{t(item.labelKey)}</span>
                {item.badge && (
                  <span className="rounded bg-zinc-200/80 dark:bg-zinc-700 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Dedicated Key Terms Guide button */}
          <button
            onClick={() => {
              if (onClose) onClose();
              openKeyTerms();
            }}
            className="flex w-full items-center gap-3 rounded-lg border border-transparent px-2.5 py-2 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/70 hover:text-zinc-900 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200 transition-colors"
          >
            <ClinicalIcon name="book" size={16} className="text-zinc-400 dark:text-zinc-500" />
            <span className="flex-1">{t('keyTermsGuide')}</span>
            <span className="rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
              11
            </span>
          </button>
        </nav>

        {/* Bottom controls & info card */}
        <div className="mt-auto space-y-3 pt-4">
          {/* Quick theme & lang toolbar in sidebar */}
          <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-line bg-surface p-1">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-card hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shadow-2xs"
            >
              <ClinicalIcon name="globe" size={13} className="text-zinc-500 dark:text-zinc-400" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-card hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shadow-2xs"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              <ClinicalIcon name={theme === 'dark' ? 'sun' : 'moon'} size={13} className="text-zinc-500 dark:text-zinc-400" />
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          {/* Context Card */}
          <div className="rounded-xl border border-line bg-surface p-3 text-zinc-800 dark:text-zinc-200">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <ClinicalIcon name="lock" size={14} className="text-zinc-500 dark:text-zinc-400" />
              <h3 className="text-xs font-bold">{t('onePatientTitle')}</h3>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              {t('onePatientDesc')}
            </p>
          </div>

          <button
            onClick={onHelp}
            className="flex w-full items-center gap-2 px-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ClinicalIcon name="external" size={13} className="text-zinc-400 dark:text-zinc-500" />
            <span>{t('connectionGuide')}</span>
          </button>

          <div className="flex items-center justify-between border-t border-line pt-3 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
            <span>CASE 02</span>
            <span>SMART · FHIR R4</span>
          </div>
        </div>
      </aside>
    </>
  );
}
