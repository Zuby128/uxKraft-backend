const { Sequelize } = require('sequelize-typescript');

async function runSeeders(sequelize) {
    // Seeder fonksiyonlarını import et
    const { seedCategories } = require('./dist/database/seeders/categories.seeder');
    const { seedVendors } = require('./dist/database/seeders/vendors.seeder');
    const { seedCustomers } = require('./dist/database/seeders/customers.seeder');
    const { seedItems } = require('./dist/database/seeders/items.seeder');
    const { seedVendorAddresses } = require('./dist/database/seeders/vendor-addresses.seeder');
    const { seedOrderItems } = require('./dist/database/seeders/order-items.seeder');
    const { seedOrderPlanning } = require('./dist/database/seeders/order-planning.seeder');
    const { seedOrderProduction } = require('./dist/database/seeders/order-production.seeder');
    const { seedOrderLogistics } = require('./dist/database/seeders/order-logistics.seeder');
    const { seedUploads } = require('./dist/database/seeders/uploads.seeder');

    console.log('🌱 Starting seeding...\n');

    try {
        await seedCategories(sequelize);
        await seedVendors(sequelize);
        await seedCustomers(sequelize);
        await seedItems(sequelize);
        await seedVendorAddresses(sequelize);
        await seedOrderItems(sequelize);
        await seedOrderPlanning(sequelize);
        await seedOrderProduction(sequelize);
        await seedOrderLogistics(sequelize);
        await seedUploads(sequelize);

        console.log('\n🎉 ✅ All seeders completed successfully!');
    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
        throw error;
    }
}

async function seed() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        console.error('DATABASE_URL not found');
        process.exit(1);
    }

    try {
        const url = new URL(databaseUrl);

        const sequelize = new Sequelize({
            dialect: 'postgres',
            host: url.hostname,
            port: parseInt(url.port, 10) || 5432,
            username: url.username,
            password: url.password,
            database: url.pathname.slice(1),
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
            logging: false,
        });

        // Import models from dist
        const models = [
            require('./dist/modules/categories/entities/item-category.entity').ItemCategory,
            require('./dist/modules/items/entities/item.entity').Item,
            require('./dist/modules/vendors/entities/vendor.entity').Vendor,
            require('./dist/modules/vendors/entities/vendor-address.entity').VendorAddress,
            require('./dist/modules/customers/entities/customer.entity').Customer,
            require('./dist/modules/order-items/entities/order-item.entity').OrderItem,
            require('./dist/modules/order-planning/entities/order-planning.entity').OrderPlanning,
            require('./dist/modules/order-production/entities/order-production.entity').OrderProduction,
            require('./dist/modules/order-logistics/entities/order-logistics.entity').OrderLogistics,
            require('./dist/modules/uploads/entities/upload.entity').Upload,
        ];

        sequelize.addModels(models);

        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        await runSeeders(sequelize);

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();