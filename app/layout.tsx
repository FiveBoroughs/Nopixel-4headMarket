import './globals.css';
import { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import UmamiProvider from 'next-umami'
import { ErrorBoundary } from '@/components/ErrorBoundary';

const jetbrains = JetBrains_Mono({ subsets: ['latin'] });

const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;

export const metadata: Metadata = {
  title: '[ RESTRICTED ACCESS ]',
  description: 'Enter at your own risk',
  metadataBase: new URL('http://daammo.store'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <UmamiProvider websiteId={umamiWebsiteId || "undefined"} src={umamiSrc} />
      </head>
      <body className={jetbrains.className}>
        <ErrorBoundary>
          <div className="grain" />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}