'use client';
import EvidenceCard, { EvidenceDetail } from './EvidenceCard.jsx';
import { useApp } from '@/context/AppContext.jsx';

export default function ConsentEvidenceCard({ data, assessment, onInspect }) {
  const { t } = useApp();
  const check = assessment.checks.find(check => check.id === 'consent');

  return (
    <EvidenceCard check={check} number="02" icon="document" onInspect={onInspect}>
      <div className="divide-y divide-line">
        <EvidenceDetail label={t('consentRecords')}>
          <span className="text-black dark:text-white">{data.consents.length} {t('retrieved')}</span>
        </EvidenceDetail>
        <EvidenceDetail label={t('sourceDocuments')}>
          <span className="text-black dark:text-white">{data.documents.length} {t('retrieved')}</span>
        </EvidenceDetail>
        <EvidenceDetail label={t('patientSignature')}>
          <span className="text-black dark:text-white font-bold">
            {check.status === 'pass' ? t('linkedFound') : t('needsVerification')}
          </span>
        </EvidenceDetail>
      </div>
    </EvidenceCard>
  );
}
