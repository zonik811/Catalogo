const sdk = require('node-appwrite');

const client = new sdk.Client();

const projectId = '6940300b0005ebab7eb6';
const databaseId = 'menu-digital-db';
const apiKey = process.argv[2];

if (!apiKey) {
    console.error("\n❌ Error: Falta la API Key");
    console.log("\nUsage: node create-landing-collections.js <API_KEY>\n");
    process.exit(1);
}

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject(projectId)
    .setKey(apiKey);

const databases = new sdk.Databases(client);

async function createLandingCollections() {
    console.log('🚀 Creando collections para Landing Page (máxima simplificación)...\n');

    try {
        // ========================================
        // 1. LANDING_CONFIG (SOLO 3 CAMPOS)
        // ========================================
        console.log('📦 Paso 1: Creando collection "landing_config"...');
        await databases.createCollection(databaseId, 'landing_config', 'Landing Config');
        console.log('✅ Collection landing_config creada!\n');

        console.log('📝 Paso 2: Creando atributos para "landing_config"...');

        await databases.createStringAttribute(databaseId, 'landing_config', 'businessId', 255, true);
        console.log('  ✓ businessId');

        // TODO EN UN SOLO CAMPO JSON
        await databases.createStringAttribute(databaseId, 'landing_config', 'config', 50000, true);
        console.log('  ✓ config (JSON gigante con TODA la configuración)');

        await databases.createBooleanAttribute(databaseId, 'landing_config', 'isActive', false, true);
        console.log('  ✓ isActive');

        console.log('\n⏳ Esperando 3 segundos...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('🔍 Paso 3: Creando índices para "landing_config"...');
        await databases.createIndex(databaseId, 'landing_config', 'businessId_unique', 'unique', ['businessId'], ['ASC']);
        console.log('  ✓ Índice único en businessId');

        // ========================================
        // 2. FAQ
        // ========================================
        console.log('\n📦 Paso 4: Creando collection "faq"...');
        await databases.createCollection(databaseId, 'faq', 'FAQ');
        console.log('✅ Collection faq creada!\n');

        console.log('📝 Paso 5: Creando atributos para "faq"...');
        await databases.createStringAttribute(databaseId, 'faq', 'businessId', 255, true);
        await databases.createStringAttribute(databaseId, 'faq', 'question', 500, true);
        await databases.createStringAttribute(databaseId, 'faq', 'answer', 5000, true);
        await databases.createIntegerAttribute(databaseId, 'faq', 'order', false, 0, 999);
        await databases.createBooleanAttribute(databaseId, 'faq', 'isActive', false, true);
        console.log('  ✓ businessId, question, answer, order, isActive');

        console.log('\n⏳ Esperando 3 segundos...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('🔍 Paso 6: Creando índices para "faq"...');
        await databases.createIndex(databaseId, 'faq', 'businessId_index', 'key', ['businessId'], ['ASC']);
        console.log('  ✓ Índice en businessId');

        // ========================================
        // 3. BRANDS
        // ========================================
        console.log('\n📦 Paso 7: Creando collection "brands"...');
        await databases.createCollection(databaseId, 'brands', 'Brands');
        console.log('✅ Collection brands creada!\n');

        console.log('📝 Paso 8: Creando atributos para "brands"...');
        await databases.createStringAttribute(databaseId, 'brands', 'businessId', 255, true);
        await databases.createStringAttribute(databaseId, 'brands', 'name', 255, true);
        await databases.createStringAttribute(databaseId, 'brands', 'logo', 1000, true);
        await databases.createStringAttribute(databaseId, 'brands', 'url', 1000, false);
        await databases.createIntegerAttribute(databaseId, 'brands', 'order', false, 0, 999);
        await databases.createBooleanAttribute(databaseId, 'brands', 'isActive', false, true);
        console.log('  ✓ businessId, name, logo, url, order, isActive');

        console.log('\n⏳ Esperando 3 segundos...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('🔍 Paso 9: Creando índices para "brands"...');
        await databases.createIndex(databaseId, 'brands', 'businessId_index', 'key', ['businessId'], ['ASC']);
        console.log('  ✓ Índice en businessId');

        console.log('\n✨ ¡Collections creadas exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('   - landing_config (3 atributos: businessId, config JSON, isActive)');
        console.log('   - faq (5 atributos)');
        console.log('   - brands (6 atributos)');
        console.log('\n💡 landing_config.config contiene TODO en JSON:');
        console.log('   { hero: {}, features: [], about: {}, products: {}, ... }\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.code === 409) {
            console.log('⚠️  Alguna collection ya existe.');
        }
        process.exit(1);
    }
}

createLandingCollections().catch(console.error);
