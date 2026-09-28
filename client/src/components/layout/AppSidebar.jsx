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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-card p-5 transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand logo & title */}
        <a href="/" className="mb-8 mt-2 flex items-center gap-3 px-1" aria-label="ORBIT home">
          <span className="grid size-11 place-items-center rounded-xl bg-black text-white dark:bg-white dark:text-black shadow-md">
            <ClinicalIcon name="shield" size={26} />
          </span>
          <div>
            <span className="font-heading text-2xl font-black tracking-[.12em] text-black dark:text-white">ORBIT</span>
            <span className="block text-[9px] font-bold tracking-[.22em] text-neutral-600 dark:text-neutral-400">
              {t('orbitSubtitle')}
            </span>
          </div>
        </a>

        {/* Section title */}
        <p className="mb-3 px-3 text-[10px] font-bold tracking-[.14em] text-neutral-600 dark:text-neutral-400">
          {t('clinicalWorkspace')}
        </p>

        {/* Navigation items */}
        <nav aria-label="Main navigation" className="space-y-1">
          {navigation.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                index === 0
                  ? 'bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-surface hover:text-black hover:dark:text-white'
              }`}
            >
              <ClinicalIcon name={item.icon} size={18} className="text-black dark:text-white" />
              <span className="flex-1">{t(item.labelKey)}</span>
              {item.badge && <span className="text-[10px] opacity-75">{item.badge}</span>}
            </button>
          ))}

          {/* Dedicated Key Terms Guide button */}
          <button
            onClick={() => {
              if (onClose) onClose();
              openKeyTerms();
            }}
            className="flex w-full items-center gap-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-3 py-2.5 text-left text-xs font-bold text-black dark:text-white transition-all hover:bg-neutral-200 hover:dark:bg-neutral-700 hover:shadow-sm"
          >
            <ClinicalIcon name="book" size={18} className="text-black dark:text-white" />
            <span className="flex-1">{t('keyTermsGuide')}</span>
            <span className="rounded-full bg-black text-white dark:bg-white dark:text-black px-1.5 py-0.5 text-[9px] font-bold">11</span>
          </button>
        </nav>

        {/* Bottom controls & info card */}
        <div className="mt-auto space-y-4 pt-6">
          {/* Quick theme & lang toolbar in sidebar */}
          <div className="flex items-center justify-between rounded-xl border border-line bg-surface p-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-black dark:text-white hover:bg-card"
            >
              <ClinicalIcon name="globe" size={14} className="text-black dark:text-white" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-black dark:text-white hover:bg-card"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              <ClinicalIcon name={theme === 'dark' ? 'sun' : 'moon'} size={15} className="text-black dark:text-white" />
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          {/* Context Card */}
          <div className="rounded-xl border border-line bg-surface p-3.5 text-black dark:text-white">
            <ClinicalIcon name="lock" size={18} className="text-black dark:text-white" />
            <h3 className="mt-2 text-xs font-bold text-black dark:text-white">{t('onePatientTitle')}</h3>
            <p className="mt-1 text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-400">
              {t('onePatientDesc')}
            </p>
          </div>

          <button
            onClick={onHelp}
            className="flex w-full items-center gap-2 px-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black hover:dark:text-white"
          >
            <ClinicalIcon name="external" size={15} className="text-black dark:text-white" />
            <span>{t('connectionGuide')}</span>
          </button>

          <div className="flex items-center justify-between border-t border-line pt-4 text-[10px] font-bold tracking-wider text-neutral-600 dark:text-neutral-400">
            <span>CASE 02</span>
            <span>SMART · FHIR R4</span>
          </div>
        </div>
      </aside>
    </>
  );
}
