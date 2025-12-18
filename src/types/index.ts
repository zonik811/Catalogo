// Extended theme settings interface
export interface ThemeSettings {
    $id?: string;
    businessId?: string;

    // Colores Base
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    surfaceColor: string;
    textColor: string;
    mutedColor: string;

    // Formas y Radios
    borderRadius: string;
    buttonRadius: string;
    cardRadius: string;

    // Estilos de Componentes
    buttonStyle: 'solid' | 'outline' | 'ghost';
    buttonSize: 'sm' | 'md' | 'lg';
    cardStyle: 'elevated' | 'outlined' | 'filled';
    badgeStyle: 'solid' | 'outline' | 'subtle';

    // Sombras
    shadowIntensity: 'none' | 'subtle' | 'medium' | 'strong';

    // Legacy campos (mantener compatibilidad)
    fontFamily?: string;
}

// 5 Paletas Predefinidas Profesionales
export const THEME_PRESETS = {
    vibrant: {
        name: "Vibrant",
        description: "Colores vibrantes y energéticos",
        theme: {
            primaryColor: "#FF6B6B",
            secondaryColor: "#4ECDC4",
            accentColor: "#FFE66D",
            backgroundColor: "#FFFFFF",
            surfaceColor: "#F8F9FA",
            textColor: "#2C3E50",
            mutedColor: "#6C757D",
            borderRadius: "0.5rem",
            buttonRadius: "0.5rem",
            cardRadius: "0.75rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "solid" as const,
            shadowIntensity: "medium" as const,
        }
    },
    dark: {
        name: "Dark Mode",
        description: "Elegante tema oscuro",
        theme: {
            primaryColor: "#3B82F6",
            secondaryColor: "#8B5CF6",
            accentColor: "#10B981",
            backgroundColor: "#0F172A",
            surfaceColor: "#1E293B",
            textColor: "#F1F5F9",
            mutedColor: "#94A3B8",
            borderRadius: "0.5rem",
            buttonRadius: "0.5rem",
            cardRadius: "0.75rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "filled" as const,
            badgeStyle: "subtle" as const,
            shadowIntensity: "strong" as const,
        }
    },
    minimal: {
        name: "Minimal",
        description: "Diseño limpio y minimalista",
        theme: {
            primaryColor: "#000000",
            secondaryColor: "#6B7280",
            accentColor: "#3B82F6",
            backgroundColor: "#FFFFFF",
            surfaceColor: "#FAFAFA",
            textColor: "#111827",
            mutedColor: "#9CA3AF",
            borderRadius: "0.25rem",
            buttonRadius: "0.25rem",
            cardRadius: "0.5rem",
            buttonStyle: "outline" as const,
            buttonSize: "md" as const,
            cardStyle: "outlined" as const,
            badgeStyle: "outline" as const,
            shadowIntensity: "subtle" as const,
        }
    },
    nature: {
        name: "Nature",
        description: "Inspirado en la naturaleza",
        theme: {
            primaryColor: "#10B981",
            secondaryColor: "#059669",
            accentColor: "#F59E0B",
            backgroundColor: "#F0FDF4",
            surfaceColor: "#FFFFFF",
            textColor: "#064E3B",
            mutedColor: "#6B7280",
            borderRadius: "1rem",
            buttonRadius: "9999px",
            cardRadius: "1rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "subtle" as const,
            shadowIntensity: "subtle" as const,
        }
    },
    sunset: {
        name: "Sunset",
        description: "Cálidos tonos de atardecer",
        theme: {
            primaryColor: "#F59E0B",
            secondaryColor: "#EF4444",
            accentColor: "#EC4899",
            backgroundColor: "#FFF7ED",
            surfaceColor: "#FFFFFF",
            textColor: "#78350F",
            mutedColor: "#92400E",
            borderRadius: "0.75rem",
            buttonRadius: "0.75rem",
            cardRadius: "1rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "solid" as const,
            shadowIntensity: "medium" as const,
        }
    },
    // ========== 10 NUEVAS PALETAS PROFESIONALES ==========
    medicalBlue: {
        name: "Medical Blue",
        description: "Profesional y confiable para sector salud",
        theme: {
            primaryColor: "#0284C7",
            secondaryColor: "#0EA5E9",
            accentColor: "#06B6D4",
            backgroundColor: "#F0F9FF",
            surfaceColor: "#FFFFFF",
            textColor: "#0C4A6E",
            mutedColor: "#64748B",
            borderRadius: "0.5rem",
            buttonRadius: "0.5rem",
            cardRadius: "0.75rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "solid" as const,
            shadowIntensity: "medium" as const,
        }
    },
    corporatePro: {
        name: "Corporate Pro",
        description: "Formal y profesional para empresas",
        theme: {
            primaryColor: "#1E40AF",
            secondaryColor: "#3B82F6",
            accentColor: "#60A5FA",
            backgroundColor: "#F8FAFC",
            surfaceColor: "#FFFFFF",
            textColor: "#1E293B",
            mutedColor: "#64748B",
            borderRadius: "0.375rem",
            buttonRadius: "0.375rem",
            cardRadius: "0.5rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "outlined" as const,
            badgeStyle: "subtle" as const,
            shadowIntensity: "subtle" as const,
        }
    },
    luxuryGold: {
        name: "Luxury Gold",
        description: "Elegante y premium con toques dorados",
        theme: {
            primaryColor: "#D97706",
            secondaryColor: "#B45309",
            accentColor: "#F59E0B",
            backgroundColor: "#FFFBEB",
            surfaceColor: "#FFFFFF",
            textColor: "#78350F",
            mutedColor: "#A16207",
            borderRadius: "0.75rem",
            buttonRadius: "0.75rem",
            cardRadius: "1rem",
            buttonStyle: "solid" as const,
            buttonSize: "lg" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "solid" as const,
            shadowIntensity: "strong" as const,
        }
    },
    oceanFresh: {
        name: "Ocean Fresh",
        description: "Colores frescos y marinos",
        theme: {
            primaryColor: "#0891B2",
            secondaryColor: "#06B6D4",
            accentColor: "#67E8F9",
            backgroundColor: "#ECFEFF",
            surfaceColor: "#FFFFFF",
            textColor: "#164E63",
            mutedColor: "#0E7490",
            borderRadius: "1rem",
            buttonRadius: "9999px",
            cardRadius: "1.5rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "subtle" as const,
            shadowIntensity: "medium" as const,
        }
    },
    forestGreen: {
        name: "Forest Green",
        description: "Verde natural y relajante",
        theme: {
            primaryColor: "#15803D",
            secondaryColor: "#16A34A",
            accentColor: "#22C55E",
            backgroundColor: "#F0FDF4",
            surfaceColor: "#FFFFFF",
            textColor: "#14532D",
            mutedColor: "#4B5563",
            borderRadius: "0.75rem",
            buttonRadius: "0.75rem",
            cardRadius: "1rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "filled" as const,
            badgeStyle: "solid" as const,
            shadowIntensity: "subtle" as const,
        }
    },
    cherryBlossom: {
        name: "Cherry Blossom",
        description: "Suaves tonos rosados y románticos",
        theme: {
            primaryColor: "#EC4899",
            secondaryColor: "#F472B6",
            accentColor: "#FBCFE8",
            backgroundColor: "#FDF2F8",
            surfaceColor: "#FFFFFF",
            textColor: "#831843",
            mutedColor: "#9F1239",
            borderRadius: "1rem",
            buttonRadius: "9999px",
            cardRadius: "1.25rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "subtle" as const,
            shadowIntensity: "medium" as const,
        }
    },
    lavenderDreams: {
        name: "Lavender Dreams",
        description: "Paleta morada suave y elegante",
        theme: {
            primaryColor: "#7C3AED",
            secondaryColor: "#8B5CF6",
            accentColor: "#A78BFA",
            backgroundColor: "#FAF5FF",
            surfaceColor: "#FFFFFF",
            textColor: "#4C1D95",
            mutedColor: "#6D28D9",
            borderRadius: "0.75rem",
            buttonRadius: "0.75rem",
            cardRadius: "1rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "subtle" as const,
            shadowIntensity: "medium" as const,
        }
    },
    monochrome: {
        name: "Monochrome",
        description: "Clásico blanco y negro minimalista",
        theme: {
            primaryColor: "#18181B",
            secondaryColor: "#27272A",
            accentColor: "#52525B",
            backgroundColor: "#FFFFFF",
            surfaceColor: "#FAFAFA",
            textColor: "#09090B",
            mutedColor: "#71717A",
            borderRadius: "0rem",
            buttonRadius: "0rem",
            cardRadius: "0rem",
            buttonStyle: "outline" as const,
            buttonSize: "md" as const,
            cardStyle: "outlined" as const,
            badgeStyle: "outline" as const,
            shadowIntensity: "none" as const,
        }
    },
    neonNight: {
        name: "Neon Night",
        description: "Vibrante y futurista estilo neón",
        theme: {
            primaryColor: "#A855F7",
            secondaryColor: "#EC4899",
            accentColor: "#F472B6",
            backgroundColor: "#18181B",
            surfaceColor: "#27272A",
            textColor: "#FAFAFA",
            mutedColor: "#A1A1AA",
            borderRadius: "0.5rem",
            buttonRadius: "0.5rem",
            cardRadius: "0.75rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "filled" as const,
            badgeStyle: "solid" as const,
            shadowIntensity: "strong" as const,
        }
    },
    warmEarth: {
        name: "Warm Earth",
        description: "Tonos tierra cálidos y acogedores",
        theme: {
            primaryColor: "#92400E",
            secondaryColor: "#B45309",
            accentColor: "#D97706",
            backgroundColor: "#FEF3C7",
            surfaceColor: "#FFFBEB",
            textColor: "#451A03",
            mutedColor: "#78350F",
            borderRadius: "0.75rem",
            buttonRadius: "0.75rem",
            cardRadius: "1rem",
            buttonStyle: "solid" as const,
            buttonSize: "md" as const,
            cardStyle: "elevated" as const,
            badgeStyle: "subtle" as const,
            shadowIntensity: "medium" as const,
        }
    }
} as const;

