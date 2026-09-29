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
    <section id="activity" className="rounded-xl border border-line bg-card p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 sm:text-lg tracking-tight">{t('recentActivity')}</h2>
        <ClinicalIcon name="clock" size={16} className="text-zinc-400 dark:text-zinc-500" />
      </div>

      <div className="space-y-3">
        {activity.length === 0 ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">No session activity recorded yet.</p>
        ) : (
          activity.map((event, index) => (
            <div key={`${event.at}-${index}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs py-1 border-b border-line/40 last:border-0">
              <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{event.action}</span>
              <time dateTime={event.at} className="ml-auto font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                {formatDate(event.at)}
              </time>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
