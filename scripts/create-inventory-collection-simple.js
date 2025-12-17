const sdk = require('node-appwrite');

const client = new sdk.Client();

// Usar datos directos del proyecto
const projectId = '6940300b0005ebab7eb6';
const databaseId = 'menu-digital-db';
const apiKey = process.argv[2]; // Solo necesitas pasar la API Key

if (!apiKey) {
    console.error("\n❌ Error: Falta la API Key");
    console.log("\nUsage: node create-inventory-collection-simple.js <API_KEY>");
    console.log("\nPara obtener tu API Key:");
    console.log("1. Ve a https://cloud.appwrite.io/console");
    console.log("2. Abre tu proyecto");
    console.log("3. Settings → API Keys → Create API Key");
    console.log("4. Nombre: 'Inventory Setup'");
    console.log("5. Scopes: Marca 'databases.write'");
    console.log("6. Copia la key y úsala aquí\n");
    process.exit(1);
}

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject(projectId)
    .setKey(apiKey);

const databases = new sdk.Databases(client);

async function createInventoryCollection() {
    console.log('🚀 Creando colección de inventario...\n');
    console.log(`📊 Project ID: ${projectId}`);
    console.log(`📊 Database ID: ${databaseId}\n`);

    try {
        // 1. Create Collection
        console.log('📦 Paso 1: Creando colección "inventory"...');
        const collection = await databases.createCollection(
            databaseId,
            'inventory',
            'Inventory'
        );
        console.log('✅ Colección creada exitosamente!\n');

        // 2. Create Attributes
        console.log('📝 Paso 2: Creando atributos...');

        // productId
        await databases.createStringAttribute(
            databaseId,
            'inventory',
            'productId',
            255,
            true // required
        );
        console.log('  ✓ productId (string, required)');

        // businessId
        await databases.createStringAttribute(
            databaseId,
            'inventory',
            'businessId',
            255,
            true // required
        );
        console.log('  ✓ businessId (string, required)');

        // currentStock
        await databases.createIntegerAttribute(
            databaseId,
            'inventory',
            'currentStock',
            true, // required
            0,    // min
            999999 // max
        );
        console.log('  ✓ currentStock (integer, required)');

        // minStock
        await databases.createIntegerAttribute(
            databaseId,
            'inventory',
            'minStock',
            true, // required
            0,    // min
            999  // max
        );
        console.log('  ✓ minStock (integer, required)');

        // maxStock (optional)
        await databases.createIntegerAttribute(
            databaseId,
            'inventory',
            'maxStock',
            false, // not required
            0,     // min
            999999 // max
        );
        console.log('  ✓ maxStock (integer, optional)');

        console.log('\n⏳ Esperando 3 segundos para que los atributos se procesen...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 3. Create Indexes
        console.log('🔍 Paso 3: Creando índices...');

        // Index for productId (unique)
        await databases.createIndex(
            databaseId,
            'inventory',
            'productId_unique',
            'key',
            ['productId'],
            ['ASC'],
            true // unique
        );
        console.log('  ✓ Índice único en productId');

        // Index for businessId
        await databases.createIndex(
            databaseId,
            'inventory',
            'businessId_index',
            'key',
            ['businessId'],
            ['ASC']
        );
        console.log('  ✓ Índice en businessId');

        console.log('\n✨ ¡Colección de inventario creada exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('   - Collection ID: inventory');
        console.log('   - Atributos: 5 (productId, businessId, currentStock, minStock, maxStock)');
        console.log('   - Índices: 2 (productId único, businessId)');
        console.log('\n💡 Próximo paso:');
        console.log('   Agrega esta variable a tu .env.local:');
        console.log('   NEXT_PUBLIC_APPWRITE_COLLECTION_INVENTORY=inventory\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.code === 409) {
            console.log('⚠️  La colección ya existe.');
        }
        process.exit(1);
    }
}

createInventoryCollection().catch(console.error);
