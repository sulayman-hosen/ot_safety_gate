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
              try {
                const ignoredAttrs = new Set([
                  'bis_skin_checked',
                  'cz-shortcut-listen',
                  'data-gr-ext-installed',
                  'data-new-gr-c-s-check-loaded'
                ]);
                const origSetAttr = Element.prototype.setAttribute;
                Element.prototype.setAttribute = function(name, value) {
                  if (ignoredAttrs.has(name)) return;
                  return origSetAttr.apply(this, arguments);
                };
                const origSetAttrNS = Element.prototype.setAttributeNS;
                Element.prototype.setAttributeNS = function(ns, name, value) {
                  if (ignoredAttrs.has(name)) return;
                  return origSetAttrNS.apply(this, arguments);
                };
                document.querySelectorAll('[bis_skin_checked]').forEach(el => el.removeAttribute('bis_skin_checked'));
              } catch (e) {}

              try {
                const savedTheme = localStorage.getItem('orbit_theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
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
