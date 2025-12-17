const sdk = require('node-appwrite');

const client = new sdk.Client();

// Usar datos directos del proyecto
const projectId = '6940300b0005ebab7eb6';
const databaseId = 'menu-digital-db';
const apiKey = process.argv[2]; // API Key como argumento

if (!apiKey) {
    console.error("\n❌ Error: Falta la API Key");
    console.log("\nUsage: node add-status-to-orders.js <API_KEY>\n");
    process.exit(1);
}

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject(projectId)
    .setKey(apiKey);

const databases = new sdk.Databases(client);

async function addStatusAttribute() {
    console.log('🚀 Agregando atributo "status" a la colección orders...\n');
    console.log(`📊 Project ID: ${projectId}`);
    console.log(`📊 Database ID: ${databaseId}\n`);

    try {
        console.log('📝 Creando atributo "status" (enum)...');

        await databases.createEnumAttribute(
            databaseId,
            'orders',
            'status',
            ['pending', 'completed', 'cancelled'],
            false,  // opcional (para poder tener default)
            'pending'  // default value
        );

        console.log('✅ Atributo "status" agregado exitosamente!');
        console.log('\n💡 Valores posibles: pending, completed, cancelled');
        console.log('   Default: pending\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.code === 409) {
            console.log('⚠️  El atributo "status" ya existe.');
        }
        process.exit(1);
    }
}

addStatusAttribute().catch(console.error);
