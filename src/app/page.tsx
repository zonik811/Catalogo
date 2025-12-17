"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { Product, LandingConfig, FAQ, Brand } from "@/types";
import { ArrowRight, Truck, Star, MessageCircle, DollarSign, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { ProductCard } from "@/components/shop/product-card";
import { useCartStore } from "@/lib/store/cart-store";

const DEFAULT_CONFIG: LandingConfig['config'] = {
  hero: {
    title: "Bienvenido a Nuestro Catálogo",
    subtitle: "Descubre productos increíbles con la mejor calidad y servicio",
    buttonText: "Ver Catálogo Completo"
  },
  features: [
    { title: "Envío Rápido", description: "Entrega en 24-48 hrs", icon: "Truck" },
    { title: "Calidad Premium", description: "Productos garantizados", icon: "Star" },
    { title: "Soporte 24/7", description: "Siempre disponibles", icon: "MessageCircle" },
    { title: "Mejores Precios", description: "Ofertas increíbles", icon: "DollarSign" }
  ],
  about: {
    title: "Quiénes Somos",
    description: "Somos una empresa comprometida con ofrecer los mejores productos y servicios a nuestros clientes.",
    mission: "Nuestra misión es transformar la experiencia de compra.",
    vision: "Ser líderes en el mercado digital."
  },
  products: {
    title: "Productos Destacados",
    subtitle: "Lo mejor de nuestro catálogo",
    count: 6
  },
  brands: {
    title: "Marcas que Confían en Nosotros",
    subtitle: ""
  },
  faq: {
    title: "Preguntas Frecuentes",
    subtitle: "Resolvemos tus dudas"
  },
  cta: {
    title: "¿Listo para explorar?",
    subtitle: "Descubre todos nuestros productos y encuentra lo que buscas",
    buttonText: "Explorar Catálogo Completo"
  },
  footer: {
    description: "Tu tienda online de confianza",
    copyright: "© 2025 Catálogo Digital. Todos los derechos reservados."
  },
  contact: {
    email: "",
    phone: "",
    address: ""
  }
};

export default function LandingPage() {
  const [config, setConfig] = useState<LandingConfig['config']>(DEFAULT_CONFIG);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [businessId] = useState(process.env.NEXT_PUBLIC_BUSINESS_ID || "");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    loadLandingData();
  }, []);

  const loadLandingData = async () => {
    try {
      // Load config
      const landingConfig = await api.landingConfig.get(businessId);
      if (landingConfig) {
        setConfig(landingConfig.config);
      }

      // Load products
      const productsResponse = await api.products.list(businessId);
      const count = landingConfig?.config.products.count || 6;
      setFeaturedProducts(productsResponse.documents.slice(0, count));

      // Load FAQs
      const faqsList = await api.faq.list(businessId);
      setFaqs(faqsList);

      // Load brands
      const brandsList = await api.brands.list(businessId);
      setBrands(brandsList);
    } catch (error) {
      console.error("Error loading landing data:", error);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: any = { Truck, Star, MessageCircle, DollarSign };
    return icons[iconName] || Star;
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <LandingNavbar />

      {/* Hero Section */}
      <section id="hero" className="relative text-white py-32 px-4 overflow-hidden" style={{
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
      }}>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-6"
          >
            {config.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto"
          >
            {config.hero.subtitle}
          </motion.p>
          <Link href="/shop">
            <Button size="lg" className="text-lg px-12 h-16 bg-white hover:bg-white/90" style={{ color: 'var(--primary)' }}>
              {config.hero.buttonText}
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
          {config.features.map((feature, i) => {
            const Icon = getIcon(feature.icon);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl shadow-lg text-center"
                style={{ background: 'var(--surface)' }}
              >
                <Icon className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--primary)' }} />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4" style={{ background: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{config.about.title}</h2>
          <p className="text-lg mb-6" style={{ color: 'var(--muted)' }}>{config.about.description}</p>
          {config.about.mission && (
            <p className="text-base mb-2"><strong>Misión:</strong> {config.about.mission}</p>
          )}
          {config.about.vision && (
            <p className="text-base"><strong>Visión:</strong> {config.about.vision}</p>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{config.products.title}</h2>
            {config.products.subtitle && (
              <p className="text-lg" style={{ color: 'var(--muted)' }}>{config.products.subtitle}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.$id} product={product} onAddToCart={addItem} />
            ))}
          </div>
          <div className="text-center">
            <Link href="/shop">
              <Button size="lg">
                Ver Todo el Catálogo
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brands - Animated Carousel */}
      {brands.length > 0 && (
        <section id="brands" className="py-16 px-4 overflow-hidden" style={{ background: 'var(--surface)' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">{config.brands.title}</h2>
            {config.brands.subtitle && (
              <p className="text-center mb-8" style={{ color: 'var(--muted)' }}>{config.brands.subtitle}</p>
            )}

            {/* Animated Marquee */}
            <div className="relative">
              <div className="flex gap-12 animate-marquee">
                {/* First set of brands */}
                {brands.map((brand) => (
                  <div
                    key={brand.$id}
                    className="flex-shrink-0 flex items-center justify-center p-6 rounded-lg transition-all hover:scale-110"
                    style={{ background: 'var(--background)' }}
                  >
                    {brand.url ? (
                      <a href={brand.url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-20 w-auto grayscale hover:grayscale-0 transition-all object-contain"
                        />
                      </a>
                    ) : (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-20 w-auto grayscale hover:grayscale-0 transition-all object-contain"
                      />
                    )}
                  </div>
                ))}

                {/* Duplicate for seamless loop */}
                {brands.map((brand) => (
                  <div
                    key={`${brand.$id}-duplicate`}
                    className="flex-shrink-0 flex items-center justify-center p-6 rounded-lg transition-all hover:scale-110"
                    style={{ background: 'var(--background)' }}
                  >
                    {brand.url ? (
                      <a href={brand.url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-20 w-auto grayscale hover:grayscale-0 transition-all object-contain"
                        />
                      </a>
                    ) : (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-20 w-auto grayscale hover:grayscale-0 transition-all object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section id="faq" className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{config.faq.title}</h2>
              {config.faq.subtitle && (
                <p className="text-lg" style={{ color: 'var(--muted)' }}>{config.faq.subtitle}</p>
              )}
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.$id} className="rounded-lg overflow-hidden" style={{ background: 'var(--surface)' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.$id ? null : faq.$id)}
                    className="w-full p-4 text-left flex justify-between items-center hover:opacity-80"
                  >
                    <span className="font-semibold">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === faq.$id ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === faq.$id && (
                    <div className="p-4 pt-0">
                      <p style={{ color: 'var(--muted)' }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-32 px-4 text-white" style={{
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
      }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6">{config.cta.title}</h2>
          <p className="text-xl mb-8">{config.cta.subtitle}</p>
          <Link href="/shop">
            <Button size="lg" className="text-lg px-12 h-16 bg-white hover:bg-white/90" style={{ color: 'var(--primary)' }}>
              {config.cta.buttonText}
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto text-center">
          {config.footer.description && (
            <p className="mb-4" style={{ color: 'var(--muted)' }}>{config.footer.description}</p>
          )}
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{config.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
