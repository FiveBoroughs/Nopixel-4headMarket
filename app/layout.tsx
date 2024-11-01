import './globals.css';
import { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import UmamiProvider from 'next-umami'

const jetbrains = JetBrains_Mono({ subsets: ['latin'] });

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
        <UmamiProvider websiteId="0cd6a32c-8faf-42a1-9ff5-dda3e495af3d" src="https://u.pinescripters.io/script.js" />
      </head>
      <body className={jetbrains.className}>
        <div className="grain" />
        {children}
      </body>
    </html>
  );
}