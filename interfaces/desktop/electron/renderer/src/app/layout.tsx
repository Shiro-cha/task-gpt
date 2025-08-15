
import type { Metadata } from 'next';
import './globals.css';
import ElectronReportStatus from './ElectronReportStatus';

export const metadata: Metadata = {
  title: 'My Electron App',
  description: 'Next.js + Electron',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ElectronReportStatus />
      </body>
    </html>
  );
}