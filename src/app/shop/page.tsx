"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { api } from "@/services/api";
import { ProductCard } from "@/components/shop/product-card";
import { useCartStore } from "@/lib/store/cart-store";
import { useBusinessStore } from "@/lib/store/business-store";
import { Navbar } from "@/components/layout/navbar";
import {
  Loader2,
  RefreshCcw,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Obtener businessId de la URL, variable de entorno, o subdomain
const getBusinessId = (): string => {
  // Opción 1: De la URL query params (?business=xyz)
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const businessFromQuery = params.get("business");
    if (businessFromQuery) return businessFromQuery;
  }

  // Opción 2: De variable de entorno
  const businessFromEnv = process.env.NEXT_PUBLIC_BUSINESS_ID;
  if (businessFromEnv) return businessFromEnv;

  // Opción 3: De subdomain (abc.tudominio.com)
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const subdomain = hostname.split(".")[0];
    if (subdomain && subdomain !== "www" && subdomain !== "localhost") {
      return subdomain;
    }
  }

  // Fallback: Real ID
  return "694062d100189a008a18";
};

interface Category {
  $id: string;
  name: string;
  description?: string;
  icon?: string;
  businessId: string;
  order?: number;
}

interface BusinessInfo {
  $id: string;
  name: string;
  description?: string;
  logo?: string;
  primaryColor?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

const MOCK_PRODUCTS: Product[] = [
  {
    $id: "1",
    name: "Producto de ejemplo",
    description: "Este es un producto de demostración para tu catálogo",
    price: 100,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    categoryId: "general",
    isAvailable: true,
    businessId: "demo",
  },
  {
    $id: "2",
    name: "Otro producto",
    description: "Agrega tus productos desde el panel de administración",
    price: 50,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    categoryId: "general",
    isAvailable: true,
    businessId: "demo",
  },
];

export default function Home() {
  const { addItem } = useCartStore();
  const [businessId] = useState(getBusinessId());
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const heroRef = useRef(null);
  const productsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const productsInView = useInView(productsRef, { once: true, margin: "-100px" });

  // Cargar información del negocio
  const fetchBusinessInfo = async () => {
    try {
      let info: any = null;
      try {
        info = await api.business.get(businessId);
      } catch (e) {
        console.log("Negocio exacto no encontrado, buscando el primero disponible...");
      }

      if (!info) {
        try {
          info = await api.business.getFirst();
        } catch (e) {
          console.error("No se pudo obtener ningún negocio", e);
        }
      }

      if (info) {
        setBusinessInfo(info);
        // Actualizar store global
        useBusinessStore.getState().setBusiness(info);
      } else {
        throw new Error("Negocio no encontrado");
      }
    } catch (err) {
      console.error("Error cargando info del negocio:", err);
      // Fallback: Datos de prueba
      const fallbackBusiness = {
        $id: businessId,
        name: "Mi Catálogo (Demo)",
        whatsapp: "573001234567",
        heroTitle: "Catálogo Demo",
        heroSubtitle: "Configura tu negocio en Appwrite para cambiar esto",
        taxRate: 0.19,
        shippingCost: 5000,
        isActive: true,
        ownerId: "demo",
        slug: "demo"
      };

      setBusinessInfo(fallbackBusiness);
      useBusinessStore.getState().setBusiness(fallbackBusiness);
    }
  };

  // Cargar categorías del negocio
  const fetchCategories = async () => {
    try {
      // Fetch categories for the current business
      const response = await api.categories.list(businessId);
      setCategories(response.documents as unknown as Category[]);
    } catch (err) {
      console.error("Error cargando categorías:", err);
      // No fallback needed, empty is fine or let products logic fallback (removed)
    }
  };

  // Cargar productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(false);

      console.log(`🔄 Cargando catálogo del negocio: ${businessId}`);

      const response = await api.products.list(businessId);

      if (response && response.documents && response.documents.length > 0) {
        const products = response.documents as unknown as Product[];
        setProducts(products);
        console.log(`✅ ${products.length} productos cargados`);
        setError(false);
      } else {
        console.log("⚠️ No hay productos o respuesta vacía");
        setProducts([]);
      }
    } catch (err) {
      console.error("❌ Error al cargar productos:", err);
      // Fallback a empty
      setError(true);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Formatear nombre de categoría legible
  const formatCategoryName = (categoryId: string): string => {
    // Capitalizar primera letra y reemplazar guiones/underscores
    return categoryId
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Obtener emoji según categoría
  const getCategoryEmoji = (categoryId: string): string => {
    const emojiMap: Record<string, string> = {
      // Genéricos
      general: "📦",
      destacados: "⭐",
      ofertas: "🏷️",
      nuevo: "✨",

      // Restaurantes
      burgers: "🍔",
      pizza: "🍕",
      mexican: "🌮",
      salads: "🥗",
      sides: "🍟",
      drinks: "🥤",
      desserts: "🍰",
      breakfast: "🍳",

      // Retail
      electronics: "📱",
      clothing: "👕",
      shoes: "👟",
      accessories: "💍",
      home: "🏠",
      beauty: "💄",
      sports: "⚽",
      books: "📚",
      toys: "🧸",

      // Servicios
      services: "🛠️",
      consultancy: "💼",
      courses: "📖",
    };

    return emojiMap[categoryId.toLowerCase()] || "📦";
  };

  useEffect(() => {
    fetchBusinessInfo();
    fetchCategories();
    fetchProducts();
  }, [businessId]);

  // Filtrado de productos
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scrollToMenu = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navbar />

      {/* Hero Section - Genérico */}
      <motion.section
        ref={heroRef}
        className="relative text-white py-24 md:py-32 px-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 -bottom-1 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent pointer-events-none z-10" />

        <div className="max-w-6xl mx-auto relative z-20">
          <div className="text-center space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight"
            >
              {businessInfo?.heroTitle || "Nuestro Catálogo"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-white/90 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed"
            >
              {businessInfo?.heroSubtitle ||
                "Explora nuestra selección de productos y servicios"}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex justify-center pt-4"
            >
              <Button
                onClick={scrollToMenu}
                size="lg"
                className="text-lg px-12 h-16 shadow-2xl group relative overflow-hidden whitespace-nowrap"
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-button)'
                }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 font-bold">Ver Catálogo</span>
                <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Catálogo */}
      <main
        className="max-w-7xl mx-auto px-4 md:px-8 py-16 -mt-16 relative z-30"
        id="catalog"
      >
        {/* Barra de Búsqueda y Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl shadow-xl p-6 mb-12 border border-slate-200 dark:border-slate-800"
          style={{
            backgroundColor: 'var(--surface)',
            color: 'var(--text)'
          }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Búsqueda */}
            <div className="flex-1 w-full">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>
            </div>