export const DEFAULT_THEME: ThemeSettings = THEME_PRESETS.vibrant.theme;

// Otros tipos existentes
export interface Business {
    $id: string;
    name: string;
    slug: string;
    whatsapp?: string;
    logoUrl?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    taxRate?: number;
    shippingCost?: number;
    description?: string;
    isActive: boolean;
    ownerId: string;
}

export interface Category {
    $id: string;
    businessId: string;
    name: string;
    faqs: { question: string; answer: string }[];
}

export interface Product {
    $id: string;
    businessId: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: string;
    isAvailable: boolean;
    originalPrice?: number;
    discountPercentage?: number;
    stock?: number; // Merged from inventory collection
}

export interface Discount {
    $id: string;
    businessId: string;
    productId: string;
    originalPrice: number;
    percentage: number;
    finalPrice: number;
}

export interface Inventory {
    $id: string;
    businessId: string;
    productId: string;
    stock: number;
    minStock?: number;
    maxStock?: number;
}

export interface Order {
    $id: string;
    businessId: string;
    orderNumber: string;
    customerName?: string;
    customerPhone?: string;
    total: number;
    itemsCount: number;
    status: 'pending' | 'completed' | 'cancelled';
    $createdAt: string;
    $updatedAt: string;
}

export interface OrderItem {
    $id: string;
    orderId: string;
    businessId: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    $createdAt: string;
}

