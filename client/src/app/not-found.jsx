import Link from 'next/link';

export default function NotFoundPage() {
  return <main className="grid min-h-screen place-content-center justify-items-center gap-5 bg-surface p-8 text-center text-ink"><h1 className="text-3xl font-semibold">Page not found</h1><p className="text-sm text-muted">Return to the surgical safety workspace.</p><Link href="/" className="rounded-lg bg-brand px-5 py-3 text-sm text-white">Open workspace</Link></main>;
}
