"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { Product, LandingConfig, FAQ, Brand } from "@/types";
import { ArrowRight, Truck, Star, MessageCircle, DollarSign, ChevronDown, ChevronLeft, ChevronRight, Phone, Mail, MapPin, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

// Sample testimonials (hardcoded for now)
const TESTIMONIALS = [
  {
    name: "María González",
    position: "Cliente Satisfecho",
    content: "Excelente servicio y productos de alta calidad. La entrega fue rápida y todo llegó en perfectas condiciones. Muy recomendado.",
    rating: 5
  },
  {
    name: "Carlos Rodríguez",
    position: "Empresa ABC",
    content: "Llevamos años trabajando con ellos y siempre nos brindan el mejor soporte. Los productos son exactamente lo que necesitamos.",
    rating: 5
  },
  {
    name: "Ana Martínez",
    position: "Consultorio Médico",
    content: "Profesionales y confiables. Los productos llegaron a tiempo y la asesoría personalizada fue excelente.",
    rating: 5
  }
];

interface Category {
  $id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function LandingPage() {
  // ✅ Estados corregidos y completos
  const [config, setConfig] = useState<LandingConfig['config']>(DEFAULT_CONFIG);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [businessId] = useState(process.env.NEXT_PUBLIC_BUSINESS_ID || "");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // ✅ Importar addItem del store
  const { addItem } = useCartStore();

  // ✅ useEffect para cargar datos
  useEffect(() => {
    loadLandingData();
  }, []);

  // ✅ Función para cargar datos de la API
  const loadLandingData = async () => {
    try {
      // Load config
      const landingConfig = await api.landingConfig.get(businessId);
      if (landingConfig) {
        setConfig(landingConfig.config);
      }

      // Load products
      const productsResponse = await api.products.list(businessId);
      const allProducts = productsResponse.documents;
      const count = landingConfig?.config.products.count || 6;
      setFeaturedProducts(allProducts.slice(0, count));

      // Load categories from API
      const categoriesResponse = await api.categories.list(businessId);
      const allCategories = categoriesResponse.documents || [];
      const firstCategories = allCategories.slice(0, 4);
      setCategories(firstCategories as any);

      // Group products by category
      const prodsByCat: Record<string, Product[]> = {};
      firstCategories.forEach((cat: any) => {
        const categoryProducts = allProducts.filter(
          (prod: Product) => prod.categoryId === cat.$id
        );
        prodsByCat[cat.$id] = categoryProducts.slice(0, 4);
      });
      setProductsByCategory(prodsByCat);

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

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const getIcon = (iconName: string) => {
    const icons: any = { Truck, Star, MessageCircle, DollarSign };
    return icons[iconName] || Star;
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <LandingNavbar />

      {/* Hero Section with Background */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 text-center text-white">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {config.hero.title}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {config.hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/shop">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8">
                {config.hero.buttonText}
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30" id="features">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por Qué Elegirnos?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {config.features.map((feature, index) => {
              const Icon = getIcon(feature.icon);
              return (
                <motion.div
                  key={index}
                  className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Icon className="text-primary" size={28} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-center text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
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

      {/* Categories Catalog Section */}
      <section className="py-20" id="catalog">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explora Nuestras Categorías
            </h2>
            <p className="text-muted-foreground">
              Encuentra lo que necesitas organizado por categorías
            </p>
          </div>

          <div className="space-y-16">
            {categories.map((category, catIndex) => (
              <motion.div
                key={category.$id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <h3 className="text-2xl font-bold mb-6 text-primary">
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {productsByCategory[category.$id]?.map((product) => (
                    <ProductCard
                      key={product.$id}
                      product={product}
                      onAddToCart={() => addItem(product)}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button size="lg" className="px-8">
                Ver Todo el Catálogo
                <ArrowRight className="ml-2" size={20} />
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
      <footer className="bg-card border-t">
        {/* Mini features */}
        <div className="border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Truck className="text-primary" size={32} />
                <div>
                  <p className="font-semibold">Envíos a Nivel Nacional</p>
                  <p className="text-sm text-muted-foreground">Despachamos a toda Colombia.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-primary" size={32} />
                <div>
                  <p className="font-semibold">Ubicación en Bogotá</p>
                  <p className="text-sm text-muted-foreground">Distribución desde Bogotá.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="text-primary" size={32} />
                <div>
                  <p className="font-semibold">Compra Segura en Línea</p>
                  <p className="text-sm text-muted-foreground">Transacciones protegidas.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="text-primary" size={32} />
                <div>
                  <p className="font-semibold">Asesoría y Cumplimiento</p>
                  <p className="text-sm text-muted-foreground">Calidad y soporte garantizado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-primary border-b-2 border-primary pb-2 inline-block">Nosotros</h3>
              <p className="text-sm text-muted-foreground mb-4 mt-4">
                {config.footer.description}
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                  <span className="text-white text-lg">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                  <span className="text-white text-lg">in</span>
                </a>
                <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                  <span className="text-white text-lg">W</span>
                </a>
              </div>
            </div>

            {/* Menu */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-primary border-b-2 border-primary pb-2 inline-block">Menú</h3>
              <ul className="space-y-2 text-sm mt-4">
                <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"><ChevronRight size={16} />Inicio</Link></li>
                <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"><ChevronRight size={16} />Equipos</Link></li>
                <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"><ChevronRight size={16} />Insumos</Link></li>
                <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"><ChevronRight size={16} />Ropa</Link></li>
                <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"><ChevronRight size={16} />EPP</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-primary border-b-2 border-primary pb-2 inline-block">Categorías</h3>
              <ul className="space-y-2 text-sm mt-4">
                {categories.slice(0, 5).map(cat => (
                  <li key={cat.$id}>
                    <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                      <ChevronRight size={16} />{cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-primary border-b-2 border-primary pb-2 inline-block">Suscríbete</h3>
              <p className="text-sm text-muted-foreground mb-4 mt-4">
                Déjanos tu correo y recibe información valiosa junto con las ofertas que tenemos
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm"
                />
                <Button size="icon" className="flex-shrink-0">
                  <Send size={18} />
                </Button>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input type="checkbox" id="newsletter-accept" className="rounded" />
                <label htmlFor="newsletter-accept" className="text-xs text-muted-foreground">
                  Acepto recibir correos
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            <p className="text-center text-sm text-muted-foreground">
              {config.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
