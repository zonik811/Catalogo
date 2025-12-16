import { ID, Query } from "appwrite";
import { databases, storage, appwriteConfig } from "@/lib/appwrite";
import { Product, Business, ThemeSettings } from "@/types";

export const api = {
    products: {
        list: async (businessId: string) => {
            return databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.products,
                [Query.equal('businessId', businessId)]
            );
        },
        get: async (id: string) => {
            return databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.products,
                id
            );
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
    }
};