            {/* Botón de filtros móvil */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full h-12"
            >
              <SlidersHorizontal size={20} className="mr-2" />
              Categorías
            </Button>
          </div>

          {/* Filtros de Categoría */}
          {categories.length > 0 && (
            <div className={`${showFilters ? "block" : "hidden"} lg:block mt-6`}>
              <div className="flex flex-wrap gap-2">
                {/* Botón "Todo" */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory("all")}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedCategory === "all"
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                >
                  <span className="mr-2">🔎</span>
                  Todo
                </motion.button>

                {/* Categorías dinámicas */}
                {categories.map((category) => (
                  <motion.button
                    key={category.$id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.$id)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedCategory === category.$id
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                  >
                    <span className="mr-2">{getCategoryEmoji(category.$id)}</span>
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Contador de resultados */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "producto" : "productos"}
              </span>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-primary hover:underline font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center py-32 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800"
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Cargando catálogo...
            </p>
          </motion.div>
        ) : (
          <>
            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                    <RefreshCcw
                      size={20}
                      className="text-amber-600 dark:text-amber-400"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-1">
                      Modo demostración
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                      No se pudieron cargar los productos. Mostrando catálogo de
                      ejemplo.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchProducts}
                      className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                    >
                      <RefreshCcw size={14} className="mr-2" />
                      Reintentar
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grid de Productos */}
            <motion.div
              ref={productsRef}
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.$id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} onAddToCart={addItem} />
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchQuery
                    ? `No hay resultados para "${searchQuery}"`
                    : "No hay productos en esta categoría"}
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Ver todo el catálogo
                </Button>
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Footer Genérico */}
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">
              {businessInfo?.name || "Catálogo Digital"}
            </h3>
            <p className="text-slate-400 mb-6">
              {businessInfo?.description || "Tu tienda online"}
            </p>
            <div className="flex justify-center gap-6 text-sm text-slate-400">
              <span>© 2025 Todos los derechos reservados</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
