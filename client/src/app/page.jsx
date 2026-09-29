'use client';
import dynamic from 'next/dynamic';

const SurgicalSafetyDashboard = dynamic(
  () => import('@/components/dashboard/SurgicalSafetyDashboard.jsx'),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-screen place-content-center bg-surface text-ink">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-line border-t-zinc-900 dark:border-t-zinc-100" />
          <p className="font-mono text-xs text-zinc-500">Opening surgical safety workspace...</p>
        </div>
      </div>
    )
  }
);

export default function HomePage() {
  return <SurgicalSafetyDashboard />;
}

