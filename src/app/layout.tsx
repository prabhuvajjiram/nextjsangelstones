import type { Metadata, Viewport } from "next/types";
import { Inter, Playfair_Display, Didact_Gothic } from "next/font/google";
import "./globals.css";
import '../styles/font-optimization.css'; // Import font optimization CSS
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// Import production optimizer - will auto-run in production mode
import "@/utils/prodOptimizer.js";
import PerformanceInit from "./performance-init";

// Font configuration
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const didact = Didact_Gothic({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-didact",
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
    <html lang="en" className={`scroll-smooth ${inter.variable} ${playfair.variable} ${didact.variable}`}>
      <head>
        {/* DNS Prefetch and Preconnect */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload Critical Assets */}
        <link rel="preload" href="/images/logo.png" as="image" />
        
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
      <body suppressHydrationWarning={true} className="font-sans text-gray-800 antialiased">
        {/* Google Tag Manager (noscript) - moved inside PerformanceInit */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-56P7KZDV"
          height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        
        <PerformanceInit />
        
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
