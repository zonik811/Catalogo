const sdk = require('node-appwrite');

const client = new sdk.Client();

// Usar datos directos del proyecto
const projectId = '6940300b0005ebab7eb6';
const databaseId = 'menu-digital-db';
const apiKey = process.argv[2]; // API Key como argumento

if (!apiKey) {
    console.error("\n❌ Error: Falta la API Key");
    console.log("\nUsage: node create-orders-collections.js <API_KEY>\n");
    process.exit(1);
}

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject(projectId)
    .setKey(apiKey);

const databases = new sdk.Databases(client);

async function createOrdersCollections() {
    console.log('🚀 Creando colecciones de órdenes...\n');
    console.log(`📊 Project ID: ${projectId}`);
    console.log(`📊 Database ID: ${databaseId}\n`);

    try {
        // ========================================
        // 1. CREAR COLECCIÓN ORDERS
        // ========================================
        console.log('📦 Paso 1: Creando colección "orders"...');
        const ordersCollection = await databases.createCollection(
            databaseId,
            'orders',
            'Orders'
        );
        console.log('✅ Colección "orders" creada!\n');

        // Atributos de orders
        console.log('📝 Paso 2: Creando atributos para "orders"...');

        await databases.createStringAttribute(databaseId, 'orders', 'businessId', 255, true);
        console.log('  ✓ businessId');

        await databases.createStringAttribute(databaseId, 'orders', 'orderNumber', 50, true);
        console.log('  ✓ orderNumber');

        await databases.createStringAttribute(databaseId, 'orders', 'customerName', 255, false);
        console.log('  ✓ customerName (opcional)');

        await databases.createStringAttribute(databaseId, 'orders', 'customerPhone', 50, false);
        console.log('  ✓ customerPhone (opcional)');

        await databases.createIntegerAttribute(databaseId, 'orders', 'total', true, 0, 99999999);
        console.log('  ✓ total');

        await databases.createIntegerAttribute(databaseId, 'orders', 'itemsCount', true, 0, 999);
        console.log('  ✓ itemsCount');

        await databases.createEnumAttribute(
            databaseId,
            'orders',
            'status',
            ['pending', 'completed', 'cancelled'],
            true,
            'pending'
        );
        console.log('  ✓ status (enum)');

        console.log('\n⏳ Esperando 3 segundos...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Índices de orders
        console.log('🔍 Paso 3: Creando índices para "orders"...');

        await databases.createIndex(databaseId, 'orders', 'businessId_index', 'key', ['businessId'], ['ASC']);
        console.log('  ✓ Índice en businessId');

        await databases.createIndex(databaseId, 'orders', 'orderNumber_unique', 'key', ['orderNumber'], ['ASC'], true);
        console.log('  ✓ Índice único en orderNumber');

        await databases.createIndex(databaseId, 'orders', 'createdAt_index', 'key', ['$createdAt'], ['DESC']);
        console.log('  ✓ Índice en $createdAt');

        // ========================================
        // 2. CREAR COLECCIÓN ORDER_ITEMS
        // ========================================
        console.log('\n📦 Paso 4: Creando colección "order_items"...');
        const orderItemsCollection = await databases.createCollection(
            databaseId,
            'order_items',
            'Order Items'
        );
        console.log('✅ Colección "order_items" creada!\n');

        // Atributos de order_items
        console.log('📝 Paso 5: Creando atributos para "order_items"...');

        await databases.createStringAttribute(databaseId, 'order_items', 'orderId', 255, true);
        console.log('  ✓ orderId');

        await databases.createStringAttribute(databaseId, 'order_items', 'businessId', 255, true);
        console.log('  ✓ businessId');

        await databases.createStringAttribute(databaseId, 'order_items', 'productId', 255, true);
        console.log('  ✓ productId');

        await databases.createStringAttribute(databaseId, 'order_items', 'productName', 255, true);
        console.log('  ✓ productName');

        await databases.createIntegerAttribute(databaseId, 'order_items', 'quantity', true, 1, 999);
        console.log('  ✓ quantity');

        await databases.createIntegerAttribute(databaseId, 'order_items', 'unitPrice', true, 0, 99999999);
        console.log('  ✓ unitPrice');

        await databases.createIntegerAttribute(databaseId, 'order_items', 'subtotal', true, 0, 99999999);
        console.log('  ✓ subtotal');

        console.log('\n⏳ Esperando 3 segundos...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Índices de order_items
        console.log('🔍 Paso 6: Creando índices para "order_items"...');

        await databases.createIndex(databaseId, 'order_items', 'orderId_index', 'key', ['orderId'], ['ASC']);
        console.log('  ✓ Índice en orderId');

        await databases.createIndex(databaseId, 'order_items', 'productId_index', 'key', ['productId'], ['ASC']);
        console.log('  ✓ Índice en productId');

        await databases.createIndex(databaseId, 'order_items', 'businessId_index', 'key', ['businessId'], ['ASC']);
        console.log('  ✓ Índice en businessId');

        console.log('\n✨ ¡Colecciones de órdenes creadas exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('   - Collection: orders (7 atributos, 3 índices)');
        console.log('   - Collection: order_items (7 atributos, 3 índices)');
        console.log('\n💡 Próximos pasos:');
        console.log('   1. Agregar a .env.local:');
        console.log('      NEXT_PUBLIC_APPWRITE_COLLECTION_ORDERS=orders');
        console.log('      NEXT_PUBLIC_APPWRITE_COLLECTION_ORDER_ITEMS=order_items');
        console.log('   2. Implementar API de orders');
        console.log('   3. Integrar con cart checkout\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.code === 409) {
            console.log('⚠️  Las colecciones ya existen.');
        }
        process.exit(1);
    }
}

createOrdersCollections().catch(console.error);