export interface CreateOrderData {
    businessId: string;
    customerName?: string;
    customerPhone?: string;
    items: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
    }[];
    total: number;
    itemsCount: number;
}

export interface OrderStats {
    totalOrders: number;
    totalRevenue: number;
    todayOrders: number;
    todayRevenue: number;
    topProducts: {
        productId: string;
        productName: string;
        totalQuantity: number;
        totalRevenue: number;
    }[];
}

// ========================================
// LANDING PAGE TYPES
// ========================================

export interface LandingConfig {
    $id: string;
    businessId: string;
    config: {
        // Hero Section
        hero: {
            title: string;
            subtitle: string;
            buttonText: string;
        };

        // Features Section
        features: {
            title: string;
            description: string;
            icon: string;  // lucide icon name
        }[];

        // About Section
        about: {
            title: string;
            description: string;
            mission?: string;
            vision?: string;
            yearsExperience?: number;
        };

        // Featured Products Section
        products: {
            title: string;
            subtitle?: string;
            count: number;
        };

        // Brands Section
        brands: {
            title: string;
            subtitle?: string;
        };

        // FAQ Section
        faq: {
            title: string;
            subtitle?: string;
        };

        // CTA Section
        cta: {
            title: string;
            subtitle: string;
            buttonText: string;
        };

        // Footer
        footer: {
            description?: string;
            copyright: string;
        };

        // Contact Info
        contact: {
            email?: string;
            phone?: string;
            address?: string;
        };

        // Social Media & Schedule
        social?: {
            facebook?: string;
            instagram?: string;
            twitter?: string;
            tiktok?: string;
            youtube?: string;
            schedule?: {
                monday?: string;
                tuesday?: string;
                wednesday?: string;
                thursday?: string;
                friday?: string;
                saturday?: string;
                sunday?: string;
            };
        };
    };
    isActive: boolean;
    $createdAt: string;
    $updatedAt: string;
}

export interface FAQ {
    $id: string;
    businessId: string;
    question: string;
    answer: string;
    order: number;
    isActive: boolean;
    $createdAt: string;
    $updatedAt: string;
}

export interface Brand {
    $id: string;
    businessId: string;
    name: string;
    logo: string;  // URL
    url?: string;
    order: number;
    isActive: boolean;
    $createdAt: string;
    $updatedAt: string;
}
