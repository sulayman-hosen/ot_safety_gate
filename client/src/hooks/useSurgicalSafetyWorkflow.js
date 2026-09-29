'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { apiRequest } from '@/services/apiClient.js';
import { emptyConfirmations } from '@/constants/checklistConstants.js';

export function useSurgicalSafetyWorkflow() {
  const [session, setSession] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [capabilities, setCapabilities] = useState({ demoEnabled: true });
  const [attestations, setAttestations] = useState(emptyConfirmations);
  const [notes, setNotes] = useState('');
  const [record, setRecord] = useState(null);
  const [emergencyOverride, setEmergencyOverride] = useState(null);
  const [clock, setClock] = useState(Date.now());
  const requestKey = useRef(null);

  const resetReview = useCallback(() => {
    setAttestations(emptyConfirmations());
    setRecord(null);
    requestKey.current = null;
  }, []);

  const reportError = useCallback(error => {
    setError(error.message);
    if (error.status === 401) {
      setSession(null);
      setSnapshot(null);
      resetReview();
      setNotes('');
      setEmergencyOverride(null);
    }
  }, [resetReview]);

  const loadCase = useCallback(async procedureId => {
    const value = await apiRequest(`/api/case${procedureId ? `?procedure=${encodeURIComponent(procedureId)}` : ''}`);
    setSnapshot(value);
    resetReview();
    return value;
  }, [resetReview]);

  const loadSession = useCallback(async () => {
    const value = await apiRequest('/api/session');
    if (value.authenticated) { setSession(value); await loadCase(); }
    else { setCapabilities(value); setSession(null); }
  }, [loadCase]);

  useEffect(() => {
    let active = true;
    loadSession().catch(error => { if (active) reportError(error); })
      .finally(() => { if (active) setLoading(false); });
    if (new URLSearchParams(window.location.search).has('error')) {
      setError('SMART launch could not be verified. Check client registration, exact issuer, PKCE, callback URL and cookie settings, then launch again from the EHR.');
      window.history.replaceState({}, '', '/');
    }
    return () => { active = false; };
  }, [loadSession, reportError]);

  useEffect(() => { const timer = setInterval(() => setClock(Date.now()), 5000); return () => clearInterval(timer); }, []);
  useEffect(() => {
    if (session && clock > session.expiresAt) reportError(Object.assign(new Error('Your session expired. Open a new session to continue.'), { status: 401 }));
  }, [clock, session, reportError]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 6000); return () => clearTimeout(timer); }, [toast]);

  async function openDemo(scenario = 'complete') {
    setBusy(true); setError(''); setSnapshot(null); setNotes(''); resetReview(); setEmergencyOverride(null);
    try {
      await apiRequest('/api/demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario }) });
      await loadSession();
    } catch (error) { reportError(error); }
    finally { setBusy(false); }
  }

  async function refreshEvidence(procedureId = snapshot?.assessment.selected?.id) {
    setBusy(true); setError('');
    try {
      await loadCase(procedureId);
      setToast('Evidence refreshed. Please reconfirm the team review.');
    }
    catch (error) { setSnapshot(null); resetReview(); reportError(error); }
    finally { setBusy(false); }
  }

  async function closeSession() {
    setBusy(true); setError('');
    try {
      await apiRequest('/api/logout', { method: 'POST', headers: { 'x-csrf-token': session.csrf } });
      setSession(null); setSnapshot(null); setNotes(''); resetReview(); setEmergencyOverride(null);
      await loadSession();
    } catch (error) { reportError(error); }
    finally { setBusy(false); }
  }

  function applyEmergencyOverride(overrideData) {
    setEmergencyOverride(overrideData);
    setRecord(null);
    setToast('Emergency clinical override recorded. Attestation unlocked under lead physician authority.');
  }

  function clearEmergencyOverride() {
    setEmergencyOverride(null);
    setRecord(null);
    setToast('Emergency override cleared. Standard clinical policy restored.');
  }

  async function saveRecord(draft) {
    setBusy(true); setError('');
    const input = {
      draft,
      notes: emergencyOverride
        ? `[EMERGENCY CLINICAL OVERRIDE: ${emergencyOverride.reason}] ${notes}`.trim()
        : notes,
      attestations,
      procedureId: snapshot?.assessment.selected?.id || null,
      fingerprint: snapshot?.fingerprint,
      emergencyOverride: emergencyOverride || null
    };
    const serialized = JSON.stringify(input);
    if (requestKey.current?.payload !== serialized) requestKey.current = { payload: serialized, key: crypto.randomUUID() };
    try {
      const value = await apiRequest('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': session.csrf,
          'idempotency-key': requestKey.current.key
        },
        body: serialized
      });
      setRecord(value);
      setToast(draft ? 'Draft saved. Export files are ready.' : 'Reviewed checklist recorded. Export files are ready.');
    } catch (error) {
      reportError(error);
      if (error.code === 'EVIDENCE_CHANGED') { resetReview(); await loadCase(input.procedureId).catch(reportError); }
    } finally { setBusy(false); }
  }

  const ageMinutes = snapshot ? Math.max(0, Math.floor((clock - Date.parse(snapshot.data.fetchedAt)) / 60000)) : 0;
  const isReviewable = snapshot?.assessment.status === 'reviewable' || emergencyOverride !== null;

  return {
    session, snapshot, loading, busy, error, toast, capabilities, attestations, notes, record,
    ageMinutes, expiredEvidence: ageMinutes >= 5,
    canReview: isReviewable && Boolean(session?.actor.canAttest),
    allChecked: Object.values(attestations).every(Boolean),
    confirmedCount: Object.values(attestations).filter(Boolean).length,
    emergencyOverride,
    applyEmergencyOverride,
    clearEmergencyOverride,
    setError,
    setAttestations: value => { setAttestations(value); setRecord(null); },
    setNotes: value => { setNotes(value); setRecord(null); },
    openDemo, refreshEvidence, closeSession, saveRecord
  };
}
