import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NavBar } from '@/components/layout';
import { GA_TRACKING_ID } from '@/lib/gtag';
import Script from 'next/script';
import { Metadata } from 'next';
import QueryProvider from '@/components/query-client-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Myanmar Comic',
  description: 'Best Myanmar Comics',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* MonetagSDK */}
        {/* <Script src='//libtl.com/sdk.js' data-zone='9573187' data-sdk='show_9573187'></Script> */}

        {/* GA script loading */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />

        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <div className="md:mx-36 sm:mx-16 mx-3">
          <QueryProvider>
            <NavBar></NavBar>
            {children}
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
