export const formatConcept = concept => concept?.text || concept?.coding?.[0]?.display || concept?.coding?.[0]?.code || 'Not documented';

export function formatPatientName(patient) {
  const name = patient?.name?.[0];
  return name?.text || [...(name?.given || []), name?.family].filter(Boolean).join(' ') || 'Unnamed patient';
}

export function formatDate(value, includeTime = true) {
  if (!value || Number.isNaN(new Date(value).getTime())) return 'Not documented';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: '2-digit', year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
  }).format(new Date(value));
}

export function getPlannedMedications(data, selectedProcedure) {
  return (data?.medications || []).filter(medication =>
    medication.status === 'active' && medication.intent === 'order' && selectedProcedure &&
    medication.basedOn?.some(reference =>
      reference.reference === `ServiceRequest/${selectedProcedure.id}` ||
      (data.sourceBase && reference.reference === `${data.sourceBase}/ServiceRequest/${selectedProcedure.id}`)
    )
  );
}
