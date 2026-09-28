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
              className="mb-5 flex items-start gap-3 rounded-xl border border-neutral-400 bg-neutral-100 text-black dark:border-neutral-600 dark:bg-neutral-800 dark:text-white p-4 text-xs leading-6 shadow-sm"
            >
              <ClinicalIcon name="warning" size={18} className="mt-0.5 shrink-0 text-black dark:text-white" />
              <span className="flex-1 font-bold">{error}</span>
              <button
                aria-label="Dismiss error"
                onClick={() => setError('')}
                className="text-black dark:text-white hover:opacity-75"
              >
                <ClinicalIcon name="close" size={16} />
              </button>
            </div>
          )}

          {toast && (
            <div
              role="status"
              className="mb-5 flex items-center gap-2 rounded-xl border border-neutral-400 bg-neutral-100 text-black dark:border-neutral-600 dark:bg-neutral-800 dark:text-white p-4 text-xs font-bold shadow-sm"
            >
              <ClinicalIcon name="check" size={18} className="text-black dark:text-white shrink-0" />
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
                  <p className="text-[10px] font-bold tracking-[.15em] text-neutral-600 dark:text-neutral-400">
                    {t('safetyWorkspace')}
                  </p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-[34px] text-black dark:text-white">
                    {t('safetyGateTitle')}
                    <span className="text-black dark:text-white">.</span>
                  </h1>
                  <p className="mt-1.5 text-xs leading-6 text-neutral-600 dark:text-neutral-400 font-semibold">
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
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-card px-4 py-3 shadow-sm">
                  <p className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
                    <span className="rounded bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider">
                      DEMO
                    </span>
                    <span>Synthetic patient · example clinical policy</span>
                  </p>
                  <label className="flex items-center gap-2 text-xs font-bold text-black dark:text-white">
                    <span>{t('testScenario')}</span>
                    <select
                      aria-label="Test scenario"
                      disabled={busy}
                      value={session.scenario}
                      onChange={event => openDemo(event.target.value)}
                      className="max-w-52 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface px-2.5 py-1.5 text-xs font-bold text-black dark:text-white shadow-sm focus:outline-none"
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
                      className="mb-5 rounded-xl border border-neutral-400 bg-neutral-100 text-black dark:border-neutral-600 dark:bg-neutral-800 dark:text-white p-4 text-xs leading-6 shadow-sm"
                    >
                      <h2 className="font-bold text-black dark:text-white">
                        {t('incompleteIssues')}
                      </h2>
                      <ul className="mt-2 list-inside list-disc space-y-1">
                        {assessment.issues.map((issue, index) => (
                          <li key={index} className="font-semibold text-black dark:text-white">{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 2 Column Main Dashboard Layout */}
                  <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_370px]">
                    <div className="min-w-0 space-y-5">
                      <div id="evidence" className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-black dark:text-white">
                          {t('clinicalEvidence')}
                          <span className="ml-2 font-mono text-[11px] font-bold text-black dark:text-white rounded-full bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5">
                            {t('checksCount')}
                          </span>
                        </h2>
                        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
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
              <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
                <p className="flex items-center gap-2 text-xs leading-5">
                  <ClinicalIcon name="lock" size={13} className="text-black dark:text-white" />
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
