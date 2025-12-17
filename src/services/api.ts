import { ID, Query } from "appwrite";
import { databases, storage, appwriteConfig } from "@/lib/appwrite";
import { Product, Business, ThemeSettings, Discount, Inventory, LandingConfig, FAQ, Brand } from "@/types";

export const api = {
    products: {
        list: async (businessId: string) => {
            // Fetch products
            const productsResponse = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.products,
                [Query.equal('businessId', businessId)]
            );

            // Fetch discounts and inventory
            const [discountsResponse, inventoryResponse] = await Promise.all([
                databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.collections.discounts,
                    [Query.equal('businessId', businessId)]
                ),
                databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.collections.inventory,
                    [Query.equal('businessId', businessId)]
                )
            ]);

            const products = productsResponse.documents as unknown as Product[];
            const discounts = discountsResponse.documents as unknown as Discount[];
            const inventories = inventoryResponse.documents as unknown as Inventory[];

            // Merge discount and inventory data into products
            const productsWithData = products.map(product => {
                const discount = discounts.find(d => d.productId === product.$id);
                const inventory = inventories.find(inv => inv.productId === product.$id);

                let enrichedProduct = { ...product };

                // Add discount data if exists
                if (discount) {
                    enrichedProduct = {
                        ...enrichedProduct,
                        originalPrice: discount.originalPrice,
                        discountPercentage: discount.percentage,
                        price: discount.finalPrice,
                    };
                }

                // Add stock data if exists
                if (inventory) {
                    enrichedProduct = {
                        ...enrichedProduct,
                        stock: inventory.stock,
                    };
                }

                return enrichedProduct;
            });

            return {
                ...productsResponse,
                documents: productsWithData
            };
        },
        get: async (id: string) => {
            // Fetch product
            const product = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.products,
                id
            ) as unknown as Product;

            // Fetch discount for this product
            try {
                const discount = await api.discounts.getByProduct(id);

                if (discount) {
                    return {
                        ...product,
                        originalPrice: discount.originalPrice,
                        discountPercentage: discount.percentage,
                        price: discount.finalPrice,
                    };
                }
            } catch (error) {
                // No discount found, that's okay
                console.log('No discount for product:', id);
            }

            return product;
        },
        create: async (data: Omit<Product, '$id'>) => {
            return databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.products,
                ID.unique(),
                data
            );
        },
        update: async (id: string, data: Partial<Product>) => {
            return databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.products,
                id,
                data
            );
        },
        delete: async (id: string) => {
            return databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.products,
                id
            );
        },
        uploadImage: async (file: File) => {
            return storage.createFile(
                appwriteConfig.buckets.productImages,
                ID.unique(),
                file
            );
        },
        getImageView: (fileId: string) => {
            return storage.getFileView(
                appwriteConfig.buckets.productImages,
                fileId
            );
        }
    },
    business: {
        get: async (slug: string) => {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.businesses,
                [Query.equal('slug', slug)]
            );
            return response.documents[0] as unknown as Business;
        },
        getById: async (id: string) => {
            return databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.businesses,
                id
            ) as unknown as Promise<Business>;
        },
        getFirst: async () => {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.businesses,
                [Query.limit(1)]
            );
            return response.documents[0] as unknown as Business;
        },
        update: async (id: string, data: any) => {
            return databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.businesses,
                id,
                data
            );
        },
        getTheme: async (businessId: string) => {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.themeSettings,
                [Query.equal('businessId', businessId)]
            );
            return response.documents[0] as unknown as ThemeSettings;
        },
        createTheme: async (data: ThemeSettings) => {
            return databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.themeSettings,
                ID.unique(),
                data
            );
        },
        updateTheme: async (id: string, data: Partial<ThemeSettings>) => {
            return databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.themeSettings,
                id,
                data
            );
        },
        delete: async (id: string) => {
            return databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.discounts,
                id
            );
        }
    },
    inventory: {
        list: async (businessId: string) => {
            return databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.inventory,
                [Query.equal('businessId', businessId)]
            );
        },
        getByProduct: async (productId: string) => {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.inventory,
                [Query.equal('productId', productId)]
            );
            return response.documents[0] as unknown as Inventory | undefined;
        },
        get: async (id: string) => {
            return databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.inventory,
                id
            );
        },
        create: async (data: Omit<Inventory, '$id'>) => {
            return databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.inventory,
                ID.unique(),
                data
            );
        },
        update: async (id: string, data: Partial<Inventory>) => {
            return databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.inventory,
                id,
                data
            );
        },
        delete: async (id: string) => {
            return databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.inventory,
                id
            );
        }
    },

    // Discounts API (restored)
    discounts: {
        list: async (businessId: string) => {
            return databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.discounts,
                [Query.equal('businessId', businessId)]
            );
        },
        getByProduct: async (productId: string) => {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.discounts,
                [Query.equal('productId', productId)]
            );
            return response.documents[0] as unknown as Discount | undefined;
        },
        get: async (id: string) => {
            return databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.discounts,
                id
            );
        },
        create: async (data: Omit<Discount, '$id'>) => {
            return databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.discounts,
                ID.unique(),
                data
            );
        },
        update: async (id: string, data: Partial<Discount>) => {
            return databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.discounts,
                id,
                data
            );
        },
        delete: async (id: string) => {
            return databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.discounts,
                id
            );
        }
    },

    // Categories API (restored)
    categories: {
        list: async (businessId: string) => {
            return databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.categories,
                [Query.equal('businessId', businessId)]
            );
        },
        create: async (data: any) => {
            return databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.categories,
                ID.unique(),
                data
            );
        }
    },

    // ========================================
    // LANDING PAGE APIs
    // ========================================
    landingConfig: {
        get: async (businessId: string) => {
            const result = await databases.listDocuments(
                appwriteConfig.databaseId,
                'landing_config',
                [Query.equal('businessId', businessId)]
            );
            if (result.documents.length === 0) return undefined;

            const doc = result.documents[0] as any;
            return {
                ...doc,
                config: JSON.parse(doc.config)
            } as LandingConfig;
        },

        create: async (businessId: string, config: LandingConfig['config']) => {
            return await databases.createDocument(
                appwriteConfig.databaseId,
                'landing_config',
                ID.unique(),
                {
                    businessId,
                    config: JSON.stringify(config),
                    isActive: true,
                }
            );
        },

        update: async (docId: string, config: LandingConfig['config']) => {
            return await databases.updateDocument(
                appwriteConfig.databaseId,
                'landing_config',
                docId,
                {
                    config: JSON.stringify(config),
                }
            );
        },
    },

    faq: {
        list: async (businessId: string) => {
            const result = await databases.listDocuments(
                appwriteConfig.databaseId,
                'faq',
                [
                    Query.equal('businessId', businessId),
                    Query.equal('isActive', true),
                    Query.orderAsc('order')
                ]
            );
            return result.documents as unknown as FAQ[];
        },

        create: async (data: Omit<FAQ, '$id' | '$createdAt' | '$updatedAt'>) => {
            return await databases.createDocument(
                appwriteConfig.databaseId,
                'faq',
                ID.unique(),
                data
            );
        },

        update: async (id: string, data: Partial<FAQ>) => {
            return await databases.updateDocument(
                appwriteConfig.databaseId,
                'faq',
                id,
                data
            );
        },

        delete: async (id: string) => {
            return await databases.deleteDocument(
                appwriteConfig.databaseId,
                'faq',
                id
            );
        },
    },

    brands: {
        list: async (businessId: string) => {
            const result = await databases.listDocuments(
                appwriteConfig.databaseId,
                'brands',
                [
                    Query.equal('businessId', businessId),
                    Query.equal('isActive', true),
                    Query.orderAsc('order')
                ]
            );
            return result.documents as unknown as Brand[];
        },

        create: async (data: Omit<Brand, '$id' | '$createdAt' | '$updatedAt'>) => {
            return await databases.createDocument(
                appwriteConfig.databaseId,
                'brands',
                ID.unique(),
                data
            );
        },

        update: async (id: string, data: Partial<Brand>) => {
            return await databases.updateDocument(
                appwriteConfig.databaseId,
                'brands',
                id,
                data
            );
        },

        delete: async (id: string) => {
            return await databases.deleteDocument(
                appwriteConfig.databaseId,
                'brands',
                id
            );
        },
    },
};
