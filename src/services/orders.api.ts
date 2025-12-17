import { ID, Query } from "appwrite";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Order, OrderItem, CreateOrderData, OrderStats } from "@/types";

// Orders API - Temporary file for development
// This will be integrated into api.ts once tested

export const ordersApi = {
    /**
     * Create new order with automatic stock validation and decrement
     */
    create: async (data: CreateOrderData): Promise<Order> => {
        const { businessId, items, total, itemsCount, customerName, customerPhone } = data;

        // 1. VALIDATE STOCK FOR ALL ITEMS
        console.log('🔍 Validating stock for all items...');
        for (const item of items) {
            // Get inventory for product
            const inventoryResponse = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.inventory,
                [Query.equal('productId', item.productId)]
            );

            const inventory = inventoryResponse.documents[0];

            if (!inventory) {
                throw {
                    code: 'NO_INVENTORY_RECORD',
                    message: `No hay registro de inventario para ${item.productName}`,
                    product: item.productName,
                };
            }

            if ((inventory as any).stock < item.quantity) {
                throw {
                    code: 'INSUFFICIENT_STOCK',
                    message: `Stock insuficiente para ${item.productName}`,
                    product: item.productName,
                    available: (inventory as any).stock,
                    requested: item.quantity,
                };
            }
        }

        // 2. GENERATE ORDER NUMBER
        const ordersList = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.collections.orders,
            [
                Query.equal('businessId', businessId),
                Query.orderDesc('$createdAt'),
                Query.limit(1)
            ]
        );

        let orderNumber = 'ORD-001';
        if (ordersList.documents.length > 0) {
            const lastOrder = ordersList.documents[0] as unknown as Order;
            const lastNumber = parseInt(lastOrder.orderNumber.split('-')[1]);
            orderNumber = `ORD-${String(lastNumber + 1).padStart(3, '0')}`;
        }

        // 3. CREATE ORDER
        console.log('📝 Creating order:', orderNumber);
        const order = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.orders,
            ID.unique(),
            {
                businessId,
                orderNumber,
                customerName: customerName || undefined,
                customerPhone: customerPhone || undefined,
                total,
                itemsCount,
                status: 'pending',
            }
        );

        // 4. CREATE ORDER ITEMS + DECREMENT STOCK
        console.log('📦 Creating order items and decrementing stock...');
        for (const item of items) {
            // Create order item
            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.orderItems,
                ID.unique(),
                {
                    orderId: order.$id,
                    businessId,
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: item.subtotal,
                }
            );

            // Decrement stock
            const inventoryResponse = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.inventory,
                [Query.equal('productId', item.productId)]
            );

            const inventory = inventoryResponse.documents[0];
            if (inventory) {
                const currentStock = (inventory as any).stock;
                await databases.updateDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.collections.inventory,
                    inventory.$id,
                    {
                        stock: currentStock - item.quantity,
                    }
                );
                console.log(`  ✓ ${item.productName}: ${currentStock} → ${currentStock - item.quantity}`);
            }
        }

        console.log('✅ Order created successfully:', order.orderNumber);
        return order as unknown as Order;
    },

    /**
     * List orders for a business
     */
    list: async (businessId: string, limit = 100): Promise<Order[]> => {
        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.collections.orders,
            [
                Query.equal('businessId', businessId),
                Query.orderDesc('$createdAt'),
                Query.limit(limit)
            ]
        );
        return result.documents as unknown as Order[];
    },

    /**
     * Get single order by ID
     */
    get: async (orderId: string): Promise<Order> => {
        return databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.orders,
            orderId
        ) as unknown as Promise<Order>;
    },

    /**
     * Get order items for an order
     */
    getItems: async (orderId: string): Promise<OrderItem[]> => {
        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.collections.orderItems,
            [
                Query.equal('orderId', orderId),
                Query.limit(100)
            ]
        );
        return result.documents as unknown as OrderItem[];
    },

    /**
     * Get order statistics for dashboard
     */
    getStats: async (businessId: string): Promise<OrderStats> => {
        // Get all orders
        const allOrders = await ordersApi.list(businessId, 1000);

        // Calculate total stats
        const totalOrders = allOrders.length;
        const totalRevenue = allOrders.reduce((sum: number, order: Order) => sum + order.total, 0);

        // Calculate today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = allOrders.filter((order: Order) => {
            const orderDate = new Date(order.$createdAt);
            return orderDate >= today;
        });
        const todayRevenue = todayOrders.reduce((sum: number, order: Order) => sum + order.total, 0);

        // Get all order items
        const allItems = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.collections.orderItems,
            [
                Query.equal('businessId', businessId),
                Query.limit(10000)
            ]
        );

        // Calculate top products
        const productStats = new Map<string, {
            productId: string;
            productName: string;
            totalQuantity: number;
            totalRevenue: number;
        }>();

        (allItems.documents as unknown as OrderItem[]).forEach((item: OrderItem) => {
            const existing = productStats.get(item.productId);
            if (existing) {
                existing.totalQuantity += item.quantity;
                existing.totalRevenue += item.subtotal;
            } else {
                productStats.set(item.productId, {
                    productId: item.productId,
                    productName: item.productName,
                    totalQuantity: item.quantity,
                    totalRevenue: item.subtotal,
                });
            }
        });

        const topProducts = Array.from(productStats.values())
            .sort((a, b) => b.totalQuantity - a.totalQuantity)
            .slice(0, 5);

        return {
            totalOrders,
            totalRevenue,
            todayOrders: todayOrders.length,
            todayRevenue,
            topProducts,
        };
    },
};
