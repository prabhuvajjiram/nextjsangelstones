import type { Metadata, Viewport } from "next/types";
import localFont from "next/font/local";
import "./globals.css";
import '../styles/font-optimization.css'; // Import font optimization CSS
// Import production optimizer - will auto-run in production mode
import "@/utils/prodOptimizer.js";
import PerformanceInit from "./performance-init";
// We no longer need Header here since we're using the Layout component
// import Header from "@/components/layout/Header";

// Font configuration
const inter = localFont({
  src: "../../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2",
  display: "swap",
  variable: "--font-sans",
});

const playfair = localFont({
  src: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff2",
  display: "swap",
  variable: "--font-display",
});

const cormorant = localFont({
  src: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2",
  display: "swap",
  variable: "--font-serif",
});

// Define viewport configuration separately as per Next.js 14+ requirements
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#D1A042',
};

export const metadata: Metadata = {
  title: 'Angel Granites',
  description: 'Angel Granites is a leading manufacturer and supplier of high-quality granite monuments, headstones, and memorials across the United States.',
  keywords: 'granite monuments, headstones, memorials, cemetery monuments, custom monuments, Angel Granites',
  robots: 'index, follow',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://angelgranites.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://angelgranites.com',
    siteName: 'Angel Granites',
    title: 'Angel Granites - Premium Monuments & Headstones',
    description: 'Quality granite monuments, headstones and memorials crafted with care and precision',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Angel Granites - Premium Monuments & Headstones',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <head>
        {/* DNS Prefetch and Preconnect */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Preload Critical Assets */}
        <link rel="preload" href="/images/logo.png" as="image" />
        <link rel="preload" href="/images/video-poster-optimized.jpg" as="image" />
        
        {/* Critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical CSS inlined for fastest render */
          body { margin: 0; padding: 0; background-color: #fff; }
          .critical-hide { opacity: 0; transition: opacity 0.3s; }
          .critical-show { opacity: 1; }
          /* Avoid Cumulative Layout Shift */
          main { min-height: 100vh; }
          img { aspect-ratio: attr(width) / attr(height); }
          /* LCP optimization */
          .hero-section { min-height: 70vh; }
        `}} />
        
        {/* Script optimizer - load early but non-blocking */}
        <script
          src="/scriptOptimizer.js"
          defer
        />
      </head>
      <body suppressHydrationWarning={true} className="min-h-screen flex flex-col font-sans text-gray-800 antialiased">
        {/* Google Tag Manager (noscript) - moved inside PerformanceInit */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-56P7KZDV"
          height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        
        <PerformanceInit />
        
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
