'use client';
import ClinicalIcon from './ClinicalIcon.jsx';

export default function ActionButton({
  children,
  variant = 'primary',
  icon,
  busy = false,
  className = '',
  type = 'button',
  ...props
}) {
  const styles = {
    primary:
      'border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98] dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white shadow-xs font-semibold',
    secondary:
      'border-zinc-200 dark:border-zinc-800 bg-card text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-[0.98] shadow-2xs font-medium',
    ghost:
      'border-transparent bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 active:scale-[0.98] font-medium'
  };

  return (
    <button
      type={type}
      className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-xs sm:text-sm transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${styles[variant]} ${className}`}
      {...props}
    >
      {(busy || icon) && (
        <ClinicalIcon
          name={busy ? 'refresh' : icon}
          size={15}
          className={`shrink-0 ${busy ? 'motion-safe:animate-spin' : ''}`}
        />
      )}
      <span className="font-semibold text-inherit">{children}</span>
    </button>
  );
}
