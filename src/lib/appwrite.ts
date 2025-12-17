import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const appwriteConfig = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'menu-digital-db',
    collections: {
        businesses: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BUSINESSES || 'businesses',
        products: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PRODUCTS || 'products',
        categories: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CATEGORIES || 'categories',
        themeSettings: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_THEME || 'themeSettings',
        discounts: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_DISCOUNTS || 'discounts',
        inventory: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_INVENTORY || 'inventory',
        orders: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ORDERS || 'orders',
        orderItems: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ORDER_ITEMS || 'order_items',
    },
    buckets: {
        productImages: 'product-images',
    }
};

export default client;
