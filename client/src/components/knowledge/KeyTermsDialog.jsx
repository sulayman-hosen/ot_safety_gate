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
      className="m-auto max-h-[88dvh] w-[min(940px,94vw)] overflow-hidden rounded-2xl border border-line bg-card text-black dark:text-white shadow-2xl backdrop:bg-black/60"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-surface p-5 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-black text-white dark:bg-white dark:text-black shadow-sm">
            <ClinicalIcon name="book" size={22} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 font-mono text-[10px] font-bold text-black dark:text-white">
                HEALTH IT STANDARDS
              </span>
              <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">11 Key Concepts</span>
            </div>
            <h2 id="key-terms-title" className="mt-1 text-xl font-bold sm:text-2xl text-black dark:text-white">
              {t('keyTermsModalTitle')}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Switcher inside modal */}
          <div className="flex items-center rounded-lg border border-line bg-card p-0.5 text-xs font-bold">
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-md px-2.5 py-1 transition-colors ${language === 'en' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-600 dark:text-neutral-400 hover:text-black hover:dark:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('bn')}
              className={`rounded-md px-2.5 py-1 transition-colors ${language === 'bn' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-600 dark:text-neutral-400 hover:text-black hover:dark:text-white'}`}
            >
              বাংলা
            </button>
          </div>

          <button
            onClick={closeKeyTerms}
            className="rounded-lg border border-line bg-card p-2 text-black dark:text-white hover:bg-surface"
            aria-label="Close"
          >
            <ClinicalIcon name="close" size={18} />
          </button>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="border-b border-line bg-card p-4 sm:px-7">
        <div className="relative mb-3">
          <ClinicalIcon name="search" size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('keyTermsSearchPlaceholder')}
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-xs text-black dark:text-white font-medium placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:outline-none"
          />
        </div>

        {/* Filter categories pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white hover:bg-neutral-200 hover:dark:bg-neutral-700'
              }`}
            >
              {cat === 'all' ? t('allCategories') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Content List */}
      <div className="max-h-[58dvh] space-y-4 overflow-y-auto p-5 sm:p-7">
        {filteredTerms.length === 0 ? (
          <div className="py-12 text-center text-neutral-500">
            <ClinicalIcon name="search" size={28} className="mx-auto mb-2 opacity-50" />
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
                    ? 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-800 shadow-md ring-2 ring-black/20 dark:ring-white/20'
                    : 'border-line bg-card hover:border-black dark:hover:border-white hover:shadow-sm'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid min-w-16 place-items-center rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1.5 font-mono text-xs font-black text-black dark:text-white">
                      {item.acronym}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-black dark:text-white sm:text-base">
                        {language === 'bn' ? item.titleBn : item.title}
                        <span className="ml-2 font-mono text-[11px] font-normal text-neutral-600 dark:text-neutral-400">({item.acronym})</span>
                      </h3>
                      <span className="mt-1 inline-block rounded-md bg-surface px-2 py-0.5 text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
                        {language === 'bn' ? item.categoryBn : item.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface px-2.5 py-1 text-[11px] font-bold text-black dark:text-white transition-colors hover:border-black dark:hover:border-white"
                    title="Copy definition"
                  >
                    <ClinicalIcon name={copiedId === item.id ? 'check' : 'clipboard'} size={13} className="text-black dark:text-white" />
                    <span>{copiedId === item.id ? t('copied') : t('copyTerm')}</span>
                  </button>
                </div>

                {/* Explanation text */}
                <p className="mt-3.5 text-xs leading-6 text-black dark:text-white">
                  {language === 'bn' ? item.simpleExplanationBn : item.simpleExplanationEn}
                </p>

                {/* OT Safety Impact */}
                <div className="mt-3.5 rounded-lg border border-line bg-surface p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-black dark:text-white">
                    <ClinicalIcon name="shield" size={13} className="text-black dark:text-white" />
                    <span>{t('whyOtMatters')}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-5 text-neutral-600 dark:text-neutral-400">
                    {language === 'bn' ? item.otImpactBn : item.otImpactEn}
                  </p>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface p-4 text-xs text-neutral-600 dark:text-neutral-400 sm:px-7">
        <span className="flex items-center gap-1.5 text-[11px] font-medium">
          <ClinicalIcon name="info" size={13} className="text-black dark:text-white" />
          <span>Case 02: Operating Theater Pre-Surgical Safety Gate Architecture</span>
        </span>
        <button
          onClick={closeKeyTerms}
          className="rounded-lg bg-black text-white dark:bg-white dark:text-black px-4 py-1.5 text-xs font-bold shadow-sm hover:bg-neutral-800 hover:dark:bg-neutral-200"
        >
          {t('closeDialog')}
        </button>
      </div>
    </dialog>
  );
}
