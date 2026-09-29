'use client';
import { useState } from 'react';
import { useSurgicalSafetyWorkflow } from '@/hooks/useSurgicalSafetyWorkflow.js';
import { DEMO_SCENARIOS } from '@/constants/checklistConstants.js';
import { formatDate } from '@/utils/clinicalFormatters.js';
import AppSidebar from '@/components/layout/AppSidebar.jsx';
import WorkspaceHeader from '@/components/layout/WorkspaceHeader.jsx';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import ActionButton from '@/components/ui/ActionButton.jsx';
import DemoWelcomePanel from './DemoWelcomePanel.jsx';
import PatientContextCard from './PatientContextCard.jsx';
import SafetyGateBanner from './SafetyGateBanner.jsx';
import SessionActivity from './SessionActivity.jsx';
import ProcedureEvidenceCard from '@/components/evidence/ProcedureEvidenceCard.jsx';
import ConsentEvidenceCard from '@/components/evidence/ConsentEvidenceCard.jsx';
import AllergyEvidenceCard from '@/components/evidence/AllergyEvidenceCard.jsx';
import LaboratoryResultsTable from '@/components/evidence/LaboratoryResultsTable.jsx';
import EvidenceDialog from '@/components/evidence/EvidenceDialog.jsx';
import KeyTermsDialog from '@/components/knowledge/KeyTermsDialog.jsx';
import TeamReviewPanel from '@/components/review/TeamReviewPanel.jsx';
import ClinicalDocumentExports from '@/components/review/ClinicalDocumentExports.jsx';
import { useApp } from '@/context/AppContext.jsx';

function WorkspaceLoading({ busy = true }) {
  const { language } = useApp();
  return (
    <div className="grid min-h-80 place-content-center justify-items-center gap-3 text-center">
      <ClinicalIcon
        name="refresh"
        size={28}
        className={`text-black dark:text-white ${busy ? 'motion-safe:animate-spin' : ''}`}
      />
      <h2 className="text-xl font-bold text-black dark:text-white">
        {busy
          ? (language === 'bn' ? 'ওয়ার্কস্পেস লোড হচ্ছে...' : 'Opening your workspace')
          : (language === 'bn' ? 'প্রমাণ অনুপলব্ধ' : 'Evidence is unavailable')}
      </h2>
      <p className="text-xs text-neutral-600 dark:text-neutral-400">
        {busy
          ? (language === 'bn' ? 'বর্তমান রোগী ও ক্লিনিক্যাল ডেটা ফেচ করা হচ্ছে।' : 'Checking the current patient and source records.')
          : (language === 'bn' ? 'ইএইচআর সংযোগ পুনরায় চেষ্টা করতে রিফ্রেশ করুন।' : 'Refresh to retry the EHR connection.')}
      </p>
    </div>
  );
}

