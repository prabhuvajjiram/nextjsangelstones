import type { Metadata, Viewport } from "next/types";
import { Inter, Playfair_Display, Didact_Gothic } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

// Font configuration
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap'
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap'
});

const didact = Didact_Gothic({ 
  weight: ['400'],
  subsets: ["latin"],
  variable: '--font-didact',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Angel Granites - A Venture of Angel Stones | Premium Granite Monuments & Custom Headstones",
  description: "Angel Granites, established by Angel Stones, is a leading granite monument manufacturer offering custom headstones, memorial stones, and cemetery monuments nationwide. Quality craftsmanship, wholesale prices, and direct shipping. 100+ Granite colors. Request a quote today.",
  keywords: "granite monument manufacturer, custom headstones, memorial stones near me, cemetery monuments, granite headstones prices, custom cemetery memorials, grave markers, affordable monuments, granite manufacturers direct",
  openGraph: {
    title: "Angel Granites - A Venture of Angel Stones",
    description: "Angel Granites, established by Angel Stones, is a leading granite monument manufacturer offering custom headstones, memorial stones, and cemetery monuments nationwide. Quality craftsmanship, wholesale prices, and direct shipping. 100+ Granite colors. Request a quote today.",
    url: "https://www.theangelstones.com/",
    siteName: "Angel Granites - A Venture of Angel Stones",
    images: [
      {
        url: "https://www.theangelstones.com/angel-granite-stones.jpg",
        width: 1200,
        height: 675,
        alt: "Angel Granites",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Angel Granites - A Venture of Angel Stones",
    description: "Angel Granites, established by Angel Stones, is a leading granite monument manufacturer offering custom headstones, memorial stones, and cemetery monuments nationwide. Quality craftsmanship, wholesale prices, and direct shipping. 100+ Granite colors. Request a quote today.",
    images: ["https://www.theangelstones.com/angel-granite-stones.jpg"],
  },
  robots: "index, follow",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "apple-touch-icon-precomposed", url: "/apple-icon-precomposed.png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#262626",
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${didact.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://embed.tawk.to" />
        <link rel="dns-prefetch" href="https://embed.tawk.to" />
        
        {/* Simple anti-FOUC script that doesn't depend on load event */}
        <Script id="anti-fouc" strategy="beforeInteractive">
          {`
            (function() {
              document.documentElement.classList.add('no-fouc');
              setTimeout(function() {
                document.documentElement.classList.remove('no-fouc');
              }, 100);
            })();
          `}
        </Script>
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-56P7KZDV" height="0" width="0" className="hidden invisible"></iframe>
        </noscript>
        
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-56P7KZDV');
          `}
        </Script>
        
        {/* Tawk.to Chat Widget */}
        <Script id="tawk" strategy="lazyOnload">
          {`
            var Tawk_API = Tawk_API || {};
            var Tawk_LoadStart = new Date();
            (function(){
              var s1 = document.createElement("script");
              s1.async = true;
              s1.src = 'https://embed.tawk.to/65b2c5b78d261e1b5f5e6c22/1hl0v1h5h';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin', '*');
              document.head.appendChild(s1);
            })();
          `}
        </Script>
        
        {/* Osano for optional cookies */}
        <Script src="https://cmp.osano.com/16BlGRUNRhRsy6cS2/951c545c-64c9-4a8f-886a-b22b0ff1528d/osano.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
