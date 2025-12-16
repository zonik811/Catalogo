import { ID, Query } from "appwrite";
import { databases, storage, appwriteConfig } from "@/lib/appwrite";
import { Product, Business, ThemeSettings, Discount } from "@/types";

export const api = {
    products: {
        list: async (businessId: string) => {
            // Fetch products
            const productsResponse = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.products,
                [Query.equal('businessId', businessId)]
            );

            // Fetch discounts
            const discountsResponse = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.discounts,
                [Query.equal('businessId', businessId)]
            );

            const products = productsResponse.documents as unknown as Product[];
            const discounts = discountsResponse.documents as unknown as Discount[];

            // Merge discount data into products
            const productsWithDiscounts = products.map(product => {
                const discount = discounts.find(d => d.productId === product.$id);

                if (discount) {
                    return {
                        ...product,
                        originalPrice: discount.originalPrice,
                        discountPercentage: discount.percentage,
                        price: discount.finalPrice, // Override price with discounted price
                    };
                }

                return product;
            });

            return {
                ...productsResponse,
                documents: productsWithDiscounts
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
        }
    },
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
    }
};
