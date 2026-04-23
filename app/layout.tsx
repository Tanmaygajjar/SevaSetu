import type { Metadata } from 'next';

import './globals.css';
import { Providers } from './providers';
import { SuperAdminListener } from '@/components/shared/SuperAdminListener';


export const metadata: Metadata = {
  title: 'SevaSetu — Connecting Community Needs to Volunteers',
  description: 'AI-powered civic platform connecting community needs with the right volunteers in minutes. Multilingual, real-time, built for India.',
  keywords: ['volunteer', 'community', 'India', 'NGO', 'social impact', 'SDG'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Mukta:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            crossOrigin=""
          />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <SuperAdminListener />
        </Providers>
      </body>
    </html>
  );
}
