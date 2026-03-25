import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FirebaseClientProvider } from '@/firebase';
import LanguageToggle from '@/components/language-toggle';
import { LanguageProvider } from '@/context/language-context';
import { LocateWidget } from '@/components/LocateWidget';
import { AppointmentProvider } from '@/context/appointment-context';

export const metadata: Metadata = {
  title: 'Lune | Advanced Skincare in Montreal',
  description: 'Reveal your best skin with Lune - Montreal’s destination for advanced skincare, personalized treatments, and radiant results.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased'
        )}
      >
        <FirebaseClientProvider>
          <AppointmentProvider>
            <LanguageProvider>
              <Header />
              <div className="fixed top-[72px] right-4 z-40">
                <LanguageToggle />
              </div>
              <main className="flex-1 min-h-screen">{children}</main>
              <LocateWidget />
              <ChatWidget />
              {/* Footer removed */}
              <Toaster />
            </LanguageProvider>
          </AppointmentProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
