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
      className="m-auto max-h-[85dvh] w-[min(720px,94vw)] overflow-y-auto rounded-2xl border border-line bg-card p-6 text-black dark:text-white shadow-2xl backdrop:bg-black/60 sm:p-8"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[.15em] text-neutral-600 dark:text-neutral-400">ORBIT / REFERENCE</p>
          <h2 id="evidence-dialog-title" className="mt-1 text-2xl font-bold text-black dark:text-white">
            {section === 'help'
              ? (language === 'bn' ? 'আপনার EHR সংযুক্ত করুন' : 'Connect your EHR')
              : t('sourceEvidence')}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-black dark:text-white hover:bg-surface"
          aria-label={t('closeDialog')}
        >
          <ClinicalIcon name="close" size={18} />
        </button>
      </div>

      {section === 'help' ? (
        <div className="space-y-4 text-xs leading-7 text-neutral-600 dark:text-neutral-300">
          <p className="text-black dark:text-white font-bold">
            {language === 'bn'
              ? '৫টি সিন্থেটিক ক্লিনিক্যাল পরিস্থিতি অন্বেষণ করতে ইন্টারেক্টিভ ডেমো খুলুন। প্রকৃত ইএইচআর সংযোগের জন্য আপনার হাসপাতাল অ্যাডমিনের সাথে যোগাযোগ করুন।'
              : 'Open the demo to explore five synthetic scenarios. For an EHR launch, register the app with your EHR administrator.'}
          </p>
          <p>
            {language === 'bn'
              ? 'ইএইচআর স্বয়ংক্রিয়ভাবে রোগী ও ওটি সেশন সরবরাহ করে এবং নিরাপদ অনুমোদন নিয়ন্ত্রণ করে।'
              : 'The EHR supplies the patient and encounter, and controls sign-in and permission prompts. If the patient changes, launch a new session.'}
          </p>
          <div className="pt-2">
            <a
              href="https://launch.smarthealthit.org/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-black dark:border-white bg-neutral-100 dark:bg-neutral-800 px-4 py-2.5 text-xs font-bold text-black dark:text-white hover:bg-black hover:text-white hover:dark:bg-white hover:dark:text-black transition-colors"
            >
              <span>Open SMART App Launcher</span>
              <ClinicalIcon name="external" size={14} />
            </a>
          </div>
          <p className="rounded-xl border border-line bg-surface p-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            The project includes a setup guide with client registration, MongoDB configuration and EHR embedding instructions.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs leading-5 text-neutral-600 dark:text-neutral-400 font-semibold">
              Inspect these FHIR records alongside the original EHR.
            </p>
            <button
              onClick={copyJson}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface px-2.5 py-1 text-xs font-bold text-black dark:text-white hover:border-black dark:hover:border-white"
            >
              <ClinicalIcon name={copied ? 'check' : 'clipboard'} size={13} className="text-black dark:text-white" />
              <span>{copied ? t('copied') : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="max-h-[52dvh] overflow-auto rounded-xl border border-neutral-700 bg-neutral-900 dark:bg-black p-4 font-mono text-xs leading-5 text-white shadow-inner">
            {jsonString}
          </pre>
        </>
      )}
    </dialog>
  );
}
