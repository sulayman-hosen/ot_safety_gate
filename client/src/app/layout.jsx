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
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
