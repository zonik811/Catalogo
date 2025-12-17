import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./theme.css";
import ThemeWrapper from "@/components/theme/theme-wrapper";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { ThemeEditor } from "@/components/theme/theme-editor";
import { FavoritesDrawer } from "@/components/shop/favorites-drawer";
import { Toaster } from "sonner";

// Optimización de fuentes con display swap
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Evita FOIT (Flash of Invisible Text)
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Metadata SEO optimizado
export const metadata: Metadata = {
  title: {
    default: "MenúDigital - Pedidos Online de Restaurante",
    template: "%s | MenúDigital", // Para páginas individuales
  },
  description:
    "Haz tus pedidos online de forma rápida y sencilla. Descubre nuestro menú, promociones especiales y recibe tu comida favorita en minutos.",
  keywords: [
    "restaurante",
    "comida a domicilio",
    "pedidos online",
    "menú digital",
    "delivery",
    "comida rápida",
  ],
  authors: [{ name: "Tu Nombre o Empresa" }],
  creator: "MenúDigital",
  publisher: "MenúDigital",

  // Open Graph para redes sociales
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://tudominio.com",
    title: "MenúDigital - Pedidos Online de Restaurante",
    description:
      "Descubre nuestro menú y haz tus pedidos online de forma rápida y sencilla.",
    siteName: "MenúDigital",
    images: [
      {
        url: "/og-image.jpg", // 1200x630px recomendado
        width: 1200,
        height: 630,
        alt: "MenúDigital - Restaurante",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "MenúDigital - Pedidos Online",
    description: "Haz tus pedidos online de forma rápida y sencilla",
    images: ["/twitter-image.jpg"],
    creator: "@tuhandle",
  },

  // PWA Manifest
  manifest: "/manifest.json",

  // App móvil
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MenúDigital",
  },

  // Verificaciones
  verification: {
    google: "tu-codigo-de-verificacion-google",
    // yandex: "codigo-yandex",
    // bing: "codigo-bing",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Iconos
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preconnect para optimizar carga de recursos externos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS Prefetch para servicios externos */}
        <link rel="dns-prefetch" href="https://wa.me" />

        {/* Structured Data para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "MenúDigital",
              description: "Restaurante con pedidos online",
              url: "https://tudominio.com",
              telephone: "+573000000000",
              servesCuisine: "Colombiana",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Tu dirección",
                addressLocality: "Tu ciudad",
                addressRegion: "Tu departamento",
                postalCode: "000000",
                addressCountry: "CO",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "08:00",
                  closes: "22:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Saturday", "Sunday"],
                  opens: "09:00",
                  closes: "23:00",
                },
              ],
            }),
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        {/* Skip to main content para accesibilidad */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
        >
          Saltar al contenido principal
        </a>

        <ThemeWrapper>
          <main id="main-content" className="flex-1">
            {children}
          </main>

          {/* Widgets globales - lazy loaded para mejor performance */}
          <WhatsAppWidget
            phoneNumber="573000000000"
            businessName="MenúDigital"
            workingHours={{
              start: "08:00",
              end: "22:00",
            }}
          />

          <FavoritesDrawer />
          <CartDrawer />
          <Toaster position="top-center" richColors closeButton />

          {/* ThemeEditor solo en desarrollo */}
          {process.env.NODE_ENV === "development" && <ThemeEditor />}
        </ThemeWrapper>

      </body>
    </html>
  );
}
