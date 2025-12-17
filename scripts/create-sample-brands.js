const sdk = require('node-appwrite');

const client = new sdk.Client();

const projectId = '6940300b0005ebab7eb6';
const databaseId = 'menu-digital-db';
const apiKey = process.argv[2];
const businessId = '694062d100189a008a18';

if (!apiKey) {
    console.error("\n❌ Error: Falta la API Key");
    console.log("\nUsage: node create-sample-brands.js <API_KEY>\n");
    process.exit(1);
}

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject(projectId)
    .setKey(apiKey);

const databases = new sdk.Databases(client);
const { ID } = sdk;

async function createSampleBrands() {
    console.log('🏢 Creando marcas de ejemplo...\n');

    const sampleBrands = [
        {
            name: 'Nike',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
            url: 'https://www.nike.com',
            order: 1
        },
        {
            name: 'Adidas',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
            url: 'https://www.adidas.com',
            order: 2
        },
        {
            name: 'Apple',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
            url: 'https://www.apple.com',
            order: 3
        },
        {
            name: 'Samsung',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
            url: 'https://www.samsung.com',
            order: 4
        },
        {
            name: 'Coca-Cola',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg',
            url: 'https://www.coca-cola.com',
            order: 5
        },
        {
            name: 'Pepsi',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Pepsi_logo_2014.svg',
            url: 'https://www.pepsi.com',
            order: 6
        }
    ];

    try {
        for (const brand of sampleBrands) {
            const created = await databases.createDocument(
                databaseId,
                'brands',
                ID.unique(),
                {
                    businessId,
                    name: brand.name,
                    logo: brand.logo,
                    url: brand.url,
                    order: brand.order,
                    isActive: true
                }
            );
            console.log(`  ✓ ${brand.name} creada`);
        }

        console.log('\n✅ Marcas de ejemplo creadas exitosamente!');
        console.log('\n💡 Ahora recarga tu landing page y verás la sección de marcas animada\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

createSampleBrands().catch(console.error);
