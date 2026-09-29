'use client';
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { TRANSLATIONS } from '@/constants/translations.js';
import { CLINICAL_ROLES } from '@/constants/checklistConstants.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [language, setLanguageState] = useState('en');
  const [keyTermsOpen, setKeyTermsOpen] = useState(false);
  const [selectedTermId, setSelectedTermId] = useState(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [clearanceModalOpen, setClearanceModalOpen] = useState(false);
  const [activeRoleId, setActiveRoleId] = useState('surgeon');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Theme initialization
    try {
      const savedTheme = localStorage.getItem('orbit_theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      setTheme(initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // fallback
    }

    // 2. Language initialization
    try {
      const savedLang = localStorage.getItem('orbit_language');
      if (savedLang === 'bn' || savedLang === 'en') {
        setLanguageState(savedLang);
      }
    } catch {
      // fallback
    }

    // 3. Role initialization
    try {
      const savedRole = localStorage.getItem('orbit_role');
      if (savedRole && CLINICAL_ROLES.some(r => r.id === savedRole)) {
        setActiveRoleId(savedRole);
      }
    } catch {
      // fallback
    }

    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('orbit_theme', nextTheme);
    } catch {}
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'bn') return;
    setLanguageState(lang);
    try {
      localStorage.setItem('orbit_language', lang);
    } catch {}
  }

  function toggleLanguage() {
    setLanguage(language === 'en' ? 'bn' : 'en');
  }

  function setActiveRole(roleId) {
    if (!CLINICAL_ROLES.some(r => r.id === roleId)) return;
    setActiveRoleId(roleId);
    try {
      localStorage.setItem('orbit_role', roleId);
    } catch {}
  }

  function t(key, fallback = '') {
    return TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en?.[key] ?? fallback ?? key;
  }

  function openKeyTerms(termId = null) {
    setSelectedTermId(termId);
    setKeyTermsOpen(true);
  }

  function closeKeyTerms() {
    setKeyTermsOpen(false);
    setSelectedTermId(null);
  }

  function openEmergencyModal() {
    setEmergencyModalOpen(true);
  }

  function closeEmergencyModal() {
    setEmergencyModalOpen(false);
  }

  function openClearanceModal() {
    setClearanceModalOpen(true);
  }

  function closeClearanceModal() {
    setClearanceModalOpen(false);
  }

  const activeRole = useMemo(() => {
    return CLINICAL_ROLES.find(r => r.id === activeRoleId) || CLINICAL_ROLES[0];
  }, [activeRoleId]);

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    language,
    setLanguage,
    toggleLanguage,
    t,
    keyTermsOpen,
    selectedTermId,
    openKeyTerms,
    closeKeyTerms,
    emergencyModalOpen,
    openEmergencyModal,
    closeEmergencyModal,
    clearanceModalOpen,
    openClearanceModal,
    closeClearanceModal,
    activeRole,
    activeRoleId,
    setActiveRole,
    clinicalRoles: CLINICAL_ROLES,
    mounted
  }), [
    theme,
    language,
    keyTermsOpen,
    selectedTermId,
    emergencyModalOpen,
    clearanceModalOpen,
    activeRole,
    activeRoleId,
    mounted
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