export default function SurgicalSafetyDashboard() {
  const workflow = useSurgicalSafetyWorkflow();
  const {
    session,
    snapshot,
    loading,
    busy,
    error,
    toast,
    capabilities,
    record,
    ageMinutes,
    expiredEvidence,
    setError,
    openDemo,
    refreshEvidence,
    closeSession
  } = workflow;

  const { t } = useApp();
  const [mobileNavigation, setMobileNavigation] = useState(false);
  const [dialogSection, setDialogSection] = useState(null);
  const data = snapshot?.data;
  const assessment = snapshot?.assessment;

  function navigate(section) {
    if (!session && section !== 'overview') setDialogSection('help');
    else document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileNavigation(false);
  }

  return (
    <div className="min-h-screen bg-surface text-black dark:text-white transition-colors duration-200">
      <a
        href="#overview"
        className="sr-only fixed top-2 left-2 z-[100] rounded bg-black text-white px-4 py-2 focus:not-sr-only font-bold text-xs"
      >
        Skip to checklist
      </a>

      <AppSidebar
        open={mobileNavigation}
        onClose={() => setMobileNavigation(false)}
        onNavigate={navigate}
        onHelp={() => {
          setMobileNavigation(false);
          setDialogSection('help');
        }}
      />

      <div className="min-w-0 lg:ml-64">
        <WorkspaceHeader
          session={session}
          onToggleNavigation={() => setMobileNavigation(!mobileNavigation)}
        />

        <main id="overview" className="mx-auto max-w-[1600px] px-4 py-7 sm:px-8 sm:py-9">
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200 p-4 text-xs leading-relaxed shadow-2xs"
            >
              <ClinicalIcon name="warning" size={17} className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400" />
              <span className="flex-1 font-semibold">{error}</span>
              <button
                aria-label="Dismiss error"
                onClick={() => setError('')}
                className="text-rose-600 dark:text-rose-400 hover:opacity-75"
              >
                <ClinicalIcon name="close" size={16} />
              </button>
            </div>
          )}

          {toast && (
            <div
              role="status"
              className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 p-3.5 text-xs font-semibold shadow-2xs"
            >
              <ClinicalIcon name="check" size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{toast}</span>
            </div>
          )}

          {loading ? (
            <WorkspaceLoading />
          ) : !session ? (
            <DemoWelcomePanel
              demoEnabled={capabilities.demoEnabled}
              busy={busy}
              onDemo={() => openDemo()}
              onHelp={() => setDialogSection('help')}
            />
          ) : (
            <>
              {/* Header Title & Actions */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-5">
                <div>
                  <p className="font-mono text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                    {t('safetyWorkspace')}
                  </p>
                  <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {t('safetyGateTitle')}
                  </h1>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {t('safetyGateSubtitle')}
                  </p>
                </div>

                <ActionButton
                  variant="secondary"
                  icon="refresh"
                  busy={busy}
                  disabled={busy}
                  onClick={() => refreshEvidence()}
                >
                  {t('refreshEvidence')}
                </ActionButton>
              </div>

              {/* Demo Mode Scenario Selector */}
              {session.mode === 'demo' && (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-card px-4 py-3 shadow-2xs">
                  <p className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    <span className="rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider">
                      DEMO
                    </span>
                    <span>Synthetic patient · example clinical policy</span>
                  </p>
                  <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    <span>{t('testScenario')}</span>
                    <select
                      aria-label="Test scenario"
                      disabled={busy}
                      value={session.scenario}
                      onChange={event => openDemo(event.target.value)}
                      className="max-w-56 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-surface px-2.5 py-1.5 font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-2xs focus:outline-none"
                    >
                      {DEMO_SCENARIOS.map(([id, label]) => (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              {!snapshot ? (
                <WorkspaceLoading busy={busy} />
              ) : (
                <>
                  <PatientContextCard data={data} />
                  <SafetyGateBanner
                    assessment={assessment}
                    expiredEvidence={expiredEvidence}
                    ageMinutes={ageMinutes}
                  />

                  {assessment.issues.length > 0 && (
                    <div
                      role="alert"
                      className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 p-4 text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <ClinicalIcon name="warning" size={16} className="text-amber-600 dark:text-amber-400" />
                        <h2 className="font-bold">
                          {t('incompleteIssues')}
                        </h2>
                      </div>
                      <ul className="mt-2 list-inside list-disc space-y-1 pl-1">
                        {assessment.issues.map((issue, index) => (
                          <li key={index} className="font-medium text-amber-800 dark:text-amber-300">{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 2 Column Main Dashboard Layout */}
                  <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_370px]">
                    <div className="min-w-0 space-y-5">
                      <div id="evidence" className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          <span>{t('clinicalEvidence')}</span>
                          <span className="font-mono text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 rounded-md border border-zinc-200 dark:border-zinc-800 bg-surface px-1.5 py-0.5">
                            {t('checksCount')}
                          </span>
                        </h2>
                        <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                          {expiredEvidence ? t('refreshRequired') : t('patientScoped')}
                        </span>
                      </div>

                      {/* Check 01: Procedure Evidence */}
                      <ProcedureEvidenceCard
                        data={data}
                        assessment={assessment}
                        busy={busy}
                        onSelect={refreshEvidence}
                        onInspect={() => setDialogSection('procedure')}
                      />

                      {/* Checks 02 & 03: Consent and Allergies */}
                      <div className="grid items-start gap-5 min-[1550px]:grid-cols-2">
                        <ConsentEvidenceCard
                          data={data}
                          assessment={assessment}
                          onInspect={() => setDialogSection('consent')}
                        />
                        <AllergyEvidenceCard
                          data={data}
                          assessment={assessment}
                          onInspect={() => setDialogSection('allergy')}
                        />
                      </div>

                      {/* Check 04: Laboratory Results */}
                      <LaboratoryResultsTable
                        assessment={assessment}
                        onInspect={() => setDialogSection('labs')}
                      />

                      {/* Session Activity */}
                      <SessionActivity events={snapshot.audit} record={record} />
                    </div>

                    {/* Right Review and Exports Panel */}
                    <aside className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-1">
                      <TeamReviewPanel workflow={workflow} />
                      <ClinicalDocumentExports record={record} />
                    </aside>
                  </div>
                </>
              )}

              {/* Footer */}
              <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                <p className="flex items-center gap-2">
                  <ClinicalIcon name="lock" size={13} className="text-zinc-400 dark:text-zinc-500" />
                  <span>
                    {session.persistence === 'mongodb' ? 'MongoDB Atlas persistence' : 'Ephemeral demo session'} · {t('sessionEnds')} {formatDate(session.expiresAt)}
                  </span>
                </p>
                <ActionButton
                  variant="ghost"
                  icon="exit"
                  className="min-h-8 px-3 py-1 text-xs"
                  disabled={busy}
                  onClick={closeSession}
                >
                  {t('endSession')}
                </ActionButton>
              </footer>
            </>
          )}
        </main>
      </div>

      <EvidenceDialog
        section={dialogSection}
        data={data}
        onClose={() => setDialogSection(null)}
      />

      <KeyTermsDialog />
    </div>
  );
}
