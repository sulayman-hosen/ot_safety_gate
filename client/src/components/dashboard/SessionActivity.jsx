'use client';
import ClinicalIcon from '@/components/ui/ClinicalIcon.jsx';
import { formatDate } from '@/utils/clinicalFormatters.js';
import { useApp } from '@/context/AppContext.jsx';

export default function SessionActivity({ events, record }) {
  const { t } = useApp();
  const activity = [
    ...(record ? [{ action: record.draft ? 'Draft checklist saved' : 'Reviewed checklist recorded', at: record.createdAt }] : []),
    ...(events || []).slice(0, 5)
  ];

  return (
    <section id="activity" className="rounded-xl border border-line bg-card p-5 sm:p-6 shadow-sm transition-colors">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-bold text-black dark:text-white sm:text-lg">{t('recentActivity')}</h2>
        <ClinicalIcon name="clock" size={18} className="text-black dark:text-white" />
      </div>

      <div className="space-y-3.5">
        {activity.length === 0 ? (
          <p className="text-xs text-neutral-600 dark:text-neutral-400">No session activity recorded yet.</p>
        ) : (
          activity.map((event, index) => (
            <div key={`${event.at}-${index}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="size-2 rounded-full bg-black dark:bg-white" />
              <span className="font-bold text-black dark:text-white">{event.action}</span>
              <time dateTime={event.at} className="ml-auto text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                {formatDate(event.at)}
              </time>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
