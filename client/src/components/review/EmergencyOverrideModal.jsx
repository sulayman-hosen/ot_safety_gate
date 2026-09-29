'use client';
import { useState, useRef, useEffect } from 'react';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import ActionButton from '@/components/ui/ActionButton.jsx';
import { useApp } from '@/context/AppContext.jsx';

const JUSTIFICATION_PRESETS = [
  'Ruptured internal organ / acute life-threatening trauma — immediate incision required without prior consent',
  'Critical emergent surgery with known coagulopathy — intraoperative FFP / platelet transfusion standby confirmed',
  'Severe beta-lactam anaphylaxis — alternate non-cross-reactive antimicrobial protocol verified by anesthesiologist',
  'Attending surgical judgment: procedure indication urgency supersedes delayed laboratory verification',
  'Verbal emergency consent obtained from next of kin / patient incapacitated'
];

export default function EmergencyOverrideModal({ onApply, existingOverride, onClear }) {
  const { emergencyModalOpen, closeEmergencyModal, activeRole, t } = useApp();
  const [selectedPreset, setSelectedPreset] = useState(JUSTIFICATION_PRESETS[0]);
  const [customDetails, setCustomDetails] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (emergencyModalOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [emergencyModalOpen]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!acknowledged) return;
    const finalReason = customDetails.trim()
      ? `${selectedPreset} — Note: ${customDetails.trim()}`
      : selectedPreset;

    onApply({
      reason: finalReason,
      preset: selectedPreset,
      customDetails,
      physician: activeRole.name,
      role: activeRole.role,
      at: new Date().toISOString()
    });
    closeEmergencyModal();
  }

  function handleRevoke() {
    onClear();
    closeEmergencyModal();
  }

  if (!emergencyModalOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={closeEmergencyModal}
      onClick={e => { if (e.target === e.currentTarget) closeEmergencyModal(); }}
      className="m-auto max-h-[90dvh] w-[min(640px,94vw)] overflow-hidden rounded-2xl border border-rose-500/30 bg-card p-0 text-zinc-900 dark:text-zinc-100 shadow-2xl backdrop:bg-black/70"
      aria-labelledby="override-modal-title"
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-rose-500/20 bg-rose-500/10 p-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-xs">
            <ClinicalIcon name="warning" size={20} />
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold tracking-widest text-rose-600 dark:text-rose-400 uppercase">
              CLINICAL EXCEPTION PROTOCOL
            </span>
            <h2 id="override-modal-title" className="text-lg font-bold sm:text-xl text-zinc-900 dark:text-zinc-100 tracking-tight">
              Emergency Clinical Override
            </h2>
          </div>
        </div>
        <button
          onClick={closeEmergencyModal}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-surface hover:text-zinc-900 dark:hover:text-zinc-100"
          aria-label="Close"
        >
          <ClinicalIcon name="close" size={17} />
        </button>
      </div>

      {/* Modal Body */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
        {existingOverride ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
              <ClinicalIcon name="warning" size={15} />
              <span>ACTIVE EMERGENCY OVERRIDE RECORDED</span>
            </div>
            <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
              {existingOverride.reason}
            </p>
            <p className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              Authorized by {existingOverride.physician} ({existingOverride.role}) at {new Date(existingOverride.at).toLocaleTimeString()}
            </p>
            <div className="pt-2">
              <ActionButton
                type="button"
                variant="secondary"
                className="w-full text-xs"
                onClick={handleRevoke}
              >
                Revoke Override & Restore Standard Gate
              </ActionButton>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-line bg-surface p-3.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                Notice: Safety gates prevent surgical complications. Overriding a blocked gate requires attending physician justification.
              </p>
              <p className="mt-1 font-mono text-[11px]">
                This action is permanently logged to the EHR audit trail (HIPAA Security Rule § 164.312(b)) and included in the exported CDA/FHIR record.
              </p>
            </div>

            {/* Justification Selector */}
            <div>
              <label htmlFor="preset-reason" className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                Clinical Indication for Override:
              </label>
              <select
                id="preset-reason"
                value={selectedPreset}
                onChange={e => setSelectedPreset(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-zinc-900 dark:text-zinc-100 font-medium focus:border-rose-500 focus:outline-none"
              >
                {JUSTIFICATION_PRESETS.map((reason, index) => (
                  <option key={index} value={reason} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Notes */}
            <div>
              <label htmlFor="custom-details" className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
                Additional Clinical Notes & Contingencies (Optional):
              </label>
              <textarea
                id="custom-details"
                rows={2}
                value={customDetails}
                onChange={e => setCustomDetails(e.target.value)}
                placeholder="e.g. 2 units PRBC on rapid infuser; anesthesia aware of penicillin allergy; verbal consent from patient spouse witnessed by nurse."
                className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rose-500 focus:outline-none"
              />
            </div>

            {/* Attending Authorization Block */}
            <div className="rounded-xl border border-line bg-surface p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Authorizing Practitioner:</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{activeRole.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[11px] text-zinc-500">
                <span>Clinical Privilege / Role:</span>
                <span>{activeRole.role}</span>
              </div>
            </div>

            {/* Checkbox Acknowledgment */}
            <label className="flex items-start gap-2.5 pt-1 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={e => setAcknowledged(e.target.checked)}
                className="mt-0.5 size-4 rounded accent-rose-600 cursor-pointer"
              />
              <span className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                I attest that immediate surgical intervention is medically necessary and the risks of delaying surgery outweigh the risks identified by the safety gate.
              </span>
            </label>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-line">
              <ActionButton
                type="button"
                variant="ghost"
                onClick={closeEmergencyModal}
              >
                Cancel
              </ActionButton>
              <button
                type="submit"
                disabled={!acknowledged}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 font-mono text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                <ClinicalIcon name="warning" size={14} />
                <span>Authorize & Unlock Gate</span>
              </button>
            </div>
          </>
        )}
      </form>
    </dialog>
  );
}
