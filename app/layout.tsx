import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scene Detective — visual reconstruction bureau',
  description:
    'Rebuild small scenes from visible evidence, then send a challenge to a friend.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
