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
    primary: 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-bold hover:bg-neutral-800 hover:dark:bg-neutral-200 shadow-sm',
    secondary: 'border-line bg-card text-ink hover:bg-surface hover:border-black dark:hover:border-white shadow-sm font-semibold',
    ghost: 'border-transparent bg-transparent text-ink hover:bg-surface font-semibold'
  };

  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-xs sm:text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
      {...props}
    >
      {(busy || icon) && (
        <ClinicalIcon
          name={busy ? 'refresh' : icon}
          size={16}
          className={busy ? 'motion-safe:animate-spin' : ''}
        />
      )}
      <span>{children}</span>
    </button>
  );
}
