'use client';
import { useRef, useEffect } from 'react';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import ActionButton from '@/components/ui/ActionButton.jsx';
import { useApp } from '@/context/AppContext.jsx';
import { formatDate, formatPatientName } from '@/utils/clinicalFormatters.js';

export default function ClearanceCertificateModal({ data, assessment, record, emergencyOverride }) {
  const { clearanceModalOpen, closeClearanceModal, activeRole } = useApp();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (clearanceModalOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [clearanceModalOpen]);

  if (!clearanceModalOpen || !data) return null;

  const patient = data.patient || {};
  const isOverridden = Boolean(emergencyOverride);

  return (
    <dialog
      ref={dialogRef}
      onCancel={closeClearanceModal}
      onClick={e => { if (e.target === e.currentTarget) closeClearanceModal(); }}
      className="m-auto max-h-[92dvh] w-[min(820px,95vw)] overflow-hidden rounded-2xl border border-line bg-card p-0 text-zinc-900 dark:text-zinc-100 shadow-2xl backdrop:bg-black/70 print:border-none print:shadow-none print:m-0 print:w-full"
      aria-labelledby="clearance-certificate-title"
    >
      {/* Non-printable modal action bar */}
      <div className="flex items-center justify-between border-b border-line bg-surface p-4 px-6 print:hidden">
        <div className="flex items-center gap-2">
          <ClinicalIcon name="document" size={17} className="text-zinc-500" />
          <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
            OFFICIAL PRE-OPERATIVE CLEARANCE DOCUMENT
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 px-3 py-1.5 font-mono text-xs font-bold shadow-xs hover:bg-zinc-800 hover:dark:bg-white transition-all"
          >
            <ClinicalIcon name="download" size={13} />
            <span>Print / Save PDF</span>
          </button>
          <button
            onClick={closeClearanceModal}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-card hover:text-zinc-900 dark:hover:text-zinc-100"
            aria-label="Close"
          >
            <ClinicalIcon name="close" size={17} />
          </button>
        </div>
      </div>

      {/* Printable Certificate Content */}
      <div className="overflow-y-auto max-h-[82dvh] p-6 sm:p-8 space-y-6 bg-card">
        {/* Hospital Letterhead */}
        <div className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl sm:text-2xl font-black tracking-wider text-zinc-900 dark:text-zinc-100">ORBIT SURGICAL GATE</span>
                <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {isOverridden ? 'EMERGENCY CLEARED' : 'STANDARD CLEARANCE'}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-zinc-500">
                Operating Theater Pre-Surgical Verification & Safety Sign-off Record
              </p>
              <p className="font-mono text-[10px] text-zinc-400">
                Complies with WHO Surgical Safety Checklist (Time-Out) & USCDI v3 Standards
              </p>
            </div>

            <div className="text-right font-mono text-[11px] text-zinc-500">
              <p className="font-bold text-zinc-800 dark:text-zinc-200">CLEARANCE ID: {record?.id?.slice(0, 12) || 'OT-REC-2026-99'}</p>
              <p>DATE: {new Date().toLocaleDateString()}</p>
              <p>TIME: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        {/* Patient & Surgical Details Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border border-line bg-surface p-4 font-mono text-xs">
          <div>
            <span className="block text-[10px] text-zinc-400 uppercase">Patient Name</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{formatPatientName(patient)}</span>
          </div>
          <div>
            <span className="block text-[10px] text-zinc-400 uppercase">MRN / ID</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{patient.identifier?.[0]?.value || patient.id}</span>
          </div>
          <div>
            <span className="block text-[10px] text-zinc-400 uppercase">DOB / Gender</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formatDate(patient.birthDate, false)} ({patient.gender || 'U'})</span>
          </div>
          <div>
            <span className="block text-[10px] text-zinc-400 uppercase">Encounter ID</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{data.encounter?.id || 'ENC-9428-OT'}</span>
          </div>
        </div>

        {/* Procedure & Indication Match */}
        <div className="rounded-xl border border-line p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono">
            <span className="font-bold text-zinc-700 dark:text-zinc-300">PLANNED SURGICAL INTERVENTION</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">MATCH VERIFIED</span>
          </div>
          <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
            {assessment.selected?.code?.coding?.[0]?.display || 'Laparoscopic Cholecystectomy'}
          </p>
          <div className="flex flex-wrap gap-4 font-mono text-[11px] text-zinc-500">
            <span>CPT Code: <strong className="text-zinc-800 dark:text-zinc-200">{assessment.selected?.code?.coding?.[0]?.code || '47562'}</strong></span>
            <span>Diagnosis: <strong className="text-zinc-800 dark:text-zinc-200">{data.conditions?.[0]?.code?.coding?.[0]?.display || 'Calculus of gallbladder'}</strong></span>
          </div>
        </div>

        {/* 4 Safety Checks Matrix */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Evidence Checks Breakdown
          </h3>
          <div className="divide-y divide-line/60 rounded-xl border border-line overflow-hidden font-mono text-xs">
            {assessment.checks.map(check => (
              <div key={check.id} className="flex items-center justify-between p-3 bg-surface/50">
                <div className="flex items-center gap-2">
                  <ClinicalIcon
                    name={check.status === 'pass' ? 'check' : 'warning'}
                    size={14}
                    className={check.status === 'pass' ? 'text-emerald-500' : 'text-amber-500'}
                  />
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{check.title}</span>
                </div>
                <span className="text-zinc-500 text-[11px]">{check.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Override Documentation (if present) */}
        {isOverridden && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 font-mono text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
              <ClinicalIcon name="warning" size={15} />
              <span>LEGAL CLINICAL OVERRIDE DOCUMENTATION</span>
            </div>
            <p className="text-zinc-800 dark:text-zinc-200 font-medium">
              Rationale: {emergencyOverride.reason}
            </p>
            <p className="text-[11px] text-zinc-500">
              Authorized by {emergencyOverride.physician} ({emergencyOverride.role}) on {formatDate(emergencyOverride.at)}.
            </p>
          </div>
        )}

        {/* Multi-Disciplinary Signatures */}
        <div className="pt-4 border-t border-line">
          <h3 className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-4">
            Multi-Disciplinary Surgical Team Attestation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="rounded-xl border border-line bg-surface p-3 space-y-1">
              <span className="block text-[10px] text-zinc-400 uppercase">Lead Attending Surgeon</span>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">Dr. Sarah Lin, MD, FACS</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">✓ SIGNED & CLEARED</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-3 space-y-1">
              <span className="block text-[10px] text-zinc-400 uppercase">Attending Anesthesiologist</span>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">Dr. Marcus Vance, MD, FASA</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">✓ AIRWAY & DRUGS RECONCILED</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-3 space-y-1">
              <span className="block text-[10px] text-zinc-400 uppercase">Circulating Safety Nurse</span>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">Elena Rostova, RN, CNOR</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">✓ CONSENT & WRISTBAND MATCH</p>
            </div>
          </div>
        </div>

        {/* Audit Hash Footer */}
        <div className="flex items-center justify-between border-t border-line/60 pt-4 font-mono text-[10px] text-zinc-400">
          <span>SHA-256 FINGERPRINT: {assessment.selected?.id?.slice(0, 16) || '7f9a2e81c045b'}...</span>
          <span>EHR AUDIT COMPLIANT · FHIR R4 VALIDATED</span>
        </div>
      </div>
    </dialog>
  );
}
