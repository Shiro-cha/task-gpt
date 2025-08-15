
import type { Metadata } from 'next';
import './globals.css';
import ElectronReportStatus from './ElectronReportStatus';

export const metadata: Metadata = {
  title: `Echo - Your smart machine assistant.`,
  description: 'Your smart machine assistant.',
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