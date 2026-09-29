'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import { KEY_TERMS_DATA } from '@/constants/keyTermsData.js';
import { useApp } from '@/context/AppContext.jsx';

export default function KeyTermsDialog() {
  const { keyTermsOpen, selectedTermId, closeKeyTerms, language, setLanguage, t } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (keyTermsOpen) {
      dialogRef.current?.showModal();
      if (selectedTermId) {
        setTimeout(() => {
          document.getElementById(`term-${selectedTermId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    } else {
      dialogRef.current?.close();
      setSearch('');
      setSelectedCategory('all');
    }
  }, [keyTermsOpen, selectedTermId]);

  const categories = useMemo(() => {
    const list = new Set();
    KEY_TERMS_DATA.forEach(item => list.add(language === 'bn' ? item.categoryBn : item.category));
    return ['all', ...Array.from(list)];
  }, [language]);

  const filteredTerms = useMemo(() => {
    return KEY_TERMS_DATA.filter(item => {
      const cat = language === 'bn' ? item.categoryBn : item.category;
      if (selectedCategory !== 'all' && cat !== selectedCategory) return false;
      if (!search.trim()) return true;
      const query = search.toLowerCase();
      return (
        item.acronym.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.titleBn.toLowerCase().includes(query) ||
        item.simpleExplanationEn.toLowerCase().includes(query) ||
        item.simpleExplanationBn.toLowerCase().includes(query) ||
        item.otImpactEn.toLowerCase().includes(query) ||
        item.otImpactBn.toLowerCase().includes(query)
      );
    });
  }, [search, selectedCategory, language]);

  function handleCopy(item) {
    const textToCopy = `${item.acronym} (${language === 'bn' ? item.titleBn : item.title})\n${language === 'bn' ? item.simpleExplanationBn : item.simpleExplanationEn}\n${language === 'bn' ? item.otImpactBn : item.otImpactEn}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (!keyTermsOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={closeKeyTerms}
      onClick={event => { if (event.target === event.currentTarget) closeKeyTerms(); }}
      aria-labelledby="key-terms-title"
      className="m-auto max-h-[88dvh] w-[min(940px,94vw)] overflow-hidden rounded-2xl border border-line bg-card text-zinc-900 dark:text-zinc-100 shadow-2xl backdrop:bg-black/60"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-surface p-5 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-800 dark:border-zinc-700 shadow-xs">
            <ClinicalIcon name="book" size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-zinc-200/80 dark:bg-zinc-800 border border-zinc-300/60 dark:border-zinc-700 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                HEALTH IT STANDARDS
              </span>
              <span className="font-mono text-[11px] font-medium text-zinc-500 dark:text-zinc-400">11 Key Concepts</span>
            </div>
            <h2 id="key-terms-title" className="mt-1 text-lg font-bold sm:text-xl text-zinc-900 dark:text-zinc-100 tracking-tight">
              {t('keyTermsModalTitle')}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Switcher inside modal */}
          <div className="flex items-center rounded-lg border border-line bg-card p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-md px-2.5 py-1 transition-colors ${language === 'en' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 hover:dark:text-zinc-100'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('bn')}
              className={`rounded-md px-2.5 py-1 transition-colors ${language === 'bn' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 hover:dark:text-zinc-100'}`}
            >
              বাংলা
            </button>
          </div>

          <button
            onClick={closeKeyTerms}
            className="rounded-lg border border-line bg-card p-2 text-zinc-500 dark:text-zinc-400 hover:bg-surface hover:text-zinc-900 dark:hover:text-zinc-100"
            aria-label="Close"
          >
            <ClinicalIcon name="close" size={16} />
          </button>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="border-b border-line bg-card p-4 sm:px-7">
        <div className="relative mb-3">
          <ClinicalIcon name="search" size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('keyTermsSearchPlaceholder')}
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 font-mono text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none"
          />
        </div>

        {/* Filter categories pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-2xs'
                  : 'border border-zinc-200 dark:border-zinc-800 bg-surface text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat === 'all' ? t('allCategories') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Content List */}
      <div className="max-h-[58dvh] space-y-3.5 overflow-y-auto p-5 sm:p-7">
        {filteredTerms.length === 0 ? (
          <div className="py-12 text-center text-zinc-400">
            <ClinicalIcon name="search" size={26} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs">No matching healthcare terms found.</p>
          </div>
        ) : (
          filteredTerms.map(item => {
            const isSelected = selectedTermId === item.id;
            return (
              <article
                key={item.id}
                id={`term-${item.id}`}
                className={`group relative rounded-xl border p-5 transition-all ${
                  isSelected
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900/60 shadow-md ring-1 ring-zinc-900/10 dark:ring-zinc-100/20'
                    : 'border-line bg-card hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-2xs'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid min-w-16 place-items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1.5 font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-2xs">
                      {item.acronym}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 sm:text-base tracking-tight">
                        {language === 'bn' ? item.titleBn : item.title}
                        <span className="ml-2 font-mono text-[11px] font-normal text-zinc-400">({item.acronym})</span>
                      </h3>
                      <span className="mt-1 inline-block rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-surface px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                        {language === 'bn' ? item.categoryBn : item.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-surface px-2.5 py-1 font-mono text-[11px] font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-2xs"
                    title="Copy definition"
                  >
                    <ClinicalIcon name={copiedId === item.id ? 'check' : 'clipboard'} size={12} className="text-zinc-500 dark:text-zinc-400" />
                    <span>{copiedId === item.id ? t('copied') : t('copyTerm')}</span>
                  </button>
                </div>

                {/* Explanation text */}
                <p className="mt-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {language === 'bn' ? item.simpleExplanationBn : item.simpleExplanationEn}
                </p>

                {/* OT Safety Impact */}
                <div className="mt-3.5 rounded-lg border border-line bg-surface p-3">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
                    <ClinicalIcon name="shield" size={12} className="text-emerald-500" />
                    <span>{t('whyOtMatters')}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {language === 'bn' ? item.otImpactBn : item.otImpactEn}
                  </p>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface p-4 text-xs text-zinc-500 dark:text-zinc-400 sm:px-7 font-mono text-[11px]">
        <span className="flex items-center gap-1.5">
          <ClinicalIcon name="info" size={13} className="text-zinc-400 dark:text-zinc-500" />
          <span>Case 02: OT Pre-Surgical Safety Gate Architecture</span>
        </span>
        <button
          onClick={closeKeyTerms}
          className="rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 px-4 py-1.5 text-xs font-semibold shadow-xs hover:bg-zinc-800 hover:dark:bg-white"
        >
          {t('closeDialog')}
        </button>
      </div>
    </dialog>
  );
}
