const sdk = require('node-appwrite');

const client = new sdk.Client();

const projectId = '6940300b0005ebab7eb6';
const databaseId = 'menu-digital-db';
const apiKey = process.argv[2];

if (!apiKey) {
    console.error("\n❌ Error: Falta la API Key");
    console.log("\nUsage: node get-business-id.js <API_KEY>\n");
    process.exit(1);
}

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject(projectId)
    .setKey(apiKey);

const databases = new sdk.Databases(client);

async function getBusinessId() {
    console.log('🔍 Obteniendo Business ID...\n');

    try {
        const response = await databases.listDocuments(
            databaseId,
            'businesses',
            []
        );

        if (response.documents.length === 0) {
            console.log('⚠️  No hay businesses en la base de datos');
            return;
        }

        console.log('✅ Businesses encontrados:\n');

        response.documents.forEach((business, index) => {
            console.log(`${index + 1}. ${business.name || 'Sin nombre'}`);
            console.log(`   ID: ${business.$id}`);
            console.log(`   Slug: ${business.slug || 'N/A'}`);
            console.log('');
        });

        console.log('💡 Copia el ID del negocio que quieras usar');
        console.log('   y agrégalo a tu .env.local como:');
        console.log('   NEXT_PUBLIC_BUSINESS_ID=<ID_COPIADO>\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

getBusinessId().catch(console.error);
