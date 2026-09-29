import localFont from 'next/font/local';
import './globals.css';
import { AppProvider } from '@/context/AppContext.jsx';

const roboto = localFont({ src: '../assets/fonts/Roboto-Latin-Variable.woff2', variable: '--font-roboto', weight: '100 900', display: 'swap' });
const inter = localFont({ src: '../assets/fonts/Inter-Latin-Variable.woff2', variable: '--font-inter', weight: '100 900', display: 'swap' });

export const metadata = {
  title: 'ORBIT · OT Pre-Surgical Safety Gate',
  description: 'Patient-bound surgical evidence, team review, and structured clinical summaries.',
  icons: { icon: '/ot-safety-icon.svg' },
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 1. Suppress browser-extension hydration mismatch warning in Next.js development overlay
                if (typeof window !== 'undefined') {
                  const origError = console.error;
                  console.error = function(...args) {
                    const str = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
                    if (str.includes('bis_skin_checked') || str.includes('hydration-mismatch') || (str.includes('hydrated') && str.includes('didn\\'t match'))) {
                      return;
                    }
                    return origError.apply(console, args);
                  };
                }

                // 2. Remove bis_skin_checked whenever injected by Bitdefender or security extensions
                try {
                  const observer = new MutationObserver(function(mutations) {
                    for (let i = 0; i < mutations.length; i++) {
                      const m = mutations[i];
                      if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
                        m.target.removeAttribute('bis_skin_checked');
                      }
                    }
                  });
                  observer.observe(document.documentElement, {
                    attributes: true,
                    subtree: true,
                    attributeFilter: ['bis_skin_checked']
                  });
                  document.querySelectorAll('[bis_skin_checked]').forEach(function(el) {
                    el.removeAttribute('bis_skin_checked');
                  });
                } catch (e) {}

                // 3. Theme initialization
                try {
                  const savedTheme = localStorage.getItem('orbit_theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-surface text-ink antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
