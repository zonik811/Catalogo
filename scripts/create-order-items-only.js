const sdk = require('node-appwrite');

const client = new sdk.Client();

// Usar datos directos del proyecto
const projectId = '6940300b0005ebab7eb6';
const databaseId = 'menu-digital-db';
const apiKey = process.argv[2]; // API Key como argumento

if (!apiKey) {
    console.error("\n❌ Error: Falta la API Key");
    console.log("\nUsage: node create-order-items-only.js <API_KEY>\n");
    process.exit(1);
}

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject(projectId)
    .setKey(apiKey);

const databases = new sdk.Databases(client);

async function createOrderItemsCollection() {
    console.log('🚀 Creando colección order_items...\n');
    console.log(`📊 Project ID: ${projectId}`);
    console.log(`📊 Database ID: ${databaseId}\n`);

    try {
        // ========================================
        // CREAR COLECCIÓN ORDER_ITEMS
        // ========================================
        console.log('📦 Paso 1: Creando colección "order_items"...');
        const orderItemsCollection = await databases.createCollection(
            databaseId,
            'order_items',
            'Order Items'
        );
        console.log('✅ Colección "order_items" creada!\n');

        // Atributos de order_items
        console.log('📝 Paso 2: Creando atributos para "order_items"...');

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
        console.log('🔍 Paso 3: Creando índices para "order_items"...');

        await databases.createIndex(databaseId, 'order_items', 'orderId_index', 'key', ['orderId'], ['ASC']);
        console.log('  ✓ Índice en orderId');

        await databases.createIndex(databaseId, 'order_items', 'productId_index', 'key', ['productId'], ['ASC']);
        console.log('  ✓ Índice en productId');

        await databases.createIndex(databaseId, 'order_items', 'businessId_index', 'key', ['businessId'], ['ASC']);
        console.log('  ✓ Índice en businessId');

        console.log('\n✨ ¡Colección order_items creada exitosamente!');
        console.log('\n📋 Colección creada:');
        console.log('   - order_items (7 atributos, 3 índices)');
        console.log('\n💡 Ahora ya tienes ambas colecciones (orders + order_items)\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.code === 409) {
            console.log('⚠️  La colección order_items ya existe.');
        }
        process.exit(1);
    }
}

createOrderItemsCollection().catch(console.error);
