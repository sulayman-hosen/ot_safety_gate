'use client';
import { useEffect, useRef, useState } from 'react';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function EvidenceDialog({ section, data, onClose }) {
  const { t, language } = useApp();
  const dialog = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (section) dialog.current?.showModal();
    else dialog.current?.close();
  }, [section]);

  const evidence =
    section === 'procedure'
      ? { procedures: data?.procedures, diagnoses: data?.conditions }
      : section === 'consent'
      ? { consent: data?.consents, documents: data?.documents, provenance: data?.provenance }
      : section === 'allergy'
      ? { medicationOrders: data?.medications, allergies: data?.allergies }
      : data?.observations;

  const jsonString = JSON.stringify(evidence, null, 2);

  function copyJson() {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby="evidence-dialog-title"
      onCancel={onClose}
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto max-h-[85dvh] w-[min(720px,94vw)] overflow-y-auto rounded-2xl border border-line bg-card p-6 text-zinc-900 dark:text-zinc-100 shadow-2xl backdrop:bg-black/60 sm:p-7"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">ORBIT / EVIDENCE INSPECTOR</p>
          <h2 id="evidence-dialog-title" className="mt-1 text-xl font-bold tracking-tight sm:text-2xl text-zinc-900 dark:text-zinc-100">
            {section === 'help'
              ? (language === 'bn' ? 'আপনার EHR সংযুক্ত করুন' : 'Connect your EHR')
              : t('sourceEvidence')}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-zinc-400 hover:bg-surface hover:text-zinc-900 dark:hover:text-zinc-100"
          aria-label={t('closeDialog')}
        >
          <ClinicalIcon name="close" size={17} />
        </button>
      </div>

      {section === 'help' ? (
        <div className="space-y-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
          <p className="text-zinc-900 dark:text-zinc-100 font-semibold">
            {language === 'bn'
              ? '৫টি সিন্থেটিক ক্লিনিক্যাল পরিস্থিতি অন্বেষণ করতে ইন্টারেক্টিভ ডেমো খুলুন। প্রকৃত ইএইচআর সংযোগের জন্য আপনার হাসপাতাল অ্যাডমিনের সাথে যোগাযোগ করুন।'
              : 'Open the demo to explore five synthetic scenarios. For an EHR launch, register the app with your EHR administrator.'}
          </p>
          <p>
            {language === 'bn'
              ? 'ইএইচআর স্বয়ংক্রিয়ভাবে রোগী ও ওটি সেশন সরবরাহ করে এবং নিরাপদ অনুমোদন নিয়ন্ত্রণ করে।'
              : 'The EHR supplies the patient and encounter, and controls sign-in and permission prompts. If the patient changes, launch a new session.'}
          </p>
          <div className="pt-1">
            <a
              href="https://launch.smarthealthit.org/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 px-4 py-2 font-mono text-xs font-semibold shadow-xs hover:bg-zinc-800 hover:dark:bg-white transition-colors"
            >
              <span>Open SMART App Launcher</span>
              <ClinicalIcon name="external" size={13} />
            </a>
          </div>
          <p className="rounded-xl border border-line bg-surface p-3.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
            The project includes a setup guide with client registration, MongoDB configuration and EHR embedding instructions.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              Raw FHIR JSON payload from EHR provider:
            </p>
            <button
              onClick={copyJson}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-surface px-2.5 py-1 font-mono text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              <ClinicalIcon name={copied ? 'check' : 'clipboard'} size={12} className="text-zinc-500 dark:text-zinc-400" />
              <span>{copied ? t('copied') : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="max-h-[52dvh] overflow-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-200 shadow-inner">
            {jsonString}
          </pre>
        </>
      )}
    </dialog>
  );
}
