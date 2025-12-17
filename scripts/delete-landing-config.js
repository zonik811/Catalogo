const sdk = require('node-appwrite');

const client = new sdk.Client();

const projectId = '6940300b0005ebab7eb6';
const databaseId = 'menu-digital-db';
const apiKey = process.argv[2];

if (!apiKey) {
    console.error("\n❌ Error: Falta la API Key");
    console.log("\nUsage: node delete-landing-config.js <API_KEY>\n");
    process.exit(1);
}

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject(projectId)
    .setKey(apiKey);

const databases = new sdk.Databases(client);

async function deleteLandingConfig() {
    console.log('🗑️  Eliminando collection landing_config incompleta...\n');

    try {
        await databases.deleteCollection(databaseId, 'landing_config');
        console.log('✅ Collection landing_config eliminada!');
        console.log('\n💡 Ahora puedes ejecutar create-landing-collections.js de nuevo\n');
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.code === 404) {
            console.log('⚠️  La collection landing_config no existe.');
        }
    }
}

deleteLandingConfig().catch(console.error);
